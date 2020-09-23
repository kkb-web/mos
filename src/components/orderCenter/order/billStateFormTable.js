import React, {Component} from 'react';
import {Table, Tooltip, Popconfirm} from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import {formatDateTime, formatDateDay, priceType} from "../../../utils/filter";

export default class FormTable extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {changeSore, dataSource, loading,refundFn,moneyBackFn,moneyBackDetailFn,billStateFn,alreadyPayFn,signUpTabFn} = this.props;

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
            title: '开票编号',
            dataIndex: 'no',
            width: 100
        }, {
            title: '开票金额',
            dataIndex: 'amount',
            width: 90,
            render: (dataIndex) => {
                return dataIndex ? <span>{priceType(dataIndex)}</span> : <span>后台订单</span>
            }
        }, {
            title: '销售',
            dataIndex: 'sellerName',
            // sorter: (a, b) => a.uv - b.uv,
            width: 70,
            render: (dataIndex) => {
                return dataIndex ? <span className="class-color">{dataIndex}</span> : <span>0</span>
            }
        }, {
            title: '上课学员',
            dataIndex: 'trackName',
            // sorter: (a, b) => a.uv - b.uv,
            width: 70,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
            }
        }, {
            title: '发票类型',
            dataIndex: 'type',
            // sorter: (a, b) => a.uv - b.uv,
            width: 80,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
            }
        }, {
            title: '发票抬头',
            dataIndex: 'title',
            // sorter: (a, b) => a.uv - b.uv,
            width: 100,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
            }
        }, {
            title: '课程',
            dataIndex: 'itemName',
            // sorter: (a, b) => a.uv - b.uv,
            width: 90,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
            }
        }, {
            title: '开票人',
            dataIndex: 'execName',
            // sorter: (a, b) => a.uv - b.uv,
            width: 80,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
            }
        }, {
            title: '开票时间',
            dataIndex: 'execTime',
            // sorter: (a, b) => a.uv - b.uv,
            width: 80,
            render: (dataIndex) => {
                return dataIndex ? <span>{formatDateTime(dataIndex)}</span> : <span>/</span>
            }
        }, {
            title: '发票号码',
            dataIndex: 'taxes',
            // sorter: (a, b) => a.uv - b.uv,
            width: 80,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
            }
        }, {
            title: '备注',
            dataIndex: 'remark',
            // sorter: (a, b) => a.uv - b.uv,
            width: 80,
            render: (dataIndex,record) => {
                return dataIndex ? <span onClick={()=>alreadyPayFn(record.id)} className="class-color">{dataIndex}</span> : <span>/</span>
            },
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
