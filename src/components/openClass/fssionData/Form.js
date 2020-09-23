import React, { Component } from 'react';
import { Table} from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';

export default class FormTable extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const { changeSore, dataSource, loading } = this.props;
        const locale = {
            emptyText: '没有数据'
        };
        const columns = [{
            title: '销售',
            dataIndex: 'sellerName',
            width: 80
        },{
            title: '渠道名称',
            dataIndex: 'name',
            width: 120,
            render: (dataIndex) => {
                return dataIndex ? <Ellipsis tooltip lines={1}>{dataIndex}</Ellipsis> : <span>/</span>
            }
        },{
            title: '一度报名',
            dataIndex: 'levelOneSignup',
            sorter: (a, b) => a.uv - b.uv,
            width: 90,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>0</span>
            }
        },{
            title: '二度报名',
            dataIndex: 'levelTwoSignup',
            sorter: (a, b) => a.uv - b.uv,
            width: 90,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>0</span>
            }
        },{
            title: '三度报名',
            dataIndex: 'levelThreeSignup',
            sorter: (a, b) => a.uv - b.uv,
            width: 90,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>0</span>
            }
        },{
            title: '三度以上报名',
            dataIndex: 'levelAuthSignup',
            sorter: (a, b) => a.uv - b.uv,
            width: 90,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>0</span>
            }
        },{
            title: '一度关注',
            dataIndex: 'levelOneSubscribe',
            sorter: (a, b) => a.uv - b.uv,
            width: 90,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>0</span>
            }
        },{
            title: '二度关注',
            dataIndex: 'levelTwoSubscribe',
            sorter: (a, b) => a.uv - b.uv,
            width: 90,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>0</span>
            }
        },{
            title: '三度关注',
            dataIndex: 'levelThreeSubscribe',
            sorter: (a, b) => a.uv - b.uv,
            width: 90,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>0</span>
            }
        },{
            title: '三度以上关注',
            dataIndex: 'levelAuthSubscribe',
            sorter: (a, b) => a.uv - b.uv,
            width: 90,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>0</span>
            }
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
