import React, { Component } from 'react';
import './Form.less';

import { Row, Input, Button, Select} from 'antd';
import { Link } from 'react-router-dom';

import BreadcrumbCustom from '../../common/BreadcrumbCustom';

import FormTable from './FormTable';
import {getHeaders, getToken} from "../../../utils/filter";
import {connect} from "../../../utils/socket";
import {axiosInstance} from "../../../utils/global-props";
import Mock from 'mockjs';
import list from './mock/list';
import {getRoleList} from "../../../api/roleApi";

// Mock.mock('/account/roles', list);

const Search = Input.Search;

let applyData = {
    size: 500,
    current: 1,
    descs: null,
    ascs: ["id"]
};

export default class UForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [], //列表数据
            count: null,
            tableRowKey: 0,
            isUpdate: false,
            loading: true,
            dataAll: '', //返回的所有数据
            id: '',
        };
    }

    // 获取角色列表
    getRoleInfo = () => {
        getRoleList(applyData).then(function (response) {
            console.log(response.data, "=======roleList");
            this.setState({
                dataSource: response.data.data.records,
                count: response.data.data.records.length,
                loading: false,
                dataAll: response.data.data
            })
        }.bind(this));
    };

    //渲染
    componentDidMount(){
        applyData.current = 1;
        this.getRoleInfo();
        //链接websocket
        connect(getToken('username'));
        //end
    };

    //接受新建表单数据
    saveFormRef = (form) => {
        this.form = form;
    };

    // 排序
    changeSore = (dataIndex, record, sorter) => {
        applyData.ascs = (sorter.order === "ascend" ? [sorter.field] : null);
        applyData.descs = (sorter.order === "ascend" ? null : [sorter.field]);
        this.getRoleInfo();
    };

    render(){
        const {dataSource, loading } = this.state;
        const { Option} = Select;
        const menus = [
            {
                path: '/app/dashboard/analysis',
                name: '首页'
            },
            {
                name: '系统管理',
                path: '#'
            },
            {
                name: '角色权限',
                path: '#'
            }
        ];
        return(
            <div className="authority-role">
                <div className="page-nav">
                    <BreadcrumbCustom paths={menus}/>
                    <p className="title-style">角色权限</p>
                </div>
                <div className='formBody'>
                    <Row gutter={16}>
                        <div className='plus'>
                            <Link to={'/app/authority/roles/add'}><Button icon="plus" type="primary">新建</Button></Link>
                        </div>
                    </Row>
                    <FormTable
                        dataSource={dataSource}
                        checkChange={this.checkChange}
                        onDelete={this.onDelete}
                        changeSore={this.changeSore}
                        editClick={this.editClick}
                        loading={loading}
                        id={this.state.tableRowKey}
                    />
                </div>
            </div>
        )
    }
}
