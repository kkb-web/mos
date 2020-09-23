import React, { Component } from 'react'
import { Button, Upload, Card, Modal, Input, Select, Form, message, Icon } from 'antd'
import BreadcrumbCustom from '../common/BreadcrumbCustom'
import UEditor from './Ueditor'

import history from '../common/History'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import { connect } from '../../utils/socket'
import { requestData } from '../../utils/qiniu'
import { EditMaterials, getSubject, getCourses, getMaterialsDetail} from '../../api/preSaleData'
import { openAuthor } from '../../utils/filter'
import _ from 'lodash'
let materialsId = 0
const { TextArea } = Input
const { Option } = Select
const FormItem = Form.Item

let emojiRule = /([\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70-\uDD71\uDD7E-\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01-\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50-\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96-\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF])|(\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F-\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95-\uDD96\uDDA4-\uDDA5\uDDA8\uDDB1-\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB-\uDEEC\uDEF0\uDEF3-\uDEF6])|(\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0])/g

class EditSaleData extends Component {
  constructor(props) {
    super(props)
    materialsId = props.materialsId
    this.state = {
      loading: false,
      initData: '',
      fileListCourse: [],
      disableBtn: false,
      visible: false,
      fileLists: [],
      subjectList: [],
      courseList: [],
      img: '',
      shareThumbnails: '',
      chooseSubject: [],
      vipCourse: [],
      vipCourseStatus: '',
      vipCourseHint: '',
      subjectsValue: [],
      courseIdValue: [],
      contentId:null,  //资料id
      shareId:null,  //分享id
      subjectId:[]
    }
  }

