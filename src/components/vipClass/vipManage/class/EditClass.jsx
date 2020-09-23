import React from 'react';
import './AddClass.less';
import BreadcrumbCustom from '../../../common/BreadcrumbCustom';
import {Upload, Form, Input, Icon, Button, message, Select, Radio, Progress, Card, Modal, Spin} from 'antd';
import history from '../../../common/History';
import {requestData} from "../../../../utils/qiniu";
import {axiosInstance} from "../../../../utils/global-props";
import axios from 'axios';
import {connect} from "../../../../utils/socket";
import {getToken, getNum, vipAuthor} from "../../../../utils/filter";
import {editVipClass, enrollment, getClassDetail, getOldCourses,getNewCourses, checkClassName} from "../../../../api/vipCourseApi";

const FormItem = Form.Item;
const Option = Select.Option;

let uploadState = true;
let emojiRule = /([\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70-\uDD71\uDD7E-\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01-\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50-\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96-\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF])|(\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F-\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95-\uDD96\uDDA4-\uDDA5\uDDA8\uDDB1-\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB-\uDEEC\uDEF0\uDEF3-\uDEF6])|(\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0])/g;

class Local extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            classId: parseInt(window.location.pathname.slice(window.location.pathname.lastIndexOf('/') + 1)),
            courseId: parseInt(window.location.pathname.slice(15, window.location.pathname.lastIndexOf('/'))),
            courseName: '',
            loading: false,
            load: 'none',
            img: '',
            image: '',
            titleHint: '',
            titleState: 'success',
            groupSharingHint: '',
            groupSharingState: 'success',
            shareDescribeHint: '',
            shareDescribeState: 'success',
            friendCircleHint: '',
            friendCircleState: 'success',
            fileList: [],
            fileLists: [],
            status: 0, // 班次状态
            upload: false,
            uploadThumbnail: true,
            contentStatus: 'success',
            thumbnailStatus: 'success',
            progress: 0,
            progressText: '',
            progressStatus: 'active',
            showProgress: 'none',
            oldCourse: [],
            oldCourseId: null,
            oldCourseName: null,
            newCourse: [],
            newCourseId: null,
            newCourseName: null,
            disableBtn: false,
            exist: null,
            vipClassName: null,
            classAuth: true,
            price: null,
            itemId:'',
            addressstate:null  //判断是vip大课还是小课
        };
    }

    // 渲染
    componentDidMount() {
        let input = document.querySelectorAll('input');
        for (let i = 0; i < input.length; i++) {
            input[i].autocomplete = "off"
        }
        this.getOldCourse();
        this.getNewCourse();
        this.getClassDetail();

        //链接websocket
        connect(getToken('username'));
        //end
    }

    // 获取老课程下拉
    getOldCourse = () => {
        getOldCourses().then(res => {
            this.setState({
                oldCourse: res.data.data
            })
        });
    };
    //获取新课程下拉
    getNewCourse = () =>{
        getNewCourses().then(res => {
            this.setState({
                newCourse: res.data.data
            })
        });
    };

    // 获取班级详情
    getClassDetail = () => {
        let _this = this;
        getClassDetail({
            courseId: this.state.courseId,
            classId: this.state.classId,
        }).then(res => {
            let values = res.data.data;
            _this.props.form.setFieldsValue({
                classState: values.status,
                friend: values.friendCircleTitle,
                qun: values.groupShareTitle,
                des: values.shareDescription,
                share: values.shareCoverImage,
                classDetail: values.description,
                classPrice: getNum(values.showPrice),
                price: getNum(values.price),
                classTitle: values.name,
                content: values.icon,
                oldCourse: values.oldCourseId,
                newCourse: values.newCourseId,
                question:values.examUrl,
            });

            this.setState({
                contentPic: values.icon,
                image: `https://img.kaikeba.com/${values.icon}!w750`,
                shareThumbnails: values.shareCoverImage,
                img: `https://img.kaikeba.com/${values.shareCoverImage}!w1h1`,
                courseName: values.courseName,
                oldCourseId: values.oldCourseId,
                oldCourseName: values.oldCourseName,
                newCourseId: values.newCourseId,
                newCourseName: values.newCourseName,
                vipClassName: values.name,
                status: values.status,
                price: values.price,
                classAuth: vipAuthor('marketing:vipcourse:class:manager', values.subjectId),
                itemId:values.itemId,
                addressstate:values.courseType
            })
        })
    };

    // 提交，添加公开课
    handleSubmit = () => {
        let _this = this;
        let params = {}, count = 0;
        this.props.form.validateFieldsAndScroll((err, values) => {
            params = {
                id: this.state.classId,
                courseId: this.state.courseId,
                status: this.state.status,
                name: values.classTitle,
                description: values.classDetail,
                showPrice: parseFloat(values.classPrice),
                price: parseFloat(values.price),
                oldCourseId: _this.state.oldCourseId,
                oldCourseName: _this.state.oldCourseName,
                newCourseId: _this.state.newCourseId,
                newCourseName: _this.state.newCourseName,
                icon: _this.state.contentPic,
                friendCircleTitle: values.friend,
                groupShareTitle: values.qun,
                shareDescription: values.des,
                shareCoverImage: _this.state.shareThumbnails,
                examUrl: values.question ? values.question : null,
                itemId:this.state.itemId,
            };
            if (!values.classTitle) {
                this.setState({
                    titleHint: '班次名称不能为空',
                    titleState: 'error'
                });
                count++;
            }
            if (!values.classDetail) {
                count++;
            }
            if (!values.classPrice) {
                count++;
            }
            if (!values.newCourse) {
                count++;
            }
            if (!this.state.contentPic) {
                this.setState({
                    contentStatus: 'error'
                });
                count++;
            }
            if(this.state.addressstate == 0){
                if (!values.question) {
                    count++;
                }
            }
            if (!values.friend) {
                this.setState({
                    friendCircleHint: '朋友圈分享标题不能为空',
                    friendCircleState: 'error'
                });
                count++;
            }
            if (!values.qun) {
                this.setState({
                    groupSharingHint: '群分享标题不能为空',
                    groupSharingState: 'error'
                });
                count++;
            }
            if (!values.des) {
                this.setState({
                    shareDescribeHint: '群分享描述不能为空',
                    shareDescribeState: 'error'
                });
                count++;
            }
            if (!this.state.shareThumbnails) {
                this.setState({
                    thumbnailStatus: 'error'
                });
                count++;
            }
            console.log(count, params, "==========提交数据")
        });
        uploadState = (count === 0 ? true : false);
        if (uploadState) {
            this.setState({
                load: 'block',
                disableBtn: true
            });

            editVipClass(params).then(res => {
                this.setState({
                    load: 'none',
                    disableBtn: false
                });
                if (res.data.code === 0) {
                    message.success('编辑成功');
                    history.push('/app/vipcourse/' + this.state.courseId + '?page=2');
                } else {
                    message.error(res.data.msg)
                }
            }).catch(() => {
                this.setState({
                    load: 'none',
                    disableBtn: false
                });
            })
        }
    };

    // 取消弹出model
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    // 确认取消
    handleOk = () => {
        this.setState({
            visible: false,
        });
        this.props.form.resetFields();
        history.push('/app/vipcourse/' + this.state.courseId + '?page=2');
    };

    // 取消弹出model中取消
    handleTipCancel = () => {
        this.setState({
            visible: false,
        });
    };

    // 取消
    handleCancel = () => {
        let _this = this;
        getClassDetail({
            courseId: this.state.courseId,
            classId: this.state.classId,
        }).then(res => {
            let values = res.data.data;
            let sourceValues = {
                classState: values.status,
                friend: values.friendCircleTitle,
                qun: values.groupShareTitle,
                des: values.shareDescription,
                share: values.shareCoverImage,
                classDetail: values.description,
                classPrice: getNum(values.showPrice),
                price: getNum(values.price),
                classTitle: values.name,
                content: values.icon,
                oldCourse: values.oldCourseId,
                newCourse:values.newCourseId,
                question:values.examUrl
            };
            let fieldValues = _this.props.form.getFieldsValue();
            let arr = Object.keys(fieldValues);
            // 设置一个计数器，用来记录是否修改
            let count = 1;
            for (let i in sourceValues) {
                count++;
                if (sourceValues[i].toString() !== fieldValues[i].toString()) {
                    _this.showModal();
                    break;
                } else if (count > arr.length) {
                    // 当没，返回上一级菜单
                    history.push('/app/vipcourse/' + this.state.courseId + '?page=2');
                }
            }
        })
    };

    // 检查名称
    titleCheck = (e) => {
        if (e.target.value.length === 0) {
            this.setState({
                titleHint: '名称不能为空',
                titleState: 'error'
            })
        } else if (!(e.target.value.indexOf(" ") === -1)) {
            this.setState({
                titleHint: '禁止输入空格',
                titleState: 'error'
            })
        } else if (emojiRule.test(e.target.value)) {
            this.setState({
                titleHint: '禁止输入emoji',
                titleState: 'error'
            })
        } else if (e.target.value.length > 20) {
            this.setState({
                titleHint: '名称少于20字',
                titleState: 'error'
            })
        } else {
            this.setState({
                titleHint: '',
                titleState: 'success'
            })
        }
    };

    // 检查描述
    detailCheck = (e) => {
        if (e.target.value.length === 0) {
            this.setState({
                detailHint: '描述不能为空',
                detailState: 'error'
            })
        } else if (!(e.target.value.indexOf(" ") === -1)) {
            this.setState({
                detailHint: '禁止输入空格',
                detailState: 'error'
            })
        } else if (emojiRule.test(e.target.value)) {
            this.setState({
                detailHint: '禁止输入emoji',
                detailState: 'error'
            })
        } else if (e.target.value.length > 50) {
            this.setState({
                detailHint: '描述少于50字',
                detailState: 'error'
            })
        } else {
            this.setState({
                detailHint: '',
                detailState: 'success'
            })
        }
    };

    // 绑定老课程
    chooseOldCourse = (value, e) => {
        this.setState({
            oldCourseId: parseInt(e.key),
            oldCourseName: value
        });
        this.props.form.setFieldsValue({
            oldCourse: value
        });
    };
    // 绑定新课程
    chooseNewCourse = (value, e) => {

        this.setState({
            newCourseId: parseInt(e.key),
            newCourseName: value.split(':')[1]
        });
        this.props.form.setFieldsValue({
            newCourse: value
        });
    };


    // 检查群分享标题
    groupSharingCheck = (e) => {
        if (e.target.value.length === 0) {
            this.setState({
                groupSharingHint: '群分享标题不能为空',
                groupSharingState: 'error'
            })
        } else if (e.target.value.length > 50) {
            this.setState({
                groupSharingHint: '群分享标题少于50字',
                groupSharingState: 'error'
            })
        } else if (e.target.value.length > 30) {
            this.setState({
                groupSharingHint: '群分享标题建议少于30字',
                groupSharingState: 'warning'
            })
        } else if (!(e.target.value.indexOf(" ") === -1)) {
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
        } else if (e.target.value.length > 100) {
            this.setState({
                shareDescribeHint: '群分享描述少于100字',
                shareDescribeState: 'error'
            })
        } else if (e.target.value.length > 30) {
            this.setState({
                shareDescribeHint: '群分享描述建议少于30字',
                shareDescribeState: 'warning'
            })
        } else if (!(e.target.value.indexOf(" ") === -1)) {
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
        } else if (e.target.value.length > 50) {
            this.setState({
                friendCircleHint: '朋友圈分享标题少于50字',
                friendCircleState: 'error'
            })
        } else if (e.target.value.length > 30) {
            this.setState({
                friendCircleHint: '朋友圈分享标题建议少于30字',
                friendCircleState: 'warning'
            })
        } else if (!(e.target.value.indexOf(" ") === -1)) {
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

    // 班级基础价格检查
    classPriceCheck = (e) => {
        if (parseFloat(e.target.value) >= 0.01 && parseFloat(e.target.value) <= 100000.00) {
            this.setState({
                classPriceHint: '',
                classPriceState: 'success',
            })
        } else if (e.target.value === '') {
            this.setState({
                classPriceHint: '请输入班次基础价格',
                classPriceState: 'error',
            })
        } else {
            this.setState({
                classPriceHint: '请输入有效范围内的数字 0.01~100000.00',
                classPriceState: 'error',
            })
        }
    };

    // 限制课程基础价格小数点后两位
    changeClassPrice = (e) => {
        if (e.target.value !== '') {
            this.props.form.setFieldsValue({
                classPrice: getNum(e.target.value, 2)
            });
        }
    };

    // 销售价格检查
    priceCheck = (e) => {
        if (parseFloat(e.target.value) >= 0.01 && parseFloat(e.target.value) <= 100000.00) {
            this.setState({
                priceHint: '',
                priceState: 'success',
            })
        } else if (e.target.value === '') {
            this.setState({
                priceHint: '请输入班次基础价格',
                priceState: 'error',
            })
        } else {
            this.setState({
                priceHint: '请输入有效范围内的数字 0.01~100000.00',
                priceState: 'error',
            })
        }
    };

    // 销售价格小数点后两位
    changePrice = (e) => {
        if (e.target.value !== '') {
            this.props.form.setFieldsValue({
                price: getNum(e.target.value, 2)
            });
        }
    };

    // 课程内容图片内容绑定
    clickUpload = () => {
        let input = document.querySelector('.content-pic input');
        input.click()
    };

    // 检查图片的格式
    beforeUpload = (file) => {
        if (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') {
            if (file.size < 6990506) {
                this.setState({
                    upload: true
                });
            } else {
                this.setState({
                    upload: false,
                    contentStatus: 'error',
                    contentPic: null,
                    image: null
                });
                message.error('图片格式错误，请上传少于5MB的图片！')
            }
        } else {
            this.setState({
                upload: false,
                contentStatus: 'error',
                contentPic: null,
                image: null
            });
            message.error('格式错误，请上传jpg/jpeg/png格式的图片')
        }
    };

    // 上传裁剪课程内容图片
    upload = (files) => {
        if (this.state.upload) {
            this.setState({
                progress: 0,
                showProgress: 'none',
                progressStatus: 'active',
                progressText: '上传中'
            });
            let fileReader = new FileReader(); // 图片上传，读图片
            let file = files.file; // 获取到上传的对象
            let _this = this;
            fileReader.onload = (function (file) {
                return function (ev) {
                    let data = ev.target.result;
                    let image = new Image();
                    image.onload = () => {
                        if (parseInt(image.width) === 750) {
                            _this.setState({
                                image: ev.target.result,
                                contentStatus: 'success',
                            });

                            _this.setState({
                                showProgress: 'block'
                            });
                            requestData(file).then(response => {
                                let key = response.data.key;
                                _this.setState({
                                    progress: 20,//20
                                    progressText: '读取图片信息中',//读取图片信息中
                                    contentPic: key
                                });
                                _this.clipperImg(key, file.type);
                            });

                        } else {
                            message.error('图片格式错误，请上传宽为750像素的图片！');
                            _this.setState({
                                contentStatus: 'error',
                                image: '',
                                upload: false,
                                contentPic: null
                            });
                        }
                    };
                    image.src = data;

                }
            })(file);
            fileReader.readAsDataURL(file); // 读取完毕，显示到页面
        }
    };

    // 裁剪图片
    clipperImg = (key, type) => {
        let _this = this;
        axios.get('https://img.kaikeba.com/' + key + '?imageInfo').then(function (res) {
            let picInfo = res.data;
            axiosInstance.get({
                url: '/common/qiniu/clipper/' + key + '/' + picInfo.height,
                // headers: getHeaders()
            }).then(function (res) {
                let list = res.data.data.list;
                _this.setState({
                    contentPic: res.data.data.key,
                    progress: 50, // 20 + 80/(picCount+2)
                    progressText: '图片裁剪中', // '图片裁剪中'
                });
                _this.progressImg(list);
            });
        });
    };

    // 裁剪进度
    progressImg = (list) => {
        let picCount = list.length, count = 0, _this = this;
        for (let i = 0; i < list.length; i++) {
            let timer = setInterval(function () {
                axiosInstance.post({
                    url: '/common/qiniu/progress?id=' + list[i],
                    // headers: getHeaders()
                }).then(function (res) {
                    if (res.data.code === 0) {
                        _this.setState({
                            progress: 50 + 50 * ((count + 1) / picCount),
                            progressText: '图片裁剪中',
                        });
                        count = count + 1;
                        clearInterval(timer);
                        if (count === picCount) {
                            _this.setState({
                                progress: 100,
                                progressText: '已完成',
                                progressStatus: 'success'
                            });
                        }
                    }
                }).catch(err => {
                    clearInterval(timer);
                    if (err.response.status !== 500) {
                        message.error('裁剪失败，请重新上传！')
                    }
                    i = picCount;
                })
            }, 3000)
        }
    };

    // 分享缩略图按钮上传绑定
    clickOneUpload = () => {
        let inputUpload = document.querySelector('.thumbnai-pic input');
        inputUpload.click()
    };

    // 上传分享缩略图格式检查
    beforeUploadThumbnail = (file) => {
        if (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') {
            if (file.size < 10068) {
                this.setState({
                    uploadThumbnail: true,
                    thumbnailStatus: 'success',
                })
            } else {
                message.error('图片格式错误，请上传少于10KB的图片！');
                this.setState({
                    uploadThumbnail: false,
                    thumbnailStatus: 'error',
                    img: '',
                    shareThumbnails: null
                });
            }
        } else {
            this.setState({
                uploadThumbnail: false,
                thumbnailStatus: 'error',
                img: '',
                shareThumbnails: null
            });
            message.error('格式错误，请上传jpg/jpeg/png格式的图片')
        }
    };

    // 上传分享缩略图
    uploadPic = (files) => {
        if (this.state.uploadThumbnail) {
            let fileReader = new FileReader(); // 图片上传，读图片
            let file = files.file; // 获取到上传的对象
            let _this = this;
            fileReader.onload = (function (file) {
                return function (ev) {
                    let data = ev.target.result;
                    let image = new Image();
                    image.onload = () => {
                        if (parseInt(image.width) === 120 && parseInt(image.height) === 120) {
                            _this.setState({
                                img: ev.target.result,
                                thumbnailStatus: 'success',
                            });
                            requestData(file).then(res => {
                                _this.setState({
                                    shareThumbnails: res.data.key
                                });
                            })
                        } else {
                            message.error('图片格式错误，请上传120 * 120像素的图片！');
                            _this.setState({
                                uploadThumbnail: false,
                                thumbnailStatus: 'error',
                                img: ''
                            });
                        }
                    };
                    image.src = data;
                }
            })(file);

            fileReader.readAsDataURL(file); // 读取完毕，显示到页面
        }
    };

    // 检查班次名称是否重复
    checkClassName = (e) => {
        checkClassName(`classId=${this.state.classId}&name=${e.target.value}&courseId=${this.state.courseId}`).then(res => {
            if (res.data.code === 10002) {
                this.setState({
                    titleHint: '该班次名称已存在',
                    titleState: 'error'
                })
            }
        })
    };

    // 切换班次状态是弹出框
    confirm = (e) => {
        enrollment(this.state.courseId).then(res => {
            this.setState({
                exist: res.data.data
            });
            let _this = this;
            if (e.target.value === 1 && this.state.exist) {
                Modal.confirm({
                    title: <p style={{fontWeight: '400', color: '#FF9900'}}>已经有一个「招生中」的班次：{this.state.exist}</p>,
                    content: <div style={{
                        color: '#333',
                        marginTop: '-15px',
                        lineHeight: '25px'
                    }}>你本次的操作，将强制把{this.state.exist}转为「授课中」，开始进入{this.state.vipClassName}的招生。<br/>确定进行此操作吗？</div>,
                    okText: '确定',
                    cancelText: '取消',
                    iconType: 'exclamation-circle',
                    contentType: 'normal',
                    onOk() {
                        return new Promise((resolve, reject) => {
                            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                            _this.setState({
                                status: e.target.value
                            })
                        }).catch(() => console.log('Oops errors!'));
                    }
                });
            } else {
                Modal.confirm({
                    title: <p style={{fontWeight: '400'}}>是否切换当前班次状态?</p>,
                    content: <p></p>,
                    okText: '确定',
                    cancelText: '取消',
                    iconType: 'exclamation-circle',
                    contentType: 'normal',
                    onOk() {
                        return new Promise((resolve, reject) => {
                            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                            _this.setState({
                                status: e.target.value
                            })
                        }).catch(() => console.log('Oops errors!'));
                    }
                })
            }
        });
    };

    render() {
        const {status, classAuth} = this.state;
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
                path: '/app/vipcourse/list',
                name: 'vip课程'
            },
            {
                path: '/app/vipcourse/list',
                name: 'vip课列表'
            },
            {
                path: '/app/vipcourse/' + this.state.courseId + '?page=1',
                name: this.state.courseName
            },
            {
                name: '编辑班次',
                path: '#'
            }
        ];
        return (
            <div>
                <Spin size="large"
                      style={{display: this.state.load, position: 'absolute', top: "120px", left: '49%', zIndex: 2000}}
                      className="loading"/>
                <div className="page-nav">
                    <BreadcrumbCustom paths={menus}/>
                    <p className="title-style">编辑班次</p>
                    <p className="title-describe">班次建成功后，将仅生产默认渠道，还需各位销售自行创建属于自己的推广渠道。</p>
                </div>
                <Card title="基本信息" style={{marginBottom: 24}} bordered={false}>
                    <Form layout="horizontal" style={{paddingBottom: '20px'}}>
                        <FormItem className="vip-class-form class-status" label="班次状态" {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('classState', {
                                rules: [{required: true, message: '请选择班级状态'}],
                            })(
                                <div>
                                    <Radio.Group value={status} onChange={this.confirm} disabled={!classAuth}>
                                        <Radio.Button value={0} disabled={status + 1 !== 0 && status !== 0}
                                                      style={{width: '90px', textAlign: 'center'}}>计划中</Radio.Button>
                                        <Radio.Button value={1} disabled={status + 1 !== 1 && status !== 1}
                                                      style={{width: '90px', textAlign: 'center'}}>招生中</Radio.Button>
                                        <Radio.Button value={2} disabled={status + 1 !== 2 && status !== 2}
                                                      style={{width: '90px', textAlign: 'center'}}>授课中</Radio.Button>
                                        <Radio.Button value={3} disabled={status + 1 !== 3 && status !== 3}
                                                      style={{width: '90px', textAlign: 'center'}}>已结课</Radio.Button>
                                    </Radio.Group>
                                </div>
                            )}
                        </FormItem>
                        <FormItem className="vip-class-form" label="班次名称" validateStatus={this.state.titleState}
                                  help={this.state.titleHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('classTitle', {
                                rules: [{required: true, message: '班级名称不能为空'}],
                            })(
                                <Input placeholder="如‘第二期、第三期’（内部用，用户不可见）" disabled={true} onBlur={this.checkClassName} onChange={this.titleCheck}/>
                            )}
                        </FormItem>
                        <FormItem className="vip-class-form" label="班次描述" validateStatus={this.state.detailState}
                                  help={this.state.detailHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('classDetail', {
                                rules: [{required: true, message: '班次描述不能为空'}],
                            })(
                                <Input placeholder="描述老师、开班计划等信息"  disabled={!classAuth} onChange={this.detailCheck}/>
                            )}
                        </FormItem>
                        <FormItem className="vip-class-form" label="原价" validateStatus={this.state.classPriceState}
                                  help={this.state.classPriceHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('classPrice', {
                                rules: [{required: true, message: '原价不能为空'}],
                            })(
                                <Input type="number" addonBefore="￥" disabled={true} onBlur={this.changeClassPrice}
                                       onChange={this.classPriceCheck}/>
                            )}
                        </FormItem>
                        <FormItem className="vip-class-form" label="销售价" validateStatus={this.state.priceState}
                                  help={this.state.priceHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('price', {
                                rules: [{required: true, message: '销售价不能为空'}],
                            })(
                                <Input type="number" addonBefore="￥"
                                       disabled={true}
                                       onBlur={this.changePrice}
                                       onChange={this.priceCheck}/>
                            )}
                        </FormItem>
                        <FormItem className="vip-class-form" label="绑定课程（old）" {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('oldCourse', {
                                rules: [{required: false, message: '请选择一个课程'}],
                            })(
                                <div className='subject-list' style={{display: 'inline'}}>
                                    <Select
                                        disabled={!classAuth}
                                        showSearch
                                        style={{width: '100%'}}
                                        placeholder="选择一个课程"
                                        getPopupContainer={() => document.querySelector('.subject-list')}
                                        onChange={this.chooseOldCourse}
                                        value={`${this.state.oldCourseId}:  ${this.state.oldCourseName}`}
                                    >
                                        {this.state.oldCourse && this.state.oldCourse.map((value, index) => {
                                            return (<Option key={value.id}
                                                            value={value.name}>{`${value.id}:  ${value.name}`}</Option>)
                                        })}
                                    </Select>
                                </div>
                            )}
                        </FormItem>
                        <FormItem className="vip-class-form" label="绑定课程（new）" {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('newCourse', {
                                rules: [{required: true, message: '请选择一个课程'}],
                            })(
                                <div className='subject-list1' style={{display: 'inline'}}>
                                    <Select
                                        disabled={!classAuth}
                                        showSearch
                                        style={{width: '100%'}}
                                        placeholder="选择一个课程"
                                        getPopupContainer={() => document.querySelector('.subject-list1')}
                                        onChange={this.chooseNewCourse}
                                        onSearch={this.serchNewCourse}
                                        value={`${this.state.newCourseId}:  ${this.state.newCourseName}`}
                                        filterOption={(input, option) => {
                                          return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                      }
                                    >
                                        {this.state.newCourse && this.state.newCourse.map((value, index) => {
                                            return (<Option key={value.id}
                                                            value={`${value.id}: ${value.name}`}>{`${value.id}:  ${value.name}`}</Option>)
                                        })}
                                    </Select>
                                </div>
                            )}
                        </FormItem>
                        <FormItem className="vip-class-form" label="问卷星地址" {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('question', {
                                rules: [{required: this.state.addressstate == 0 ? true : false, message: '问卷星地址不能为空'}],
                            })(
                                <Input placeholder="请输入问卷星地址"/>
                            )}
                        </FormItem>
                        <FormItem className="vip-class-form" label="页面内容图片"
                                  validateStatus={this.state.contentStatus} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('content', {
                                rules: [{required: true, message: '请上传页面内容图片'}],
                            })(
                                <div style={{position: 'relative'}} className="form-item content-pic">
                                    <Upload
                                        name="avatar"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        fileList={this.state.fileList}
                                        customRequest={this.upload}
                                        beforeUpload={this.beforeUpload}
                                        disabled={!classAuth}
                                    >
                                        {this.state.image ? <img src={this.state.image} alt="noImg"/> : uploadButton}
                                    </Upload>
                                    <div className="hint-text">
                                        <p style={{height: '15px'}}>图片尺寸：宽750像素，高建议要么一页看完，要么是长图</p>
                                        <p style={{height: '0px'}}>图片格式：jpg/png</p>
                                    </div>
                                    <div style={{marginTop: '10px'}}>
                                        <Button type="default" style={{width: '100px', textAlign: 'center'}} disabled={!classAuth}
                                                onClick={this.clickUpload}>上传</Button>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                        <FormItem style={{marginTop: '-20px', display: this.state.showProgress}}
                                  className="vip-class-form" label="上传进度" validateStatus='' {...FormItemLayout}
                                  hasFeedback>
                            <Progress style={{width: '70%', marginTop: '10px'}} percent={this.state.progress}
                                      format={() => this.state.progressText} status={this.state.progressStatus}/>
                        </FormItem>
                    </Form>
                </Card>
                <Card title="微信分享信息" bordered={false}>
                    <Form layout="horizontal" style={{paddingBottom: '20px'}}>
                        <FormItem className="vip-class-form" label="朋友圈分享标题"
                                  validateStatus={this.state.friendCircleState}
                                  help={this.state.friendCircleHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('friend', {
                                rules: [{required: true, message: '朋友圈分享标题不能为空'}],
                            })(
                                <Input placeholder="建议30字以内" disabled={!classAuth} onChange={this.friendCircleCheck}/>
                            )}
                        </FormItem>
                        <FormItem className="vip-class-form" label="群分享标题"
                                  validateStatus={this.state.groupSharingState}
                                  help={this.state.groupSharingHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('qun', {
                                rules: [{required: true, message: '群分享标题不能为空'}],
                            })(
                                <Input placeholder="建议30字以内" disabled={!classAuth} onChange={this.groupSharingCheck}/>
                            )}
                        </FormItem>
                        <FormItem className="vip-class-form" label="分享描述"
                                  validateStatus={this.state.shareDescribeState}
                                  help={this.state.shareDescribeHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('des', {
                                rules: [{required: true, message: '分享描述不能为空'}],
                            })(
                                <Input placeholder="建议30字以内" disabled={!classAuth} onChange={this.shareDescribeCheck}/>
                            )}
                        </FormItem>

                        <FormItem className="vip-class-form" label="分享缩略图"
                                  validateStatus={this.state.thumbnailStatus} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('share', {
                                rules: [{required: true, message: '请上传缩略图'}],
                            })(
                                <div style={{position: 'relative'}} className="form-item thumbnai-pic">
                                    <Upload
                                        name="avatar"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        fileList={this.state.fileLists}
                                        customRequest={this.uploadPic}
                                        beforeUpload={this.beforeUploadThumbnail}
                                        disabled={!classAuth}
                                    >
                                        {this.state.img ? <img src={this.state.img} alt="noImg"/> : uploadButton}
                                    </Upload>
                                    <div className="hint-text">
                                        <p style={{height: '15px'}}>图片尺寸：120 * 120 像素</p>
                                        <p style={{height: '0px'}}>图片格式：大小不超过10KB，不支持GIF格式</p>
                                    </div>
                                    <div style={{marginTop: '10px'}}>
                                        <Button type="default" style={{width: '100px', textAlign: 'center'}} disabled={!classAuth}
                                                onClick={this.clickOneUpload}>上传</Button>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Form>
                </Card>
                <div className="upload-title bottom-btn" style={{display: classAuth ? 'block' : 'none'}}>
                    <Button type="default" style={{marginRight: '20px'}} onClick={this.handleCancel}>取消</Button>
                    <Modal
                        title="提示"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleTipCancel}
                        okText="确定"
                        cancelText="取消"
                    >
                        <p>表单中有内容已经修改，是否确认取消？</p>
                    </Modal>
                    <Button disabled={this.state.disableBtn} type="primary" onClick={this.handleSubmit}>提交</Button>
                </div>
            </div>
        );
    }

}

const CollectionCreateForm = Form.create()(Local);
export default CollectionCreateForm;
