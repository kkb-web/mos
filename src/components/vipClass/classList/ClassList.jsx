import {Component} from "react";
import "./ClassList.less";
import {Table, Card, Badge, Pagination, LocaleProvider, Col, Select, Row} from "antd";
import React from "react";
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import {formatDateTime, getToken, vipAuthor} from "../../../utils/filter";
import {getClassList, getCourses} from "../../../api/vipCourseApi";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import {connect} from "../../../utils/socket";
import {Link} from "react-router-dom";
import Ellipsis from 'ant-design-pro/lib/Ellipsis';

const Option = Select.Option;

let params = {
    size: 40,
    current: 1,
    descs: ["createTime", "id"],
    ascs: null,
    condition: {}
};

export default class ClassList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            dataAll: '', // 班次列表数据
            loading: false,
            dataSource: [],
            courseList: [],
            classStatus: [
                {value: 0, text: '计划中'},
                {value: 1, text: '招生中'},
                {value: 2, text: '授课中'},
                {value: 3, text: '已结束'},
            ],
            filteredInfo: null
        };
    }

    // 班次列表
    classList = () =>{
        getClassList(params).then(response =>{
            this.setState({
                dataSource: response.data.data.records,
                loading: false,
                dataAll: response.data.data
            })
        })
    };

    // 组件销毁函数
    componentWillUnmount(){
        params = {
            size: 40,
            current: 1,
            descs: ["createTime", "id"],
            ascs: null,
            condition: {}
        };
    };

    // 渲染
    componentDidMount(){
        console.log(vipAuthor('marketing:vipcourse:list', 1), "=========vip权限");
        this.classList();
        this.getCourseList();
        //链接websocket
        connect(getToken('username'));
        //end
    }

    // 页码相关
    onChangePage = (page, pageSize) =>{
        params.current = page;
        params.size = pageSize;
        this.classList();
    };

    // 改变每页条数
    onShowSizeChange = (current, pageSize) => {
        params.current = current;
        params.size = pageSize;
        this.classList();
    };

    // 列表显示总条数
    showTotal = (total) => {
        return `共 ${total} 条数据`;
    };

    // 排序 + 筛选
    changeSore = (record, filters, sorter) => {
        console.log(record, filters, sorter, "======班次列表");
        params.ascs = (sorter.order === "ascend" ? [sorter.field] : null);
        params.descs = (sorter.order === "ascend" ? null : [sorter.field]);
        if (filters.status) {
            params.condition.status = (filters.status.length === 0 ? null : (filters.status.map(index => parseInt(index))));
        }
        this.setState({
            filteredInfo: filters
        });
        // 排序后，恢复排序时，数据应当保持和默认一致；
        let arr = Object.keys(sorter); //此方法为ES6新方法，返回值是对象中属性名组成的数组；
        if(arr.length === 0){
            params.descs = ['createTime'];
        }
        this.classList();
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

    // 课程筛选
    courseChange = (value, e) => {
        params.condition.courseId = parseInt(value);
        this.classList();
        console.log(value, e, "======课程");
    };

    // 班级状态筛选
    classStatusChange = (value, e) => {
        if (value) {
            params.condition.status = [parseInt(value)]
        } else {
            params.condition.status = null
        }
        this.setState({
            filteredInfo: null
        });
        this.classList();
        console.log(value, e, "========班级状态")
    };

    skipSale = (record) => {
        this.props.history.push({pathname: '/app/vipcourse/' + record.courseId + '?page=3', classId: record.id});
    };

    render () {
        let filteredInfo = this.state.filteredInfo || {};
        const columns = [{
            title: 'ID',
            dataIndex: 'id',
            render: (dataIndex) => <span>{dataIndex ? dataIndex : '/'}</span>
        }, {
            title: '班次名称',
            dataIndex: 'name',
            width: 120,
            render: (dataIndex) => <Ellipsis tooltip lines={2}>{dataIndex ? dataIndex : '/'}</Ellipsis>
        }, {
            title: '课程名称',
            dataIndex: 'courseName',
            width: 120,
            render: (dataIndex) => <Ellipsis tooltip lines={2}>{dataIndex ? dataIndex : '/'}</Ellipsis>
        }, {
            title: '班级人数',
            dataIndex: 'signUp',
            sorter: (a, b) => a.signUp - b.signUp,
            render: (dataIndex) => <p style={{textAlign: 'center', marginBottom: 0}}>{dataIndex ? dataIndex : '/'}</p>
        }, {
            title: '状态',
            dataIndex: 'status',
            filters: this.state.classStatus,
            filteredValue: filteredInfo.status || null,
            render: (dataIndex) => {
                return <div>
                            <span style={{display: parseInt(dataIndex) === 0 ? 'block' : 'none'}}><Badge status="warning" />计划中</span>
                            <span style={{display: parseInt(dataIndex) === 1 ? 'block' : 'none'}}><Badge status="error"/>招生中</span>
                            <span style={{display: parseInt(dataIndex) === 2 ? 'block' : 'none'}}><Badge status="processing"/>授课中</span>
                            <span style={{display: parseInt(dataIndex) === 3 ? 'block' : 'none'}}><Badge status="success"/>结课</span>
                       </div>
            }
        }, {
            title: '状态切换时间',
            dataIndex: 'updateStatusTime',
            sorter: (a, b) => a.updateStatusTime - b.updateStatusTime,
            render: (dataIndex) => {
                return dataIndex ? formatDateTime(dataIndex) : '/'
            }
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            sorter: (a, b) => a.createTime - b.createTime,
            render: (dataIndex) => {
                return dataIndex ? formatDateTime(dataIndex) : '/'
            }
        }, {
            title: '操作',
            dataIndex: 'opera',
            key: 'opera',
            width: 130,
            render: (text, record) =>
                vipAuthor('marketing:vipcourse:operation', record.subjectId) ?
                <div>
                    {vipAuthor('marketing:vipcourse:class:manager', record.subjectId) && vipAuthor('marketing:vipcourse:class:info', record.subjectId) ?
                        <Link to={'/app/vipcourse/' + record.courseId +'/' + record.id}>
                            <span className="class-list-text" style={{color: 'rgb(35, 82, 124)', cursor: 'pointer'}}>详情</span>
                        </Link> :
                        <span className="info-class-list" style={{color: '#888'}}>详情</span>}
                    <span className="class-list-text" onClick={this.skipSale.bind(this, record)} style={{color: 'rgb(35, 82, 124)', marginLeft: '10px', cursor: 'pointer'}}>销售情况</span>
                </div> :
                <div>
                    <span style={{color: '#888'}}>详情</span>
                    <span style={{color: '#888', marginLeft: '10px'}}>销售情况</span>
                </div>

        }];

        //modal
        const menus = [
            {
                path: '/app/dashboard/analysis',
                name: '首页'
            },
            {
                path: '/app/vipcourse/list',
                name: 'vip课程'
            },
            {
                path: '/app/vipcourse/class',
                name: '班次列表'
            }
        ];

        const {courseList, classStatus} = this.state;

        return(
            <div >
                <div className="page-nav">
                    <BreadcrumbCustom paths={menus}/>
                    <p className="title-style">班次列表</p>
                </div>
                <Card bordered={false}>
                    <Row gutter={16} justify="center" align="middle" style={{marginBottom: '15px'}}>
                        <Col sm={2} style={{textAlign: 'center', width: '65px', marginTop: '5px'}}>
                            <span>课程：</span>
                        </Col>
                        <Col className="screen-input vip-class-select" id="course_input" offset={0}>
                            <Select
                                showSearch
                                placeholder="选择课程"
                                onChange={this.courseChange}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                getPopupContainer={() => document.getElementById('course_input')}
                            >
                                <Option value={null}>选择课程</Option>
                                {courseList && courseList.map(value => <Option key={value.courseId}>{value.courseName}</Option>)}
                            </Select>
                        </Col>
                    </Row>
                    <Row gutter={16} justify="center" align="middle">
                        <Col sm={2} style={{textAlign: 'center', width: '65px', marginTop: '5px'}}>
                            <span>状态：</span>
                        </Col>
                        <Col className="screen-input vip-class-select" id="class_input" offset={0}>
                            <Select
                                showSearch
                                placeholder="选择班级状态"
                                onChange={this.classStatusChange}
                                getPopupContainer={() => document.getElementById('class_input')}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                <Option value={null}>选择班级状态</Option>
                                {classStatus && classStatus.map(value => <Option key={value.value}>{value.text}</Option>)}
                            </Select>
                        </Col>
                    </Row>
                    <div className="account-table">
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

                    <div style={{overflow: 'hidden',marginTop: '20px'}}>
                        <LocaleProvider locale = {zh_CN}>
                            <Pagination showSizeChanger onShowSizeChange = {this.onShowSizeChange}
                                        onChange = {this.onChangePage}
                                        defaultPageSize = {40}
                                        total = {this.state.dataAll.total}
                                        showTotal = {this.showTotal.bind(this.state.dataAll.total)}
                                        current = {params.current}/>
                        </LocaleProvider>
                    </div>
                </Card>
            </div>

        )
    }
}
