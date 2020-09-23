import React, {Component} from 'react';
import BreadcrumbCustom from '../../common/BreadcrumbCustom';
import {Card, Modal, Select, Form, Input, Button, Icon, message} from 'antd';
import {requestData} from "../../../utils/qiniu";
import history from '../../common/History'
import {setformdata, deletMarket, urleditDevice} from '../../../api/deviceApi'

//websoket
import { getToken} from "../../../utils/filter";
import {connect} from "../../../utils/socket";


import './AddDevice.less'
import List from './common/MarketList'

const FormItem = Form.Item;
const confirm = Modal.confirm;
class Local extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            img: '',
            marketCount: [],
            todos: [],
            sellerIds:[],
            disableBtn: false
        };
    }

    componentDidMount() {
        let data = {
            deviceId: this.props.match.params.id
        }
        this.setformdatas(data)
        //链接websocket
        connect(getToken('username'));
        //end
    }

    //设置数据
    setformdatas = (deviceId) => {
        setformdata(deviceId).then(res => {
            this.props.form.setFieldsValue({
                IMEI: res.data.data.imei,
                equipmentmodel: res.data.data.type,
            });
            console.log(res.data)
        }).catch(err => {

        })
    }


    //获取子组件营销号的数量
    getchailddata = (val) => {
        this.setState({
            marketCount: val
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
            if (fieldsvalue[i]) {
                this.showModal();
                break;
            } else if (count > arr.length) {      // 当遍历完所有的控件都为空时，返回上一级菜单
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
    //取消绑定营销号
    getDeleteID = (data) => {
        this.setState({
            sellerIds:data
        })
    }

    DeleteMarkets = ()=>{
        let sendData = {
            sellerIds: {sellerIds:this.state.sellerIds},
            deviceId: parseInt(this.props.match.params.id)
        }
        console.log(sendData,"取消绑定")
        deletMarket(sendData).then(res => {
            console.log(res.data,"取消绑定营销号，success")
        }).catch(err => {
            console.log(err.data,"取消绑定营销号，err")
        })
    }

    handleSubmitdata = (data) => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if(this.state.sellerIds.length>0){
                    this.DeleteMarkets()
                }
                this.setState({
                    disableBtn: true
                });
                urleditDevice(data).then(res => {
                    this.setState({
                        disableBtn: false
                    });
                    if (res.data.code == 0) {
                        message.success('编辑成功');
                        history.push('/app/authority/device')
                    }
                    if(res.data.code == 10002){
                        message.warn(res.data.msg)
                    }
                    console.log(res.data)
                }).catch(err => {

                })
            }
        });
    }
    handleSubmit = (e) => {
        const data = this.formRef.getItemsValue()
        const formdata = this.props.form.getFieldsValue();
        const imei = formdata.IMEI
        const types = formdata.equipmentmodel
        let sendData = {
            imei: imei,
            type: types,
            id: parseInt(this.props.match.params.id),
            sellers: data
        }
        console.log(data, "____________")
        data === undefined ? console.log('请填写消息') : this.handleSubmitdata(sendData)
    }

    //添加营销号
    addMarket = () => {
        this.formRef.EditaddMarket()
    }

    // 删除营销号
    deleteFn(id) {
        let data = this.state.todos;
        let that = this;
        confirm({
            title: '确认取消绑定该设备吗？',
            content: '将此营销号取消绑定设备后，营销号将处于无人认领状态，不能再用于其他用途。确定要继续吗?',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                return new Promise((resolve, reject) => {

                    that.setState({
                        // 此处为数组过滤 不懂速查   arr.filter()
                        todos: data.filter(item => {
                            if (item.id !== id) {
                                return item
                            }
                        })
                    })
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 300);
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() {

            },
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const FormItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 16},
        };
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
                name: '编辑设备',
                path: ''
            }
        ];
        return (
            <div className="devide-add">
                <div className="device-add-head">
                    <BreadcrumbCustom paths={menus}/>
                    <p className="head-title-style">编辑设备</p>
                    <span className="describe">编辑设备的基本信息或修改绑定的营销号信息，便于管理设备与营销号的关系。</span>
                </div>
                <div className="devide-add-information"
                     style={{background: '#ECECEC', margin: '0 8px', marginBottom: '24px'}}>
                    <Card title="基本信息" bordered={false} style={{width: '100%'}}>
                        <div className="add-information-box">
                            <Form layout="horizontal">
                                <FormItem className="add-binding-box-form" label="设备IMEI"
                                          validateStatus={this.state.titleState}
                                          help={this.state.a} {...FormItemLayout} hasFeedback>
                                    {getFieldDecorator('IMEI', {
                                        rules: [{required: true, message: '设备IMEI不能为空'}],
                                    })(
                                        <Input placeholder="对应的微信号"/>
                                    )}
                                </FormItem>
                                <FormItem className="add-binding-box-form" label="设备型号"
                                          validateStatus={this.state.titleState}
                                          help={this.state.w} {...FormItemLayout} hasFeedback>
                                    {getFieldDecorator('equipmentmodel', {
                                        rules: [{required: false, message: '设备型号不能为空'}],
                                    })(
                                        <Input placeholder="对应的微信号"/>
                                    )}
                                </FormItem>
                            </Form>
                        </div>
                    </Card>
                </div>
                <div className="devide-add-binding" style={{background: '#ECECEC', margin: '0 8px'}}>
                    <Card title="绑定营销号" bordered={false} style={{width: '100%'}}>
                        <List wrappedComponentRef={(form) => this.formRef = form} types='edit'
                              getvalue={this.getchailddata} deleteID={this.getDeleteID.bind(this)}
                              deviceID={this.props.match.params.id} deleteFn={this.deleteFn.bind(this)}></List>
                        {
                            this.state.marketCount.length < 2 ?
                                <div className="add-binding-button" onClick={this.addMarket}>
                                    + 新增营销号
                                </div> : null
                        }
                    </Card>
                    <div className="upload-title bottom-btn">
                        <Button type="default" style={{marginRight: '20px'}} onClick={this.handleCancel}>取消</Button>
                        <Modal
                            title="提示"
                            visible={this.state.visible}
                            onOk={this.handleOk}
                            onCancel={this.handleTipCancel}
                            okText="确定"
                            cancelText="取消"
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
const CollectionCreateForm = Form.create()(Local);
export default CollectionCreateForm;
