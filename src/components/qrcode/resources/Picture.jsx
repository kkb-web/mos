import React from 'react';
import {Tooltip, Input, Button, Select, Pagination, Modal, LocaleProvider, message,
    Upload,
    Icon,
    Form,
    Spin, Popconfirm
} from 'antd';
import './index.less'
import {requestData} from "../../../utils/wx";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import {
    addImg,
    cancelCollectTemplate,
    collectTemplate, createByFilter,
    deleteTemplate,
    editImgName,
    getImgList, limitPicNumber
} from "../../../api/marketApi";

const FormItem = Form.Item;

let params = {
    size: 40,
    current: 1,
    descs: ["create_time"],
    condition: {}
};

const { Option} = Select;
class Picture extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            previewVisible: false,
            previewImage: 'https://img.kaikeba.com/course_2.png!w1h1',
            uploadImg: true,
            imgCountLists: [],
            dataAll: '',
            creatBy: [],
            uploadIcon: 'upload',
            uploadText: '上传',
            limitImgCount: 0
        };
    }

    // 创建者下拉框
    getCreatBy = () => {
        createByFilter().then(res => {
            if (res.data.code === 0) {
                this.setState({
                    creatBy: res.data.data
                })
            }
        })
    };

    // 获取图片列表
    getImgList = () => {
        this.setState({
            loading: false
        });
        getImgList(params).then(res => {
            console.log(res.data.data, '========图片列表');
            if(res.data.code === 0){
              this.setState({
                  imgCountLists: res.data.data.records,
                  dataAll: res.data.data,
              });
            }
            setTimeout(() => {
                this.setState({
                    loading: false
                });
            }, 200)
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
        this.getCreatBy();
        this.getImgList();
        this.limitPicNumber();
    }

    // 预览
    showImg = (value) => {
        this.setState({
            previewVisible: true,
            previewImage: value.url
        });
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
            collectTemplate({templateId: value.id,business:'TEMPLATE'}).then(res => {
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
        // let imgUrlLists = this.state.imgCountLists;
        // imgUrlLists.splice(index, 1);
        // this.setState({
        //     imgCountLists: imgUrlLists
        // });
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
    editName = (value, index,  e) => {
        console.log(value, index, e, "==========编辑图片名称");
        editImgName({
            id: value.id,
            name: e.target.value
        }).then(res => {
            if (res.data.code === 0) {
                message.success("修改成功");
            } else if (res.data.code === 10002) {
                message.error("名称已存在，不可重复");
                this.getImgList();
            } else {
                message.error("修改失败");
                this.getImgList();
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
    onChangePage = (page, pageSize) => {
        params.current = page;
        params.size = pageSize;
        this.getImgList();
    };

    // 改变每页条数
    onShowSizeChange = (page, pageSize) => {
        params.current = page;
        params.size = pageSize;
        this.getImgList();
    };

    // 收藏筛选
    handleChange = (value) => {
        params.condition.status = parseInt(value);
        params.current = 1;
        this.getImgList();
        console.log(value, "======收藏筛选");
    };

    // 创建者筛选
    roleChange = (value) => {
        params.condition.createBy = parseInt(value);
        params.current = 1;
        this.getImgList();
        console.log(value, "======创建者筛选");
    };

    showTotal = (total) => {
        return `共 ${total} 条数据`;
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
                        console.log(image.width);
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
                                        business:'TEMPLATE'
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

    render() {
        const props = {
            showUploadList: false,
            customRequest: this.uploadPic,
            beforeUpload: this.beforeUploadPic
        };
        let {previewVisible, previewImage, imgCountLists, creatBy, uploadIcon, uploadText, limitImgCount, imgWidth} = this.state;
        return(
            <div className="textBox">
                <div id="pic-input">
                    <span>状态：</span>
                    <Select placeholder="收藏状态" style={{ width: 120 }} onChange={this.handleChange}>
                        <Option value={null}>收藏状态</Option>
                        <Option value={1}>已收藏</Option>
                        <Option value={0}>未收藏</Option>
                    </Select>
                    <span style={{marginLeft: '20px'}}>创建者：</span>
                    <Select
                        showSearch
                        style={{ width: 180 }}
                        placeholder="选择创建者"
                        onChange={this.roleChange}
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        getPopupContainer={() => document.getElementById('pic-input')}
                    >
                        <Option value={null}>选择创建者</Option>
                        {creatBy && creatBy.map(value => <Option key={value.id}>{value.name}</Option>)}
                    </Select>
                    <div style={{float: 'right',display: 'inline-flex'}}>
                        <div className="uploadTip">
                            <h6>图片要求：格式png/jpg/bmp/gif，最大 2M </h6>
                            <h6>图片数量：最多5000张，还可上传 <span style={{color: '#1890ff'}}>{5000 - parseInt(limitImgCount)}</span> 张</h6>
                            <h6>图片素材数量有限，无用素材请及时删除</h6>
                        </div>
                        <Upload {...props}>
                            <Button>
                                <Icon type={uploadIcon}/> {uploadText}
                            </Button>
                        </Upload>
                    </div>
                </div>
                {this.state.loading ? <Spin size="large" style={{margin: "120px auto"}} className="loading"/> :
                <div className="img-hint">
                    {imgCountLists.length === 0 ?
                        <p style={{textAlign: 'center', margin: '100px auto'}}>暂无数据</p> :
                        <div>
                            <div className="imgCount" id="imgCount">
                                {imgCountLists && imgCountLists.map((value, index) => {
                                    return (
                                        <div key={index} style={{position: 'relative'}}>
                                            <div style={{position: 'absolute', height: 'auto', left: '100px', top: '165px'}}>
                                                <Tooltip placement="top" title="预览"
                                                         getPopupContainer={() => document.querySelector('.img-hint')}
                                                >
                                                    <span className="black-back"><Icon type="eye" className="white-icon"
                                                                               onClick={this.showImg.bind(this, value)}/></span>
                                                </Tooltip>
                                                <Tooltip placement="top" title={!value.collectId ? '收藏' : '取消收藏'}
                                                         getPopupContainer={() => document.querySelector('.img-hint')}
                                                >
                                                    <span className="black-back"><Icon type="heart" className="white-icon"
                                                                               theme={!value.collectId ? null : 'filled'}
                                                                               style={{color: !value.collectId ? '#c9c9c9' : 'rgb(252, 15, 58)'}}
                                                                               onClick={this.collectImg.bind(this, value, index)}/></span>
                                                </Tooltip>
                                                {value.isDelete === 1 ?
                                                    <Popconfirm title="确定要删除吗？" placement="topRight" okText="确定" cancelText="取消" icon={<Icon type="close-circle" theme="filled" style={{color:'red'}}/>} onConfirm={() => this.deleteImg(value, index)}>

                                                    <Tooltip placement="top" title="删除"
                                                             getPopupContainer={() => document.querySelector('.img-hint')}
                                                    >
                                                        <span className="black-back"><Icon type="delete" className="white-icon"/></span>
                                                    </Tooltip>
                                                    </Popconfirm>:
                                                    <span className="black-back"><Icon type="delete" className="white-icon" style={{color: 'rgb(103, 98, 98, 0.7)', cursor: 'default'}}/></span>}
                                            </div>
                                            <p className="pic-img" style={{background: `url(${value.url}) no-repeat`, backgroundSize: 'cover', width: '200px', height: '200px', marginBottom: '0'}} onClick={this.showImg.bind(this, value)}/>
                                            <Input disabled={value.isDelete === 1 ? false : true} style={{width: '200px', display: 'block', textOverflow: 'ellipsis'}}
                                                   value={value.name} onBlur={this.editName.bind(this, value, index)}
                                                   onChange={this.changeInputValue.bind(this, value, index)}/>
                                        </div>
                                    )
                                })}
                            </div>
                            <div style={{overflow: 'hidden'}}>
                                <LocaleProvider locale={zh_CN}>
                                    <Pagination showSizeChanger onShowSizeChange={this.onShowSizeChange}
                                                onChange={this.onChangePage}
                                                defaultPageSize = {40}
                                                total={this.state.dataAll.total}
                                                showTotal={this.showTotal.bind(this.state.dataAll.total)}
                                                current={params.current}/>
                                </LocaleProvider>
                            </div>
                        </div>
                    }
                </div>}
                <Modal className="preview-pic" visible={previewVisible} style={{ top: '80px'}} footer={null} onCancel={this.handleCancel}>
                    <img alt="error" style={{ width: '100%', maxWidth: '1200px'}} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

export default Picture;
