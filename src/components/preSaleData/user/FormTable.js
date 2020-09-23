import React, { Component } from 'react'
import { Table, Icon } from 'antd'
import { formatDateTime, formatDatehhmmss} from '../../../utils/filter'

export default class FormTable extends Component {
  constructor(props) {
    super(props)
  }

  canSendMsg = record => {
    let time = record.interactionTime,
      nowTime = parseInt(new Date().getTime() / 1000),
      valueTime = Math.ceil((nowTime - time) / 60 / 60 / 24)
    if (record.subscribe === 0 || record.subscribe === 2 || valueTime > 2) {
      return false
    } else {
      return true
    }
  }

  render() {
    const {
      changeSore,
      editClick,
      dataSource,
      loading,
      editMsg,
      showHistoricalNews
    } = this.props
    const locale = {
      emptyText: '没有数据'
    }

    const columns = [
      {
        title: '头像',
        dataIndex: 'headimgurl',
        width: 80,
        render: dataIndex =>
          !dataIndex ? (
            <Icon type="user" />
          ) : (
            <img src={dataIndex} alt="headimgurl" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
          )
      },
      {
        title: '昵称',
        dataIndex: 'nickname',
        width: 140,
        render: (dataIndex, record) => {
          return (
            <div onClick={() => editClick(record.id, record.remark)}>
              <p style={{ color: 'rgb(35, 82, 124)', cursor: 'pointer', marginBottom: '0' }}>
                {dataIndex === null ? '/' : dataIndex}
              </p>
              <p
                style={{
                  color: '#333',
                  cursor: 'pointer',
                  width: '120px',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {record.remark}
              </p>
              {record.level == 1 && (
                <span
                  style={{
                    padding: '2px 4px',
                    borderRadius: '3px',
                    display: 'inline-block',
                    width: '48px',
                    height: '18px',
                    lineHeight: '13px',
                    fontSize: '12px',
                    background: 'rgba(102,25,200,1)',
                    color: '#fff'
                  }}
                >
                  1度
                </span>
              )}
              {record.level == 2 && (
                <span
                  style={{
                    padding: '2px 4px',
                    borderRadius: '3px',
                    display: 'inline-block',
                    width: '48px',
                    height: '18px',
                    lineHeight: '13px',
                    fontSize: '12px',
                    background: 'rgba(102,25,200,.7)',
                    color: '#fff'
                  }}
                >
                  2度
                </span>
              )}
              {record.level == 3 && (
                <span
                  style={{
                    padding: '2px 4px',
                    borderRadius: '3px',
                    display: 'inline-block',
                    width: '48px',
                    height: '18px',
                    lineHeight: '13px',
                    fontSize: '12px',
                    background: 'rgba(102,25,200,.4)',
                    color: '#fff'
                  }}
                >
                  3度
                </span>
              )}
              {record.level >= 4 && (
                <span
                  style={{
                    padding: '2px 4px',
                    borderRadius: '3px',
                    display: 'inline-block',
                    width: '48px',
                    height: '18px',
                    lineHeight: '13px',
                    fontSize: '12px',
                    background: '#CAC8CB',
                    color: '#fff'
                  }}
                >
                  3度+
                </span>
              )}
            </div>
          )
        }
      },
      {
        title: '销售',
        dataIndex: 'sellerName',
        sorter: (a, b) => a.sellerName - b.sellerName,
        width: 110,
        render: dataIndex => {
          return dataIndex === null ? <span>/</span> : <span>{dataIndex}</span>
        }
      },
      {
        title: '渠道',
        dataIndex: 'channelName',
        sorter: (a, b) => a.channelName - b.channelName,
        width: 110,
        render: (dataIndex, record) => {
          return dataIndex === null ? (
            <span>/</span>
          ) : (
            <span style={{ color: record.allot === 1 ? '#faad14' : 'rgba(0, 0, 0, 0.65)' }}>{dataIndex}</span>
          )
        }
      },
      {
        title: '领取状态',
        dataIndex: 'get',
        width: 95,
        render: (dataIndex, record) => {
          return record.get ? (
            <Icon type="check-circle" theme="filled" style={{ color: '#009900', fontSize: '20px' }} />
          ) : (
            <Icon type="close-circle" theme="filled" style={{ color: '#d42400', fontSize: '20px' }} />
          )
        }
      },
      {
        title: '查看次数',
        dataIndex: 'pv',
        sorter: (a, b) => a.pv - b.pv,
        width: 95,
        render: dataIndex => {
          return dataIndex === null ? <span>/</span> : <span>{dataIndex}</span>
        }
      },
      {
        title: '视频观看时长',
        dataIndex: 'playDuration',
        sorter: (a, b) => a.playDuration - b.playDuration,
        width: 150,
        render: dataIndex => {
          return dataIndex === null ? '/' : formatDatehhmmss(dataIndex)
        }
      },
      {
        title: '页面停留时长',
        dataIndex: 'stayDuration',
        sorter: (a, b) => a.stayDuration - b.stayDuration,
        width: 150,
        render: dataIndex => {
          return dataIndex === null ? '/' : formatDatehhmmss(dataIndex)
        }
      },
      {
        title: '发送消息记录',
        dataIndex: 'message',
        width: 140,
        render: (dataIndex, record) => {
          return dataIndex === null ? (
            <span>/</span>
          ) : (
            <span onClick={() => showHistoricalNews(record.id)} style={{ color: '#1890ff', cursor: 'pointer' }}>
              {dataIndex}
            </span>
          )
        }
      },
      {
        title: '关注时间',
        dataIndex: 'subscribeTime',
        sorter: (a, b) => a.subscribeTime - b.subscribeTime,
        width: 150,
        render: (dataIndex, record) => {
          return dataIndex === null ? '/' : <span style={{color: record.subscribe === 1 ? '#000' : '#F40505'}}>{formatDateTime(dataIndex)}</span>
        }
      },

      {
        title: '操作',
        dataIndex: 'opera',
        width: 90,
        render: (text, record) => (
          <div>
            <span
              className="user-text"
              style={{ color: 'rgb(35, 82, 124)', cursor: 'pointer', marginRight: '20px' }}
              onClick={() => editClick(record.id, record.remark)}
            >
              备注
            </span>
            <span
              className="user-text"
              style={{
                color: 'rgb(35, 82, 124)',
                cursor: 'pointer',
                display: this.canSendMsg(record) ? 'inline' : 'none'
              }}
              onClick={() => editMsg(record)}
            >
              发送消息
            </span>
            <span
              style={{
                color: '#888',
                cursor: 'text !important',
                display: !this.canSendMsg(record) ? 'inline' : 'none'
              }}
            >
              发送消息
            </span>
          </div>
        )
      }
    ]
    return (
      <Table
        key={record => record.id}
        rowKey={record => record.id}
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
    )
  }
}
