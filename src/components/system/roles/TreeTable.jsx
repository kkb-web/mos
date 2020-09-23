import React, { Component } from 'react';
import './Form.less';
import {Checkbox, Table} from 'antd';

const CheckboxGroup = Checkbox.Group;
const plainOptions = ['John Brown sr.'];
const defaultCheckedList = [];
const check = null;
let bool = true;

export default class UForm extends Component{


    constructor(props) {
        super(props);
        this.state = {
            bordered: false,
            pagination: false,
            defaultExpandAllRows: true
        };
    }

    // 选中所有列的事件
    onCheckAllChange = (name, e) => {
        let checks = document.querySelectorAll('.' + name + ' .ant-checkbox');
        if (e.target.checked) {
            for (let i = 0; i < checks.length; i++) {
                checks[i].classList.add('ant-checkbox-checked')
            }
        } else {
            for (let i = 0; i < checks.length; i++) {
                checks[i].classList.remove('ant-checkbox-checked')
            }
        }
    };

    // 选中部分的事件
    onCheckPartChange = (record, e) => {
        // console.log(record.children);
        let checks = document.querySelectorAll('.autority_' + record.id)
        if (record.children.length) {
            if (e.target.checked) {
                for (let i = 0; i < checks.length; i++) {
                    checks[i].classList.add('ant-checkbox-checked')
                }
            } else {
                for (let i = 0; i < checks.length; i++) {
                    checks[i].classList.remove('ant-checkbox-checked')
                }
            }
        }
    };
    render(){
        const state = this.state;
        const columns = [{
            title: <span><Checkbox onChange={this.onCheckAllChange.bind(this, 'autority')}/><span>全部权限</span></span>,
            dataIndex: 'name',
            key: 'name',
            render: (dataIndex, record, i) => {
                return <span>
                    <Checkbox className={'autority autority_' + record.id} onChange={this.onCheckPartChange.bind(this, record)}/>
                    <span>{dataIndex + record.id}</span>
                </span>
            },
            filterMultiple: true
        }, {
            title: <span><Checkbox onChange={this.onCheckAllChange.bind(this, 'web')}/><span>web</span></span>,
            dataIndex: 'web',
            key: 'web',
            render: (dataIndex, record) => {
                return <span style={{textAlign: 'center'}}><Checkbox className="web"/></span>
            },
            filterMultiple: true
        }, {
            title: <span><Checkbox onChange={this.onCheckAllChange.bind(this, 'java')}/><span>java</span></span>,
            dataIndex: 'java',
            key: 'java',
            render: (dataIndex, record) => {
                return <Checkbox className="java"/>
            },
            filterMultiple: true
        }, {
            title: <span><Checkbox onChange={this.onCheckAllChange.bind(this, 'python')}/><span>python</span></span>,
            dataIndex: 'python',
            key: 'python',
            render: (dataIndex, record) => {
                return <Checkbox className="python"/>
            },
            filterMultiple: true
        }, {
            title: <span><Checkbox onChange={this.onCheckAllChange.bind(this, 'uxd')}/><span>uxd</span></span>,
            dataIndex: 'uxd',
            key: 'uxd',
            render: (dataIndex, record) => {
                return <span style={{textAlign: 'center'}}><Checkbox className="uxd"/></span>
            },
            filterMultiple: true
        }, {
            title: <span><Checkbox onChange={this.onCheckAllChange.bind(this, 'pm')}/><span>pm</span></span>,
            dataIndex: 'pm',
            key: 'pm',
            render: (dataIndex, record) => {
                return <Checkbox className="pm"/>
            },
            filterMultiple: true
        }, {
            title: <span><Checkbox onChange={this.onCheckAllChange.bind(this, 'ai')}/><span>ai</span></span>,
            dataIndex: 'ai',
            key: 'ai',
            render: (dataIndex, record) => {
                return <Checkbox className="ai"/>
            },
            filterMultiple: true
        }
        ];

        const data = [{
            key: 12,
            name: '商品管理',
            age: 30,
            address: 'New York No. 3 Lake Park',
            id: 1,
            children: [{
                id: 1,
                key: 121,
                name: 'Jimmy Brown',
                age: 16,
                address: 'New York No. 3 Lake Park',
                children: []
            }],
        }, {
            id: 2,
            key: 13,
            name: '班次管理',
            age: 72,
            address: 'London No. 1 Lake Park',
            children: [{
                id: 2,
                key: 131,
                name: 'Jim Green',
                age: 42,
                address: 'London No. 2 Lake Park',
                children: []
            }],
        }];
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            onSelect: (record, selected, selectedRows) => {
                console.log(record, selected, selectedRows);
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                console.log(selected, selectedRows, changeRows);
            },
        };
        return(
            <Table {...this.state} columns={columns}  dataSource={data}/>
        )
    }
}
