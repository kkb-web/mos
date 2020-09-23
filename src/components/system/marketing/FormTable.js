import React, { Component } from 'react';
import { Table, Icon, Popconfirm} from 'antd';
import {formatDateTime, formatDatehhmmss} from '../../../utils/filter'

export default class FormTable extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const { changeFriNum, changeSore, editClick, dataSource, loading } = this.props;
        const locale = {
            emptyText: '没有数据'
        };
        const columns = [{
            title: '学科-编号',
            dataIndex: 'subjectNo',
            width: 120,
            render: (dataIndex) => {
                return dataIndex ? dataIndex: "/"
            }
        },{
            title: '营销号',
            dataIndex: 'wechat',
            width: 120,
            render: (dataIndex) => {
                return dataIndex === null ?  <span>/</span> : <span>{dataIndex}</span>
            }
        },{
            title: '好友',
            dataIndex: 'friends',
            sorter: (a, b) => a.friends - b.friends,
            width: 95,
            render: (dataIndex, record) => {
                return dataIndex === null ?  <span>/</span> :
                    <div>
                        <span style={{color: '#1890FF', cursor: 'pointer'}} onClick={() => changeFriNum(record.id, record)}>
                            {dataIndex}
                        </span>
                        <span style={{color: '#FF0000', fontSize: '12px', verticalAlign: 'top', display: record.friendsChangeType === 2 ? 'inline' : 'none'}}>
                            <Icon style={{paddingLeft: '5px', fontSize: '10px', fontWeight: '100',  verticalAlign: 'top'}} type="arrow-up" theme="outlined" />
                            {record.modify}
                        </span>
                        <span style={{color: '#669900', fontSize: '12px', verticalAlign: 'top', display: record.friendsChangeType === 1 ? 'inline' : 'none'}}>
                            <Icon style={{paddingLeft: '5px', fontSize: '10px', fontWeight: '100',  verticalAlign: 'top'}} type="arrow-down" theme="outlined" />
                            {record.modify}
                        </span>
                    </div>
            }
        },{
            title: '设备IMEI',
            dataIndex: 'imei',
            width: 150,
            render: (dataIndex) => {
                return dataIndex ? dataIndex: "/"
            }
        },{
            title: '所属销售',
            dataIndex: 'salesName',
            width: 120,
            render: (dataIndex) => {
                return dataIndex ? dataIndex: "/"
            }
        },{
            title: '创建时间',
            dataIndex: 'createTime',
            sorter: (a, b) => a.createTime - b.createTime,
            width:150,
            render: (dataIndex) => {
                return dataIndex === null ? "/" : formatDateTime(dataIndex)
            }
        },{
            title: '操作',
            dataIndex: 'opera',
            width:90,
            render: (text, record) =>
                <div className='opera' style={{display: !record.imei ? 'block' : 'none', cursor: 'pointer'}}>
                    <span style={{color: '#1890FF'}} onClick={() => editClick(record.id)}>
                         选择设备
                    </span>
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
                className='market-form'
                loading={loading}
                pagination={false}
                onChange={changeSore}
                locale={locale}
            />
        )
    }
}
