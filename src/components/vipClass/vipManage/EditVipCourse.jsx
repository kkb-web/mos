import  React  from  'react';
import  './EditVipCourse.less'
import  BreadcrumbCustom  from  '../../common/BreadcrumbCustom';
import  {
    Upload,
    Form,
    Input,
    Icon,
    Button,
    message,
    Select,
    Progress,
    Card,
    Modal,
    Spin,
    Radio
}  from  'antd';
import  history  from  '../../common/History';
import  {requestData}  from  "../../../utils/qiniu";
import  {getUserSubject}  from  "../../../api/openCourseApi";
import  {checkVipcourseName,  getVipSubjectList,  editVipCourse,  getVipDetailEdit}  from  '../../../api/vipCourseApi'
import  {connect}  from  "../../../utils/socket";
import  {getToken,  getNum}  from  "../../../utils/filter";

const  FormItem  =  Form.Item;
const  Option  =  Select.Option;
let  emojiRule  =  /([\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70-\uDD71\uDD7E-\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01-\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50-\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96-\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF])|(\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F-\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95-\uDD96\uDDA4-\uDDA5\uDDA8\uDDB1-\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB-\uDEEC\uDEF0\uDEF3-\uDEF6])|(\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0])/g;

class  Local  extends  React.Component  {
    constructor(props,  context)  {
        super(props,  context);
        this.state  =  {
            loading:  false,
            load:  'none',
            img:  '',
            image:  '',
            courseImage:  '',
            fileList:  [],
            fileLists:  [],
            fileListCourse:  [],
            upload:  false,
            uploadThumbnail:  true,
            uploadThumbnailCourse:  true,
            uploadThumbnailPoster:  false,
            contentStatus:  '',
            posterStatus:  '',
            progress:  0,
            progressText:  '',
            progressStatus:  'active',
            showProgress:  'none',
            subjectList:  [],
            courseTypeList:  [{name:  "vip课程",  id:  0},  {name:  "低价小课",  id:  1}],
            chooseSubject:  [],
            currentTime:  null,
            photoWidth:  '',
            photoHeight:  '',
            qrcodeWidth:  '',
            qrcodeHeight:  '',
            disableBtn:  false,
            priceValue:  '',
            subjectValue:  '',
            courseTypeValue: '',
      contentPic: '',
      courseDetailData: {},
      courseId: this.props.courseId,
      code: '',
      siteShow: 0
    };
  }

  // 渲染
  componentDidMount() {
    this.getVipDetailEditFn();
  }

  componentWillMount() {
    this.getUserSubjectFn();
  };

