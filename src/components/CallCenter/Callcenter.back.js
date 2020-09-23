import React from 'react'
import {Modal, Button,Form,Input,Progress} from 'antd'
import {formatDateTime} from "../../api/commonApi";
import Cit from '../../utils/cticloud'
const FormItem = Form.Item;
export default class Callcenter extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      callVisible: false,
      disabled: false,
      status: 'active',
      hours: 0,
      minute: 0,
      second: 0,
      callOn: false
    }
  }
  componentDidMount(){
    console.log('Cit',Cit)
  }
  handleCallClick = (e) => {
    this.setState({
      callVisible: true
    })
  }
  handleCancel = () => {
    this.setState({
      callVisible: false
    })
  }

  telCheck = (e) => {
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
    Cit.previewOutcall('15810885650')
    const that = this
    this.setState({
      disabled:true
    })
  }
  // <Button onClick={this.handleCallClick}>电话</Button>


  render() {
    const {second, minute, hours} = this.state
    const FormItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 25},
    };
    const dataTime = new Date()
    return (
      <div>
          <Button onClick={this.handleCallClick}>电话</Button>
        <Modal
          title="电话"
          className="Add-modals"
          confirmText="确定"
          cancelText="取消"
          visible={this.state.callVisible}
          destroyOnClose={true}
          style={{top: '80px',width: '400px'}}
          onCancel={this.handleCancel}
        >
          <div>
          <Form  layout="inline">
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
          </Form>

          </div>
        </Modal>
      </div>

    )
  }
}
