import React from 'react'
// import './AddOpenCourse.less';
import BreadcrumbCustom from '../common/BreadcrumbCustom'
import { Tabs, Form, Row, Col, Spin } from 'antd'
import { getToken, formatDateTime } from '../../utils/filter'
import EditOpenCourse from './EditSaleData'
import MemberList from './user/Form'
import Channel from './channel/Form'
import history from '../common/History'
import { getMaterialsTitleDetail } from '../../api/preSaleData'
import { connect } from '../../utils/socket'

const TabPane = Tabs.TabPane
// let status = ''
let emojiRule = /([\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70-\uDD71\uDD7E-\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01-\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50-\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96-\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF])|(\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F-\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95-\uDD96\uDDA4-\uDDA5\uDDA8\uDDB1-\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB-\uDEEC\uDEF0\uDEF3-\uDEF6])|(\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0])/g

class Local extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      data: {},
      dataAll: [],
      loading: true,
      preStatus: '0',
      status: '0', //公开课状态
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
      btnFlage: false
    }
    this.routeId = props.match.params.id
  }

  // 渲染前
  componentWillMount() {
    this.setState({
      loading: true,
      tabKey: window.location.search.slice(6)
    })
  }

  // 获取公开课编辑页的相关信息
  componentDidMount() {
    this.init()
    //end
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.pushHistory)
  }

  pushHistory = state => {
    // 监听到返回事件，注意，只有触发了返回才会执行这个方法
    history.push('/app/presaledata/list')
  }
  init() {
    this.getDetail()
    window.addEventListener('popstate', this.pushHistory)
    //链接websocket
    connect(getToken('username'))
  }
  getDetail() {
    let data = {
      materialsId: this.routeId
    }
    getMaterialsTitleDetail(data).then(res => {
      let resDatas = res.data
      if (resDatas.code === 0) {
        this.setState({
          data: resDatas.data,
          remark: resDatas.data.remark,
          loading: false
        })
      }
    })
  }
  //接受新建表单数据
  saveFormRef = form => {
    this.form = form
  }

  //取消
  handleCancel = () => {
    this.setState({ visible: false })
  }

  // 切换详情与学员列表
  callback = key => {
    history.push('/app/presaledata/' + this.routeId + '?page=' + key)
  }

  // 检测备注文字
  checkRemark = e => {
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
  }

  // 切换tab
  changeTab = key => {
    this.setState({
      tabKey: key
    })
  }

  render() {
    const { data } = this.state
    const menus = [
      {
        path: '/app/dashboard/analysis',
        name: '首页'
      },
      {
        path: '/app/presaledata/list',
        name: '资料列表'
      },
      {
        name: this.state.data.title,
        path: '#'
      }
    ]
    return this.state.loading ? (
      <Spin size="large" style={{ marginTop: '120px' }} className="loading" />
    ) : (
      <div>
        <div className="page-nav course-header">
          <BreadcrumbCustom paths={menus} />
          <Row>
            <Col xs={24} sm={10} style={{ textAlign: 'left' }}>
              <img
                style={{ width: '30px', float: 'left', marginRight: '10px' }}
                src="https://img.kaikeba.com/course-icon.png"
                alt=""
              />
              <p className="course-title">{this.state.data.title}</p>
            </Col>
          </Row>
          <Row className="index-content">
            <Col xs={24} style={{ textAlign: 'left' }}>
              <Row gutter={16}>
                <Col span={4}>
                  <div className="index-term">
                    创建人：<span>{data.createBy ? data.createBy : '/'}</span>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="index-term">
                    创建时间：<span>{formatDateTime(data.createTime)}</span>
                  </div>
                </Col>
                <Col span={4}>
                  <div className="index-term pv-uv">
                    PV/UV：
                    <span>
                      {data.pv ? data.pv : 0}/{data.uv ? data.uv : 0}
                    </span>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div>
          <Tabs
            style={{ margin: '0 -30px' }}
            onTabClick={this.changeTab}
            activeKey={this.state.tabKey}
            defaultActiveKey={window.location.search.slice(6)}
            onChange={this.callback}
          >
            <TabPane className="detail" tab="详情" key="1">
              <EditOpenCourse
                noReplayUrl={this.state.noReplayUrl}
                liveStatus={this.state.status}
                preStatus={this.state.preStatus}
                materialsId={this.routeId}
              />
            </TabPane>

            <TabPane tab="学员列表" key="2">
              <MemberList materialsId={this.routeId} />
            </TabPane>

            <TabPane tab="渠道推广" key="3">
              <Channel materialsId={this.routeId} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}

const CourseInfoForm = Form.create()(Local)
export default CourseInfoForm
