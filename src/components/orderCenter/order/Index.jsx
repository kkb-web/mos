import React, { Component } from "react";
import "./Index.less";
import {
  Button,
  Card,
  Modal,
  Pagination,
  message,
  LocaleProvider,
  Col,
  Select,
  Row,
  Input, DatePicker
} from "antd";
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import { getToken, priceType } from "../../../utils/filter";
import {
  getOrderList,
  getPreSignUpTab,
  getBillStetsForm,
  getSignUpTab,
  AddOfflineOrder,
  getTrackNameSelect,
  getCourseSelect,
  geAddCanbackDetail,
  AddCanbacksubmit,
  refundSubmit,
  getClass
} from "../../../api/orderCenterApi";
import { getReceivableDetail, getReceivableList, getRefundList } from '../../../api/financeApi'
import { connect } from "../../../utils/socket";
import FormTable from "./FormTable";
import AddOrder from "./AddOrder"
import RefundModal from './RefundModal'
import AddMoneyBack from './AddMoneyBack'
import AlreadyPayTab from './alreadyPayFormTable'
import BillStateTab from './billStateFormTable'
import MoneyBackTab from './moneyBackFormTable'
import Drawer from './Drawer'  //  新增报名表
import { getUserList } from "../../../api/marketApi";
import { getOrderUserDetail } from "../../../api/userCenterApi";


const Option = Select.Option;
const { RangePicker } = DatePicker;

let customCondition = {};
let applyData = {
  size: 40,
  current: 1,
  ascs: [],
  descs: ['createTime'],
  condition: customCondition
};

let params = {
  size: 100,
  current: 1,
  ascs: [],
  descs: ['execTime'],
  condition: {
    "business": "VIPCOURSE"
  }
};