  //获取详情
  getVipDetailEditFn = () => {
    let _this = this;
    let params = {
      courseId: this.state.courseId
    };
    getVipDetailEdit(params).then(res => {
      if (res.data.code == 0) {
        let values = res.data.data;
        _this.props.form.setFieldsValue({
          vipcourseTitle: values.name,
          vipdescription: values.description,
          vipPrice: getNum(values.price),
          firend: values.friendCircleTitle,
          qun: values.groupShareTitle,
          des: values.shareDescription,
          courseThumbnail: values.icon,
          share: values.shareCoverImage,
          tableName:values.formName,
          tableUrl:values.formUrl
        });
        _this.setState({
          code: values.code,
          courseDetailData: values,
          contentPic: values.icon,
          shareThumbnails: values.shareCoverImage,
          subjectValue: values.subjectId,
          courseTypeValue: values.type,
          courseImage: `https://img.kaikeba.com/${values.icon}!w1h1`,
          img: `https://img.kaikeba.com/${values.shareCoverImage}!w1h1`,
          siteShow: values.siteShow
        })
      }
    }).catch(err => {
      console.log(err, "详情")
    })
  };
  getUserSubjectFn = () => {
    getVipSubjectList().then(res => {
      this.setState({
        subjectList: res.data.data
      })
    });
  };
  // 学科转换(id => name)
  subjectIdToName = (id) => {
    const data = this.state.subjectList;
    for (var i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        return data[i].name ? data[i].name : null
      }
    }
  };
  //学科转换(name => id)
  subjectNameToId = (name) => {
    const data = this.state.subjectList;
    for (var i = 0; i < data.length; i++) {
      if (data[i].name === name) {
        return data[i].id ? data[i].id : null
      }
    }
  };
  // 课程类型转换(id => name)
  courseTypeIdToName = (id) => {
    const data = this.state.courseTypeList;
    for (var i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        return data[i].name ? data[i].name : null
      }
    }
  };
  //课程类型转换(name => id)
  courseTypeNameToId = (name) => {
    const data = this.state.courseTypeList;
    for (var i = 0; i < data.length; i++) {
      if (data[i].name === name) {
        return data[i].id
      }
    }
  };


  // 提交，添加公开课
  handleSubmit = (e) => {
    e.preventDefault();
    let _this = this;
    let params = {};
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        params = {
          id: this.state.courseId,
          code: this.state.code,
          name: values.vipcourseTitle,
          subjectId: isNaN(values.subject) ? this.subjectNameToId(values.subject) : parseInt(values.subject),
          description: values.vipdescription,
          price: parseFloat(values.vipPrice),
          icon: _this.state.contentPic,
          friendCircleTitle: values.firend,
          groupShareTitle: values.qun,
          shareDescription: values.des,
          shareCoverImage: _this.state.shareThumbnails,
          siteShow: this.state.siteShow,
          type: isNaN(values.courseType) ? this.courseTypeNameToId(values.courseType) : parseInt(values.courseType),
          formName:values.tableName ? values.tableName : null,
          formUrl:values.tableUrl ? values.tableUrl : null
        };
        this.setState({
          disableBtn: true
        });
        editVipCourse(params).then(res => {
          this.setState({
            disableBtn: false
          });
          if (res.data.code == 0) {
            message.success('提交成功');
            history.push('/app/vipcourse/list');
          } else if (res.data.code == 1) {
            message.error(res.data.data);
          } else {
            message.error('提交失败，请稍后再试');
          }
        }).catch(err => {
          console.log(err, '编辑vip课程')
          this.setState({
            disableBtn: false
          });
        })
      }
    });
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
    history.push('/app/vipcourse/list');
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
    let values = this.state.courseDetailData;
    let sourceValues = {
      subject: this.subjectIdToName(values.subjectId),
      courseType: this.courseTypeIdToName(this.state.courseTypeValue),
      vipcourseTitle: values.name,
      vipdescription: values.description,
      vipPrice: getNum(values.price),
      firend: values.friendCircleTitle,
      qun: values.groupShareTitle,
      des: values.shareDescription,
      courseThumbnail: values.icon,
      share: values.shareCoverImage,
      tableName:values.formName,
      tableUrl:values.formUrl
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
        history.push('/app/vipcourse/list');
      }
    }
  };

  //验证用户名
  checkVipcourseNameFn = (name) => {
    checkVipcourseName(`name=${name}&courseId=${this.state.courseId}`).then(res => {
      if (res.data.code == 0) {
        return true
      } else if (res.data.code == 1) {
        message.error(res.data.msg)
        return false
      } else if (res.data.code == 10002) {
        return false
      }
    }).catch(err => {
      console.log(err)
    })
  };
  //课程名称失去焦点
  titleCheckRepeat = (e) => {
    console.log(e.target.value)
    checkVipcourseName(`name=${e.target.value}&courseId=${this.state.courseId}`).then(res => {
      if (res.data.code == 10002) {
        this.setState({
          vipTitleHint: '名称不能重复',
          vipTitleState: 'error'
        })
      }
    });
  };
  // 检查名称
  titleCheck = (e) => {
    if (e.target.value.length === 0) {
      this.setState({
        vipTitleHint: '名称不能为空',
        vipTitleState: 'error'
      })
    } else if (emojiRule.test(e.target.value)) {
      this.setState({
        vipTitleHint: '禁止输入emoji',
        vipTitleState: 'error'
      })
    } else if (e.target.value.length == 20) {
      this.setState({
        vipTitleHint: '字数需在20字以内',
        vipTitleState: 'error'
      })
    } else {
      this.setState({
        vipTitleHint: '',
        vipTitleState: 'success'
      })
    }
  };

  //学科检查
  chooseSubject = (value) => {
    console.log(value)
    if (value) {
      this.setState({
        subjectState: 'success',
        subjectHint: '',
        subjectValue: value
      })
    } else {
      this.setState({
        subjectState: 'error',
        subjectHint: '请选择学科',
        subjectValue: value
      })
    }
  };
  //课程分类检查
  checkCourseType = (value) => {
    if (value) {
      this.setState({
        courseTypeState: 'success',
        courseTypeHint: '',
        courseTypeValue: value
      })
    } else {
      this.setState({
        courseTypeState: 'error',
        courseTypeHint: '请选择学科',
        courseTypeValue: value
      })
    }
  };
  //课程描述检查
  descriptionCheck = (e) => {
    if (e.target.value.length === 0) {
      this.setState({
        vipDescriptionHint: '内容不能为空',
        vipDescriptionState: 'error'
      })
    } else if (!(e.target.value.indexOf(" ") === -1)) {
      this.setState({
        vipDescriptionHint: '禁止输入空格',
        vipDescriptionState: 'error'
      })
    } else if (emojiRule.test(e.target.value)) {
      this.setState({
        vipDescriptionHint: '禁止输入emoji',
        vipDescriptionState: 'error'
      })
    } else if (e.target.value.length == 30) {
      this.setState({
        vipDescriptionHint: '字数需在30字以内',
        vipDescriptionState: 'error'
      })
    } else {
      this.setState({
        vipDescriptionHint: '',
        vipDescriptionState: 'success'
      })
    }
  };
  //基础价格检查
  priceCheck = (e) => {
    if (parseFloat(e.target.value) >= 0.01 && parseFloat(e.target.value) <= 100000.00) {
      this.setState({
        vipPriceHint: '',
        vipPriceState: 'success',
      })
    } else if (e.target.value === '') {
      this.setState({
        vipPriceHint: '请输价格',
        vipPriceState: 'error',
      })
    } else {
      this.setState({
        vipPriceHint: '请输入有效范围内的数字 0.01~100000.00',
        vipPriceState: 'error',
      })
    }
  };
  //基础价格失去焦点补齐小数点
  priceBlur = (e) => {
    this.props.form.setFieldsValue({
      vipPrice: getNum(e.target.value, 2)
    });
  };

  //检查表名
  tableNameCheck = (e)=>{
    if (e.target.value.length === 0) {
      this.setState({
        tableNameHint: '',
        tableNameState: ''
      })
    } else if (emojiRule.test(e.target.value)) {
      this.setState({
        tableNameHint: '禁止输入emoji',
        tableNameState: 'error'
      })
    } else if (e.target.value.length == 50) {
      this.setState({
        tableNameHint: '字数需在50字以内',
        tableNameState: 'error'
      })
    } else {
      this.setState({
        tableNameHint: '',
        tableNameState: 'success'
      })
    }
  };
  //检查表链接
  tableUrlCheck = (e)=>{
    if (e.target.value.length === 0) {
      this.setState({
        tableUrlHint: '',
        tableUrlState: ''
      })
    } else if (emojiRule.test(e.target.value)) {
      this.setState({
        tableUrlHint: '禁止输入emoji',
        tableUrlState: 'error'
      })
    } else if (e.target.value.length == 50) {
      this.setState({
        tableUrlHint: '字数需在30字以内',
        tableUrlState: 'error'
      })
    } else {
      this.setState({
        tableUrlHint: '',
        tableUrlState: 'success'
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


  // 检查图片的格式
  beforeUpload = (file) => {
    // console.log(file, file.size);
    if (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') {
      if (file.size < 6990506) {
        this.setState({
          upload: true,
        });
      } else {
        this.setState({
          upload: false,
          contentStatus: 'error',
        });
        message.error('图片格式错误，请上传少于5MB的图片！')
      }
    } else {
      this.setState({
        upload: false,
        contentStatus: 'error'
      });
      message.error('格式错误，请上传jpg/jpeg/png格式的图片')
    }
  };


  // 分享缩略图按钮上传绑定
  clickOneUpload = () => {
    let inputUpload = document.querySelector('.thumbnai-pic input');
    inputUpload.click()
  };

  // 课程缩略图按钮上传绑定
  clickUploadCourse = () => {
    let input = document.querySelector('.vipcourseicon input');
    input.click()
  };

  //上传课程缩略图格式检查
  beforeUploadCourseThumbnail = (file) => {
    if (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') {
      this.setState({
        uploadThumbnailCourse: true,
        courseThumbnailStatus: 'success'
      })
    } else {
      this.setState({
        uploadThumbnailCourse: false,
        courseThumbnailStatus: 'error',
        courseImage: null
      });
    }
  };

  // 上传分享缩略图格式检查
  beforeUploadThumbnail = (file) => {
    if (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') {
      if (file.size > 10068) {
        message.error('图片格式错误，请上传少于10KB的图片！');
        this.setState({
          uploadThumbnail: false,
          thumbnailStatus: 'error',
          img: ''
        });
      } else {
        this.setState({
          uploadThumbnail: true,
          thumbnailStatus: 'success',
        })
      }
    } else {
      this.setState({
        uploadThumbnail: false,
        thumbnailStatus: 'error',
        img: ''
      });
      message.error('格式错误，请上传jpg/jpeg/png格式的图片')
    }
  };

  // 上传课程缩略图icon
  uploadCourseThumbnail = (files) => {
    let fileReader = new FileReader(); // 图片上传，读图片
    let file = files.file; // 获取到上传的对象
    let _this = this;
    fileReader.onload = (function (file) {
      return function (ev) {
        let data = ev.target.result;
        let image = new Image();
        image.onload = () => {
          if (parseInt(image.width) === 500 && parseInt(image.height) === 500) {
            _this.setState({
              courseImage: ev.target.result
            });
            if (_this.state.uploadThumbnailCourse) {
              requestData(file).then(res => {
                _this.setState({
                  contentPic: res.data.key
                });
              });
            } else {
              message.error('格式错误，请上传jpg/jpeg/png格式的图片')
            }
          } else {
            message.error('图片尺寸错误，请上传宽500，高500的图片！')
            _this.setState({
              courseThumbnailStatus: 'error',
              courseImage: '',
              uploadThumbnailCourse: false
            });
          }
        };
        image.src = data;
      }
    })(file);
    fileReader.readAsDataURL(file); // 读取完毕，显示到页面
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

  onChangeRadio = (e) => {
    console.log(e.target.value)
    this.setState({
      siteShow: e.target.value
    })
  }


  render() {
    const {subjectValue, courseTypeValue, disableBtn, siteShow} = this.state;
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
        path: '/app/course/list',
        name: 'VIP课程'
      },
      {
        name: 'VIP课列表',
        path: '#'
      },
      {
        name: '新建VIP课',
        path: '#'
      }
    ];
    return (
      <div style={{margin: "0 30px"}}>
        <Card title="基本信息" style={{marginBottom: 24}} bordered={false}>
          <Form layout="horizontal" style={{paddingBottom: '20px'}}>
            <FormItem key='subjectVals' className="open-course-form" label="课程分类"
                      validateStatus={this.state.courseTypeState}
                      help={this.state.courseTypeHint} {...FormItemLayout} hasFeedback>
              {getFieldDecorator('courseType', {
                rules: [{required: true, message: '请选择课程分类'}],
                initialValue: this.courseTypeIdToName(courseTypeValue)
              })(
                <Select
                  placeholder="请选择课程分类"
                  getPopupContainer={() => document.querySelector('.subject-list')}
                  onChange={this.checkCourseType}
                >
                  {
                    this.state.courseTypeList.map((value) => {
                      return (<Option key={value.id}
                                      alue={value.id}>{value.name}</Option>)
                    })
                  }

                </Select>
              )}
            </FormItem>
            <FormItem className="open-course-form" label="VIP课名称" validateStatus={this.state.vipTitleState}
                      help={this.state.vipTitleHint} {...FormItemLayout} hasFeedback>
              {getFieldDecorator('vipcourseTitle', {
                rules: [{required: true, message: '名称不能为空'}],
              })(
                <Input maxLength={20} placeholder="建议14字以内（同时用于页面title" onBlur={this.titleCheckRepeat}
                       onChange={this.titleCheck}/>
              )}
            </FormItem>
            <div className="subject-list">
              <FormItem key='subjectVals' className="open-course-form" label="学科"
                        validateStatus={this.state.subjectState}
                        help={this.state.subjectHint} {...FormItemLayout} hasFeedback>
                {getFieldDecorator('subject', {
                  rules: [{required: true, message: '请选择学科'}],
                  initialValue: this.subjectIdToName(subjectValue)
                })(
                  <Select
                    disabled
                    placeholder="请选择所属学科"
                    getPopupContainer={() => document.querySelector('.subject-list')}
                    onChange={this.chooseSubject}
                  >
                    {
                      this.state.subjectList.map((value) => {
                        return (<Option key={value.id}
                                        alue={value.id}>{value.name}</Option>)
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </div>
            <FormItem className="open-course-form" label="VIP课程介绍"
                      validateStatus={this.state.vipDescriptionState}
                      help={this.state.vipDescriptionHint} {...FormItemLayout} hasFeedback>
              {getFieldDecorator('vipdescription', {
                rules: [{required: true, message: 'VIP课程介绍不能为空'}],
              })(
                <Input maxLength={30} placeholder="建议30字以内(用于官网、小程序等)"
                       onChange={this.descriptionCheck}/>
              )}
            </FormItem>
            <FormItem className="open-course-form" label="基础价格" validateStatus={this.state.vipPriceState}
                      help={this.state.vipPriceHint} {...FormItemLayout} hasFeedback>
              {getFieldDecorator('vipPrice', {
                rules: [{required: true, message: '基础价格不能为空'}],
              })(
                <Input prefix="￥" type='number' min={0.01} max={100000} onBlur={this.priceBlur}
                       placeholder="" onChange={this.priceCheck}/>
              )}
            </FormItem>
            <FormItem style={{marginTop: '-20px', display: this.state.showProgress}}
                      className="open-course-form" label="上传进度" validateStatus='' {...FormItemLayout}
                      hasFeedback>
              <Progress style={{width: '70%', marginTop: '10px'}} percent={this.state.progress}
                        format={() => this.state.progressText} status={this.state.progressStatus}/>
            </FormItem>
            <FormItem id="courseimages" className="open-course-form courseimage-edit" label="课程icon"
                      validateStatus={this.state.courseThumbnailStatus} {...FormItemLayout} hasFeedback>
              {getFieldDecorator('courseThumbnail', {
                rules: [{required: true, message: '请上传课程icon'}],
              })(
                <div style={{position: 'relative'}} className="form-item vipcourseicon" id="courseimgs">
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    fileList={this.state.fileListCourse}
                    customRequest={this.uploadCourseThumbnail}
                    beforeUpload={this.beforeUploadCourseThumbnail}
                  >
                    {this.state.courseImage ?
                      <img src={this.state.courseImage} alt="noImg"/> : uploadButton}
                  </Upload>
                  <div className="vip-hint-text">
                    <p style={{height: '15px'}}>用于官网、小程序等位置</p>
                    <p style={{height: '15px'}}>图片尺寸：500px * 500px</p>
                    <p style={{height: '0px'}}>图片格式：jpg/png/jpeg</p>
                  </div>
                  <div style={{marginTop: '10px'}}>
                    <Button type="default" style={{width: '100px', textAlign: 'center'}}
                            onClick={this.clickUploadCourse}>上传</Button>
                  </div>
                </div>
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
        <Card title="报名后转介绍信息" style={{marginBottom: 24}} bordered={false}>
          <Form layout="horizontal" style={{paddingBottom: '20px'}}>
            <FormItem className="open-course-form" label="预留信息表名称"
                      validateStatus={this.state.tableNameState}
                      help={this.state.tableNameHint} {...FormItemLayout} hasFeedback>
              {getFieldDecorator('tableName', {
                rules: [{required: false, message: '预留信息表名称不能为空'}],
              })(
                <Input maxLength={20} placeholder="复制信息表单的表名称" onChange={this.tableNameCheck}/>
              )}
            </FormItem>
            <FormItem className="open-course-form" label="信息表地址"
                      validateStatus={this.state.tableUrlState}
                      help={this.state.tableUrlHint} {...FormItemLayout} hasFeedback>
              {getFieldDecorator('tableUrl', {
                rules: [{required: false, message: '信息表地址不能为空'}],
              })(
                <Input placeholder="复制信息表单的表地址" onChange={this.tableUrlCheck}/>
              )}
            </FormItem>
          </Form>
        </Card>
        <Card title="基础微信分享信息（新建班次时将默认复制此处信息）" bordered={false}>
          <Form layout="horizontal" style={{paddingBottom: '20px'}}>
            <FormItem className="open-course-form" label="朋友圈分享标题"
                      validateStatus={this.state.friendCircleState}
                      help={this.state.friendCircleHint} {...FormItemLayout} hasFeedback>
              {getFieldDecorator('firend', {
                rules: [{required: true, message: '朋友圈分享标题不能为空'}],
              })(
                <Input maxLength={20} placeholder="建议20字以内" onChange={this.friendCircleCheck}/>
              )}
            </FormItem>
            <FormItem className="open-course-form" label="群分享标题"
                      validateStatus={this.state.groupSharingState}
                      help={this.state.groupSharingHint} {...FormItemLayout} hasFeedback>
              {getFieldDecorator('qun', {
                rules: [{required: true, message: '群分享标题不能为空'}],
              })(
                <Input maxLength={20} placeholder="建议20字以内" onChange={this.groupSharingCheck}/>
              )}
            </FormItem>
            <FormItem className="open-course-form" label="分享描述"
                      validateStatus={this.state.shareDescribeState}
                      help={this.state.shareDescribeHint} {...FormItemLayout} hasFeedback>
              {getFieldDecorator('des', {
                rules: [{required: true, message: '分享描述不能为空'}],
              })(
                <Input maxLength={50} placeholder="建议30字以内" onChange={this.shareDescribeCheck}/>
              )}
            </FormItem>

            <FormItem className="open-course-form" label="分享缩略图"
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
                  >
                    {this.state.img ? <img src={this.state.img} alt="noImg"/> : uploadButton}
                  </Upload>
                  <div className="hint-text">
                    <p style={{height: '15px'}}>图片尺寸：120 * 120 像素</p>
                    <p style={{height: '0px'}}>图片格式：大小不超过10KB，不支持GIF格式</p>
                  </div>
                  <div style={{marginTop: '10px'}}>
                    <Button type="default" style={{width: '100px', textAlign: 'center'}}
                            onClick={this.clickOneUpload}>上传</Button>
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
            cancelText="取消"
            okText="确定"
          >
            <p>表单中仍有内容，是否确认取消？</p>
          </Modal>
          <Button disabled={disableBtn} type="primary" onClick={this.handleSubmit}>提交</Button>
        </div>
      </div>
    );
  }

}

const CollectionCreateForm = Form.create()(Local);
export default CollectionCreateForm;
