import React from "react";
// import "./AddInvoice.less";
import {
  Form,
  Input,
  Select,
  Radio
} from 'antd';
import { getOrderDetail } from "../../api/financeApi";
import { getDefaultAllot, getEngineDetail, getAllotDrop, campaignEdit } from "../../api/promotionApi";
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
      platform: 'BAIDU',
      platformEdit: undefined,
      platformList: [],
      editCampaign: {},
      flags: this.props.modalFlag,
      allotId: this.props.allotId,
      allotName: '',
      campaignCode: this.props.campaignCode,
      defaultAllot: '',
      campaignId: this.props.campaignId,
      platList: {
        "BAIDU": '百度',
        "FRIENDS": '朋友圈',
        "WECHAT": '微信',
        "TOUTIAO": '今日头条'
      },
      subjects: {
        "1": "web",
        "2": "java",
        "3": "ptthon",
        "4": ".net",
        "5": "ai"
      }
    };
  }

  componentDidMount() {
    const { flags } = this.state
    // this.getEngineListFn()
    if (flags === 'promotion') {
      this.getPlatformListFn()
      this.getSubjectListFn()
    } else if (flags === 'engine') {
      this.getDefaultAllotFn()
      this.getAllotDropFn()

    } else if (flags === 'promotionEdit') {
      this.campaignEditFn()
      this.getPlatformListFn()
      this.getSubjectListFn()
    }
  };


  campaignEditFn = () => {
    const { campaignId } = this.state
    campaignEdit(campaignId).then(res => {
      if (res.data.code === 0) {
        this.setState({
          editCampaign: res.data.data.data,
          platformEdit: res.data.data.data.platform
        })
      }
    })
  }

  getPlatformListFn = () => {
    getPlatformList().then(res => {
      if (res.data.code === 0) {
        this.setState({
          platformList: res.data.data
        })
      }
    })
  }

  getDefaultAllotFn = () => {
    const { campaignCode } = this.state
    getDefaultAllot(campaignCode).then(res => {
      if (res.data.code == 0) {
        this.setState({
          defaultAllot: res.data.data
        })
      } else if (res.data.code === 10001) {
        this.setState({
          defaultAllot: ''
        })
      }
    }).then(() => {
      this.engineListFn()
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


  chooseEngine = (value) => {
    const that = this
    getEngineDetail(value).then(res => {
      if (res.data.code === 0) {
        that.setState({
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

  engineListFn = () => {

    const { engineList, defaultAllot } = this.state
    const that = this
    if (defaultAllot !== null) {
      engineList && engineList.map((item, index) => {
        if (engineList[index].id == defaultAllot) {
          that.chooseEngine(engineList[index].id)
          that.setState({
            allotName: engineList[index].id
          })
          return
        }
      })
    }
  }

  titleCheck = (value) => {
    console.log(value, 'titlevalue')
  }

  render() {
    const { campaignCode, engineDetail, engineList, platformList, subjectSelect, editCampaign } = this.state;
    console.log(editCampaign, 'platformList')
    const { modalFlag, getRadioFn, platformId } = this.props;
    const { getFieldDecorator } = this.props.form;
    const FormItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 16 },
    };
    let span = null;
    if (engineDetail.type === 0) {
      span = <span>顺序分配</span>
    } else if (engineDetail.type === 1) {
      span = <span>随机分配</span>
    } else if (engineDetail.type === 2) {
      span = <span>权重分配</span>
    }

    console.log(campaignCode, 'allotName345678')
    return (
      <div className="finace-addbills">
        <Form className="finace-addbills-form" layout="horizontal">
          {
            modalFlag === "promotion" && <div><FormItem label="推广平台" {...FormItemLayout} hasFeedback>
              <Radio.Group onChange={getRadioFn} defaultValue={platformId}>
                {
                  platformList && platformList.map(item => {
                    return <Radio key={`palt${item.platform}`} value={item.platform}>{item.platformName}</Radio>
                  })
                }
              </Radio.Group>
            </FormItem>
              {
                platformList && platformList.map(plat => {
                  return platformId === plat.platform && plat.platformAttribute.map(detail => {
                    return <FormItem key={`detail${detail.id}`} label={detail.name} {...FormItemLayout} hasFeedback>
                      {getFieldDecorator(`${detail.attribute}-${detail.id}`, {
                        rules: [{ required: detail.required === 1 ? true : false, message: `${detail.name}不能为空` }],
                      })(
                        <Input maxLength={20} placeholder={`请填写${detail.name}`}
                          onChange={this.titleCheck} />
                      )}
                    </FormItem>
                  })
                })
              }
              <FormItem label="推广名称" {...FormItemLayout} hasFeedback>
                {getFieldDecorator('promoname', {
                  rules: [{ required: true, message: '推广名称不能为空' }],
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
                  })(
                    <Select
                      showSearch
                      placeholder="请选择本次推广对应的学科(单选)"
                      onChange={this.chooseOrderNum}
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      getPopupContainer={() => document.getElementById('select-subjects')}
                    >
                      {subjectSelect ? subjectSelect.map(value => <Option key={`subject${value.id}`} value={value.id}>{value.name.toString()}</Option>) : null}
                    </Select>
                  )}
                </FormItem>
              </div>

            </div>
          }

          {
            modalFlag === "engine" &&
            <div>
              <div id="select-engine" className="select-orderNumber">
                <FormItem key='engineVals' label="选择分配引擎"
                  validateStatus={this.state.orderEngine}
                  {...FormItemLayout} hasFeedback>
                  {getFieldDecorator('engine', {
                    rules: [{ required: true, message: '请选择分配引擎' }],
                    initialValue: this.state.defaultAllot
                  })(
                    <Select
                      showSearch
                      placeholder="选择任一可用的分配引擎"
                      onChange={this.chooseEngine}
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      getPopupContainer={() => document.getElementById('select-engine')}
                    >
                      {engineList && engineList.length > 0 ? engineList.map(value => <Option value={value.id}>{value.name.toString()}</Option>) : null}
                    </Select>
                  )}
                </FormItem>
              </div>
              <div className="orderdetail" style={{ display: this.state.engineDetail.names ? 'block' : 'none' }}>
                <div>
                  <span className="orderdetail-left">销售人员有：</span>
                  {
                    engineDetail.names && engineDetail.names.map(name => {
                      return <span key={`name${name}`}>{name}  </span>
                    })
                  }

                </div>
                <div>
                  <span className="orderdetail-left">分配规则是：</span>
                  {span}
                </div>
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