export default class FinanceBill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      dataAll: '',                      //列表总数据
      dataSource: [],            //列表表单数据
      Visible: false,              //添加订单modal
      refundVisible: false,
      moneyBackVisible: false,
      moneyBackDetailVisible: false,
      alreadyPayVisible: false,
      billStateVisible: false,
      signUpTabVisible: false,
      BillTypeSelect: [],
      OrderNumberSelect: [],
      addOrderChildData: {},    //新增订单子元素信息，
      refundId: '',                    //回款id
      refundDetail: {},            //回款信息
      backTypeSelect: [],          //新增回款回款类型下拉
      payTypeSelect: [],            //新增回款回款方式下拉
      alreadyPayDataSource: [],  //已付金额表格数据
      alreadyPayData: [],              //已付金额所有数据
      billStateDataSource: [],
      moneyBackDetailDataSource: [],
      previewVisible: false,//预览图片
      previewImage: '',
      signUpImg: '',          //报名表图片
      disableBtn: false,
      resetBtn: false,
      searchValue: '',
      addcanBackMoneyDetail: {},
      keyList: [],
      amountDetail: {},
      moneyBackDestroy: true,
      addOrderDestroy: true,
      addOrderBtnState: false,
      refundBtnState: false,
      receivableBtnState: false,
      orderTypeList: [
        { key: 0, value: '线上订单' },
        { key: 1, value: '后台订单' }
      ],
      orderStatusList: [
        { key: 0, value: '待处理' },
        { key: 1, value: '处理中' },
        { key: 2, value: '已完成' },
        { key: 3, value: '已超时' },
        { key: 4, value: '已退款' },
        { key: 5, value: '部分退款' },
        { key: 6, value: '已取消' }
      ],
      sellerList: [],
      orderTypeValue: undefined,
      orderStatusValue: undefined,
      orderDate: undefined,
      sellerValue: undefined,
      courseTypeValue: undefined,
      orderId: this.props.match.params.orderId,
      id: this.props.match.params.id,
      getDetail: [], // 报名表信息
      modalVisibal: false, // 右侧弹出框
      courseId: undefined,
      courseArr: [],
      classId: undefined,
      tableName: ''
    };
  }

  // 获取销售下拉
  getSellerList = () => {
    getUserList().then(res => {
      this.setState({
        sellerList: res.data.data
      })
    })
  };

  componentDidMount() {
    this.getSellerList();
    this.getAllOrderList();
    this.getBillTypeSelectFn();
    this.getOrderNumberSelectFn();
    // 链接websocket
    connect(getToken('username'));
    // end
  };

  componentWillUnmount() {
    this.setState({
      resetBtn: true,
      searchValue: null,
      loading: true,
      orderTypeValue: undefined,
      orderStatusValue: undefined,
      orderDate: undefined,
      sellerValue: undefined,
      // courseTypeValue:undefined
    });
    customCondition.search = null;
    customCondition.startTime = null;
    customCondition.endTime = null;
    customCondition.sellerId = null;
    customCondition.type = null;
    customCondition.orderStatus = null
  };

  //新增订单获取表单信息
  getprosState = (data) => {
    this.setState({
      addOrderChildData: data
    })
  };

  //获取回款弹窗的图片key
  getKeyList = (data) => {
    let Arr = [];
    for (let i = 0; i < data.length; i++) {
      Arr.push(data[i].uid)
    }
    this.setState({
      keyList: Arr
    })
  };

  //获取订单中心列表
  getAllOrderList = () => {
    getOrderList(applyData).then(res => {
      if (res.data.code == 0) {
        this.setState({
          dataSource: res.data.data.records,
          dataAll: res.data.data,
          loading: false,
          disableBtn: false,
          resetBtn: false
        })
      }
    }).catch(err => {
      this.setState({
        loading: false,
      })
    })
  };

  //新增线下订单
  onSubmitFormOrder = () => {
    let that = this;
    this.refs.btSubmit.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // console.log(Math.round(new Date(values.invoiceTime._d).getTime() / 1000))
        //子表单内的班次信息
        let addorderChildData = this.state.addOrderChildData;
        let params = {
          courseId: addorderChildData.courseId,
          courseCode: addorderChildData.courseCode,
          classId: addorderChildData.classId,
          itemId: addorderChildData.itemId,
          itemSkuId: addorderChildData.itemSkuId,
          price: addorderChildData.classPrice,
          discount: values.discountPrice ? parseFloat(values.discountPrice) : 0,
          trackId: parseInt(values.classUser, 10),
          remark: values.invoiceRemark ? values.invoiceRemark : null
        };
        that.setState({
          addOrderBtnState: true
        });
        //添加成功后关闭添加modal，打开回款modal
        AddOfflineOrder(params).then(res => {
          if (res.data.code == 0) {
            message.success('提交成功')
            that.handleCancel()
            that.moneyBackFn(res.data.data.outOrderId)
            applyData.current = 1;
            that.getAllOrderList();
          } else {
            message.error('提交失败')
          }
          that.setState({
            addOrderBtnState: false
          });
        }).catch(err => {
          that.setState({
            addOrderBtnState: false
          });
        })
      }
    });
  };

  //上课学员下拉
  getBillTypeSelectFn = () => {
    getTrackNameSelect().then(res => {
      if (res.data.code == 0) {
        this.setState({
          BillTypeSelect: res.data.data
        })
      }
    }).catch(err => {
      console.log(err)
    })
  };

  //vip课程下拉
  getOrderNumberSelectFn = () => {
    getCourseSelect().then(res => {
      if (res.data.code == 0) {
        this.setState({
          OrderNumberSelect: res.data.data
        })

      }
    }).catch(err => {
      console.log(err)
    })
  };

  //新增按钮
  addBillBtn = () => {
    this.setState({
      Visible: true,
      addOrderDestroy: false
    });
  };

  //新增modal取消
  handleCancel = () => {
    this.setState({
      Visible: false,
      addOrderDestroy: true
    });
  };

  //退款modalok
  refundOk = () => {
    let that = this;
    this.refs.refund.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // console.log(Math.round(new Date(values.invoiceTime._d).getTime() / 1000))
        let addcanBackMoneyDetail = this.state.addcanBackMoneyDetail;
        let params = {
          orderId: addcanBackMoneyDetail.outOrderId,
          business: 'VIPCOURSE',
          remark: values.remark,
          applyAmount: parseFloat(values.refund),
          payType: 7
        };
        that.setState({
          refundBtnState: true
        });
        refundSubmit(params).then(res => {
          if (res.data.code == 0) {
            message.success('提交成功');
            that.refundCancel();
            that.getAllOrderList()
          } else {
            message.error(res.data.msg)
          }
          that.setState({
            refundBtnState: false
          });
        }).catch(err => {
          that.setState({
            refundBtnState: false
          });
        });
        //添加成功后关闭添加modal，打开回款modal

      }
    });
  };

  //退款modal 取消
  refundCancel = () => {
    this.setState({
      refundVisible: false
    })
  };

  //退款管理modal
  refundFn = (id) => {
    geAddCanbackDetail(id).then(res => {
      this.setState({
        addcanBackMoneyDetail: res.data.data,
        refundVisible: true
      })
    }).catch(err => {
      console.log(err)
    });
  };

  //回款modal
  moneyBackOk = () => {
    let that = this;
    this.refs.AddMoneyBack.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let applytime = Math.round(new Date(values.moneyBackTime.format('YYYY-MM-DD HH:mm')).getTime() / 1000)
        let addcanBackMoneyDetail = this.state.addcanBackMoneyDetail;
        let params = {
          orderId: addcanBackMoneyDetail.outOrderId,
          business: 'VIPCOURSE',
          remark: values.remark,
          transaction: parseInt(values.backType, 10),       //回款类型
          payType: parseInt(values.payType, 10),            //支付类型
          applyAmount: parseFloat(values.refund),
          applyTime: applytime,
          vouchers: that.state.keyList,
        };
        that.setState({
          receivableBtnState: true
        });
        AddCanbacksubmit(params).then(res => {
          if (res.data.code == 0) {
            that.moneyBackCancel();
            message.success('提交成功');
            that.getAllOrderList();
          } else {
            message.error(res.data.msg)
          }
          that.setState({
            receivableBtnState: false
          });
        }).catch(err => {
          that.setState({
            receivableBtnState: false
          });
        });
        //添加成功后关闭添加modal，打开回款modal
      }
    });
  };

  moneyBackCancel = () => {
    this.setState({
      moneyBackVisible: false,
      moneyBackDestroy: true
    })
  };

  //回款modal函数
  moneyBackFn = (id) => {
    geAddCanbackDetail(id).then(res => {
      this.setState({
        addcanBackMoneyDetail: res.data.data,
        moneyBackVisible: true,
        moneyBackDestroy: false
      })
    }).catch(err => {
      console.log(err)
    });
  };

  //退款详情modal
  moneyBackDetailOk = () => {

  };

  moneyBackDetailCancel = () => {
    this.setState({
      moneyBackDetailVisible: false,
    })
  };

  moneyBackDetailFn = (id) => {
    this.setState({
      loading: true,
      moneyBackDetailVisible: true,
    });
    let applyData = {
      size: 40,
      current: 1,
      ascs: [],
      descs: [],
      condition: {
        "business": "VIPCOURSE",
        "orderId": id
      }
    };
    getRefundList(applyData).then(res => {
      if (res.data.code == 0) {
        this.setState({
          moneyBackDetailDataSource: res.data.data.records,
          loading: false
        })
      }
    }).catch(err => {
      this.setState({
        loading: false
      });
    });
  };

  billStateCancel = () => {
    this.setState({
      billStateVisible: false
    })
  };

  billStateFn = (id) => {
    this.setState({
      loading: true,
      billStateVisible: true
    });
    params.condition.orderId = id;
    getBillStetsForm(params).then(res => {
      if (res.data.code == 0) {
        this.setState({
          billStateDataSource: res.data.data.records,
          loading: false
        })
      }
    }).catch(err => {
      this.setState({
        loading: false
      });
    });
  };

  alreadyPayCancel = () => {
    this.setState({
      alreadyPayVisible: false
    })
  };

  alreadyPayFn = (id, record) => {
    this.setState({
      alreadyPayVisible: true,
      loading: true
    });
    let applyData = {
      size: 40,
      current: 1,
      ascs: [],
      descs: [],
      condition: {
        "business": "VIPCOURSE",
        "orderId": record.outOrderId
      }
    };
    getReceivableList(applyData).then(res => {
      if (res.data.code == 0) {
        this.setState({
          alreadyPayData: res.data.data,
          alreadyPayDataSource: res.data.data.records,
          loading: false
        })
      }
    }).catch(err => {
      this.setState({
        loading: false
      });
    });
    getReceivableDetail(record.outOrderId).then(res => {
      if (res.data.code === 0) {
        this.setState({
          amountDetail: res.data.data
        })
      }
    })
  };


  signUpTabCancel = () => {
    this.setState({
      signUpTabVisible: false
    })
  };

  signUpTabFn = (type, id) => {
    //type=signUpTab:获取报名表；
    //type=preSignUpTab:获取预报名表;
    this.setState({
      loading: true
    });
    if (type === 'signUpTab') {
      getSignUpTab(id).then(res => {
        if (res.data.code == 0) {
          this.setState({
            tableName: '获取报名表',
            signUpTabVisible: true,
            signUpImg: res.data.data.img,
            loading: false
          })
        } else {
          message.error(res.data.msg)
          this.setState({
            loading: false
          })
        }
      }).catch(err => {
        console.log(err)
      });
    } else {
      getPreSignUpTab(id).then(res => {
        if (res.data.code == 0) {
          this.setState({
            tableName: '获取预报名表',
            signUpTabVisible: true,
            signUpImg: res.data.data.img,
            loading: false
          })
        } else {
          message.error(res.data.msg)
          this.setState({
            loading: false
          })
        }
      }).catch(err => {
        console.log(err)
      });
    }
  };

  // 点击右侧弹出区域
  clickDrawer = (e) => {
    e.stopPropagation();
    this.setState({
      modalVisibal: true
    })
  };

  hideDetail = (e) => {
    e.stopPropagation()
    this.setState({
      modalVisibal: false
    })
  }

  // 获取报名表
  getdetail = (orderId, id) => {
    this.setState({
      loading: true
    })
    getOrderUserDetail({
      id: id,
      outOrderId: orderId
    }).then(res => {
      if (res.data.code === 0) {
        let value = res.data.data;
        this.setState({
          modalVisibal: true,
          getDetail: value,
          details: value.questions ? value.questions : [],
          loading: false
        });
      } else {
        message.error(res.data.msg)
        this.setState({
          loading: false
        })
      }
    });
  }

  //完成订单modal中预览图片
  previewImageFn = (id) => {
    this.setState({
      previewVisible: true,
      previewImage: `https://img.kaikeba.com/${id}`
    })
  };

  previewImgCancel = () => {
    this.setState({
      previewVisible: false
    })
  };

  //下载报名表
  downloadQrcode = () => {
    let that = this;
    let qrcode = document.getElementById('qrcodeimage');
    let URL = 'https://img.kaikeba.com/' + this.props.imgageId;
    let image = new Image();
    image.crossOrigin = '';
    image.src = URL;
    image.onload = function () {
      let imgBase64 = that.getBase64Image(image, qrcode.width, qrcode.height);
      let a = document.createElement('a');
      let event = new MouseEvent('click');
      a.download = '报名表' + new Date().getTime();
      a.href = imgBase64;
      a.dispatchEvent(event)
    };
  };

  // 下载二维码
  downloadQrcode = () => {
    let signUpCode = document.getElementById('signupcode');
    // let img = qrcode.toDataURL("image/png");
    let img = signUpCode.src;
    // console.log(img);
    // 将图片的src属性作为URL地址
    let a = document.createElement('a');
    let event = new MouseEvent('click');
    a.download = '报名表' + new Date().getTime() + '.png';
    a.href = img;
    a.dispatchEvent(event)
  };

  // 订单类型筛选
  orderTypeChange = (value, e) => {
    this.setState({
      orderTypeValue: value
    });
    applyData.current = 1;
    customCondition.type = value;
    this.getAllOrderList();
  };

  // 订单状态筛选
  orderStatusChange = (value, e) => {
    this.setState({
      orderStatusValue: value
    });
    applyData.current = 1;
    customCondition.orderStatus = value;
    this.getAllOrderList();
  };

  // 日期筛选
  handleRangePicker = (rangePickerValue, dateString) => {
    this.setState({
      orderDate: rangePickerValue
    });
    applyData.current = 1;
    customCondition.startTime = parseInt(new Date(new Date(rangePickerValue[0]).toLocaleDateString()).getTime() / 1000, 10);
    customCondition.endTime = parseInt((new Date(new Date(rangePickerValue[1]).toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1) / 1000, 10);
    // customCondition.startTime = Math.round((new Date(rangePickerValue[0]).getTime()) / 1000);
    // customCondition.endTime = Math.round((new Date(rangePickerValue[1]).getTime()) / 1000);
    this.getAllOrderList()
  };

  // 销售筛选
  sellerChange = (value, e) => {
    this.setState({
      sellerValue: value
    });
    applyData.current = 1;
    customCondition.sellerId = value;
    this.getAllOrderList()
  };

  //课程分类筛选
  chooseCourseType = (value, e) => {
    this.setState({
      courseTypeValue: value
    });
    applyData.current = 1;
    customCondition.courseType = value;
    this.getAllOrderList()
  };

  // 选择课程筛选
  chooseCourse = (value, e) => {
    this.setState({
      courseId: value
    });


    if (value !== null) {
      getClass(value).then(res => {

        this.setState({
          courseArr: res.data.data
        })
      })
    } else {
      this.setState({
        courseArr: [],
        classId: undefined
      })
    }

    applyData.current = 1;
    customCondition.courseId = value;
    this.getAllOrderList()
  };


  chooseClass = (value, e) => {
    this.setState({
      classId: value
    })
    applyData.current = 1;
    customCondition.classId = value;
    this.getAllOrderList()
  }

  // 搜索用户的输入框
  searchContent = (e) => {
    this.setState({
      searchValue: e.target.value
    })
  };

  // 搜索用户
  searchUser = () => {
    this.setState({
      disableBtn: true,
      loading: true
    });
    customCondition.search = this.state.searchValue ? this.state.searchValue.replace(/(^\s*)|(\s*$)/g, "") : '';
    params.current = 1;
    this.getAllOrderList();
  };

  // 全部重置
  searchReset = () => {
    this.setState({
      resetBtn: true,
      searchValue: null,
      loading: true,
      orderTypeValue: undefined,
      orderStatusValue: undefined,
      orderDate: undefined,
      sellerValue: undefined,
      courseTypeValue: undefined,
      courseId: undefined,
      // courseArr: [],
      classId: undefined
    });
    customCondition.search = null;
    customCondition.startTime = null;
    customCondition.endTime = null;
    customCondition.sellerId = null;
    customCondition.type = null;
    customCondition.orderStatus = null;
    customCondition.courseType = null;
    customCondition.courseId = null;
    customCondition.classId = null;
    this.getAllOrderList();
  };

  // 改变页码
  onChangePage = (page, pageSize) => {
    applyData.size = pageSize;
    applyData.current = page;
    this.getAllOrderList();
  };

  // 改变每页条数
  onShowSizeChange = (current, pageSize) => {
    applyData.size = pageSize;
    applyData.current = current;
    this.getAllOrderList();
  };

  // 展示数据总数
  showTotal = (total) => {
    return `共 ${total} 条数据`;
  };


  render() {
    const {
      dataSource, loading, Visible, BillTypeSelect, OrderNumberSelect, refundVisible, moneyBackVisible, moneyBackDetailVisible,
      billStateVisible, alreadyPayVisible, signUpTabVisible, alreadyPayDataSource, billStateDataSource,
      moneyBackDetailDataSource, previewVisible, previewImage, addcanBackMoneyDetail, amountDetail, sellerValue, courseTypeValue,
      orderTypeList, orderTypeValue, orderDate, sellerList, orderStatusValue, orderStatusList, courseId, courseArr, classId, tableName
    } = this.state;
    const menus = [
      {
        path: '/app/dashboard/analysis',
        name: '首页'
      },
      {
        path: '#',
        name: '订单中心'
      },
      {
        path: '/app/authority/accounts',
        name: '订单中心'
      }
    ];
    return (
      <div className="ordercenter-order">
        <div className="page-nav">
          <BreadcrumbCustom paths={menus} />
          <p className="title-style">订单中心</p>
        </div>
        <Card bordered={false}>
          <Row className="my-user-search" gutter={16}>
            <Col sm={2} style={{ textAlign: 'right', width: '90px', marginTop: '5px' }}>
              <span>订单类型：</span>
            </Col>
            <Col sm={5} style={{ padding: 0 }} id="order_type_select">
              <Select
                showSearch
                value={orderTypeValue}
                placeholder="请选择"
                onChange={this.orderTypeChange}
                style={{ width: '100%' }}
                getPopupContainer={() => document.getElementById('order_type_select')}
              >
                <Option value={null}>请选择</Option>
                {orderTypeList.map((value, index) => <Option key={index}
                  value={parseInt(value.key, 10)}>{value.value}</Option>)}
              </Select>
            </Col>
            <Col sm={2} style={{ textAlign: 'right', width: '90px', marginTop: '5px' }}>
              <span>订单状态：</span>
            </Col>
            <Col sm={5} style={{ padding: 0 }} id="order_date_select">
              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="请选择"
                onChange={this.orderStatusChange}
                value={orderStatusValue}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                getPopupContainer={() => document.getElementById('order_date_select')}
              >
                <Option value={null}>请选择</Option>
                {orderStatusList.map((value, index) => <Option key={index}
                  value={parseInt(value.key, 10)}>{value.value}</Option>)}
              </Select>
            </Col>
            <Col sm={2} style={{ textAlign: 'right', width: '65px', marginTop: '5px' }}>
              <span>日期：</span>
            </Col>
            <Col sm={5} style={{ padding: 0 }} id="order_status_select">
              <LocaleProvider locale={zh_CN}>
                <RangePicker
                  value={orderDate}
                  onChange={this.handleRangePicker}
                  style={{ width: '100%' }}
                />
              </LocaleProvider>
            </Col>
          </Row>
          <Row gutter={16} className="finace-bills-add">
            <Col>
              <Row className="refund-search" gutter={16}>
                <Col className="search-input" sm={2}
                  style={{ textAlign: 'right', width: '90px', marginTop: '5px' }}>
                  <span>销售：</span>
                </Col>
                <Col className="" sm={5} offset={0} style={{ padding: '0' }} id="order_seller_select">
                  <Select
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="请选择"
                    onChange={this.sellerChange}
                    value={sellerValue}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    getPopupContainer={() => document.getElementById('order_seller_select')}
                  >
                    <Option value={null}>请选择</Option>
                    {sellerList.map((value, index) => <Option key={index}
                      value={parseInt(value.id, 10)}>{value.realname}</Option>)}
                  </Select>
                </Col>
                <Col className="search-input" sm={2}
                  style={{ textAlign: 'right', width: '90px', marginTop: '5px' }}>
                  <span>课程分类：</span>
                </Col>
                <Col className="" sm={5} offset={0} style={{ padding: '0' }} id="order_seller_select">
                  <Select
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="请选择"
                    onChange={this.chooseCourseType}
                    value={courseTypeValue}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    getPopupContainer={() => document.getElementById('order_seller_select')}
                  >
                    <Option value={null}>请选择</Option>
                    <Option value={0}>VIP课程</Option>
                    <Option value={1}>低价小课</Option>
                  </Select>
                </Col>
                <Col className="search-input" sm={2}
                  style={{ textAlign: 'right', width: '90px', marginTop: '5px' }}>
                  <span>选择课程：</span>
                </Col>
                <Col className="" sm={5} offset={0} style={{ padding: '0' }} id="order_course_select">
                  <Select
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="请选择课程"
                    onChange={this.chooseCourse}
                    value={courseId}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    getPopupContainer={() => document.getElementById('order_course_select')}
                  >
                    <Option value={null}>请选择</Option>
                    {OrderNumberSelect.map(value => <Option
                      key={value.classId} value={value.courseId}>{value.courseName}</Option>)}
                  </Select>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginBottom: '20px' }}>
            <Col className="search-input" sm={2}
              style={{ textAlign: 'right', width: '90px', marginTop: '5px' }}>
              <span>班次：</span>
            </Col>
            <Col className="" sm={5} offset={0} style={{ padding: '0' }} id="order_course_select">
              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="请选择班次"
                onChange={this.chooseClass}
                value={classId}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                getPopupContainer={() => document.getElementById('order_course_select')}
              >
                <Option value={null}>选择班次</Option>
                {courseArr.map(value => <Option
                  key={value.classId} value={value.classId}>{value.className}</Option>)}

              </Select>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginBottom: '20px' }}>
            <Col className="search-input" sm={2}
              style={{ textAlign: 'right', width: '90px', marginTop: '5px' }}>
              <span>搜索：</span>
            </Col>
            <Col className="" sm={5} offset={0} style={{ padding: '0' }}>
              <Input autoComplete="off" value={this.state.searchValue}
                onChange={this.searchContent} onPressEnter={this.searchUser}
                placeholder="搜索昵称/学员姓名/订单编号" />
            </Col>
            <Col className="" sm={8}>
              <Button type="primary" style={{ marginRight: '12px', marginLeft: '10px' }}
                onClick={this.searchUser} disabled={this.state.disableBtn}>查询</Button>
              <Button type="default" onClick={this.searchReset}
                disabled={this.state.resetBtn}>全部重置</Button>
            </Col>
            <Col sm={4} style={{ float: 'right', textAlign: 'right' }}>
              <Button onClick={this.addBillBtn} type="primary">+ 创建线下订单</Button>
            </Col>
          </Row>
          <Row className="ordercenter-order-table">
            <FormTable
              dataSource={dataSource}
              changeSore={this.changeSore}
              loading={loading}
              refundFn={this.refundFn}
              moneyBackFn={this.moneyBackFn}
              moneyBackDetailFn={this.moneyBackDetailFn}
              billStateFn={this.billStateFn}
              alreadyPayFn={this.alreadyPayFn}
              signUpTabFn={this.signUpTabFn}
              getdetail={this.getdetail}
            />
          </Row>
          <Row>
            <div style={{ overflow: 'hidden' }}>
              <LocaleProvider locale={zh_CN}>
                <Pagination showSizeChanger onShowSizeChange={this.onShowSizeChange}
                  onChange={this.onChangePage}
                  total={this.state.dataAll.total}
                  showTotal={this.showTotal.bind(this.state.dataAll.total)}
                  current={applyData.current}
                  defaultPageSize={40} />
              </LocaleProvider>
            </div>
          </Row>
          {this.state.addOrderDestroy
            ? '' :
            <Modal
              title="创建线下订单"
              className="Add-modals"
              okText="确定"
              cancelText="取消"
              visible={Visible}
              style={{ top: '80px' }}
              onOk={this.onSubmitFormOrder}
              onCancel={this.handleCancel}
              footer={[
                <button onClick={this.handleCancel} type="button" className="ant-btn">取消</button>,
                <button disabled={this.state.addOrderBtnState} onClick={this.onSubmitFormOrder}
                  type="button" className="ant-btn ant-btn-primary">确定</button>
              ]}
            >
              <div>
                <AddOrder BillTypeSelect={BillTypeSelect} OrderNumberSelect={OrderNumberSelect}
                  getprosState={this.getprosState} ref="btSubmit" />
              </div>
            </Modal>}
          <LocaleProvider locale={zh_CN}>
            <Modal
              title="申请退款"
              okText="确定"
              cancelText="取消"
              visible={refundVisible}
              style={{ top: '80px' }}
              onOk={this.refundOk}
              destroyOnClose={true}
              onCancel={this.refundCancel}
              footer={[
                <button onClick={this.refundCancel} type="button" className="ant-btn">取消</button>,
                <button disabled={this.state.refundBtnState} onClick={this.refundOk} type="button"
                  className="ant-btn ant-btn-primary">确定</button>
              ]}
            >
              <RefundModal addcanBackMoneyDetail={addcanBackMoneyDetail} ref="refund" />
            </Modal>
          </LocaleProvider>
          {this.state.moneyBackDestroy
            ? '' :
            <Modal
              title="新增回款"
              className="Add-moneyBack"
              okText="确定"
              cancelText="取消"
              visible={moneyBackVisible}
              style={{ top: '80px' }}
              onOk={this.moneyBackOk}
              onCancel={this.moneyBackCancel}
              footer={[
                <button onClick={this.moneyBackCancel} type="button" className="ant-btn">取消</button>,
                <button disabled={this.state.receivableBtnState} onClick={this.moneyBackOk}
                  type="button" className="ant-btn ant-btn-primary">确定</button>
              ]}
            >
              <AddMoneyBack ref="AddMoneyBack" getKeyList={this.getKeyList}
                addcanBackMoneyDetail={addcanBackMoneyDetail} />
            </Modal>}
          <Modal
            title="退款详情"
            okText="确定"
            cancelText="取消"
            className="moneyBackDetail"
            footer={null}
            visible={moneyBackDetailVisible}
            style={{ top: '80px' }}
            onOk={this.moneyBackDetailOk}
            onCancel={this.moneyBackDetailCancel}
          >
            <div className="form-common">
              <MoneyBackTab
                dataSource={moneyBackDetailDataSource}
                changeSore={this.changeSore}
                loading={loading}
              />
            </div>
          </Modal>
          <Modal
            title="发票状态"
            okText="确定"
            cancelText="取消"
            className="billState"
            visible={billStateVisible}
            style={{ top: '80px' }}
            footer={null}
            onOk={this.billStateOk}
            onCancel={this.billStateCancel}
          >
            <div className="form-common">
              <BillStateTab
                dataSource={billStateDataSource}
                changeSore={this.changeSore}
                loading={loading}
              />
            </div>
          </Modal>
          <Modal
            title="已付金额"
            className="alreadyPay"
            visible={alreadyPayVisible}
            style={{ top: '80px' }}
            footer={null}
            onCancel={this.alreadyPayCancel}
          >
            <div className="form-common">
              <div style={{ marginBottom: '20px' }}>
                <div className="form-common_already">
                  <span className="already-money-title">已付金额：</span>
                  <span
                    className="already-money">{priceType(amountDetail.amount ? amountDetail.amount : 0)}</span>
                </div>
                <div className="form-common_already">
                  <span className="already-money-title">已确认：</span>
                  <span
                    className="already-money">{priceType(amountDetail.combo ? amountDetail.combo : 0)}</span>
                </div>
                <div className="form-common_already">
                  <span className="already-money-title">待确认：</span>
                  <span
                    className="already-money">{priceType(amountDetail.unconfirmed ? amountDetail.unconfirmed : 0)}</span>
                </div>
              </div>
              <AlreadyPayTab
                dataSource={alreadyPayDataSource}
                changeSore={this.changeSore}
                loading={loading}
                previewImageFn={this.previewImageFn}
              />
            </div>
          </Modal>
          <Modal
            title={tableName}
            okText="确定"
            className="signuptab"
            cancelText="取消"
            visible={signUpTabVisible}
            style={{ top: '80px' }}
            footer={null}
            onOk={this.signUpTabOk}
            onCancel={this.signUpTabCancel}
          >
            <div className="signupimage">
              <img id="signupcode" src={this.state.signUpImg} />
              <p onClick={this.downloadQrcode}>点击保存到本地</p>
            </div>
          </Modal>
          <Modal visible={previewVisible} footer={null} onCancel={this.previewImgCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </Card>
        <Drawer onDrawClick={this.clickDrawer} detailData={this.state.getDetail} visible={this.state.modalVisibal}
          onClose={this.hideDetail} />
      </div>
    )
  }
}
