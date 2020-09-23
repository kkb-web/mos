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
            dataIndex: 'salesName',
            width: 100,
            className: 'media-name-td',
            render: (dataIndex, record) => <p className="media-name" style={{
                boxOrient: 'vertical',
                marginBottom:'0'
            }}>{dataIndex}</p>
        }, {
            title: '学科-编号',
            dataIndex: 'subjectNum',
            width: 120,
            render: (dataIndex) => dataIndex === null ? <span>/</span> : <span>{dataIndex}</span>
        }, {
            title: '二维码',
            dataIndex: 'qrCode',
            width: 110,
            render: (dataIndex) => dataIndex === null ? <span>/</span> : <img style={{width:'60px'}} src={'https://img.kaikeba.com/' + dataIndex} />
        }, {
            title: '权重',
            dataIndex: 'weight',
            key: 'Count',
            width: 110,
            render: (dataIndex, record,index) => <InputNumber style={{width:'70px'}} min={1} max={100} value={dataSource[index].weight} onChange={(value)=>{editWeightOnchange(value,record.id)}} onBlur={(e)=>editWeight(e,record.id)}/>
        }, {
            title: 'PV',
            dataIndex: 'pv',
            sorter: (a, b) => a.pv - b.pv,
            width: 100,
            render: (dataIndex) => dataIndex === null ? <span>/</span> : <span>{dataIndex}</span>
        }, {
            title: 'UV',
            dataIndex: 'uv',
            sorter: (a, b) => a.uv - b.uv,
            width: 100,
            render: (dataIndex) => dataIndex === null ? <span>/</span> : <span>{dataIndex}</span>
        }, {
            title: '页面长按',
            dataIndex: 'press',
            sorter: (a, b) => a.pv - b.pv,
            width: 100,
            render: (dataIndex) => dataIndex === null ? <span>/</span> : <span>{dataIndex}</span>
        }, {
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
                        onConfirm={() => onDelete(record.id)}
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
                key={record => record.id}
                rowKey={record => record.id}
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
