import React, { Component } from 'react';
import { Table } from 'antd';
import {formatDateTime} from '../../../utils/filter'
import { Link } from 'react-router-dom';

export default class FormTable extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const { checkChange, onDelete, editClick, changeSore, dataSource, loading } = this.props;
        const rowSelection = {
                onChange: checkChange,
                getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
            }),
        };
        const columns = [{
            title: '角色ID',
            dataIndex: 'id',
            width: 80
        },{
            title: '角色名称',
            dataIndex: 'name',
            width: 180,
            render: (dataIndex, record) => <Link to={'/app/authority/roles/' + record.id}><span style={{color: 'rgb(35, 82, 124)', cursor: 'pointer'}}>{dataIndex}</span></Link>,
        },{
            title: '角色描述',
            dataIndex: 'description',
            width: 200,
            render: (dataIndex) => dataIndex ? dataIndex : '/'
        },{
            title: '角色人数',
            dataIndex: 'num',
            sorter: (a, b) => a.num - b.num,
            width: 100,
            render: (dataIndex) => dataIndex ? dataIndex : '/'
        },{
            title: '创建时间',
            dataIndex: 'createTime',
            sorter: (a, b) => a.createTime - b.createTime,
            width: 160,
            render: (dataIndex) => {
                return formatDateTime(dataIndex)
            }
        },{
            title: '操作',
            dataIndex: 'opera',
            width: 120,
            render: (text, record) =>
                <div className='opera'>
                    <Link to={'/app/authority/roles/' + record.id}>
                        <span style={{color: 'rgb(35, 82, 124)', marginLeft: '5px'}}>
                            编辑
                        </span>
                    </Link>
                    <Link to={'/app/authority/roles/copy/' + record.id}>
                        <span style={{color: 'rgb(35, 82, 124)', marginLeft: '5px'}}>
                            复制
                        </span>
                    </Link>
                </div>
        }];
        return(
            <Table
                key ={record => record.id}
                rowKey={record => record.id}
                columns={columns}
                dataSource={dataSource}
                bordered={false}
                scroll={{x:'100%'}}
                className='formTable'
                loading={loading}
                pagination={false}
                onChange={changeSore}
            />
        )
    }
}
