import React from 'react'
import {
  Form,
  Input,
  Button,
  message,
  Select,
  Modal,
  Steps,
  Row,
  Col,
  DatePicker, Radio, Checkbox
} from 'antd';
import {formatDateTime} from "../../../utils/filter";
import {comfirmClue, bindingClue} from '../../../api/promotionApi'
import {getSubjectList} from '../../../api/commonApi'
import {setRemark, changeClue} from '../../../api/clueCenterApi'
import moment from 'moment';

const FormItem = Form.Item;
const {TextArea} = Input;
const {confirm} = Modal;
const Option = Select.Option;

class InfoForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      current: 0,
      subjectList: []
    }
  }

  componentDidMount() {
    this.getSubjectListFn()
  };

  componentWillUnmount() {

  };

  // 根据学科ID匹配对应的学科名称
  matchSubject = (dataIndex) => {
    let subjectName = '';
    let subjectLen = this.state.subjectList.length;
    let subjectData = this.state.subjectList;
    // 根据", "将字符串拆成字符串数组
    // let array = dataIndex.split(", ");
    for (let j = 0; j < dataIndex.length; j++) {
      for (let i = 0; i < subjectLen; i++) {
        if (parseInt(dataIndex[j]) === parseInt(subjectData[i].id)) {
          if (subjectName) {
            subjectName += '/' + subjectData[i].name
          } else {
            subjectName = subjectData[i].name
          }
        }
      }
    }
    if (!subjectName) {
      subjectName = '/'
    }
    return subjectName
  };

  getSubjectListFn = () => {
    getSubjectList().then(res => {
      if (res.data.code == 0) {
        this.setState({
          subjectList: res.data.data
        })
      }
    }).catch(err => {
      console.log(err)
    })
  };

  onChangeSteps = (current) => {
    console.log(current, 'current')
  };
  //name 转 id
  changeSelectData = (list, value) => {
    for (let i = 0; i < list.length; i++) {
      if (list[i].value == value) {
        return list[i].key
      }
    }
  };
  contains = (a, obj) => {
    var i = a.length;
    while (i--) {
      if (a[i] === obj) {
        return i;
      }
    }
    return false;
  };
  //基本信息提交
  onBaseSubmit = (e) => {
    e.preventDefault();
    let formItemName = [];
    let sendData = [];
    let data = this.props.baseFormItem;
    for (let i = 0; i < data.length; i++) {
      formItemName.push(data[i].fieldCode);
      sendData.push({
        clueId: this.props.clueId,
        contactId: data[i].contactId,
        customerId: data[i].customerId,
        fieldId: data[i].fieldId,
        dictId: data[i].dictId,
        value: null,
        fieldCode: data[i].fieldCode,
        selectList: data[i].selectValues,
        type: data[i].type
      })
    }

    console.log(this.props,'haichen')
    this.props.form.validateFieldsAndScroll([...formItemName],(err, values) => {
      if (!err) {
        for (let j = 0; j < formItemName.length; j++) {
          for (let k = 0; k < sendData.length; k++) {
            if (formItemName[j] == sendData[k].fieldCode) {
              sendData[k].value = values[formItemName[j]]
            }
          }
        }
        for (let l = 0; l < sendData.length; l++) {
          if (sendData[l].selectList.length > 0) {
            if (typeof (sendData[l].value) == 'string')
              sendData[l].value = this.changeSelectData(sendData[l].selectList, sendData[l].value);
          }
          if (sendData[l].type == 'TIME') {
            if (sendData[l].value._isAMomentObject) {
              sendData[l].value = Math.round(new Date(sendData[l].value).getTime() / 1000)
            }
          }
        }
        for (let i = 0; i < sendData.length; i++) {
          delete sendData[i].selectList;
          delete sendData[i].type;
        }
        let filterArr = sendData.filter(item => item.value !== null);
        changeClue(filterArr).then(res => {
          if (res.data.code == 0) {
            message.success('提交成功！');
          } else {
            message.error('提交失败！');
          }
        }).catch(err => {
          console.log(err)
        })
      }
    })
  };
  //业务信息提交
  onBaseSubmitBuss = (e) => {
    e.preventDefault();
    let formItemName = [];
    let sendData = [];
    let data = this.props.businessFormItem;
    for (let i = 0; i < data.length; i++) {
      formItemName.push(data[i].fieldCode);
      sendData.push({
        clueId: this.props.clueId,
        contactId: data[i].contactId,
        customerId: data[i].customerId,
        fieldId: data[i].fieldId,
        dictId: data[i].dictId,
        value: null,
        fieldCode: data[i].fieldCode,
        selectList: data[i].selectValues,
        type: data[i].type
      })
    }
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        for (let j = 0; j < formItemName.length; j++) {
          for (let k = 0; k < sendData.length; k++) {
            if (formItemName[j] == sendData[k].fieldCode) {
              sendData[k].value = values[formItemName[j]]
            }
          }
        }
        for (let l = 0; l < sendData.length; l++) {
          if (sendData[l].selectList.length > 0) {
            if (typeof (sendData[l].value) == 'string')
              sendData[l].value = this.changeSelectData(sendData[l].selectList, sendData[l].value);
          }
          if (sendData[l].type == 'TIME') {
            if (sendData[l].value._isAMomentObject) {
              sendData[l].value = Math.round(new Date(sendData[l].value).getTime() / 1000)
            }
          }
        }
        for (let i = 0; i < sendData.length; i++) {
          delete sendData[i].selectList;
          delete sendData[i].type;
        }
        let filterArr = sendData.filter(item => item.value !== null);
        changeClue(filterArr).then(res => {
          if (res.data.code == 0) {
            message.success('提交成功！');
          } else {
            message.error('提交失败！');
          }
        }).catch(err => {
          console.log(err)
        })
      }
    })
  };
  onBlurWechatId = (e) => {
    let wechatId = e.target.value;
    if (wechatId !== '' && wechatId !== ' ' && wechatId !== null) {
      let data = {
        id: this.props.xId,
        wechatId: wechatId
      };
      comfirmClue(data).then(res => {
        if (res.data.code == 0) {
          //确认成功
          message.success('线索确认成功！');
        } else if (res.data.code == 10003) {
          //被其他人占用
          Modal.info({
            title: '被占用说明',
            content: (
              <div>
                <p>{`该微信号已被${this.matchSubject(res.data.data.subject)}学科的${res.data.data.sellerName}销售确认过，该线索的确认状态将标记为「被占用」。`}</p>
              </div>
            ),
            onOk() {

            },
          });
        } else if (res.data.code == 10007) {
          //被自己占用
          confirm({
            title: '线索绑定说明',
            content: '该线索号已存在你的个人线索池中，系统认为是同一个用户主体。确定后，将进行线索绑定，完成该用户的数据同步。请确认是否操作?',
            onOk() {
              bindingClue(data).then(res => {
                if (res.data.code == 0) {
                  message.success('绑定成功！');
                } else {
                  message.error('绑定失败！');
                }
              }).catch(err => {
                console.log(err)
              })
            },
            onCancel() {
              console.log('Cancel');
            },
          });
        }
      }).catch(err => {
        console.log(err)
      })
    }
  };
  onRemark = () => {
    let data = {
      clueId: this.props.clueId,
      content: this.props.form.getFieldValue('invoiceRemark'),
      contactId: this.props.objId.contactId,
      customerId: this.props.objId.customerId,
    };
    setRemark(data).then(res => {
      if (res.data.code == 0) {
        message.success('备注成功！');
      } else {
        message.error('备注失败！');
      }
    }).catch(err => {
      console.log(err)
    })
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const {Step, small} = Steps;
    const {labelNames, behavior, baseFormItem, businessFormItem} = this.props;
    const {current} = this.state;
    const FormItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 16},
    };
    return (
      <div className="finace-addbills">
        <div className="ant-drawer-header"
             style={{marginBottom: '15px'}}>基本信息({`XID:${this.props.InfoBoxType == 'myClue' ? this.props.clueId : this.props.xId}`})
        </div>
        <Form className="finace-addbills-form" layout="horizontal">
          {
            labelNames && labelNames.map((label, index) => {
              return <div>
                <p style={{display:label.code == 'd-wechatId' ? 'block': 'none',marginBottom:'0',paddingLeft:'125px',fontSize:'12px',boxSizing:'borderBox'}}>注意：须在成为好友后填写微信号进行确认</p>
                <FormItem label={label.name} {...FormItemLayout} hasFeedback key={label.id}>
                  {getFieldDecorator(`info${index}`, {
                    rules: [{required: label.required == 0 ? false : true, message: label.message}],
                    initialValue: label.value
                  })(
                    <Input
                      disabled={label.disabled}
                      maxLength={20}
                      placeholder={label.placeholder}
                      onChange={this.titleCheck}
                      onBlur={this.onBlurWechatId}
                    />
                  )}
                </FormItem>
              </div>
            })
          }
          {
            baseFormItem && baseFormItem.map(label => {
              if (label.type == 'TEXT') {
                return <FormItem label={label.name} {...FormItemLayout} hasFeedback key={label.fieldId}>
                  {getFieldDecorator(label.fieldCode, {
                    rules: [{required: label.required === 0 ? false : true, message: `请输入${label.name}`}],
                    initialValue: label.value
                  })(
                    <Input
                      disabled={label.disabled == 0 ? true : false}
                      maxLength={20}
                      placeholder={label.placeholder}
                    />
                  )}
                </FormItem>
              } else if (label.type == 'SELECT') {
                return <FormItem label={label.name} {...FormItemLayout} hasFeedback key={label.fieldId}>
                  {getFieldDecorator(label.fieldCode, {
                    rules: [{required: label.required === 0 ? false : true, message: `请输入${label.name}`}],
                    initialValue: label.value
                  })(
                    <Select
                      disabled={label.disabled == 0 ? true : false}
                      placeholder='请选择'
                      style={{width: '100%'}}
                    >
                      {label.selectValues && label.selectValues.map((value, index) => <Option key={index}
                                                                        value={value.key}>{value.value}</Option>)}
                    </Select>
                  )}
                </FormItem>
              } else if (label.type == 'CHECKBOX') {
                return <FormItem label={label.name} {...FormItemLayout} hasFeedback key={label.fieldId}>
                  {getFieldDecorator(label.fieldCode, {
                    rules: [{required: label.required === 0 ? false : true, message: `请输入${label.name}`}],
                    initialValue: label.value
                  })(
                    <Checkbox.Group style={{width: '100%'}} disabled={label.disabled == 0 ? true : false}
                    >
                      <Row>
                        <Col span={8}>
                          <Checkbox value="A">A</Checkbox>
                        </Col>
                        <Col span={8}>
                          <Checkbox disabled value="B">
                            B
                          </Checkbox>
                        </Col>
                        <Col span={8}>
                          <Checkbox value="C">C</Checkbox>
                        </Col>
                        <Col span={8}>
                          <Checkbox value="D">D</Checkbox>
                        </Col>
                        <Col span={8}>
                          <Checkbox value="E">E</Checkbox>
                        </Col>
                      </Row>
                    </Checkbox.Group>
                  )}
                </FormItem>
              } else if (label.type == 'RADIOBOX') {
                return <FormItem label={label.name} {...FormItemLayout} hasFeedback key={label.fieldId}>
                  {getFieldDecorator(label.fieldCode, {
                    rules: [{required: label.required === 0 ? false : true, message: `请输入${label.name}`}],
                    initialValue: label.value
                  })(
                    <Radio.Group
                      disabled={label.disabled == 0 ? true : false}
                    >
                      <Radio value="a">item 1</Radio>
                      <Radio value="b">item 2</Radio>
                      <Radio value="c">item 3</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
              } else if (label.type == 'TIME') {
                return <FormItem label={label.name} {...FormItemLayout} hasFeedback key={label.fieldId}>
                  {getFieldDecorator(label.fieldCode, {
                    rules: [{required: label.required === 0 ? false : true, message: `请输入${label.name}`}],
                    initialValue: moment((Number(label.value)) * 1000)
                  })(
                    <DatePicker
                      showTime={{format: 'HH:mm'}}
                      format="YYYY-MM-DD HH:mm"
                      placeholder="Select Time"
                    />
                  )}
                </FormItem>
              }
            })
          }
          <div style={{
            textAlign: 'right',
            display: this.props.InfoBoxType == 'myClue' ? 'block' : 'none',
            marginBottom: '15px'
          }}>
            <Button onClick={this.onBaseSubmit} type="primary">确认</Button>
          </div>
        </Form>
        <Form className="finace-addbills-form" layout="horizontal">
          <div style={{display: this.props.InfoBoxType == 'myClue' ? 'block' : 'none', marginBottom: '15px'}}
               className="ant-drawer-header">业务信息
          </div>
          {
            businessFormItem && businessFormItem.map(label => {
              if (label.type == 'TEXT') {
                return <FormItem label={label.name} {...FormItemLayout} hasFeedback key={label.fieldId}>
                  {getFieldDecorator(label.fieldCode, {
                    rules: [{required: label.required === 0 ? false : true, message: `请输入${label.name}`}],
                    initialValue: label.value
                  })(
                    <Input
                      disabled={label.disabled == 0 ? true : false}
                      maxLength={20}
                      placeholder={label.placeholder}
                    />
                  )}
                </FormItem>
              } else if (label.type == 'SELECT') {
                return <FormItem label={label.name} {...FormItemLayout} hasFeedback key={label.fieldId}>
                  {getFieldDecorator(label.fieldCode, {
                    rules: [{required: label.required === 0 ? false : true, message: `请输入${label.name}`}],
                    initialValue: label.value
                  })(
                    <Select
                      disabled={label.disabled == 0 ? true : false}
                      placeholder='请选择'
                      style={{width: '100%'}}
                    >
                      {label.selectValues && label.selectValues.map((value, index) => <Option key={index}
                                                                        value={value.key}>{value.value}</Option>)}
                    </Select>
                  )}
                </FormItem>
              } else if (label.type == 'CHECKBOX') {
                return <FormItem label={label.name} {...FormItemLayout} hasFeedback key={label.fieldId}>
                  {getFieldDecorator(label.fieldCode, {
                    rules: [{required: label.required === 0 ? false : true, message: `请输入${label.name}`}],
                    initialValue: label.value
                  })(
                    <Checkbox.Group style={{width: '100%'}} disabled={label.disabled == 0 ? true : false}
                    >
                      <Row>
                        <Col span={8}>
                          <Checkbox value="A">A</Checkbox>
                        </Col>
                        <Col span={8}>
                          <Checkbox disabled value="B">
                            B
                          </Checkbox>
                        </Col>
                        <Col span={8}>
                          <Checkbox value="C">C</Checkbox>
                        </Col>
                        <Col span={8}>
                          <Checkbox value="D">D</Checkbox>
                        </Col>
                        <Col span={8}>
                          <Checkbox value="E">E</Checkbox>
                        </Col>
                      </Row>
                    </Checkbox.Group>
                  )}
                </FormItem>
              } else if (label.type == 'RADIOBOX') {
                return <FormItem label={label.name} {...FormItemLayout} hasFeedback key={label.fieldId}>
                  {getFieldDecorator(label.fieldCode, {
                    rules: [{required: label.required === 0 ? false : true, message: `请输入${label.name}`}],
                    initialValue: label.value
                  })(
                    <Radio.Group
                      disabled={label.disabled == 0 ? true : false}
                    >
                      <Radio value="a">item 1</Radio>
                      <Radio value="b">item 2</Radio>
                      <Radio value="c">item 3</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
              } else if (label.type == 'TIME') {
                return <FormItem label={label.name} {...FormItemLayout} hasFeedback key={label.fieldId}>
                  {getFieldDecorator(label.fieldCode, {
                    rules: [{required: label.required === 0 ? false : true, message: `请输入${label.name}`}],
                    initialValue: moment((Number(label.value)) * 1000)
                  })(
                    <DatePicker
                      showTime={{format: 'HH:mm'}}
                      format="YYYY-MM-DD HH:mm"
                      placeholder="Select Time"
                    />
                  )}
                </FormItem>
              }
            })
          }
          <div style={{
            textAlign: 'right',
            margin: '15px 0',
            display: this.props.InfoBoxType == 'myClue' ? 'block' : 'none'
          }}>
            <Button onClick={this.onBaseSubmitBuss} type="primary">确认</Button>
          </div>
          <div className="ant-drawer-header">备注</div>
          <div>
            <div style={{display: this.props.InfoBoxType == 'myClue' ? 'block' : 'none'}}>
              {
                this.props.InfoBoxType == 'myClue' &&
                this.props.markList && this.props.markList.map((item, index) => {
                  return <div key={index} style={{boxSizing: 'border-box', padding: '0 20px', marginBottom: '15px'}}>
                    <p style={{marginBottom: '0px'}}>{formatDateTime(item.time)}</p>
                    <p style={{marginBottom: '0px'}}>{item.content}</p>
                  </div>
                })
              }
            </div>
            <FormItem label="备注" {...FormItemLayout} style={{marginTop: '20px', height: 'auto'}} key="99" hasFeedback>
              {getFieldDecorator('invoiceRemark', {
                rules: [{required: false, message: '备注'}]
              })(
                <TextArea
                  rows={4}
                />
              )}
            </FormItem>
          </div>
          <div style={{textAlign: 'right', marginTop: '20px', marginBottom: '10px'}}>
            <Button onClick={this.onRemark} type="primary">确认</Button>
          </div>
          <div className="ant-drawer-header">动态</div>
          <div className="info-step">
            <Steps size={small} current={current} onChange={this.onChangeSteps} direction="vertical">
              {
                behavior && behavior.map(beh => {
                  return <Step title={formatDateTime(beh.time)} description={beh.description}/>
                })
              }
            </Steps>
          </div>
        </Form>
      </div>
    )
  }
}

const DrawerInfoForm = Form.create()(InfoForm);
export default DrawerInfoForm
// export default InfoForm
