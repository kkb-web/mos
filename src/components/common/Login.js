import React, { Component } from 'react';
import '../../style/login.less';
import { Form, Icon, Input, Button, message, Spin } from 'antd';
import qs from 'qs';
import {authHeader, setToken, baseUrl, IsPC} from "../../utils/filter";
import {getMenuList} from "../../api/menuApi";
import {urlUserInfo} from "../../api/userApi";
import {getUserAuthorList} from "../../api/commonApi";

const FormItem = Form.Item;

class NormalLoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            passHint: '',
            passState: '',
        };
    }
    state = {
        isLoding:false,
    };
    // 密码检测
    focusOn = () => {
        this.setState({
            passHint: '',
            passState: 'success',
            disableBtn: false
        });
    };

    // 登录
    handleSubmit = (e) => {
        let _this = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!values.password) {
                this.setState({
                    passHint: '请输入密码！',
                    passState: 'error'
                });
            } else {
                this.setState({
                    passHint: '',
                    passState: 'success'
                });
            }
            if (!err) {
                this.setState({
                    disableBtn: true
                });
                // 登录请求
                let data = qs.stringify({
                        username: values.username,
                        password: values.password,
                        grant_type: 'password'
                    }),
                    xhr = new XMLHttpRequest(),
                    that = this;

                //发送登录请求
                xhr.open("POST", baseUrl() + '/uaa/oauth/token', true);
                // 添加http头，发送信息至服务器时内容编码类型
                xhr.setRequestHeader("Authorization", authHeader().Authorization);
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        _this.setState({
                            disableBtn: false
                        });
                        if (xhr.status === 200 || xhr.status === 304) {
                            let res = JSON.parse(xhr.responseText);
                            if(res.access_token) {
                                that.setState({
                                    isLoding: true,
                                });
                                setToken('access_token', res.access_token);
                                setToken('refresh_token', res.refresh_token);
                                setToken('username', values.username);

                                message.success('登录成功!'); //成功信息
                                that.getMenu();
                                that.getUser();
                                if (IsPC()) {
                                    urlUserInfo().then(res => {
                                        console.log(res.data, res.data.data.loginTimes);
                                        setToken('isSale',res.data.data.isSale);
                                        setToken('realname',res.data.data.realname);
                                        setToken('mobile',res.data.data.mobile);
                                        setToken('roleId',res.data.data.roleId);
                                        if (parseInt(res.data.data.loginTimes) === 1) {
                                            setTimeout(function () { //首次进入
                                                that.props.history.push({pathname: '/app/user/info', state: values});
                                            }, 500);
                                        } else {
                                            setTimeout(function () { //非首次进入
                                                that.props.history.push({pathname: '/app/dashboard/analysis', state: values});
                                            }, 500);
                                        }
                                    }).catch(() => {
                                        setTimeout(function () { //延迟进入
                                            that.props.history.push({pathname: '/app/dashboard/analysis', state: values});
                                        }, 500);
                                    })
                                } else {
                                    setTimeout(function () { //非首次进入
                                        that.props.history.push({pathname: '/dingtalk', state: values});
                                    }, 500);
                                }
                            } else {
                                message.error('帐号或密码错误!'); //失败信息
                            }
                        } else if (xhr.status === 400) {
                            let err = JSON.parse(xhr.responseText);
                            console.log(err.error_description);
                            message.error(err.error_description); //失败信息
                        } else if (xhr.status === 500 || xhr.status === 502 || xhr.status === 503) {
                            message.error('500服务端错误，请稍后重试!'); //失败信息
                        }
                    }
                };
                xhr.send(data);

            }
        });
    };

    // 获取菜单列表
    getMenu = () => {
        getMenuList().then(res => {
            console.log(res.data.data, "=========菜单");
            if (res.data.code === 0) {
                setToken('menu', JSON.stringify(res.data.data))
            }
        })
    };

    getUser = () => {
        getUserAuthorList().then(res => {
            setToken('userAuthorList', JSON.stringify(res.data.data));
            console.log(res.data.data, "======用户权限")
        })
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            this.state.isLoding?<Spin size="large" className="loading" />:
            <div className="login">
                <div className="login-form">
                    <div className="login-logo">
                        <div className="login-name">开课吧营销管理后台</div>
                    </div>
                    <Form className="login-apply" onSubmit={this.handleSubmit}>
                        <FormItem className="login-user">
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: '请输入用户名!' }],
                            })(
                                <Input prefix={<img src="https://img.kaikeba.com/crm_pass_new.png" alt="" style={{width: '11px'}}/>} placeholder="请输入您的账号" />
                            )}
                        </FormItem>
                        <FormItem className="login-pass">
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input onFocus={this.focusOn} prefix={<img src="https://img.kaikeba.com/crm_user_new.png" style={{width: '10px'}} alt=""/>} type="password" placeholder="请输入密码" />
                            )}
                        </FormItem>
                        <FormItem style={{marginBottom:'0'}}>
                            {/*{getFieldDecorator('remember', {*/}
                                {/*valuePropName: 'checked',*/}
                                {/*initialValue: true,*/}
                            {/*})(*/}
                                {/*<Checkbox>记住我</Checkbox>*/}
                            {/*)}*/}
                            {/*<a className="login-form-forgot" href="" style={{float:'right'}}>忘记密码?</a>*/}
                            <Button disabled={this.state.disableBtn} type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>
                                登录
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

const Login = Form.create()(NormalLoginForm);
export default Login;
