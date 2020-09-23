import {Component} from "react";
import "./Account.less";
import {Button, Card, Form, Input, message, Modal, Select, Table} from "antd";
import React from "react";
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import history from "../../common/History";
import {urlAccountInfo, urlAccountRole, urlAccountEdit, urlEditAccountSImei} from "../../../api/accountApi";
import {getRoleList} from "../../../api/commonApi";
import {Link} from "react-router-dom";
import {nameCheckGlobal, phoneCheckGlobal} from "./Common";
import {connect} from "../../../utils/socket";
import {getToken} from "../../../utils/filter";

const FormItem = Form.Item;

class EditAddAccountPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            nameHint: '',//真实名字
            nameState: '',
            phoneState: '',//手机号
            phoneValHint: '',
            mailState: '',//开课吧邮箱
            mailValHint: '',
            roleValHint: '',//角色
            roleValState: '',
            optionRoleList: [],
            count: 0,//table的行数量
            selectNum: [],//分配设备选择的个数
            optionImeiList: [],
            dataSource: [],
            userInfo: {},
            optionImeiListKey: -1,
            sellers: [],
            arr: [],
            rolename: '',
            changeRoleName: '',
            changeImeiId: [],
            judgeImie: [],//判断是否已更改imei
            modalVisible: false,//modal弹框显示
            disableBtn: false
        };
    };
    //获取用户信息和角色
    componentWillMount () {
        //获取角色列表
        let sendDataRole = {
            size: 1000,
            current: 1,
        };
        getRoleList(sendDataRole).then(response =>{
            if(response.data.code == 0){
                this.setState({
                    optionRoleList:response.data.data,
                })
            }

        }).catch(() =>{
            console.log('获取角色失败')
        })
        //获取用户信息
        let sendData = {
                id:this.props.match.params.id
            },
            _this = this;
        urlAccountInfo(sendData).then(response=>{
            if(response.data.code == 0){
                _this.setState({
                    userInfo:response.data.data,
                    optionImeiList: response.data.data.imei,
                    rolename:response.data.data.rolename,

                });
                this.props.form.setFieldsValue({
                    realName: response.data.data.realname,
                    phoneVal: response.data.data.mobile,
                    mailVal:response.data.data.email,
                });
                let imeiList = [];
                //判断imei有多少项，就要加载几次handleEquipmentChange
                response.data && response.data.data && response.data.data.imei && response.data.data.imei.map(function(val,idx){
                    imeiList.push(idx.toString())
                    val.sellerIds && val.sellerIds.map((valson,idxson)=>{
                        if (!valson['index']) {
                            valson['index'] = idx;
                        }
                    })
                    _this.handleEquipmentChange(idx);
                })
                this.setState({
                    arr: imeiList
                })
                console.log(imeiList,'imeiList')
            }else if(response.data.code == 10001){
                message.error(response.data.msg)
            }

        }).catch(err=>{
            console.log(err,'urlAccountInfo')

        })
    };

    componentDidMount () {
        //链接websocket
        connect(getToken('username'));
        //end
    };

    nameCheck = (e) =>{
        let nameCheckData=nameCheckGlobal(e.target.value);
        this.setState({
            nameHint: nameCheckData.nameHint,
            nameState: nameCheckData.nameState
        })
    };

    phoneCheck = (e) =>{
        let phoneCheckData=phoneCheckGlobal(e.target.value);
        this.setState({
            phoneValHint: phoneCheckData.phoneValHint,
            phoneState: phoneCheckData.phoneState
        })

    };

    BlurOnEmail = (e) =>{
        if(!(/^[a-zA-Z0-9_-]{1,15}@((kaikeba.com)|(huikedu.com))/).test(e.target.value)){
            this.setState({
                mailValHint: '请输入有效的开课吧邮箱',
                mailState: 'error'
            })
        }else{
            this.setState({
                mailValHint: '',
                mailState: 'success'
            })
        }

    };

    onFocus = () =>{
        let _this = this,
            sendData = {
                id: this.props.match.params.id
            };
        urlEditAccountSImei(sendData).then(response=>{
            if(response.data.code==0){
                //判断imei有多少项，就要加载几次handleEquipmentChange
                response.data && response.data.data && response.data.data.map(function(val,idx){
                    val.sellerIds && val.sellerIds.map((valson,idxson)=>{
                        if (!valson['index']) {
                            valson['index'] = idx;
                        }
                    })
                })
                _this.setState({
                    optionImeiList:response.data.data,
                })
            }
        }).catch(err=>{
            console.log(err,'urlAccountSelectRole')
        })
    };

    //改变分配设备会对表格的行数造成增减的影响
    handleEquipmentChange = (value) =>{
        console.log(value,'handleEquipmentChange',this.state.optionImeiList,'dasfsd',this.state.sellers)
        //获取每个option的index,每次sellers合并选中的sellerIds
        let num = Number(value),
            data = this.state.optionImeiList[num].sellerIds;
        console.log(num,data,'handleEquipmentChange')
        let isExit = false;
        data && data.map((val)=>{
            this.state.sellers && this.state.sellers.map((vals) =>{
                if(val.sellerId == vals.sellerId ){
                    isExit = true;
                    return false
                }
            });
            if (isExit == true){
                return false;
            }
        });
        if (isExit == true) {
            return false;
        }



        data && data.map((val)=>{
            this.state.sellers && this.state.sellers.map((vals,idxs)=>{
                if(val.sellerId == vals.sellerId ){
                    console.log(idxs,'idxs')
                    data.splice(idxs,1);
                    console.log(data)
                }
            });
        });
        console.log(data,'data')




        this.setState({
            sellers:this.state.sellers.concat(data)
        });
        console.log(this.state.sellers,'slllll')

        //计数如果选中的个数大于0，table则显示，否则hidden
        const { count,selectNum } = this.state;
        selectNum.push(value)

        this.setState({
            count: count + 1,
            selectNum:selectNum,
        });

    };
    //onDeselect
    onDeselect = (value) => {
        console.log(value,'onDeselect')
        let temp_val = Number(value);
        if(temp_val >= 0){
            const dataSource = [...this.state.sellers];
            let newSelectNum = this.state.selectNum,
                i = newSelectNum.indexOf(value);
            console.log(dataSource,i,'几个值？')
            newSelectNum.splice(i,1)
            console.log(newSelectNum,'newSelectNum')
            this.setState({
                selectNum:newSelectNum,
                sellers: dataSource.filter(item => item.index != temp_val),
            });
            console.log('newSelectNum',this.state.sellers)
        }

    };
    handleRoleChange = (value) =>{
        this.setState({
            changeRoleName : value
        })

    };

    //处理修改设备和营销号的提示
    handleChangeImei = (value) =>{
        let valueAll = value;
        return valueAll;
        let tempChangeIds=[];
        if(value.length>0){
            value.map((val)=>{
                val=parseInt(val);
                tempChangeIds.push(val)
            })
        };
        console.log(tempChangeIds,'tempChangeIds')
        if(tempChangeIds){
            this.setState({
                changeImeiId:tempChangeIds

            })
        };
        console.log(this.state.changeImeiId,'changeImeiId')
    };
    //弹框消失
    hideModal = () => {
        this.setState({
            modalVisible: false,
        });
    };

    //弹框展示
    showModal = () => {
        this.setState({
            modalVisible: true,
        });
    };
    //比较设备是否相同
    equar = (a, b) => {
        // 判断数组的长度
        if (a.length !== b.length) {
            this.showModal();
            return false;
        } else {
            // 循环遍历数组的值进行比较
            for (let i = 0; i < a.length; i++) {
                if (a[i] !== b[i]) {
                    this.showModal();
                    return false;
                }
            }
        }
        return true;
    };
    //表单提交前监测
    handleBeforeSubmit = () =>{
        //提交时如果当前的表单有变化则给出提示，提示确定后，提交，提示取消，继续留在当前页面,
        //如果没有修改，之前返回列表
        let sendDataDetail = {
                id:this.props.match.params.id
            },
            _this = this,
            aArrTemp = this.state.arr,
            aArr = [],
            bArr = this.state.selectNum;

        if(aArrTemp.length>0){
            aArrTemp.map((val)=>{
                val=parseInt(val);
                aArr.push(val)
            });
        }
        this.setState({
            disableBtn: true
        });
        urlAccountInfo(sendDataDetail).then(response => {
            this.setState({
                disableBtn: false
            });
            if(response.data.code == 0){
                let sourcevalues = ({
                    realName: response.data.data.realname,
                    phoneVal: response.data.data.mobile,
                    mailVal:response.data.data.email,
                    roleVal:response.data.data.rolename,
                });
                let fieldvalues = _this.props.form.getFieldsValue();
                //判断设备
                this.equar(aArr,bArr)
                //判断除设备外的信息
                for(let i in sourcevalues){
                    if(sourcevalues[i] !== fieldvalues[i]){
                        _this.showModal();
                        return false;
                    }
                }
            }
            if(this.equar(aArr,bArr)){
                history.push('/app/authority/accounts');
            }

        }).catch(err=>{
            console.log(err,'urlAccountInfo')
        })

    };

    //表单取消
    handleCancel = () => {
        history.push('/app/authority/accounts');
    };
    //提示确定
    handleOk = () => {
        let sendData ={},
            tempId=null,
            tempArr=[],
            roleVal =  this.state.changeRoleName ? this.state.changeRoleName :this.state.userInfo.rolename ,
            imeiData = [{
                deviceIds:this.state.changeImeiId ? this.state.changeImeiId : []
            }];
        this.state.optionRoleList && this.state.optionRoleList.map((val,idx)=>{
            if(roleVal == val.name){
                tempId = val.id;
                return false;
            }
        });

        if(this.state.sellers.length>0){
            this.state.sellers.map(function(val){
                tempArr.push(val.deviceId)
            })
        }
        imeiData[0].deviceIds = [...new Set(tempArr)];

        this.props.form.validateFields((err, values) => {
            sendData = {
                id:Number(this.props.match.params.id),
                realname: values.realName,
                mobile: values.phoneVal,
                email: values.mailVal,
                roleId: Number(tempId),
                imei:imeiData,
            }
        });
        console.log(sendData,'sendData')
        //判断from内的值是否有变化
        if(sendData.realname.length>10){
            return false
        }else if(JSON.stringify(sendData) != "{}"){
            urlAccountEdit(sendData).then(res=>{
                if(res.data.code == 0){
                    this.hideModal();
                    history.push('/app/authority/accounts');
                }else if(res.data.code == 10002){
                    message.error(res.data.msg)
                }else if(res.data.code == 10006){
                    message.error(res.data.msg)
                }else if(res.data.code == 10007){
                    message.error(res.data.msg)
                }else if(res.data.code == 10008){
                    message.error(res.data.msg)
                }else if(res.data.code == 10009){
                    message.error(res.data.msg)
                }else if(res.data.code == 10010){
                    message.error(res.data.msg)
                }else if(res.data.code == 0){
                    message.error(res.data.msg)
                }

            }).catch(() => {
                console.log('编辑帐号失败')
            })
        }
    };
    //提示取消
    handleTipCancel = () => {
        this.hideModal();
    }

    render(){

        //面包屑
        const menus = [
                {
                    path: '/app/dashboard/analysis',
                    name: '首页'
                },
                {
                    path: '/app/authority/accounts',
                    name: '帐号管理'
                },
                {
                    name: '编辑帐号',
                    path: '/app/authority/accounts/edit/'+this.props.match.params.id
                }
            ],
            //input filter
            {getFieldDecorator} = this.props.form,
             FormItemLayout = {
                labelCol: {span: 7},
                wrapperCol: {span: 16},
            },
            //selet
            Option = Select.Option,
            {arr,rolename} = this.state;

        const columns=[{
                    title: '当前选中设备包含的营销号信息如下：',
                    dataIndex: 'info',
                    key: 'info',
                    render: (text,record) =>
                    <div>
                    <p>营销号名称：{record.wechat}</p>
                    <p>IMEI：{record.imei}</p>
                    </div>
                },{
                    title: '',
                    dataIndex: 'nothing',
                    key: 'nothing',
                    render: (text,record) =>
                    <div>
                    <p>学科-编号：{record.subjectName}-{record.num}</p>
                    </div>
                }];

        columns.map((col) => {
            return {
                ...col,
                onCell: record => ({
                    record,
                    dataIndex: col.dataIndex,
                }),
            };
        });

        const children = [];
        this.state.optionImeiList && this.state.optionImeiList.map((value,index) => {
            children.push(<Option key={index} data_val={value.deviceId}>{value.imei}{value.subjectName}</Option>)
        });

        return(

            <div>
                <div className="page-nav">
                    <BreadcrumbCustom paths={menus}/>
                    <p className="title-style">编辑帐号</p>
                    <p className="title-describe">帐号信息变更后，该帐号需要再次登录系统才可正常使用。</p>
                </div>

                <Card title="基本信息" bordered={false}>
                    <Form layout="horizontal" style={{paddingBottom: '20px'}}>
                        <FormItem className="account-form" label="真实姓名" validateStatus={this.state.nameState}
                                  help={this.state.nameHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('realName', {
                                rules: [{required: true, message: '请输入真实姓名'}],
                            })(
                                <Input placeholder="请输入真实姓名" onChange={this.nameCheck} style={{ width: 300 }}/>
                            )}
                        </FormItem>
                        <FormItem className="account-form" label="个人手机号" validateStatus={this.state.phoneState}
                                  help={this.state.phoneValHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('phoneVal', {
                                rules: [{required: true, message: '请输入有效的手机号'}],
                            })(
                                <Input placeholder="个人手机号" onBlur={this.phoneCheck} style={{ width: 300 }}/>
                            )}
                        </FormItem>

                        <FormItem className="account-form" label="开课吧邮箱" validateStatus={this.state.mailState}
                                  help={this.state.mailValHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('mailVal', {
                                rules: [{required: true, message: '请输入有效的开课吧邮箱'}],
                            })(
                                <Input style={{ width: 300 }} placeholder="如:kaikeba@kaikeba.com" onBlur={this.BlurOnEmail}/>

                            )}
                        </FormItem>
                        <FormItem className="account-form" label="角色" validateStatus={this.state.roleValState}
                                  help={this.state.roleValHint} {...FormItemLayout} hasFeedback>
                            <div id="areaAdd">
                                {getFieldDecorator('roleVal', {
                                    initialValue: rolename,
                                    rules: [{required: true, message: '请选择一个角色'}],
                                })(
                                    <Select
                                        showSearch
                                        style={{ width: 300}}
                                        placeholder="请选择相应的角色"
                                        onChange={this.handleRoleChange}
                                        getPopupContainer={() => document.getElementById('areaAdd')}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {this.state.optionRoleList && this.state.optionRoleList.map(d => <Option key={d.id} value={d.name}>{d.name}</Option>)}
                                    </Select>
                                )}
                                <Link to={'/app/authority/roles/add'}>
                                    <span className="build-new-role">选项中没有，去创建一个新角色</span>
                                </Link>
                            </div>
                        </FormItem>
                        <FormItem className="account-form" label="分配设备" {...FormItemLayout} >

                            {this.state.arr.length > 0 &&
                                <div id="areaImei">
                                    <Select
                                        mode="multiple"
                                        style={{ width: 300 }}
                                        onSelect={this.handleEquipmentChange}
                                        placeholder="输入或选择设备的IMEI"
                                        onDeselect={this.onDeselect}
                                        defaultValue={arr}
                                        onFocus={this.onFocus}
                                        onChange={this.handleChangeImei}
                                        getPopupContainer={() => document.getElementById('areaImei')}
                                    >
                                        {children}
                                    </Select>
                                </div>
                            }
                            {this.state.arr.length <= 0 &&
                            <div id="areaImei">
                                <Select
                                    mode="multiple"
                                    style={{ width: 300 }}
                                    onSelect={this.handleEquipmentChange}
                                    placeholder="输入或选择设备的IMEI"
                                    onDeselect={this.onDeselect}
                                    onFocus={this.onFocus}
                                    onChange={this.handleChangeImei}
                                    getPopupContainer={() => document.getElementById('areaImei')}
                                >
                                    {children}
                                </Select>
                            </div>
                            }
                            <div className="equipment-marketing-table"
                                 style={{visibility: this.state.selectNum.length >0  ? 'visible' : 'hidden'}}>
                                <Table
                                    key ={record => record.sellerId}
                                    rowKey={record => record.sellerId}
                                    size="small"
                                    dataSource={this.state.sellers}
                                    columns={columns}
                                    pagination={false}
                                />
                            </div>
                        </FormItem>
                    </Form>
                </Card>
                {/*提交btn*/}
                <div className="upload-title bottom-btn">
                    <Button type="default" style={{marginRight: '20px'}} onClick={this.handleCancel}>取消</Button>
                    <Modal
                        title="提示"
                        visible={this.state.modalVisible}
                        onOk={this.handleOk}
                        onCancel={this.handleTipCancel}
                        okText="确定"
                        cancelText="取消"
                    >
                        <p>系统检测到你正在修改这个帐号的相关信息，确定要继续吗？</p>
                    </Modal>
                    <Button disabled={this.state.disableBtn} type="primary" onClick={this.handleBeforeSubmit}>提交</Button>
                </div>
            </div>

        )
    }
}
const EditAddAccountInfo = Form.create()(EditAddAccountPage);
export default EditAddAccountInfo;
