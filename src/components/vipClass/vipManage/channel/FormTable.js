import React, { Component } from 'react';
import { Table } from 'antd';
// import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import {formatDateTime, priceType} from '../../../../utils/filter'

export default class FormTable extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const { changeSore, showLink, dataSource, loading ,sellerData,filteredInfo} = this.props;
        const locale = {
            emptyText: '没有数据'
        };
        const columns = [{
            title: '渠道code',
            dataIndex: 'code',
            width: 80,
            render: (dataIndex) => <span>{dataIndex ? dataIndex: '/'}</span>
        },{
            title: '渠道名称',
            dataIndex: 'name',
            width: 150,
            render: (dataIndex) => <span>{dataIndex}</span>
        },{
            title: '销售',
            dataIndex: 'salesName',
            filters: sellerData,
            filteredValue: filteredInfo.salesName || null,
            width: 80,
            render: (dataIndex) => <span>{dataIndex ? dataIndex: '/'}</span>
        },{
            title: 'uv',
            dataIndex: 'uv',
            sorter: (a, b) => a.uv - b.uv,
            width: 80,
            render: (dataIndex) => <span>{dataIndex ? dataIndex: '/'}</span>
        },{
            title: 'pv',
            dataIndex: 'pv',
            sorter: (a, b) => a.pv - b.pv,
            width: 80,
            render: (dataIndex) => <span>{dataIndex ? dataIndex: '/'}</span>
        },
        //     {
        //     title: '最新单价',
        //     dataIndex: 'price',
        //     sorter: (a, b) => a.price - b.price,
        //     width: 100,
        //     render: (dataIndex,record) => <div className="opera"><span onClick={() => showHistoryPrice(record.id)} style={{color: 'rgb(24, 144, 255)'}}>{dataIndex ? getNum(dataIndex): '/'}</span></div>
        // },
            {
            title: '报名',
            dataIndex: 'signUp',
            // sorter: (a, b) => a.signUp - b.signUp,
            width: 80,
                render: (dataIndex,record) => <div className="opera"><span>{dataIndex ? dataIndex: '0'}</span></div>
            // render: (dataIndex,record) => <div className="opera"><span  onClick={() => showHistoryPrice(record.id)} style={{color: 'rgb(24, 144, 255)'}}>{dataIndex ? dataIndex: '0'}</span></div>
        },{
            title: '销售额',
            dataIndex: 'sale',
            sorter: (a, b) => a.sale - b.sale,
            width: 110,
            render: (dataIndex) => <span>{dataIndex ? priceType(dataIndex): '/'}</span>
        },{
            title: ' 创建时间',
            dataIndex: 'createTime',
            sorter: (a, b) => a.createTime - b.createTime,
            width:140,
            render: (dataIndex) => {
                return dataIndex ? formatDateTime(dataIndex) : "/"
            }
        },{
            title: '操作',
            dataIndex: 'opera',
            width: 110,
            render: (dataIndex, record) =>
                <div className='opera'>
                    <span style={{color: 'rgb(24, 144, 255)'}} onClick={() => showLink(record.code,record.appId)}>
                        二维码
                    </span>
                    <span style={{color: 'rgb(24, 144, 255)', marginLeft: '5px'}} onClick={() => showLink(record.code,record.appId)}>链接</span>
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
