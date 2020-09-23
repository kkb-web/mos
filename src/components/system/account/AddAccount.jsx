import {Component} from "react";
import './Account.less';
import {Button, Card, Form, Input, message, Select, Table} from "antd";
import React from "react";
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import history from "../../common/History";
import {urlAccountInsert, urlAccountRole, urlAccountEmail, urlAccountSImei} from "../../../api/accountApi";
import {getRoleList} from "../../../api/commonApi";
import {Link} from "react-router-dom";
//验证name、邮箱、phone
import {nameCheckGlobal, phoneCheckGlobal} from "./Common";
import {connect} from "../../../utils/socket";
import {getToken} from "../../../utils/filter";

const FormItem = Form.Item;

class AddAccountPage extends React.Component{
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
            visible: false,//取消modal显示
            count: 0,//table的行数量
            selectNum: [],//分配设备选择的个数
            optionImeiList: [],
            optionImeiListKey: -1,
            sellers: [],
            disableBtn: false
        };
    };

    preloading = () =>{
        //加载角色数据
        let sendData = {
                size: 1000,
                current: 1,
            },
            _this = this;
       getRoleList(sendData).then(response =>{
            if(response.data.code == 0) {
                _this.setState({
                    optionRoleList: response.data.data,
                })
            }
        }).catch(()=>{
            console.log('获取角色失败')
        })
        //加载设备数据
        urlAccountSImei().then(response=>{
            console.log(response)
            if(response.data.code === 0){
                _this.setState({
                    optionImeiList:response.data.data,
                })
            }
        }).catch(err=>{
            console.log(err,'urlAccountSelectRole')
        })
    };

    componentDidMount () {
        //链接websocket
        connect(getToken('username'));
        //end
        this.preloading();
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
        let sendData={
            email:e.target.value,
        };
        if(sendData.email){
            //检验邮箱是否正确
            if(!(/^[a-zA-Z0-9_-]{1,15}@((kaikeba.com)|(huikedu.com))/).test(e.target.value)){
                this.setState({
                    mailValHint: '请输入有效的开课吧邮箱',
                    mailState: 'error'
                })
            }else{
                urlAccountEmail(sendData).then(response=>{
                    if (response.data.data == true) {
                        this.setState({
                            mailValHint: '该邮箱已注册',
                            mailState: 'error'
                        })
                    } else {
                        this.setState({
                            mailValHint:'',
                            mailState: 'success'
                        })
                    }
                })
            }
        }
    };

    //处理表单取消
    handleOk = () => {
        this.setState({
            visible: false,
        });
        this.props.form.resetFields();
        history.push('/app/authority/accounts');
    };

    handleTipCancel = () => {
        this.setState({
            visible: false,
        });
    };

    //改变分配设备会对表格的行数造成增减的影响
    handleEquipmentChange = (value) =>{
        //获取每个option的index,每次sellers合并选中的sellerIds
        let num = Number(value),
            data = this.state.optionImeiList[num].sellerIds;
        this.setState({
            sellers:this.state.sellers.concat(data)
        });
        //计数如果选中的个数大于0，table则显示，否则hidden
        const { count,selectNum } = this.state;
        this.state.selectNum.push(value);

        this.setState({
            count: count+1,
            selectNum:this.state.selectNum
        });

    };
    //onDeselect
    onDeselect = (value,e) => {
        let tempDeviceId = e.props.data_val;

        const dataSource = [...this.state.sellers];
        let newSelectNum = this.state.selectNum,
            i = newSelectNum.indexOf(value);
        newSelectNum.splice(i,1)
        this.setState({
            selectNum:newSelectNum,
            sellers: dataSource.filter(item => item.deviceId !== tempDeviceId),
        });
    };
    //表单提交
    handleSubmit = () =>{
        let sendData = {},
            tempArr = [],
            imeiData = [{
                deviceIds:[]
            }];
        //转换格式
        if(this.state.sellers.length > 0){
            this.state.sellers && this.state.sellers.map(function(val,idx){
                tempArr.push(val.deviceId)
            })
        }
        imeiData[0].deviceIds = [...new Set(tempArr)];

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!values.realName) {
                this.setState({
                    nameHint: '名称不能为空',
                    nameState: 'error'
                })
            }
            if (!values.phoneVal) {
                this.setState({
                    phoneValHint: '手机号不能为空',
                    phoneState: 'error'
                })
            }
            if (!values.mailVal) {
                this.setState({
                    mailValHint: '邮箱不能为空',
                    mailState: 'error'
                })
            }
            sendData = {
                realname: values.realName,
                mobile: values.phoneVal,
                email: values.mailVal,
                roleId: Number(values.roleVal),
                imei: imeiData
            }
        });

        if(JSON.stringify(sendData) != "{}"){
            this.setState({
                disableBtn: true
            });
            urlAccountInsert(sendData).then(res=>{
                this.setState({
                    disableBtn: false
                });
                if(res.data.code == 0 ){
                    history.push('/app/authority/accounts');
                }else if(res.data.code == 10006){
                    message.error(res.data.msg)
                }else if(res.data.code == 10007){
                    message.error(res.data.msg)
                }else if(res.data.code == 10008){
                    message.error(res.data.msg)
                }else if(res.data.code == 10009){
                    message.error(res.data.msg)
                }else if(res.data.code == 1){
                    message.error(res.data.msg)
                }
            }).catch(() => {
                console.log('新建帐号失败')
            })
        }

    };

    render(){
        //面包屑
        const menus = [{
                    path: '/app/dashboard/analysis',
                    name: '首页'
                },
                {
                    path: '/app/authority/accounts',
                    name: '帐号管理'
                },
                {
                    name: '新建帐号',
                    path: '/app/authority/accounts/add'
                }],
                //input filter
                {getFieldDecorator} = this.props.form,
                FormItemLayout = {
                    labelCol: {span: 7},
                    wrapperCol: {span: 16},
                },
                //selet
                Option = Select.Option,
                {optionRoleList} = this.state;

        const columns =[{
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

        return(
            <div>
                <div className="page-nav">
                    <BreadcrumbCustom paths={menus}/>
                    <p className="title-style">新建帐号</p>
                    <p className="title-describe">帐号创建成功后，默认处于启动状态。</p>
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
                                <Input style={{ width: 300 }}  onBlur={this.BlurOnEmail} placeholder="如:kaikeba@kaikeba.com" />

                            )}
                        </FormItem>
                        <FormItem className="account-form" label="角色" validateStatus={this.state.roleValState}
                                  help={this.state.roleValHint} {...FormItemLayout} hasFeedback >
                            <div id="areaAdd">
                                {getFieldDecorator('roleVal', {
                                    rules: [{required: true, message: '请选择一个角色'}],
                                })(
                                    <Select
                                        showSearch
                                        style={{ width: 300}}
                                        placeholder="请选择相应的角色"
                                        getPopupContainer={() => document.getElementById('areaAdd')}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {optionRoleList && optionRoleList.map(d => <Option key={d.id}>{d.name}</Option>)}
                                    </Select>
                                )}
                                <Link to={'/app/authority/roles/add'}>
                                    <span className="build-new-role">选项中没有，去创建一个新角色</span>
                                </Link>
                            </div>

                        </FormItem>
                        <FormItem className="account-form" label="分配设备" {...FormItemLayout}>
                            <div id="areaImeiAdd">
                                {getFieldDecorator('imeiVal', {
                                    rules: [{required: false, message: '分配设备'}],
                                })(

                                    <Select
                                        mode="multiple"
                                        style={{ width: 300 }}
                                        tokenSeparators={[',']}
                                        onSelect={this.handleEquipmentChange}
                                        placeholder="输入或选择设备的IMEI"
                                        onDeselect={this.onDeselect}
                                        getPopupContainer={() => document.getElementById('areaImeiAdd')}
                                    >
                                        {this.state.optionImeiList && this.state.optionImeiList.map((value,index) => {
                                            return (<Option key={index} data_val={value.deviceId}>{value.imei}   {value.subjectName}</Option>)

                                        })}

                                    </Select>
                                )}
                            </div>

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
                    <Button type="primary" disabled={this.state.disableBtn} onClick={this.handleSubmit}>提交</Button>
                </div>
            </div>

        )
    }
}
const AddAccountInfo = Form.create()(AddAccountPage);
export default AddAccountInfo;
