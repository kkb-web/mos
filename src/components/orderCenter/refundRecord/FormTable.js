import React, {Component} from 'react';
import {Badge, Table} from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import {formatDateTime,formatDateDay,priceType} from "../../../utils/filter";

export default class FormTable extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {changeSore, dataSource, loading} = this.props;
        const locale = {
            emptyText: '没有数据'
        };
        function renderRefundState(id) {
            if(id == 0){
                return <span>处理中</span>
            }else if (id == 1){
                return <span>已退款</span>
            }else if (id == 2){
                return <span>已驳回</span>
            }
        }

        const columns = [{
            title: '退款编号',
            dataIndex: 'id',
            width: 100,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span>: <span>/</span>
            }
        }, {
            title: '退款金额',
            dataIndex: 'applyAmount',
            width: 100,
            render: (dataIndex) => {
                return dataIndex ? <span>{priceType(dataIndex)}</span>: <span>/</span>
            }
        }, {
            title: '申请人',
            dataIndex: 'applyByName',
            // sorter: (a, b) => a.uv - b.uv,
            width: 80,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>0</span>
            }
        }, {
            title: '所属订单',
            dataIndex: 'orderId',
            // sorter: (a, b) => a.uv - b.uv,
            width: 90,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>0</span>
            }
        }, {
            title: '订单金额',
            dataIndex: 'orderAmount',
            // sorter: (a, b) => a.uv - b.uv,
            width: 90,
            render: (dataIndex) => {
                return dataIndex ? <span>{priceType(dataIndex)}</span> : <span>0</span>
            }
        }, {
            title: '已回款额',
            dataIndex: 'receivedAmount',
            // sorter: (a, b) => a.uv - b.uv,
            width: 90,
            render: (dataIndex) => {
                return dataIndex ? <span>{priceType(dataIndex)}</span> : <span>0</span>
            }
        }, {
            title: '申请时间',
            dataIndex: 'applyTime',
            // sorter: (a, b) => a.uv - b.uv,
            width: 130,
            render: (dataIndex) => {
                return dataIndex ? <span>{formatDateTime(dataIndex)}</span> : <span>0</span>
            }
        }, {
            title: '退款原因',
            dataIndex: 'remark',
            // sorter: (a, b) => a.uv - b.uv,
            width: 90,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
            }
        }, {
            title: '状态',
            dataIndex: 'status',
            // sorter: (a, b) => a.uv - b.uv,
            width: 80,
            render: (dataIndex) => dataIndex === 0 ? <span><Badge status="default" />待退款</span> : <span><Badge status="success" />已退款</span>
        }, {
            title: '退款人',
            dataIndex: 'execByName',
            // sorter: (a, b) => a.uv - b.uv,
            width: 80,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
            }
        }, {
            title: '退款时间',
            dataIndex: 'execTime',
            // sorter: (a, b) => a.uv - b.uv,
            width: 110,
            render: (dataIndex) => {
                return dataIndex ? <span>{formatDateDay(dataIndex)}</span> : <span>0</span>
            }
        }];
        return (
            <Table
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
                onChange={changeSore}
                locale={locale}
            />
        )
    }
}
