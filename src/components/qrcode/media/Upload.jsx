import React from 'react';
import './Upload.less';
import BreadcrumbCustom from '../../common/BreadcrumbCustom';
import {Upload, Form, Input, Icon, Button, InputNumber, Tooltip, message, Card,Modal} from 'antd';
import history from '../../common/History'
import {getHeaders} from "../../../utils/filter";
import {axiosInstance} from "../../../utils/global-props";
import {requestData} from "../../../utils/qiniu";

const FormItem = Form.Item;

class Local extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
            imageUrl: [],
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
            imageList: [],
            upload: true,
            uploadThumbnail: true,
            thumbnailStatus: '',
            weight: []
        };
    }

    componentDidMount () {
        let input = document.querySelectorAll('input');
        for (let i = 0; i < input.length; i++) {
            input[i].autocomplete = "off"
        }
    }

    // 提交
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
            });
        }
        if (inputs[2].value === '') {
            this.setState({
                shareDescribeHint: '群分享描述不能为空',
                shareDescribeState: 'error'
            });
        }
        if (inputs[3].value === '') {
            this.setState({
                friendCircleHint: '朋友圈分享标题不能为空',
                friendCircleState: 'error'
            });
        }
        if (this.state.img === '') {
            this.setState({
                thumbnailStatus: 'error'
            })
        }
        if (this.state.imageUrl.length === 0) {
            document.getElementById('content').scrollTop = 140
        }
        let params = {};
        let _this = this;
        let qrCodeThumbnailsList =[];
        for (let i = 0; i < this.state.imageList.length; i++) {
            qrCodeThumbnailsList.push({
                qrCode: this.state.imageList[i],
                weight: this.state.weight[i]
            })
        }
        this.props.form.validateFields((err, values) => {
            params = {
                "title": values.name,
                "groupShareTitle": values.qun,
                "shareDescription": values.des,
                "friendsCircleShareTitle": values.firend,
                "shareThumbnails": _this.state.shareThumbnails,
                "qrCodeThumbnailsList": qrCodeThumbnailsList
            }
        });
        axiosInstance.post({
            url: '/crm/qrCodeTransferPage/add',
            data: params,
            headers: getHeaders()
        }).then(function (res) {
            if (res.data.code === 0) {
                message.success('提交成功');
                history.push('/app/qrcode/list')
            } else {
                message.error(res.data.msg)
            }
        });
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
// 取消
    handleCancel = () => {
        console.log(this.props.form.getFieldsValue());
        let fieldsvalue = this.props.form.getFieldsValue();
        // 将JSON数据的key值存为一个数组，便于获取对象fieldsvalue的长度
        let arr = Object.keys(fieldsvalue);
        // 设置一个计数器，用来记录控件值为空的个数
        let count = 1;
        // 遍历表单中所有控件的值
        for (let i in fieldsvalue){
            count++;
            // 如果控件的值不为空，则显示提示框
            if(fieldsvalue[i]){
                this.showModal();
                break;
            }else if(count>arr.length) {      // 当遍历完所有的控件都为空时，返回上一级菜单
                history.push('/app/qrcode/list')
            }
        }
        document.getElementById('content').scrollTop = 0
    };

    // 检查权重
    numberChange = (index , value, e) => {
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

    // 上传二维码图片
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
            })
        } else {
            message.error('格式错误，请上传jpg/jpeg/png格式的图片')
        }
    };

    clickOneUpload = () => {
        let inputUpload = document.querySelector('.thumbnai-pic input');
        inputUpload.click()
    };

    // 上传缩略图格式检查
    beforeUploadThumbnail = (file) => {
        if (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') {
            this.setState({
                uploadThumbnail: true,
                thumbnailStatus: 'success'
            })
        } else {
            this.setState({
                uploadThumbnail: false,
                thumbnailStatus: 'error',
                img: null
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

    // 删除二维码
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

    render() {
        const {getFieldDecorator} = this.props.form;
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
                name: '新建二维码',
                path: ''
            }
        ];
        return (
            <div>
                <div className="page-nav">
                    <BreadcrumbCustom paths={menus}/>
                    <p className="title-style">新建二维码</p>
                </div>
                <Card title="基本信息" style={{ marginBottom: 24 }} bordered={false}>
                    <Form layout="horizontal" style={{paddingBottom: '20px'}}>
                        <FormItem className="qrcode-form" label="名称" validateStatus={this.state.titleState} help={this.state.titleHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('name', {
                                rules: [{required: true, message: '内部标识投放渠道不能为空'}],
                            })(
                                <Input placeholder="内部标识投放渠道" onChange={this.titleCheck}/>
                            )}
                        </FormItem>
                        <FormItem className="qrcode-form" label="二维码" {...FormItemLayout}>
                            <div className="qrcode-photo">
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
                                                    <img alt="noImg" style={{width: '100%'}}
                                                         src={this.state.imageUrl[index]}/>
                                                    : null}
                                            </Upload>
                                            <div style={{marginTop: '10px'}}>
                                                <Tooltip placement="bottom" title={text}>
                                                    权重：<InputNumber className="weight-input" min={1} max={100} value={this.state.weight[index]}
                                                                    onChange={this.numberChange.bind(this, index)}
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
                    <Form layout="horizontal" style={{paddingBottom: '20px'}}>
                        <FormItem className="qrcode-form" label="群分享标题" validateStatus={this.state.groupSharingState} help={this.state.groupSharingHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('qun', {
                                rules: [{required: true, message: '群分享标题不能为空'}],
                            })(
                                <Input placeholder="建议20字以内" onChange={this.groupSharingCheck}/>
                            )}
                        </FormItem>
                        <FormItem className="qrcode-form" label="分享描述" validateStatus={this.state.shareDescribeState} help={this.state.shareDescribeHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('des', {
                                rules: [{required: true, message: '分享描述不能为空'}],
                            })(
                                <Input placeholder="建议30字以内" onChange={this.shareDescribeCheck}/>
                            )}
                        </FormItem>
                        <FormItem className="qrcode-form" label="朋友圈分享标题" validateStatus={this.state.friendCircleState} help={this.state.friendCircleHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('firend', {
                                rules: [{required: true, message: '朋友圈分享标题不能为空'}],
                            })(
                                <Input placeholder="建议30字以内" onChange={this.friendCircleCheck}/>
                            )}
                        </FormItem>

                        <FormItem className="qrcode-form" label="分享缩略图" validateStatus={this.state.thumbnailStatus} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('share', {
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
                    <Button type="primary" onClick={this.handleSubmit}>提交</Button>
                </div>
            </div>
        );
    }

}

const CollectionCreateForm = Form.create()(Local);
export default CollectionCreateForm;
