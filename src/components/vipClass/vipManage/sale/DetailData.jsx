import React, { Component } from 'react';
import './DetailData.less';

import {Row, Col, Input, Button, Select, Pagination, LocaleProvider, Radio, DatePicker, Modal, Table, Card, message} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';

import CollectionCreateForm from './CustomizedForm';
import FormTable from './FormTable';
import {addFriendTime, addRemark, getChannels, getClasses, getEditClassList, getSellers, getVipUserList, reviseClass} from "../../../../api/vipCourseApi";
import {formatDateDay, priceType, disabledDate, vipAuthor, formatDateTime} from "../../../../utils/filter";
import {getDate, getTimeDistance} from "../../../../utils/utils";

const RadioGroup = Radio.Group;
const {RangePicker} = DatePicker;

let search = false;

// 修改备注提交参数
let remarks = {
    orderId: null,
    remark: ''
};

// 修改班次提交参数
let classParams = {
    orderId: null,
    classId: null
};

// 添加好友时间提交参数
let friendParams = {
    orderId: null,
    friendTime: null
};

let customCondition = {
    courseId: null,
    startTime: null,
    endTime: null,
    search: null,
    classId: null,
    sellerId: null,
    channelId: null,
    payType: null
};
let applyData = {
    size: 40,
    current: 1,
    ascs: [],
    descs: ['payTime'],
    condition: customCondition
};

let emojiRule = /([\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70-\uDD71\uDD7E-\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01-\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50-\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96-\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF])|(\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F-\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95-\uDD96\uDDA4-\uDDA5\uDDA8\uDDB1-\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB-\uDEEC\uDEF0\uDEF3-\uDEF6])|(\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0])/g;

