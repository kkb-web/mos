import React, { Component } from 'react'
import { Table, Icon } from 'antd'
import { formatDateTime, renderConfirmState } from '../../../utils/filter'
import CallCenter from '../../CallCenter'

export default class FormTable extends Component {
  constructor(props) {
    super(props)
    this.callCenter = null
  }

  // 根据学科ID匹配对应的学科名称
  matchSubject = dataIndex => {
    let subjectName = ''
    let subjectLen = this.props.subjectList.length
    let subjectData = this.props.subjectList
    // 根据", "将字符串拆成字符串数组
    // let array = dataIndex.split(", ");
    for (let j = 0; j < dataIndex.length; j++) {
      for (let i = 0; i < subjectLen; i++) {
        if (parseInt(dataIndex[j]) === parseInt(subjectData[i].key)) {
          if (subjectName) {
            subjectName += '/' + subjectData[i].value
          } else {
            subjectName = subjectData[i].value
          }
        }
      }
    }
    if (!subjectName) {
      subjectName = '/'
    }
    return subjectName
  }
  rederClueComfirmStatus = dataIndex => {}
  changeCallVisible = (data, toggleCallVisible) => {
    this.callCenter.toggleCallVisible(data, toggleCallVisible)
  }
  render() {
    const {
      changeSore,
      dataSource,
      loading,
      handDetailOnclick,
      handConfirm,
      handleTable
    } = this.props

    const locale = {
      emptyText: '没有数据'
    }
    const columns = [
      {
        title: 'XID',
        dataIndex: 'clueId',
        width: 60,
        render: dataIndex => {
          return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
        }
      },
      {
        title: '微信昵称',
        dataIndex: 'nickname',
        width: 100,
        render: dataIndex => {
          return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
        }
      },
      {
        title: '微信号',
        dataIndex: 'wechatId',
        // sorter: (a, b) => a.uv - b.uv,
        width: 100,
        render: dataIndex => {
          return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
        }
      },
      {
        title: 'unionId',
        dataIndex: 'unionId',
        width: 100,
        render: dataIndex => {
          return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
        }
      },
      {
        title: '姓名',
        dataIndex: 'name',
        width: 80,
        render: dataIndex => {
          return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
        }
      },
      {
        title: '手机号',
        dataIndex: 'realMobile',
        // sorter: (a, b) => a.uv - b.uv,
        width: 140,
        render: (dataIndex, record) => {
          return dataIndex ? (
            <p
              className="telephone"
              style={{ marginBottom: '0' }}
              onClick={() =>
                this.changeCallVisible(dataIndex, record.realMobile)
              }
            >
              <Icon type="phone" theme="filled" />
              <span>{dataIndex}</span>
            </p>
          ) : (
            <span>/</span>
          )
        }
      },
      {
        title: '跟进状态',
        dataIndex: 'isUpdate',
        // sorter: (a, b) => a.uv - b.uv,
        width: 120,
        render: dataIndex => {
          return dataIndex !== null ? (
            dataIndex == '0' ? (
              <span
                style={{
                  color: 'rgb(255,0,0)'
                }}
              >
                未跟进
              </span>
            ) : (
              <span style={{ color: 'rgb(6,119,6)' }}>
                已跟进
              </span>
            )
          ) : (
            <span>/</span>
          )
        }
      },
      {
        title: '推广平台',
        dataIndex: 'platform',
        // sorter: (a, b) => a.uv - b.uv,
        width: 120,
        render: dataIndex => {
          return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
        }
      },
      {
        title: '推广名称',
        dataIndex: 'campaignName',
        // sorter: (a, b) => a.uv - b.uv,
        width: 90,
        render: dataIndex => {
          return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
        }
      },
      {
        title: '所属学科',
        dataIndex: 'subject',
        // sorter: (a, b) => a.uv - b.uv,
        width: 90,
        render: dataIndex => {
          return dataIndex ? (
            <span>{this.matchSubject(dataIndex)}</span>
          ) : (
            <span>/</span>
          )
        }
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 120,
        render: dataIndex => {
          return dataIndex ? (
            <span>{formatDateTime(dataIndex)}</span>
          ) : (
            <span>/</span>
          )
        }
      },
      {
        title: '首次分配时间',
        dataIndex: 'allotedTime',
        width: 120,
        render: dataIndex => {
          return dataIndex ? (
            <span>{formatDateTime(dataIndex)}</span>
          ) : (
            <span>/</span>
          )
        }
      },
      {
        title: '确认状态',
        dataIndex: 'confirm',
        width: 90,
        render: (dataIndex, record) => {
          return dataIndex !== null ? (
            dataIndex == '0' ? (
              <span
                onClick={() => handConfirm(record.id)}
                style={{
                  color: 'rgb(6,119,6)',
                  cursor: 'pointer'
                }}
              >
                {renderConfirmState(dataIndex)}
              </span>
            ) : (
              <span style={{ color: 'rgb(0,0,0,.65)' }}>
                {renderConfirmState(dataIndex)}
              </span>
            )
          ) : (
            <span>/</span>
          )
        }
      },
      {
        title: '操作',
        dataIndex: 'opera',
        width: 90,
        render: (dataIndex, record) => (
          <div>
            <div
              className="clue-opera"
              onClick={() =>
                handDetailOnclick(record.clueId, record.id, record.campaignCode, {
                  customerId: record.customerId ? record.customerId : null,
                  contactId: record.contactId ? record.contactId : null
                })
              }
            >
              编辑
            </div>
            <div
              className="clue-opera"
              onClick={() =>
                handleTable(record.clueId)
              }
              >
              预报名信息
            </div>
          </div>
        )
      }
    ]
    return (
      <div>
        <Table
          key={(record, i) => i}
          rowKey={(record, i) => i}
          rowSelection={null}
          columns={columns}
          dataSource={dataSource}
          bordered={true}
          scroll={{ x: '100%' }}
          className="formTable"
          loading={loading}
          pagination={false}
          onChange={changeSore}
          locale={locale}
        />
        <CallCenter
          ref={ref => {
            this.callCenter = ref
          }}
        />
      </div>
    )
  }
}
