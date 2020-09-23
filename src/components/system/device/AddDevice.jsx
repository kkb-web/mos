import React, {Component} from 'react';
import BreadcrumbCustom from '../../common/BreadcrumbCustom';
import {Card, Modal, Select, Form, Input, Button, Icon, message} from 'antd';
import history from '../../common/History'
import {urlAddDevice} from '../../../api/deviceApi'
import { getToken} from "../../../utils/filter";
import {connect} from "../../../utils/socket";


import './AddDevice.less'
import List from './common/MarketList'

const FormItem = Form.Item;
class Local extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            img: '',
            todos: [],
            COUNT:'9999',
            disableBtn: false
        };
    }

    componentDidMount() {
        //链接websocket
        connect(getToken('username'));
        //end
    }

    addMarket = () => {
        this.setState({
            todos: this.state.todos.concat({
                id: this.state.COUNT,
                text: 1
            }),
            COUNT:this.state.COUNT + 1
        })
    }
    handleOk = () => {
        this.setState({
            visible: false,
        });
        this.props.form.resetFields();
        history.push('/app/authority/device');
    }
    handleTipCancel = () => {
        this.setState({
            visible: false,
        });
    }
    handleCancel = () => {
        let changes = this.formRef.checkFormchangge()
        console.log(this.props.form.getFieldsValue());
        let fieldsvalue = this.props.form.getFieldsValue();
        console.log(fieldsvalue.content);
        // 将JSON数据的key值存为一个数组，便于获取对象fieldsvalue的长度
        let arr = Object.keys(fieldsvalue);
        // 设置一个计数器，用来记录控件值为空的个数
        let count = 1;
        // 遍历表单中所有控件的值
        for (let i in fieldsvalue) {
            count++;
            // 如果控件的值不为空，则显示提示框
            if (fieldsvalue[i] || !changes) {
                this.showModal();
                break;
            } else if (count > arr.length || changes) {      // 当遍历完所有的控件都为空时，返回上一级菜单
                history.push('/app/authority/device')
            }
        }
        document.getElementById('content').scrollTop = 0
    };
    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleSubmitdata = (data) => {
        console.log(data, "++++++++++")
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({
                    disableBtn: true
                });
                urlAddDevice(data).then(res => {
                    this.setState({
                        disableBtn: false
                    });
                    if(res.data.code == 0){
                        message.success('提交成功');
                        history.push('/app/authority/device')
                    }
                    if(res.data.code == 10002){
                        message.warn(res.data.msg)
                        // this.setState({
                        //     IMEIState:'error',
                        //     IMEIHint:'该设备已存在！'
                        // })
                    }
                }).catch(err => {
                    this.setState({
                        disableBtn: false
                    });
                })
            }
        });
    }
    handleSubmit = (e) => {
        const data = this.formRef.getItemsValue()
        const formdata = this.props.form.getFieldsValue();
        const imei = formdata.IMEI
        const type = formdata.type
        let sendData = {
            imei: imei,
            type: type,
            sellers: data
        }
        data === undefined ? console.log('请填写消息') : this.handleSubmitdata(sendData)
    }

    // 删除函数
    deleteFn(id) {
        let data = this.state.todos
        this.setState({
            // 此处为数组过滤 不懂速查   arr.filter()
            todos: data.filter(item => {
                if (item.id !== id) {
                    return item
                }
            })
        })
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const FormItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 16},
        };
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'}/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const menus = [
            {
                path: '/app/dashboard/analysis',
                name: '首页'
            },
            {
                name: '设备管理',
                path: '/app/authority/device'
            },
            {
                name: '新建设备',
                path: ''
            }
        ];


        return (
            <div className="devide-add">
                <div className="device-add-head">
                    <BreadcrumbCustom paths={menus}/>
                    <p className="head-title-style">新建设备</p>
                    <span className="describe">创建新设备，并添加该设备下的营销号相关信息，便于统一管理和分配。</span>
                </div>
                <div id="contents" className="devide-add-information"
                     style={{background: '#ECECEC', margin: '0 8px', marginBottom: '24px'}}>
                    <Card title="基本信息" bordered={false} style={{width: '100%'}}>
                        <div className="add-information-box">
                            <Form layout="horizontal">
                                <FormItem className="add-binding-box-form" label="设备IMEI"
                                          validateStatus={this.state.IMEIState}
                                          help={this.state.IMEIHint} {...FormItemLayout} hasFeedback>
                                    {getFieldDecorator('IMEI', {
                                        rules: [{required: true, message: '设备IMEI不能为空'}],
                                    })(
                                        <Input placeholder="手机唯一标识"/>
                                    )}
                                </FormItem>
                                <FormItem className="add-binding-box-form" label="设备型号"
                                          validateStatus={this.state.titleState}
                                          help={this.state.w} {...FormItemLayout} hasFeedback>
                                    {getFieldDecorator('type', {
                                        rules: [{required: false, message: '设备型号不能为空'}],
                                    })(
                                        <Input placeholder=""/>
                                    )}
                                </FormItem>
                            </Form>
                        </div>
                    </Card>
                </div>
                <div className="devide-add-binding" style={{background: '#ECECEC', margin: '0 8px'}}>
                    <Card title="绑定营销号" bordered={false} style={{width: '100%'}}>
                        <List wrappedComponentRef={(form) => this.formRef = form} todos={this.state.todos}
                              types='Add' deleteFn={this.deleteFn.bind(this)}></List>
                        {
                            this.state.todos.length < 2 ?
                                <div className="add-binding-button" onClick={this.addMarket}>
                                    + 新增营销号
                                </div> : null
                        }
                    </Card>
                    <div className="upload-title bottom-btn">
                        <Button type="default" style={{marginRight: '20px'}} onClick={this.handleCancel}>取消</Button>
                        <Modal
                            title="提示"
                            cancelText="取消"
                            okText="确定"
                            visible={this.state.visible}
                            onOk={this.handleOk}
                            onCancel={this.handleTipCancel}
                        >
                            <p>表单中仍有内容，是否确认取消？</p>
                        </Modal>
                        <Button disabled={this.state.disableBtn} type="primary" onClick={this.handleSubmit}>提交</Button>
                    </div>
                </div>
            </div>
        )
    }
}
const
    CollectionCreateForm = Form.create()(Local);
export
default
CollectionCreateForm;
