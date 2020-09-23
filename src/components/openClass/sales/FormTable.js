import React, { Component } from 'react';
import { Table, InputNumber, Popconfirm} from 'antd';

export default class FormTable extends Component{
    constructor(props){
        super(props);
    }
    onValueChange = (id, value) => {
      console.log(id, value)
    };
    render(){
        const { onDelete, changeSore, editClick, dataSource, loading } = this.props;
        const locale = {
            emptyText: '没有数据'
        };
        const columns = [{
            title: '销售',
            dataIndex: 'nickname',
            width: 120
        },{
            title: '权重',
            dataIndex: 'pv',
            width: 95,
            render: (dataIndex, record) => {
                return <InputNumber min={1} max={100} defaultValue={dataIndex} onChange={this.onValueChange.bind(this, record.id)} />
            }
        },{
            title: '操作',
            dataIndex: 'opera',
            width:90,
            render: (text, record) => {
                return <div className='opera'>
                    <span style={{color: 'rgb(35, 82, 124)'}}>
                         <Popconfirm title="确定要删除吗?" cancelText="取消" okText="确定" onConfirm={() => onDelete(record.id)}>
                             删除
                         </Popconfirm>
                    </span>
                </div>
            }
        }];
        return(
            <Table
                key={record => record.id}
                rowKey={record => record.id}
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
