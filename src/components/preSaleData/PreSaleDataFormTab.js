import React, { Component } from 'react'
import { Table, Popconfirm, LocaleProvider } from 'antd'
import { formatDateTime, openAuthor } from '../../utils/filter'
import { Link } from 'react-router-dom'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import { urlSubjectList } from '../../api/openCourseApi'
import { getSubjectList } from '../../api/commonApi'

export default class FormTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      len: 0,
      dataSource: '',
      subjectData: [],
      subjectLen: 0
    }
  }

  // 获取所属学科名称
  getSubjectName = () => {
    // 学科筛选下拉选项
    urlSubjectList().then(response => {
      if (response.data.code === 0) {
        this.setState({
          dataSource: response.data.data,
          len: response.data.data.length
        })
        let data = []
        for (let i = 0; i < this.state.len; i++) {
          let temp = {
            text: this.state.dataSource[i].subjectName,
            value: this.state.dataSource[i].subjectId
          }
          data.push(temp)
        }
        this.setState({
          data: data
        })
      }
    })
    // 所有学科
    getSubjectList().then(response => {
      if (response.data.code === 0) {
        this.setState({
          subjectData: response.data.data,
          subjectLen: response.data.data.length
        })
      }
    })
  }

  // 根据学科ID匹配对应的学科名称
  matchSubject = dataIndex => {
    let subjectName = ''
    // 根据", "将字符串拆成字符串数组
    // let array = dataIndex.split(", ");
    for (let j = 0; j < dataIndex.length; j++) {
      for (let i = 0; i < this.state.subjectLen; i++) {
        if (parseInt(dataIndex[j]) === parseInt(this.state.subjectData[i].id)) {
          if (subjectName) {
            subjectName += '/' + this.state.subjectData[i].name
          } else {
            subjectName = this.state.subjectData[i].name
          }
        }
      }
    }
    if (!subjectName) {
      subjectName = '/'
    }
    return subjectName
  }

  // 渲染
  componentDidMount() {
    this.getSubjectName()
  }

  render() {
    const { onDelete, changeSore, dataSource, distriClick, loading } = this.props
    const columns = [
      {
        title: '资料名称',
        dataIndex: 'title',
        width: 240
      },
      {
        title: '学科',
        dataIndex: 'subjects',
        key: 'subjects',
        width: 120,
        filters: this.state.data
      },
      {
        title: '描述（内部可见）',
        dataIndex: 'description',
        width: 80,
        render: dataIndex => (dataIndex === null ? <span>/</span> : <span>{dataIndex}</span>)
      },
      {
        title: '关联vip课',
        dataIndex: 'courses',
        key: '',
        width: 120,
        // filters: this.state.data
      },
      {
        title: '创建人',
        dataIndex: 'createBy',
        width: 90
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        sorter: (a, b) => a.createTime - b.createTime,
        width: 120,
        render: dataIndex => {
          return formatDateTime(dataIndex)
        }
      },
      {
        title: '操作',
        dataIndex: 'opera',
        width: 120,
        render: (text, record) => (
          <div className="opera">
            <Link
              to={'/app/presaledata/' + record.id + '?page=1'}
              style={{
                margin: '0 2px',
                display: openAuthor('marketing:materials:manage', record.subjectIds) ? 'block' : 'none'
              }}
            >
              <span style={{ color: 'rgb(35, 82, 124)' }}>编辑</span>
            </Link>
            <p
              style={{
                margin: '0 2px',
                color: '#888',
                cursor: 'text',
                display: openAuthor('marketing:materials:manage', record.subjectIds) ? 'none' : 'block'
              }}
            >
              编辑
            </p>
            <Link
              to={'/app/presaledata/' + record.id + '?page=2'}
              style={{
                margin: '0 2px',
                display: openAuthor('marketing:materials:student', record.subjectIds) ? 'inline-block' : 'none'
              }}
            >
              <span style={{ color: 'rgb(35, 82, 124)' }}>学员</span>
            </Link>
            <p
              style={{
                margin: '0 2px',
                color: '#888',
                cursor: 'text',
                display: openAuthor('marketing:materials:student', record.subjectIds) ? 'none' : 'inline-block'
              }}
            >
              学员
            </p>

            <div>
              <Link
                to={'/app/presaledata/' + record.id + '?page=3'}
                style={{
                  margin: '0 2px',
                  display: openAuthor('marketing:materials:student', record.subjectIds) ? 'inline-block' : 'none'
                }}
              >
                <span style={{ color: 'rgb(35, 82, 124)' }}>渠道</span>
              </Link>
              <p
                style={{
                  margin: '0 2px',
                  color: '#888',
                  cursor: 'text',
                  display: openAuthor('marketing:materials:student', record.subjectIds) ? 'none' : 'inline-block'
                }}
              >
                渠道
              </p>
            </div>
          </div>
        )
      }
    ]
    return (
      <LocaleProvider locale={zh_CN}>
        <div>
          <Table id={'tb'} key={(record, i) => i} rowKey={(record, i) => i} rowSelection={null} columns={columns} dataSource={dataSource} bordered={true} scroll={{ x: '100%' }} className="open-course-table formTable" loading={loading} pagination={false} onChange={changeSore} getPopupContainer={triggerNode => triggerNode.parentNode} />
        </div>
      </LocaleProvider>
    )
  }
}
