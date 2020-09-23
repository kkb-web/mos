import React, { Component } from 'react';
import { Table, LocaleProvider } from 'antd';
import { formatDateTime } from '../../utils/filter'
import zh_CN from 'antd/lib/locale-provider/zh_CN';

export default class FormTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }


    render() {
        const { changeSore, dataSource, loading, changeModal } = this.props;
        const columns = [{
            title: '表单ID号',
            dataIndex: 'code',
            width: 240,
            render: (dataIndex) => dataIndex ? <span>{dataIndex}</span> : <span>/</span>,
        }, {
            title: '表单名称',
            dataIndex: 'name',
            width: 120,
            render: (dataIndex) => dataIndex ? <span>{dataIndex}</span> : <span>/</span>
        }, {
            title: '创建人',
            dataIndex: 'createName',
            width: 80,
            render: (dataIndex) => dataIndex === null ? <span>/</span> : <span>{dataIndex}</span>
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            sorter: (a, b) => a.createTime - b.createTime,
            width: 120,
            render: (dataIndex) => {
                return formatDateTime(dataIndex)
            }
        }, {
            title: '操作',
            dataIndex: 'opera',
            width: 120,
            render: (text, record) =>
                <div className='opera'>
                    <span onClick={() => changeModal(record.code)} style={{ color: 'rgb(35, 82, 124)' }} >
                        预览
                    </span>
                </div>
        }];
        return (
            <LocaleProvider locale={zh_CN}>
                <div >
                    <Table
                        id={"tb"}
                        key={(record, i) => i}
                        rowKey={(record, i) => i}
                        rowSelection={null}
                        columns={columns}
                        dataSource={dataSource}
                        bordered={true}
                        scroll={{ x: '100%' }}
                        className='open-course-table formTable'
                        loading={loading}
                        pagination={false}
                        onChange={changeSore}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                    />
                </div>
            </LocaleProvider>
        )
    }
}
