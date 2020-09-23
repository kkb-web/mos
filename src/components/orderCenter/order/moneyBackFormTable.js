import React, {Component} from 'react';
import {Table, Tooltip, Popconfirm, Badge} from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import {formatDateTime, formatDateDay, priceType} from "../../../utils/filter";

export default class FormTable extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {changeSore, dataSource, loading,refundFn,moneyBackFn,moneyBackDetailFn,billStateFn,alreadyPayFn,signUpTabFn,addcanBackMoneyDetail} = this.props;

        function renderOrderState(id) {
            if(id == 1){
                return <span>已完成</span>
            }else if (id == 2){
                return <span>待付款</span>
            }else if (id == 3){
                return <span>已取消</span>
            }
        }
        const locale = {
            emptyText: '没有数据'
        };
        const columns = [{
            title: '退款编号',
            dataIndex: 'no',
            width: 100,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
            }
        }, {
            title: '申请人',
            dataIndex: 'applyByName',
            width: 80,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>后台订单</span>
            }
        }, {
            title: '申请时间',
            dataIndex: 'applyTime',
            // sorter: (a, b) => a.uv - b.uv,
            width: 110,
            render: (dataIndex) => {
                return dataIndex ? <span className="class-color">{formatDateTime(dataIndex)}</span> : <span>0</span>
            }
        }, {
            title: '退款金额',
            dataIndex: 'applyAmount',
            // sorter: (a, b) => a.uv - b.uv,
            width: 80,
            render: (dataIndex) => {
                return dataIndex ? <span>{priceType(dataIndex)}</span> : <span>/</span>
            }
        }, {
            title: '类型',
            dataIndex: 'updateStatusTime',
            // sorter: (a, b) => a.uv - b.uv,
            width: 70,
            render: (dataIndex) => {
                return <span>退款</span>
            }
        },{
            title: '退款原因',
            dataIndex: 'remark',
            // sorter: (a, b) => a.uv - b.uv,
            width: 100,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
            }
        }, {
            title: '状态',
            dataIndex: 'signUp',
            // sorter: (a, b) => a.uv - b.uv,
            width: 70,
            render: (dataIndex) => dataIndex === 0 ? <span><Badge status="default" />待退款</span> : <span><Badge status="success" />已退款</span>
        }, {
            title: '退款人',
            dataIndex: 'execByName',
            // sorter: (a, b) => a.uv - b.uv,
            width: 70,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
            }
        }, {
            title: '退款时间',
            dataIndex: 'execTime',
            // sorter: (a, b) => a.uv - b.uv,
            width: 110,
            render: (dataIndex) => {
                return dataIndex ? <span>{formatDateTime(dataIndex)}</span> : <span>/</span>
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
