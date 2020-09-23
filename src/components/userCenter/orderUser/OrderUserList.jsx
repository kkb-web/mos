import {Component} from "react";
import {Table, Pagination, LocaleProvider, Button, message, Col, Input, Row, Select} from "antd";
import React from "react";
import {formatDateTime,getToken} from "../../../utils/filter";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import {connect} from "../../../utils/socket";
import {Link} from "react-router-dom";
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import {getOrderUserList, getOrderUserDetail, getCourses, getClasses, queryUserOrder} from "../../../api/userCenterApi";
import "./OrderUserList.less"
import Drawer from './Drawer'
import Ellipsis from "ant-design-pro/lib/Ellipsis";

const Option = Select.Option;

let params = {
    size: 40,
    current: 1,
    descs: ["createTime"],
    // ascs: null,
    condition: {}
};

export default class OrderUserList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataAll: '', // 列表数据
            loading: false,
            dataSource: [],
            visible: false,
            userDetail: {},
            disableBtn: false,
            resetBtn: false,
            searchValue: '',
            courseList: [],
            classList: [],
            courseValue: undefined,
            classValue: undefined,
            details: [],
            orderData: []
        };
    }

    // vip课程下班次列表
    orderUserList = () => {
        this.setState({
            loading: true
        });
        console.log(params);
        getOrderUserList(params).then(res => {
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

    // 渲染
    componentDidMount() {
        params.condition = {};
        params.current = 1;
        params.size = 40;
        this.orderUserList();
        this.getCourseList()
        //链接websocket
        connect(getToken('username'));
        //end
    }

    // 页码相关
    onChangePage = (page, pageSize) => {
        params.current = page;
        params.size = pageSize;
        this.orderUserList();
    };

    // 改变每页条数
    onShowSizeChange = (current, pageSize) => {
        params.current = current;
        params.size = pageSize;
        this.orderUserList();
    };

    // 表格总条数
    showTotal = (total) => {
        return `共 ${total} 条数据`;
    };

    // 排序 + 筛选
    changeSore = (record, filters, sorter) => {
        params.ascs = (sorter.order === "ascend" ? [sorter.field] : null);
        params.descs = (sorter.order === "ascend" ? null : [sorter.field]);

        // 排序后，恢复排序时，数据应当保持和默认一致；
        let arr = Object.keys(sorter); //此方法为ES6新方法，返回值是对象中属性名组成的数组；
        if (arr.length === 0) {
            params.descs = ['createTime'];
        }
        this.orderUserList();
    };

    // 获取用户订单信息
    getUserOrder = (id) => {
        queryUserOrder(id).then(res => {
            if (res.data.code === 0) {
                this.setState({
                    orderData: res.data.data
                })
            }
        })
    };

    // 点击详情查看详情
    showDetail = (record, e) => {
        e.stopPropagation();
        getOrderUserDetail({
            id: record.id,
            outOrderId: record.outOrderId
        }).then(res => {
            if (res.data.code === 0) {
                let value = res.data.data;
                console.log(value, "======用户详情");
                this.setState({
                    visible: true,
                    userDetail: value,
                    details: value.questions ? value.questions : []
                });
            } else {
                message.error(res.data.msg)
            }
        });
        this.getUserOrder(record.id)
    };

    // 点击右侧弹出区域
    clickDrawer = (e) => {
        e.stopPropagation();
        this.setState({
            visible: true
        })
    };

    // 隐藏右侧查看详情
    hideDetail = (e) => {
        e.stopPropagation();
        this.setState({
            visible: false
        })
    };

    // 课程筛选
    courseChange = (value, e) => {
        params.condition.courseId = value;
        this.setState({
            courseValue: value
        });
        this.orderUserList();
        this.getClassList(value);
    };

    // 获取班次下拉菜单
    getClassList = (courseId) => {
        params.condition.classId = null;
        this.setState({
            classValue: undefined
        });
        if (courseId !== null) {
            getClasses(courseId).then(res => {
                console.log(res.data.data, '========班次下拉菜单');
                this.setState({
                    classList: res.data.data
                });
            })
        } else {
            this.setState({
                classList: [],
            });
        }
    };

    // 班级筛选
    classChange = (value, e) => {
        this.setState({
            classValue: value
        });
        params.condition.classId = value;
        this.orderUserList();
        console.log(value, e, "======班级");
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
        params.current = 1;
        params.condition.search = this.state.searchValue.replace(/(^\s*)|(\s*$)/g, "");
        this.orderUserList();
    };

    // 全部重置
    searchReset = () => {
        this.setState({
            resetBtn: true,
            searchValue: null,
            courseValue: undefined,
            classValue: undefined
        });
        params.condition.search = null;
        params.condition.courseId = null;
        params.condition.classId = null;
        this.orderUserList();
    };

    // 跳转到添加订单
    pushOrder = () => {
        this.props.history.push({pathname: '/app/orderCenter/all', state: 'add'});
    };

    // 跳转编辑页面
    pushEditUser = (record, e) => {
        e.stopPropagation();
        this.props.history.push({pathname: '/app/usercenter/orderuser/' + record.id, outOrderId: record.outOrderId})
    };

    render() {
        const columns = [{
            title: '姓名',
            dataIndex: 'username',
            render: (dataIndex) => <span>{dataIndex ? dataIndex : '/'}</span>
        }, {
            title: '手机号',
            dataIndex: 'mobile',
            render: (dataIndex) => <span>{dataIndex ? dataIndex : '/'}</span>
        }, {
            title: '微信昵称',
            dataIndex: 'nickname',
            render: (dataIndex) => <span>{dataIndex ? dataIndex : '/'}</span>
        }, {
            title: '用户来源',
            dataIndex: 'value',
            render: (dataIndex) => <span>{dataIndex ? dataIndex : '/'}</span>
        }, {
            title: 'VIP课',
            dataIndex: 'courseName',
            render: (dataIndex) => <Ellipsis tooltip lines={2}>{dataIndex ? dataIndex : '/'}</Ellipsis>
        }, {
            title: '班次',
            dataIndex: 'className',
            render: (dataIndex) => <Ellipsis tooltip lines={2}>{dataIndex ? dataIndex : '/'}</Ellipsis>
        }, {
            title: '销售',
            dataIndex: 'sellerName',
            render: (dataIndex) => <span>{dataIndex ? dataIndex : '/'}</span>
        }, {
            title: '添加好友时间',
            dataIndex: 'friendTime',
            render: (dataIndex) => {
                return dataIndex ? formatDateTime(dataIndex) : '/'
            }
        }, {
            title: '操作',
            dataIndex: 'opera',
            key: 'opera',
            render: (text, record) =>
                <div className="user-opera">
                    <span className="opera-text">详情</span>
                    <span className="opera-text" onClick={this.pushEditUser.bind(this, record)}>编辑</span>
                </div>
        }];

        let {courseList, classList, courseValue, classValue, dataAll, dataSource, loading, details, userDetail, visible, orderData} = this.state;

        const menus = [
            {
                path: '/app/dashboard/analysis',
                name: '首页'
            },
            {
                path: '#',
                name: '用户中心'
            },
            {
                path: '#',
                name: '成单用户'
            }
        ];

        return (
            <div onClick={this.hideDetail}>
                <div className="page-nav">
                    <BreadcrumbCustom paths={menus}/>
                    <p className="title-style">成单用户</p>
                    {/*<p className="title-describe">销售手动录入的意向用户和公开课带来的私海用户，已成单用户的请在「成单用户」列表查看。</p>*/}
                </div>
                <div className="formBody">
                    <div>
                        <Row className="my-user-search" gutter={16}>
                            <Col sm={2} style={{textAlign: 'right', width: '90px', marginTop: '5px'}}>
                                <span>课程：</span>
                            </Col>
                            <Col sm={5} style={{padding: 0}} id="user_course_input">
                                <Select
                                    showSearch
                                    value={courseValue}
                                    placeholder="选择课程"
                                    onChange={this.courseChange}
                                    style={{width: '100%'}}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    getPopupContainer={() => document.getElementById('user_course_input')}
                                >
                                    <Option value={null}>选择课程</Option>
                                    {courseList && courseList.map((value, index) => <Option key={index} value={parseInt(value.id)}>{value.name}</Option>)}
                                </Select>
                            </Col>
                            <Col sm={2} style={{textAlign: 'right', width: '75px', marginTop: '5px'}}>
                                <span>班次：</span>
                            </Col>
                            <Col sm={5} style={{padding: 0}} id="user_class_input">
                                <Select
                                    showSearch
                                    style={{width: '100%'}}
                                    placeholder="选择班次"
                                    onChange={this.classChange}
                                    value={classValue}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    getPopupContainer={() => document.getElementById('user_class_input')}
                                >
                                    <Option value={null}>选择班次</Option>
                                    {classList && classList.map((value, index) => <Option key={index}
                                                                             value={parseInt(value.id)}>{value.name}</Option>)}
                                </Select>
                            </Col>
                        </Row>
                        <Row className="my-user-search" gutter={16} style={{marginTop: '20px'}}>
                            <Col className="search-input" sm={2}
                                 style={{textAlign: 'right', width: '90px', marginTop: '5px'}}>
                                <span>查找用户：</span>
                            </Col>
                            <Col className="" sm={6} offset={0} style={{padding: '0'}}>
                                <Input autoComplete="off" value={this.state.searchValue} onPressEnter={this.searchUser} onChange={this.searchContent}
                                       placeholder="姓名/手机号/微信昵称"/>
                            </Col>
                            <Col className="" sm={9}>
                                <Button type="primary" style={{marginRight: '12px', marginLeft: '10px'}}
                                        onClick={this.searchUser} disabled={this.state.disableBtn}>查询</Button>
                                <Button type="default" onClick={this.searchReset}
                                        disabled={this.state.resetBtn}>全部重置</Button>
                            </Col>
                        </Row>
                        <Button style={{marginTop: '20px'}} type="primary" onClick={this.pushOrder}>添加订单</Button>
                    </div>
                    <div style={{marginTop: '15px'}} onClick={(event) => event.cancelBubble = true}>
                        <LocaleProvider locale={zh_CN}>
                            <Table
                                onRow={(record) => {
                                    return {
                                        onClick: (e) => this.showDetail(record, e),       // 点击行
                                    };
                                }}
                                key={(record, i) => i}
                                rowKey={(record, i) => i}
                                columns={columns}
                                dataSource={dataSource}
                                loading={loading}
                                pagination={false}
                                rowSelection={null}
                                onChange={this.changeSore}
                                locale={{emptyText: '没有数据'}}
                            />
                        </LocaleProvider>
                    </div>
                    <div style={{overflow: 'hidden', paddingTop: '20px'}}>
                        <LocaleProvider locale={zh_CN}>
                            <Pagination showSizeChanger onShowSizeChange={this.onShowSizeChange}
                                        onChange={this.onChangePage}
                                        defaultPageSize={40}
                                        total={dataAll.total}
                                        showTotal={this.showTotal.bind(dataAll.total)}
                                        current={params.current}/>
                        </LocaleProvider>
                    </div>
                </div>
                <Drawer dataSource={orderData} onDrawClick={this.clickDrawer} details={details} detailData={userDetail} visible={visible} onClose={this.hideDetail}/>
            </div>
        )
    }
}
