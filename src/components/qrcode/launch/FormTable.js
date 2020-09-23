import React, { Component } from 'react';
import { Table, Icon, Tooltip} from 'antd';
import {formatDateTime,returnFloat} from '../../../utils/filter'
import history from "../../common/History";


export default class FormTable extends Component{
    constructor(props){
        super(props);
    }

    //跳转到成单列表
    toOrder = (id, name) => {
        let data = {id: id, name: name};
        history.push({pathname: '/app/qrcode/order', state: data})
    };

    render(){
        const {changeSore, clickChannel,clickLink,clickEdit, dataSource, loading,clickRead ,clickArticle ,clickPayment} = this.props;
        const locale = {
            emptyText: '你要的数据如此珍稀，世界上并未发现'
        };
        const columns = [{
            title: '媒体名称',
            dataIndex: 'mediaName',
            width:100,
            render: (dataIndex) => {
                return dataIndex === null ?  <span>/</span> :
                    <div className="tool-warp">
                        <Tooltip placement="top" title={dataIndex}
                                 getPopupContainer={() => document.querySelector('.tool-warp')}>
                            <span className="ellipsis">{dataIndex}</span>
                        </Tooltip>
                    </div>

            }
        },{
            title: '学科',
            dataIndex: 'subjectName',
            width:70,
            render: (dataIndex) => {
                return dataIndex === null ?  <span>/</span> : <span>{dataIndex}</span>
            }
        },{
            title: 'QR',
            dataIndex: 'qr',
            width:50,
            sorter: (a, b) => a.qr - b.qr,
            render: (dataIndex, record) => {
                return (dataIndex === null || dataIndex === 0) ?  <span>/</span> : <span>{dataIndex}</span>
            }
        },{
            title: '阅读量',
            dataIndex: 'visitors',
            width:90,
            sorter: (a, b) => a.visitors - b.visitors,
            render: (dataIndex, record) =>{
                return (dataIndex === null || dataIndex === 0) ?
                    <span className="link-color" onClick={() => clickRead(record.id)}>0</span>
                    : <span className="link-color" onClick={() => clickRead(record.id)}>{dataIndex}</span>
            }
        },{
            title: 'UV',
            dataIndex: 'uv',
            width:50,
            sorter: (a, b) => a.uv - b.uv,
            render: (dataIndex) => {
                return (dataIndex === null || dataIndex === 0) ?  <span>/</span> : <span>{dataIndex}</span>
            }
        },{
            title: 'PV',
            dataIndex: 'pv',
            width:50,
            sorter: (a, b) => a.pv - b.pv,
            render: (dataIndex) => {
                return (dataIndex === null || dataIndex === 0) ?  <span>/</span> : <span>{dataIndex}</span>
            }
        },{
            title: '长按',
            dataIndex: 'press',
            width:70,
            sorter: (a, b) => a.press - b.press,
            render: (dataIndex) => {
                return (dataIndex === null || dataIndex === 0) ?  <span>/</span> : <span>{dataIndex}</span>
            }
        },{
          title: <Tooltip placement="top" title='该投放实际获取到的open ID个数'>
            <span>open ID个数</span><Icon type="info-circle"  style={{fontSize: '12px'}}  />
          </Tooltip>,
          dataIndex: 'openIdCount',
          width:70,
          // sorter: (a, b) => a.press - b.press,
          render: (dataIndex) => {
            return (dataIndex === null || dataIndex === 0) ?  <span>/</span> : <span>{dataIndex}</span>
          }
        },{
            title: '价格',
            dataIndex: 'price',
            width:70,
            sorter: (a, b) => a.price - b.price,
            render: (dataIndex) => {
                return dataIndex === null ?  <span>/</span> : <span>{returnFloat(dataIndex)}</span>
            }
        },{
            title: <Tooltip placement="top" title='新增好友数量'>
                <span>人数</span><Icon type="info-circle"  style={{fontSize: '12px'}}  />
            </Tooltip>,
            dataIndex: 'number',
            width:70,
            sorter: (a, b) => a.number - b.number,
            render: (dataIndex) => {
                return (dataIndex === null || dataIndex === 0) ?  <span>/</span> : <span>{dataIndex}</span>
            }
        },{
            title: <Tooltip placement="top" title='单价=总投入/人数'>
                <span>单价</span><Icon type="info-circle"  style={{fontSize: '12px'}}  />
            </Tooltip>,
            dataIndex: 'unitPrice',
            width:70,
            sorter: (a, b) => a.unitPrice - b.unitPrice,
            render: (dataIndex) => {
                return (dataIndex === null || dataIndex === 0) ?  <span>/</span> : <span>{returnFloat(dataIndex)}</span>
            }
        },{
            title: '成单量',
            dataIndex: 'orderQuantity',
            sorter: (a, b) => a.orderQuantity - b.orderQuantity,
            width: 90,
            render: (dataIndex, record) => dataIndex === null ? <span>/</span> :
                <span onClick={this.toOrder.bind(this, record.mediaId, record.mediaName)}
                      style={{color: 'rgb(24, 144, 255)', cursor: 'pointer'}}>{dataIndex}</span>
        },{
            title: '收入',
            dataIndex: 'income',
            sorter: (a, b) => a.income - b.income,
            width: 70,
            render: (dataIndex) => {
                return (dataIndex === null || dataIndex === 0) ?  <span>/</span> :
                    <span>{dataIndex}</span>}
        },{
            title: '付款截图',
            dataIndex: 'certificate',
            width:100,
            render: (dataIndex,record) => {
                return dataIndex === null ?  <span>/</span> :
                    <span className="link-color" onClick={() => clickPayment(record.certificate)}>查看截图</span>
            }
        },{
            title: '投放日期',
            dataIndex: 'createTime',
            width:100,
            sorter: (a, b) => a.createTime - b.createTime,
            render: (dataIndex) => {
                return dataIndex === null ? "/" : formatDateTime(dataIndex)
            }
        },{
            title: '文章标题',
            dataIndex: 'title',
            width:100,
            render:(dataIndex,record)=>{
                if (record.link == null && dataIndex == null) {
                    return (<span>/</span>);
                } else if(record.link == null){
                    return (
                        <div className="tool-warp">
                            <Tooltip placement="top" title={dataIndex}
                                     getPopupContainer={() => document.querySelector('.tool-warp')}>
                                <span style={{color:'#ccc'}}>{dataIndex}</span>
                            </Tooltip>
                        </div>


                    );
                }else{
                    return (
                        <div className="tool-warp">
                            <Tooltip placement="top" title={dataIndex}
                                     getPopupContainer={() => document.querySelector('.tool-warp')}>
                            <span className="link-color ellipsis"
                                  onClick={() => clickArticle(record.link)}>{dataIndex}</span>
                            </Tooltip>
                        </div>
                    )
                }
            }
        },{
            title: '操作',
            width:80,
            dataIndex: 'opera',
            render: (text, record) =>
                <div  className="link-color opera">
                    <p onClick={() => clickLink(record.id,record.mediaId,record.mediaName)}>
                         链接
                    </p>
                    <p  onClick={() => clickChannel(record.id,record.mediaId,record.mediaName)}>
                         渠道
                    </p>
                    <p  onClick={() => clickEdit(record.id,record.mediaId,record.mediaName)}>
                         编辑
                    </p>
                </div>
        }];
        return(
            <Table
                key={(record, i) => i}
                rowKey={(record, i) => i}
                rowSelection={null}
                columns={columns}
                dataSource={dataSource}
                bordered={false}
                scroll={{x: '100%'}}
                className='market-form launch-form'
                loading={loading}
                pagination={false}
                onChange={changeSore}
                locale={locale}
            />
        )
    }
}
