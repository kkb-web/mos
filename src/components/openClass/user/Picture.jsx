import React from 'react';
import {
    Tooltip,
    Input,
    Button,
    Pagination,
    Modal,
    LocaleProvider,
    message,
    Upload,
    Icon,
    Form,
    Popconfirm
} from 'antd';
import {requestData} from "../../../utils/wx";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import {
    addImg,
    cancelCollectTemplate,
    collectTemplate,
    deleteTemplate,
    editImgName, getCollectTemplate,
    getImgList, limitPicNumber
} from "../../../api/marketApi";

let params = {
    size: 10,
    current: 1,
    descs: ["create_time"]
};

class Picture extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            img: '',
            previewVisible: false,
            previewImage: 'https://img.kaikeba.com/course_2.png!w1h1',
            uploadImg: true,
            imgCountLists: [],
            dataAll: '',
            roleList: [],
            uploadIcon: 'upload',
            uploadText: '上传',
            limitImgCount: 0
        };
    }

    // 获取图片列表
    getImgList = () => {
        getImgList(params).then(res => {
            console.log(res.data.data, '========图片列表');
            this.setState({
                imgCountLists: res.data.data.records,
                dataAll: res.data.data,
            });
        })
    };

    // 获取收藏列表
    getCollectPicList = () => {
        getCollectTemplate({
            msgType: 'image',
            params: params
        }).then(res => {
            this.setState({
                imgCountLists: res.data.data.records,
                dataAll: res.data.data,
            });
        })
    };

    // 图片限制上传数量
    limitPicNumber = () => {
        limitPicNumber().then(res => {
            console.log(res.data.data.imageCount);
            if (res.data.code === 0) {
                this.setState({
                    limitImgCount: res.data.data.imageCount
                })
            }
        })
    };

    // 渲染
    componentDidMount() {
        this.getImgList();
        this.limitPicNumber()
    }

    // 预览
    showImg = (value) => {
        this.setState({
            previewVisible: true,
            previewImage: value.url
        })
    };

    // 预览取消
    handleCancel = () => {
        this.setState({
            previewVisible: false,
        });
    };

    // 收藏与取消收藏
    collectImg = (value, index) => {
        console.log(value, index, "========收藏");
        let imgUrlLists = this.state.imgCountLists;
        if (value.collectId) {
            cancelCollectTemplate({collectId: value.collectId}).then(res => {
                if (res.data.code === 0) {
                    imgUrlLists[index].collectId = null;
                    message.success("取消收藏");
                } else {
                    imgUrlLists[index].collectId = value.collectId;
                    message.error("取消收藏失败");
                }
                this.setState({
                    imgCountLists: imgUrlLists
                });
            })
        } else {
            collectTemplate({templateId: value.id,business:'OPENCOURSE'}).then(res => {
                if (res.data.code === 0) {
                    imgUrlLists[index].collectId = res.data.data;
                    message.success('收藏成功');
                } else {
                    imgUrlLists[index].collectId = null;
                    message.error('收藏失败');
                }
                this.setState({
                    imgCountLists: imgUrlLists
                });
            })
        }
    };

    // 删除图片
    deleteImg = (value, index) => {
        console.log(value, index, "========删除图片");
        deleteTemplate({templateId: value.id}).then(res => {
            if (res.data.code === 0) {
                message.success("删除成功");
                this.getImgList();
                this.limitPicNumber()
            } else {
                message.error("删除失败");
            }
        });
    };

    // 编辑图片名称
    editName = (id, e) => {
        console.log(id, e.target.value, "==========编辑图片名称");
        editImgName({
            id: id,
            name: e.target.value
        }).then(res => {
            console.log(res.data.data);
            if (res.data.code === 0) {
                message.success("修改成功");
            } else {
                message.error("修改失败");
            }
        })

    };

    // 图片名称值改变
    changeInputValue = (value, index, e) => {
        let imgUrlLists = this.state.imgCountLists;
        // console.log(value, index, "========input改变");
        imgUrlLists[index].name = e.target.value;
        this.setState({
            imgCountLists: imgUrlLists
        })
    };

    // 改变页码
    onChangePage = (page) => {
        params.current = page;
        this.getImgList();
        document.querySelector('.pic-choose-clear').click();
    };

    // 上传图片格式检查
    beforeUploadPic = (file) => {
        console.log(file);
        if (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'  || file.type === 'image/bmp') {
            if (file.size <= 2005243) {
                this.setState({
                    uploadImg: true,
                })
            } else {
                message.error('图片格式错误，请上传少于2MB的图片！');
                this.setState({
                    uploadImg: false,
                });
            }
        } else {
            this.setState({
                uploadImg: false,
            });
            message.error('格式错误，请上传jpg/jpeg/png/bmp/gif格式的图片')
        }
    };

    // 上传分享缩略图
    uploadPic = (files) => {
        if (this.state.uploadImg) {
            let fileReader = new FileReader(); // 图片上传，读图片
            let file = files.file; // 获取到上传的对象
            let _this = this;
            fileReader.onload = (function (file) {
                return function (ev) {
                    let data = ev.target.result;
                    let image = new Image();
                    image.onload = () => {
                        if (parseInt(image.width) <= 1920) {
                            _this.setState({
                                uploadIcon: 'loading',
                                uploadText: '上传中'
                            });
                            requestData(file).then(res => {
                                if (res.data.errcode === undefined) {
                                    addImg([{
                                        name: files.file.name,
                                        media_id: res.data.media_id,
                                        url: res.data.url,
                                        msgType: 'image',
                                        business:'OPENCOURSE'
                                    }]).then(res => {
                                        if (res.data.code === 0) {
                                            message.success('上传成功');
                                            _this.getImgList();
                                            _this.setState({
                                                uploadIcon: 'upload',
                                                uploadText: '上传'
                                            });
                                            _this.limitPicNumber();
                                        } else {
                                            message.error(res.data.msg);
                                            _this.setState({
                                                uploadIcon: 'upload',
                                                uploadText: '上传'
                                            });
                                        }
                                    }).catch(() => {
                                        _this.setState({
                                            uploadIcon: 'upload',
                                            uploadText: '上传'
                                        });
                                    })
                                } else {
                                    message.error('token失效');
                                    _this.setState({
                                        uploadIcon: 'upload',
                                        uploadText: '上传'
                                    });
                                }
                            }).catch(() => {
                                _this.setState({
                                    uploadIcon: 'upload',
                                    uploadText: '上传'
                                });
                            })
                        } else {
                            message.error('图片格式错误，请宽少于750的图片！');
                        }
                    };
                    image.src = data;
                }
            })(file);
            fileReader.readAsDataURL(file); // 读取完毕，显示到页面
        }
    };

    // 改变标题样式
    changeTitleStyle = (index) => {
        let aTags = document.querySelectorAll('.pic-title');
        for (let i = 0; i < aTags.length; i++) {
            if (i === index) {
                aTags[i].classList.add('pic-title_active');
            } else {
                aTags[i].classList.remove('pic-title_active');
            }
        }
        if (index === 1) {
            params.current = 1;
            params.descs = ['createTime'];
            this.getCollectPicList();
        } else {
            params.current = 1;
            params.descs = ['create_time'];
            this.getImgList();
        }
        document.querySelector('.pic-choose-clear').click();
    };

    // // 重置图片
    // resetPic = () => {
    //     params.current = 1;
    //     params.condition.status = undefined;
    //     this.getImgList()
    // };

    render() {
        const props = {
            showUploadList: false,
            customRequest: this.uploadPic,
            beforeUpload: this.beforeUploadPic
        };
        let {previewVisible, previewImage, imgCountLists, uploadIcon, uploadText, limitImgCount} = this.state;
        const {hidePicModal, showPicModal} = this.props;
        return(
            <div style={{marginTop: '-15px'}}>
                <div id="pic-input" style={{overflow: 'hidden', borderBottom: '1px solid #e8e8e8'}}>
                    <div style={{float: 'left'}} className="modal-title-second">
                        <p style={{marginTop: '5px'}}>
                            <span className="pic-title pic-title_active" style={{marginLeft: '45px', cursor: 'pointer'}} onClick={this.changeTitleStyle.bind(this, 0)}>全部</span>
                            <span className="pic-title" style={{marginLeft: '90px', cursor: 'pointer'}} onClick={this.changeTitleStyle.bind(this, 1)}>收藏</span>
                        </p>
                    </div>
                    <div style={{float: 'right',display: 'inline-flex'}}>
                        <div className="uploadTip">
                            <h6>图片要求：格式png/jpg/bmp/gif，最大 2M </h6>
                            <h6>图片数量：最多5000张，还可上传 <span style={{color: '#1890ff'}}>{5000 - parseInt(limitImgCount)}</span> 张</h6>
                        </div>
                        <Upload {...props}>
                            <Button style={{marginRight: '20px'}}>
                                <Icon type={uploadIcon}/> {uploadText}
                            </Button>
                        </Upload>
                    </div>
                </div>
                <div className="img-hint">
                    {imgCountLists.length === 0 ?
                        <p style={{textAlign: 'center', margin: '180px auto'}}>暂无数据</p> :
                        <div>
                            <div className="imgCount img-list" id="imgCount">
                                {imgCountLists && imgCountLists.map((value, index) => {
                                    return (
                                        <div key={value.id} style={{position: 'relative', cursor: 'pointer'}}>
                                            <div className="modal-pic-font modal-pic-font_hide" onClick={()=> hidePicModal(value, index)}>
                                                <Icon type="check-circle" theme="filled" style={{color: '#189ff0', fontSize: '26px', margin: '10px 0 0 115px'}}/>
                                            </div>
                                            <div style={{position: 'absolute', height: 'auto', left: '0px', top: '115px'}}>
                                                <Tooltip placement="top" title="预览"
                                                         getPopupContainer={() => document.querySelector('.img-hint')}>
                                                    <span className="black-back"><Icon type="eye" className="white-icon"
                                                                               onClick={this.showImg.bind(this, value)}/></span>
                                                </Tooltip>
                                                <Tooltip placement="top" title={!value.collectId ? '收藏' : '取消收藏'}
                                                         getPopupContainer={() => document.querySelector('.img-hint')}>
                                            <span className="black-back"><Icon type="heart" className="white-icon"
                                                                               theme={!value.collectId ? null : 'filled'}
                                                                               style={{color: !value.collectId ? '#c9c9c9' : 'rgb(252, 15, 58)'}}
                                                                               onClick={this.collectImg.bind(this, value, index)}/></span>
                                                </Tooltip>
                                                {value.isDelete === 1 ?
                                                    <Popconfirm title="确定要删除吗？" placement="topRight" okText="确定" cancelText="取消" icon={<Icon type="close-circle" theme="filled" style={{color:'red'}}/>} onConfirm={() => this.deleteImg(value, index)}>

                                                    <Tooltip placement="top" title="删除"
                                                             getPopupContainer={() => document.querySelector('.img-hint')}>
                                                        <span className="black-back"><Icon type="delete" className="white-icon"/></span>
                                                    </Tooltip>
                                                    </Popconfirm>:
                                                    <span className="black-back"><Icon type="delete" className="white-icon" style={{color: 'rgb(103, 98, 98, 0.7)', cursor: 'default'}}/></span>}
                                            </div>
                                            <p style={{background: `url(${value.url}) no-repeat`, backgroundSize: 'cover', width: '150px', height: '150px', marginBottom: '0'}} onClick={()=> showPicModal(value, index)}/>
                                            <Input disabled={value.isDelete === 1 ? false : true} style={{width: '150px', display: 'block', textOverflow: 'ellipsis'}}
                                                   value={value.name} onBlur={this.editName.bind(this, value.id)}
                                                   onChange={this.changeInputValue.bind(this, value, index)}/>
                                        </div>
                                    )
                                })}
                            </div>
                            <div style={{overflow: 'hidden', margin: '0 10px 10px 0'}} >
                                <LocaleProvider locale={zh_CN}>
                                    <Pagination style={{float: 'none'}}
                                                onChange={this.onChangePage}
                                                total={this.state.dataAll.total}
                                                current={params.current}/>
                                </LocaleProvider>
                            </div>
                        </div>
                    }
                </div>
                <p className="reset-pic" style={{display: 'none'}} onClick={this.changeTitleStyle.bind(this, 0)}>重置图片</p>
                <Modal className="preview-pic" visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="error" style={{ width: '100%' , maxWidth: '1200px'}} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

export default Picture;
