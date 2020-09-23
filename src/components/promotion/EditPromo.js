import React from "react";
// import "./AddInvoice.less";
import {
  Form,
  Input,
  Select,
  Radio
} from 'antd';
import { getOrderDetail } from "../../api/financeApi";
import { getEngineDetail, getAllotDrop } from "../../api/promotionApi";
import { getPlatformList, getSubjectList } from "../../api/commonApi";

const FormItem = Form.Item;
const Option = Select.Option;

class AddPromo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderDetail: {},  //搜索订单后的详细信息
      orderDetailVisible: false,
      website: false,
      engineDetail: {},
      engineList: [],
      platform: '',
      platformEdit: undefined,
      platformList: [],
      editCampaign: {},
      subjectDefaultVal: '', // 学科默认值
      campaignDefaultVal: '', // 推广名称默认值
      allotId: this.props.allotId,
      campaignId: this.props.campaignId,
      platList: {
        "BAIDU": '百度',
        "FRIENDS": '朋友圈',
        "WECHAT": '微信',
        "TOUTIAO": '今日头条'
      }
    };
  }

  componentDidMount() {
    // this.campaignEditFn()
    this.getPlatformListFn()
    this.getSubjectListFn()

  };

  componentWillReceiveProps(nextProps) {
    const { editCam } = nextProps
    this.setState({
      platform: editCam.platform,
      subjectDefaultVal: editCam.subjects,
      campaignDefaultVal: editCam.name
    })
  }

  // 获取学科
  getSubjectListFn = () => {
    getSubjectList().then(res => {
      if (res.data.code === 0) {
        this.setState({
          subjectSelect: res.data.data
        })
      }
    })
  }

  componentWillMount() {

  };


  getPlatformListFn = () => {
    getPlatformList().then(res => {
      if (res.data.code === 0) {
        this.setState({
          platformList: res.data.data
        })
      }
    })
  }

  // 选择推广学科
  chooseOrderNum = (value) => {
    console.log(value);
    getOrderDetail(value).then(res => {
      if (res.data.code == 0) {
        console.log(res.data.data);
        this.setState({
          orderDetail: res.data.data,
          orderDetailVisible: true
        })
      }
    }).catch(err => {
      console.log(err)
    })
  };


  chooseEngine = (value) => {
    getEngineDetail(value).then(res => {
      if (res.data.code === 0) {
        this.setState({
          engineDetail: res.data.data
        })
      }
    }).catch(err => {
      console.log(err)
    })
  }
  // 推广平台
  onChangeRadio = (e) => {
    console.log(e.target.value)
    this.props.form.resetFields();
    this.setState({
      platform: e.target.value
    })
  }
  onEditRadio = (e) => {
    this.props.form.resetFields();
    console.log()
    this.setState({
      platformEdit: e.target.value
    })
  }

  getAllotDropFn = () => {
    getAllotDrop().then(res => {
      if (res.data.code === 0) {
        this.setState({
          engineList: res.data.data
        })
      }
    })
  }

  titleCheck = (value) => {
    console.log(value, 'titlevalue')
  }

  rerdenItemValue = (id, list) => {
    for (let i = 0; i < list.length; i++) {
      if (list[i].platformAttributeId == id) {
        return list[i].platformValue
      }
    }
  }

  subjectNameToId = (id) => {
    let data = this.props.subjectList;
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == id) {
        return data[i].name
      }
    }
  }

  render() {
    const { platform, engineDetail, platformList, subjectSelect } = this.state;

    const { editCam } = this.props;
    const { getFieldDecorator } = this.props.form;
    const FormItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 16 },
    };
    if (engineDetail.type === 0) {
    } else if (engineDetail.type === 1) {
    } else if (engineDetail.type === 2) {
    }




    platformList.map(item => {
      if (item.platform === platform) {
      }
    })
    return (
      <div className="finace-addbills">
        <Form className="finace-addbills-form" layout="horizontal">
          {
            <div><FormItem label="推广平台" {...FormItemLayout} hasFeedback>
              <Radio.Group onChange={this.onChangeRadio}>
                {
                  platformList && platformList.map(item => {
                    return <Radio key={`plat${item.platform}`} checked={item.platform === platform} value={item.platform}>{item.platformName}</Radio>
                  })
                }
              </Radio.Group>
            </FormItem>
              {
                platformList && platformList.map(plat => {
                  if (editCam.platform == plat.platform) {
                    return platform === plat.platform && plat.platformAttribute.map(detail => {
                      return <FormItem label={detail.name} {...FormItemLayout} hasFeedback>
                        {getFieldDecorator(`${detail.attribute}-${detail.id}`, {
                          rules: [{ required: detail.required === 1 ? true : false, message: `${detail.name}不能为空` }],
                          initialValue: this.rerdenItemValue(detail.id, editCam.campaignPlanList)
                        })(
                          <Input maxLength={20} placeholder={`请填写${detail.name}`}
                            onChange={this.titleCheck} />
                        )}
                      </FormItem>
                    })
                  } else {
                    return platform === plat.platform && plat.platformAttribute.map(detail => {
                      return <FormItem label={detail.name} {...FormItemLayout} hasFeedback>
                        {getFieldDecorator(`${detail.attribute}-${detail.id}`, {
                          rules: [{ required: detail.required === 1 ? true : false, message: `${detail.name}不能为空` }],
                        })(
                          <Input maxLength={20} placeholder={`请填写${detail.name}`}
                            onChange={this.titleCheck} />
                        )}
                      </FormItem>
                    })
                  }
                })
              }
              <FormItem label="推广名称" {...FormItemLayout} hasFeedback>
                {getFieldDecorator('promoname', {
                  rules: [{ required: true, message: '推广名称不能为空' }],
                  initialValue: this.state.campaignDefaultVal
                })(
                  <Input maxLength={50} placeholder="请填写推广名称"
                    onChange={this.titleCheck} />
                )}
              </FormItem>
              <div id="select-subjects" className="select-orderNumber">
                <FormItem key='subjectVals' label="学科"
                  validateStatus={this.state.orderNumberState}
                  help={this.state.orderNumberHint} {...FormItemLayout} hasFeedback>
                  {getFieldDecorator('subjects', {
                    rules: [{ required: true, message: '请选择学科' }],
                    initialValue: this.subjectNameToId(this.state.subjectDefaultVal)
                  })(
                    <Select
                      showSearch
                      placeholder="请选择本次推广对应的学科(单选)"
                      onChange={this.chooseOrderNum}
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      getPopupContainer={() => document.getElementById('select-subjects')}
                    >
                      {subjectSelect ? subjectSelect.map(value => <Option value={value.id}>{value.name.toString()}</Option>) : null}
                    </Select>
                  )}
                </FormItem>
              </div>

            </div>
          }
        </Form>
      </div>
    )
  }
}
const CollectionCreateForm = Form.create()(AddPromo);
export default CollectionCreateForm;
