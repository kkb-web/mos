import React from 'react';
import './AddOpenCourse.less';
import {Upload, Form, Input, Icon, Button, message, InputNumber, Select, DatePicker, LocaleProvider, Progress, Card, Modal, Radio} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import history from '../common/History'
import moment from 'moment';
import {requestData} from "../../utils/qiniu";
import {editOpenCourse, getCourseDetail, getUserSubject} from "../../api/openCourseApi";
import {getSubjectList} from "../../api/commonApi";
import {openAuthor} from "../../utils/filter";
import {axiosInstance} from "../../utils/global-props";
import axios from 'axios';

const FormItem = Form.Item;
const Option = Select.Option;

let editState = true;
let rule = /^[0-9]*$/;
let emojiRule = /([\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70-\uDD71\uDD7E-\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01-\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50-\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96-\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF])|(\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F-\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95-\uDD96\uDDA4-\uDDA5\uDDA8\uDDB1-\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB-\uDEEC\uDEF0\uDEF3-\uDEF6])|(\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0])/g;

class Local extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            data: {},
            loading: false,
            img: '',
            image:'',
            courseImage:'',
            posterImage: '',
            signupNumbers:'',
            titleHint: '',
            titleState: 'success',
            groupSharingHint: '',
            groupSharingState: 'success',
            shareDescribeHint: '',
            shareDescribeState: 'success',
            friendCircleHint: '',
            friendCircleState: 'success',
            liveRoomHint: '',
            liveRoomState: 'success',
            playBackHint: '',
            playBackState: '',
            fileList: [],
            fileLists: [],
            fileListCourse:[],
            fileListPost: [],
            previewImage: '',
            status: "0", //公开课状态
            shareThumbnails: '',
            contentPic: '',
            liveUrl: '',
            replayUrl:'',
            upload: true,
            uploadThumbnail: true,
            uploadThumbnailCourse:true,
            uploadThumbnailPoster: true,
            contentStatus: 'success',
            progress: 0,
            progressText: '',
            progressStatus: 'active',
            showProgress: 'none',
            current: 'mail',
            subjectList: [],
            chooseSubject: [],
            userSubjectAll: [],
            photoWidth: '',
            photoHeight: '',
            qrcodeWidth: '',
            qrcodeHeight: '',
            disableBtn: false,
            courseAuth: false,
            siteShow: 0
        };
    }

    // 获取公开课编辑页的相关信息
    componentDidMount() {
        let _this = this;
        let input = document.querySelectorAll('input');
        for (let i = 0; i < input.length; i++) {
            input[i].autocomplete = "off"
        }
        getUserSubject().then(res => {
            let userSubjectAll = [], data = res.data.data;
            for (let i in data) {
                userSubjectAll.push(data[i].subjectId)
            }
            this.setState({
                userSubjectList: res.data.data,
                userSubjectAll: userSubjectAll
            });
            console.log(this.state.userSubjectAll);
        });
        getSubjectList().then(res => {
            this.setState({
                subjectList: res.data.data
            });
            console.log(res.data.data, "=======全部学科");
        });
        getCourseDetail(parseInt(window.location.pathname.slice(12))).then(res => {
            let data = res.data.data;
            _this.setState({
                data: data,
                image: 'https://img.kaikeba.com/' + data.contentImage + '!w750',
                contentPic: data.contentImage,
                courseImage: 'https://img.kaikeba.com/' + data.siteThumbnail + '!w3h2',
                siteThumbnail: data.siteThumbnail,
                img: 'https://img.kaikeba.com/' + data.openCourseShareDTO.shareCoverImage + '!w1h1',
                shareThumbnails: data.openCourseShareDTO.shareCoverImage,
                posterImage: 'https://img.kaikeba.com/' + data.openCoursePostersDTO.postersTemplate + '!w750',
                posterPic: data.openCoursePostersDTO.postersTemplate,
                status: (data.liveStatus).toString(),
                chooseSubject: data.subjects,
                playBackState: data.replayUrl !== '' ? 'success' : '',
                photoWidth: data.openCoursePostersDTO.wechatHeadimgurlWidth,
                photoHeight: data.openCoursePostersDTO.wechatHeadimgurlHeight,
                qrcodeWidth: data.openCoursePostersDTO.qrWidth,
                qrcodeHeight: data.openCoursePostersDTO.qrHeight,
                openCoursePostersId: data.openCoursePostersDTO.id,
                openCourseShareId: data.openCourseShareDTO.id,
                siteShow: data.siteShow
            });
            _this.props.form.setFieldsValue({
                courseTitle: data.name,
                subject: data.subjects,
                time: moment(data.schedule * 1000),
                qun: data.openCourseShareDTO.groupShareTitle,
                des: data.openCourseShareDTO.shareDescription,
                firend: data.openCourseShareDTO.friendCircleTitle,
                share: _this.state.img,
                content: _this.state.image,
                liveUrl: data.liveUrl,
                replayUrl: data.replayUrl,
                signupNumbers: data.virtualCount,
                courseThumbnail: _this.state.courseImage,
                poster: _this.state.posterImage,
                photoX: data.openCoursePostersDTO.wechatHeadimgurlX,
                photoY: data.openCoursePostersDTO.wechatHeadimgurlY,
                photoW: data.openCoursePostersDTO.wechatHeadimgurlWidth,
                photoH: data.openCoursePostersDTO.wechatHeadimgurlHeight,
                inviteTxt: data.openCoursePostersDTO.hostTxt,
                articleX: data.openCoursePostersDTO.hostX,
                articleY: data.openCoursePostersDTO.hostY,
                qrcodeX: data.openCoursePostersDTO.qrX,
                qrcodeY: data.openCoursePostersDTO.qrY,
                qrcodeW: data.openCoursePostersDTO.qrWidth,
                qrcodeH: data.openCoursePostersDTO.qrHeight
            });
            if (!openAuthor('marketing:opencourse:manage', this.state.data.subjects)) {
                this.setState({
                    courseAuth: true
                })
            } else {
                this.setState({
                    courseAuth: false
                })
            }
        });
    };

    // 编辑公开课
    handleSubmit = () => {
        let _this = this;
        let params = {};

        this.props.form.validateFields((err, values) => {
            let time = Math.round(new Date(values.time).getTime()/1000) ;
            params = {
                id: _this.state.data.id,
                name: values.courseTitle,
                subjects: _this.state.chooseSubject,
                schedule: time,
                contentImage: _this.state.contentPic,
                siteThumbnail: _this.state.siteThumbnail,
                virtualCount: values.signupNumbers,
                liveUrl: values.liveUrl,
                replayUrl: values.replayUrl,
                siteShow: this.state.siteShow,
                openCoursePostersDTO: {
                    postersTemplate: _this.state.posterPic,
                    wechatHeadimgurlX: values.photoX,
                    wechatHeadimgurlY: values.photoY,
                    wechatHeadimgurlWidth: values.photoW,
                    wechatHeadimgurlHeight: values.photoH,
                    hostTxt: values.inviteTxt,
                    hostX: values.articleX,
                    hostY: values.articleY,
                    qrX: values.qrcodeX,
                    qrY: values.qrcodeY,
                    qrWidth: values.qrcodeW,
                    qrHeight: values.qrcodeH,
                    id: this.state.openCoursePostersId
                },
                openCourseShareDTO: {
                    friendCircleTitle: values.firend,
                    groupShareTitle: values.qun,
                    shareDescription: values.des,
                    shareCoverImage: _this.state.shareThumbnails,
                    id: this.state.openCourseShareId
                }
            };
            console.log(this.props.liveStatus);
            if (this.props.liveStatus === '3' && values.replayUrl === '') {
                this.setState({
                    playBackHint: '回放地址不能为空',
                    playBackState: 'error'
                });
                document.getElementById('root').scrollTop = 1930;
                editState = false;
            } else {
                editState = true;
            }
        });
        if (editState) {
            this.setState({
                disableBtn: true
            });
            editOpenCourse(params).then(res => {
                this.setState({
                    disableBtn: false
                });
                if (res.data.code === 0) {
                    message.success('编辑成功');
                    history.push('/app/course/list');
                } else {
                    message.error(res.data.msg)
                }
            });
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
        history.push('/app/course/list');
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
        getCourseDetail(parseInt(window.location.pathname.slice(12))).then(res => {
            let data = res.data.data;
            let sourceValues = ({
                courseTitle: data.name,
                subject: data.subjects,
                time: moment(data.schedule * 1000),
                qun: data.openCourseShareDTO.groupShareTitle,
                des: data.openCourseShareDTO.shareDescription,
                firend: data.openCourseShareDTO.friendCircleTitle,
                share: _this.state.img,
                content: _this.state.image,
                liveUrl: data.liveUrl,
                replayUrl: data.replayUrl,
                signupNumbers: data.virtualCount,
                courseThumbnail: _this.state.courseImage,
                poster: _this.state.posterImage,
                photoX: data.openCoursePostersDTO.wechatHeadimgurlX,
                photoY: data.openCoursePostersDTO.wechatHeadimgurlY,
                photoW: data.openCoursePostersDTO.wechatHeadimgurlWidth,
                photoH: data.openCoursePostersDTO.wechatHeadimgurlHeight,
                inviteTxt: data.openCoursePostersDTO.hostTxt,
                articleX: data.openCoursePostersDTO.hostX,
                articleY: data.openCoursePostersDTO.hostY,
                qrcodeX: data.openCoursePostersDTO.qrX,
                qrcodeY: data.openCoursePostersDTO.qrY,
                qrcodeW: data.openCoursePostersDTO.qrWidth,
                qrcodeH: data.openCoursePostersDTO.qrHeight
            });
            let fieldValues = _this.props.form.getFieldsValue();
            // 将JSON数据的key值存为一个数组，便于获取对象fieldsvalue的长度
            let arr = Object.keys(fieldValues);
            // 设置一个计数器，用来记录控件值为空的个数
            let count = 6;
            console.log(fieldValues, sourceValues);
            for(let i in sourceValues){
                count++;
                if( i!== 'time' && i!=='photoPosition' && i!== 'photoSize' && i!== 'articleSize' && i!=='qrcodePosition'
                    && i!== 'qrcodeSize' && sourceValues[i].toString() !== fieldValues[i].toString()){
                    _this.showModal();
                    break;
                } else if(count > arr.length) {
                    // 当遍历完所有的控件都为空时，返回上一级菜单
                    history.push('/app/course/list')
                }
            }
        });
    };

    // 检查名称
    titleCheck = (e) => {
        if (e.target.value.length === 0) {
            this.setState({
                titleHint: '名称不能为空',
                titleState: 'error'
            })
        } else if (e.target.value.length > 50) {
            this.setState({
                titleHint: '名称少于50字',
                titleState: 'error'
            })
        } else if (e.target.value.length > 30) {
            this.setState({
                titleHint: '名称建议少于30字',
                titleState: 'warning'
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
        } else {
            this.setState({
                titleHint: '',
                titleState: 'success'
            })
        }
    };

    // 选择学科的id
    chooseSubjectList = (value) => {
        console.log(value, '=========选择学科value');
        if (value.length > 0) {
            this.setState({
                chooseSubject: value,
                subjectListStatus: 'success',
                subjectListHint: ''
            })
        } else {
            this.setState({
                chooseSubject: value,
                subjectListStatus: 'error',
                subjectListHint: '请选择学科'
            })
        }
        this.props.form.setFieldsValue({
            subject: value
        })
    };

    // 报名基数检查
    checksignupNumber = (e) => {
        if (parseInt(e.target.value) >= 0 &&  parseInt(e.target.value) <= 1000000) {
            this.setState({
                signupNumberHint: '',
                signupNumber: 'success',
            })
        } else if (parseInt(e.target.value) > 1000000) {
            this.setState({
                signupNumberHint: '输入的基数需不大于1000000',
                signupNumber: 'error',
            })
        } else if (parseInt(e.target.value) < 0) {
            this.setState({
                signupNumberHint: '输入的基数需不小于0',
                signupNumber: 'error',
            })
        }
    };

    // 直播地址检查
    checkLive = (e) => {
        let reg = /^(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
        if (e.target.value.length === 0) {
            this.setState({
                liveRoomHint: '直播间地址不能为空',
                liveRoomState: 'error',
            })
        } else if (!reg.test(e.target.value)) {
            this.setState({
                liveRoomHint: '请输入正确的直播间地址',
                liveRoomState: 'error',
            })
        } else {
            this.setState({
                liveRoomHint: '',
                liveRoomState: 'success',
            })
        }
    };

    // 回放地址检查
    checkReplay = (e) => {
        let reg = /^(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
        this.setState({
            changeReplay: true
        });
        if (e.target.value === '') {
            this.setState({
                playBackHint: '',
                playBackState: '',
            });
        } else if (!reg.test(e.target.value)) {
            this.setState({
                playBackHint: '请输入正确的回放地址',
                playBackState: 'error',
            })
        } else {
            this.setState({
                playBackHint: '',
                playBackState: 'success',
            });
        }
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
        }else if (!(e.target.value.indexOf(" ") === -1)) {
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

    // 课程内容图片内容绑定
    clickUpload = () => {
        let input = document.querySelector('.content-pic input');
        input.click()
    };

    // 检查图片的格式
    beforeUpload = (file) => {
        if (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') {
            if (file.size < 6990506) {
                // message.error('图片格式错误，请上传少于20MB的图片！')
                this.setState({
                    upload: true,
                    contentStatus:'success'
                });
            } else {
                this.setState({
                    upload: false,
                    contentStatus: 'error',
                });
                message.error('图片格式错误，请上传少于20MB的图片！')
            }
        } else {
            this.setState({
                upload: false,
                contentStatus: 'error'
            });
            message.error('格式错误，请上传jpg/jpeg/png格式的图片')
        }
    };

    // 上传裁剪课程内容图片
    upload = (files) => {
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
                        if (_this.state.upload) {
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
                            message.error('格式错误，请上传jpg/jpeg/png格式的图片')
                        }
                    } else {
                        message.error('图片格式错误，请上传宽为750像素的图片！');
                        _this.setState({
                            contentStatus: 'error',
                            image: '',
                            upload: false
                        });
                    }
                };
                image.src= data;
            }
        })(file);
        fileReader.readAsDataURL(file); // 读取完毕，显示到页面
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

    // 海报按钮上传绑定
    clickUploadPoster = () => {
        let input = document.querySelector('.poster-pic input');
        input.click()
    };

    // 检查海报图片的格式
    beforeUploadPoster = (file) => {
        console.log(file, file.size);
        if (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') {
            if (file.size < 1976297) {
                this.setState({
                    uploadPoster: true,
                });
            } else {
                this.setState({
                    uploadPoster: false,
                    posterStatus: 'error',
                });
                message.error('图片格式错误，请上传少于2MB的图片！')
            }
        } else {
            this.setState({
                uploadPoster: false,
                posterStatus: 'error'
            });
            message.error('格式错误，请上传jpg/jpeg/png格式的图片')
        }
    };

    // 上传海报
    uploadPoster = (files) => {
        let fileReader = new FileReader(); // 图片上传，读图片
        let file = files.file; // 获取到上传的对象
        let _this = this;
        fileReader.onload = (function (file) {
            return function (ev) {
                let data = ev.target.result;
                let image = new Image();
                image.onload = () => {
                    if (parseInt(image.width) === 750 && parseInt(image.height) === 1334) {
                        _this.setState({
                            posterImage: ev.target.result,
                            posterStatus: 'success',
                        });
                        if (_this.state.uploadPoster) {
                            requestData(file).then(response => {
                                _this.setState({
                                    posterPic: response.data.key
                                });
                            });
                        }
                    } else {
                        message.error('图片格式错误，请上传750*1334像素的图片！');
                        _this.setState({
                            posterStatus: 'error',
                            posterImage: '',
                            uploadPoster: false
                        });
                    }
                };
                image.src = data;
            }
        })(file);
        fileReader.readAsDataURL(file); // 读取完毕，显示到页面
    };

    // 分享缩略图按钮上传绑定
    clickOneUpload = () => {
        let inputUpload = document.querySelector('.thumbnai-pic input')
        inputUpload.click()
    };

    // 课程缩略图按钮上传绑定
    clickUploadCourse = () => {
        let input = document.querySelector('.courseimgs input')
        input.click()
    };

    //上传课程缩略图格式检查
    beforeUploadCourseThumbnail = (file) => {
        if (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') {
            this.setState({
                uploadThumbnailCourse: true,
                courseThumbnailStatu:'success'
            })
        } else {
            this.setState({
                uploadThumbnailCourse: false,
                courseThumbnailStatu:'error',
                courseImage: null
            });
        }
    };

    // 上传分享缩略图格式检查
    beforeUploadThumbnail = (file) => {
        if (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') {
            this.setState({
                uploadThumbnail: true,
                contentStatus:'success'
            })
        } else {
            this.setState({
                uploadThumbnail: false
            })
        }
    };

    // 上传课程缩略图
    uploadCourseThumbnail = (files) => {
        let fileReader = new FileReader(); // 图片上传，读图片
        let file = files.file; // 获取到上传的对象
        let _this = this;
        fileReader.onload = (function (file) {
            return function (ev) {
                let data = ev.target.result;
                let image = new Image();
                image.onload = () => {
                    if (parseInt(image.width)/ parseInt(image.height)=== 3/2){
                        _this.setState({
                            courseImage: ev.target.result
                        });
                        if (_this.state.uploadThumbnailCourse) {
                            requestData(file).then(res => {
                                _this.setState({
                                    siteThumbnail: res.data.key
                                });
                            });
                        } else {
                            message.error('格式错误，请上传jpg/jpeg/png格式的图片')
                        }
                    }else {
                        message.error('图片尺寸错误，请上传宽高比为 3:2 的图片！')
                        _this.setState({
                            courseThumbnailStatu: 'error',
                            courseImage: '',
                            uploadThumbnailCourse: false
                        });
                    }
                };
                image.src= data;
            }
        })(file);
        fileReader.readAsDataURL(file); // 读取完毕，显示到页面
    };

    // 上传分享缩略图
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

    // 检查头像x轴坐标值
    checkXPhoto = (value) => {
        let width = 750 - this.state.photoWidth;
        if (value < 0 || value > width) {
            this.setState({
                photoXStatus: 'error',
                photoXHint: '范围为0-' + width
            })
        } else if (!rule.test(value) || value.length === 0) {
            this.setState({
                photoXStatus: 'error',
                photoXHint: '请输入数字'
            })
        } else {
            this.setState({
                photoXStatus: 'success',
                photoXHint: ''
            })
        }
    };

    // 检查头像y轴坐标值
    checkYPhoto = (value) => {
        let height = 1334 - this.state.photoHeight;
        if (value < 0 || value > height) {
            this.setState({
                photoYStatus: 'error',
                photoYHint: '范围为0-' + height
            })
        } else if (!rule.test(value) || value.length === 0) {
            this.setState({
                photoYStatus: 'error',
                photoYHint: '请输入数字'
            })
        } else {
            this.setState({
                photoYStatus: 'success',
                photoYHint: ''
            })
        }
    };

    // 检查头像width
    checkWPhoto = (value) => {
        if (value < 1 || value > 200) {
            this.setState({
                photoWStatus: 'error',
                photoWHint: '范围为1-200'
            })
        } else if (!rule.test(value) || value.length === 0) {
            this.setState({
                photoWStatus: 'error',
                photoWHint: '请输入数字'
            })
        } else {
            this.setState({
                photoWStatus: 'success',
                photoWHint: '',
                photoWidth: value
            })
        }
    };

    // 检查头像height
    checkHPhoto = (value) => {
        if (value < 1 || value > 200) {
            this.setState({
                photoHStatus: 'error',
                photoHHint: '范围为1-200'
            })
        } else if (!rule.test(value) || value.length === 0) {
            this.setState({
                photoHStatus: 'error',
                photoHHint: '请输入数字'
            })
        } else {
            this.setState({
                photoHStatus: 'success',
                photoHHint: '',
                photoHeight: value
            })
        }
    };

    // 检查邀请文本
    inviteCheck = (e) => {
        if (e.target.value.length < 0 || e.target.value.length > 10) {
            this.setState({
                inviteStatus: 'error',
                inviteHint: '不能超过10字'
            })
        } else if (!(e.target.value.indexOf(" ") === -1)) {
            this.setState({
                inviteStatus: 'error',
                inviteHint: '禁止输入空格'
            })
        } else if (emojiRule.test(e.target.value)) {
            this.setState({
                inviteStatus: 'error',
                inviteHint: '禁止输入emoji'
            })
        } else {
            this.setState({
                inviteStatus: 'success',
                inviteHint: ''
            })
        }
    };

    // 检查文案x轴坐标值
    checkXArticle = (value) => {
        if (value < 0 || value > 750) {
            this.setState({
                articleXStatus: 'error',
                articleXHint: '范围为0-750'
            })
        } else if (!rule.test(value) || value.length === 0) {
            this.setState({
                articleXStatus: 'error',
                articleXHint: '请输入数字'
            })
        } else {
            this.setState({
                articleXStatus: 'success',
                articleXHint: ''
            })
        }
    };

    // 检查文案y轴坐标值
    checkYArticle = (value) => {
        if (value < 0 || value > 1334) {
            this.setState({
                articleYStatus: 'error',
                articleYHint: '范围为0-1334'
            })
        } else if (!rule.test(value) || value.length === 0) {
            this.setState({
                articleYStatus: 'error',
                articleYHint: '请输入数字'
            })
        } else {
            this.setState({
                articleYStatus: 'success',
                articleYHint: ''
            })
        }
    };

    // 检查二维码x轴坐标
    checkXQrcode = (value) => {
        let width = 750 - this.state.qrcodeWidth;
        if (value < 0 || value > width) {
            this.setState({
                qrcodeXStatus: 'error',
                qrcodeXHint: '范围为0-' + width
            })
        } else if (!rule.test(value) || value.length === 0) {
            this.setState({
                qrcodeXStatus: 'error',
                qrcodeXHint: '请输入数字'
            })
        } else {
            this.setState({
                qrcodeXStatus: 'success',
                qrcodeXHint: ''
            })
        }
    };

    // 检查二维码y轴坐标
    checkYQrcode = (value) => {
        let height = 1334 - this.state.qrcodeHeight;
        if (value < 0 || value > height) {
            this.setState({
                qrcodeYStatus: 'error',
                qrcodeYHint: '范围为0-' + height
            })
        } else if (!rule.test(value) || value.length === 0) {
            this.setState({
                qrcodeYStatus: 'error',
                qrcodeYHint: '请输入数字'
            })
        } else {
            this.setState({
                qrcodeYStatus: 'success',
                qrcodeYHint: ''
            })
        }
    };

    // 检查二维码width
    checkWQrcode = (value) => {
        if (value < 1 || value > 500) {
            this.setState({
                qrcodeWStatus: 'error',
                qrcodeWHint: '范围为0-500'
            })
        } else if (!rule.test(value) || value.length === 0) {
            this.setState({
                qrcodeWStatus: 'error',
                qrcodeWHint: '请输入数字'
            })
        } else {
            this.setState({
                qrcodeWStatus: 'success',
                qrcodeWHint: '',
                qrcodeWidth: value
            })
        }
    };

    // 检查二维码height
    checkHQrcode = (value) => {
        if (value < 1 || value > 500) {
            this.setState({
                qrcodeHStatus: 'error',
                qrcodeHHint: '范围为1-500'
            })
        } else if (!rule.test(value) || value.length === 0) {
            this.setState({
                qrcodeHStatus: 'error',
                qrcodeHHint: '请输入数字'
            })
        } else {
            this.setState({
                qrcodeHStatus: 'success',
                qrcodeHHint: '',
                qrcodeHeight: value
            })
        }
    };

    // 前台显示
    onChangeRadio = (e) => {
        console.log(e.target.value)
        this.setState({
            siteShow: e.target.value
        })
    }

    render() {
        const {noReplayUrl} = this.props;
        const {getFieldDecorator} = this.props.form;
        const {siteShow} = this.state;
        const FormItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 16},
        };

        console.log(siteShow,'siteShowsiteShowsiteShowsiteShow')
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'}/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div style={{margin: "0 30px"}} className="edit-course">
                <Card title="基本信息" style={{ marginBottom: 24 }} bordered={false}>
                    <Form layout="horizontal" style={{paddingBottom: '20px'}}>
                        <FormItem className="open-course-form" label="公开课名称" validateStatus={this.state.titleState} help={this.state.titleHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('courseTitle', {
                                rules: [{required: true, message: '公开课名称不能为空'}],
                            })(
                                <Input placeholder="建议30字以内" disabled={this.state.courseAuth} onChange={this.titleCheck}/>
                            )}
                        </FormItem>
                        <FormItem className="open-course-form" label="学科" validateStatus={this.state.subjectListStatus}
                                  help={this.state.subjectListHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('subject', {
                                rules: [{required: true, message: '请选择学科'}],
                            })(
                                <div className='subject-list' style={{display: 'inline'}}>
                                    <Select
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        placeholder="请选择所属学科"
                                        getPopupContainer={() => document.querySelector('.subject-list')}
                                        onChange={this.chooseSubjectList}
                                        value={this.state.chooseSubject}
                                        disabled={this.state.courseAuth}
                                    >
                                        {this.state.subjectList && this.state.subjectList.map((value, index) => {
                                            return (<Option disabled={this.state.userSubjectAll.indexOf(parseInt(value.id)) === -1} style={{display: this.state.userSubjectAll.indexOf(parseInt(value.id)) !== -1 ? 'block' : 'none'}} key={parseInt(value.id)} value={parseInt(value.id)}>{value.name}</Option>)
                                        })}
                                    </Select>
                                </div>
                            )}
                        </FormItem>
                        <FormItem className="open-course-form" label="开课时间" {...FormItemLayout} hasFeedback>
                            <LocaleProvider locale={zh_CN}>
                                {getFieldDecorator('time', {
                                    rules: [{required: true, message: '开课时间不能为空'}],
                                })(
                                    <DatePicker style={{width: '230px'}} className="date-picker" showTime format="YYYY-MM-DD HH:mm:ss" disabled/>
                                )}
                            </LocaleProvider>
                        </FormItem>
                        <FormItem className="open-course-form" label="页面内容图片" validateStatus={this.state.contentStatus} {...FormItemLayout} hasFeedback>
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
                                        disabled={this.state.courseAuth}
                                    >
                                        {this.state.image ? <img src={this.state.image} alt="avatar"/> : uploadButton}
                                    </Upload>
                                    <div className="hint-text">
                                        <p style={{height: '15px'}}>图片尺寸：宽750像素，高建议要么一页看完，要么是长图</p>
                                        <p style={{height: '0px'}}>图片格式：jpg/png</p>
                                    </div>
                                    <div style={{marginTop: '10px'}}>
                                        <Button disabled={this.state.courseAuth} type="default" style={{width: '100px', textAlign: 'center'}} onClick={this.clickUpload}>上传</Button>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                        <FormItem style={{marginTop: '-20px', display: this.state.showProgress}} className="open-course-form" label="上传进度" validateStatus='' {...FormItemLayout} hasFeedback>
                            <Progress style={{width: '70%', marginTop: '10px'}} percent={this.state.progress} format={() => this.state.progressText} status={this.state.progressStatus} />
                        </FormItem>
                        <FormItem className="open-course-form courseimage-edit" label="课程缩略图" validateStatus={this.state.courseThumbnailStatu} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('courseThumbnail', {
                                rules: [{required: true, message: '请上传课程缩略图'}],
                            })(
                                <div style={{position: 'relative'}} className="form-item courseimgs" id="courseimgs">
                                    <Upload
                                        name="avatar"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        fileList={this.state.fileListCourse}
                                        customRequest={this.uploadCourseThumbnail}
                                        beforeUpload={this.beforeUploadCourseThumbnail}
                                        disabled={this.state.courseAuth}
                                    >
                                        {this.state.courseImage ? <img src={this.state.courseImage} alt="noImg"/> : uploadButton}
                                    </Upload>
                                    <div className="hint-text">
                                        <p style={{height: '15px'}}>[上传图片] 要求：图片宽高比为 3:2，建议图片尺寸：900*600</p>
                                        <p style={{height: '0px'}}>图片格式：jpg/png</p>
                                    </div>
                                    <div style={{marginTop: '10px'}}>
                                        <Button disabled={this.state.courseAuth} type="default" style={{width: '100px', textAlign: 'center'}} onClick={this.clickUploadCourse}>上传</Button>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                        <FormItem className="open-course-form" label="设置显示人数" validateStatus={this.state.signupNumber} help={this.state.signupNumberHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('signupNumbers', {
                                rules: [{required: false, message: ''}],
                            })(
                                <Input disabled={this.state.courseAuth} id="signupNumber" type="number" placeholder="用户端显示人数 = 显示人数+实际报名人数" onChange={this.checksignupNumber}/>
                            )}
                        </FormItem>
                        <FormItem className="open-course-form" label="前台显示" {...FormItemLayout} hasFeedback>
                            <Radio.Group onChange={this.onChangeRadio} value={siteShow}>
                                <Radio value={0}>是</Radio>
                                <Radio value={1}>否</Radio>
                            </Radio.Group>
                        </FormItem>
                    </Form>
                </Card>
                <Card title="海报信息" style={{marginBottom: 24}} bordered={false}>
                    <FormItem className="open-course-form" label="海报图片"
                              validateStatus={this.state.posterStatus} {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('poster', {
                            rules: [{required: true, message: '请上传海报图片'}],
                        })(
                            <div style={{position: 'relative'}} className="form-item poster-pic">
                                <Upload
                                    name="avatar"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    fileList={this.state.fileListPost}
                                    customRequest={this.uploadPoster}
                                    beforeUpload={this.beforeUploadPoster}
                                    disabled={this.state.courseAuth}
                                >
                                    {this.state.posterImage ? <img src={this.state.posterImage} alt="noImg"/> : uploadButton}
                                </Upload>
                                <div className="hint-text">
                                    <p style={{height: '15px'}}>图片尺寸：750*1334像素</p>
                                    <p style={{height: '0px'}}>图片格式：jpg/png</p>
                                </div>
                                <div style={{marginTop: '10px'}}>
                                    <Button type="default" style={{width: '100px', textAlign: 'center'}}
                                            disabled={this.state.courseAuth}
                                            onClick={this.clickUploadPoster}>上传</Button>
                                </div>
                            </div>
                        )}
                    </FormItem>
                    <FormItem className="open-course-form poster" label="微信头像尺寸" validateStatus='' help=''  {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('photoSize', {
                            rules: [{required: true, message: '请上传微信头像尺寸'}],
                        })(
                            <div>
                                <FormItem style={{float: 'left'}} label="w" validateStatus={this.state.photoWStatus} help={this.state.photoWHint} {...FormItemLayout} hasFeedback>
                                    {getFieldDecorator('photoW', {
                                        rules: [{required: false}],
                                    })(
                                        <InputNumber disabled={this.state.courseAuth} min={1} max={200} onChange={this.checkWPhoto}/>
                                    )}
                                </FormItem>
                                <FormItem style={{float: 'left', marginLeft: '25px'}} label="h" validateStatus={this.state.photoHStatus} help={this.state.photoHHint} {...FormItemLayout} hasFeedback>
                                    {getFieldDecorator('photoH', {
                                        rules: [{required: false}],
                                    })(
                                        <InputNumber disabled={this.state.courseAuth} min={1} max={200} onChange={this.checkHPhoto}/>
                                    )}
                                </FormItem>
                            </div>
                        )}
                    </FormItem>
                    <FormItem className="open-course-form poster" label="微信头像坐标" validateStatus='' help='' {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('photoPosition', {
                            rules: [{required: true, message: '请上传微信头像坐标'}],
                        })(
                            <div>
                                <FormItem style={{float: 'left'}} label="x" validateStatus={this.state.photoXStatus} help={this.state.photoXHint}  {...FormItemLayout} hasFeedback>
                                    {getFieldDecorator('photoX', {
                                        rules: [{required: false}],
                                    })(
                                        <InputNumber disabled={this.state.courseAuth} min={0} max={750 - this.state.photoWidth} onChange={this.checkXPhoto}/>
                                    )}
                                </FormItem>
                                <FormItem style={{float: 'left', marginLeft: '25px'}} label="y" validateStatus={this.state.photoYStatus} help={this.state.photoYHint} {...FormItemLayout} hasFeedback>
                                    {getFieldDecorator('photoY', {
                                        rules: [{required: false}],
                                    })(
                                        <InputNumber disabled={this.state.courseAuth} min={0} max={1334 - this.state.photoHeight} onChange={this.checkYPhoto}/>
                                    )}
                                </FormItem>
                            </div>
                        )}
                    </FormItem>
                    <FormItem className="open-course-form" label="邀请文案" validateStatus={this.state.inviteStatus} help={this.state.inviteHint} {...FormItemLayout} hasFeedback>
                        <span style={{marginLeft: '8px'}}>{this.state.data.nickname ? this.state.data.nickname: '微信昵称'}+ </span>
                        {getFieldDecorator('inviteTxt', {
                            rules: [{required: false}],
                        })(
                            <Input style={{width: '240px'}} disabled={this.state.courseAuth} placeholder="邀请你一起上课" onChange={this.inviteCheck}/>
                        )}
                    </FormItem>
                    <FormItem className="open-course-form poster" label="文案坐标" validateStatus='' help='' {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('articleSize', {
                            rules: [{required: true, message: '请上传文案坐标'}],
                        })(
                            <div>
                                <FormItem style={{float: 'left'}} label="x" validateStatus={this.state.articleXStatus} help={this.state.articleXHint} {...FormItemLayout} hasFeedback>
                                    {getFieldDecorator('articleX', {
                                        rules: [{required: false}],
                                    })(
                                        <InputNumber disabled={this.state.courseAuth} min={0} max={750} onChange={this.checkXArticle}/>
                                    )}
                                </FormItem>
                                <FormItem style={{float: 'left', marginLeft: '25px'}} label="y" validateStatus={this.state.articleYStatus} help={this.state.articleYHint}  {...FormItemLayout} hasFeedback>
                                    {getFieldDecorator('articleY', {
                                        rules: [{required: false}],
                                    })(
                                        <InputNumber disabled={this.state.courseAuth} min={0} max={1334} onChange={this.checkYArticle}/>
                                    )}
                                </FormItem>
                            </div>
                        )}
                    </FormItem>
                    <FormItem className="open-course-form poster" label="二维码尺寸" validateStatus='' help='' {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('qrcodeSize', {
                            rules: [{required: true, message: '请上传二维码尺寸'}],
                        })(
                            <div>
                                <FormItem style={{float: 'left'}} label="w" validateStatus={this.state.qrcodeWStatus} help={this.state.qrcodeWHint}  {...FormItemLayout} hasFeedback>
                                    {getFieldDecorator('qrcodeW', {
                                        rules: [{required: false}],
                                    })(
                                        <InputNumber disabled={this.state.courseAuth} min={1} max={500} onChange={this.checkWQrcode}/>
                                    )}
                                </FormItem>
                                <FormItem style={{float: 'left', marginLeft: '25px'}} label="h" validateStatus={this.state.qrcodeHStatus} help={this.state.qrcodeHHint} {...FormItemLayout} hasFeedback>
                                    {getFieldDecorator('qrcodeH', {
                                        rules: [{required: false}],
                                    })(
                                        <InputNumber disabled={this.state.courseAuth} min={1} max={500} onChange={this.checkHQrcode}/>
                                    )}
                                </FormItem>
                            </div>
                        )}
                    </FormItem>
                    <FormItem className="open-course-form poster" label="二维码坐标" validateStatus='' help='' {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('qrcodePosition', {
                            rules: [{required: true, message: '请上传二维码坐标'}],
                        })(
                            <div>
                                <FormItem style={{float: 'left'}} label="x" validateStatus={this.state.qrcodeXStatus} help={this.state.qrcodeXHint}  {...FormItemLayout} hasFeedback>
                                    {getFieldDecorator('qrcodeX', {
                                        rules: [{required: false}],
                                    })(
                                        <InputNumber disabled={this.state.courseAuth} min={0} max={750 - this.state.qrcodeWidth} onChange={this.checkXQrcode}/>
                                    )}
                                </FormItem>
                                <FormItem style={{float: 'left', marginLeft: '25px'}} label="y" validateStatus={this.state.qrcodeYStatus} help={this.state.qrcodeYHint}  {...FormItemLayout} hasFeedback>
                                    {getFieldDecorator('qrcodeY', {
                                        rules: [{required: false}],
                                    })(
                                        <InputNumber disabled={this.state.courseAuth} min={0} max={1334 - this.state.qrcodeHeight} onChange={this.checkYQrcode}/>
                                    )}
                                </FormItem>
                            </div>
                        )}
                    </FormItem>
                </Card>
                <Card title="课程内容信息" style={{ marginBottom: 24 }} bordered={false}>
                    <Form layout="horizontal" style={{paddingBottom: '20px'}} className="room-url">
                        <FormItem className="open-course-form" label="直播间地址" validateStatus={this.state.liveRoomState} help={this.state.liveRoomHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('liveUrl', {
                                rules: [{required: true, message: '请填写直播地址'}],
                            })(
                                <Input disabled={this.state.courseAuth} onChange={this.checkLive} placeholder="请输入直播间的观看地址"/>
                            )}
                        </FormItem>
                        <FormItem className="open-course-form" label="回放地址" validateStatus={this.state.changeReplay ? this.state.playBackState : (noReplayUrl ? 'error' : this.state.playBackState)}
                                  help={this.state.changeReplay ? this.state.playBackHint : (noReplayUrl ? '请输入并提交回放地址后，再切换直播状态' : this.state.playBackHint)} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('replayUrl', {
                                rules: [{required: false, message: '切换为回放时必须填写'}],
                            })(
                                <Input disabled={this.state.courseAuth} onChange={this.checkReplay} placeholder="切换为回放时必须填写"/>
                            )}
                        </FormItem>
                    </Form>
                </Card>
                <Card title="微信分享信息" bordered={false}>
                    <Form layout="horizontal" style={{paddingBottom: '20px'}}>
                        <FormItem className="open-course-form" label="朋友圈分享标题" validateStatus={this.state.friendCircleState} help={this.state.friendCircleHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('firend', {
                                rules: [{required: true, message: '朋友圈分享标题不能为空'}],
                            })(
                                <Input disabled={this.state.courseAuth} placeholder="建议30字以内" onChange={this.friendCircleCheck}/>
                            )}
                        </FormItem>
                        <FormItem className="open-course-form" label="群分享标题" validateStatus={this.state.groupSharingState} help={this.state.groupSharingHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('qun', {
                                rules: [{required: true, message: '群分享标题不能为空'}],
                            })(
                                <Input disabled={this.state.courseAuth} placeholder="建议30字以内" onChange={this.groupSharingCheck}/>
                            )}
                        </FormItem>
                        <FormItem className="open-course-form" label="分享描述" validateStatus={this.state.shareDescribeState} help={this.state.shareDescribeHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('des', {
                                rules: [{required: true, message: '分享描述不能为空'}],
                            })(
                                <Input disabled={this.state.courseAuth} placeholder="建议30字以内" onChange={this.shareDescribeCheck}/>
                            )}
                        </FormItem>

                        <FormItem className="open-course-form" label="分享缩略图" {...FormItemLayout} hasFeedback>
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
                                        disabled={this.state.courseAuth}
                                    >
                                        {this.state.img ? <img src={this.state.img} alt="avatar"/> : uploadButton}
                                    </Upload>
                                    <div style={{marginTop: '10px'}}>
                                        <Button disabled={this.state.courseAuth} type="default" style={{width: '100px', textAlign: 'center'}} onClick={this.clickOneUpload}>上传</Button>
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </Form>
                </Card>
                <div className="upload-title bottom-btn" style={{display: openAuthor('marketing:opencourse:manage', this.state.data.subjects) ? 'block': 'none'}}>
                    <Button type="default" style={{marginRight: '20px'}} onClick={this.handleCancel}>取消</Button>
                    <Modal
                        title="提示"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleTipCancel}
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
