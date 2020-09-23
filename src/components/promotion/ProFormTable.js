import React from 'react';
import {Table, Tooltip, Popconfirm, confirm,message,Modal} from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import {
    formatDateTime,
    formatDateDay,
    renderPaymentMethod,
    renderPayType,
    priceType,
    getNum
} from "../../utils/filter";
import {urlAccountList,urlAccountPwd,urlAccountStatusEdit} from "../../api/accountApi";
import {getSubjectsSelect, getEngineDetail, getEngineList, getCampaignAll, getAllotDrop} from "../../api/promotionApi";

export default class ProFormTable extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      subjects: {
        "1": "web",
        "2": "java",
        "3": "ptthon",
        "4": ".net",
        "5": "ai",
        "6": "后厂理工学院"
      }
    }
  }

  showConfirm = (e) => {
      let value = e.target.getAttribute("data-val"),
          id = e.target.getAttribute("data-id");
      Modal.confirm({
          title: `确定${value}此帐号`,
          content: value == '启用' ? '帐号启用后，即可正常使用该系统。'
              :'帐号被禁用后，无法登陆该系统，之前产生的数据不受影响。',
          cancelText:'取消',
          okText:'确定',
          onOk(){
              let status = null;
              value == '启用' ? status = 1 : status = 0;
              let sendData = {
                  id: Number(id),
                  status: Number(status)
              };

              urlAccountStatusEdit(sendData).then(response=>{
                  //更改启用或者禁用状态
                  if(response.data.code === 0){
                      this.accountList();
                  }else if(response.data.code == 10001){
                      message.error(response.data.msg)
                  }else if(response.data.code == 400){
                      message.error(response.data.msg)
                  }
              }).catch(err =>{
                  console.log('urlAccountStatusEdit',err)
              })
          },
      });
  };
  subjectNameToId = (id)=>{
    let data = this.props.subjectList;
    for (let i=0;i<data.length;i++){
      if(data[i].id == id){
        return data[i].name
      }
    }
  };

  // <div>
  //   <div className="promotion-opera" onClick={() => editClick()}>编辑</div>
  //   <div className="promotion-opera" onClick={() => editEngineClick()}>分配引擎</div>
  // </div>
  render() {
    const {dataSource, moneyClick, editClick, loading, editMoneyClick, onDelete, editEngineClick, editCampaign, subjects} = this.props
  
    const locale = {
      emptyText: '没有数据'
    }

    const columns = [
      {
        title: '推广Code',
        dataIndex: 'code',
        width: 100,
        render: (dataIndex) => {
          return dataIndex ? <span>{dataIndex}</span> : <span></span>
        }
      },
      {
        title: '推广平台',
        dataIndex: 'platform',
        width: 100,
        render: (dataIndex) => {
          return dataIndex ? <span>{dataIndex}</span> : <span></span>
        }
      },
      {
        title: '推广名称',
        dataIndex: 'name',
        width: 100,
        render: (dataIndex) => {
          return dataIndex ? <span>{dataIndex}</span> : <span></span>
        }
      },
      {
        title: '所属学科',
        dataIndex: 'subjects',
        width: 100,
        render: (dataIndex) => {
          return dataIndex ? <span>{this.subjectNameToId(dataIndex)}</span> : <span></span>
        }
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 100,
        render: (dataIndex, record) =>
          <div>
          <span style={{color: record.status === 1 ? '#1890FF' : '#f00', margin: '0 2px', cursor: 'pointer'}}>
              <Popconfirm
                  placement="topRight"
                  title={`确定修改状态为${record.status === 1 ? '停用' : '启用'}吗？`}
                  cancelText="取消"
                  okText="确定"
                  onConfirm={() => onDelete(record.id, record.status)}
                  getPopupContainer={() => document.getElementById('tb')}
              >
                  {record.status === 1 ? '启用' : '停用'}
              </Popconfirm>
          </span>
          </div>
      },
      {
        title: '剩余推广金额',
        dataIndex: 'surplusAmount',
        width: 120,
        className: 'media-name-td',
        render: (dataIndex,record) => {
          return <span style={{color: '#1890FF', cursor: 'pointer'}} onClick={() => editMoneyClick(record.id)}>
              {dataIndex ? `￥${dataIndex}` : '请填写'}
          </span>
        }
      },
      {
        title: '创建人',
        dataIndex: 'createBy',
        width: 80,
        render: (dataIndex) => {
          return dataIndex ? <span>{dataIndex}</span> : <span></span>
        }
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 120,
        render: (dataIndex) => {
          return dataIndex ? <span>{formatDateTime(dataIndex)}</span> : <span>/</span>
        }
      },
      {
        title: '操作',
        dataIndex: 'opera',
        width: 140,
        render: (dataIndex, record) => {
          return <div>
            <div style={{color: '#1890FF', cursor: 'pointer'}} onClick={() => editCampaign(record.id, record.code)}>编辑</div>
            <div style={{color: '#1890FF', cursor: 'pointer'}} onClick={() => editEngineClick(record.code)}>配置分配引擎</div>
          </div>
        }
      }
    ]

    return (
      <Table
        id={"tb"}
        key={(record, i) => i}
        rowKey={(record, i) => i}
        rowSelection={null}
        columns={columns}
        dataSource={dataSource}
        bordered={true}
        scroll={{x: '100%'}}
        className='formTable'
        loading={loading}
        pagination={false}
        locale={locale}
      />
    )
  }
}
