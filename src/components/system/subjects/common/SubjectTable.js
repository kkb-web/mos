import React, {Component} from 'react';
import {Table} from 'antd';
import {formatDateTime} from '../../../../utils/filter'

export default class FormTable extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {changeSore, dataSource, loading,editClick} = this.props;
        const columns = [{
            title: '学科ID',
            dataIndex: 'id',
            sorter: (a, b) => a.id - b.id,
            width: 80,
            render: (dataIndex) => dataIndex === null ? <span>/</span> : <span>{dataIndex}</span>
        }, {
            title: '学科名称',
            dataIndex: 'name',
            width: 190,
            render: (dataIndex) => dataIndex === null ? <span>/</span> : <span>{dataIndex}</span>
        }, {
            title: '学科code',
            dataIndex: 'code',
            width: 140,
            render: (dataIndex) => dataIndex === null ? <span>/</span> : <span>{dataIndex}</span>
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            sorter: (a, b) => a.createTime - b.createTime,
            width: 130,
            render: (dataIndex) => {
                return formatDateTime(dataIndex)
            }
        }, {
            title: '操作',
            dataIndex: 'opera',
            width: 80,
            render: (text, record) =>
                <div className='opera'>
                    <a href="javascript:;" onClick={() => editClick (record.id)}>编辑</a>
                </div>
        }];
        return (
            <Table
                key={record => record.id}
                rowKey={record => record.id}
                columns={columns}
                dataSource={dataSource}
                bordered={false}
                scroll={{x: '100%'}}
                className='device-formTable'
                loading={loading}
                pagination={false}
                onChange={changeSore}
                locale={{emptyText: '学科列表目前为空哦~'}}
            />
        )
    }
}
