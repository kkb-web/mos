import {Component} from "react";
import "./Account.less";
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
    Row, Input
} from "antd";
import React from "react";
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import history from "../../common/History";
import {formatDateTime, getToken} from "../../../utils/filter";
import {getRoleList} from "../../../api/commonApi";
import {urlAccountList,urlAccountPwd,urlAccountStatusEdit} from "../../../api/accountApi";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import {connect} from "../../../utils/socket";

const Search = Input.Search;

let sendCondition = {};
let sendDataList = {
    size: 40,
    current: 1,
    descs: ["create_time"],
    ascs: null,
    condition:sendCondition
};

export default class AccountList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            dataAll: '', //返回的所有数据
            loading: false,
            dataSource: [],
            rolesList:[],  //角色数据
            disableBtn: false,
            sellerValue: 0,
            statusValue: '',
            userName: ''
        };
    }

    //帐号管理列表
    accountList = () =>{
        urlAccountList(sendDataList).then(response =>{
            this.setState({
                dataSource: response.data.data.records,
                loading: false,
                dataAll: response.data.data,
                disableBtn:false
            })
        }).catch(err =>{
            console.log(err, "urlAccountList");
        })

    };

    componentDidMount(){
        this.accountList();
        this.getRoleListFn();
        //链接websocket
        connect(getToken('username'));
        //end
    }
    componentWillUnmount(){
        sendCondition = {};
        sendDataList = {
            size: 40,
            current: 1,
            descs: ["create_time"],
            ascs: null,
            condition:sendCondition
        };
    }

    //获取角色下拉
    getRoleListFn = () =>{
        getRoleList().then(res=>{
            if(res.data.code == 0){
                this.setState({
                    rolesList:res.data.data
                })
            }
        }).catch(err=>{

        })
    };

    //页码相关
    onChangePage = (page, pageSize) =>{
        sendDataList.current = page;
        sendDataList.size = pageSize;
        this.accountList();
    };
    // 改变每页条数
    onShowSizeChange = (current, pageSize) => {
        sendDataList.current = current;
        sendDataList.size = pageSize;
        this.accountList();
    };

    showTotal = (total) => {
        return `共 ${total} 条数据`;
    };
    //去编辑页面
    toEditAccountPage = (id) =>{
        history.push('/app/authority/accounts/edit/'+id);
    };
    // 排序
    changeSore = (dataIndex, record, sorter) => {
        sendDataList.ascs = (sorter.order === "ascend" ? [sorter.field] : null);
        sendDataList.descs = (sorter.order === "ascend" ? null : [sorter.field]);
        // 排序后，恢复排序时，数据应当保持和默认一致；
        let arr = Object.keys(sorter); //此方法为ES6新方法，返回值是对象中属性名组成的数组；
        if(arr.length == 0){
            sendDataList.descs = ['create_time'];
        }
        this.accountList();
    };

    //重置密码
    confirmPop = (id) => {
        let sendData={
            userId:id
        };

        urlAccountPwd(sendData).then(response =>{
            if(response.data.code==0){
                message.success('新密码以邮件形式发送成功');
            }else if(response.data.code == 1){
                message.error(response.data.msg)
            }
        }).catch(()=>{
            message.error('重置密码失败,请再次点击尝试');
        });
    };

    toAddPage () {
        history.push('/app/authority/accounts/add');
    }

    // 搜索
    handleChangeUserName = (value) => {
        sendCondition.username = value.replace(/\s+/g,"");
        sendDataList.current = 1;
        this.setState({
            loading: true,
            disableBtn: true
        });
        this.accountList();
    };

    // 搜索动态绑定输入框的值
    handleChangeName = (e) => {
        this.setState({
            userName: e.target.value
        });
    };
    // 销售筛选
    chooseSeller = (value, e) => {
        console.log(e.key)
        sendDataList.current = 1;
        if(e.key == 99999){
            sendCondition.roleId = null
        }else {
            sendCondition.roleId = e.key;
            sendCondition.username = null;
        }
        this.setState({
            loading: true,
            sellerValue: value,
            userName:null
        });
        this.accountList();
    };

    // 状态筛选
    chooseStatus = (value, e) => {
        console.log(e.key)
        sendDataList.current = 1;
        if(e.key == 99996){
            sendCondition.status = ''
        }else {
            sendCondition.status = value;
        }
        this.setState({
            loading: true,
            statusValue: value,
            userName:null
        });
        this.accountList();
    };

    render () {
        const columns = [{
            title: '帐号名',
            dataIndex: 'username',
            render: (dataIndex) => dataIndex === null ? <span>/</span> : <span>{dataIndex}</span>
        }, {
            title: '真实姓名',
            dataIndex: 'realname',
            render: (dataIndex) => dataIndex === null ? <span>/</span> : <span>{dataIndex}</span>
        }, {
            title: '手机号',
            dataIndex: 'mobile',
            render: (dataIndex) => dataIndex === null ? <span>/</span> : <span>{dataIndex}</span>
        },
        {
            title: '角色',
            dataIndex: 'rolename',
            render: (dataIndex) => dataIndex === null ? <span>/</span> : <span>{dataIndex}</span>
        },
        {
            title: '营销号数',
            dataIndex: 'sellerCount',
            render: (dataIndex) => dataIndex === null ? <span>/</span> : <span>{dataIndex}</span>
        },{
            title: '登录次数',
            dataIndex: 'loginTimes',
            sorter: (a, b) => a.loginTimes - b.loginTimes,
            render: (dataIndex) => dataIndex === null ? <span>/</span> : <span>{dataIndex}</span>
        },{
            title: '上次登录时间',
            dataIndex: 'lastLoginTime',
            sorter: (a, b) => a.lastLoginTime - b.lastLoginTime,
            render: (dataIndex) => {
                return dataIndex === null ? "/" : formatDateTime(dataIndex)
            }

        },{
            title: '状态',
            dataIndex: 'status',
            key: 'state',
            render: (dataIndex) => {
                return dataIndex === 1 ?
                    <span style={{color: '#008804'}}><Badge status="success" />启用中</span> :
                    <span style={{color: '#ccc'}}><Badge status="default" />未启用</span>
            }
        },
        {
            title: '操作',
            dataIndex: 'opera',
            key: 'opera',
            width: 180,
            render: (text,record) =>
                <div className='opera'>
                    {record.id === 1 || record.id === 2 ?
                        <a href="javascript:;" className="btn-disabled">编辑</a> :
                        <a href="javascript:;" onClick={() => this.toEditAccountPage (record.id)}>编辑</a>}

                    {record.id === 1 || record.id === 2 ?
                        <a href="#" className="btn-reset btn-disabled">重置密码</a> :
                        <Popconfirm title="确定要重置该帐号密码吗？"
                                    onConfirm={() => this.confirmPop(record.id)}
                                    okText="确定" cancelText="取消">
                            <a href="#" className='btn-reset'>重置密码</a>
                        </Popconfirm>}

                    {record.id === 1 || record.id === 2 ?
                        <span className="btn-disabled">禁/启用</span> :
                        (record.status === 0 ?
                            <span style={{color: '#009900'}} data-val="启用" data-id={record.id} onClick={showConfirm}>启用</span> :
                            <span style={{color: '#FF6600'}} data-val="禁用" data-id={record.id}  onClick={showConfirm}>禁用</span>)
                    }


                </div>
        } ];

        //modal
        const confirm = Modal.confirm,
              _this = this,
              menus = [
                    {
                      path: '/app/dashboard/analysis',
                      name: '首页'
                  },
                  {
                      path: '#',
                      name: '系统管理'
                  },
                    {
                        path: '/app/authority/accounts',
                        name: '帐号管理'
                    }
              ];
        function showConfirm (e) {
            let value = e.target.getAttribute("data-val"),
                id = e.target.getAttribute("data-id");
            confirm({
                title: `确定${value}此帐号`,
                content: value == '启用' ? '帐号启用后，即可正常使用该系统。'
                    :'帐号被禁用后，无法登陆该系统，之前产生的数据不受影响。',
                cancelText:'取消',
                okText:'确定',
                onOk(){
                    let status = null;
                    value == '启用' ? status = 1 : status = 0;
                    let sendData = {
                        id: Number(id),
                        status: Number(status)
                    };

                    urlAccountStatusEdit(sendData).then(response=>{
                        //更改启用或者禁用状态
                        if(response.data.code === 0){
                            _this.accountList();
                        }else if(response.data.code == 10001){
                            message.error(response.data.msg)
                        }else if(response.data.code == 400){
                            message.error(response.data.msg)
                        }
                    }).catch(err =>{
                        console.log('urlAccountStatusEdit',err)
                    })
                },
            });
        };
        const {Option} = Select;
        const { rolesList,userName} = this.state;
        return(
            <div className="AccountList">
                <div className="page-nav">
                    <BreadcrumbCustom paths={menus}/>
                    <p className="title-style">帐号管理</p>
                </div>
                <Card bordered={false}>
                    <Row gutter={16}>
                        <Col sm={2} style={{marginTop: '3px'}}>
                            <Button icon="plus" type="primary" onClick={this.toAddPage} >新建</Button>
                        </Col>
                        <Col className="gutter-row" id="channellists" sm={6} style={{marginTop: '3px'}}>
                            <Select
                                style={{width: '260px'}}
                                defaultValue={0}
                                value={this.state.sellerValue}
                                onChange={this.chooseSeller}
                                getPopupContainer={() => document.getElementById('channellists')}
                            >
                                <Option key="99999" value={0}>选择角色</Option>
                                {
                                    rolesList && rolesList.map((value, index) => {
                                        return (<Option key={value.id}
                                                        value={index + 1}>{value.name}</Option>)
                                    })
                                }
                            </Select>
                        </Col>
                        <Col className="search-input" sm={2}
                             style={{textAlign: 'right', width: '90px', marginTop: '5px'}}>
                            <span>状态：</span>
                        </Col>
                        <Col className="gutter-row" id="statusLists" sm={6} style={{marginTop: '3px'}}>
                            <Select
                                style={{width: '140px'}}
                                defaultValue={''}
                                value={this.state.statusValue}
                                onChange={this.chooseStatus}
                                getPopupContainer={() => document.getElementById('statusLists')}
                            >
                                <Option key="99996" value={''}>全部</Option>
                                <Option key="99997" value={0}>禁用</Option>
                                <Option key="99998" value={1}>启用</Option>

                            </Select>
                        </Col>
                        <Col className="gutter-row sale-label label" sm={7} style={{marginTop: '3px'}}>
                            <Search
                                placeholder="搜索账号/姓名"
                                onSearch={this.handleChangeUserName}
                                onChange={this.handleChangeName}
                                enterButton
                                value={userName}
                                disabled={this.state.disableBtn}
                            />
                        </Col>
                    </Row>
                    <div className="account-table">
                        <Table
                            key = {record => record.id}
                            rowKey = {record => record.id}
                            columns = {columns}
                            dataSource = {this.state.dataSource}
                            loading = {this.state.loading}
                            pagination = {false}
                            rowSelection = {null}
                            onChange={this.changeSore}
                            locale = {{emptyText: '帐号列表目前为空哦~'}}
                        />
                    </div>

                    <div style={{overflow: 'hidden',marginTop: '20px'}}>
                        <LocaleProvider locale = {zh_CN}>
                            <Pagination showSizeChanger onShowSizeChange = {this.onShowSizeChange}
                                        onChange = {this.onChangePage}
                                        defaultPageSize = {40}
                                        total = {this.state.dataAll.total}
                                        showTotal = {this.showTotal.bind(this.state.dataAll.total)}
                                        current = {sendDataList.current}/>
                        </LocaleProvider>
                    </div>
                </Card>
            </div>

        )
    }
}
