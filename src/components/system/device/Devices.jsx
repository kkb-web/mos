import React, {Component} from 'react';
import BreadcrumbCustom from '../../common/BreadcrumbCustom';
import {Row, Col, Select, Input, Button, LocaleProvider, Pagination,message} from 'antd';
import {Link} from 'react-router-dom';
import FormTable from './common/DeviceTable';
import Mock from 'mockjs';
import data from './mock/data.json';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { getToken} from "../../../utils/filter";
import {connect} from "../../../utils/socket";
import {urlDeviceList, urSellersList} from '../../../api/deviceApi'


import './Devices.less';

Mock.mock('/data', data); // 模拟数据
const Option = Select.Option;

const applyData = {
    size: 40,
    current: 1,
    // asc: ['id'],
    descs: ['createTime'],
    condition: {}
};
export default class UForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            dataAll: '',
            loading: true,
            sellerslist: [],
            inputvalue: '',
            selectinputvalue: '',
            selectValue:'',
            disableBtn: false,
            resetBtn: false
        };
    }
    deviceListInfo = () => {
        urlDeviceList(applyData).then(res => {
            this.setState({
                dataSource: res.data.data.records,
                dataAll: res.data.data,
                loading: false,
                disableBtn: false,
                resetBtn: false
            })
        })
    };

    deviceSelles = () => {
        urSellersList().then(res => {
            console.log(res.data.data,"+++++++++")
            let data = res.data.data;
            data.unshift({id: 0, username: "admin", realname: "未分配"})
            data.unshift({id: 'undefined', username: "admin", realname: "请选择"})
            this.setState({
                sellerslist: res.data.data
            })

        }).catch(err => {
            console.log(err)
        })
    }
    componentWillUnmount (){
        applyData.size = 40;
        applyData.current = 1;
        applyData.condition={}
    }
    componentDidMount() {
        this.deviceListInfo();
        this.deviceSelles();
        //链接websocket
        connect(getToken('username'));
        //end

    };

    // 排序
    changeSore = (dataIndex, record, sorter) => {
        applyData.ascs = (sorter.order === "ascend" ? [sorter.field] : null);
        applyData.descs = (sorter.order === "ascend" ? null : [sorter.field]);
        // 排序后，恢复排序时，数据应当保持和默认一致；
        let arr = Object.keys(sorter); //此方法为ES6新方法，返回值是对象中属性名组成的数组；
        if(arr.length == 0){
            applyData.descs = ['createTime'];
        }
        this.deviceListInfo();
    };

    // 帅选
    handleChange = (value) => {
        const selectValues = parseInt(value)
        this.setState({
            selectValue:selectValues
        });
        applyData.condition = {
            userId: selectValues
        };
        this.deviceListInfo()
    };

    // 改变每页条数
    onShowSizeChange = (current, pageSize) => {
        applyData.size = pageSize;
        applyData.current = current;
        this.deviceListInfo();
    };
    // 改变页码
    onChangePage = (page, pageSize) => {
        applyData.size = pageSize;
        applyData.current = page;
        this.deviceListInfo();
    };
    showTotal = (total) => {
        return `共 ${total} 条数据`;
    };

    // 查询
    searchUser = () => {
        let datas = this.state.selectinputvalue
        if (datas !== ''){
            const search = document.getElementById('search')
            applyData.condition = {
                userId:this.state.selectValue,
                search: search.value,
            };
            this.setState({
                disableBtn: true
            });
            this.deviceListInfo()
        }
    };

    seacherContent = (e) =>{
        console.log(e.target.value)
        this.setState({
            selectinputvalue:e.target.value
        })
        // if(e.target.value == ''){
        //     message.warn("搜索数据不能为空")
        // }else {
        //
        // }
    }
    //重置
    searchReset = () => {
        document.getElementById('search').value = null;
        let selects = document.querySelectorAll('.ant-select-selection-selected-value');
        selects[0].innerHTML = '选择销售'
        applyData.size = 40
        applyData.current = 1
        applyData.asc = null
        applyData.condition = {}
        this.setState({
            resetBtn: true
        });
        this.deviceListInfo()
    }

    render() {
        const {dataSource, loading, sellerslist} = this.state;
        const menus = [
            {
                path: '/app/dashboard/analysis',
                name: '首页'
            },
            {
                path: '#',
                name: '系统管理'
            },
            {
                name: '设备管理',
                path: '#'
            }
        ];
        return (
            <div className="device">
                <div className="device-head">
                    <BreadcrumbCustom paths={menus}/>
                    <p className="head-title-style">设备管理</p>
                    <span className="describe">管理用于微信营销的手机设备，以及当前是否已分配给销售</span>
                </div>
                <div className="device-container">
                    <Row className="device-Row-channer" gutter={16} justify="center" align="middle">
                        <Col className="device-channel" sm={2} style={{textAlign: 'center', width: '65px'}}>
                            <span>筛选：</span>
                        </Col>
                        <Col className="screen-input" id="device_input" offset={0}>
                            <Select
                                showSearch
                                style={{width: 200}}
                                placeholder="选择销售"
                                optionFilterProp="children"
                                onChange={this.handleChange}
                                getPopupContainer={() => document.getElementById('device_input')}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {sellerslist && sellerslist.map(d => <Option key={d.id}>{d.realname}</Option>)}
                            </Select>
                        </Col>
                    </Row>
                    <Row className="device-search" gutter={16}>
                        <Col className="search-input" sm={2} style={{textAlign: 'center', width: '65px'}}>
                            <span>搜索：</span>
                        </Col>
                        <Col className="" sm={8} offset={0} style={{padding: '0'}}>
                            <Input autoComplete="off" onChange={this.seacherContent} placeholder="请输入要查询的IMEI或营销号"
                                   id="search"/>
                        </Col>
                        <Col className="" sm={9}>
                            <Button type="primary" style={{marginRight: '12px', paddingLeft: '12px'}}
                                    onClick={this.searchUser} disabled={this.state.disableBtn}>查询</Button>
                            <Button type="default" onClick={this.searchReset} disabled={this.state.resetBtn}>全部重置</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Link to={'/app/authority/device/add'}><Button style={{marginBottom:'10px'}} icon="plus" type="primary">新建</Button></Link>
                    </Row>
                    <FormTable
                        dataSource={dataSource}
                        changeSore={this.changeSore}
                        editClick={this.editClick}
                        loading={loading}
                        id={this.state.tableRowKey}
                    />
                    <div style={{overflow: 'hidden', marginTop: '20px'}}>
                        <LocaleProvider locale={zh_CN}>
                            <Pagination showSizeChanger
                                        defaultCurrent={1}
                                        onShowSizeChange={this.onShowSizeChange}
                                        onChange={this.onChangePage}
                                        total={this.state.dataAll.total}
                                        showTotal={this.showTotal.bind(this.state.dataAll.total)}
                                        current={applyData.current}
                                        pageSize={applyData.size}
                            />
                        </LocaleProvider>
                    </div>
                </div>
            </div>
        )
    }
}
