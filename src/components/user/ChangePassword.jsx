import React from 'react';
import {Form, Card, Input, Button, message} from 'antd';
import history from '../common/History';
import './Index.less';
import {urlPassword, urlCheckPassword} from '../../api/userApi';

const FormItem = Form.Item;

let uploadState = true;

class Local extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            passHint: '',
            passState: '',
            newPassHint: '',
            newPassState: '',
            confirmHint: '',
            confirmState: '',
            confirmDirty: false,
            disableBtn: false,
        };
    }

    // 提交
    handleSubmit = (e) => {
        e.preventDefault();
        const params = {
            oldPassword: '',
            password: '',
        };
        let _this = this;
        // 用户不填写任何信息，直接提交后显示的提示信息
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log(values);
            params.oldPassword = values.password;
            params.password = values.newPassword;
            if (!values.password) {
                this.setState({
                    passHint: '请输入密码！',
                    passState: 'error',
                });
                uploadState = false;
            }
            if (!values.newPassword) {
                this.setState({
                    newPassHint: '请输入新的密码！',
                    newPassState: 'error',
                });
                uploadState = false;
            }
            if (!values.confirm) {
                this.setState({
                    confirmHint: '请再次输入新的密码！',
                    confirmState: 'error',
                });
                uploadState = false;

            }
            if (!err) {
                console.log('Received values of form: ', values);
            }
            if (values.newPassword) {
                params.password = values.newPassword;
            }
        });

        //点击提交，将用户修改的新密码传给后台，提示"密码修改成功"，退出到登录界面
        console.log(this.state.passState)
        if (uploadState && this.state.passState !== 'error') {
            this.setState({
                disableBtn: true
            });
            urlPassword(params).then(response => {
                this.setState({
                    disableBtn: false
                });
                if (response.data.code === 0) {
                    message.success('密码修改成功');
                    history.push('/login');
                } else {
                    message.error(response.data.msg)
                }
            });
        }
    };

    // 取消
    handleCancel = () => {
        // 清空所有输入框，提示信息和提示状态
        this.props.form.resetFields();
        this.setState({
            passHint: '',
            passState: '',
            newPassHint: '',
            newPassState: '',
            confirmHint: '',
            confirmState: ''
        })
    };

    // 验证用户输入的原密码与登录密码是否一致
    checkOldPassword = () => {
        const checkData = {
            password: this.props.form.getFieldValue('password'), // 原密码
        }
        const fieldValue = this.props.form.getFieldValue('password');
        console.log("fieldValue" + fieldValue)
        if (!fieldValue) {
            this.setState({
                passHint: '请输入密码！',
                passState: 'error',
            });
            uploadState = false;
        } else {
            //将用户输入的密码与登录密码进行比较（前端传给后台用户输入密码，后台返回一个返回码用于前端进行判断）
            urlCheckPassword(checkData).then(response => {
                if (response.data.code === 0) {
                    this.setState({
                        passHint: '',
                        passState: 'success'
                    });
                    uploadState = true;
                } else {
                    this.setState({
                        passHint: '该密码与登录密码不一致',
                        passState: 'error',
                    });
                    uploadState = false;
                }
            })
        }

    }

    // 输入新密码的校验规则
    checkConfirm = () => {
        const form = this.props.form;
        const fieldValue = form.getFieldValue('newPassword');
        const flagPattern = /^[a-zA-Z0-9]*$/;  // 是否为字母和数字
        let result = flagPattern.test(fieldValue);  // 正则表达式校验结果

        if (fieldValue && this.state.confirmDirty) {
            form.validateFields(['confirm'], {force: true});
        }

        if (!fieldValue || fieldValue.length < 6 || fieldValue.length > 15) {
            this.setState({
                newPassHint: '长度需满足6-15位',
                newPassState: 'error',
            });
            uploadState = false;
        } else if (!result) {
            this.setState({
                newPassHint: '不支持使用特殊字符',
                newPassState: 'error',
            });
            uploadState = false;
        } else {
            this.setState({
                newPassHint: '',
                newPassState: 'success'
            });
            uploadState = true;
        }
    }

    // 重复新密码的校验规则
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({confirmDirty: this.state.confirmDirty || !!value});

        const form = this.props.form;
        const fieldValue = form.getFieldValue('confirm');
        if (!fieldValue || fieldValue.length < 6 || fieldValue.length > 15) {
            this.setState({
                newPassHint: '长度需满足6-15位',
                newPassState: 'error',
            });
            uploadState = false;
        } else if (fieldValue !== form.getFieldValue('newPassword')) {
            this.setState({
                confirmHint: '两次密码输入不一致',
                confirmState: 'error',
            });
            uploadState = false;
        } else {
            this.setState({
                confirmHint: '',
                confirmState: 'success'
            });
            uploadState = true;
        }
    };


    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 14},
            },
        };
        return (
            <div style={{marginLeft: 38, marginRight: 38}}>
                <Card style={{marginBottom: 24}} bordered={false}>
                    <Form layout="horizontal" style={{paddingBottom: '20px'}}>
                        <FormItem
                            className="open-course-form"
                            {...formItemLayout}
                            label="原密码"
                            hasFeedback
                            validateStatus={this.state.passState}
                            help={this.state.passHint}
                        >
                            {getFieldDecorator('password', {
                                rules: [{
                                    required: true, message: '请输入原密码',
                                }],
                            })(
                                <Input type="password" onBlur={this.checkOldPassword} />
                            )}
                        </FormItem>
                        <FormItem
                            className="open-course-form"
                            {...formItemLayout}
                            label="新密码"
                            hasFeedback
                            validateStatus={this.state.newPassState}
                            help={this.state.newPassHint}
                        >
                            {getFieldDecorator('newPassword', {
                                rules: [{
                                    required: true, message: '请输入新的密码',
                                }, {
                                    pattern: '([A-Z]|[a-z]|[0-9])$', message: '不支持使用特殊字符',
                                }],
                            })(
                                <Input type="password" placeholder="仅支持字母或数字，不少于6位" onBlur={this.checkConfirm} />
                            )}
                        </FormItem>
                        <FormItem
                            className="open-course-form"
                            {...formItemLayout}
                            label="请重复新密码"
                            hasFeedback
                            validateStatus={this.state.confirmState}
                            help={this.state.confirmHint}
                        >
                            {getFieldDecorator('confirm', {
                                rules: [{
                                    required: true, message: '请再次输入新的密码',
                                }],
                            })(
                                <Input type="password" onBlur={this.handleConfirmBlur} />
                            )}
                        </FormItem>
                    </Form>
                </Card>
                <div className="upload-title bottom-btn">
                    <Button type="default" style={{marginRight: '20px'}} onClick={this.handleCancel}>取消</Button>
                    <Button disabled={this.state.disableBtn} type="primary" onClick={this.handleSubmit}>确认修改并提交</Button>
                </div>
            </div>
        );
    }
}

const ChangePassword = Form.create()(Local);
export default ChangePassword;
