import React, {Component} from "react";
import "./Index.less";
import {
    Table,
    Button,
    Card,
    Modal,
    Popconfirm,
    Badge,
    Pagination,
    message,
    LocaleProvider,
    Col,
    Select,
    Row,
    Input, DatePicker
} from "antd";
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import history from "../../common/History";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import {formatDateTime, getToken,baseUrl} from "../../../utils/filter";
import {ReceivablesList, confirmBills, getReceivableList, exportTableData, batchCollect, batchMoney} from "../../../api/financeApi";
import {connect} from "../../../utils/socket";
import FormTable from "./FormTable";
import {getCourses} from "../../../api/userCenterApi";
import {getDate, getTimeDistance} from "../../../utils/utils";

const Option = Select.Option;
const {RangePicker} = DatePicker;

let params = {
    size: 40,
    current: 1,
    ascs: [],
    descs: ['apply_time'],
    condition: {
        "business": "VIPCOURSE"
    }
};
export default class Receivables extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            dataAll: '',           //列表总数据
            dataSource: [],      //列表表单数据
            previewVisible: false,
            previewImage: '',
            disableBtn: false,
            resetBtn: false,
            searchValue: '',
            orderValue: '',
            batchIds: [], // 批量确认收款
            refundStatusList: [
                {key: 0, value: '未对账'},
                {key: 1, value: '已对账'}
            ],
            payTypeList: [
                {key: 0, value: '支付宝'},
                {key: 1, value: '微信'},
                {key: 2, value: '贷款'},
                {key: 3, value: '腾讯课堂'},
                {key: 4, value: '网易云课堂'},
                {key: 5, value: '信用卡分期'},
                {key: 6, value: '开课吧-工行'},
                {key: 7, value: '开课吧-支付宝'},
                {key: 8, value: '开课吧-微信'},
                {key: 9, value: '芝士分期'},
            ],
            payStatusList: [
                {key: 0, value: '全款'},
                {key: 1, value: '订金'},
                {key: 2, value: '尾款'},
                {key: 96, value: '折扣'},
                {key: 97, value: '优惠券'},
                {key: 98, value: '积分'},
                {key: 99, value: '其它'}
            ],
            courseList: [],
            payStatusValue: undefined,
            courseValue: undefined,
            payTypeValue: undefined,
            refundStatusValue: undefined,
            refundTimeValue: undefined,
            applyRefundTimeValue: undefined,
            selectedRowKeys: [],
            checkIds: [],
            ModalText: '',
            visible: false,
            confirmLoading: false
        };
    }

    // 课程下拉框
    getCourseList = () => {
        getCourses().then(res => {
            if (res.data.code === 0) {
                this.setState({
                    courseList: res.data.data
                })
            }
        })
    };

    componentDidMount() {
        params = {
            size: 40,
            current: 1,
            ascs: [],
            descs: ['apply_time'],
            condition: {
                "business": "VIPCOURSE"
            }
        };
        this.getCourseList();
        this.getRefundRecordListFn();
        //链接websocket
        connect(getToken('username'));
        //end
    };

    componentWillUnmount() {

    };

    //获取退款记录列表
    getRefundRecordListFn = () => {
        getReceivableList(params).then(res => {
            if (res.data.code == 0) {
                this.setState({
                    dataSource: res.data.data.records,
                    dataAll: res.data.data,
                    loading: false,
                    disableBtn: false,
                    resetBtn: false,
                    selectedRowKeys: []
                })
            }
        }).catch(err => {
            console.log(err)
            this.setState({
                loading: false,
            })
        })
    };
    cancelConfirmClick = () => {

    };
    //确认账单
    handleBill = (id) => {
        confirmBills(id).then(res => {
            if (res.data.code == 0) {
                message.success('确认成功');
                this.getRefundRecordListFn();
            } else {
                message.error('操作失败')
            }
        }).catch(err => {

        });
    };
    //预览付款凭证
    showImg = (id) => {
        this.setState({
            previewVisible: true,
            previewImage: id
        })
    };
    // 预览取消
    handleCancel = () => {
        this.setState({
            previewVisible: false,
        });
    };

    // 申请退款时间筛选
    selectDate = (type, index) => {
        this.setState({
            applyRefundTimeValue: getTimeDistance(type)
        });
        // console.log(getDate(type).value, "=====退款时间");
        params.condition.applyStartTime = type === 'all' ? null : Math.round(getDate(type).value[0] / 1000);
        params.condition.applyEndTime = type === 'all' ? null : Math.round(getDate(type).value[1] / 1000);
        params.current = 1;
        this.getRefundRecordListFn();
        this.changeDateStyle(index, 'click-div_apply');
    };

    // 申请退款时间自定义筛选
    changeApplyRefundTime = (rangePickerValue, dateString) => {
        console.log(new Date(rangePickerValue[0]).getTime(), new Date(rangePickerValue[1]).getTime(), dateString, "=========日期选择");
        this.setState({
            applyRefundTimeValue: rangePickerValue
        });
        params.current = 1;
        params.condition.applyStartTime = parseInt(new Date(new Date(rangePickerValue[0]).toLocaleDateString()).getTime()/1000);
        params.condition.applyEndTime = parseInt((new Date(new Date(rangePickerValue[1]).toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)/1000);

        // params.condition.applyStartTime = Math.round((new Date(rangePickerValue[0]).getTime()) / 1000);
        // params.condition.applyEndTime = Math.round((new Date(rangePickerValue[1]).getTime()) / 1000);
        this.getRefundRecordListFn();
        this.changeDateStyle(null, 'click-div_apply');
    };

    // 退款时间筛选
    selectRefundDate = (type, index) => {
        this.setState({
            refundTimeValue: getTimeDistance(type)
        });
        // console.log(getDate(type).value, "=====退款时间");
        params.condition.execStartTime = type === 'all' ? null : Math.round(getDate(type).value[0] / 1000);
        params.condition.execEndTime = type === 'all' ? null : Math.round(getDate(type).value[1] / 1000);
        params.current = 1;
        this.getRefundRecordListFn();
        this.changeDateStyle(index, 'click-div_refund');
    };

    // 退款时间自定义筛选
    changeRefundTime = (rangePickerValue, dateString) => {
        console.log(new Date(rangePickerValue[0]).getTime(), new Date(rangePickerValue[1]).getTime(), dateString, "=========日期选择");
        this.setState({
            refundTimeValue: rangePickerValue
        });
        params.current = 1;
        params.condition.execStartTime = parseInt(new Date(new Date(rangePickerValue[0]).toLocaleDateString()).getTime()/1000);
        params.condition.execEndTime = parseInt((new Date(new Date(rangePickerValue[1]).toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)/1000);

        // params.condition.execStartTime = Math.round((new Date(rangePickerValue[0]).getTime()) / 1000);
        // params.condition.execEndTime = Math.round((new Date(rangePickerValue[1]).getTime()) / 1000);
        this.getRefundRecordListFn();
        this.changeDateStyle(null, 'click-div_refund');
    };

    // 改变日期样式
    changeDateStyle = (index, className) => {
        let aTags = document.querySelectorAll(`.${className} a`);
        for (let i = 0; i < aTags.length; i++) {
            if (i === index) {
                aTags[i].classList.add('click-a');
            } else {
                aTags[i].classList.remove('click-a');
            }
        }
    };

    // 退款状态筛选
    refundStatusChange = (value, e) => {
        this.setState({
            refundStatusValue: value
        });
        params.current = 1;
        params.condition.status = value;
        this.getRefundRecordListFn();
    };

    // 支付方式筛选
    payTypeChange = (value, e) => {
        this.setState({
            payTypeValue: value
        });
        params.current = 1;
        params.condition.payType = value;
        this.getRefundRecordListFn();
    };

    // 付款类型筛选
    payStatusChange = (value, e) => {
        this.setState({
            payStatusValue: value
        });
        params.current = 1;
        params.condition.transaction = value;
        this.getRefundRecordListFn();
    };

    // 课程筛选
    courseChange = (value, e) => {
        this.setState({
            courseValue: value
        });
        params.current = 1;
        params.condition.itemId = value;
        this.getRefundRecordListFn();
    };

    // 搜索用户的输入框
    searchContent = (e) => {
        this.setState({
            searchValue: e.target.value
        })
    };

    // 搜索订单编号
    searchOrderContent = (e) => {
        this.setState({
            orderValue: e.target.value
        })
    };

    // 搜索用户
    searchUser = () => {
        this.setState({
            disableBtn: true
        });
        params.condition.search = this.state.searchValue ? this.state.searchValue.replace(/(^\s*)|(\s*$)/g, "") : '';
        params.condition.orderId = this.state.orderValue ? this.state.orderValue.replace(/(^\s*)|(\s*$)/g, "") : '';
        params.current = 1;
        this.getRefundRecordListFn();
    };
    // 全部重置
    searchReset = () => {
        this.setState({
            resetBtn: true,
            searchValue: null,
            orderValue: null,
            payStatusValue: undefined,
            courseValue: undefined,
            payTypeValue: undefined,
            refundStatusValue: undefined,
            refundTimeValue: undefined,
            applyRefundTimeValue: undefined
        });
        params.current = 1;
        params.condition = {"business": "VIPCOURSE"};
        this.changeDateStyle(null, 'click-div_refund');
        this.changeDateStyle(null, 'click-div_apply');
        this.getRefundRecordListFn();
    };
    //导出数据
    exportForm = () => {
        let jsonstr = JSON.stringify(params);
        window.location.href = `${baseUrl()}/finance/reconciliation/export?data=${encodeURIComponent(jsonstr)}`
    };

    batchCollection = () => {
        const {checkIds} = this.state;
        if(checkIds.length === 0) {
            message.error('请选择账单')
            return
        }

        batchMoney(checkIds).then(res => {
            const code = Number(res.data.code)
            if(code ===0){
                const totalMoney = Number(res.data.data)
                this.setState({
                    visible: true,
                    ModalText: `订单总数${checkIds.length},订单总额${totalMoney}`
                })
            }
        })

    }

    // 复选框
    onSelectChange = (selectedRowKeys, selectRows) => {
        let checkIds = [],
            selectedRowKeysNew = [];
        selectRows.map((item,index) => {
            checkIds.push(item.id)
        })
        this.setState({
            selectedRowKeys,
            checkIds
        })

    }

    handleOk = () => {
        const {checkIds} = this.state;
        if(checkIds.length === 0) {
            message.error('请选择账单')
            return
        }
        batchCollect(checkIds).then(res => {
            const code = Number(res.data.code)
            if (code == 0) {
                message.success('确认成功');
                this.getRefundRecordListFn();
            } else {
                message.error('操作失败')
            }
            this.setState({
                visible: false
            })
        })

    }

    handleBatchCancel = () => {
        this.setState({
            visible: false
        })
    }

    // 改变页码
    onChangePage = (page, pageSize) => {
        params.size = pageSize;
        params.current = page;
        this.getRefundRecordListFn();
    };
    // 改变每页条数
    onShowSizeChange = (current, pageSize) => {
        params.size = pageSize;
        params.current = current;
        this.getRefundRecordListFn();
    };
    // 展示数据总数
    showTotal = (total) => {
        return `共 ${total} 条数据`;
    };

    render() {
        const {
            dataSource,
            loading,
            previewVisible,
            previewImage,
            refundStatusList,
            refundStatusValue,
            payTypeList,
            payTypeValue,
            courseList,
            courseValue,
            refundTimeValue,
            applyRefundTimeValue,
            payStatusValue,
            payStatusList,
            selectedRowKeys,
            checkIds,
            ModalText,
            visible,
            confirmLoading
        } = this.state;
        const menus = [
            {
                path: '/app/dashboard/analysis',
                name: '首页'
            },
            {
                path: '#',
                name: '财务管理'
            },
            {
                path: '/app/authority/accounts',
                name: '收款管理'
            }
        ];
        const refundTime = (
            <div className="sale-pick">
                <div className="click-div_refund" style={{float: 'left', marginTop: '5px'}}>
                    <a style={{marginRight: '20px', color: '#666'}} onClick={() => this.selectRefundDate('all', 0)}>
                        全部
                    </a>
                    <a style={{marginRight: '20px', color: '#666'}} onClick={() => this.selectRefundDate('today', 1)}>
                        今日
                    </a>
                    <a style={{marginRight: '20px', color: '#666'}} onClick={() => this.selectRefundDate('week', 2)}>
                        本周
                    </a>
                    <a style={{marginRight: '20px', color: '#666'}} onClick={() => this.selectRefundDate('month', 3)}>
                        本月
                    </a>
                    <a style={{marginRight: '20px', color: '#666'}} onClick={() => this.selectRefundDate('year', 4)}>
                        全年
                    </a>
                </div>
                <LocaleProvider locale={zh_CN}>
                    <RangePicker
                        value={refundTimeValue}
                        onChange={this.changeRefundTime}
                        style={{width: 256}}
                    />
                </LocaleProvider>
            </div>
        );

        const applyRefundTime = (
            <div className="sale-pick">
                <div className="click-div_apply" style={{float: 'left', marginTop: '5px'}}>
                    <a style={{marginRight: '20px', color: '#666'}} onClick={() => this.selectDate('all', 0)}>
                        全部
                    </a>
                    <a style={{marginRight: '20px', color: '#666'}} onClick={() => this.selectDate('today', 1)}>
                        今日
                    </a>
                    <a style={{marginRight: '20px', color: '#666'}} onClick={() => this.selectDate('week', 2)}>
                        本周
                    </a>
                    <a style={{marginRight: '20px', color: '#666'}} onClick={() => this.selectDate('month', 3)}>
                        本月
                    </a>
                    <a style={{marginRight: '20px', color: '#666'}} onClick={() => this.selectDate('year', 4)}>
                        全年
                    </a>
                </div>
                <LocaleProvider locale={zh_CN}>
                    <RangePicker
                        value={applyRefundTimeValue}
                        onChange={this.changeApplyRefundTime}
                        style={{width: 256}}
                    />
                </LocaleProvider>
            </div>
        );
        return (
            <div className="finace-payment">
                <div className="page-nav">
                    <BreadcrumbCustom paths={menus}/>
                    <p className="title-style">收款管理</p>
                </div>
                <Card bordered={false}>
                    <Row className="my-user-search" gutter={16}>
                        <Col sm={2} style={{textAlign: 'right', width: '90px', marginTop: '5px'}}>
                            <span>支付时间：</span>
                        </Col>
                        <Col sm={18} style={{padding: 0}}>
                            {applyRefundTime}
                        </Col>
                    </Row>
                    <Row className="my-user-search" gutter={16} style={{marginTop: '18px'}}>
                        <Col sm={2} style={{textAlign: 'right', width: '90px', marginTop: '5px'}}>
                            <span>对账时间：</span>
                        </Col>
                        <Col sm={18} style={{padding: 0}}>
                            {refundTime}
                        </Col>
                    </Row>
                    <Row className="my-user-search" gutter={16} style={{marginTop: '20px'}}>
                        <Col sm={2} style={{textAlign: 'right', width: '90px', marginTop: '5px'}}>
                            <span>账单状态：</span>
                        </Col>
                        <Col sm={4} style={{padding: 0}} id="refund_status_select">
                            <Select
                                showSearch
                                value={refundStatusValue}
                                placeholder="请选择"
                                onChange={this.refundStatusChange}
                                style={{width: '100%'}}
                                getPopupContainer={() => document.getElementById('refund_status_select')}
                            >
                                <Option value={null}>请选择</Option>
                                {refundStatusList && refundStatusList.map((value, index) => <Option key={index}
                                                                                value={parseInt(value.key)}>{value.value}</Option>)}
                            </Select>
                        </Col>
                        <Col className="search-input" sm={2}
                             style={{textAlign: 'right', width: '88px', marginTop: '5px'}}>
                            <span>支付方式：</span>
                        </Col>
                        <Col className="" sm={4} offset={0} style={{padding: '0'}} id="refund_seller_select">
                            <Select
                                showSearch
                                style={{width: '100%'}}
                                placeholder="请选择"
                                onChange={this.payTypeChange}
                                value={payTypeValue}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                getPopupContainer={() => document.getElementById('refund_seller_select')}
                            >
                                <Option value={null}>请选择</Option>
                                {payTypeList && payTypeList.map((value, index) => <Option key={index}
                                                                           value={parseInt(value.key)}>{value.value}</Option>)}
                            </Select>
                        </Col>
                        <Col sm={2} style={{textAlign: 'right', width: '88px', marginTop: '5px'}}>
                            <span>付款类型：</span>
                        </Col>
                        <Col sm={4} style={{padding: 0}} id="pay_status_select">
                            <Select
                                showSearch
                                value={payStatusValue}
                                placeholder="请选择"
                                onChange={this.payStatusChange}
                                style={{width: '100%'}}
                                getPopupContainer={() => document.getElementById('pay_status_select')}
                            >
                                <Option value={null}>请选择</Option>
                                {payStatusList && payStatusList.map((value, index) => <Option key={index}
                                                                             value={parseInt(value.key)}>{value.value}</Option>)}
                            </Select>
                        </Col>
                        <Col sm={2} style={{textAlign: 'right', width: '60px', marginTop: '5px'}}>
                            <span>课程：</span>
                        </Col>
                        <Col sm={4} style={{padding: 0}} id="refund_course_select">
                            <Select
                                showSearch
                                value={courseValue}
                                placeholder="请选择"
                                onChange={this.courseChange}
                                style={{width: '100%'}}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                getPopupContainer={() => document.getElementById('refund_course_select')}
                            >
                                <Option value={null}>选择课程</Option>
                                {courseList && courseList.map((value, index) => <Option key={index}
                                                                          value={parseInt(value.id)}>{value.name}</Option>)}
                            </Select>
                        </Col>
                    </Row>
                    <Row style={{marginBottom: '25px', marginTop: '20px'}} className="refund-search" gutter={16}>
                        <Col className="search-input" sm={2}
                             style={{textAlign: 'right', width: '90px', marginTop: '5px'}}>
                            <span>搜索：</span>
                        </Col>
                        <Col className="" sm={6} offset={0} style={{padding: '0'}}>
                            <Input autoComplete="off" value={this.state.searchValue} onChange={this.searchContent}
                                   onPressEnter={this.searchUser} placeholder="上课学员/流水号"/>
                        </Col>
                        <Col className="search-input" sm={2}
                             style={{textAlign: 'right', width: '90px', marginTop: '5px'}}>
                            <span>订单编号：</span>
                        </Col>
                        <Col className="" sm={6} offset={0} style={{padding: '0'}}>
                            <Input autoComplete="off" type="number" value={this.state.orderValue} onChange={this.searchOrderContent}
                                   onPressEnter={this.searchUser} placeholder="订单编号"/>
                        </Col>
                    </Row>
                    <Row style={{marginBottom: '25px', marginTop: '20px'}} className="refund-search" gutter={16}>

                        <Col className="" sm={13}>
                            <Button type="primary" style={{marginRight: '12px', marginLeft: '10px'}}
                                    onClick={this.searchUser} disabled={this.state.disableBtn}>查询</Button>
                            <Button type="default" onClick={this.searchReset}
                                    disabled={this.state.resetBtn}>全部重置</Button>
                        </Col>
                        <Col sm={3}
                             style={{textAlign: 'right', width: '90px', float: 'right'}}>
                            <Button type="primary" onClick={this.exportForm}
                                    disabled={this.state.disableBtn}>导出</Button>
                        </Col>
                        <Col sm={3}
                             style={{textAlign: 'right', width: '90px', float: 'right', marginRight: '28px'}}>
                             <Button type="primary" onClick={this.batchCollection}>批量确认收款</Button>
                             <Modal
                              title="确认收款"
                              visible={visible}
                              onOk={this.handleOk}
                              confirmLoading={confirmLoading}
                              onCancel={this.handleBatchCancel}
                            >
                              <p>{ModalText}</p>
                            </Modal>
                        </Col>
                    </Row>
                    <Row className="finace-payment-table">
                        <FormTable
                            dataSource={dataSource}
                            loading={loading}
                            onSelectChange={this.onSelectChange}
                            selectedRowKeys={selectedRowKeys}
                            handleBillClick={this.handleBill}
                            showImgClick={this.showImg}
                            cancelConfirmClick={this.cancelConfirmClick}
                        />
                    </Row>
                    <Row>
                        <div style={{overflow: 'hidden'}}>
                            <LocaleProvider locale={zh_CN}>
                                <Pagination showSizeChanger onShowSizeChange={this.onShowSizeChange}
                                            onChange={this.onChangePage}
                                            total={this.state.dataAll.total}
                                            showTotal={this.showTotal.bind(this.state.dataAll.total)}
                                            current={params.current}
                                            defaultPageSize={40}/>
                            </LocaleProvider>
                        </div>
                    </Row>
                    <Modal className="preview-pic" visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                        <img alt="error" style={{width: '100%', maxWidth: '1200px'}}
                             src={`https://img.kaikeba.com/${previewImage}`}/>
                    </Modal>
                </Card>
            </div>
        )
    }
}
