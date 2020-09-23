import React from 'react'
import { Modal, Form, message } from 'antd'
import './common.less'
import { logIn } from '../../api/callcenter'
import Cit from '../../utils/cticloud'
import PropTypes from 'prop-types'
const FormItem = Form.Item
export default class CallCenter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      callVisible: false,
      phone: Number,
      realMobile: Number,
      disabled: false,
      status: 'active',
      hours: 0,
      minute: 0,
      second: 0,
      callOn: false,
      callParams: '',
      isLogin: false
    }
  }
  static propTypes = {
    callVisible: PropTypes.bool,
    phone: PropTypes.number,
    onChangeStatus: PropTypes.func
  }

  static defaultProps = {
    callVisible: false,
    onChangeStatus: () => {}
  }

  componentWillMount() {
    this.logInFn()
  }

  logInFn = () => {
    logIn().then(res => {
      if(Number(res.data.code) === 10001) {
        message.error(res.data.msg);
        this.setState({
          isLogin: true
        })
      }
      this.setState({ callParams: res.data.data })
    })
  }

  handleCallClick = e => {
    this.setState({
      callVisible: true
    })
  }

  toggleCallVisible = (phone, realMobile) => {
    this.logInFn()

    if(this.state.isLogin){
      return
    }else {
      this.setState({
        callVisible: !this.state.callVisible,
        phone: phone,
        realMobile: realMobile
      })
    }
  }

  handleCancel = () => {
    // this.props.onChangeStatus()
    this.setState({
      callVisible: false
    })
  }

  telCheck = e => {
    console.log(e.target.value)
  }

  startTimer = () => {
    this.setState({
      callOn: true
    })
  }

  onHungUp = () => {
    this.setState({
      callOn: false
    })
  }

  onTelCall = () => {
    // Cit.previewOutcall('15810885650')
    const that = this
    this.setState({
      disabled: true
    })
  }
  // <Button onClick={this.handleCallClick}>电话</Button>

  render() {
    const { second, minute, hours, callVisible, phone, realMobile } = this.state
    const FormItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 25 }
    }
    const dataTime = new Date()
    // console.log('phone', phone)
    // let phone = '15810885650'
    const params = ''
    return (
      <div className="callcenter-box" id="callcenterbox">
        {/* <Button onClick={this.handleCallClick}>电话</Button> */}
        <Modal
          title="电话"
          className="Add-modals-callcenter"
          // confirmText="确定"
          cancelText="关闭"
          visible={callVisible}
          destroyOnClose={true}
          style={{ top: '80px', width: '400px' }}
          onCancel={this.handleCancel}
          onOk={this.handleCancel}
          mask={false}
          maskClosable={false}
          wrapClassName="callcenterbox"
        >
          <div>
            <iframe
              src={
                '/cticlound?phone=' +
                phone +
                '&realMobile=' +
                realMobile +
                '&params=' +
                JSON.stringify(this.state.callParams)
              }
              width="100%"
              height="100%"
            ></iframe>
            注意：点关闭弹窗 就会挂断
            {/* <Form  layout="inline">
            <FormItem label="手机" hasFeedback>
              <Input
                maxLength={20}
                onChange={this.telCheck}
              />
            </FormItem>
            <FormItem {...FormItemLayout}>
              <Progress percent={100} showInfo={false} size="small" status={this.state.status} />
            </FormItem>
            <FormItem {...FormItemLayout}>
              <Button type="primary" disabled={this.state.disabled} onClick={this.onTelCall}>通话</Button>
              <Button onClick={this.onHungUp}>挂断</Button>
            </FormItem>
            <FormItem>
              <p>{hours}时{minute}分{second}秒</p>
            </FormItem>
          </Form> */}
          </div>
        </Modal>
      </div>
    )
  }
}
