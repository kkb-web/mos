import React, { Component } from 'react';
import './Form.less';

import { Row, Col, Input, Button, Select, Pagination, LocaleProvider, message} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';

import CollectionCreateForm from './CustomizedForm';
import FormTable from './FormTable';
import Friends from '../../common/Friends';
import {chooseDevice, getMarketList, getSubjectList, getUserList} from "../../../api/marketApi";

let originData = '';
let remarks = [];
let customCondition = {

};

let applyData = {
    size: 40,
    current: 1,
    descs: ["createTime"],
    ascs: [],
    condition: customCondition
};

export default class UForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            visible: false,
            friVisible: false,
            dataSource: [],
            dataAll: '',
            count: null,
            selectedRowKeys: [],
            tableRowKey: 0,
            isUpdate: false,
            loading: true,
            code: '',
            subjectList: [],
            saleList: [],
            id: '',
            sellerId: '',
            deviceId: '',
            disableBtn: false,
            resetBtn: false
        };
    }

    // 获取营销列表信息
    getMarketInfo = () => {
        getMarketList(applyData).then((response) =>{
            console.log(response.data.data.records, "======营销列表");
            originData = response.data.data;
            this.setState({
                dataSource: response.data.data.records,
                count: response.data.data.records.length,
                loading: false,
                dataAll: response.data.data,
                disableBtn: false,
                resetBtn: false
            });
        });
    };

    // 获取学科列表
    getSubjects = () => {
        getSubjectList().then((response) => {
            console.log(response.data.data, "======学科列表");
            this.setState({
                subjectList: response.data.data
            });
            console.log(this.state.subjectList)
        });
    };

    // 获取销售列表
    getSaleList = () => {
        getUserList().then((response) => {
            console.log(response.data.data, "======销售列表");
            this.setState({
                saleList: response.data.data
            });
            console.log(this.state.saleList)
        });
    };

    // 渲染
    componentDidMount(){
        customCondition.search = undefined;
        customCondition.subjectId = undefined;
        customCondition.userId = undefined;
        this.getMarketInfo();
        this.getSubjects();
        this.getSaleList();
    };

    // 排序
    changeSore = (dataIndex, record, sorter) => {
        applyData.ascs = (sorter.order === "ascend" ? [sorter.field] : []);
        applyData.descs = (sorter.order === "ascend" ? [] : [sorter.field]);
        this.getMarketInfo();
    };

    // 接受新建表单数据
    saveFormRef = (form) => {
        this.form = form;
    };

    // 设备
    editClick = (id) => {
        console.log(id);
        this.setState({
            visible: true,
            tableRowKey: id,
            isUpdate: true,
            sellerId: id
        });
    };

    // 取消
    handleCancel = () => {
        this.setState({ visible: false });
    };

    handleFriCancel = () => {
        this.setState({ friVisible: false });
        this.getMarketInfo();
    };

    changeFriNum = (id, record) => {
        this.setState({
            friVisible: true,
            code: record.id + '-' + record.subjectNo	 + '-' + record.wechat, id: record.id
        });
    };

    // 学科筛选
    chooseSubject = (value, e) => {
        console.log(e.key);
        if (e.key !== null) {
            customCondition.subjectId = e.key
        } else {
            customCondition.subjectId = undefined
        }
        applyData.current = 1;
        this.setState({
            loading: true,
        });
        this.getMarketInfo();
    };

    // 销售筛选
    chooseSale = (value, e) => {
        if (e.key !== null) {
            customCondition.userId = e.key
        } else {
            customCondition.userId = undefined
        }
        applyData.current = 1;
        this.setState({
            loading: true,
        });
        this.getMarketInfo();
    };

    // 搜索
    searchUser = () => {
        let inputUser = document.getElementById('search');
        if (inputUser.value !== '') {
            customCondition.search = inputUser.value;
            this.setState({
                loading: true,
                disableBtn: true
            });
            applyData.current = 1;
            this.getMarketInfo();
        }
    };


    // 重置
    searchReset = () => {
        document.getElementById('search').value = null;
        customCondition.search = undefined;
        customCondition.subjectId = undefined;
        customCondition.userId = undefined;
        this.setState({
            loading: true,
            resetBtn: true
        });
        applyData.current = 1;
        this.getMarketInfo();
        let selects = document.querySelectorAll('.ant-select-selection-selected-value');
        selects[0].innerHTML = '选择学科';
        selects[1].innerHTML = '选择销售';
    };

    // 改变页码
    onChangePage = (page, pageSize) => {
        applyData.size = pageSize;
        applyData.current = page;
        this.getMarketInfo();
    };

    // 改变每页条数
    onShowSizeChange = (current, pageSize) => {
        applyData.size = pageSize;
        applyData.current = current;
        this.getMarketInfo();
    };

    // 分页总共条数
    showTotal = (total) => {
        return `共 ${total} 条数据`;
    };

    // 选择设备时，的id值
    handleChange = (value) => {
        console.log(value, '===deviceChoose')
        this.setState({
            deviceId: value
        })
    };

    // 选择设备
    chooseOk = () => {
        chooseDevice({
            sellerId: this.state.sellerId,
            deviceId: this.state.deviceId}).then(res => {
            console.log(res, "======选择设备");
            if (res.data.code === 0) {
                this.getMarketInfo();
                this.setState({
                    visible: false
                })
            } else {
                message.error('选择失败，请重新选择！')
            }
        })

    };

    render(){
        const { dataSource, visible, loading, friVisible, code } = this.state;
        const { Option} = Select;
        const title = <span>选择设备<span style={{fontSize: '12px', color: 'rgba(0, 0, 0, 0.43)', paddingLeft: '15px'}}>请选择需要该营销号需要绑定的设备</span></span>;
        const contentTitle = <span>好友数量<span style={{fontSize: '14px', color: '#888', fontWeight: '100', paddingLeft: '20px'}}>{code}</span></span>
        return(
            <div style={{margin: "0"}}>
                <div className='marketing'>
                    <Row gutter={16}>
                        <Col className="gutter-row label" sm={2} style={{marginTop: '3px'}}>
                            <span>筛选：</span>
                        </Col>
                        <Col className="gutter-row" id="channel" sm={8} span={3}>
                            <Select
                                defaultValue="0"
                                onChange={this.chooseSubject}
                                getPopupContainer={() => document.getElementById('channel')}
                            >
                                <Option value="0">学科</Option>
                                {
                                    this.state.subjectList && this.state.subjectList.map((value, index) => {
                                        return (<Option key={value.id} value={index + 1}>{value.name}</Option>)
                                    })
                                }
                            </Select>
                            <Select
                                defaultValue="0"
                                onChange={this.chooseSale}
                                getPopupContainer={() => document.getElementById('channel')}
                            >
                                <Option value="0">选择销售</Option>
                                {
                                    this.state.saleList && this.state.saleList.map((value, index) => {
                                        return (<Option key={value.id} value={index + 1}>{value.realname}</Option>)
                                    })
                                }
                            </Select>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className="gutter-row label" sm={2} style={{marginTop: '5px'}}>
                            <span>搜索：</span>
                        </Col>
                        <Col className="gutter-row" sm={8}>
                            <Input placeholder="请输入要查询的IMEI或营销号" id="search"/>
                        </Col>
                        <Col className="gutter-row" sm={9}>
                            <Button type="primary" style={{marginRight: '20px'}} onClick={this.searchUser} disabled={this.state.disableBtn}>搜索</Button>
                            <Button type="default" onClick={this.searchReset} disabled={this.state.resetBtn}>全部重置</Button>
                        </Col>
                    </Row>
                    <FormTable
                        dataSource={dataSource}
                        checkChange={this.checkChange}
                        changeSore={this.changeSore}
                        editClick={this.editClick}
                        changeFriNum={this.changeFriNum}
                        loading={loading}
                        // onChange={this.changeSore}
                    />
                    <div style={{overflow: 'hidden', marginTop: '10px'}}>
                        <LocaleProvider locale={zh_CN}>
                            <Pagination showSizeChanger onShowSizeChange={this.onShowSizeChange}
                                        onChange={this.onChangePage}
                                        total={this.state.dataAll.total}
                                        showTotal={this.showTotal.bind(this.state.dataAll.total)}
                                        defaultPageSize={40}
                                        current={applyData.current}/>
                        </LocaleProvider>
                    </div>
                    <CollectionCreateForm onCreate={this.chooseOk} ref={this.saveFormRef} onCancel={this.handleCancel} visible={visible} title={title}
                                          style={{fontSize: '20px'}} handleChange={this.handleChange}/>
                    <Friends visible={friVisible} title={contentTitle} onCancel={this.handleFriCancel} sellerId={this.state.id} />
                </div>
            </div>
        )
    }
}
