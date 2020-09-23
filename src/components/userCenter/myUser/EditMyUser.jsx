import React, {Component} from 'react';
import {Button, Card, Modal, Row, Col, Input, DatePicker, LocaleProvider, Select, Form, message} from 'antd';
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import history from "../../common/History";
import moment from 'moment';
import zh_CN from "antd/lib/locale-provider/zh_CN";
import {disabledDate, getToken} from "../../../utils/filter";
import {
    editMyUser,
    checkUser,
    getCourses,
    getMyUserDetail,
    getSaleList
} from "../../../api/userCenterApi";
import {source} from "../source";
import {connect} from "../../../utils/socket";

const { TextArea } = Input;
const { Option} = Select;
const FormItem = Form.Item;

let mobileRule = /^1[1-9][0-9]\d{8}$/;
let nameTimer = null, nickTimer = null;

class EditMyUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: parseInt(window.location.pathname.slice(23)),
            saleList: [],
            courseList: [],
            courseStatus: '',
            nickStatus: '',
            nickHint: '',
            nameStatus: '',
            nameHint: '',
            disableBtn: false,
            mobileState:true
        }
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

    // 获取我的用户信息
    getMyUserDetail = () => {
        console.log(this.state.userId);
        getMyUserDetail(this.state.userId).then(res => {
            if (res.data.code === 0) {
                let value = res.data.data;
                this.props.form.setFieldsValue({
                    name: value.username,
                    mobile: value.mobile ? value.mobile : '',
                    nickname: value.nickname ? value.nickname : '',
                    source: value.value ? value.value : undefined,
                    sale: value.sellerId ? value.sellerId: undefined,
                    friendDate: value.friendTime ? moment(value.friendTime * 1000) : undefined,
                    course: value.intention ? value.intention : [],
                    remark: value.remark ? value.remark : ''
                })
            } else {
                message.error(res.data.msg)
            }
        })
    };

    componentDidMount() {
        this.getSaleList();
        this.getCourses();
        this.getMyUserDetail();
        //链接websocket
        connect(getToken('username'));
        //end
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
            checkUser({id: 'id=' + this.state.userId, params: {username: value}}).then(res => {
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

    // 检查手机号失去焦点
    checkMobileBlur = (e)=>{
        let value = e.target.value;
        if(value !==''){
            if(!mobileRule.test(value)){
                this.props.form.setFields({
                    mobile: {
                        value: value,
                        errors: [new Error('请输入有效的手机号')],
                    },
                });
                this.setState({
                    mobileState:false
                })
            }
        }else {
            this.setState({
                mobileState:true
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
                checkUser({id: 'id=' + this.state.userId, params: {mobile: value}}).then(res => {
                    if (res.data.code === 0) {
                        callback()
                        this.setState({
                            mobileState:true
                        })
                    } else {
                        callback(res.data.msg)
                        this.setState({
                            mobileState:false
                        })
                    }
                })
            } else {
                callback('请输入有效的手机号')
                this.setState({
                    mobileState:false
                })
            }
        } else {
            callback()
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
            checkUser({id: 'id=' + this.state.userId, params: {nickname: e.target.value}}).then(res => {
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

    // 选择意向课程状态改变
    chooseCourse = (value, e) => {
        console.log(value, e, "========意向课程筛选");
        this.setState({
            courseStatus: e.length > 0 ? 'success' : ''
        });
    };

    // 提交
    handleSubmit = () => {
        let that =this;
        if(this.state.mobileState){
            this.props.form.validateFieldsAndScroll((err, value) => {
                console.log(err, value);
                if (!err) {
                    let time = value.friendDate ? Math.round(new Date(value.friendDate).getTime() / 1000) : null;
                    let params = {
                        id: this.state.userId,
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
                    that.setState({
                        disableBtn: true
                    });
                    editMyUser(params).then(res => {
                        if (res.data.code === 0) {
                            that.setState({
                                disableBtn: false
                            });
                            message.success('编辑成功');
                            history.push('/app/usercenter/myuser')
                        } else {
                            message.error(res.data.msg)
                        }
                    })
                } else {
                    if (value.username === '' || !value.username) {
                        this.setState({
                            nameStatus: 'error',
                            nameHint: '姓名不能为空哦~'
                        });
                    }
                }
            });
        }
    };

    // 转化时间
    momentTime = (date) => {
      return  Math.round(new Date(date).getTime() / 1000);
    };

    // 取消
    handleCancel = () => {
        let _this = this;
        getMyUserDetail(this.state.userId).then(res => {
            let value = res.data.data;
            let sourceValues = ({
                name: value.username,
                mobile: value.mobile ? value.mobile : '',
                nickname: value.nickname ? value.nickname : '',
                source: value.value ? value.value : undefined,
                sale: value.sellerId ? value.sellerId: undefined,
                friendDate: value.friendTime ? moment(value.friendTime * 1000) : undefined,
                course: value.intention ? value.intention : [],
                remark: value.remark ? value.remark : ''
            });
            let fieldValues = _this.props.form.getFieldsValue();
            let arr = Object.keys(fieldValues);
            console.log(sourceValues, fieldValues);
            let count = 1;
            for(let i in sourceValues){
                count++;
                console.log(sourceValues[i], fieldValues[i]);
                if(sourceValues[i] != fieldValues[i] && i !== 'course' && i !== 'friendDate'){
                    _this.showModal();
                    break;
                } else if (_this.momentTime(sourceValues['friendDate']) !== _this.momentTime(fieldValues['friendDate'])) {
                    _this.showModal();
                    break;
                } else if (sourceValues['course'].toString() !== fieldValues['course'].toString()) {
                    _this.showModal();
                    break;
                } else if (count > arr.length) {
                    history.push('/app/usercenter/myuser')
                }
            }
        })
    };

    // 显示modal
    showModal = () => {
        this.setState({
            visible: true
        })
    };

    // 确认 取消新建
    handleOk = () => {
        history.push('/app/usercenter/myuser')
    };

    // 取消 取消新建
    handleTipCancel = () => {
        this.setState({
            visible: false
        })
    };

    render() {
        const {saleList, courseList, courseStatus, nameStatus, nameHint, nickStatus, nickHint, disableBtn, visible} = this.state;
        const { getFieldDecorator } = this.props.form;
        const menus = [
            {
                path: '/app/dashboard/analysis',
                name: '首页'
            },
            {
                path: '/app/usercenter/myuser',
                name: '用户中心'
            },
            {
                path: '/app/usercenter/myuser',
                name: '我的用户'
            },
            {
                path: '#',
                name: '编辑用户'
            }
        ];
        return (
            <div className="edit-my-user">
                <div className="page-nav" onClick={this.hideDetail}>
                    <BreadcrumbCustom paths={menus}/>
                    <p className="title-style">编辑用户</p>
                    <p className="title-describe">说明：仅填写销售相关的数据即可。用户数据在报名后，根据报名表数据同步至此。</p>
                </div>
                <Form>
                    <Card title="基本信息" bordered={null}>
                        <Row type="flex" justify="space-between">
                            <Col span={7}>
                                <Row className="user-row-title">用户姓名</Row>
                                <Row className="user-row-input">
                                    <FormItem hasFeedback validateStatus={nameStatus} help={nameHint}>
                                        {getFieldDecorator('name', {
                                            rules: [
                                                {required: true, message: '姓名不能为空哦~'}
                                            ]
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" onChange={this.changeName} onBlur={this.checkName}/>
                                        )}
                                    </FormItem>
                                </Row>
                            </Col>
                            <Col span={7}>
                                <Row>用户手机号</Row>
                                <Row className="user-row-input">
                                    <FormItem hasFeedback>
                                        {getFieldDecorator('mobile', {
                                            rules: [
                                                {validator: this.checkMobile}
                                            ]
                                        })(
                                            <Input onBlur={this.checkMobileBlur} autoComplete="off" placeholder="请输入"/>
                                        )}
                                    </FormItem>
                                </Row>
                            </Col>
                            <Col span={7}>
                                <Row>用户微信昵称</Row>
                                <Row className="user-row-input">
                                    <FormItem hasFeedback validateStatus={nickStatus} help={nickHint}>
                                        {getFieldDecorator('nickname')(
                                            <Input autoComplete="off" placeholder="请输入" onChange={this.changeNickName} onBlur={this.checkNickName}/>
                                        )}
                                    </FormItem>
                                </Row>
                            </Col>
                        </Row>
                        <Row type="flex" justify="space-between" style={{marginTop: '10px'}}>
                            <Col span={7}>
                                <Row className="user-row-title">选择用户来源</Row>
                                <Row className="user-row-input" id="user-row-input_source">
                                    <FormItem hasFeedback>
                                        {getFieldDecorator('source')(
                                            <Select
                                                placeholder="请选择"
                                                style={{width: '100%'}}
                                                getPopupContainer={() => document.getElementById('user-row-input_source')}
                                            >
                                                {source().map((value, index) => <Option key={index} value={value}>{value}</Option>)}
                                            </Select>
                                        )}
                                    </FormItem>
                                </Row>
                            </Col>
                            <Col span={7}>
                                <Row className="user-row-title">所属销售</Row>
                                <Row className="user-row-input" id="user-row-input_sale">
                                    <FormItem hasFeedback>
                                        {getFieldDecorator('sale')(
                                            <Select
                                                showSearch
                                                placeholder="请选择"
                                                style={{width: '100%'}}
                                                getPopupContainer={() => document.getElementById('user-row-input_sale')}
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            >
                                                {saleList && saleList.map((value, index) => <Option key={index} value={value.id}>{value.realname}</Option>)}
                                            </Select>
                                        )}
                                    </FormItem>
                                </Row>
                            </Col>
                            <Col span={7}>
                                <Row>添加为好友的日期</Row>
                                <Row className="user-row-input" id="user-row-input_date">
                                    <LocaleProvider locale={zh_CN}>
                                        <FormItem hasFeedback>
                                            {getFieldDecorator('friendDate')(
                                                <DatePicker
                                                    onChange={this.changeFriendDate}
                                                    disabledDate={disabledDate}
                                                    style={{width: '100%'}}
                                                    placeholder="选择日期"
                                                    getCalendarContainer={() => document.getElementById('user-row-input_date')}
                                                />
                                            )}
                                        </FormItem>
                                    </LocaleProvider>
                                </Row>
                            </Col>
                        </Row>
                    </Card>
                    <Card title="意向课程" bordered={null} style={{marginTop: '24px'}}>
                        <Row type="flex" justify="space-between">
                            <Col span={7}>
                                <Row>意向课程</Row>
                                <Row className="user-row-input" id="user-row-input_course">
                                    <FormItem hasFeedback validateStatus={courseStatus}>
                                        {getFieldDecorator('course')(
                                            <Select
                                                mode="multiple"
                                                placeholder="请选择"
                                                style={{width: '100%'}}
                                                onChange={this.chooseCourse}
                                                getPopupContainer={() => document.getElementById('user-row-input_course')}
                                            >
                                                {courseList && courseList.map((value, index) => <Option key={index} value={value.id}>{value.name}</Option>)}
                                            </Select>
                                        )}
                                    </FormItem>
                                </Row>
                            </Col>
                            <Col span={7}>
                                <Row>备注信息</Row>
                                <Row className="user-row-input">
                                    <FormItem hasFeedback>
                                        {getFieldDecorator('remark')(
                                            <TextArea maxLength={100} rows={3} placeholder="请输入"/>
                                        )}
                                    </FormItem>
                                </Row>
                            </Col>
                            <Col span={7}>

                            </Col>
                        </Row>
                    </Card>
                </Form>
                <div className="upload-title bottom-btn">
                    <Button type="default" style={{marginRight: '20px'}} onClick={this.handleCancel}>取消</Button>
                    <Modal
                        title="提示"
                        visible={visible}
                        onOk={this.handleOk}
                        onCancel={this.handleTipCancel}
                    >
                        <p>表单中有内容已经修改，是否确认取消？</p>
                    </Modal>
                    <Button disabled={disableBtn} type="primary" onClick={this.handleSubmit}>提交</Button>
                </div>
            </div>
        );
    }
}

const myUser = Form.create()(EditMyUser);
export default myUser;
