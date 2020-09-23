import React, { Component } from 'react';
import { Table } from 'antd';
import {formatDateTime} from '../../../../utils/filter'
import { Link } from 'react-router-dom';

export default class FormTable extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const {changeSore, dataSource, loading } = this.props;
        const locale = {
            emptyText: '没有数据'
        };
        const columns = [{
            title: 'ID',
            dataIndex: 'id',
            sorter: (a, b) => a.id - b.id,
            width: 60,
            render: (dataIndex) => {
                return dataIndex
            },
        },{
            title: 'IMEI',
            dataIndex: 'imei',
            width: 180,
            render: (dataIndex) => <span style={{}}>{dataIndex}</span>,
        },{
            title: '手机型号',
            dataIndex: 'type',
            width: 120,
            render: (dataIndex) => <span style={{}}>{dataIndex}</span>,
        },{
            title: '营销号数',
            dataIndex: 'sellerCount',
            sorter: (a, b) => a.sellerCount - b.sellerCount,
            width: 120,
            render: (dataIndex) =>dataIndex == null ? "/" : <span>{dataIndex}</span>,
        },{
            title: '所属销售',
            dataIndex: 'sellerName',
            width:120,
            render: (dataIndex) => dataIndex == null ? "/" : <span>{dataIndex}</span>
        },{
            title: '创建时间',
            dataIndex: 'createTime',
            sorter: (a, b) => a.createTime - b.createTime,
            width:160,
            render: (dataIndex) => {
                return dataIndex == null ? '/' : formatDateTime(dataIndex)
            }
        },{
            title: '操作',
            dataIndex: 'opera',
            width:120,
            render: (text, record) =>
                <div className='opera'>
                    <Link to={'/app/authority/device/edit/' + record.id}>
                        <span style={{color: 'rgb(35, 82, 124)', marginLeft: '5px'}}>
                            编辑
                        </span>
                    </Link>
                </div>
        }];
        return(
            <Table
                key ={record => record.id}
                rowKey={record => record.id}
                columns={columns}
                dataSource={dataSource}
                bordered={false}
                scroll={{x:'100%'}}
                className='device-formTable'
                loading={loading}
                pagination={false}
                onChange={changeSore}
                locale={locale}
            />
        )
    }
}