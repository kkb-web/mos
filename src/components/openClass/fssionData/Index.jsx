import React, {Component} from 'react';
import './Index.less';
import FormTable from './Form';
import {Row, Col, Input, Button, Select, Pagination, LocaleProvider, message} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import {sellerList,fssionlList} from "../../../api/openCourseApi";
let search = false; //定义限制查询按钮
let customCondition = {
    name: null,
    sellerId: null
};
let applyData = {
    size: 40,
    current: 1,
    ascs: [],
    descs: [],
    condition: customCondition
};

export default class FssionData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataAll:'',           //列表总数据
            dataSource: [],      //列表表单数据
            saleList: [],       //销售下拉数据
            resetBtn: false,   //请求按钮状态
        };
    }

    componentDidMount() {
        this.getList();
        this.getSaleList();
    }
    componentWillUnmount(){
        customCondition = {
            name: null,
            sellerId: null
        };
        applyData = {
            size: 40,
            current: 1,
            descs: [],
            ascs: null,
            condition:customCondition
        };
    }

    //获取列表数据
    getList = () => {
        let data = {
            courseId:window.location.pathname.slice(12),
            data:applyData
        };
        fssionlList(data).then(res=>{
            if(res.data.code == 0){
                let data = res.data.data;
                this.setState({
                    dataSource:data.records,
                    dataAll: data,
                    disableBtn: false,
                    loading: false,
                    resetBtn: false
                })
            }
        }).catch(err=>{
            console.log(err)
        });
        search = true
    };

    // 获取销售下拉
    getSaleList = () => {
        sellerList(parseInt(window.location.pathname.slice(12))).then(res => {
            if(res.data.code == 0){
                this.setState({
                    saleList: res.data.data
                })
            }
        })
    };
    // 销售筛选
    chooseSeller = (value, e) => {
        this.setState({
            sellerValue: value,
        });
        applyData.current = 1;
        customCondition.sellerId = e.key;
        this.setState({
            loading: true,
        });
        this.getList();
    };
    // 搜索
    searchUser = () => {
        let inputUser = document.getElementById('search');
        customCondition.name = inputUser.value;
        this.setState({
            loading: true,
        });
        applyData.current = 1;
        if (search) {
            this.setState({
                loading: true,
                disableBtn: true
            });
            this.getList();
        }
    };
    // 重置
    searchReset = () => {
        document.getElementById('search').value = null;
        customCondition = {
            name: null,
            sellerId: null
        };
        applyData = {
            size: 40,
            current: 1,
            ascs: [],
            descs: [],
            condition: customCondition
        };
        this.setState({
            loading: true,
            sellerValue: 0,
            resetBtn: true
        });
        this.getSaleList();
        this.getList();
    };
    // 列表排序
    changeSore = (dataIndex, record, sorter) => {
        console.log(sorter.order);
        applyData.descs = (sorter.order === "descend" ? [sorter.field] : []);
        applyData.ascs = (sorter.order === "ascend" ? [sorter.field] : []);
        // 排序后，恢复排序时，数据应当保持和默认一致；
        let arr = Object.keys(sorter); //此方法为ES6新方法，返回值是对象中属性名组成的数组；
        if (arr.length == 0) {
            applyData.descs = [];
        }
        applyData.current = 1;
        this.setState({
            loading: true,
        });
        this.getList();
    };
    // 改变页码
    onChangePage = (page, pageSize) => {
        applyData.size = pageSize;
        applyData.current = page;
        this.getList();
    };
    // 改变每页条数
    onShowSizeChange = (current, pageSize) => {
        applyData.size = pageSize;
        applyData.current = current;
        this.getList();
    };
    // 展示数据总数
    showTotal = (total) => {
        return `共 ${total} 条数据`;
    };

    render() {
        const {dataSource, saleList,dataAll,loading} = this.state;
        const {Option} = Select;
        return (
            <div className="open-course-fssion" style={{margin: "0 30px"}}>
                <div className='formBody'>
                    <Row gutter={16}>
                        <Col className="gutter-row label" sm={2} style={{marginTop: '3px'}}>
                            <span>筛选：</span>
                        </Col>
                        <Col className="gutter-row" id="fssion" sm={8} span={3}>
                            <Select
                                defaultValue={0}
                                onChange={this.chooseSeller}
                                getPopupContainer={() => document.getElementById('fssion')}
                            >
                                <Option value={0}>选择销售</Option>
                                {
                                    saleList && saleList.map((value, index) => {
                                        return (
                                            <Option key={value.sellerId} value={index + 1}>{value.sellerName}</Option>)
                                    })
                                }
                            </Select>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className="gutter-row label" sm={2} style={{marginTop: '5px'}}>
                            <span>搜索：</span>
                        </Col>
                        <Col className="gutter-row" sm={6}>
                            <Input style={{widht:'140px'}} placeholder="搜索渠道名称" id="search"/>
                        </Col>
                        <Col className="gutter-row" sm={9}>
                            <Button type="primary" style={{marginRight: '20px'}} onClick={this.searchUser}
                                    disabled={this.state.disableBtn}>搜索</Button>
                            <Button type="default" onClick={this.searchReset}
                                    disabled={this.state.resetBtn}>全部重置</Button>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className="gutter-row label" sm={2} style={{marginTop: '5px'}}>
                            <span>总计：</span>
                        </Col>
                        <Col className="gutter-row label" sm={16} style={{marginTop: '5px'}}>
                            <Row className="gutter-row itembox" gutter={16}>
                                <Col className="gutter-row item" sm={5}>
                                    <p>一度报名：<span>{dataAll.allOneSignup}</span></p>
                                </Col>
                                <Col className="gutter-row item" sm={5}>
                                    <p>二度报名：<span>{dataAll.allTwoSignup}</span></p>
                                </Col>
                                <Col className="gutter-row item" sm={5}>
                                    <p>三度报名：<span>{dataAll.allThreeSignup}</span></p>
                                </Col>
                                <Col className="gutter-row item" sm={5}>
                                    <p>三度以上报名：<span>{dataAll.allAuthSignup}</span></p>
                                </Col>
                            </Row>
                            <Row className="gutter-row itembox" gutter={16}>
                                <Col className="gutter-row item" sm={5}>
                                    <p>一度关注：<span>{dataAll.allOneSubscribe}</span></p>
                                </Col>
                                <Col className="gutter-row item" sm={5}>
                                    <p>二度关注：<span>{dataAll.allTwoSubscribe}</span></p>
                                </Col>
                                <Col className="gutter-row item" sm={5}>
                                    <p>三度关注：<span>{dataAll.allThreeSubscribe}</span></p>
                                </Col>
                                <Col className="gutter-row item" sm={5}>
                                    <p>三度以上关注：<span>{dataAll.allAuthSubscribe}</span></p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <FormTable
                        dataSource={dataSource}
                        changeSore={this.changeSore}
                        loading={loading}
                    />
                    <div style={{overflow: 'hidden'}}>
                        <LocaleProvider locale={zh_CN}>
                            <Pagination showSizeChanger onShowSizeChange={this.onShowSizeChange}
                                        onChange={this.onChangePage}
                                        total={this.state.dataAll.total}
                                        showTotal={this.showTotal.bind(this.state.dataAll.total)}
                                        current={applyData.current}
                                        defaultPageSize={40}/>
                        </LocaleProvider>
                    </div>
                </div>
            </div>
        )

    }
}
