import React, { Component } from 'react'
import './PreSaleDataList.less'
import { Row, message, Input, Button, Select, Pagination, LocaleProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import { Link } from 'react-router-dom'
import BreadcrumbCustom from '../common/BreadcrumbCustom'
import FormTable from './PreSaleDataFormTab'
import { materialsList, getCourses, getUser } from '../../api/preSaleData'
import { getToken, userAuthor } from '../../utils/filter'
import { connect } from '../../utils/socket'
import _ from 'lodash'

const Search = Input.Search
let params = {
  size: 40,
  current: 1,
  descs: ['createTime'],
  condition: {
    createBy: null,
    subjects: null,
    search: null,
    courseId: null
  }
}

export default class UForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userName: '', //名称
      visible: false, //新建窗口隐藏
      dataSource: [], //列表数据
      count: null,
      tableRowKey: 0, //列表多选框key
      isUpdate: false,
      loading: true,
      dataAll: '', //返回的所有数据
      id: '',
      data: [], // 渠道列表
      openCourseId: '',
      disableBtn: false,
      resetBtn: false,
      coursesList: [], // 关联课程——
      userList: [] // 创建人——
    }
    // this.routeId = props.match.params.id
  }

  //渲染
  componentDidMount() {
    params.current = 1
    params.size = 40
    params.condition.createBy = null
    params.condition.subjects = null
    params.condition.search = null
    params.condition.courseId = null
    this.init()
    //end
  }

  // 初始化-
  init() {
    this.getOpenCourseList()
    this.getCoursesList()
    this.getUserList()
    //链接websocket
    connect(getToken('username'))
  }
  // 获取销售联级菜单
  getCoursesList() {
    getCourses('list').then(res => {
      let resDatas = res.data
      console.log('关联课程', res)
      if (resDatas.code === 0) {
        this.setState({
          coursesList: resDatas.data
        })
      } else if(resDatas.code === 10001){
        this.setState({
          coursesList: []
        })
      }else {
        message.error(resDatas.msg)
      }
    })
  }
  // 获取销售联级菜单
  getUserList() {
    getUser('list').then(res => {
      let resDatas = res.data
      if (resDatas.code === 0) {
        this.setState({
          userList: resDatas.data
        })
      } else if(resDatas.code === 10001){
        this.setState({
          userList: []
        })
      } else {
        message.error(resDatas.msg)
      }
    })
  }
  // 获取资料列表信息
  getOpenCourseList = () => {
    materialsList(params).then(res => {
      let resDatas = res.data
      if (resDatas.code === 0) {
        this.setState({
          dataSource: resDatas.data.records,
          count: resDatas.data.records.length,
          loading: false,
          dataAll: resDatas.data,
          disableBtn: false,
          resetBtn: false
        })
      }else if(resDatas.code === 10001){
          this.setState({
              loading:false,
              dataSource:[]
          })
      }else {
        message.error(resDatas.msg)
      }
    })
  };

  //接受新建表单数据
  // saveFormRef = (form) => {
  //     this.form = form;
  // };

  // 排序+筛选
  changeSore = (record, filters, sorter) => {
    // 排序
    console.log(filters, 'filters');
    console.log(sorter, 'sorter');
    params.descs = sorter.order === 'ascend' ? [] : [sorter.field];
    params.ascs = (sorter.order === "ascend" ? [sorter.field] : []);
    params.current = 1
    // 排序后，恢复排序时，数据应当保持和默认一致；
    let arr = Object.keys(sorter) //此方法为ES6新方法，返回值是对象中属性名组成的数组；
    if (arr.length == 0) {
      params.descs = ['createTime']
    }
    // 所属学科筛选条件不为空时执行
    if (!_.isEmpty(filters)) {
      let array = []
      for (let i = 0; i < filters.subjects.length; i++) {
        array.push(parseInt(filters.subjects[i]))
      }
      // 学科筛选时，创建时间默认排序
      params.descs = ['createTime']
      params.condition.subjects = array
    }
    this.getOpenCourseList()
  };

  // 展示公开课总条数
  showTotal = total => {
    return `共 ${total} 条数据`
  };

  // 公海分流
  distriClick = key => {
    alert(key)
    message.warning('开发中，敬请期待...')
  }

  // 搜索资料
  onSearchMaterials = value => {
    params.condition.search = value.replace(/\s+/g, '')
    params.current = 1
    this.setState({
      loading: true,
      disableBtn: true
    })
    this.getOpenCourseList()
  }

  // 搜索动态绑定输入框的值
  handleChangeName = e => {
    let data = e.target.value
    this.setState({
      userName: e.target.value
    })
  }

  // 搜索重置
  resetValue = () => {
    params.condition.search = null
    params.current = 1
    this.setState({
      userName: '',
      loading: true,
      resetBtn: true
    })
    this.getOpenCourseList()
  }

  // 选择课程
  onSelectCourse = value => {
    value = Number(value) === 0 ? null : value
    params.condition.subjects = value === null ? null : [`${value}`]
    this.getOpenCourseList()
  }
  // 创建人
  onCreatedBy = value => {
    value = Number(value) === 0 ? null : value
    params.condition.createBy = value
    this.getOpenCourseList()
  }

  // 改变页码
  handleChangePage = (page, pageSize) => {
    console.log('改变页码', page, pageSize)
    params.size = pageSize
    params.current = page
    this.getOpenCourseList()
  }

  // 改变每页条数
  handleShowSizeChange = (current, pageSize) => {
    console.log('改变每页条数', current, pageSize)
    params.size = pageSize
    params.current = current
    this.getOpenCourseList()
  }

  render() {
    const { userName, dataSource, visible, loading } = this.state
    const { Option } = Select
    const menus = [
      {
        path: '/app/dashboard/analysis',
        name: '售前资料管理'
      },
      {
        path: '#',
        name: '资料管理'
      }
    ]
    return (
      <div className="launch-list">
        <div className="page-nav">
          <BreadcrumbCustom paths={menus} />
          <p className="title-style">资料管理</p>
        </div>
        <div className="formBody">
          <Row gutter={16}>
            <div
                className="plus"
                style={{ display: userAuthor('marketing:materials:manage') ? 'inline-block' : 'none' }}
            >
              <Link to={'/app/presaledata/add'}>
                <Button icon="plus" type="primary">
                  添加资料
                </Button>
              </Link>
            </div>
            <div className="btnOpera">
              <Button onClick={this.resetValue} disabled={this.state.resetBtn}>
                重置
              </Button>
            </div>
            <div className="btnOpera">
              <Search
                placeholder="资料名称"
                onSearch={this.onSearchMaterials}
                onChange={this.handleChangeName}
                enterButton
                value={userName}
                disabled={this.state.disableBtn}
              />
            </div>
            <div className="btnOpera" id="area">
              <span>创建人：</span>
              <Select
                className={'space'}
                defaultValue="0"
                onChange={this.onCreatedBy}
                getPopupContainer={() => document.getElementById('area')}
              >
                <Option value="0">请选择</Option>
                {this.state.userList && this.state.userList.map((item, index) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  )
                })}
              </Select>
            </div>
            <div className="btnOpera" id="area">
              <span>关联课程：</span>
              <Select
                className={'space'}
                defaultValue="0"
                onChange={this.onSelectCourse}
                getPopupContainer={() => document.getElementById('area')}
              >
                <Option value="0">选择关联课程</Option>
                {this.state.coursesList && this.state.coursesList.map((item, index) => {
                  return (
                    <Option key={item.id} value={index + 1}>
                      {item.name}
                    </Option>
                  )
                })}
              </Select>
            </div>
          </Row>
          <Row>

          </Row>
          <FormTable
            dataSource={dataSource}
            checkChange={this.checkChange}
            changeSore={this.changeSore}
            editClick={this.editClick}
            distriClick={this.distriClick}
            loading={loading}
            id={this.state.tableRowKey}
          />
          <div style={{ overflow: 'hidden' }}>
            <LocaleProvider locale={zh_CN}>
              <Pagination
                showSizeChanger
                onShowSizeChange={this.handleShowSizeChange}
                onChange={this.handleChangePage}
                total={this.state.dataAll.total}
                showTotal={this.showTotal.bind(this.state.dataAll.total)}
                current={params.current}
                pageSize={params.size}
                defaultPageSize={40}
              />
            </LocaleProvider>
          </div>
        </div>
      </div>
    )
  }
}
