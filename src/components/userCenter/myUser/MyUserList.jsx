import {Component} from "react";
import {Table, Pagination, LocaleProvider, Button, message, Col, Input, Row, Select} from "antd";
import React from "react";
import {formatDateDay,getToken} from "../../../utils/filter";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import {connect} from "../../../utils/socket";
import {Link} from "react-router-dom";
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import {getMyUserDetail, getMyUserList, getCourses} from "../../../api/userCenterApi";
import "./MyUserList.less"
import Drawer from './Drawer'
import Ellipsis from "ant-design-pro/lib/Ellipsis";
import {source} from "../source";

const Option = Select.Option;

let params = {
    size: 40,
    current: 1,
    descs: ["createTime"],
    // ascs: null,
    condition: {}
};

export default class MyUserList extends Component{
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
            courseValue: undefined,
            sourceValue: undefined
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

    // 我的用户列表
    myUserList = () =>{
        this.setState({
            loading: true
        });
        getMyUserList(params).then(res =>{
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

    // 渲染
    componentDidMount(){
        params.condition = {};
        params.current = 1;
        params.size = 40;
        this.getCourseList();
        this.myUserList();
        //链接websocket
        connect(getToken('username'));
        //end
    }

    // 页码相关
    onChangePage = (page, pageSize) =>{
        params.current = page;
        params.size = pageSize;
        this.myUserList();
    };

    // 改变每页条数
    onShowSizeChange = (current, pageSize) => {
        params.current = current;
        params.size = pageSize;
        this.myUserList();
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
        if(arr.length === 0){
            params.descs = ['createTime'];
        }
        this.myUserList();
    };

    // 点击详情查看详情
    showDetail = (record, e) => {
        e.stopPropagation();
        getMyUserDetail(record.id).then(res => {
            console.log(res.data.data, "======用户详情");
            if (res.data.code === 0) {
                this.setState({
                    visible: true,
                    userDetail: res.data.data
                });
            } else {
                message.error(res.data.msg)
            }
        })
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
        params.condition.intention = value;
        this.setState({
            courseValue: value
        });
        this.myUserList();
    };

    // 来源筛选
    sourceChange = (value, e) => {
        params.condition.value = value;
        this.setState({
            sourceValue: value
        });
        this.myUserList();
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
        console.log(this.state.searchValue.replace(/(^\s*)|(\s*$)/g, ""));
        params.condition.search = this.state.searchValue.replace(/(^\s*)|(\s*$)/g, "");
        params.current = 1;
        this.myUserList();
    };

    // 全部重置
    searchReset = () => {
        this.setState({
            resetBtn: true,
            searchValue: null,
            courseValue: undefined,
            sourceValue: undefined
        });
        params.condition.search = null;
        params.condition.value = null;
        params.condition.intention = null;
        this.myUserList();
    };

    // 跳转到添加订单
    pushOrder = (e) => {
        e.stopPropagation();
        this.props.history.push({pathname: '/app/ordercenter/all', state: 'add'});
    };

    // 跳转编辑页面
    pushEditUser = (record, e) => {
        e.stopPropagation();
        this.props.history.push({pathname: '/app/usercenter/myuser/' + record.id})
    };

    render () {
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
            title: '销售',
            dataIndex: 'sellerName',
            render: (dataIndex) => <span>{dataIndex ? dataIndex : '/'}</span>
        }, {
            title: '添加好友时间',
            dataIndex: 'friendTime',
            render: (dataIndex) => {
                return dataIndex ? formatDateDay(dataIndex) : '/'
            }
        }, {
            title: '意向课程',
            dataIndex: 'intentionName',
            width: 240,
            render: (dataIndex) => <Ellipsis tooltip lines={2}>{dataIndex ? dataIndex : '/'}</Ellipsis>
        }, {
            title: '操作',
            dataIndex: 'opera',
            key: 'opera',
            render: (text, record) =>
                <div className="user-opera">
                    <span className="opera-text">详情</span>
                    <span className="opera-text" onClick={this.pushEditUser.bind(this, record)}>编辑</span>
                    <span className="opera-text" onClick={this.pushOrder}>创建订单</span>
                </div>


        }];

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
                name: '我的用户'
            }
        ];

        let {courseValue, courseList, sourceValue} = this.state;

        return(
            <div  onClick={this.hideDetail}>
                <div className="page-nav">
                    <BreadcrumbCustom paths={menus}/>
                    <p className="title-style">我的用户</p>
                    <p className="title-describe">销售手动录入的意向用户和公开课带来的私海用户，已成单用户的请在「成单用户」列表查看。</p>
                </div>
                <div className="formBody">
                    <div>
                        <Row className="my-user-search" gutter={16}>
                            <Col sm={2} style={{textAlign: 'right', width: '90px', marginTop: '5px'}}>
                                <span>意向课程：</span>
                            </Col>
                            <Col sm={5} style={{padding: 0}} id="user_course_input">
                                <Select
                                    showSearch
                                    value={courseValue}
                                    placeholder="请选择"
                                    style={{width: '100%'}}
                                    onChange={this.courseChange}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    getPopupContainer={() => document.getElementById('user_course_input')}
                                >
                                    <Option value={null}>请选择</Option>
                                    {courseList && courseList.map((value, index) => <Option key={index} value={parseInt(value.id)}>{value.name}</Option>)}
                                </Select>
                            </Col>
                            <Col sm={2} style={{textAlign: 'right', width: '100px', marginTop: '5px'}}>
                                <span>用户来源：</span>
                            </Col>
                            <Col sm={5} style={{padding: 0}} id="user_source_input">
                                <Select
                                    showSearch
                                    mode="multiple"
                                    placeholder="请选择"
                                    style={{width: '100%'}}
                                    onChange={this.sourceChange}
                                    value={sourceValue}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    getPopupContainer={() => document.getElementById('user_source_input')}
                                >
                                    {source().map((value, index) => <Option key={index} value={value}>{value}</Option>)}
                                </Select>
                            </Col>
                        </Row>
                        <Row className="my-user-search" gutter={16} style={{marginTop: '20px'}}>
                            <Col className="search-input" sm={2}
                                 style={{textAlign: 'center', width: '90px', marginTop: '5px'}}>
                                <span>查找用户：</span>
                            </Col>
                            <Col className="" sm={6} offset={0} style={{padding: '0'}}>
                                <Input autoComplete="off" value={this.state.searchValue} onChange={this.searchContent} placeholder="姓名/手机号/微信昵称"/>
                            </Col>
                            <Col className="" sm={9}>
                                <Button type="primary" style={{marginRight: '12px', marginLeft: '10px'}}
                                        onClick={this.searchUser} disabled={this.state.disableBtn}>查询</Button>
                                <Button type="default" onClick={this.searchReset}
                                        disabled={this.state.resetBtn}>全部重置</Button>
                            </Col>
                        </Row>
                        <Link to={'/app/usercenter/myuser/add'}>
                            <Button style={{marginTop: '20px'}} type="primary">添加用户</Button>
                        </Link>
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
                                dataSource={this.state.dataSource}
                                loading={this.state.loading}
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
                                        total={this.state.dataAll.total}
                                        showTotal={this.showTotal.bind(this.state.dataAll.total)}
                                        current={params.current}/>
                        </LocaleProvider>
                    </div>
                </div>
                <Drawer onDrawClick={this.clickDrawer} detailData={this.state.userDetail} visible={this.state.visible} onClose={this.hideDetail}/>
            </div>
        )
    }
}