export default class UForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            courseId: parseInt(window.location.pathname.slice(15)),
            visible: false, // 新建窗口隐藏
            friendVisible: false,
            classVisible: false,
            dataSource: [],
            timeData: [],
            dataAll: '',
            selectedRowKeys: [],
            tableRowKey: 0,
            isUpdate: false,
            loading: true,
            seller: [],
            channel: [],
            classes: [],
            payment: [{
               payId: 'wechat',
               payName: '微信',
            },{
                payId: 'alipay',
                payName: '支付宝',
            }],
            classValue: 0,
            sellerValue: 0,
            payValue: 0,
            channelValue: 0,
            classesValue: 0,
            disableBtn: false,
            resetBtn: false,
            salePage: 2,
            rangePicker: getTimeDistance('week'),
            replay: true,
            classId: null
        };
    }

    // 获取vip用户列表
    getVipUser = () => {
        console.log(applyData, "========vip列表请求数据");
        getVipUserList(applyData).then(response => {
            console.log(response.data.data, "=======vip用户列表");
            if (response.data.code === 0) {
                this.setState({
                    dataSource: response.data.data.records,
                    loading: false,
                    dataAll: response.data.data,
                    disableBtn: false,
                    resetBtn: false
                });
            } else {
                this.setState({
                    dataSource: [],
                    loading: false,
                    dataAll: [],
                    disableBtn: false,
                    resetBtn: false
                });
                message.error(response.data.msg)
            }
            console.log(this.state.dataAll);
            search = true;
        })
    };

    // 获取销售下拉菜单
    getSellerList = () => {
        getSellers(this.state.courseId).then(res => {
            console.log(res.data.data, '========销售下拉菜单');
            this.setState({
                seller: res.data.data
            });
        })
    };

    // 获取班次下拉菜单
    getClassList = () => {
        getClasses(this.state.courseId).then(res => {
            console.log(res.data.data, '========班次下拉菜单');
            this.setState({
                classes: res.data.data
            });
            let classNameValue = '';
            if (this.props.classId) {
                for (let i = 0; i < this.state.classes.length; i++) {
                    if (parseInt(this.state.classes[i].classId) === parseInt(this.props.classId)) {
                        classNameValue = this.state.classes[i].className
                    }
                }
                this.setState({
                    classValue: classNameValue
                });
                customCondition.classId = parseInt(this.props.classId);
                this.getVipUser();
                this.node.scrollIntoView();
            }
        })
    };

    // 获取渠道下拉菜单
    getChannelList = () => {
        getChannels(this.state.courseId).then(res => {
            console.log(res.data.data, '========渠道下拉菜单');
            this.setState({
                channel: res.data.data
            })
        })
    };

    // 渲染
    componentDidMount(){
        customCondition.courseId = this.state.courseId;
        console.log(window.location.search.slice(window.location.search.lastIndexOf('_') + 1));
        let input = document.querySelectorAll('input');
        for (let i = 0; i < input.length; i++) {
            input[i].autocomplete = "off"
        }
        //判断权限--有权限则请求，没权限不请求
        if(vipAuthor('marketing:vipcourse:sales:list', this.props.subjectId)){
            this.selectDetailDate('month', 2);
            this.getSellerList();
            this.getClassList();
            this.getChannelList();
        }
        // this.getVipUser();
    };

    // 组件卸载
    componentWillUnmount(){
        this.setState({
            classValue: 0
        });
        customCondition.classId = null;
    };

    // 排序
    changeSore = (dataIndex, record, sorter) => {
        console.log(sorter.order);
        applyData.descs = (sorter.order === "descend" ? [sorter.field] : []);
        applyData.ascs = (sorter.order === "ascend" ? [sorter.field] : []);
        let arr = Object.keys(sorter); //此方法为ES6新方法，返回值是对象中属性名组成的数组；
        if(arr.length === 0){
            applyData.descs = ['payTime'];
        }
        applyData.current = 1;
        this.getVipUser();
    };

    // 接受新建表单数据
    saveFormRef = (form) => {
        this.form = form;
    };

    // 取消
    handleCancel = () => {
        this.setState({ visible: false });
    };

    // 班次筛选
    chooseClass = (value, e) => {
        applyData.current = 1;
        customCondition.classId = parseInt(e.key);
        console.log(value, e);
        this.setState({
            loading: true,
            classValue: value
        });
        this.getVipUser();
    };

    // 销售筛选
    chooseSeller = (value, e) => {
        applyData.current = 1;
        customCondition.sellerId = parseInt(e.key);
        this.setState({
            loading: true,
            sellerValue: value
        });
        this.getVipUser();
    };

    // 支付方式筛选
    choosePay = (value, e) => {
        applyData.current = 1;
        customCondition.payType = e.key;
        this.setState({
            loading: true,
            payValue: value
        });
        this.getVipUser();
    };

    // 渠道筛选
    chooseChannel = (value, e) => {
        applyData.current = 1;
        customCondition.channelId = parseInt(e.key);
        this.setState({
            loading: true,
            channelValue: value
        });
        this.getVipUser();
    };

    // 搜索
    searchUser = () => {
        let inputUser = document.getElementById('search');
        customCondition.search = inputUser.value;
        this.setState({
            loading: true,
        });
        applyData.current = 1;
        if (search) {
            this.setState({
                loading: true,
                disableBtn: true
            });
            this.getVipUser();
        }
    };

    // 重置
    searchReset = () => {
        document.getElementById('search').value = null;
        customCondition.search = null;
        customCondition.sellerId = null;
        customCondition.classId = null;
        customCondition.channelId = null;
        customCondition.payType = null;
        applyData.current = 1;
        this.setState({
            loading: true,
            sellerValue: 0,
            channelValue: 0,
            classValue: 0,
            payValue: 0,
            resetBtn: true
        });
        console.log(applyData);
        this.getVipUser();
    };

    // 改变页码
    onChangePage = (page, pageSize) => {
        applyData.size = pageSize;
        applyData.current = page;
        this.getVipUser();
    };

    // 改变每页条数
    onShowSizeChange = (current, pageSize) => {
        applyData.size = pageSize;
        applyData.current = current;
        this.getVipUser();
    };

    // vip用户列表总条数
    showTotal = (total) => {
        return `共 ${total} 条数据`;
    };

    // 备注格式检查：禁止输入空格和表情符，长度不超100
    remarkCheck = (e) => {
        if (e.target.value.length === 0) {
            this.setState({
                titleHint: '', titleState: 'success'
            })
        }
        else if (!(e.target.value.indexOf(" ") === -1)) {
            this.setState({
                titleHint: '禁止输入空格',
                titleState: 'error'
            })
        } else if (emojiRule.test(e.target.value)) {
            this.setState({
                titleHint: '禁止输入emoji',
                titleState: 'error'
            })
        } else if (e.target.value.length > 100) {
            this.setState({
                titleHint: '不能超过100字',
                titleState: 'error'
            })
        } else {
            this.setState({
                titleHint: '',
                titleState: 'success'
            })
        }
    };

    // 添加修改好友时间
    changeFriendDate = (date, dateString) => {
        console.log(new Date(date).getTime(), dateString);
        friendParams.friendTime = Math.round(new Date(date).getTime() / 1000);
    };

    // 编辑好友时间
    editFriendTime = (record) => {
        console.log(record);
        this.setState({
            friendVisible: true,
            isUpdate: true
        });
        friendParams.orderId = record.orderId;
    };

    // 确认完善好友时间
    showFriendTime = () => {
        console.log(friendParams);
        this.setState({
            friendVisible: false,
            loading: true
        });
        addFriendTime(friendParams).then(() => {
            this.getVipUser()
        })
    };

    // 取消完善好友
    cancelFriend = () => {
        this.setState({ friendVisible: false });
    };

    // 修改班次列表
    getEditClassList = (orderId) => {
        getEditClassList({
            orderId: orderId
        }).then(response => {
            console.log(response.data.data, "============修改班次列表");
            this.setState({
                timeData: response.data.data,
            });
        })
    };

    // 修改班次下拉
    changeClass = (value, e) => {
        console.log(value, e.key);
        this.setState({
            classesValue: value
        });
        classParams.classId = parseInt(e.key);
    };

    // 修改班次
    editClass = (record) => {
        console.log(record.orderId);
        this.getEditClassList(record.orderId);
        this.setState({
            classVisible: true,
            isUpdate: true
        });
        classParams.orderId = parseInt(record.orderId);
    };

    // 修改班次确认
    reviseClass = () => {
        console.log(classParams);
        this.setState({
            classVisible: false,
            loading: true
        });
        reviseClass(classParams).then(() => {
            this.getVipUser()
        })
    };

    // 取消修改班次
    cancelClass = () => {
        this.setState({ classVisible: false });
    };

    // 表内单行备注
    editRemark = (record) => {
        const form = this.form;
        form.setFieldsValue({
            remark: record.remark
        });
        remarks.orderId = record.orderId;
        this.setState({
            visible: true,
            isUpdate: true,
            titleHint: '',
            titleState: record.remark ? 'success' : ''
        });
    };

    // 提交备注信息
    addRemark = () => {
        console.log(remarks);
        this.form.validateFields((err, values) => {
            remarks.remark = values.remark
        });
        this.setState({
            visible: false,
            loading: true
        });
        addRemark(remarks).then(() => {
            this.getVipUser();
        })
    };

    // 修改总销售额的单选框
    changePageSales = (e) => {
        console.log('radio checked', e.target.value);
        this.setState({
            salePage: e.target.value,
        });
        this.getVipUser();
    };

    // 销售详细数据日期选择
    handleRangePicker = (rangePickerValue, dateString) => {
        console.log(new Date(rangePickerValue[0]).getTime(),new Date(rangePickerValue[1]).getTime(), dateString, "=========详细数据日期选择");
        customCondition.startTime = Math.round((new Date(rangePickerValue[0]).getTime()) / 1000);
        customCondition.endTime = Math.round((new Date(rangePickerValue[1]).getTime()) / 1000);;
        console.log();
        this.setState({
            rangePicker: rangePickerValue
        });
        this.getVipUser();
        this.changeDateStyle(null);
    };

    // 销售详细数据改变时间
    selectDetailDate = (type, index) => {
        console.log(type, index);
        this.setState({
            rangePicker: getTimeDistance(type)
        });
        customCondition.startTime = Math.round(getDate(type).value[0] / 1000);
        customCondition.endTime = Math.round(getDate(type).value[1] / 1000);
        console.log(getDate(type).datePick, getDate(type).value, "======销售详细数据时间");
        this.changeDateStyle(index);
        this.getVipUser();
    };

    // 改变日期样式
    changeDateStyle = (index) => {
        let aTags = document.querySelectorAll('.detail-div a');
        for (let i = 0; i < aTags.length; i++) {
            if (i === index) {
                aTags[i].classList.add('click-a')
            } else {
                aTags[i].classList.remove('click-a')
            }
        }
    };

    render(){
        const { dataSource, visible, loading, friendVisible, timeData, classVisible, dataAll, rangePicker} = this.state;
        const { Option} = Select;
        const {subjectId} = this.props;
        const columns = [{
            title: '修改记录',
            dataIndex: 'className',
        }, {
            title: '修改时间',
            dataIndex: 'createTime',
            render: (dataIndex) => dataIndex ? formatDateTime(dataIndex) : '/'
        }, {
            title: '修改人',
            dataIndex: 'createBy',
        }];
        const detailExtra = (
            <div className="sale-pick">
                <div className="detail-div" style={{float: 'left'}}>
                    <a style={{marginRight: '20px', color: '#666'}} onClick={() => this.selectDetailDate('today', 0)}>
                        今日
                    </a>
                    <a style={{marginRight: '20px', color: '#666'}} onClick={() => this.selectDetailDate('week', 1)}>
                        本周
                    </a>
                    <a style={{marginRight: '20px', color: '#666'}} onClick={() => this.selectDetailDate('month', 2)}>
                        本月
                    </a>
                    <a style={{marginRight: '20px', color: '#666'}} onClick={() => this.selectDetailDate('year', 3)}>
                        全年
                    </a>
                </div>
                <RangePicker
                    value={rangePicker}
                    onChange={this.handleRangePicker}
                    disabledDate={disabledDate}
                    style={{width: 256}}
                />
            </div>
        );
        const saleDetail = (
            <div>
                <div className="sale-title">
                    详细数据列表
                </div>
                {detailExtra}
            </div>
        );
        return(
            <Card title={saleDetail} bordered={false} bodyStyle={{padding: 24}} style={{marginTop: '20px'}}>
                {vipAuthor('marketing:vipcourse:sales:list', subjectId) ?
                    <div className="vip-sale" style={{margin: '-20px'}}>
                        <div className='formBody' ref={node => this.node = node}>
                            <Row gutter={16}>
                                <Col className="gutter-row sale-label label" sm={3} style={{marginTop: '3px'}}>
                                    <span>筛选：</span>
                                </Col>
                                <Col className="gutter-row" id="channel" sm={18} span={3}>
                                    <Select
                                        style={{width: 160}}
                                        defaultValue={0}
                                        value={this.state.classValue}
                                        onChange={this.chooseClass}
                                        getPopupContainer={() => document.getElementById('channel')}
                                    >
                                        <Option value={0}>选择班次</Option>
                                        {
                                            this.state.classes && this.state.classes.map((value, index) => {
                                                return (<Option key={parseInt(value.classId)}
                                                                value={index + 1}>{value.className}</Option>)
                                            })
                                        }
                                    </Select>
                                    <Select
                                        style={{width: 160}}
                                        defaultValue={0}
                                        value={this.state.sellerValue}
                                        onChange={this.chooseSeller}
                                        getPopupContainer={() => document.getElementById('channel')}
                                    >
                                        <Option value={0}>选择销售</Option>
                                        {
                                            this.state.seller && this.state.seller.map((value, index) => {
                                                return (<Option key={value.salesId}
                                                                value={index + 1}>{value.salesName}</Option>)
                                            })
                                        }
                                    </Select>
                                    {/*<Select*/}
                                        {/*style={{width: 160}}*/}
                                        {/*defaultValue={0}*/}
                                        {/*value={this.state.payValue}*/}
                                        {/*onChange={this.choosePay}*/}
                                        {/*getPopupContainer={() => document.getElementById('channel')}*/}
                                        {/*className="payment-sale"*/}
                                    {/*>*/}
                                        {/*<Option value={0}>选择支付方式</Option>*/}
                                        {/*{*/}
                                            {/*this.state.payment.map((value, index) => {*/}
                                                {/*return (*/}
                                                    {/*<Option key={value.payId}*/}
                                                            {/*value={index + 1}>{value.payName}</Option>)*/}
                                            {/*})*/}
                                        {/*}*/}
                                    {/*</Select>*/}
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col className="gutter-row sale-label label" sm={3} style={{marginTop: '3px'}}>
                                    <span>渠道：</span>
                                </Col>
                                <Col className="gutter-row" id="channel" sm={8} span={3}>
                                    <Select
                                        style={{width: 160}}
                                        defaultValue={0}
                                        value={this.state.channelValue}
                                        onChange={this.chooseChannel}
                                        getPopupContainer={() => document.getElementById('channel')}
                                    >
                                        <Option value={0}>选择渠道</Option>
                                        {
                                            this.state.channel && this.state.channel.map((value, index) => {
                                                return (<Option key={value.channelId}
                                                                value={index + 1}>{value.channelName}</Option>)
                                            })
                                        }
                                    </Select>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col className="gutter-row sale-label label" sm={3} style={{marginTop: '5px'}}>
                                    <span>搜索：</span>
                                </Col>
                                <Col className="gutter-row" sm={8}>
                                    <Input placeholder="搜索昵称/备注" id="search"/>
                                </Col>
                                <Col className="gutter-row" sm={9}>
                                    <Button type="primary" style={{marginRight: '20px'}} onClick={this.searchUser}
                                            disabled={this.state.disableBtn}>搜索</Button>
                                    <Button type="default" onClick={this.searchReset}
                                            disabled={this.state.resetBtn}>全部重置</Button>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col className="gutter-row sale-label label" sm={3} style={{marginTop: '3px'}}>
                                    <span>总销售额：</span>
                                </Col>
                                <Col className="gutter-row" id="channel" sm={8} span={3}>
                                    <RadioGroup onChange={this.changePageSales} value={this.state.salePage}>
                                        <Radio value={1}>当前页</Radio>
                                        <Radio value={2}>所有页</Radio>
                                    </RadioGroup>
                                    <span>￥{this.state.salePage === 1 ? priceType(dataAll.price ? dataAll.price : 0) : priceType(dataAll.allPrice ? dataAll.allPrice : 0)}</span>
                                </Col>
                            </Row>
                            <FormTable
                                dataSource={dataSource}
                                changeSore={this.changeSore}
                                editClick={this.editRemark}
                                editFriendTime={this.editFriendTime}
                                editClass={this.editClass}
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
                            <CollectionCreateForm
                                onCreate={this.addRemark}
                                ref={this.saveFormRef}
                                onCancel={this.handleCancel}
                                visible={visible}
                                title="备注"
                                style={{fontSize: '20px'}}
                                onRemarkCheck={this.remarkCheck}
                                titleHint={this.state.titleHint}
                                titleState={this.state.titleState}
                            />
                            <Modal
                                visible={friendVisible}
                                title={
                                    <div>
                                        <h4 style={{display: 'inline-block', marginRight: '10px'}}>完善</h4>
                                        <span style={{
                                            fontSize: '12px',
                                            color: 'gray',
                                            fontWeight: '200'
                                        }}>请按照微信内备注的实际添加好友时间为准，如无则不填。</span>
                                    </div>
                                }
                                okText="确定"
                                cancelText="取消"
                                onCancel={this.cancelFriend}
                                onOk={this.showFriendTime}
                            >
                                <div style={{textAlign: 'center', paddingBottom: '20px'}} id="input">
                                    <span>加好友时间：</span>
                                    <LocaleProvider locale={zh_CN}>
                                        <DatePicker
                                            onChange={this.changeFriendDate}
                                            disabledDate={disabledDate}
                                        />
                                    </LocaleProvider>
                                </div>
                            </Modal>
                            <Modal
                                visible={classVisible}
                                title="修改班次"
                                footer={null}
                                onCancel={this.cancelClass}
                            >
                                <div style={{textAlign: 'center', paddingBottom: '20px'}} id="class">
                                    <span>班次：</span>
                                    <Select
                                        defaultValue={0}
                                        value={this.state.classesValue}
                                        onChange={this.changeClass}
                                        getPopupContainer={() => document.getElementById('class')}
                                        className="class-choose"
                                    >
                                        <Option value={0}>请选择</Option>
                                        {
                                            this.state.classes && this.state.classes.map((value, index) => {
                                                return (<Option key={value.classId}
                                                                value={index + 1}>{value.className}</Option>)
                                            })
                                        }
                                    </Select>
                                    <Button style={{marginLeft: '15px'}} type="primary"
                                            onClick={this.reviseClass}>修改</Button>
                                    <Table
                                        key={(record, i) => i}
                                        rowKey={(record, i) => i}
                                        style={{marginTop: '20px'}}
                                        columns={columns}
                                        dataSource={timeData}
                                        pagination={false}
                                        bordered={false}
                                    />
                                </div>
                            </Modal>
                        </div>
                    </div> :
                    <div style={{textAlign: 'center', margin: '30px auto'}}>没有数据</div>}
            </Card>
        )
    }
}
