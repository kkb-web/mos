import React from 'react';
import BreadcrumbCustom from '../../common/BreadcrumbCustom';
import {Tabs, Form, Button, Radio, Row, Col, Input, Spin, Modal, message, Switch} from 'antd';
import {formatDateTime, priceType, vipAuthor} from "../../../utils/filter";
import Class from './class/Class';
import Sale from './sale/Sale';
import Channel from './channel/ChannelList';
import history from "../../common/History";
import {getVipDetail, getChannelStatus, editVipDetailRemark} from "../../../api/vipCourseApi";
import EditVipcourse from './EditVipCourse'
import {connect} from "../../../utils/socket";
import {getToken} from "../../../utils/filter";
import "./CourseHeader.less"
import Marketing from "./class/Marketing";


const TabPane = Tabs.TabPane;
let status = '';
let emojiRule = /([\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70-\uDD71\uDD7E-\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01-\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50-\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96-\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF])|(\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F-\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95-\uDD96\uDDA4-\uDDA5\uDDA8\uDDB1-\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB-\uDEEC\uDEF0\uDEF3-\uDEF6])|(\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0])/g;

class Local extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      data: {},
      dataAll: [],
      loading: true,
      preStatus: "0",
      status: "0",    //公开课状态
      contentStatus: '',
      visible: false,
      modelVisible: false,
      id: '',
      openCourseId: '',
      liveBanned: true,
      remark: '',
      remarkTxt: '',
      tabKey: '1',
      noReplayUrl: false,
      btnFlage: false,
      courseId: parseInt(window.location.pathname.slice(15)), //课程id
      subjectId: null,
      classId: this.props.location.classId,
      itemId: '',
      //vip
      vipCourseDetail: {},
      buttonStatus: null,
      disableBtn: false,
      renderClass: props.location.search.indexOf("edit=true") === -1
    };
  }

  // 渲染前
  componentWillMount() {
    this.setState({
      loading: true,
      tabKey: window.location.search.slice(6)
    });
  }

  // 获取公开课编辑页的相关信息
  componentDidMount() {
    if (this.props.location.state) {
      this.setState({
        itemId: this.props.location.state.itemId
      });
    }
    // if (window.location.href.indexOf('?') !== -1) {
    //     window.addEventListener('popstate', this.pushHistory);
    // } else {
    //     window.removeEventListener('popstate', this.pushHistory);
    // }
    window.addEventListener('popstate', this.pushHistory);
    this.getVipDetailFn();
    this.getChannelStatusFn();
    // 链接websocket
    connect(getToken('username'));
    // end
  };

  componentWillUnmount() {
    document.title = 'kkb后台管理系统';
    window.removeEventListener('popstate', this.pushHistory);
  }

  pushHistory = (state) => {
    // 监听到返回事件，注意，只有触发了返回才会执行这个方法
    console.log(state.target.location.href, window.location);
    if (this.state.classId) {
      history.push('/app/vipcourse/class')
    } else {
      history.push('/app/vipcourse/list')
    }
  };

  //课程详情
  getVipDetailFn = () => {
    let params = {
      courseId: this.state.courseId
    };
    getVipDetail(params).then(res => {
      document.title = 'vip课程-' + res.data.data.name;
      this.setState({
        vipCourseDetail: res.data.data,
        subjectId: res.data.data.subjectId,
        itemId: res.data.data.itemId,
        loading: false
      });
      console.log(this.state.subjectId, '=========学科id')
    }).catch(err => {
      console.log(err)
    })
  };
  //查询推广链接按钮状态
  getChannelStatusFn = () => {
    let params = {
      courseId: this.state.courseId
    };
    this.setState({
      disableBtn: true
    });
    getChannelStatus(params).then(res => {
      if (res.data.code === 0) {
        this.setState({
          buttonStatus: res.data.data,
          disableBtn: false
        })
      }
    }).catch(err => {
      console.log(err)
      this.setState({
        disableBtn: false
      });
    })
  };


  //接受新建表单数据
  saveFormRef = (form) => {
    this.form = form;
  };

  //取消
  handleCancel = () => {
    this.setState({visible: false});
  };

  //跳转到新建渠道
  linkToCreateChannel = (id, name) => {
    history.push({
      pathname: `/app/vipcourse/${id}/channel`,
      state: {name: name, id: id, limitedCreate: this.state.vipCourseDetail.limitedCreate}
    })
  };


  // 切换详情与学员列表
  callback = (key) => {
    history.push({
      pathname: '/app/vipcourse/' + window.location.pathname.slice(15) + '?page=' + key,
      classId: this.props.location.classId
    })
  };

  // 确定修改直播状态
  handleOk = () => {
    this.setState({
      btnFlage: true,
    });
    let preStatus = this.state.preStatus;
    if (parseInt(preStatus) === 0) {
      status = 'livebefore'
    } else if (parseInt(preStatus) === 1) {
      status = 'live'
    } else if (parseInt(preStatus) === 2) {
      status = 'liveend'
    } else {
      status = 'liveplayback'
    }
    ;
  };

  // 关闭切换直播状态提示
  handleModelCancel = () => {
    this.setState({
      modelVisible: false,
    });
  };

  // 检测备注文字
  checkRemark = (e) => {
    if (e.target.value.length > 100) {
      this.setState({
        remarkTxt: '不能超过100字'
      })
    } else if (emojiRule.test(e.target.value)) {
      this.setState({
        remarkTxt: '禁止输入emoji'
      })
    } else {
      this.setState({
        remarkTxt: ''
      })
    }
  };

  // 修改备注
  editRemark = (e) => {
    let remark = e.target.value;
    if (remark !== '' && remark !== this.state.remark) {
      let params = {
        courseId: this.state.courseId,
        code: this.state.vipCourseDetail.code,
        remark: remark
      };
      console.log(params);
      editVipDetailRemark(params).then(res => {
        if (res.data.code === 0) {
          this.setState({
            remark: remark
          });
          message.success('备注成功')
        } else {
          message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  };
  // 切换tab
  changeTab = (key) => {
    this.setState({
      tabKey: key
    })
  };

  setClassRender(bool, id) {
    this.setState({
      renderClass: bool,
      classId: id
    });
  }
  
  renderClassOrMarketing(bool) {
    if (bool) {
      return (
        <Class subjectId={this.state.subjectId} itemId={this.state.itemId} setClassRender={this.setClassRender.bind(this)}/>
      );
    } else {
      return <Marketing setClassRender={this.setClassRender.bind(this)} classId={this.state.classId}/>;
    }
  }

  render() {
    const {vipCourseDetail, courseId, buttonStatus, subjectId} = this.state;
    const showSales = vipCourseDetail.showSales;
    const menus = [
      {
        path: '/app/dashboard/analysis',
        name: '首页'
      },
      {
        path: '#',
        name: 'VIP课程'
      },
      {
        path: '/app/vipcourse/list',
        name: '课程列表'
      },
      {
        name: this.state.vipCourseDetail.name,
        path: '#'
      }
    ];
    return (
      this.state.loading ? <Spin size="large" style={{marginTop: "20px"}} className="loading"/> :
        <div className="vipdetailhead">
          <div className="page-nav course-header">
            <BreadcrumbCustom paths={menus}/>
            <Row>
              <Col xs={24} sm={10} style={{textAlign: "left"}}>
                <img style={{width: '30px', float: 'left', marginRight: '10px'}}
                     src="https://img.kaikeba.com/course-icon.png" alt=""/>
                <p className="course-title">{vipCourseDetail.name}</p>
              </Col>
              <Col style={{float: 'right', paddingRight: '20px'}}>
                <Button
                  style={{display: vipAuthor('marketing:vipcourse:channel:manager', subjectId) ? 'block' : 'none'}}
                  onClick={this.linkToCreateChannel.bind(this, vipCourseDetail.id, vipCourseDetail.name)}
                  disabled={!buttonStatus} type="primary">创建推广链接</Button>
              </Col>
            </Row>
            <Row className="index-content">
              <Col xs={24} sm={8} style={{textAlign: 'left', paddingLeft: '39px'}}>
                <div
                  className="index-term">创建人：<span>{vipCourseDetail.createBy ? vipCourseDetail.createBy : '/'}</span>
                </div>
                <div
                  className="index-term">创建时间：<span>{formatDateTime(vipCourseDetail.createTime)}</span>
                </div>
                <div className="index-term">
                  备注：<Input defaultValue={vipCourseDetail.remark} id="remark-input"
                            onBlur={this.editRemark}
                            onChange={this.checkRemark}
                            placeholder="请于两个工作日前确认"/>
                </div>
                <div style={{color: '#f5222d'}}>{this.state.remarkTxt}</div>
              </Col>
              <Col className="vippv" xs={24} sm={6} style={{marginTop: '30px'}}>
                <p>总UV/PV：{vipCourseDetail.uv}/{vipCourseDetail.pv}</p>
              </Col>
              <Col className="right-button vippv" xs={24} sm={10} style={{float: 'right'}}>
                <Row>
                  {
                    showSales === 1 && <Col xs={24} sm={7} className="vipsignup" style={{float: 'right'}}>
                      <p className="vipsignup-p1">总报名</p>
                      <p className="vipsignup-p2">{vipCourseDetail.signup}人</p>
                    </Col>
                  }
                  {
                    showSales === 1 && <Col xs={24} sm={8} className="vipsale" style={{float: 'right'}}>
                      <p className="vipsale-p1">总销售额</p>
                      <p
                        className="vipsale-p2">¥<span>{vipCourseDetail.sales == null ? 0 : priceType(vipCourseDetail.sales)}</span>
                      </p>
                    </Col>
                  }
                </Row>
              </Col>
            </Row>
          </div>
          <div>
            <Tabs style={{margin: '0 -30px'}} onTabClick={this.changeTab} activeKey={this.state.tabKey}
                  defaultActiveKey={window.location.search.slice(6)}
                  onChange={this.callback}>
              <TabPane tab="课程详情" key="1">
                <EditVipcourse courseId={courseId}/>
              </TabPane>
              <TabPane tab="班次情况" key="2">
                {this.renderClassOrMarketing(this.state.renderClass)}
              </TabPane>
              <TabPane tab="销售情况" key="3">
                <Sale classId={this.props.location.classId ? this.props.location.classId : null}
                      subjectId={this.state.subjectId}/>
              </TabPane>
              <TabPane tab="推广渠道" key="4">
                <Channel subjectId={this.state.subjectId}/>
              </TabPane>
            </Tabs>
          </div>
        </div>
    );
  }

}

const CourseInfoForm = Form.create()(Local);
export default CourseInfoForm;
