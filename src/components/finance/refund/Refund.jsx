import {Component} from "react";
import {
    Table,
    Pagination,
    LocaleProvider,
    Button,
    message,
    Col,
    Input,
    Row,
    Badge,
    Modal,
    Select,
    DatePicker
} from "antd";
import React from "react";
import {formatDateTime, priceType, getToken, getXDate, timeToDate, baseUrl} from "../../../utils/filter";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import {connect} from "../../../utils/socket";
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import {getRefundList, refundOk} from "../../../api/financeApi";
import './Refund.less'
import Ellipsis from "ant-design-pro/lib/Ellipsis";
import {getUserList} from "../../../api/marketApi";
import {getCourses} from "../../../api/userCenterApi";
import {getDate, getTimeDistance} from "../../../utils/utils";

const Option = Select.Option;
const {RangePicker} = DatePicker;

let params = {
    size: 40,
    current: 1,
    descs: ['apply_time'],
    ascs: null,
    condition: {
        "business": "VIPCOURSE"
    }
};

export default class Refund extends Component{
    constructor(props) {
        super(props);
        this.state = {
            dataAll: '', // 列表数据
            loading: false,
            dataSource: [],
            disableBtn: false,
            resetBtn: false,
            searchValue: '',
            refundStatusList: [
                {key: 0, value: '待退款'},
                {key: 1, value: '已退款'}
            ],
            sellerList: [],
            courseList: [],
            courseValue: undefined,
            sellerValue: undefined,
            refundStatusValue: undefined,
            refundTimeValue: undefined,
            applyRefundTimeValue: undefined
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

    // vip课程下班次列表
     refundList = () =>{
        this.setState({
            loading: true
        });
        getRefundList(params).then(res =>{
            if (res.data.code === 0) {
                this.setState({
                    dataAll: res.data.data,
                    loading: false,
                    dataSource: res.data.data.records,
                    disableBtn: false,
                    resetBtn: false
                })
            } else {
                message.error(res.data.msg)
            }
        }).catch(err => {
            this.setState({
                loading: false
            })
        })
    };

    // 渲染
    componentDidMount(){
        params = {
            size: 40,
            current: 1,
            descs: ['apply_time'],
            ascs: null,
            condition: {
                "business": "VIPCOURSE"
            }
        };
        this.getSellerList();
        this.getCourseList();
        this.refundList();
        // //链接websocket
        connect(getToken('username'));
        // //end
    }

    // 页码相关
    onChangePage = (page, pageSize) =>{
        params.current = page;
        params.size = pageSize;
        this.refundList();
    };

    // 改变每页条数
    onShowSizeChange = (current, pageSize) => {
        params.current = current;
        params.size = pageSize;
        this.refundList();
    };

    // 表格总条数
    showTotal = (total) => {
        return `共 ${total} 条数据`;
    };

    // 排序
    changeSore = (record, filters, sorter) => {
        let field = [];
        if (sorter.field === 'applyTime') {
            field = ['apply_time']
        } else if (sorter.field === 'orderAmount') {
            field = ['order_amount']
        } else if (sorter.field === 'applyAmount') {
            field = ['apply_amount']
        }
        params.ascs = (sorter.order === "ascend" ? field : null);
        params.descs = (sorter.order === "ascend" ? null : field);

        // 排序后，恢复排序时，数据应当保持和默认一致；
        let arr = Object.keys(sorter); //此方法为ES6新方法，返回值是对象中属性名组成的数组；
        if(arr.length === 0){
            params.descs = ['apply_time'];
        }
        this.refundList();
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
        this.refundList();
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
        this.refundList();
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
        this.refundList();
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
        this.refundList();
        this.changeDateStyle(null, 'click-div_refund');
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
    refundStatusChange = (value, e) => {
        console.log(value, e, "======退款状态筛选");
        this.setState({
            refundStatusValue: value
        });
        params.current = 1;
        params.condition.status = value;
        this.refundList();
    };

    // 销售筛选
    sellerChange = (value, e) => {
        console.log(value, e, "======销售筛选");
        this.setState({
            sellerValue: value
        });
        params.current = 1;
        params.condition.sellerId = value;
        this.refundList();
    };

    // 课程筛选
    courseChange = (value, e) => {
        console.log(value, e, "======课程筛选");
        this.setState({
            courseValue: value
        });
        params.current = 1;
        params.condition.itemId = value;
        this.refundList();
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
            disableBtn: true
        });
        console.log(this.state.searchValue);
        params.condition.search = this.state.searchValue.replace(/(^\s*)|(\s*$)/g, "");
        params.current = 1;
        this.refundList();
    };

    // 全部重置
    searchReset = () => {
        this.setState({
            resetBtn: true,
            searchValue: null,
            courseValue: undefined,
            sellerValue: undefined,
            refundStatusValue: undefined,
            refundTimeValue: undefined,
            applyRefundTimeValue: undefined
        });
        params.current = 1;
        params.condition = {"business": "VIPCOURSE"};
        this.changeDateStyle(null, 'click-div_refund');
        this.changeDateStyle(null, 'click-div_apply');
        this.refundList();
    };

    // 退款
    refundPriceOk = (record) => {
        console.log(record);
        let that = this;
        Modal.confirm({
            title: <p style={{fontSize: '14px', lineHeight: '20px'}}>确定已退款了吗？</p>,
            content: <p style={{color: '##FF0033', fontSize: '12px', marginTop: '-22px'}}>（确认后不可回退）</p>,
            okText: '确定',
            cancelText: '取消',
            iconType: 'exclamation-circle',
            contentType: 'normal',
            onOk() {
                refundOk(record.id).then(res => {
                    if (res.data.code === 0) {
                        message.success('退款成功');
                        that.refundList()
                    } else {
                        message.error(res.data.msg);
                    }
                })
            }
        });
    };

    //导出数据
    exportForm = () => {
        let jsonstr = JSON.stringify(params);
        window.location.href = `${baseUrl()}/finance/reconciliation/refund/export?data=${encodeURIComponent(jsonstr)}`
    };

    render () {
        let {refundStatusList, refundStatusValue, sellerList, sellerValue, courseList, courseValue, refundTimeValue, applyRefundTimeValue} = this.state;

        const columns = [{
            title: '退款编号',
            dataIndex: 'no',
            width: 120,
            render: (dataIndex) => <span>{dataIndex ? dataIndex : '/'}</span>
        }, {
            title: '申请退款金额',
            dataIndex: 'applyAmount',
            width: 120,
            sorter: (a, b) => a.applyAmount - b.applyAmount,
            render: (dataIndex) => <span>{dataIndex ? priceType(dataIndex, 2) : '/'}</span>
        }, {
            title: '订单金额',
            dataIndex: 'orderAmount',
            width: 100,
            sorter: (a, b) => a.orderAmount - b.orderAmount,
            render: (dataIndex) => <span>{dataIndex ? priceType(dataIndex, 2) : '/'}</span>
        }, {
            title: '订单编号',
            dataIndex: 'orderId',
            width: 100,
            render: (dataIndex) => <span>{dataIndex ? dataIndex : '/'}</span>
        }, {
            title: '申请时间',
            dataIndex: 'applyTime',
            width: 130,
            sorter: (a, b) => a.applyTime - b.applyTime,
            render: (dataIndex) => {
                return dataIndex ? formatDateTime(dataIndex) : '/'
            }
        }, {
            title: '销售',
            dataIndex: 'sellerName',
            width: 80,
            render: (dataIndex) => <span>{dataIndex ? dataIndex : '/'}</span>
        }, {
            title: '上课学员',
            dataIndex: 'trackName',
            width: 100,
            render: (dataIndex) => <span>{dataIndex ? dataIndex : '/'}</span>
        }, {
            title: '课程',
            dataIndex: 'itemName',
            width: 100,
            render: (dataIndex) => <span>{dataIndex ? dataIndex : '/'}</span>
        }, {
            title: '开票状态',
            dataIndex: 'invoiceType',
            width: 80,
            render: (dataIndex) => dataIndex === 0 ? <span><Badge status="default" />未开票</span> : <span><Badge status="success" />已开票</span>
        }, {
            title: '退款原因',
            dataIndex: 'remark',
            width: 120,
            render: (dataIndex) => <Ellipsis tooltip lines={2}>{dataIndex ? dataIndex : '/'}</Ellipsis>
        }, {
            title: '操作人',
            dataIndex: 'execByName',
            width: 90,
            render: (dataIndex) => <span>{dataIndex ? dataIndex : '/'}</span>
        }, {
            title: '退款状态',
            dataIndex: 'status',
            width: 80,
            render: (dataIndex) => dataIndex === 0 ? <span><Badge status="default" />待退款</span> : <span><Badge status="success" />已退款</span>
        }, {
            title: '退款时间',
            dataIndex: 'execTime',
            width: 120,
            render: (dataIndex) => {
                return dataIndex ? formatDateTime(dataIndex) : '/'
            }
        }, {
            title: '操作',
            dataIndex: 'opera',
            key: 'opera',
            width: 80,
            render: (text, record) =>
                record.status === 0 ?
                    <div className="user-opera">
                        <span className="opera-text" onClick={() => this.refundPriceOk(record) }>退款</span>
                    </div>
                    :
                    <div>
                        <span style={{color: '#888'}}>退款</span>
                    </div>

        }];

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
                path: '#',
                name: '退款管理'
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

        return(
            <div>
                <div className="page-nav" onClick={this.hideDetail}>
                    <BreadcrumbCustom paths={menus}/>
                    <p className="title-style">退款管理</p>
                </div>
                <div className="formBody">
                    <Row className="my-user-search" gutter={16}>
                        <Col sm={2} style={{textAlign: 'right', width: '90px', marginTop: '5px'}}>
                            <span>退款时间：</span>
                        </Col>
                        <Col sm={18} style={{padding: 0}}>
                            {refundTime}
                        </Col>
                    </Row>
                    <Row className="my-user-search" gutter={16} style={{marginTop: '18px'}}>
                        <Col sm={2} style={{textAlign: 'right', width: '115px', marginTop: '5px'}}>
                            <span>申请退款时间：</span>
                        </Col>
                        <Col sm={18} style={{padding: 0}}>
                            {applyRefundTime}
                        </Col>
                    </Row>
                    <Row className="my-user-search" gutter={16} style={{marginTop: '20px'}}>
                        <Col sm={2} style={{textAlign: 'right', width: '90px', marginTop: '5px'}}>
                            <span>退款状态：</span>
                        </Col>
                        <Col sm={5} style={{padding: 0}} id="refund_status_select">
                            <Select
                                showSearch
                                value={refundStatusValue}
                                placeholder="请选择"
                                onChange={this.refundStatusChange}
                                style={{width: '100%'}}
                                getPopupContainer={() => document.getElementById('refund_status_select')}
                            >
                                <Option value={null}>请选择</Option>
                                {refundStatusList && refundStatusList.map((value, index) => <Option key={index} value={parseInt(value.key)}>{value.value}</Option>)}
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
                    <Row className="refund-search" gutter={16} style={{marginTop: '20px'}}>
                        <Col className="search-input" sm={2}
                             style={{textAlign: 'right', width: '90px', marginTop: '5px'}}>
                            <span>搜索：</span>
                        </Col>
                        <Col className="" sm={6} offset={0} style={{padding: '0'}}>
                            <Input autoComplete="off" value={this.state.searchValue} onChange={this.searchContent} onPressEnter={this.searchUser} placeholder="订单编号/上课学员"/>
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
                    <div style={{marginTop: '25px'}} className="refund">
                        <LocaleProvider locale={zh_CN}>
                            <Table
                                key={(record, i) => i}
                                rowKey={(record, i) => i}
                                columns={columns}
                                dataSource={this.state.dataSource}
                                loading={this.state.loading}
                                pagination={false}
                                rowSelection={null}
                                onChange={this.changeSore}
                                locale={{emptyText: '没有数据'}}
                            />
                        </LocaleProvider>
                    </div>

                    <div style={{overflow: 'hidden', marginTop: '20px'}}>
                        <LocaleProvider locale={zh_CN}>
                            <Pagination showSizeChanger onShowSizeChange={this.onShowSizeChange}
                                        onChange={this.onChangePage}
                                        defaultPageSize={40}
                                        total={this.state.dataAll.total}
                                        showTotal={this.showTotal.bind(this.state.dataAll.total)}
                                        current={params.current}/>
                        </LocaleProvider>
                    </div>
                </div>
            </div>
        )
    }
}
