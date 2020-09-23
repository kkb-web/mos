import {Component} from "react";
import "./Class.less";
import {Table, Card, Badge, Pagination, LocaleProvider, Button, message, Divider} from "antd";
import React from "react";
import {formatDateTime, getToken, vipAuthor} from "../../../../utils/filter";
import {getVipClass} from "../../../../api/vipCourseApi";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import {connect} from "../../../../utils/socket";
import {Link} from "react-router-dom";
import Ellipsis from "ant-design-pro/lib/Ellipsis";

let params = {
    size: 40,
    current: 1,
    descs: ["createTime"],
    ascs: null,
    condition: {
        courseId: null,
        status: null
    }
};

export default class Class extends Component{
    constructor(props) {
        super(props);
        this.state = {
            courseId: parseInt(window.location.pathname.slice(15)),
            selectedRowKeys: [],
            dataAll: '', // 列表数据
            loading: false,
            dataSource: [],
            courseList: [],
            itemId:'',
            classStatus: [{
                value: 0,
                text: '计划中'
            },{
                value: 1,
                text: '招生中'
            },{
                value: 2,
                text: '授课中'
            },{
                value: 3,
                text: '结课'
            }]
        };
    }

    // vip课程下班次列表
    classList = () =>{
        getVipClass(params).then(res =>{
            if (res.data.code === 0){
                this.setState({
                    dataSource: res.data.data.records,
                    loading: false,
                    dataAll: res.data.data
                })
            } else {
                message.error(res.data.msg)
            }
        })
    };

    // 渲染
    componentDidMount(){
        this.setState({
            itemId:this.props.itemId
        });
        params.condition.courseId = this.state.courseId;
        console.log(window.location.pathname, this.state.courseId);
        if(vipAuthor('marketing:vipcourse:class:info', this.props.subjectId)){
            this.classList();
        }
        // //链接websocket
        // connect(getToken('username'));
        // //end
    }

    // 页码相关
    onChangePage = (page, pageSize) =>{
        params.current = page;
        params.size = pageSize;
        if(vipAuthor('marketing:vipcourse:class:info', this.props.subjectId)){
            this.classList();
        }
    };

    // 改变每页条数
    onShowSizeChange = (current, pageSize) => {
        params.current = current;
        params.size = pageSize;
        if(vipAuthor('marketing:vipcourse:class:info', this.props.subjectId)){
            this.classList();
        }
    };

    // 表格总条数
    showTotal = (total) => {
        return `共 ${total} 条数据`;
    };

    // 排序 + 筛选
    changeSore = (record, filters, sorter) => {
        console.log(record, filters, sorter);

        // params.ascs = (sorter.order === "ascend" ? [sorter.field] : null);
        // params.descs = (sorter.order === "ascend" ? null : [sorter.field]);

        params.descs = (sorter.order === "descend" ? [sorter.field] : []);
        params.ascs = (sorter.order === "ascend" ? [sorter.field] : []);
        if (filters.status) {
            params.condition.status = (filters.status.length === 0 ? null : (filters.status.map(index => parseInt(index))));
        }
        // 排序后，恢复排序时，数据应当保持和默认一致；
        let arr = Object.keys(sorter); //此方法为ES6新方法，返回值是对象中属性名组成的数组；
        if(arr.length === 0){
            params.descs = ['createTime'];
        }
        this.classList();
    };

    render () {
        const {subjectId} = this.props;
        const setRenderClass = (id) => {
          this.props.setClassRender(false,id);
        };
        const columns = [{
            title: 'ID',
            dataIndex: 'id',
            render: (dataIndex) => <span>{dataIndex ? dataIndex : '/'}</span>
        }, {
            title: '班次名称',
            dataIndex: 'name',
            width: 120,
            render: (dataIndex) =>  <Ellipsis tooltip lines={1}>{dataIndex ? dataIndex : '/'}</Ellipsis>
        }, {
            title: '描述',
            dataIndex: 'description',
            width: 150,
            render: (dataIndex) => <Ellipsis tooltip lines={2}>{dataIndex ? dataIndex : '/'}</Ellipsis>
        }, {
            title: '状态',
            dataIndex: 'status',
            filters: this.state.classStatus,
            render: (dataIndex) => {
                return <div>
                            <span style={{display: parseInt(dataIndex) === 0 ? 'block' : 'none'}}><Badge status="warning" />计划中</span>
                            <span style={{display: parseInt(dataIndex) === 1 ? 'block' : 'none'}}><Badge status="error"/>招生中</span>
                            <span style={{display: parseInt(dataIndex) === 2 ? 'block' : 'none'}}><Badge status="processing"/>授课中</span>
                            <span style={{display: parseInt(dataIndex) === 3 ? 'block' : 'none'}}><Badge status="success"/>结课</span>
                       </div>
            }
        }, {
            title: 'UV',
            dataIndex: 'uv',
            sorter: (a, b) => a.uv - b.uv,
            render: (dataIndex) => <span>{dataIndex ? dataIndex : '/'}</span>
        }, {
            title: 'PV',
            dataIndex: 'pv',
            sorter: (a, b) => a.pv - b.pv,
            render: (dataIndex) => <span>{dataIndex ? dataIndex : '/'}</span>
        }, {
            title: '报名',
            dataIndex: 'signupCount',
            sorter: (a, b) => a.signupCount - b.signupCount,
            render: (dataIndex) => <span>{dataIndex ? dataIndex : '/'}</span>
        }, {
            title: '渠道',
            dataIndex: 'channelCount',
            sorter: (a, b) => a.channel - b.channel,
            render: (dataIndex) => <span>{dataIndex ? dataIndex : '/'}</span>
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
            render: (text, record) =>
                vipAuthor('marketing:vipcourse:class:manager', subjectId) ?
                    <div className='opera'>
                        <Link to={'/app/vipcourse/' + window.location.pathname.slice(15) +'/' + record.id}>
                            <span style={{color: 'rgb(35, 82, 124)', cursor: 'pointer'}}>编辑</span>
                        </Link>
                        <Divider type="vertical" />
                        <span style={{color: 'rgb(35, 82, 124)', cursor: 'pointer'}} onClick={() => {
                          setRenderClass(record.id);
                        }}>配置营销号</span>
                    </div> :
                    <div>
                        <span style={{color: '#888'}}>编辑</span>
                    </div>

        }];

        return(
            <div style={{margin: "0 30px"}}>
                <Card bordered={false}>
                    <Link style={{display: vipAuthor('marketing:vipcourse:class:manager', subjectId) ? 'inline-block' : 'none'}} to={{pathname:`/app/vipcourse/${window.location.pathname.slice(15)}/add`,state:{ItemId:this.state.itemId}}}><Button icon="plus" type="primary">新建</Button></Link>
                    <div style={{marginTop: '15px'}}>
                        <LocaleProvider locale={zh_CN}>
                            <Table
                                key={record => record.id}
                                rowKey={record => record.id}
                                columns={columns}
                                dataSource={vipAuthor('marketing:vipcourse:class:info', subjectId) ? this.state.dataSource : []}
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
