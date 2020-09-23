import React, { Component } from 'react';
import { Table, Icon, Popconfirm} from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import {formatDateTime, formatDatehhmmss} from '../../../utils/filter'

export default class FormTable extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const { changeSore, editClick, dataSource, loading } = this.props;
        const locale = {
            emptyText: '没有数据'
        };
        const columns = [{
            title: '销售',
            dataIndex: 'sellerName',
            width: 120
        },{
            title: '渠道名称',
            dataIndex: 'name',
            width: 120,
            render: (dataIndex) => {
                return dataIndex ? <Ellipsis tooltip lines={1}>{dataIndex}</Ellipsis> : <span>/</span>
            }
        },{
            title: 'UV',
            dataIndex: 'uv',
            sorter: (a, b) => a.uv - b.uv,
            width: 90,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
            }
        },{
            title: 'PV',
            dataIndex: 'pv',
            sorter: (a, b) => a.pv - b.pv,
            width: 90,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
            }
        },{
            title: '报名',
            dataIndex: 'signupCount',
            sorter: (a, b) => a.signupCount - b.signupCount,
            width: 95,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
            }
        },{
            title: '关注人数',
            dataIndex: 'subscribeCount',
            sorter: (a, b) => a.subscribeCount - b.subscribeCount,
            width: 90,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
            }
        },{
            title: '销售额',
            dataIndex: 'sale',
            sorter: (a, b) => a.sale - b.sale,
            width: 90,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
            }
        },{
            title: '创建时间',
            dataIndex: 'createTime',
            sorter: (a, b) => a.createTime - b.createTime,
            width:150,
            render: (dataIndex) => {
                return dataIndex ? formatDateTime(dataIndex) : "/"
            }
        },{
            title: '操作',
            dataIndex: 'opera',
            width:90,
            render: (text, record) =>
                <div className='opera'>
                    <span style={{color: 'rgb(35, 82, 124)'}} onClick={() => editClick(record.id, record)}>
                         获取海报
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
                className='formTable'
                loading={loading}
                pagination={false}
                onChange={changeSore}
                locale={locale}
            />
        )
    }
}
