import React, { Component } from 'react';
import { Table, Icon, Tooltip} from 'antd';
import {formatDateTime,returnFloat} from '../../../utils/filter'



export default class FormTable extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const {changeSore, dataSource, loading} = this.props;
        const locale = {
            emptyText: '你要的数据如此珍稀，世界上并未发现'
        };
        const columns = [{
            title: '媒体名称',
            dataIndex: 'mediaName',
            width:100,
            render: (dataIndex) => {
                return dataIndex === null ?  <span>/</span> :
                    <div className="tool-warp">
                        <Tooltip placement="top" title={dataIndex}
                                 getPopupContainer={() => document.querySelector('.tool-warp')}>
                            <span className="ellipsis">{dataIndex}</span>
                        </Tooltip>
                    </div>

            }
        },{
            title: '运营',
            dataIndex: 'adBy',
            width:100,
            render: (dataIndex) => {
                return dataIndex === null ?  <span>/</span> : <span>{dataIndex}</span>
            }
        },{
            title: '投放时间',
            dataIndex: 'adTime',
            width:120,
            sorter: (a, b) => a.adTime - b.adTime,
            render: (dataIndex) => {
                return dataIndex === null ? "/" : formatDateTime(dataIndex)
            }
        },{
            title: '用户昵称',
            dataIndex: 'nickname',
            width:100,
            render: (dataIndex) => {
                return (dataIndex === null || dataIndex === 0) ?  <span>/</span> : <span>{dataIndex}</span>
            }
        },{
            title: '销售',
            dataIndex: 'salesName',
            width:100,
            render: (dataIndex) =>{
                return (dataIndex === null || dataIndex === 0) ?  <span>/</span> : <span>{dataIndex}</span>
            }
        // },{
        //     title: '营销号',
        //     dataIndex: 'seller',
        //     width:100,
        //     render: (dataIndex) => {
        //         return (dataIndex === null || dataIndex === 0) ?  <span>/</span> : <span>{dataIndex}</span>
        //     }
        },{
            title: '成交金额',
            dataIndex: 'price',
            width:100,
            sorter: (a, b) => a.price - b.price,
            render: (dataIndex) => {
                return (dataIndex === null || dataIndex === 0) ?  <span>/</span> : <span>{parseFloat(dataIndex).toFixed(2)}</span>
            }
        },{
            title: '加好友时间',
            dataIndex: 'friendTime',
            width:120,
            render: (dataIndex) => {
                return dataIndex === null ? "/" : formatDateTime(dataIndex)
            }
        },{
            title: '成单时间',
            dataIndex: 'createTime',
            width:120,
            sorter: (a, b) => a.createTime - b.createTime,
            render: (dataIndex) => {
                return dataIndex === null ? "/" : formatDateTime(dataIndex)
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
                className='market-form launch-form'
                loading={loading}
                pagination={false}
                onChange={changeSore}
                locale={locale}
            />
        )
    }
}
