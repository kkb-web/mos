import {Component} from "react";
import {Button, Col, DatePicker, Form, Input, LocaleProvider, message, Row, Select} from "antd";
import React from "react";
import {disabledDate, setTitle,userScalable} from "../../utils/filter";
import './AddUser.less'
import {source} from "../userCenter/source";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import {addMyUser, checkUser, getCourses, getSaleList} from "../../api/userCenterApi";
import history from "../common/History";

const FormItem = Form.Item;
const {Option} = Select;

let mobileRule = /^1[1-9][0-9]\d{8}$/;
let nameTimer = null, nickTimer = null;

class AddUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saleList: [],
            courseList: [],
            courseStatus: '',
            nickStatus: '',
            nickHint: '',
            nameStatus: '',
            nameHint: '',
            mobileState: true,
            currentIndex: null,
            selectAutoFocus:false
        };
    }

    // 获取销售列表
    getSaleList = () => {
        getSaleList().then((res) => {
            console.log(res.data.data, "======销售列表");
            this.setState({
                saleList: res.data.data
            });
        });
    };

    // 意向课程下拉
    getCourses = () => {
        getCourses().then((res) => {
            console.log(res.data.data, "======销售列表");
            this.setState({
                courseList: res.data.data
            });
        });
    };

    componentDidMount() {
        userScalable()
        this.getSaleList();
        this.getCourses();
        setTitle('添加用户');
        var phoneWidth = parseInt(window.screen.width);
        var phoneScale = phoneWidth / 370;
        var ua = navigator.userAgent;
        if (/Android (\d+\.\d+)/.test(ua)) {
            var version = parseFloat(RegExp.$1);
            if (version > 2.3) {
                document.write('<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale = ' + phoneScale + ', maximum-scale = ' + phoneScale + ', target-densitydpi=device-dpi">');
            } else {

                document.write('<meta name="viewport" content="width=device-width, target-densitydpi=device-dpi">');
            }
        } else {
            document.write('<meta name="viewport" content="width=device-width, user-scalable=no, target-densitydpi=device-dpi">');
        }
    }

    componentWillUnmount() {
        clearTimeout(nameTimer);
        clearTimeout(nickTimer);
    }

    // 改变用户名
    changeName = (e) => {
        if (e.target.value === '') {
            this.setState({
                nameStatus: 'error',
                nameHint: '姓名不能为空哦~'
            })
        } else {
            this.setState({
                nameStatus: 'success',
                nameHint: ''
            })
        }
    };

    // 检查用户姓名
    checkName = (e) => {
        console.log(e.target.value, "==========");
        let value = e.target.value;
        if (value !== '') {
            checkUser({id: 'id', params: {username: value}}).then(res => {
                if (res.data.code === 10002) {
                    this.setState({
                        nameStatus: 'warning',
                        nameHint: '温馨提示: 已有同名用户在系统中哦'
                    });
                    nameTimer = setTimeout(() => {
                        this.setState({
                            nameStatus: 'success',
                            nameHint: ''
                        })
                    }, 3000)
                }
            })
        }
    };

    // 检查手机号
    checkMobile = (rule, value, callback) => {
        console.log(value, "==========");
        if (value && value.length > 10) {
            if (mobileRule.test(value)) {
                this.setState({
                    mobileStatus: false
                });
                checkUser({id: 'id', params: {mobile: value}}).then(res => {
                    if (res.data.code === 0) {
                        callback()
                    } else {
                        callback(res.data.msg)
                    }
                })
            } else {
                callback('请输入有效的手机号')
            }
        } else {
            callback()
        }
    };

    // 检查手机号失去焦点
    checkMobileBlur = (e) => {
        let value = e.target.value;
        if (value !== '') {
            if (!mobileRule.test(value)) {
                this.props.form.setFields({
                    mobile: {
                        value: value,
                        errors: [new Error('请输入有效的手机号')],
                    },
                });
                this.setState({
                    mobileState: false
                })
            }
        } else {
            this.setState({
                mobileState: true
            })
        }
    };

    // 改变用户昵称
    changeNickName = (e) => {
        if (e.target.value !== '') {
            this.setState({
                nickStatus: 'success',
                nickHint: ''
            });
        } else {
            this.setState({
                nickStatus: '',
                nickHint: ''
            });
        }
    };

    // 检查用户昵称
    checkNickName = (e) => {
        console.log(e.target.value);
        if (e.target.value !== '') {
            checkUser({id: 'id', params: {nickname: e.target.value}}).then(res => {
                console.log(res);
                if (res.data.code === 10002) {
                    this.setState({
                        nickStatus: 'warning',
                        nickHint: '温馨提示: 已有同名用户在系统中哦'
                    });
                    nickTimer = setTimeout(() => {
                        this.setState({
                            nickStatus: 'success',
                            nickHint: ''
                        })
                    }, 3000)
                }
            })
        }
    };

    // 提交
    handleSubmit = () => {
        if (this.state.mobileState) {
            this.props.form.validateFieldsAndScroll((err, value) => {
                console.log(err, value);
                if (!err) {
                    let time = value.friendDate ? Math.round(new Date(value.friendDate).getTime() / 1000) : null;
                    let params = {
                        username: value.name,
                        mobile: value.mobile || null,
                        nickname: value.nickname || null,
                        value: value.source || null,
                        sellerId: value.sale || null,
                        friendTime: time,
                        intention: (value.course && value.course.length > 0) ? value.course.toString() : null,
                        remark: value.remark || null
                    };
                    console.log(params);
                    addMyUser(params).then(res => {
                        if (res.data.code === 0) {
                            history.push('/user/add/success')
                        } else {
                            history.push('/user/add/error')
                        }
                    })
                } else {
                    if (value.name === '' || !value.name) {
                        this.setState({
                            nameStatus: 'error',
                            nameHint: '姓名不能为空哦~'
                        })
                    }
                }
            });
        }
    };
    //改变当前元素border
    borderActive = (e, num) => {
        e.stopPropagation();
        if (num == 1) {
            document.querySelector('.name-item input').focus();
        } else if (num == 2) {
            document.querySelector('.mobile-item input').focus();
        } else if (num == 3) {
            document.querySelector('.nickname-item input').focus();
        }else if (num == 4) {
            document.getElementById('source').click();
        }else if (num == 5) {
            document.getElementById('sale').click();
        }else if (num == 6) {
            document.querySelector('.friendDate-item input').click();
        }
        this.setState({
            currentIndex: num
        })
    };

    render() {
        const {saleList, courseList, courseStatus, nameStatus, nameHint, nickStatus, nickHint, disableBtn, visible} = this.state;
        const {getFieldDecorator} = this.props.form;
        return (
            <div className="mobile-add-user">
                <div className="add_order_dd">
                    基本信息
                </div>
                <div className="mobile-add-user-content">
                    <Form layout="vertical">
                        <Row onClick={(e)=>{this.borderActive(e,'1')}}>
                            <FormItem className={`name-item ${this.state.currentIndex == 1 ? 'box-active' : null}`} label="姓名" hasFeedback validateStatus={nameStatus}
                                      help={nameHint}>
                                {getFieldDecorator('name', {
                                    rules: [
                                        {required: true, message: '姓名不能为空哦~'}
                                    ]
                                })(
                                    <Input  id="refName" autoComplete="off" onChange={this.changeName}
                                            onBlur={this.checkName}/>
                                )}
                            </FormItem>
                        </Row>
                        <Row onClick={(e)=>{this.borderActive(e,'2')}}>
                            <FormItem className={`mobile-item ${this.state.currentIndex == 2 ? 'box-active' : 'null'}`} label="手机号" hasFeedback>
                                {getFieldDecorator('mobile', {
                                    rules: [
                                        {validator: this.checkMobile}
                                    ]
                                })(
                                    <Input style={{padding: '0px'}} autoComplete="off" onBlur={this.checkMobileBlur}/>
                                )}
                            </FormItem>
                        </Row>
                        <Row onClick={(e)=>{this.borderActive(e,'3')}}>
                            <FormItem className={`nickname-item ${this.state.currentIndex == 3 ? 'box-active' : 'null'}`} label="微信昵称" hasFeedback validateStatus={nickStatus}
                                      help={nickHint}>
                                {getFieldDecorator('nickname')(
                                    <Input style={{padding: '0px'}} autoComplete="off" onChange={this.changeNickName}
                                           onBlur={this.checkNickName}/>
                                )}
                            </FormItem>
                        </Row>
                        <Row onClick={(e)=>{this.borderActive(e,'4')}}>
                            <FormItem className={`user-row-input_source ${this.state.currentIndex == 4 ? 'box-active' : 'null'}`} id="user-row-input_source" label="用户来源" hasFeedback>
                                {getFieldDecorator('source')(
                                    <Select
                                        style={{height:'24px',width: '100%'}}
                                        placeholder="请选择"
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                        onSelect={(e)=>{
                                            console.log('1')
                                        }}
                                    >
                                        {/*<Option key="1">1</Option>*/}
                                        {/*<Option key="2">2</Option>*/}
                                        {/*<Option key="3">3</Option>*/}
                                        {/*<Option key="4">1</Option>*/}
                                        {/*<Option key="5">2</Option>*/}
                                        {/*<Option key="6">3</Option>*/}
                                        {source().map((value, index) => <Option key={index}
                                                                                value={value}>{value}</Option>)}
                                    </Select>
                                )}
                            </FormItem>
                        </Row>
                        <Row onClick={(e)=>{this.borderActive(e,'5')}}>
                            <FormItem className={`${this.state.currentIndex == 5 ? 'box-active' : 'null'}`} label="所属销售" hasFeedback>
                                {getFieldDecorator('sale')(
                                    <Select
                                        style={{height:'24px',width: '100%'}}
                                        placeholder="请选择"
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                    >
                                        {saleList && saleList.map((value, index) => <Option key={index}
                                                                                value={value.id}>{value.realname}</Option>)}
                                    </Select>
                                )}
                            </FormItem>
                        </Row>
                        <Row onClick={(e)=>{this.borderActive(e,'6')}}>
                            <FormItem className={`friendDate-item ${this.state.currentIndex == 6 ? 'box-active' : 'null'}`} label="添加好友时间" hasFeedback>
                                {getFieldDecorator('friendDate')(
                                    <DatePicker
                                        onChange={this.changeFriendDate}
                                        disabledDate={disabledDate}
                                        style={{width: '100%'}}
                                        placeholder="请选择"
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                    />
                                )}
                            </FormItem>
                        </Row>
                    </Form>
                    <div className="add_order_button_dd" onClick={this.handleSubmit}>提 交</div>
                </div>


                {/*<div style={{textAlign: 'center', color: '#fff', background: 'gray', padding: 10}}>*/}
                {/*添加用户*/}
                {/*</div>*/}
                {/*<div*/}
                {/*style={{textAlign: 'left', background: '#dedede', padding: 10, marginTop: '10px', fontWeight: 600}}>*/}
                {/*基本信息*/}
                {/*</div>*/}
                {/*<Form style={{marginTop: '20px'}} layout="vertical">*/}
                {/*<Row>*/}
                {/*<Col span={8} className="user-row-title user-row-title_mobile">用户姓名：</Col>*/}
                {/*<Col span={14} className="user-row-input">*/}
                {/*<FormItem hasFeedback validateStatus={nameStatus} help={nameHint}>*/}
                {/*{getFieldDecorator('name', {*/}
                {/*rules: [*/}
                {/*{required: true, message: '姓名不能为空哦~'}*/}
                {/*]*/}
                {/*})(*/}
                {/*<Input autoComplete="off" placeholder="请输入" onChange={this.changeName}*/}
                {/*onBlur={this.checkName}/>*/}
                {/*)}*/}
                {/*</FormItem>*/}
                {/*</Col>*/}
                {/*</Row>*/}
                {/*<Row>*/}
                {/*<Col span={8} className="user-row-title_mobile">手机号：</Col>*/}
                {/*<Col span={14} className="user-row-input">*/}
                {/*<FormItem hasFeedback>*/}
                {/*{getFieldDecorator('mobile', {*/}
                {/*rules: [*/}
                {/*{validator: this.checkMobile}*/}
                {/*]*/}
                {/*})(*/}
                {/*<Input autoComplete="off" placeholder="请输入" onBlur={this.checkMobileBlur}/>*/}
                {/*)}*/}
                {/*</FormItem>*/}
                {/*</Col>*/}
                {/*</Row>*/}
                {/*<Row>*/}
                {/*<Col span={8} className="user-row-title_mobile">用户微信昵称：</Col>*/}
                {/*<Col span={14} className="user-row-input">*/}
                {/*<FormItem hasFeedback validateStatus={nickStatus} help={nickHint}>*/}
                {/*{getFieldDecorator('nickname')(*/}
                {/*<Input autoComplete="off" placeholder="请输入" onChange={this.changeNickName}*/}
                {/*onBlur={this.checkNickName}/>*/}
                {/*)}*/}
                {/*</FormItem>*/}
                {/*</Col>*/}
                {/*</Row>*/}
                {/*<Row>*/}
                {/*<Col span={8} className="user-row-title_mobile">用户来源：</Col>*/}
                {/*<Col span={14} className="user-row-input" id="user-row-input_source">*/}
                {/*<FormItem hasFeedback>*/}
                {/*{getFieldDecorator('source')(*/}
                {/*<Select*/}
                {/*placeholder="请选择"*/}
                {/*style={{width: '100%'}}*/}
                {/*getPopupContainer={() => document.getElementById('user-row-input_source')}*/}
                {/*>*/}
                {/*{source().map((value, index) => <Option key={index}*/}
                {/*value={value}>{value}</Option>)}*/}
                {/*</Select>*/}
                {/*)}*/}
                {/*</FormItem>*/}
                {/*</Col>*/}
                {/*</Row>*/}
                {/*<Row>*/}
                {/*<Col span={8} className="user-row-title_mobile">所属销售：</Col>*/}
                {/*<Col span={14} className="user-row-input" id="user-row-input_sale">*/}
                {/*<FormItem hasFeedback>*/}
                {/*{getFieldDecorator('sale')(*/}
                {/*<Select*/}
                {/*showSearch*/}
                {/*placeholder="请选择"*/}
                {/*style={{width: '100%'}}*/}
                {/*getPopupContainer={() => document.getElementById('user-row-input_sale')}*/}
                {/*filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}*/}
                {/*>*/}
                {/*{saleList.map((value, index) => <Option key={index}*/}
                {/*value={value.id}>{value.realname}</Option>)}*/}
                {/*</Select>*/}
                {/*)}*/}
                {/*</FormItem>*/}
                {/*</Col>*/}
                {/*</Row>*/}
                {/*<Row>*/}
                {/*<Col span={8} className="user-row-title_mobile">添加好友时间：</Col>*/}
                {/*<Col span={14} className="user-row-input" id="user-row-input_date">*/}
                {/*<LocaleProvider locale={zh_CN}>*/}
                {/*<FormItem hasFeedback>*/}
                {/*{getFieldDecorator('friendDate')(*/}
                {/*<DatePicker*/}
                {/*onChange={this.changeFriendDate}*/}
                {/*disabledDate={disabledDate}*/}
                {/*style={{width: '100%'}}*/}
                {/*placeholder="选择日期"*/}
                {/*getCalendarContainer={() => document.getElementById('user-row-input_date')}*/}
                {/*/>*/}
                {/*)}*/}
                {/*</FormItem>*/}
                {/*</LocaleProvider>*/}
                {/*</Col>*/}
                {/*</Row>*/}
                {/*</Form>*/}
                {/*<div style={{*/}
                {/*width: '100%',*/}
                {/*position: 'absolute',*/}
                {/*bottom: 0,*/}
                {/*top: 'calc(100% - 50px)',*/}
                {/*height: '50px',*/}
                {/*lineHeight: '50px',*/}
                {/*background: '#189ff0',*/}
                {/*textAlign: 'center',*/}
                {/*color: '#fff'*/}
                {/*}} onClick={this.handleSubmit}>提交*/}
                {/*</div>*/}
            </div>
        )
    }
}

const addUser = Form.create()(AddUser);
export default addUser;
