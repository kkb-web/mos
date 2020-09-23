import React, { Component } from 'react';
import './Form.less';
import {Checkbox, Table} from 'antd';

import Mock from 'mockjs';
import list from './mock/authorList';
import subjectList from './mock/subject'
import {getAuthorList, getSubjectList} from "../../../api/roleApi";

// Mock.mock('/account/permissions', list);
// Mock.mock('/subjects', subjectList);

let permissionIdList = [];
let selfList = [];
let subjectsList = [];
let subjects = [];


export default class UForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            bordered: false,
            pagination: false,
            data: [],
            subjects: [],
            columns: []
        };
    }

    // 组件渲染之前，请求权限列表，以画表
    componentWillMount () {
        getAuthorList().then(res => {
            console.log(res.data.data, "=======权限列表");
            this.setState({
                data: res.data.data
            });
            console.log(this.state.data)
        });
    }

    // 组件渲染
    componentDidMount () {
        this.createColumn()
    };

    // 定义表的行和列
    createColumn = () => {
        let columns = [];
        columns = [{
            title: <span><Checkbox onChange={this.onCheckAllChange.bind(this, 'autority')}/><span>全部权限</span></span>,
            dataIndex: 'name',
            key: 'name',
            render: (dataIndex, record, i) => {
                return <span>
                        <Checkbox onClick={this.changeValue.bind(this, 'autority', i, record.id)}
                                  onChange={this.sendId.bind(this, i, record.id)}
                                  className='autority'/>
                        <span>{dataIndex + record.id}</span>
                    </span>
            }
        },{
            title: <span><Checkbox onChange={this.onCheckAllChange.bind(this, 'self')}/><span>仅见自己</span></span>,
            dataIndex: 'self',
            key: 'self',
            render: (dataIndex, record, i) => {
                return <Checkbox onClick={this.changeValue.bind(this, 'self', i, record.id)}
                                 onChange={this.sendSelf.bind(this, i, record.id)}
                                 className="self"/>
            }
        },{
            title: <span><Checkbox onChange={this.onCheckAllChange.bind(this, 'all')}/><span>全部学科</span></span>,
            dataIndex: 'all',
            key: 'all',
            render: (dataIndex, record, i) => {
                return <Checkbox onClick={this.changeValue.bind(this, 'all', i, record.subject)}
                                 disabled={record.subject === 0} className="all"/>
            }
        }];
        getSubjectList().then(res => {
            this.setState({
                subjects: res.data.data
            });
            for (let j = 0; j < this.state.subjects.length; j++) {
                columns.push({
                    title: <span><Checkbox className="all-title" onClick={this.changeValue.bind(this, 'all-title', j)} onChange={this.onCheckAllChange.bind(this, this.state.subjects[j].name)}/><span>{this.state.subjects[j].name}</span></span>,
                    dataIndex: this.state.subjects[j].name,
                    key: this.state.subjects[j].name,
                    render: (dataIndex, record, i) => {
                        return <Checkbox onClick={this.changeValue.bind(this, this.state.subjects[j].name, i, this.state.subjects[j].id)}
                                         onChange={this.sendSubject.bind(this, i, record.id, this.state.subjects[j].name, this.state.subjects[j].id)}
                                         disabled={record.subject === 0} className={this.state.subjects[j].name + ' alls'}/>
                    }
                })
            }
            this.setState({
                columns: columns
            })
        });
    };

    // 表头的checkbox change事件，用于选中一列
    onCheckAllChange = (name, e) => {
        let spans = document.querySelectorAll('.' + name + ' .ant-checkbox');
        let checks = document.querySelectorAll('.' + name + ' input');
        if (e.target.checked) {
            for (let i = 0; i < checks.length; i++) {
                checks[i].checked = true;
                spans[i].classList.add('ant-checkbox-checked')
            }
        } else {
            for (let i = 0; i < checks.length; i++) {
                checks[i].checked = false;
                spans[i].classList.remove('ant-checkbox-checked')
            }
        }
        if (name === 'all') {
            let span = document.querySelectorAll('.alls .ant-checkbox');
            let check = document.querySelectorAll('.alls input');
            let spanTag = document.querySelectorAll('.all-title .ant-checkbox');
            let checkTag = document.querySelectorAll('.all-title input');
            if (e.target.checked) {
                for (let j = 0; j < check.length; j++) {
                    check[j].checked = true;
                    span[j].classList.add('ant-checkbox-checked')
                }
                for (let k = 0; k < checkTag.length; k++) {
                    checkTag[k].checked = true;
                    spanTag[k].classList.add('ant-checkbox-checked')
                }
            } else {
                for (let j = 0; j < check.length; j++) {
                    check[j].checked = false;
                    span[j].classList.remove('ant-checkbox-checked')
                }
                for (let k = 0; k < checkTag.length; k++) {
                    checkTag[k].checked = false;
                    spanTag[k].classList.remove('ant-checkbox-checked')
                }
            }
        }
    };

    // 表中每个checkbox check的事件，用于选中时添加数据到请求列表中
    changeValue = (name, i, permissionId, e) => {
        console.log(name, i, permissionId, e);
        let spans = document.querySelectorAll('.' + name + ' .ant-checkbox');
        let checks = document.querySelectorAll('.' + name + ' input');
        if (e.target.checked) {
            checks[i].checked = true;
            spans[i].classList.add('ant-checkbox-checked');
        } else {
            checks[i].checked = false;
            spans[i].classList.remove('ant-checkbox-checked');
        }
    };

    // 获取表中选中权限的id
    sendId = (i, permissionId, e) => {
        console.log(i, permissionId, e);
        if (e.target.checked) {
            permissionIdList.push(permissionId)
        } else {
            permissionIdList.splice(permissionIdList.indexOf(permissionId), 1)
        }
        console.log(permissionIdList, "+++++++++list");
    };

    // 获取表中选中仅自己的id
    sendSelf = (i, permissionId, e) => {
        console.log(i, permissionId, e);
        if (e.target.checked) {
            selfList.push({
                permissionId: permissionId,
                self: 1
            })
        } else {
            let self = {
                permissionId: permissionId,
                self: 1
            };
            selfList.splice(selfList.indexOf(self), 1)
        }
        console.log(selfList, '++++++++selfList')
    };

    // 获取表中选中学科的id
    sendSubject = (i, permissionId, name, id, e) => {
        console.log(i, permissionId, e);
        if (e.target.checked) {
            subjects.push({
                permissionId: permissionId,
                subjectName: name,
                subjectId: id
            })
        } else {
            let subject = {
                permissionId: permissionId,
                subjectName: name,
                subjectId: id
            };
            subjects.splice(subjects.splice(subject), 1)
        }
        console.log(subjects)
    };

    render(){
        return(
            <div>
                <Table
                    rowKey={record => record.name}
                    {...this.state}
                    columns={this.state.columns}
                    dataSource={this.state.data}
                />
            </div>
        )
    }
}
