import React, { Component } from 'react'
import { Modal, Form, Input, Button, message, Spin } from 'antd'
import { addChannel } from '../../../api/preSaleData'
import QRCode from 'qrcode.react'

const Search = Input.Search
const FormItem = Form.Item
// 取 id -
// let path = window.location.pathname.split('/');
// let materialsId = path[path.length - 1];

let emojiRule = /([\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70-\uDD71\uDD7E-\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01-\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50-\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96-\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF])|(\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F-\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95-\uDD96\uDDA4-\uDDA5\uDDA8\uDDB1-\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB-\uDEEC\uDEF0\uDEF3-\uDEF6])|(\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0])/g

class CustomizedForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      value: '',
      code: '',
      img: '',
      channelTxt: '',
      loading: true,
      hint: 'none',
      disableBtn: false,
      fileList: [],
      visible: true,
      materialsLink: ''
    }
  }

  componentWillReceiveProps(nextProps, props) {
    if (props.materialsLink != nextProps.materialsLink) {
      console.log('materialsLink', nextProps.materialsLink);
      this.setState({ materialsLink: nextProps.materialsLink, loading: false })
    }
  }
  // 下载二维码
  downloadQrcode = () => {
    let qrcode = document.getElementById('qrcode')
    let img = qrcode.toDataURL('image/png')
    let a = document.createElement('a')
    let event = new MouseEvent('click')
    a.download = '二维码' + new Date().getTime() + '.png'
    a.href = img
    a.dispatchEvent(event)
  }

  // 复制链接
  copyLink = () => {
    let input = document.querySelector('#input input')
    input.select()
    document.execCommand('Copy')
    if (input.value !== '') {
      // message.config({top: 350})
      message.success('已复制到剪贴报')
    }
  }
  // 渠道生成点击
  buildChannel = () => {
    const { toggleModal } = this.props
    this.props.form.validateFields((err, values) => {
      !err &&
        addChannel({
          materialsId:parseInt(window.location.pathname.slice(17)),
          name: values.channelName
        }).then(res => {
          let resDatas = res.data
          if (resDatas.code === 0) {
            message.success('渠道已生成！')
            this.setState({
              values: null
            })
            toggleModal()
            this.props.form.setFieldsValue({
              channelName: ''
            })
          } else {
            message.error(resDatas.msg)
          }
        })
    })
  }

  render() {
    const FormItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 16 }
    }
    const { visible, onCancel, onCreate, form, data, id, okText, title, openCourseId, hint, disableBtn } = this.props
    const { getFieldDecorator } = form
    const { materialsLink } = this.state
    console.log('materialsLink', materialsLink)
    return (
      <Modal visible={visible} title={title} okText={okText} onCancel={onCancel} onOk={onCreate} id={id} footer={null} data={data} openCourseId={openCourseId} className="channel-model">
        <div style={{ marginLeft: '40px', display: id === 0 ? 'block' : 'none' }} className="channel">
          <Form>
            <FormItem className="open-course-form" label="渠道名称：" validateStatus={this.state.titleState} help={this.state.titleHint} {...FormItemLayout} hasFeedback>
              {getFieldDecorator('channelName', {
                rules: [{ required: true, message: '渠道名称不能为空' }, { max: 15, message: '名称在15个字以内' }, { whitespace: true, message: '不能有空格' }]
              })(<Input id="channel-input" placeholder="营销号1" />)}
            </FormItem>
            <p style={{ color: '#AEAEAE' }}>可以为每个营销号或者引流的渠道生成不同的渠道链接， 方便后期跟进查找，精细化运营</p>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Button disabled={disableBtn} id="channel-btn" type="primary" onClick={this.buildChannel} className="have-value">
                生成
              </Button>
            </div>
          </Form>
        </div>

        <div className="channel-poster" style={{ display: id !== 0 ? 'block' : 'none' }}>
          <p style={{ display: id === 0 ? 'block' : 'none', fontSize: '10px', marginLeft: '116px', marginTop: '5px' }}>已生成的海报和链接可以在[渠道推广]中下载和复制</p>
          <div style={{ overflow: 'hidden', marginTop: '20px' }}>
            <div
              style={{
                width: '180px',
                height: '320px',
                marginLeft: '40px',
                marginRight: '30px',
                float: 'left'
              }}
            >
              {materialsLink && <QRCode value={materialsLink} id="qrcode" size={180} />}
              {/*<QRCode value={this.state.value === '' ? id : this.state.value} id="qrcode" size={180}/>*/}
              <Spin
                size="large"
                style={{
                  height: '320px',
                  margin: '70px 60px',
                  display: this.state.loading && id === 0 ? 'block' : 'none'
                }}
              />
              {/* <Spin size="large" style={{ height: '320px', margin: '70px 60px', display: loading && id !== 0 ? 'block' : 'none' }} /> */}
              <p
                style={{
                  height: '320px',
                  marginTop: '50px',
                  textAlign: 'center',
                  display: id === 0 ? this.state.hint : hint
                }}
              >
                海报获取失败，关闭弹框后请重新获取
              </p>
              {/* <img style={{ width: '180px' }} id="qrcode" src={id === 0 ? this.state.img : id} alt="" /> */}
            </div>
            <p style={{ marginLeft: '50px', marginTop: '40px', fontSize: '14px' }}>我的专属资料包渠道二维码和链接</p>
            <p style={{ marginLeft: '50px', marginTop: '-10px', fontSize: '14px' }}>微信扫描或者打开链接后可查看资料</p>
            <p
              style={{
                marginLeft: '50px',
                color: '#3a8ee6',
                fontSize: '14px',
                cursor: 'pointer'
                // display: id === 0 ? (this.state.loading ? 'none' : 'block') : loading ? 'none' : 'block'
              }}
              onClick={this.downloadQrcode.bind(this, '二维码')}
            >
              下载二维码
            </p>
            {/* <p
              style={{
                marginLeft: '50px',
                color: '#888',
                fontSize: '14px',
                display: id === 0 ? (this.state.loading ? 'block' : 'none') : loading ? 'block' : 'none'
              }}
            >
              下载海报
            </p> */}
          </div>
          <div style={{ textAlign: 'center' }} id="input">
            {getFieldDecorator('key')(<Search placeholder="网址" enterButton="复制" size="large" onSearch={this.copyLink} style={{ width: '84%', marginTop: '40px', marginBottom: '20px' }} onChange={this.copyLink} className="search" />)}
          </div>
        </div>
      </Modal>
    )
  }
}

const CollectionCreateForm = Form.create()(CustomizedForm)
export default CollectionCreateForm
