import React, { Component } from 'react';
import { Table, Popconfirm } from 'antd';
import {formatDateTime} from '../../../utils/filter'
import { Link } from 'react-router-dom';

export default class FormTable extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const { checkChange, onDelete, editClick, changeSore, dataSource, loading } = this.props;
        const rowSelection = {
                onChange: checkChange,
                getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
            }),
        };
        const locale = {
            emptyText: '没有数据'
        };
        const columns = [{
            title: '名称',
            dataIndex: 'title',
            width: 180,
            render: (dataIndex, record) => <Link to={'/app/qrcode/edit/' + record.id}><span style={{color: 'rgb(35, 82, 124)', cursor: 'pointer'}}>{dataIndex}</span></Link>,
        },{
            title: 'PV',
            dataIndex: 'pvCount',
            sorter: (a, b) => a.pvCount - b.pvCount,
            width: 90,
            render: (dataIndex) => dataIndex === null ? <span>/</span> : <span>{dataIndex}</span>
        },{
            title: 'UV',
            dataIndex: 'uvCount',
            sorter: (a, b) => a.uvCount - b.uvCount,
            width: 90,
            render: (dataIndex) => dataIndex === null ? <span>/</span> : <span>{dataIndex}</span>
        },{
            title: 'QR数',
            dataIndex: 'qrCodeThumbnailsCount',
            sorter: (a, b) => a.qrCodeThumbnailsCount - b.qrCodeThumbnailsCount,
            width: 100,
        },{
            title: '状态',
            dataIndex: 'status',
            sorter: (a, b) => a.status - b.status,
            width: 100,
            render: (dataIndex) => {
                return dataIndex === 1 ? <span style={{color: '#009900'}}>已上架</span> : <span style={{color: '#FF6600'}}>已下架</span>
            }
        },{
            title: '修改时间',
            dataIndex: 'updateTime',
            sorter: (a, b) => a.updateTime - b.updateTime,
            width:140,
            render: (dataIndex) => {
                return formatDateTime(dataIndex/1000)
            }
        },{
            title: '创建时间',
            dataIndex: 'createTime',
            sorter: (a, b) => a.createTime - b.createTime,
            width:140,
            render: (dataIndex) => {
                return formatDateTime(dataIndex)
            }
        },{
            title: '操作',
            dataIndex: 'opera',
            width:170,
            render: (text, record) =>
                <div className='opera'>
                    {record.status=== 1 ?<span style={{color: 'rgb(35, 82, 124)'}} onClick={() => editClick(record.id)}>
                         获取链接
                    </span> : <span style={{color: '#7d7a7a'}}>
                        <Popconfirm title="请上架，上架后才可获取链接！">
                            获取链接
                        </Popconfirm>
                    </span>}
                    <Link to={'/app/qrcode/edit/' + record.id}>
                        <span style={{color: 'rgb(35, 82, 124)', marginLeft: '5px'}}>
                            编辑
                        </span>
                    </Link>
                    <span style={{color: 'rgb(35, 82, 124)', marginLeft: '5px'}}>
                        <Popconfirm title="确定当前操作吗?" onConfirm={() => onDelete(record.id, record.status)}>
                            {record.status=== 1 ? '下架' : '上架'}
                        </Popconfirm>
                    </span>
                </div>
        }];
        return(
            <Table
                key ={record => record.id}
                rowKey={record => record.id}
                rowSelection={rowSelection}
                columns={columns}
                dataSource={dataSource}
                bordered={true}
                scroll={{x:'100%'}}
                className='formTable'
                loading={loading}
                pagination={false}
                onChange={changeSore}
                locale={locale}
            />
        )
    }
}
