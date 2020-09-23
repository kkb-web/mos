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
import {formatDateTime, getToken, returnFloats, baseUrl} from "../../../utils/filter";
import {addBill, getBillList, getBillTypeSelect, getOrderNumberSelect} from "../../../api/financeApi";
import {connect} from "../../../utils/socket";
import FormTable from "./FormTable";
import AddBills from "./AddInvoice"
import {createChannel} from "../../../api/vipCourseApi";
import {getDate, getTimeDistance} from "../../../utils/utils";
import {getUserList} from "../../../api/marketApi";
import {getCourses} from "../../../api/userCenterApi";

const Option = Select.Option;
const {RangePicker} = DatePicker;

let params = {
    size: 40,
    current: 1,
    ascs: [],
    descs: ['execTime'],
    condition: {
        "business": "VIPCOURSE"
    }
};

export default class FinanceBill extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            dataAll: '',           //列表总数据
            dataSource: [],      //列表表单数据
            Visible: false,
            BillTypeSelect: [
                {"id": 1, "name": "增值税普通发票"},
                {"id": 2, "name": "增值税专用发票"},
                {"id": 3, "name": "收据"}
            ],
            OrderNumberSelect: [],
            disableBtn: false,
            resetBtn: false,
            searchValue: '',
            addBillBtnState: false,
            billStatusList: [
                {key: 0, value: '增值税普通发票'},
                {key: 1, value: '增值税专用发票'},
                {key: 2, value: '收据'}
            ],
            sellerList: [],
            courseList: [],
            billStatusValue: undefined,
            courseValue: undefined,
            sellerValue: undefined,
            billTimeValue: undefined
        };
    }

    // 获取销售下拉
    getSellerList = () => {
        getUserList().then(res => {
            console.log(res);
            this.setState({
                sellerList: res.data.data
            })
        })
    };

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
            descs: ['execTime'],
            condition: {
                "business": "VIPCOURSE"
            }
        };
        this.getSellerList();
        this.getCourseList();
        this.getRefundRecordListFn();
        this.getOrderNumberSelectFn();
        //链接websocket
        connect(getToken('username'));
        //end
    };

    componentWillUnmount() {

    };

    //获取发票列表
    getRefundRecordListFn = () => {
        getBillList(params).then(res => {
            if (res.data.code == 0) {
                this.setState({
                    dataSource: res.data.data.records,
                    dataAll: res.data.data,
                    loading: false,
                    disableBtn: false,
                    resetBtn: false
                })
            } else {
                message.error(res.data.msg)
                this.setState({
                    loading: false
                })
            }
        }).catch(err => {
            console.log(err)
            this.setState({
                loading: false
            })
        })
    };
    //新增发票表单提交
    onSubmitForm = () => {
        let that = this;
        this.refs.btSubmit.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let time = Math.round(new Date(values.invoiceTime).getTime() / 1000);
                console.log(Math.round(new Date(values.invoiceTime).getTime() / 1000))
                console.log(values);
                that.setState({
                    addBillBtnState: true
                })
                addBill({
                    business: 'VIPCOURSE',
                    orderId: values.orderNumber,
                    amount: values.amountInvoice,
                    type: values.billType,
                    title: values.billHead,
                    remark: values.invoiceRemark,
                    taxes: values.invoiceNumber,
                    invoiceTime: time
                }).then(res => {
                    console.log(res)
                    if (res.data.code === 0) {
                        that.setState({
                            addBillBtnState: false
                        });
                        message.success('新建成功')
                        that.handleCancel();
                        that.getRefundRecordListFn();
                    } else {
                        that.setState({
                            addBillBtnState: false
                        });
                        message.error(res.data.msg)
                    }
                }).cache(err => {
                    that.setState({
                        addBillBtnState: false
                    });
                })
            }
        });
    };
    //新增按钮
    addBillBtn = () => {
        this.setState({
            Visible: true,
        });
    };
    //订单编号下拉
    getOrderNumberSelectFn = () => {
        getOrderNumberSelect().then(res => {
            if (res.data.code == 0) {
                this.setState({
                    OrderNumberSelect: res.data.data
                })
            }
        }).catch(err => {
            console.log(err)
        })
    };
    handleCancel = () => {
        this.setState({
            Visible: false,
        });
    };

    // 退款时间筛选
    selectBillDate = (type, index) => {
        this.setState({
            billTimeValue: getTimeDistance(type)
        });
        // console.log(getDate(type).value, "=====退款时间");
        params.condition.execStartTime = type === 'all' ? null : Math.round(getDate(type).value[0] / 1000);
        params.condition.execEndTime = type === 'all' ? null : Math.round(getDate(type).value[1] / 1000);
        params.current = 1;
        this.getRefundRecordListFn();
        this.changeDateStyle(index, 'click-div_bill');
    };

    // 开票时间自定义筛选
    changeBillTime = (rangePickerValue, dateString) => {
        console.log(new Date(rangePickerValue[0]).getTime(), new Date(rangePickerValue[1]).getTime(), dateString, "=========日期选择");
        this.setState({
            billTimeValue: rangePickerValue
        });
        params.current = 1;
        params.condition.execStartTime = parseInt(new Date(new Date(rangePickerValue[0]).toLocaleDateString()).getTime()/1000);
        params.condition.execEndTime = parseInt((new Date(new Date(rangePickerValue[1]).toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)/1000);

        // params.condition.execStartTime = Math.round((new Date(rangePickerValue[0]).getTime()) / 1000);
        // params.condition.execEndTime = Math.round((new Date(rangePickerValue[1]).getTime()) / 1000);
        this.getRefundRecordListFn();
        this.changeDateStyle(null, 'click-div_bill');
    };

    // 改变日期样式
    changeDateStyle = (index, className) => {
        let aTags = document.querySelectorAll( `.${className} a`);
        for (let i = 0; i < aTags.length; i++) {
            if (i === index) {
                aTags[i].classList.add('click-a');
            } else {
                aTags[i].classList.remove('click-a');
            }
        }
    };

    // 退款状态筛选
    billStatusChange = (value, e) => {
        this.setState({
            billStatusValue: value
        });
        params.current = 1;
        params.condition.type = value;
        this.getRefundRecordListFn();
    };

    // 销售筛选
    sellerChange = (value, e) => {
        this.setState({
            sellerValue: value
        });
        params.current = 1;
        params.condition.sellerId = value;
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
    // 搜索用户
    searchUser = () => {
        this.setState({
            disableBtn: true,
            loading: true
        });
        console.log(this.state.searchValue);
        params.condition.search = this.state.searchValue.replace(/(^\s*)|(\s*$)/g, "");
        params.current = 1;
        this.getRefundRecordListFn();
    };
    // 全部重置
    searchReset = () => {
        this.setState({
            resetBtn: true,
            searchValue: null,
            loading: true,
            billStatusValue: undefined,
            courseValue: undefined,
            sellerValue: undefined,
            billTimeValue: undefined
        });
        params.current = 1;
        params.condition={"business": "VIPCOURSE"};
        this.changeDateStyle(null, 'click-div_bill');
        this.getRefundRecordListFn();
    };

    // 改变页码
    onChangePage = (page, pageSize) => {
        params.size = pageSize;
        params.current = page;
        this.getList();
    };
    // 改变每页条数
    onShowSizeChange = (current, pageSize) => {
        params.size = pageSize;
        params.current = current;
        this.getList();
    };
    // 展示数据总数
    showTotal = (total) => {
        return `共 ${total} 条数据`;
    };

    //导出数据
    exportForm = () => {
        let jsonstr = JSON.stringify(params);
        window.location.href = `${baseUrl()}/finance/invoice/export?data=${encodeURIComponent(jsonstr)}`
    };

    render() {
        const {dataSource, loading, Visible, BillTypeSelect, OrderNumberSelect, billStatusList, billStatusValue, sellerList, sellerValue, courseList, courseValue, billTimeValue} = this.state;
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
                name: '发票管理'
            }
        ];

        const billTime = (
            <div className="sale-pick">
                <div className="click-div_bill" style={{float: 'left', marginTop: '5px'}}>
                    <a style={{marginRight: '20px', color: '#666'}} onClick={() => this.selectBillDate('all', 0)}>
                        全部
                    </a>
                    <a style={{marginRight: '20px', color: '#666'}} onClick={() => this.selectBillDate('today', 1)}>
                        今日
                    </a>
                    <a style={{marginRight: '20px', color: '#666'}} onClick={() => this.selectBillDate('week', 2)}>
                        本周
                    </a>
                    <a style={{marginRight: '20px', color: '#666'}} onClick={() => this.selectBillDate('month', 3)}>
                        本月
                    </a>
                    <a style={{marginRight: '20px', color: '#666'}} onClick={() => this.selectBillDate('year', 4)}>
                        全年
                    </a>
                </div>
                <LocaleProvider locale={zh_CN}>
                    <RangePicker
                        value={billTimeValue}
                        onChange={this.changeBillTime}
                        style={{width: 256}}
                    />
                </LocaleProvider>
            </div>
        );

        return (
            <div className="finace-bills">
                <div className="page-nav">
                    <BreadcrumbCustom paths={menus}/>
                    <p className="title-style">发票管理</p>
                </div>
                <Card bordered={false}>
                    <Row className="my-user-search" gutter={16}>
                        <Col sm={2} style={{textAlign: 'right', width: '90px', marginTop: '5px'}}>
                            <span>开票时间：</span>
                        </Col>
                        <Col sm={18} style={{padding: 0}}>
                            {billTime}
                        </Col>
                    </Row>
                    <Row className="my-user-search" gutter={16} style={{marginTop: '20px'}}>
                        <Col sm={2} style={{textAlign: 'right', width: '90px', marginTop: '5px'}}>
                            <span>票据类型：</span>
                        </Col>
                        <Col sm={5} style={{padding: 0}} id="refund_status_select">
                            <Select
                                showSearch
                                value={billStatusValue}
                                placeholder="请选择"
                                onChange={this.billStatusChange}
                                style={{width: '100%'}}
                                getPopupContainer={() => document.getElementById('refund_status_select')}
                            >
                                <Option value={null}>请选择</Option>
                                {billStatusList && billStatusList.map((value, index) => <Option key={index} value={value.value}>{value.value}</Option>)}
                            </Select>
                        </Col>
                        <Col className="search-input" sm={2}
                             style={{textAlign: 'right', width: '65px', marginTop: '5px'}}>
                            <span>销售：</span>
                        </Col>
                        <Col className="" sm={6} offset={0} style={{padding: '0'}} id="refund_seller_select">
                            <Select
                                showSearch
                                style={{width: '100%'}}
                                placeholder="请选择"
                                onChange={this.sellerChange}
                                value={sellerValue}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                getPopupContainer={() => document.getElementById('refund_seller_select')}
                            >
                                <Option value={null}>请选择</Option>
                                {sellerList && sellerList.map((value, index) => <Option key={index}
                                                                          value={parseInt(value.id)}>{value.realname}</Option>)}
                            </Select>
                        </Col>
                        <Col sm={2} style={{textAlign: 'right', width: '65px', marginTop: '5px'}}>
                            <span>课程：</span>
                        </Col>
                        <Col sm={5} style={{padding: 0}} id="refund_course_select">
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
                                {courseList && courseList.map((value, index) => <Option key={index} value={parseInt(value.id)}>{value.name}</Option>)}
                            </Select>
                        </Col>
                    </Row>
                    <Row style={{marginBottom: '25px',marginTop: '20px'}} className="refund-search" gutter={16}>
                        <Col className="search-input" sm={2}
                             style={{textAlign: 'right', width: '90px', marginTop: '5px'}}>
                            <span>搜索：</span>
                        </Col>
                        <Col className="" sm={6} offset={0} style={{padding: '0'}}>
                            <Input autoComplete="off" value={this.state.searchValue} onChange={this.searchContent}
                                   onPressEnter={this.searchUser} placeholder="订单编号/上课学员"/>
                        </Col>
                        <Col className="" sm={9}>
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
                    </Row>
                    <Row className="finace-bills-add">
                        <Button onClick={this.addBillBtn} type="primary">+ 新增发票</Button>
                    </Row>
                    <Row className="finace-bills-table">
                        <FormTable
                            dataSource={dataSource}
                            changeSore={this.changeSore}
                            loading={loading}
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
                    <LocaleProvider locale={zh_CN}>
                        <Modal
                            title="新增发票记录"
                            className="Add-modals"
                            okText="确定"
                            cancelText="取消"
                            visible={Visible}
                            destroyOnClose={true}
                            style={{top: '80px'}}
                            footer={[
                                <button onClick={this.handleCancel} type="button" className="ant-btn">取消</button>,
                                <button disabled={this.state.addBillBtnState} onClick={this.onSubmitForm} type="button"
                                        className="ant-btn ant-btn-primary">确定</button>
                            ]}
                            onOk={this.onSubmitForm}
                            onCancel={this.handleCancel}
                        >
                            <div>
                                <AddBills BillTypeSelect={BillTypeSelect} OrderNumberSelect={OrderNumberSelect}
                                          ref="btSubmit"/>
                            </div>
                        </Modal>
                    </LocaleProvider>
                </Card>
            </div>
        )
    }
}
