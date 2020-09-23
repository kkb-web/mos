import {Component} from "react";
import React from "react";
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import { Row,Input,Button,Modal,Form,message} from "antd";
import {urlSubList, urlAddSub ,urlVerificationName,
    urlVerificationCode ,urlSubDetail ,urlEditSub} from "../../../api/subjectApi";
import FormTable from "./common/SubjectTable";
import "./Subject.less";
import {connect} from "../../../utils/socket";
import {getToken} from "../../../utils/filter";


const FormItem = Form.Item;
let sendDataList = {
    "size": 1000,
    "current": 1,
    "descs": null,
    "ascs": ["id"]
};

class Subject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            subjectInfo: {},
            visible: false, //编辑学科窗口
            addvisible: false, //新建学科窗口
            verificationName: false,
            verificationCode: false,
            titleHint: '',
            titleState: '',
            subjectCodeState: '',
            subjectCodeHint: '',
            subjectId: -1,
            disableBtn: false,
            editBtn: false
        };
    }
    getSubInfo = () => {
        urlSubList(sendDataList).then(res=>{
            this.setState({
                dataSource:res.data.data.records
            })
        }).catch(err=>{
            console.log(err,'urlSubList')
        })
    };
    componentDidMount () {
        this.getSubInfo();
        //链接websocket
        connect(getToken('username'));
        //end
    };
    //新建学科name校验
    nameCheck = (e) =>{
        if (e.target.value.length === 0) {
            this.setState({
                titleHint: '学科名称不能为空',
                titleState: 'error'
            })
        } else if (e.target.value.length > 50) {
            this.setState({
                titleHint: '学科名称少于50个字',
                titleState: 'error'
            })
        }else{
            this.setState({
                titleHint: '',
                titleState:''
            })
        }
    };

    //新建学科code校验
    codeCheck = (e) =>{
        if (e.target.value.length === 0) {
            this.setState({
                subjectCodeHint: '学科code不能为空',
                subjectCodeState: 'error'
            })
        } else if (e.target.value.length > 10) {
            this.setState({
                subjectCodeHint: '学科code少于10个字',
                subjectCodeState: 'error'
            })
        } else {
            this.setState({
                subjectCodeHint: '',
                subjectCodeState:''
            })
        }
    };

    //编辑
    editClick = (key) =>{
        this.setState({
            visible: true,
            subjectId:key,
        });
        let sendData={
            id:key
        }
        urlSubDetail(sendData).then(res=>{
            this.setState({
                subjectInfo:res.data.data,
            });
            this.props.form.setFieldsValue({
                AddsubjectTitle: res.data.data.name,
                AddsubjectCode: res.data.data.code
            });
        }).catch(err=>{
            console.log(err,'urlSubDetail')
        })
    };

    addSubject = () =>{
        this.setState({
            addvisible: true,
            subjectCodeHint: '',
            subjectCodeState:'',
            titleHint: '',
            titleState:'',
        });
    };

    handleOk = () => {
        let sendData ={},
            _this=this;
        this.props.form.validateFields((err, values) => {
            sendData = {
                name: values.AddsubjectTitle,
                id:this.state.subjectId,
            }
        });

        if(!sendData.name){
            this.setState({
                titleHint: '请填写学科名称',
                titleState: 'error'
            });
            return false;
        }else if(sendData.name.length > 50){
            this.setState({
                titleHint: '学科名称少于50个字',
                titleState: 'error'
            });
            return false;
        }

        //验证学科名称是否存在
        let p1 = new Promise(function (resolve) {
            let sendDataName = {
                name:sendData.name
            };
            urlVerificationName(sendDataName).then(res=>{
                if(res.data.code == 10002){
                    _this.setState({
                        titleHint: '学科名称已存在',
                        titleState: 'error'
                    });

                }else if(res.data.code == 0){
                    _this.setState({
                        subjectCodeHint: '',
                        titleState: 'success'
                    });
                    resolve(res.data.code)
                }

            }).catch(err=>{
                console.log(err,'urlVerificationName')
            })
        });
        p1.then(function (data) {
            if(data == 0) {
                _this.setState({
                    editBtn: true
                });
                urlEditSub(sendData).then(res=>{
                    _this.setState({
                        editBtn: false
                    });
                    if(res.data.code == 0){
                        _this.setState({
                            visible: false,
                        });
                        message.success('操作成功');
                        _this.getSubInfo()
                    }else if(res.data.code == 10002){
                        message.error(res.data.msg)
                    }else if(res.data.code == 400){
                        message.error(res.data.msg)
                    }else if(res.data.code == 1){
                        message.error(res.data.msg)
                    }
                }).catch(err=>{
                    console.log(err,'urlEditSub')
                })
            }
        })
    };

    handleCancel = () =>{
        this.setState({
            visible: false,
            addvisible: false,
        });
    };
    //新建提交data
    handleOkAdd = () => {
        let sendData ={},
            _this = this;
        this.props.form.validateFields((err, values) => {
            sendData = {
                name: values.AddsubTitle,
                code: values.AddsubCode,
            }
        });
        if(!sendData.name){
            this.setState({
                titleHint: '请填写学科名称',
                titleState: 'error'
            });
            return false;
        }else if(sendData.name.length > 50){
            this.setState({
                titleHint: '学科名称少于50个字',
                titleState: 'error'
            });
            return false;
        }
        if(!sendData.code){
            this.setState({
                subjectCodeHint: '请填写学科code',
                subjectCodeState: 'error'
            })
            return false
        }else if(sendData.code.length > 10){
            this.setState({
                subjectCodeHint: '学科code少于10个字',
                subjectCodeState: 'error'
            });
            return false;
        }

        //验证学科名称是否存在
        let p1 = new Promise(function (resolve) {
            let sendDataName = {
                name:sendData.name
            };
            urlVerificationName(sendDataName).then(res=>{
                if(res.data.code == 10002){
                    _this.setState({
                        titleHint: '学科名称已存在',
                        titleState: 'error'
                    });

                }else if(res.data.code == 0){
                    _this.setState({
                        subjectCodeHint: '',
                        titleState: 'success'
                    });
                    resolve(res.data.code)
                }

            }).catch(err=>{
                console.log(err,'urlVerificationName')
            })
        });
        //验证学科code是否存在
        p1.then(function (data) {
            if(data == 0) {
                return new Promise(function (resolve) {
                    let sendDataCode = {
                        code:sendData.code
                    };
                    urlVerificationCode(sendDataCode).then(res=>{
                        if(res.data.code == 10002){
                            _this.setState({
                                subjectCodeHint: '学科code已存在',
                                subjectCodeState: 'error'
                            })
                        }else if(res.data.code == 0){
                            _this.setState({
                                subjectCodeHint: '',
                                subjectCodeState: 'success'
                            });
                            resolve(res.data.code)
                        }

                    }).catch(err=>{
                        console.log(err,'urlVerificationCode')
                    })
                });
            }
        }).then(function (data) {
            if(data == 0) {
                _this.setState({
                    disableBtn: true
                });
                urlAddSub(sendData).then(res => {
                    _this.setState({
                        disableBtn: false
                    });
                    if(res.data.code == 0){
                        _this.getSubInfo()
                        _this.setState({
                            addvisible: false,
                        });
                    }else if(res.data.code == 10002){
                        message.error(res.data.msg)
                    }else if(res.data.code == 400){
                        message.error(res.data.msg)
                    }else if(res.data.code == 1){
                        message.error(res.data.msg)
                    }

                }).catch(err=>{
                    console.log(err,'urlAddSub')
                })
            }

        })

    };


    render(){
        const  {getFieldDecorator} = this.props.form,
               {titleState,titleHint,subjectCodeState,subjectCodeHint} = this.state,
               FormItemLayout = {
                labelCol: {span: 5},
                wrapperCol: {span: 12},
               },
               {dataSource, loading } = this.state,
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
                    name: '学科管理',
                    path: '/app/authority/subject'
                }];
        return(
            <div className="subject">
                <div className="device-head">
                    <BreadcrumbCustom paths={menus}/>
                    <p className="head-title-style">学科管理</p>
                </div>
                <div className="subject-container">
                    <Row>
                        <Button icon="plus" type="primary" onClick={this.addSubject}>新建</Button>
                    </Row>
                    <div className="account-table">
                        <FormTable
                            dataSource={dataSource}
                            changeSore={this.changeSore}
                            editClick={this.editClick}
                            loading={loading}
                            id={this.state.tableRowKey}
                        />
                    </div>
                    {/*新建学科弹框*/}
                    <div>
                        <Modal
                            title={[
                                <h4 key='title'>新建学科<span className="new-build-sub">学科定义是基于现有的业务为维度的对应学科</span></h4>
                            ]}
                            visible={this.state.addvisible}
                            onCancel={this.handleCancel}
                            okText="确定"
                            onOk={this.handleOkAdd}
                            destroyOnClose='true'
                            footer={[
                                <Button key="submit" type="primary" loading={loading} disabled={this.state.disableBtn} onClick={this.handleOkAdd}>
                                    确定
                                </Button>,
                            ]}
                        >
                            <Form layout="horizontal">
                                <FormItem className="" label="学科名称"
                                          validateStatus={titleState}
                                          help={titleHint} {...FormItemLayout} hasFeedback>
                                    {getFieldDecorator('AddsubTitle', {
                                        rules: [{required: true, message: '学科名称不能为空'}],
                                    })(
                                        <Input placeholder="如Web全栈架构师" onChange={this.nameCheck}/>
                                    )}
                                </FormItem>
                                <FormItem className="model-code" label="学科code"
                                          validateStatus={subjectCodeState}
                                          help={subjectCodeHint} {...FormItemLayout} hasFeedback>
                                    {getFieldDecorator('AddsubCode', {
                                        rules: [{required: true, message: '学科code不能为空'}],
                                    })(
                                        <Input placeholder="如Web" onChange={this.codeCheck}/>
                                    )}
                                    <span className="model-code-descrition">该项一旦填写不可修改</span>
                                </FormItem>
                            </Form>
                        </Modal>
                    </div>
                    {/*编辑学科弹框*/}
                    <div>
                        <Modal
                            title="编辑学科"
                            visible={this.state.visible}
                            onCancel={this.handleCancel}
                            okText="确定"
                            onOk={this.handleOk}
                            footer={[
                                <Button key="submit" type="primary"  loading={loading} onClick={this.handleOk} disabled={this.state.editBtn}>
                                    确定
                                </Button>,
                            ]}
                        >
                            <Form layout="horizontal">
                                <FormItem className="" label="学科名称"
                                          validateStatus={titleState}
                                          help={titleHint} {...FormItemLayout} hasFeedback>
                                    {getFieldDecorator('AddsubjectTitle', {

                                        rules: [{required: true, message: '学科名称不能为空'}],
                                    })(
                                        <Input placeholder="学科名称" onChange={this.nameCheck}/>
                                    )}
                                </FormItem>
                                <FormItem className="model-code" label="学科code"
                                          validateStatus={subjectCodeState}
                                          help={subjectCodeHint} {...FormItemLayout} hasFeedback>
                                    {getFieldDecorator('AddsubjectCode', {
                                        rules: [{required: true, message: '学科code不能为空'}],
                                    })(
                                        <Input disabled placeholder="学科code"/>
                                    )}

                                </FormItem>
                            </Form>
                        </Modal>
                    </div>
                </div>
            </div>
        )
    }
}
const SubjectPage = Form.create()(Subject);
export default SubjectPage;
