import React, {Component} from 'react';
import {Table, Popconfirm, Icon,InputNumber} from 'antd';

export default class FormTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }
    render() {
        const {onDelete, editWeight,editWeightOnchange,changeSore, dataSource, loading} = this.props;
        const locale = {
            emptyText: '这里还没有设置营销号哦，开始添加吧'
        };
        const columns = [{
            title: '销售',
            dataIndex: 'sellerName',
            width: 100,
            className: 'media-name-td',
            render: (dataIndex, record) => <p className="media-name" style={{
                boxOrient: 'vertical',
                marginBottom:'0'
            }}>{dataIndex}</p>
        },{
            title: '权重',
            dataIndex: 'weight',
            key: 'Count',
            width: 110,
            render: (dataIndex, record,index) => <InputNumber style={{width:'70px'}} min={1} max={100} value={dataSource[index].weight} onChange={(value)=>{editWeightOnchange(value,record.sellerId)}} onBlur={(e)=>editWeight(e,record.sellerId)}/>
        },{
            title: '操作',
            dataIndex: 'opera',
            width: 130,
            className: 'mediaAction',
            render: (text, record) =>
                <div className='opera'>
                    <Popconfirm
                        okText="确定"
                        cancelText="取消"
                        placement="topLeft"
                        onConfirm={() => onDelete(record.sellerId)}
                        title="确定要删除此营销号吗？"
                        icon={<Icon type="question-circle-o"
                                    style={{ color: 'red' }} />}
                    >
                        <span style={{color: 'rgb(24, 144, 255)', marginLeft: '5px'}}>删除</span>
                    </Popconfirm>
                </div>
        }];
        return (
            <Table
                key={record => record.sellerId}
                rowKey={record => record.sellerId}
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
