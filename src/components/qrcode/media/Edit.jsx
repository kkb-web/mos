import React from 'react';
import './Upload.less';
import BreadcrumbCustom from '../../common/BreadcrumbCustom';
import {Upload, Form, Input, Icon, Button, InputNumber, Tooltip, message, Card,Modal} from 'antd';
import history from "../../common/History";
import {getHeaders} from "../../../utils/filter";
import {axiosInstance} from "../../../utils/global-props";
import {requestData} from "../../../utils/qiniu";

const FormItem = Form.Item;
let deleteData = [];

class Local extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
            imageUrl: [],
            imageList: [],
            img: '',
            titleHint: '',
            titleState: '',
            groupSharingHint: '',
            groupSharingState: '',
            shareDescribeHint: '',
            shareDescribeState: '',
            friendCircleHint: '',
            friendCircleState: '',
            fileList: [],
            fileLists: [],
            previewImage: '',
            data: {},
            shareThumbnails: '',
            qrCodeThumbnailsList: [], //二维码列表
            upload: true,
            uploadThumbnail: true,
            weight: []
        };
    }

    // 获取二维码编辑页的相关信息
    componentDidMount() {
        let _this = this;
        let input = document.querySelectorAll('input');
        for (let i = 0; i < input.length; i++) {
            input[i].autocomplete = "off"
        }
        axiosInstance.get({
            url: '/crm/qrCodeTransferPage/details/' + window.location.pathname.slice(17),
            headers: getHeaders()
        }).then(function (res) {
            console.log("res.data.data====="+res.data.data)
            _this.setState({
                data: res.data.data,
                qrCodeThumbnailsList: res.data.data.qrCodeThumbnailsList,
                img: 'https://img.kaikeba.com/' + res.data.data.shareThumbnails,
                shareThumbnails: res.data.data.shareThumbnails
            });
            _this.props.form.setFieldsValue({
                name: res.data.data.title,
                qun: res.data.data.groupShareTitle,
                des: res.data.data.shareDescription,
                firend: res.data.data.friendsCircleShareTitle,
                share: _this.state.img,
                qrcode: res.data.data.qrCodeThumbnailsList
            });
        });
    };

    // 编辑二维码
    editQrcode = (params) => {
        axiosInstance.post({
            url: '/crm/qrCodeTransferPage/edit',
            data: params,
            headers: getHeaders()
        }).then(function (res) {
            if (res.data.code === 0) {
                message.success('编辑成功');
                history.push('/app/qrcode/list')
            } else {
                message.error(res.data.msg);
            }
        });
    };

    // 保存，编辑二维码
    handleSubmit = () => {
        let inputs = document.querySelectorAll('.ant-roles-item-children .ant-input');
        if (inputs[0].value === '') {
            this.setState({
                titleHint: '名称不能为空',
                titleState: 'error'
            });
            document.getElementById('content').scrollTop = 140
        }
        if (inputs[1].value === '') {
            this.setState({
                groupSharingHint: '群分享标题不能为空',
                groupSharingState: 'error'
            })
        }
        if (inputs[2].value === '') {
            this.setState({
                shareDescribeHint: '群分享描述不能为空',
                shareDescribeState: 'error'
            })
        }
        if (inputs[3].value === '') {
            this.setState({
                friendCircleHint: '朋友圈分享标题不能为空',
                friendCircleState: 'error'
            })
        }
        let params = {};
        let _this = this;
        let qrCodeThumbnailsList =[];
        let originInput = document.querySelectorAll('.origin-input input');
        for (let j = 0; j < this.state.qrCodeThumbnailsList.length; j++) {
            qrCodeThumbnailsList.push({
                id: this.state.qrCodeThumbnailsList[j].id,
                weight: originInput[j].value
            })
        }
        if (this.state.imageList.length !== 0) {
            for (let i = 0; i < this.state.imageList.length; i++) {
                qrCodeThumbnailsList.push({
                    qrCode: this.state.imageList[i],
                    weight: this.state.weight[i]
                })
            }
        }
        this.props.form.validateFields((err, values) => {
            params = {
                id: _this.state.data.id,
                title: values.name,
                groupShareTitle: values.qun,
                shareDescription: values.des,
                friendsCircleShareTitle: values.firend,
                shareThumbnails: _this.state.shareThumbnails,
                qrCodeThumbnailsList: qrCodeThumbnailsList
            }
        });
        let deleteParams = {
            qrCodeTransferPageId: _this.state.data.id,
            id: deleteData
        };
        console.log(deleteData);
        if (deleteData.length !== 0) {
            axiosInstance.delete({
                url: '/crm/qrCodeTransferPage/qrCode/delete',
                data: deleteParams,
                headers: getHeaders()
            }).then(function (res) {
                if (res.data.code === 0) {
                    deleteData = [];
                    _this.editQrcode(params);
                } else {
                    message.error(res.data.msg)
                }
            });
        } else {
            _this.editQrcode(params);
        }
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = () => {
        this.setState({
            visible: false,
        });
        this.props.form.resetFields();
        history.push('/app/qrcode/list');
    }

    handleTipCancel = () => {
        this.setState({
            visible: false,
        });
    }
/// 取消
    handleCancel = () => {
        deleteData = [];
        let _this = this;
        axiosInstance.get({
            url: '/crm/qrCodeTransferPage/details/' + window.location.pathname.slice(17),
            headers: getHeaders()
        }).then(function (res) {
            let sourcevalues = ({
                name: res.data.data.title,
                qun: res.data.data.groupShareTitle,
                des: res.data.data.shareDescription,
                firend: res.data.data.friendsCircleShareTitle,
                share: 'https://img.kaikeba.com/' + res.data.data.shareThumbnails,
                qrcode:res.data.data.qrCodeThumbnailsList
            });
            console.log(sourcevalues);
            console.log(sourcevalues.qrcode.length);
            let fieldvalues = _this.props.form.getFieldsValue();
            console.log(fieldvalues);
            console.log(fieldvalues.qrcode.length);
            console.log("res",res.data);
            // 将JSON数据的key值存为一个数组，便于获取对象fieldsvalue的长度
            let arr = Object.keys(fieldvalues);
            // 设置一个计数器，用来记录控件值为空的个数
            let count = 1;
            for(let i in sourcevalues){
                count++;
                if(i === 'qrcode'){
                    _this.Compare(sourcevalues.qrcode,fieldvalues.qrcode);
                    break;
                }else if(sourcevalues[i] !== fieldvalues[i]){
                    _this.showModal();
                    break;
                }else if(count>arr.length) {      // 当遍历完所有的控件都为空时，返回上一级菜单
                    history.push('/app/qrcode/list')
                }
            }

        });
        document.getElementById('content').scrollTop = 0
    };
    Compare = (objA,objB) =>{
        if(objA.length!=objB.length){
            this.showModal();
        }else {
            let count = 1;
            for (let i in objA) {
                count++;
                if (objA[i].qrCode !== objB[i].qrCode) {
                    this.showModal();
                    break;
                }else if(count>objA.length){
                    history.push('/app/qrcode/list')
                }
            }
        }
    }

    // 检查权重
    numberChange = (value) => {
        if (value > 100 || value < 0) {
            message.error('权重值为1-100之间', 1)
        }
    };

    // 检查权重
    addNumberChange = (index, value) => {
        console.log(index, value)
        let weight = this.state.weight;
        weight[index] = value;
        this.setState({
            weight: weight
        });
        if (value > 100 || value < 0) {
            message.error('权重值为1-100之间', 1)
        }
    };

    // 检查名称
    titleCheck = (e) => {
        if (e.target.value.length === 0) {
            this.setState({
                titleHint: '名称不能为空',
                titleState: 'error'
            })
        } else if (e.target.value.length > 30) {
            this.setState({
                titleHint: '名称少于30字',
                titleState: 'error'
            })
        } else if (!(e.target.value.indexOf(" ") == -1)) {
            this.setState({
                titleHint: '禁止输入空格',
                titleState: 'error'
            })
        } else {
            this.setState({
                titleHint: '',
                titleState: 'success'
            })
        }
    };

    // 检查群分享标题
    groupSharingCheck = (e) => {
        if (e.target.value.length === 0) {
            this.setState({
                groupSharingHint: '群分享标题不能为空',
                groupSharingState: 'error'
            })
        } else if (e.target.value.length > 20) {
            this.setState({
                groupSharingHint: '群分享标题少于20字',
                groupSharingState: 'error'
            })
        } else if (!(e.target.value.indexOf(" ") == -1)) {
            this.setState({
                groupSharingHint: '禁止输入空格',
                groupSharingState: 'error'
            })
        } else {
            this.setState({
                groupSharingHint: '',
                groupSharingState: 'success'
            })
        }
    };

    // 检查群分享描述
    shareDescribeCheck = (e) => {
        if (e.target.value.length === 0) {
            this.setState({
                shareDescribeHint: '群分享描述不能为空',
                shareDescribeState: 'error'
            })
        } else if (e.target.value.length > 30) {
            this.setState({
                shareDescribeHint: '群分享描述少于30字',
                shareDescribeState: 'error'
            })
        } else if (!(e.target.value.indexOf(" ") == -1)) {
            this.setState({
                shareDescribeHint: '禁止输入空格',
                shareDescribeState: 'error'
            })
        } else {
            this.setState({
                shareDescribeHint: '',
                shareDescribeState: 'success'
            })
        }
    };

    // 检查朋友圈描述
    friendCircleCheck = (e) => {
        if (e.target.value.length === 0) {
            this.setState({
                friendCircleHint: '朋友圈分享标题不能为空',
                friendCircleState: 'error'
            })
        } else if (e.target.value.length > 30) {
            this.setState({
                friendCircleHint: '朋友圈分享标题少于30字',
                friendCircleState: 'error'
            })
        } else if (!(e.target.value.indexOf(" ") == -1)) {
            this.setState({
                friendCircleHint: '禁止输入空格',
                friendCircleState: 'error'
            })
        } else {
            this.setState({
                friendCircleHint: '',
                friendCircleState: 'success'
            })
        }
    };

    // 按钮点击上传
    clickUpload = () => {
        let input = document.querySelector('.qrcode-upload input')
        input.click()
    };

    // 检查图片的格式
    beforeUpload = (file) => {
        if (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') {
            this.setState({
                upload: true
            })
        } else {
            this.setState({
                upload: false
            })
        }
    };

    // 上传图片
    upload = (files) => {
        let imageList = this.state.imageUrl;
        let imageLists = this.state.imageList;
        let weight = this.state.weight;
        let fileReader = new FileReader(); // 图片上传，读图片
        let file = files.file; // 获取到上传的对象
        let _this = this;
        fileReader.onload = (function () {
            return function (ev) {
                imageList.push(ev.target.result);
                weight.push(1);
                _this.setState({
                    imageUrl: imageList,
                    weight: weight
                });
            }
        })(file);
        fileReader.readAsDataURL(file); // 读取完毕，显示到页面
        if (this.state.upload) {
            requestData(file).then(res => {
                imageLists.push(res.data.key)
                _this.setState({
                    imageList: imageLists
                });
            });
        } else {
            message.error('格式错误，请上传jpg/jpeg/png格式的图片')
        }
    };

    clickOneUpload = () => {
        let inputUpload = document.querySelector('.thumbnai-pic input');
        inputUpload.click();
    };

    // 上传缩略图格式检查
    beforeUploadThumbnail = (file) => {
        if (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') {
            this.setState({
                uploadThumbnail: true
            })
        } else {
            this.setState({
                uploadThumbnail: false
            })
        }
    };

    // 上传缩略图
    uploadPic = (files) => {
        let fileReader = new FileReader(); // 图片上传，读图片
        let file = files.file; // 获取到上传的对象
        let _this = this;
        fileReader.onload = (function () {
            return function (ev) {
                _this.setState({
                    img: ev.target.result
                });
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

    deletePic = (index) => {
        let imageList = this.state.imageUrl;
        let imageLists = this.state.imageList;
        let weight = this.state.weight;
        imageList.splice(index, 1);
        imageLists.splice(index, 1);
        weight.splice(index, 1);
        this.setState({
            imageUrl: imageList,
            imageList: imageLists,
            weight: weight
        });
    };

    deleteOriginPic = (index) => {
        deleteData.push(this.state.qrCodeThumbnailsList[index].id);
        let qrCodeThumbnailsList = this.state.qrCodeThumbnailsList;
        qrCodeThumbnailsList.splice(index, 1);

        this.setState({
            qrCodeThumbnailsList: qrCodeThumbnailsList
        });
        console.log(deleteData, "=========deleteid")
    };

    render() {
        const {form} = this.props
        const {getFieldDecorator} = form;
        const FormItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 16},
        };
        const text = <span>权重值1-100</span>;
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
                path: '/app/qrcode/list',
                name: '二维码中转页'
            },
            {
                name: '编辑二维码',
                path: ''
            }
        ];
        return (
            <div>
                <div className="page-nav">
                    <BreadcrumbCustom paths={menus}/>
                    <p className="title-style">编辑二维码</p>
                </div>
                {/*<div className='formBody'>*/}
                <Card title="基本信息" style={{ marginBottom: 24 }} bordered={false}>
                    {/*<p className="upload-title">基本信息</p>*/}
                    <Form layout="horizontal" style={{paddingBottom: '20px'}}>
                        <FormItem className="editor-form" label="名称" validateStatus={this.state.titleState} help={this.state.titleHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('name', {
                                rules: [{required: true, message: '内部标识投放渠道不能为空'}],
                            })(
                                <Input placeholder="内部标识投放渠道" onChange={this.titleCheck}/>
                            )}
                        </FormItem>
                        <FormItem className="editor-form" label="二维码" {...FormItemLayout}>
                            <div className="qrcode-photo">
                                {this.state.qrCodeThumbnailsList && this.state.qrCodeThumbnailsList.map((value, index) => {
                                    return (
                                        <div className="form-item" key={index} style={{position: 'relative'}}>
                                            <div style={{position: 'absolute', left: '0', right: '0', bottom: '40px', top: '0', zIndex: '100'}}/>
                                            <Upload
                                                name="avatar"
                                                listType="picture-card"
                                                className="avatar-uploader"
                                                fileList={this.state.fileList}
                                                customRequest={this.upload}
                                            >
                                                {this.state.qrCodeThumbnailsList[index] ?
                                                    <img alt="example" style={{width: '100%'}}
                                                         src={'https://img.kaikeba.com/' + this.state.qrCodeThumbnailsList[index].qrCode}/>
                                                    : null}
                                            </Upload>
                                            <div style={{marginTop: '10px'}}>
                                                <Tooltip placement="bottom" title={text}>
                                                    权重：<InputNumber className="origin-input" min={1} max={100} defaultValue={this.state.qrCodeThumbnailsList[index].weight}
                                                                    onChange={this.numberChange}
                                                                    style={{width: '65px', marginRight: '5px'}}/>
                                                </Tooltip>
                                                <Button type="primary" icon="delete" onClick={this.deleteOriginPic.bind(this, index)}/>
                                            </div>
                                        </div>
                                    )
                                })}
                                {this.state.imageUrl && this.state.imageUrl.map((value, index) => {
                                    return (
                                        <div className="form-item" key={index} style={{position: 'relative'}}>
                                            <div style={{position: 'absolute', left: '0', right: '0', bottom: '40px', top: '0', zIndex: '100'}}/>
                                            <Upload
                                                name="avatar"
                                                listType="picture-card"
                                                className="avatar-uploader"
                                                fileList={this.state.fileList}
                                                customRequest={this.upload}
                                            >
                                                {this.state.imageUrl[index] ?
                                                    <img alt="example" style={{width: '100%'}}
                                                         src={this.state.imageUrl[index]}/>
                                                    : null}
                                            </Upload>
                                            <div style={{marginTop: '10px'}}>
                                                <Tooltip placement="bottom" title={text}>
                                                    权重：<InputNumber className="weight-input" min={1} max={100} value={this.state.weight[index]}
                                                                    onChange={this.addNumberChange.bind(this, index)}
                                                                    style={{width: '65px', marginRight: '5px'}}/>
                                                </Tooltip>
                                                <Button type="primary" icon="delete" onClick={this.deletePic.bind(this, index)}/>
                                            </div>
                                        </div>
                                    )
                                })}
                                {getFieldDecorator('qrcode', {
                                    rules: [{required: true, message: '请上传二维码'}],
                                })(
                                    <div className="form-item qrcode-upload">
                                        <Upload
                                            name="avatar"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            fileList={this.state.fileList}
                                            customRequest={this.upload}
                                            beforeUpload={this.beforeUpload}
                                        >
                                            {uploadButton}
                                        </Upload>
                                        <div style={{marginTop: '10px'}}>
                                            <Button type="default" style={{width: '100px', textAlign: 'center'}}
                                                    onClick={this.clickUpload}>上传</Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </FormItem>
                    </Form>
                </Card>
                <Card title="微信分享信息" bordered={false}>
                    {/*<p className="upload-title">微信分享信息</p>*/}
                    <Form layout="horizontal" style={{paddingBottom: '20px'}}>
                        <FormItem className="editor-form" label="群分享标题" validateStatus={this.state.groupSharingState} help={this.state.groupSharingHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('qun', {
                                rules: [{required: true, message: '群分享标题不能为空'}],
                            })(
                                <Input placeholder="建议20字以内" onChange={this.groupSharingCheck}/>
                            )}
                        </FormItem>
                        <FormItem className="editor-form" label="分享描述" validateStatus={this.state.shareDescribeState} help={this.state.shareDescribeHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('des', {
                                rules: [{required: true, message: '分享描述不能为空'}],
                            })(
                                <Input placeholder="建议30字以内" onChange={this.shareDescribeCheck}/>
                            )}
                        </FormItem>
                        <FormItem className="editor-form" label="朋友圈分享标题" validateStatus={this.state.friendCircleState} help={this.state.friendCircleHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('firend', {
                                rules: [{required: true, message: '朋友圈分享标题不能为空'}],
                            })(
                                <Input placeholder="建议30字以内" onChange={this.friendCircleCheck}/>
                            )}
                        </FormItem>

                        <FormItem className="editor-form" label="分享缩略图" {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('share', {
                                rules: [{required: true, message: '内部标识投放渠道'}],
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
                                        {this.state.img ? <img src={this.state.img} alt="avatar"/> : uploadButton}
                                    </Upload>
                                    <div style={{marginTop: '10px'}}>
                                        <Button type="default" style={{width: '100px', textAlign: 'center'}} onClick={this.clickOneUpload}>上传</Button>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Form>
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
                    <Button type="primary" onClick={this.handleSubmit}>保存并重新生成</Button>
                </div>
                {/*</div>*/}
            </div>
        );
    }

}

const CollectionCreateForm = Form.create()(Local);
export default CollectionCreateForm;
