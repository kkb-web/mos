import React, { Component } from 'react';
import './Form.less';

import Mock from 'mockjs';
import { Row, Radio, Input, Button, Select, Pagination, Modal, LocaleProvider, message} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
// import { Link } from 'react-router-dom';

import BreadcrumbCustom from '../../common/BreadcrumbCustom';
import address from './mock/address.json';
import data from './mock/data.json';
import CollectionCreateForm from './CustomizedForm';
import FormTable from './FormTable';
import {baseUrl, getHeaders, getToken, openCourseUrl} from "../../../utils/filter";
import {axiosInstance} from "../../../utils/global-props";
import {connect} from "../../../utils/socket";

const Search = Input.Search;
// Mock.mock('/address', address);
// Mock.mock('/data', data);

let applyData = {
    size: 10,
    current: 1,
    orderByField: 'createTime',
    asc: false,
    condition: {},
    customCondition: {}
};

export default class UForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            userName: '', //名称
            visible: false, //新建窗口隐藏
            upOrDown: false, //上下架弹窗显示
            dataSource: [], //列表数据
            count: null,
            selectedRowKeys: [], //多选
            tableRowKey: 0,
            isUpdate: false,
            loading: true,
            dataAll: '', //返回的所有数据
            shelves: '', //上下架
            id: '',
            buldShelves: '', //批量上下架
        };
    }

    getQrcodeInfo = () => {
        this.setState({
            loading: false
        })
    };

    //渲染
    componentDidMount(){
        applyData.current = 1;
        this.getQrcodeInfo();
        //链接websocket
        connect(getToken('username'));
        //end
    };

    //接受新建表单数据
    saveFormRef = (form) => {
        this.form = form;
    };

    //获取链接
    editClick = (key) => {
        const form = this.form;
        form.setFieldsValue({
            key: openCourseUrl() + "/weightQrcode/" + key,
        });
        this.setState({
            visible: true,
            tableRowKey: key,
            isUpdate: true,
            id: openCourseUrl() + "/weightQrcode/" + key
        });
    };

    //取消
    handleCancel = () => {
        this.setState({ visible: false });
    };

    //搜索
    onChangeUserName = (e) => {
        const value = e.target.value;
        this.setState({
            userName: value,
            loading: true
        });
        applyData.customCondition.title = value;
        applyData.current = 1;
        this.getQrcodeInfo();
    };

    // 排序
    changeSore = (dataIndex, record, sorter) => {
        applyData.orderByField = sorter.field;
        applyData.asc = (sorter.order === "ascend" ? true : false);
        this.getQrcodeInfo();
    };

    //上下架
    onDelete = (id, status) => {
        let _this = this;
        applyData.condition.status = null;
        axiosInstance.post({
            url: '/crm/qrCodeTransferPage/online',
            data: {
                id: [id],
                status: status === 1 ? 0 : 1
            },
            headers: getHeaders()
        }).then(function (res) {
            if (res.data.code === 0) {
                _this.getQrcodeInfo();
            }
        }).catch(function (err) {
            message.error('操作失败，请稍后重试！')
        })
    };

    // 上下架搜索
    handleChange = (value) => {
        this.setState({
            loading: true
        });
        let status = value === '0' ? null : (value === '1' ? 1 : 0);
        applyData.condition.status = status;
        applyData.current = 1;
        this.getQrcodeInfo();
    };

    // 改变页码
    onChangePage = (page, pageSize) => {
        applyData.current = page;
        applyData.size = pageSize;
        this.getQrcodeInfo();
    };

    // 改变每页条数
    onShowSizeChange = (current, pageSize) => {
        applyData.current = current;
        applyData.size = pageSize;
        this.getQrcodeInfo();
    };

    showTotal = (total) => {
        return `共 ${total} 条数据`;
    };

    //多选框
    checkChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys: selectedRowKeys});
    };

    showModal = (e) => {
        this.setState({
            upOrDown: true,
            shelves: '是否确定要批量' + e.target.value + '?',
            buldShelves: e.target.value === '上架' ? 1 : 0
        });
    };

    hideModal = () => {
        this.setState({
            upOrDown: false,
        });
    };

    // 批量上下架
    bulkUpOrDown = () => {
        this.setState({
            upOrDown: false,
        });
        let _this = this;
        axiosInstance.post({
            url: '/crm/qrCodeTransferPage/online',
            data: {
                id: _this.state.selectedRowKeys,
                status: _this.state.buldShelves
            },
            headers: getHeaders()
        }).then(function (res) {
            if (res.data.code === 0) {
                _this.getQrcodeInfo();
            }
        }).catch(function (err) {
            message.error('操作失败，请稍后重试！')
        })
    };

    render(){
        const { userName, dataSource, visible, loading } = this.state;
        const { Option} = Select;
        const menus = [
            {
                path: '/app/dashboard/analysis',
                name: '首页'
            },
            {
                name: '二维码中转页',
                path: ''
            }
        ];
        return(
            <div>
                <div className="page-nav">
                    <BreadcrumbCustom paths={menus}/>
                    <p className="title-style">二维码中转页</p>
                </div>
                <div className='formBody'>
                    <Row gutter={16}>
                        <div className='plus'>
                            {/*<Link to={'/app/qrcode/upload'}><Button style={{marginRight: '15px'}} icon="plus" type="primary">新建</Button></Link>*/}
                            <Radio.Group>
                                <Radio.Button onClick={this.showModal} disabled={!this.state.selectedRowKeys.length} value="上架">上架</Radio.Button>
                                <Radio.Button onClick={this.showModal} disabled={!this.state.selectedRowKeys.length} value="下架">下架</Radio.Button>
                            </Radio.Group>
                        </div>
                        <div className='btnOpera'>
                            <Search
                                placeholder="搜索名称"
                                value={userName}
                                onChange={this.onChangeUserName}
                            />
                        </div>
                        <div className='btnOpera' id='area'>
                            <Select
                                defaultValue="0"
                                onChange={this.handleChange}
                                getPopupContainer={() => document.getElementById('area')}
                            >
                                <Option value="0">全部状态</Option>
                                <Option value="1">已上架</Option>
                                <Option value="2">已下架</Option>
                            </Select>
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
                    <div id="up-or-down">
                        <Modal
                            title="提示"
                            visible={this.state.upOrDown}
                            onCancel={this.hideModal}
                            okText="确定"
                            cancelText="取消"
                            onOk={this.bulkUpOrDown}
                        >
                            <p>{this.state.shelves}</p>
                        </Modal>
                    </div>
                    <div style={{overflow: 'hidden'}}>
                        <LocaleProvider locale={zh_CN}>
                            <Pagination showSizeChanger onShowSizeChange={this.onShowSizeChange}
                                        onChange={this.onChangePage}
                                        total={this.state.dataAll.total}
                                        showTotal={this.showTotal.bind(this.state.dataAll.total)}
                                        current={applyData.current}/>
                        </LocaleProvider>
                    </div>
                    <CollectionCreateForm id={this.state.id} ref={this.saveFormRef} onCancel={this.handleCancel} visible={visible} title="获取链接"
                                          style={{fontSize: '20px'}}/>
                </div>
            </div>
        )
    }
}
