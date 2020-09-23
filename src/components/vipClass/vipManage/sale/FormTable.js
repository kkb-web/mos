import React, { Component } from 'react';
import { Table } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import {formatDateDay, formatDateTime, priceType} from '../../../../utils/filter'

export default class FormTable extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const { changeSore, editClick, editClass, editFriendTime, dataSource, loading } = this.props;
        const locale = {
            emptyText: '没有数据'
        };
        const columns = [{
            title: '用户头像/昵称/备注',
            dataIndex: 'nickname',
            width: 160,
            render: (dataIndex, record) =>
                <div className='opera' style={{textAlign: 'left'}}>
                    <div style={{width: '35%', maxWidth: '50px', verticalAlign: 'top', display: 'inline-block'}}>
                        {record.image ? <img style={{width: '100%', maxWidth: '50px'}} src={record.image} alt=""/> : <p style={{marginLeft: '20px'}}>/</p>}
                    </div>
                    <div style={{display: 'inline-block', verticalAlign: 'top', maxWidth: '65%'}}>
                        {dataIndex ? <p style={{marginBottom: '5px', paddingLeft: '15px'}}>{dataIndex}</p> : <p style={{marginLeft: '30px'}}>/</p>}
                        <Ellipsis tooltip lines={1} style={{paddingLeft: '15px'}}>{record.remark ? record.remark : '/'}</Ellipsis>
                    </div>
                </div>
        },{
            title: '班次',
            dataIndex: 'className',
            width: 100,
            render: (dataIndex, record) =>
                <div className='opera'>
                    <span style={{color: record.editTime ? '#FF0000' : 'rgb(35, 82, 124)'}} onClick={() => editClass(record)}>
                        {dataIndex}
                    </span>
                </div>
        },{
            title: '所属公众号',
            dataIndex: 'appId',
            width: 120,
            render: (dataIndex) => <span>{dataIndex ? dataIndex: '/'}</span>
        },{
            title: '销售',
            dataIndex: 'salesName',
            width: 100,
            render: (dataIndex) => <span>{dataIndex ? dataIndex: '/'}</span>
        },{
            title: '渠道',
            dataIndex: 'channelName',
            width: 120,
            render: (dataIndex) => <span>{dataIndex ? dataIndex: '/'}</span>
        },{
            title: '成交金额',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
            width: 100,
            render: (dataIndex) => <span>{dataIndex ? priceType(dataIndex): '/'}</span>
        },
        //     {
        //     title: '支付方式',
        //     dataIndex: 'payType',
        //     width: 90,
        //     render: (dataIndex) => <span>{dataIndex ? (dataIndex === 'WECHAT' ? '微信' : '支付宝') : '/'}</span>
        // },
            {
            title: '成交时间',
            dataIndex: 'payTime',
            sorter: (a, b) => a.payTime - b.payTime,
            width:150,
            render: (dataIndex) => {
                return dataIndex ? formatDateTime(dataIndex) : "/"
            }
        },{
            title: '加好友时间',
            dataIndex: 'friendTime',
            width: 120,
            render: (dataIndex, record) =>
                dataIndex ? formatDateDay(dataIndex) :
                <div className='opera'>
                    <span style={{color: 'rgb(35, 82, 124)'}} onClick={() => editFriendTime(record)}>
                        去完善
                    </span>
                </div>
        },{
            title: '操作',
            dataIndex: 'opera',
            width: 90,
            render: (dataIndex, record) =>
                <div className='opera'>
                    <span style={{color: 'rgb(35, 82, 124)'}} onClick={() => editClick(record)}>
                         备注
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