  componentDidMount() {
    this.getSubjectList()
  }
  //   get detail
  getDetail = () => {
    let data = { materialsId }
    let that = this
    getMaterialsDetail(data)
      .then(res => {
        let resDatas = res.data
        if (resDatas.code === 0) {
          let datas = resDatas.data
          this.setState({
            contentId:datas.contentId,
            shareId:datas.shareId,
            chooseSubject: datas.subjects,
            vipCourse:datas.courseId,
            subjectsValue: datas.subjects && datas.subjects.map(item => item - 0),
            courseIdValue: datas.courseId && datas.courseId.map(item => item - 0),
            initData: datas.content,
            shareThumbnails: datas.shareCoverImage,
            img: `https://img.kaikeba.com/${datas.shareCoverImage}!w1h1`,
            subjectId:datas.subjects
          })
          this.props.form.setFieldsValue({
            title: datas.title,
            description: datas.description,
            friendCircleTitle: datas.friendCircleTitle,
            groupShareTitle: datas.groupShareTitle,
            shareDescription: datas.shareDescription,
            shareCoverImage: datas.shareCoverImage
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
  componentWillUnmount() {}
  // get subject
  getSubjectList() {
    getSubject('manage')
      .then(res => {
        let resDatas = res.data
        if (resDatas.code === 0) {
          this.setState({
            subjectList: resDatas.data
          })
        }
      })
      .then(() => {
        this.getCourseList()
      })
  }
  // get course
  getCourseList() {
    getCourses('manage')
      .then(res => {
        let resDatas = res.data
        if (resDatas.code === 0) {
          this.setState({
            courseList: resDatas.data
          })
        }
      })
      .then(() => {
        this.getDetail()
      })
  }
  nameToId = (list1, list2) => {
    return list1.filter(item => list2.includes(item.name + '')).map(item => item.id + '')
  }
  // 提交，添加公开课
  onSubmit = e => {
    e.preventDefault();
    let data = {};
    let that = this;
    this.props.form.validateFieldsAndScroll((err, values) => {
      data = {
        id:materialsId,
        contentId:this.state.contentId,
        title: values.title,
        subjects: that.state.chooseSubject,
        description: values.description,
        courseId: that.state.vipCourse,
        content: that.refs.ueditor.getUEContent(),
        business: 'VIPCOURSE',
        materialsShare: {
          id:this.state.shareId,
          friendCircleTitle: values.friendCircleTitle,
          groupShareTitle: values.groupShareTitle,
          shareDescription: values.shareDescription,
          shareCoverImage: that.state.shareThumbnails
        }
      };
      !err && this.setState({
        disableBtn: true
      });
      !err && EditMaterials(data)
        .then(res => {
          this.setState({
            disableBtn: false
          })
          if (res.data.code == 0) {
            message.success('编辑成功')
            history.push('/app/presaledata/list')
          } else {
            message.error(res.data.msg)
          }
        })
        .catch(err => {
          this.setState({
            disableBtn: false
          })
        })
    })
  }
  // 取消
  onCancel = () => {
    let fieldsvalue = this.props.form.getFieldsValue()
    // 将JSON数据的key值存为一个数组，便于获取对象fieldsvalue的长度
    let arr = Object.keys(fieldsvalue)
    // 设置一个计数器，用来记录控件值为空的个数
    let count = 1
    // 遍历表单中所有控件的值
    for (let i in fieldsvalue) {
      count++
      // 如果控件的值不为空，则显示提示框
      if (fieldsvalue[i]) {
        this.showModal()
        break
      } else if (count > arr.length) {
        // 当遍历完所有的控件都为空时，返回上一级菜单
        history.push('/app/presaledata/list')
      }
    }
  }
  // 取消弹出model
  showModal = () => {
    this.setState({
      visible: true
    })
  }
  // 确认取消
  handleOk = () => {
    this.setState({
      visible: false
    })
    this.props.form.resetFields()
    history.push('/app/presaledata/list')
  }
  // 取消弹出model中取消
  handleTipCancel = () => {
    this.setState({
      visible: false
    })
  }
  // 分享缩略图按钮上传绑定
  clickOneUpload = () => {
    let inputUpload = document.querySelector('.thumbnai-pic input')
    inputUpload.click()
  }

  // 上传图片到七牛并且展示到编辑器内；
  uploadCourseThumbnail = files => {
    var file = document.querySelector('input[type=file]').files[0]
    let fileReader = new FileReader() // 图片上传，读图片
    fileReader.onload = (function(file) {
      return function(ev) {
        let data = ev.target.result;
        var image = new Image();
        image.onload = () => {
          requestData(file)
              .then(res => {
                console.log(res.data.key)
                console.log(image.width,'image')
                window.UE.getEditor('editor').execCommand(
                    'inserthtml',
                    '<img src="https://img.kaikeba.com/' + res.data.key + '" width="'+image.width+'px" class="predata-img"/>'
                )
              })
              .catch(err => {
                console.log(err)
              })
        }
        image.src = data;
      }
    })(file)
    fileReader.readAsDataURL(file) // 读取完毕，显示到页面
  }

  // 检查资料名称
  titleCheck = e => {
    console.log(e.target.value)
    if (e.target.value.length === 0) {
      this.setState({
        titleHint: '名称不能为空',
        titleState: 'error'
      })
    } else if (!(e.target.value.indexOf(' ') === -1)) {
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
        titleHint: '名称在20字以内',
        titleState: 'error'
      })
    } else {
      this.setState({
        titleHint: '',
        titleState: 'success'
      })
    }
  }

  //检查描述
  preDataDescriptionCheck = e =>{
    if(e.target.value.length >= 50){
      this.setState({
        preDataDescriptionHint: '描述在50字以内',
        preDataDescriptionState: 'error'
      })
    }else {
      this.setState({
        preDataDescriptionHint: '',
        preDataDescriptionState: 'success'
      })
    }
  };
  // 选择学科的id
  chooseSubjectList = value => {
    let that = this
    if (value.length > 0) {
      this.setState({
        chooseSubject: value.map(item => item + ''),
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
      subjects: value
    })
  };
  // 选择学科输入时的检查
  changeSubject = value => {
    if (_.isEmpty(this.state.chooseSubject.length)) {
      this.setState({
        subjectListStatus: 'error',
        subjectListHint: '请选择学科'
      })
    } else {
      this.setState({
        subjectListStatus: 'success',
        subjectListHint: ''
      })
    }
  }
  // 选择vip的id
  chooseVipCoursetList = value => {
    let that = this
    if (value.length > 0) {
      this.setState({
        vipCourse: value.map(item => item + ''),
        vipCourseStatus: 'success',
        vipCourseHint: ''
      })
    } else {
      this.setState({
        vipCourse: value,
        vipCourseStatus: 'error',
        vipCourseHint: '请选择vip课程'
      })
    }
  }
  changeVipCourse = value => {
    if (_.isEmpty(this.state.vipCourse.length)) {
      this.setState({
        vipCourseStatus: 'error',
        vipCourseHint: '请选择vip课程'
      })
    } else {
      this.setState({
        vipCourseStatus: 'success',
        vipCourseHint: ''
      })
    }
  }

  // 检查朋友圈描述
  friendCircleCheck = e => {
    if (e.target.value.length === 0) {
      this.setState({
        friendCircleHint: '朋友圈分享标题不能为空',
        friendCircleState: 'error'
      })
    } else if (e.target.value.length == 20) {
      this.setState({
        friendCircleHint: '字数需在20字以内',
        friendCircleState: 'error'
      })
    } else if (e.target.value.length > 30) {
      this.setState({
        friendCircleHint: '朋友圈分享标题建议少于30字',
        friendCircleState: 'warning'
      })
    } else if (!(e.target.value.indexOf(' ') === -1)) {
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
  }
  // 检查群分享标题
  groupSharingCheck = e => {
    if (e.target.value.length === 0) {
      this.setState({
        groupSharingHint: '群分享标题不能为空',
        groupSharingState: 'error'
      })
    } else if (e.target.value.length == 20) {
      this.setState({
        groupSharingHint: '字数需在20字以内',
        groupSharingState: 'error'
      })
    } else if (!(e.target.value.indexOf(' ') === -1)) {
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
  }
  // 检查群分享描述
  shareDescribeCheck = e => {
    if (e.target.value.length === 0) {
      this.setState({
        shareDescribeHint: '群分享描述不能为空',
        shareDescribeState: 'error'
      })
    } else if (e.target.value.length > 30) {
      this.setState({
        shareDescribeHint: '群分享描述建议少于30字',
        shareDescribeState: 'warning'
      })
    } else if (!(e.target.value.indexOf(' ') === -1)) {
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
  }
  // 上传分享缩略图
  uploadPic = files => {
    if (this.state.uploadThumbnail) {
      let fileReader = new FileReader() // 图片上传，读图片
      let file = files.file // 获取到上传的对象
      let that = this
      fileReader.onload = (function(file) {
        return function(ev) {
          let data = ev.target.result
          let image = new Image()
          image.onload = () => {
            if (parseInt(image.width) === 120 && parseInt(image.height) === 120) {
              that.setState({
                img: ev.target.result,
                thumbnailStatus: 'success'
              })
              requestData(file).then(res => {
                that.setState({
                  shareThumbnails: res.data.key
                })
              })
            } else {
              message.error('图片格式错误，请上传120 * 120像素的图片！')
              that.setState({
                uploadThumbnail: false,
                thumbnailStatus: 'error',
                img: ''
              })
            }
          }
          image.src = data
        }
      })(file)
      fileReader.readAsDataURL(file) // 读取完毕，显示到页面
    }
  }
  // 上传分享缩略图格式检查
  beforeUploadThumbnail = file => {
    if (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') {
      if (file.size > 10068) {
        message.error('图片格式错误，请上传少于10KB的图片！')
        this.setState({
          uploadThumbnail: false,
          thumbnailStatus: 'error',
          img: ''
        })
      } else {
        this.setState({
          uploadThumbnail: true,
          thumbnailStatus: 'success'
        })
      }
    } else {
      this.setState({
        uploadThumbnail: false,
        thumbnailStatus: 'error',
        img: ''
      })
      message.error('格式错误，请上传jpg/jpeg/png格式的图片')
    }
  }
  render() {
    let { content, disableBtn, visible } = this.state
    const { getFieldDecorator } = this.props.form
    const FormItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 16 }
    }
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    )
    const menus = [
      {
        path: '/app/dashboard/analysis',
        name: '首页'
      },
      {
        path: '/app/presaledata/list',
        name: '资料管理'
      },
      {
        path: '',
        name: '新建资料'
      }
    ]
    return (
      <div style={{margin: "0 30px"}} className="edit-course">
        <Form>
          <Card title="基本信息" bordered={null}>
            <FormItem
              className="open-course-form"
              label="资料名称"
              validateStatus={this.state.titleState}
              help={this.state.titleHint}
              {...FormItemLayout}
              hasFeedback
            >
              {getFieldDecorator('title', {
                rules: [{ required: true, message: '资料名称不能为空' }]
              })(<Input placeholder="用户可见，命名要规范，控制在20字以内" onChange={this.titleCheck} />)}
            </FormItem>
            <FormItem
              className="open-course-form subject-list"
              label="所属学科"
              validateStatus={this.state.subjectListStatus}
              help={this.state.subjectListHint}
              {...FormItemLayout}
              hasFeedback
            >
              {getFieldDecorator('subjects', {
                rules: [{ required: true, message: '请选择学科' }],
                initialValue: this.state.subjectsValue
              })(
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="选择学科"
                  getPopupContainer={() => document.querySelector('.subject-list')}
                  onChange={this.chooseSubjectList}
                >
                  {this.state.subjectList && this.state.subjectList.map(value => {
                    return (
                      <Option key={parseInt(value.id)} value={parseInt(value.id)}>
                        {value.name}
                      </Option>
                    )
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem className="open-course-form" validateStatus="" label="描述" validateStatus={this.state.preDataDescriptionState}
                      help={this.state.preDataDescriptionHint} {...FormItemLayout} hasFeedback>
              {getFieldDecorator('description', {
                rules: [{ required: false }, { max: 50, message: '最多允许输入50个字' }]
              })(
                <TextArea
                  rows={3}
                  onChange={this.preDataDescriptionCheck}
                  placeholder={`内部可见，方便销售辨识和选择资料发放给不同意向的人群。控制在50字以内`}
                />
              )}
            </FormItem>
            <FormItem
              className="open-course-form course-list"
              label="对应的VIP课程"
              validateStatus={this.state.vipCourseStatus}
              help={this.state.vipCourseHint}
              {...FormItemLayout}
              hasFeedback
            >
              {getFieldDecorator('courseId', {
                rules: [{ required: false, message: '请选择关联的VIP课程' }],
                initialValue: this.state.courseIdValue
              })(
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="请选择关联的VIP课程，仅用于内部标识"
                  getPopupContainer={() => document.querySelector('.course-list')}
                  onChange={this.chooseVipCoursetList}
                >
                  {this.state.courseList && this.state.courseList.map(value => {
                    return (
                      <Option key={parseInt(value.id)} value={parseInt(value.id)}>
                        {value.name}
                      </Option>
                    )
                  })}
                </Select>
              )}
            </FormItem>
          </Card>
          <Card title="资料详细信息" bordered={null} style={{ marginTop: '24px' }}>
            <p>
              <span style={{ color: '#f5222d' }}>*</span> 资料详情（在文本框可编辑文本、上传视频、上传图片、链接等）
            </p>
            <UEditor ref="ueditor" type="edit" initData={this.state.initData} />
            <input
              onChange={this.uploadCourseThumbnail.bind(this)}
              type="file"
              style={{ display: 'none' }}
              id="pickfiles"
              accept="image/jpeg,image/jpg,image/png"
            />
            {/*<div style={{border: '1px solid rgba(0,0,0,.2)', boxShadow: '0 15px 40px rgba(0,0,0,.2)'}}>*/}
            {/*<UEditor02></UEditor02>*/}
            {/*</div>*/}
          </Card>
          <Card title="微信分享信息" bordered={null} style={{ marginTop: '24px' }}>
            <FormItem
              className="open-course-form"
              label="朋友圈分享标题"
              validateStatus={this.state.friendCircleState}
              help={this.state.friendCircleHint}
              {...FormItemLayout}
              hasFeedback
            >
              {getFieldDecorator('friendCircleTitle', {
                rules: [{ required: true, message: '朋友圈分享标题不能为空' }]
              })(<Input maxLength={20} placeholder="建议20字以内" onChange={this.friendCircleCheck} />)}
            </FormItem>
            <FormItem
              className="open-course-form"
              label="群分享标题"
              validateStatus={this.state.groupSharingState}
              help={this.state.groupSharingHint}
              {...FormItemLayout}
              hasFeedback
            >
              {getFieldDecorator('groupShareTitle', {
                rules: [{ required: true, message: '群分享标题不能为空' }]
              })(<Input maxLength={20} placeholder="建议20字以内" onChange={this.groupSharingCheck} />)}
            </FormItem>
            <FormItem
              className="open-course-form"
              label="分享描述"
              validateStatus={this.state.shareDescribeState}
              help={this.state.shareDescribeHint}
              {...FormItemLayout}
              hasFeedback
            >
              {getFieldDecorator('shareDescription', {
                rules: [{ required: true, message: '分享描述不能为空' }]
              })(<Input maxLength={30} placeholder="建议30字以内" onChange={this.shareDescribeCheck} />)}
            </FormItem>

            <FormItem
              className="open-course-form"
              label="分享缩略图"
              validateStatus={this.state.thumbnailStatus}
              {...FormItemLayout}
              hasFeedback
            >
              {getFieldDecorator('shareCoverImage', {
                rules: [{ required: true, message: '请上传缩略图' }]
              })(
                <div style={{ position: 'relative' }} className="form-item thumbnai-pic">
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    fileList={this.state.fileLists}
                    customRequest={this.uploadPic}
                    beforeUpload={this.beforeUploadThumbnail}
                  >
                    {this.state.img ? <img src={this.state.img} alt="noImg" /> : uploadButton}
                  </Upload>
                  <div className="hint-text">
                    <p style={{ height: '15px' }}>图片尺寸：120 * 120 像素</p>
                    <p style={{ height: '0px' }}>图片格式：大小不超过10KB，不支持GIF格式</p>
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <Button
                      type="default"
                      style={{ width: '100px', textAlign: 'center' }}
                      onClick={this.clickOneUpload}
                    >
                      上传
                    </Button>
                  </div>
                </div>
              )}
            </FormItem>
          </Card>
        </Form>
        <div className="upload-title bottom-btn" style={{ zIndex: 1201}}>
          <Button type="default" style={{ marginRight: '20px'}} onClick={this.onCancel}>
            取消
          </Button>
          <Modal title="提示" visible={visible} onOk={this.handleOk} onCancel={this.handleTipCancel}>
            <p>表单中仍有内容，是否确认取消？</p>
          </Modal>
          <Button disabled={disableBtn || !openAuthor('marketing:materials:manage',this.state.subjectId)} type="primary" onClick={this.onSubmit}>
            提交
          </Button>
        </div>
      </div>
    )
  }
}

const SaleDataEdit = Form.create()(EditSaleData)
export default SaleDataEdit
