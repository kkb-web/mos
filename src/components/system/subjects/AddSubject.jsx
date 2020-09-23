import React, {Component} from 'react';
import BreadcrumbCustom from '../../common/BreadcrumbCustom';
import {Card, Modal, Upload, Select, Form, InputNumber, Input, Button, Icon, message, Tooltip} from 'antd';
import {requestData} from "../../../utils/qiniu";
import history from '../../common/History'


import './AddSubject.less'

function handleChange(value) {
    console.log(`selected ${value}`);
}

const FormItem = Form.Item;
const Option = Select.Option;
class Local extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            img: '',
            marketCount: [
                { name: '红色阳光', },
                { name: '蓝色阳光', },
            ],
            count:0,
            data: [
                { name: '红色阳光', },
                { name: '蓝色阳光', },
            ],
        };
    }

    componentDidMount() {
        // this.setState({
        //     marketCount : this.state.marketCount.push(1)
        // })
    }

    //按钮点击上传微信二维码图片
    clickOneUpload = () => {
        let inputUpload = document.querySelector('.thumbnai-pic input')
        inputUpload.click()
    };

    //上传微信二维码图片
    uploadPic = (files) => {
        let fileReader = new FileReader(); // 图片上传，读图片
        let file = files.file; // 获取到上传的对象
        let _this = this;
        fileReader.onload = (function (file) {
            return function (ev) {
                _this.setState({
                    img: ev.target.result
                })
            }
        })(file);
        fileReader.readAsDataURL(file); // 读取完毕，显示到页面
        if (this.state.uploadThumbnail) {
            requestData(file).then(res => {
                this.setState({
                    shareThumbnails: res.data.key
                });
            })
        } else {
            message.error('格式错误，请上传jpg/jpeg/png格式的图片')
        }
    };
    addMarket = () => {
        let arr = this.state.marketCount
        arr.push(1)
        this.setState({
            marketCount: arr
        })
    }
    deletMarketDoms = (index,e) => {
        e.stopPropagation()
        alert(e.target.parentNode.getAttribute("data-index"))
        this.setState({
            marketCount: this.state.marketCount.filter((elem, i) => index != i)
        })
    }
    onRemove = (index, e)=>{
        this.setState({
            data: this.state.data.filter((elem, i) => i != index)
        });
    }

    上传微信二维码图片验证
    beforeUploadThumbnail = (file) => {
        if (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') {
            this.setState({
                uploadThumbnail: true,
                thumbnailStatus: 'success',
            })
        } else {
            this.setState({
                uploadThumbnail: false,
                thumbnailStatus: 'error',
                img: null
            });
        }
    };
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
    handleSubmit = (e) => {
        console.log(this.props.form.getFieldsValue());
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);

            }
        });
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
                name: '系统管理',
                path: ''
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

        let marketForm = this.state.marketCount && this.state.marketCount.map((item, index) => {
            return (
                <div key={index} className="add-binding-box">
                    <p>{index}</p>
                    <div style={{cursor: 'pointer', position: 'absolute', top: '10px', right: '10px',}}
                         key={index}
                         data-index={index}
                         onClick={this.deletMarketDoms.bind(this, index)}
                    >
                        <Tooltip title="删除营销号">
                            <Icon type="close" theme="outlined"/>
                        </Tooltip>
                    </div>
                    <Form layout="horizontal">
                        <FormItem id="subject" className="add-binding-box-form first" label="学科"
                                  validateStatus={this.state.titleState}
                                  help={this.state.o} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('subject' + index, {
                                rules: [{required: true, message: '学科不能为空'}],
                            })(
                                <Select
                                    onChange={handleChange}
                                    placeholder="选择所属学科"
                                    // getPopupContainer={() => document.getElementById('subject')}
                                >
                                    <Option value="java">java</Option>
                                    <Option value="web">web</Option>
                                    <Option value="c4d">c4d</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem className="add-binding-box-form" label="微信编号"
                                  validateStatus={this.state.titleState}
                                  help={this.state.k} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('wxnumber' + index, {
                                rules: [{required: true, message: '微信编号不能为空'}],
                            })(
                                <InputNumber min={0} max={10000}/>
                            )}
                        </FormItem>
                        <FormItem className="add-binding-box-form" label="微信号"
                                  validateStatus={this.state.titleState}
                                  help={this.state.a} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('wechatnumber' + index, {
                                rules: [{required: true, message: '微信号不能为空'}],
                            })(
                                <Input placeholder="对应的微信号"/>
                            )}
                        </FormItem>
                        <FormItem className="open-course-form" label="微信二维码图片"
                                  validateStatus={this.state.thumbnailStatus} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('share' + index, {
                                rules: [{required: true, message: '请上传缩略图'}],
                            })(
                                <div className="form-item thumbnai-pic">
                                    <Upload
                                        name="avatar"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        fileList={this.state.fileLists}
                                        customRequest={this.uploadPic}
                                        beforeUpload={this.beforeUploadThumbnail}
                                    >
                                        {this.state.img ? <img src={this.state.img} alt="noImg"/> : uploadButton}
                                    </Upload>
                                    <div style={{marginTop: '10px'}}>
                                        <Button type="default" style={{width: '100px', textAlign: 'center'}}
                                                onClick={this.clickOneUpload}>上传</Button>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                        <FormItem className="add-binding-box-form" label="好友数"
                                  validateStatus={this.state.titleState}
                                  help={this.state.c} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('friendsnumber' + index, {
                                rules: [{required: false, message: '好友数不能为空'}],
                            })(
                                <Input placeholder="对应的微信号"/>
                            )}
                        </FormItem>
                        <FormItem className="add-binding-box-form" label="手机号"
                                  validateStatus={this.state.titleState}
                                  help={this.state.w} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('telephone' + index, {
                                rules: [{required: false, message: '手机号不能为空'}],
                            })(
                                <Input placeholder="对应的微信号"/>
                            )}
                        </FormItem>
                    </Form>
                </div>
            )
        })
        return (
            <div className="devide-add">
                <div className="device-add-head">
                    <BreadcrumbCustom paths={menus}/>
                    <p className="head-title-style">新建设备</p>
                    <span className="describe">创建新设备，并添加该设备下的营销号相关信息，便于统一管理和分配。</span>
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
                        {marketForm}
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
                        >
                            <p>表单中仍有内容，是否确认取消？</p>
                        </Modal>
                        <Button type="primary" onClick={this.handleSubmit}>提交</Button>
                    </div>
                </div>
            </div>
        )
    }
}
const CollectionCreateForm = Form.create()(Local);
export default CollectionCreateForm;
