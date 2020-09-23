import React, { Component } from 'react';
import { Table, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { formatDateTime, priceType, renderOrderState, payStatus, auditState } from "../../../utils/filter";

export default class FormTable extends Component {

  render() {
    const { changeSore, dataSource, loading, refundFn, moneyBackFn, moneyBackDetailFn, billStateFn, alreadyPayFn, signUpTabFn, getdetail } = this.props;

    const locale = {
      emptyText: '没有数据'
    };
    const columns = [{
      title: '订单编号',
      dataIndex: 'outOrderId',
      width: 100,
      fixed: 'left',
      render: (dataIndex) => {
        return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
      }
    }, {
      title: '订单类型',
      dataIndex: 'type',
      render: (dataIndex) => {
        return dataIndex === 0 ? <span>线上订单</span> : <span>后台订单</span>
      }
    }, {
      title: '课程分类',
      dataIndex: 'courseType',
      render: (dataIndex) => {
        return dataIndex === 0 ? <span>vip课程</span> : <span>低价小课</span>
      }
    }, {
      title: '微信头像',
      dataIndex: 'headimgurl',
      render: (dataIndex) => (
        !dataIndex ?
          <Icon type="user" /> :
          <img src={dataIndex} alt="headimgurl" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />)
    }, {
      title: '微信昵称',
      dataIndex: 'nickname',
      render: (dataIndex) => {
        return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
      }
    }, {
      title: '上课学员',
      dataIndex: 'trackName',
      // sorter: (a, b) => a.uv - b.uv,
      // width: 70,
      render: (dataIndex) => {
        return dataIndex ? <Link to={'/app/usercenter/myuser'}><span className="class-color">{dataIndex}</span></Link> :
          <span>/</span>
      }
    }, {
      title: '成单人',
      dataIndex: 'sellerName',
      // sorter: (a, b) => a.uv - b.uv,
      // width: 70,
      render: (dataIndex) => {
        return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
      }
    }, {
      title: '课程',
      dataIndex: 'courseName',
      // sorter: (a, b) => a.uv - b.uv,
      // width: 90,
      render: (dataIndex) => {
        return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
      }
    }, {
      title: '班次',
      dataIndex: 'className',
      // sorter: (a, b) => a.uv - b.uv,
      // width: 70,
      render: (dataIndex) => {
        return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
      }
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      // sorter: (a, b) => a.uv - b.uv,
      // width: 100,
      render: (dataIndex) => {
        return dataIndex ? <span>{formatDateTime(dataIndex)}</span> : <span>/</span>
      }
    }, {
      title: '课程原价',
      dataIndex: 'price',
      // sorter: (a, b) => a.uv - b.uv,
      // width: 90,
      render: (dataIndex) => {
        return dataIndex ? <span>{priceType(dataIndex)}</span> : <span>/</span>
      }
    }, {
      title: '优惠金额',
      dataIndex: 'discount',
      // sorter: (a, b) => a.uv - b.uv,
      // width: 80,
      render: (dataIndex) => {
        return dataIndex ? <span>{priceType(dataIndex)}</span> : <span>0</span>
      }
    }, {
      title: '应付金额',
      dataIndex: 'amount',
      // sorter: (a, b) => a.uv - b.uv,
      // width: 80,
      render: (dataIndex) => {
        return dataIndex ? <span>{priceType(dataIndex)}</span> : <span>/</span>
      }
    }, {
      title: '已付金额',
      dataIndex: 'payAmount',
      // sorter: (a, b) => a.uv - b.uv,
      // width: 80,
      render: (dataIndex, record) => {
        return dataIndex ? <span onClick={() => alreadyPayFn(record.outOrderId, record)}
          className="class-color">{priceType(dataIndex)}</span> : <span>/</span>
      },
    }, {
      title: '订单状态',
      dataIndex: 'orderStatus',
      // sorter: (a, b) => a.uv - b.uv,
      // width: 70,
      render: (dataIndex, record) => {
        let data;
        data = record.audit_status ? `${renderOrderState(dataIndex)}(${auditState(record.audit_status)}-${payStatus(record.pay_status)})` : `${renderOrderState(dataIndex)}`;
        return dataIndex !== null ? data : <span>/</span>
      },
    }, {
      title: '发票',
      dataIndex: 'invoiceStatus',
      // sorter: (a, b) => a.uv - b.uv,
      // width: 70,
      render: (dataIndex, record) => {
        return dataIndex === 1 ?
          <span onClick={() => billStateFn(record.outOrderId)} className="class-color">已开</span> : <span>/</span>
      },
    }, {
      title: '操作',
      dataIndex: 'opera',
      width: 100,
      fixed: 'right',
      render: (dataIndex, record) =>
        <div>
          {
            <div className="ordercenter-opera">
              <div>
                <span
                  style={{ display: record.orderStatus === 0 || record.orderStatus === 4 || record.orderStatus === 6 ? 'none' : 'block' }}
                  onClick={() => refundFn(record.outOrderId)} className="ordercenter-opera-refund">退款</span>
                <span style={{ display: record.orderStatus === 4 || record.orderStatus === 5 ? 'block' : 'none' }}
                  onClick={() => moneyBackDetailFn(record.outOrderId)}
                  className="ordercenter-opera-refund2">退款详情</span>
              </div>
              <div>
                {
                  record.entryBlank !== 1 ? <span onClick={() => signUpTabFn('signUpTab', record.id)}
                    style={{ display: record.courseType == 1 ? 'none' : 'block' }}
                    className="ordercenter-opera-gettab">获取报名表</span> :
                    <span onClick={() => getdetail(record.outOrderId, record.trackId)}
                      style={{ color: '#999', cursor: 'default' }}>已填表</span>

                  // record.type == 0 ? <span style={{color:'#999',cursor: 'default'}} >获取报名表</span> : ((record.entryBlank == 2 && record.entryBlank !== null) ? <span onClick={()=>signUpTabFn(record.id)} className="ordercenter-opera-gettab">获取报名表</span> : <span style={{color:'#999',cursor: 'default'}} >获取报名表</span>)
                }
              </div>
              <div>
                <span
                  style={{ display: (record.orderStatus === 0 || record.orderStatus === 1) && record.type !== 0 ? 'block' : 'none' }}
                  onClick={() => moneyBackFn(record.outOrderId)} className="ordercenter-opera-back">回款</span>
              </div>
              <div>
                <span style={{ display: record.isForm === 1 ? 'inline-block' : 'none' }} onClick={() => signUpTabFn('preSignUpTab', record.outOrderId)} className="ordercenter-opera-gettab">获取分享海报</span>
              </div>
            </div>
          }
        </div>
    }];
    return (
      <Table
        key={(record, i) => i}
        rowKey={(record, i) => i}
        rowSelection={null}
        columns={columns}
        dataSource={dataSource}
        bordered={true}
        scroll={{ x: 1600 }}
        className='formTable'
        loading={loading}
        pagination={false}
        onChange={changeSore}
        locale={locale}
        getdetail={getdetail}
      />
    )
  }
}
