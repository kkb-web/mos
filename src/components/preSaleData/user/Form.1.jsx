import React, { Component } from 'react';
import './Form.less';
import {Row, Col, Input, Button, Select, Pagination, LocaleProvider, message, Alert, Modal, Tabs} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import CollectionCreateForm from './CustomizedForm';
import FormTable from './FormTable';
import Selector from './Select';
import {
    urlStudentList,
    urlStuCondition,
    studentRemark,
    sendMsg,
    chooseAllUser,
    distributeFlow,
    historyNews
} from '../../../api/openCourseApi';

import { studentList } from '../../../api/preSaleData'
import {formatDateTime} from '../../../utils/filter';
import Text from "./Text";
import Picture from "./Picture";
import {getCollectTemplate, getMsgTextList, getTextList} from "../../../api/marketApi";
import {openAuthor} from "../../../utils/filter";

const TabPane = Tabs.TabPane;

let remarks = {
    ids: null,
    remark: ''
};
let condition = {
    pv: null,
    signupStatus: null,
    messageCount: null,
    subscribe: null,
    liveDuration: null,
    replayDuration: null,
    durationCount: null,
    sellerId: null,
    channelCode: null,
    search: null,
    level: null
};
let params = {
    size: 40,
    current: 1,
    ascs: null,
    descs: ['signupTime'],
    condition: condition
};
let choosePicId = [], choosePicMediaId = [], choosePicUrl = [];
let sorterValue = '';
let emojiRule = /([\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70-\uDD71\uDD7E-\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01-\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50-\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96-\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF])|(\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F-\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95-\uDD96\uDDA4-\uDDA5\uDDA8\uDDB1-\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB-\uDEEC\uDEF0\uDEF3-\uDEF6])|(\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0])/g;

let firstText = true;

let textParams = {
    size: 20,
    current: 1
};

export default class UForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            titleHint: '',
            titleState: '',
            visible: false, //新建窗口隐藏
            flowVisible: false,
            historyNewsVisible: false,
            msgVisible: false,
            dataSource: [],
            dataAll: '',
            count: '',
            selectedRowKeys: [],
            selectedUser: [],
            tableRowKey: 0,
            isUpdate: false,
            loading: true,
            isSearch: false,
            isReset: false,
            signupValue: '0',       // 选中的报名状态
            subscribeValue: '0',    // 选中的关注状态
            sellerValue: '0',       // 选中的销售
            channelCode: "0",       // 选中的渠道名称
            channels: [],           // 某一销售的所有渠道
            pv: [],                 // 查看次数
            messageCount: [],       // 消息发送次数
            liveDuration: [],       // 直播时长
            replayDuration: [],     // 回放时长
            durationCount: [],      // 观看时长
            data: {                 // 自定义筛选条件数据
                signupStatus: [],   // 报名状态
                subscribe: [],      // 关注状态
                sellerId: [],       // 销售ID
                channelCode: [],    // 所有渠道(二维数组)
                search: [],         // 搜索用到的昵称或备注
                sellers: []
            },
            levelValue: "null",
            timesValue: '查看次数',
            sendNews: '消息发送次数',
            liveValue: '直播时长',
            replayValue: '回放时长',
            watchValue: '观看时长',
            flowSeller: '选择销售',
            disableBtn: true,
            msgDisableBtn: true,
            tabKey: '0',
            modalData: [],
            cannotSendMsg: 0,
            previewVisible:false,  //预览图片modal
            previewImage:'',
            historyNewsData: [],
            historyNewsDataMessage:[],
            sendLoading: false,
            sendText: '发送',
            flowLoading: false,
            flowText: '确认分配',
            changeFirst: false,
            mockhistoryData: {
                allSize:30,
                portionSize:10,
                data:[
                    {
                        content: "成旭同学你好，小助理发现你报了《测试13》课，还没有来学习哦~  你怎么能偷懒呢... 小助理这里有为你量身定制的学习计划和免费视频，还剩30个领取名额，快来加小助理微信吧~",
                        createTime: 1555564938,
                        id: 1,
                        msgType:1,
                        createBy:'江忠林',
                        courseName:'web全栈架构师'
                    },
                    {
                        content: 15289621868228976,
                        createTime: 1555564938,
                        id: 2,
                        msgType:2,
                        createBy:'小马哥',
                        courseName:'javaee'
                    }, {
                        content: "成旭同学你好，小助理发现你报了《测试13》课，还没有来学习哦~  你怎么能偷懒呢... 小助理这里有为你量身定制的学习计划和免费视频，还剩30个领取名额，快来加小助理微信吧~",
                        createTime: 1555564938,
                        id: 3,
                        msgType:1,
                        createBy:'习大大',
                        courseName:'机器学习训练营'
                    }
                ]
            }
        };
    }

    // 渲染
    componentDidMount() {
        this.getTextList();
        // 请求学员情况条件下拉接口获取option
        // console.log(window.location.pathname.slice(17),"121212")
        // studentList(window.location.pathname.slice(17)).then(res => {
        //     console.log('res', res)
        //     this.setState({
        //         data: res.data.data
        //     });
        //     let pvArray = this.state.data.pv;
        //     let newsArray = this.state.data.messageCount;
        //     let liveArray = this.state.data.liveDuration;
        //     let replayArray = this.state.data.replayDuration;
        //     let watchArray = this.state.data.durationCount;
        //     // 将默认状态插入到对应条件的数组中
        //     pvArray.splice(0, 0, {key: '0', value: '查看次数'});
        //     newsArray.splice(0, 0, {key: '0', value: '消息发送次数'});
        //     liveArray.splice(0, 0, {key: '0', value: '直播时长'});
        //     replayArray.splice(0, 0, {key: '0', value: '回放时长'});
        //     watchArray.splice(0, 0, {key: '0', value: '观看时长'});
        //     this.setState({
        //         pv: pvArray,
        //         messageCount: newsArray,
        //         liveDuration: liveArray,
        //         replayDuration: replayArray,
        //         durationCount: watchArray
        //     })
        // });

        // condition.pv = null;
        // condition.signupStatus = null;
        // condition.messageCount = null;
        // condition.subscribe = null;
        // condition.liveDuration = null;
        // condition.replayDuration = null;
        // condition.durationCount = null;
        // condition.sellerId = null;
        // condition.channelCode = null;
        // condition.search = null;
        // params.current = 1;
        // params.size = 40;
        this.getMemberList();
    };

    // 获取学员列表信息
    getMemberList = () => {
        studentList({
            id: parseInt(window.location.pathname.slice(12)),
            data: params
        }).then(response => {
            console.log('response', response)
            // 返回码为0时，才能正确赋值，否则赋值为空
            // if (response.data.code === 0) {
                // this.setState({
                //     dataSource: response.data.data.records,
                //     count: response.data.data.records.length,
                //     dataAll: response.data.data,
                // });
            // } else {
            //     this.setState({
            //         dataSource: [],
            //         count: '',
            //         dataAll: '',
            //     })
            // }
            this.setState({
                loading: false,
                isSearch: false,
                isReset: false,
            });
        });
    };

    // 接受新建表单数据
    saveFormRef = (form) => {
        this.form = form;
    };

    // 多选
    checkChange = (selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys, selectedRows);
        this.setState({selectedRowKeys: selectedRowKeys});
        let data = selectedRows;
        let count = 0;
        for (let i = 0; i < data.length; i++) {
            let time = data[i].interactionTime,
                nowTime = parseInt(new Date().getTime() / 1000),
                valueTime = Math.ceil((nowTime - time) / 60 / 60 / 24);
            if (data[i].subscribe === 0 || valueTime > 2) {
                count++;
            }
        }
        this.setState({
            cannotSendMsg: count
        });
        console.log(count, "==========");
    };

    // 排序
    handleChangeSore = (dataIndex, record, sorter) => {
        sorterValue = sorter.field;
        // 报名状态列排序是用signupTime字段排的
        if (sorterValue === "signup" || !sorterValue) {
            sorterValue = 'signupTime'
        } else {
            sorterValue = sorter.field
        }
        params.ascs = (sorter.order === "ascend" ? [sorterValue] : []);
        params.descs = (sorter.order === "ascend" ? [] : [sorterValue]);
        params.current = 1;
        this.getMemberList();
    };

    // 取消
    handleCancel = () => {
        this.setState({visible: false});
    };
    // 预览取消
    handleCancelImg = () => {
        this.setState({
            previewVisible: false,
        });
    };

    // 是否报名筛选
    handleApply = (value, e) => {
        if (e.key !== null) {
            condition.signupStatus = parseInt(e.key)
        } else {
            condition.signupStatus = null
        }
        params.current = 1;
        this.setState({
            loading: true,
            signupValue: value
        });
        this.getMemberList();
    };

    // 关注状态筛选
    handleAttention = (value, e) => {
        if (e.key !== null) {
            condition.subscribe = parseInt(e.key)
        } else {
            condition.subscribe = null
        }
        params.current = 1;
        this.setState({
            loading: true,
            subscribeValue: value
        });
        this.getMemberList();
    };

    // Selector组件传参：选中项的value，筛选条件name
    chooseValue = (value, name) => {
        document.querySelector('.list.' + name).style.display = 'none';
        let min, max;
        if (value.key !== '0') {
            min = value.key.match(/(\S*)_/)[1];
            max = value.key.match(/_(\S*)/)[1];
        } else {
            min = null;
            max = null;
        }
        this.setState({
            loading: true,
        });
        this.getMinMax(min, max, name, value.value);
        this.getMemberList();

    };

    // Selector组件自定义部分传参：最小值，最大值
    valueOk = (min, max, name) => {
        document.querySelector('.list.' + name).style.display = 'none';
        let value = '';
        if (name === 'living' || name === 'replay' || name === 'watch') {
            value = min + '-' + max + '分钟';
        } else {
            value = min + '-' + max + '次';
        }
        this.getMinMax(min, max, name, value);
        this.setState({
            loading: true,
        });
        this.getMemberList();
    };

    // 获取筛选条件的最大值和最小值
    getMinMax = (min, max, name, value) => {
        console.log(min, max, name, value, "=======");
        let minValue = parseInt(min);
        let maxValue = parseInt(max);
        let betweenValue = (min !== null && max !== null) ? {
            min: minValue,
            max: maxValue
        } : null;
        let timeValue = (min !== null && max !== null) ? {
            min: minValue * 60,
            max: maxValue * 60
        } : null;
        // 查看次数
        if (name === 'view') {
            this.setState({
                timesValue: value
            });
            condition.pv = betweenValue
            // condition.pv.min = minValue;
            // condition.pv.max = maxValue;
        }
        // 消息发送次数
        if (name === 'messageCount') {
            this.setState({
                sendNews: value
            });
            condition.messageCount = betweenValue
            // condition.messageCount.min = minValue;
            // condition.messageCount.max = maxValue;
        }
        // 直播时长
        if (name === 'living') {
            this.setState({
                liveValue: value
            });
            condition.liveDuration = timeValue
            // condition.liveDuration.min = minValue * 60000;
            // condition.liveDuration.max = maxValue * 60000;
        }
        // 回放时长
        if (name === 'replay') {
            this.setState({
                replayValue: value
            });
            condition.replayDuration = timeValue
            // condition.replayDuration.min = minValue * 60000;
            // condition.replayDuration.max = maxValue * 60000;
        }
        // 观看时长
        if (name === 'watch') {
            this.setState({
                watchValue: value
            });
            condition.durationCount = timeValue
            // condition.durationCount.min = minValue * 60000;
            // condition.durationCount.max = maxValue * 60000;
        }
    };

    // 销售筛选
    handleChooseSeller = (value, e) => {
        console.log(value, e, "========");
        if (e.key !== null) {
            condition.sellerId = parseInt(e.key);
            condition.channelCode = null;
            // 级联实现的关键一步，渠道所有选项与当前销售的选择有关
            this.setState({
                channels: this.state.data.sellers[e.props.value - 1].channels,
                channelCode: "0"
            });
            // end
        } else {
            condition.sellerId = null;
            condition.channelCode = null;
            // 销售未做选择时，渠道选项为空
            this.setState({
                channels: [],
                channelCode: "0"
            });
        }
        params.current = 1;
        this.setState({
            loading: true,
            sellerValue: value
        });
        this.getMemberList();
    };

    //等级下拉
    handleChooseLevel = (value) => {
        if (value == 'null') {
            this.setState({
                levelValue: 'null',
                loading: true,
            });
            condition.level = null;
            this.getMemberList();
        } else {
            this.setState({
                levelValue: value,
                loading: true,
            });
            condition.level = value;
            this.getMemberList();
        }
    };

    // 渠道筛选
    handleChooseChannel = (value, e) => {
        console.log(value, e);
        if (e.key !== null) {
            condition.channelCode = e.key;
            this.setState({
                loading: true,
                channelCode: e.props.children
            });
        } else {
            condition.channelCode = null;
            this.setState({
                loading: true,
                channelCode: "0"
            });
        }
        params.current = 1;
        this.setState({
            loading: true,
        });
        this.getMemberList();
    };


    // 搜索
    searchUser = () => {
        let inputUser = document.getElementById('search');
        condition.search = inputUser.value;
        params.current = 1;
        this.setState({
            loading: true,
            isSearch: true
        });
        this.getMemberList();
    };

    // 重置
    searchReset = () => {
        document.getElementById('search').value = null;
        condition.pv = null;
        condition.signupStatus = null;
        condition.messageCount = null;
        condition.subscribe = null;
        condition.liveDuration = null;
        condition.replayDuration = null;
        condition.durationCount = null;
        condition.sellerId = null;
        condition.channelCode = null;
        condition.search = null;
        condition.level = null
        params.current = 1;
        this.setState({
            loading: true,
            isReset: true,
            signupValue: '0',
            subscribeValue: '0',
            sellerValue: '0',
            channelCode: '0',
            channels: [],
            timesValue: '查看次数',
            sendNews: '消息发送次数',
            liveValue: '直播时长',
            replayValue: '回放时长',
            watchValue: '观看时长',
            levelValue: 'null'
        });
        this.getMemberList();
    };

    // 改变页码
    handleChangePage = (page, pageSize) => {
        params.size = pageSize;
        params.current = page;
        this.getMemberList();
    };

    // 改变每页条数
    handleShowSizeChange = (current, pageSize) => {
        params.size = pageSize;
        params.current = current;
        this.getMemberList();
    };

    // 展示数据总条数
    showTotal = (total) => {
        return `共 ${total} 条数据`;
    };

    // 表内单行备注
    editClick = (id, remark) => {
        remarks = {
            ids: [],
            remark: ''
        };
        const form = this.form;
        form.setFieldsValue({
            remark: remark
        });
        remarks.ids.push(id);
        remarks.remark = remark;
        this.setState({
            visible: true,
            tableRowKey: id,
            isUpdate: true,
            titleHint: '',
            titleState: remark ? 'success' : ''
        });
    };

    // 批量备注
    handleAddMark = () => {
        this.setState({
            visible: true,
            titleHint: '',
            titleState: ''
        });
        remarks.ids = this.state.selectedRowKeys;
        if (this.state.selectedRowKeys.length === 0) {
            // 没有勾选时提示信息
            message.warning('请先选择要批量备注的用户！');
            this.setState({
                visible: false
            });
        } else if (this.state.selectedRowKeys.length === 1) {
            // 勾选一个时，备注弹出框显示当前行remark
            this.state.dataSource && this.state.dataSource.map((data) => {
                if (data.id === this.state.selectedRowKeys[0]) {
                    // 根据所选行的Id，从接口请求的数据里获取对应remark
                    remarks.remark = data.remark;
                }
            });
            if (remarks.remark) {
                this.setState({
                    titleState: 'success'
                })
            }
        } else {
            // 勾选多个时，备注弹出框为空
            remarks.remark = '';
        }
        const form = this.form;
        form.setFieldsValue({
            remark: remarks.remark
        });
    };

    // 备注格式检查：禁止输入空格和表情符，长度不超100
    remarkCheck = (e) => {
        if (e.target.value.length === 0) {
            this.setState({
                titleHint: '',
                titleState: 'success'
            })
        } else if (!(e.target.value.indexOf(" ") === -1)) {
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

    // 提交备注信息
    handleReviseNotes = () => {
        let _this = this;
        let remark = '';
        this.form.validateFields((err, values) => {
            remark = values.remark
        });
        remarks.remark = remark;
        this.setState({
            visible: false,
            loading: true
        });
        studentRemark(remarks).then(() => {
            _this.getMemberList();
        })
    };

    // 表内分配流量
    editFlow = (record) => {
        console.log(record.id, "==========表内分配流量");
        this.setState({
            flowVisible: true,
            inlineFlow: true,
            flowUser: [record.id]
        })
    };

    // 批量分配流量
    handleFlow = () => {
        let flowUser = this.state.selectedRowKeys;
        this.setState({
            flowVisible: true,
            inlineFlow: false,
            flowUser: flowUser
        });
        if (this.state.selectedRowKeys.length === 0) {
            // 没有勾选时提示信息
            message.warning('请先选择要批量分配的用户！');
            this.setState({
                flowVisible: false
            });
        } else {

        }
    };

    // 分配流量选择销售
    chooseSellerFlow = (value, e) => {
        console.log(value, e, "========");
        this.setState({
            flowSeller: parseInt(e.key),
            disableBtn: false
        })
    };

    // 确定分配流量
    distributeFlow = () => {
        console.log(this.state.selectedRowKeys, this.state.flowSeller);
        this.setState({
            flowLoading: true,
            flowText: '分配中'
        });
        distributeFlow({
            sellerId: this.state.flowSeller,
            ids: this.state.flowUser
        }).then(res => {
            // console.log(res.data);
            if (res.data.code === 0) {
                message.success('分配成功');
                this.setState({
                    flowVisible: false,
                    flowLoading: false,
                    flowText: '确认分配',
                    flowSeller: '选择销售'
                });
                this.getMemberList();
            } else {
                message.error(res.data.msg);
                this.setState({
                    flowLoading: false,
                    flowText: '确认分配'
                })
            }
        }).catch(() => {
            this.setState({
                flowLoading: false,
                flowText: '确认分配',
            })
        })
        // Modal.confirm({
        //     title: <p style={{fontSize: '14px', lineHeight: '20px', color: '#999', fontWeight: 400}}>{5}个学员分配失败了，立即一件筛选分配失败的用户，去重新分配</p>,
        //     content: null,
        //     okText: '一键筛选',
        //     cancelText: '取消',
        //     iconType: 'exclamation-circle',
        //     contentType: 'normal',
        //     onOk() {
        //
        //     }
        // })
    };

    // 取消分配流量
    cancelFlow = () => {
        this.setState({
            flowVisible: false,
            flowSeller: '选择销售'
        })
    };

    //隐藏消息记录
    cancelHistoryNews = () => {
        this.setState({
            historyNewsVisible: false
        })
    };

    // 预览
    showImg = (value) => {
        this.setState({
            previewVisible: true,
            previewImage: value
        })
    };

    // 获取文字列表
    getTextList = () => {
        getMsgTextList(textParams).then(res => {
            console.log(res.data.data, "=========文字列表");
            this.setState({
                textData: res.data.data,
                modalData: res.data.data.records
            });
            if (this.state.changeFirst) {
                this.changeText(this.state.modalData[0], 0);
            }
        })
    };

    // 获取收藏列表
    getCollectTextList = () => {
        getCollectTemplate({
            msgType: 'text',
            params: textParams
        }).then(res => {
            if (res.data.code === 0) {
                let data = res.data.data;
                this.setState({
                    textData: data,
                    modalData: data.records,
                });
            }
            if (this.state.changeFirst) {
                this.changeText(this.state.modalData[0], 0);
            }
        })
    };

    // 改变页码
    onChangeTextPage = (page) => {
        this.setState({
            changeFirst: true
        });
        let _this = this;
        if (this.state.changeModalValue) {
            Modal.confirm({
                title: <p style={{fontSize: '14px', lineHeight: '20px', color: '#999', fontWeight: 400}}>你还有正在编辑的模板，确定要放弃编辑吗？</p>,
                content: null,
                okText: '确定',
                cancelText: '取消',
                iconType: 'exclamation-circle',
                contentType: 'normal',
                onOk() {
                    textParams.current = page;
                    _this.getTextList();
                    _this.setState({
                        changeModalValue: false
                    })
                }
            });
        } else {
            textParams.current = page;
            _this.getTextList();
            _this.setState({
                changeModalValue: false
            })
        }
    };

    // 改变标题样式
    titleStyleChange = (index) => {
        let aTags = document.querySelectorAll('.text-title');
        for (let i = 0; i < aTags.length; i++) {
            if (i === index) {
                aTags[i].classList.add('text-title_active');
            } else {
                aTags[i].classList.remove('text-title_active');
            }
        }
        if (index === 1) {
            textParams.current = 1;
            this.addAndSelf('none');
            this.setState({
                changeFirst: true
            });
            this.getCollectTextList();
        } else {
            textParams.current = 1;
            this.addAndSelf('block');
            this.getTextList();
        }
    };

    // 改变标题样式
    changeTitleStyle = (index) => {
        let _this = this;
        if (this.state.changeModalValue) {
            Modal.confirm({
                title: <p style={{fontSize: '14px', lineHeight: '20px', color: '#999', fontWeight: 400}}>你还有正在编辑的模板，确定要放弃编辑吗？</p>,
                content: null,
                okText: '确定',
                cancelText: '取消',
                iconType: 'exclamation-circle',
                contentType: 'normal',
                onOk() {
                    _this.titleStyleChange(index);
                    _this.setState({
                        changeModalValue: false
                    })
                }
            });
        } else {
            this.titleStyleChange(index);
            this.setState({
                changeModalValue: false
            })
        }
    };

    // 新建模板和自定义模板显示与隐藏
    addAndSelf = (status) => {
        let cancel = document.querySelectorAll('.collect_cancel');
        for (let i = 0; i < cancel.length; i++) {
            cancel[i].style.display = status
        }
    };

    // 新建文字模板重新请求列表
    queryTextList = () => {
        textParams.current = 1;
        this.getTextList();
    };

    // 修改右侧的文本
    changeRightContent = (value, index) => {
        console.log(value, "=========");
        if (value !== undefined) {
            this.setState({
                textTemplateId: value.id ? value.id : null,
                rightValue: index !== -1 ? value.content : '',
                msgDisableBtn: index !== -1 ? false : true
            });
        } else {
            this.setState({
                textTemplateId: null,
                rightValue: '',
                msgDisableBtn: true
            });
        }
        let templates = document.querySelectorAll('.text-content');
        for (let i = 0; i < templates.length; i++) {
            if ((index + 1) === i) {
                templates[i].style.color = '#189ff0'
            } else {
                templates[i].style.color = 'rgba(0, 0, 0, 0.65)'
            }
        }
        firstText = false
    };

    // 选择改变右侧文本框
    changeText = (value, index) => {
        console.log(value, index, "========选择模板改变右侧框");
        let _this = this;
        // let textData = this.state.modalData;
        if (this.state.changeModalValue) {
            Modal.confirm({
                title: <p style={{fontSize: '14px', lineHeight: '20px', color: '#999', fontWeight: 400}}>你还有正在编辑的模板，确定要放弃编辑吗？</p>,
                content: null,
                okText: '确定',
                cancelText: '取消',
                iconType: 'exclamation-circle',
                contentType: 'normal',
                onOk() {
                    _this.changeRightContent(value, index);
                    _this.setState({
                        changeModalValue: false
                    })
                }
            });
        } else {
            this.changeRightContent(value, index);
            _this.setState({
                changeModalValue: false
            })
        }
    };

    // 修改输入框的值
    changeContent = (e) => {
        this.setState({
            rightValue: e.target.value,
            changeModalValue: true,
            msgDisableBtn: e.target.value !== '' ? false : true
        });
        console.log(this.state.rightValue);
    };

    // 表内发送消息
    editMsg = (record) => {
        console.log(record.id, "==========表内发送消息");
        let selectUser = [];
        selectUser.push(record.id);
        firstText = true;
        this.changeText(this.state.modalData[0], 0);
        this.setState({
            msgVisible: true,
            inlineMsg: true,
            cannotSendMsg: 0,
            selectedUser: selectUser
        });
        console.log()
    };

    // 批量发送消息
    handleMsg = () => {
        firstText = true;
        this.changeText(this.state.modalData[0], 0);
        this.setState({
            msgVisible: true,
            inlineMsg: false,
            selectedUser: this.state.selectedRowKeys
        });
        if (this.state.selectedRowKeys.length === 0) {
            // 没有勾选时提示信息
            message.warning('请先选择要发送消息的用户！');
            this.setState({
                msgVisible: false
            });
        } else {

        }
    };

    // 确定发送消息
    sendMessage = () => {
        console.log(this.state.selectedRowKeys);
        let _this = this;
        let sendMsgUsers = this.state.inlineMsg ? 1 : parseInt(_this.state.selectedRowKeys.length) - parseInt(_this.state.cannotSendMsg);
        if (sendMsgUsers === 0) {
            Modal.confirm({
                title: <p
                    style={{fontSize: '14px', lineHeight: '20px', color: '#999', fontWeight: 400}}>消息不允许发送，不会被发送</p>,
                content: null,
                okText: '确定',
                cancelText: '取消',
                iconType: 'exclamation-circle',
                contentType: 'normal'
            })
        } else {
            Modal.confirm({
                title: <p style={{fontSize: '14px', lineHeight: '20px', color: '#999', fontWeight: 400}}>消息将发送给{sendMsgUsers}个用户，发送后不可撤回，确定要发送吗？</p>,
                content: null,
                okText: '确定',
                cancelText: '取消',
                iconType: 'exclamation-circle',
                contentType: 'normal',
                onOk() {
                    _this.setState({
                        sendLoading: true,
                        sendText: '发送中'
                    });
                    let msgParams = null;
                    if (parseInt(_this.state.tabKey) === 0) {
                        console.log(_this.state.textTemplateId, _this.state.rightValue, "========发送文字消息");
                        msgParams = {
                            courseId: parseInt(window.location.pathname.slice(12)),
                            params: {
                                studentIds: _this.state.selectedUser,
                                message:[
                                    {
                                        msgType: "text",
                                        templateId: _this.state.textTemplateId,
                                        content: _this.state.rightValue,
                                        url: null
                                    }
                                ]
                            }
                        }
                    } else {
                        console.log(choosePicId, choosePicMediaId, choosePicUrl, "========发送图片模板");
                        let template = [];
                        for (let i = 0; i < choosePicId.length; i++) {
                            template.push({
                                msgType: 'image',
                                templateId: choosePicId[i],
                                content: choosePicMediaId[i],
                                url: choosePicUrl[i]
                            })
                        }
                        console.log(template);
                        msgParams = {
                            courseId: parseInt(window.location.pathname.slice(12)),
                            params: {
                                studentIds: _this.state.selectedUser,
                                message: template
                            }
                        };
                    }
                    sendMsg(msgParams).then(res => {
                        if (res.data.code === 0) {
                            message.success('发送成功');
                            _this.setState({
                                msgVisible: true,
                                sendLoading: false,
                                sendText: '发送',
                                tabKey: '0',
                                changeModalValue: false
                            });
                            _this.changeTitleStyle(0);
                            _this.clearChoosePic();
                            document.querySelector('.reset-pic').click()
                        } else {
                            message.error(res.data.msg);
                            _this.setState({
                                sendLoading: false,
                                sendText: '发送'
                            })
                        }
                    }).catch(() => {
                        _this.setState({
                            sendLoading: false,
                            sendText: '发送'
                        })
                    })
                },
            });
        }
        // Modal.confirm({
        //     title: <p style={{fontSize: '14px', lineHeight: '20px', color: '#999', fontWeight: 400}}>{5}个学员分配失败了，立即一件筛选分配失败的用户，去重新分配</p>,
        //     content: null,
        //     okText: '一键筛选',
        //     cancelText: '取消',
        //     iconType: 'exclamation-circle',
        //     contentType: 'normal',
        //     onOk() {
        //
        //     }
        // })
    };

    // 清空选择图片
    clearChoosePic = () => {
        let modals = document.querySelectorAll('.modal-pic-font');
        for (let i = 0; i < modals.length; i++) {
            modals[i].style.display = 'none';
        }
        choosePicId = [];
        choosePicMediaId = [];
        choosePicUrl = [];
        this.setState({
            changeModalValue: false
        })
    };

    // 取消发送消息
    cancelMessage = () => {
        let _this = this;
        if (this.state.changeModalValue) {
            Modal.confirm({
                title: <p style={{fontSize: '14px', lineHeight: '20px', color: '#999', fontWeight: 400}}>你还有正在编辑的模板，确定要放弃编辑吗？</p>,
                content: null,
                okText: '确定',
                cancelText: '取消',
                iconType: 'exclamation-circle',
                contentType: 'normal',
                onOk() {
                    _this.setState({
                        msgVisible: false,
                        changeModalValue: false,
                        tabKey: '0'
                    });
                    _this.clearChoosePic()
                }
            });
        } else {
            this.setState({
                msgVisible: false,
                tabKey: '0'
            })
        }
    };

    // 无操作权限提醒
    handleNoDoing = () => {
        message.warning('开发中，敬请期待...');
    };

    // 取消全选
    clearAllData = () => {
        this.setState({
            selectedRowKeys: []
        })
    };

    // 全部选择
    selectAllData = () => {
        chooseAllUser({
            courseId: parseInt(window.location.pathname.slice(12)),
            condition: condition
        }).then(res => {
            console.log(res.data);
            if (res.data.code === 0) {
                this.setState({
                    selectedRowKeys: res.data.data.ids,
                    cannotSendMsg: res.data.data.cannotSendMsg
                })
            } else {
                message.error(res.data.msg)
            }
        });
    };

    // 图片选择隐藏蒙层
    hidePicModal = (value, index) => {
        console.log(value, index);
        let modals = document.querySelectorAll('.modal-pic-font');
        modals[index].style.display = 'none';
        choosePicId.splice(choosePicId.indexOf(value.id), 1);
        choosePicMediaId.splice(choosePicMediaId.indexOf(value.mediaId), 1);
        choosePicUrl.splice(choosePicUrl.indexOf(value.url), 1);
        console.log(choosePicId, choosePicMediaId, choosePicUrl);
        if (choosePicId.length !== 0) {
            this.setState({
                msgDisableBtn: false
            })
        } else {
            this.setState({
                msgDisableBtn: true
            })
        }
    };

    // 图片选择显示蒙层
    showPicModal = (value, index) => {
        console.log(value, index);
        if (choosePicId.length < 5) {
            let modals = document.querySelectorAll('.modal-pic-font');
            modals[index].style.display = 'block';
            choosePicId.push(value.id);
            choosePicMediaId.push(value.mediaId);
            choosePicUrl.push(value.url);
            console.log(choosePicId, choosePicMediaId, choosePicUrl);
            this.setState({
                msgDisableBtn: false,
                changeModalValue: true
            })
        } else {
            message.warning('最多选择5张图片素材哦！')
        }
    };

    //展示历史消息记录
    showHistoricalNews = (id) => {
        console.log(id)
        let data = {
            courseId: parseInt(window.location.pathname.slice(12)),
            id: id
        };
        historyNews(data).then(res => {
            if (res.data.code == 0) {
                this.setState({
                    historyNewsDataMessage:res.data.data.message,
                    historyNewsData: res.data.data,
                    historyNewsVisible: true
                })
            }
        }).catch(err => {

        })
    };

    // 切换模板
    changeModal = (key) => {
        console.log(key, "=======切换模板");
        let _this = this;
        if (this.state.changeModalValue) {
            Modal.confirm({
                title: <p style={{fontSize: '14px', lineHeight: '20px', color: '#999', fontWeight: 400}}>你还有正在编辑的模板，确定要放弃编辑吗？</p>,
                content: null,
                okText: '确定',
                cancelText: '取消',
                iconType: 'exclamation-circle',
                contentType: 'normal',
                onOk() {
                    _this.setState({
                        tabKey: parseInt(key) === 0 ? '0' : '1',
                        changeModalValue: false
                    });
                    if (parseInt(key) === 0) {
                        let modals = document.querySelectorAll('.modal-pic-font');
                        for (let i = 0; i < modals.length; i++) {
                            modals[i].style.display = 'none';
                        }
                        choosePicId = [];
                        choosePicMediaId = [];
                        choosePicUrl = [];
                    } else {
                        // alert(_this.state.changeModalValue + '/' + _this.state.msgDisableBtn);
                        _this.setState({
                            msgDisableBtn: true
                        });
                        firstText = true;
                        // _this.changeText(_this.state.modalData[0], 0);
                    }
                }
            });
        } else {
            // alert(this.state.changeModalValue + '/' + this.state.msgDisableBtn);
            if (parseInt(key) === 0) {
                _this.setState({
                    msgDisableBtn: false
                })
            } else {
                _this.setState({
                    msgDisableBtn: true
                })
            }
            _this.setState({
                tabKey: parseInt(key) === 0 ? '0' : '1',
            });
        }
    };

    render() {
        const {previewImage,dataSource, visible, loading, levelValue, data, signupValue, subscribeValue, sellerValue, selectedRowKeys, flowVisible, inlineFlow, msgVisible, inlineMsg, rightValue, tabKey, modalData, textData, cannotSendMsg, flowSeller, historyNewsVisible, historyNewsData, historyNewsDataMessage, previewVisible, sendLoading, flowLoading} = this.state;
        const { subjects } = this.props;
        const {Option} = Select;
        const historynesTitle = (<div>消息发送记录<p className="historynes-p">（通过本公开课发送记录<span className="historynes-spans">{historyNewsData.portionSize}</span>条，总发送<span className="historynes-spans">{historyNewsData.allSize}</span>条)</p></div>);
        const alertMessage = (
            <p style={{marginBottom: 0}}>
                已选择 <span style={{color: '#1890ff'}}>{selectedRowKeys.length}</span> 项, <span
                style={{color: '#1890ff', cursor: 'pointer'}} onClick={this.clearAllData}>清空</span>
                <span style={{textDecoration: 'underline', marginLeft: '10px', color: '#333', cursor: 'pointer'}}
                      onClick={this.selectAllData}>选择全部数据</span>
            </p>
        );
        return (
            <div className="user" style={{margin: "0 30px"}}>
                <div className='formBody'>
                    <Row gutter={16} className='status'>
                        <Col className="gutter-row label" sm={2} style={{marginTop: '3px'}}>
                            <span>状态：</span>
                        </Col>
                        <Col className="gutter-row" id='status' sm={22} style={{marginBottom: '15px'}}>
                            <Selector name="view" valueOk={this.valueOk} chooseValue={this.chooseValue}
                                      buttonTxt={this.state.timesValue} dataSource={this.state.pv}/>
                            <Select
                                style={{marginRight: '0'}}
                                className={"space"}
                                value={signupValue}
                                onChange={this.handleApply}
                                getPopupContainer={() => document.getElementById('status')}
                            >
                                <Option value="0">报名状态</Option>
                                {
                                    data && data.signupStatus && data.signupStatus.map((value, index) => {
                                        return (<Option key={value.key} value={index + 1}>{value.value}</Option>)
                                    })
                                }
                            </Select>
                            <Selector name="messageCount" valueOk={this.valueOk} chooseValue={this.chooseValue}
                                      buttonTxt={this.state.sendNews} dataSource={this.state.messageCount}/>
                            <Select
                                className={"space"}
                                value={subscribeValue}
                                onChange={this.handleAttention}
                                getPopupContainer={() => document.getElementById('status')}
                            >
                                <Option value="0">关注状态</Option>
                                {
                                    data && data.subscribe && data.subscribe.map((value, index) => {
                                        return (<Option key={value.key} value={index + 1}>{value.value}</Option>)
                                    })
                                }
                            </Select>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className="gutter-row label" sm={2} style={{marginTop: '3px'}}>
                            <span>时长：</span>
                        </Col>
                        <Col className="gutter-row" id='duration' sm={22} style={{marginBottom: '15px'}}>
                            <Selector name="living" valueOk={this.valueOk} chooseValue={this.chooseValue}
                                      buttonTxt={this.state.liveValue} dataSource={this.state.liveDuration}/>
                            <Selector name="replay" valueOk={this.valueOk} chooseValue={this.chooseValue}
                                      buttonTxt={this.state.replayValue} dataSource={this.state.replayDuration}/>
                            <Selector name="watch" valueOk={this.valueOk} chooseValue={this.chooseValue}
                                      buttonTxt={this.state.watchValue} dataSource={this.state.durationCount}/>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className="gutter-row label" sm={2} style={{marginTop: '3px'}}>
                            <span>渠道：</span>
                        </Col>
                        <Col className="gutter-row" id="channelCode" span={22}>
                            <Select
                                style={{marginRight: '0'}}
                                className={"space"}
                                value={sellerValue}
                                onChange={this.handleChooseSeller}
                                getPopupContainer={() => document.getElementById('channelCode')}
                            >
                                <Option value="0">选择销售</Option>
                                {
                                    data && data.sellers && data.sellers.map((value, index) => {
                                        return (
                                            <Option key={value.sellerId} value={index + 1}>{value.sellerName}</Option>)
                                    })
                                }
                            </Select>
                            <Select
                                className={"space"}
                                value={this.state.channelCode}
                                onChange={this.handleChooseChannel}
                                getPopupContainer={() => document.getElementById('channelCode')}
                            >
                                <Option value="0">选择渠道</Option>
                                {
                                    this.state.channels && this.state.channels.map((value, index) => {
                                        return (<Option key={value.channelCode}
                                                        value={index + 1}>{value.channelName}</Option>)
                                    })
                                }
                            </Select>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className="gutter-row label" sm={2} style={{marginTop: '3px'}}>
                            <span>标签：</span>
                        </Col>
                        <Col className="gutter-row" id="channelCode" span={22}>
                            <Select
                                className={"space"}
                                value={levelValue}
                                onChange={this.handleChooseLevel}
                                getPopupContainer={() => document.getElementById('channelCode')}
                            >
                                <Option value="null">用户等级</Option>
                                <Option value="1">1度</Option>
                                <Option value="2">2度</Option>
                                <Option value="3">3度</Option>
                                <Option value="4">3度+</Option>
                            </Select>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className="gutter-row label" sm={2} style={{marginTop: '5px'}}>
                            <span>搜索：</span>
                        </Col>
                        <Col className="gutter-row" sm={8}>
                            <Input placeholder="搜索昵称/备注" id="search" autoComplete="off"/>
                        </Col>
                        <Col className="gutter-row" sm={9}>
                            <Button type="primary" style={{marginRight: '20px'}} onClick={this.searchUser}
                                    disabled={this.state.isSearch}>搜索</Button>
                            <Button type="default" onClick={this.searchReset}
                                    disabled={this.state.isReset}>全部重置</Button>
                        </Col>
                    </Row>
                    <div id="up-or-down" style={{marginTop: '6px', display: 'inline-block'}}>
                        <Button type="default" onClick={this.handleFlow} className={openAuthor('marketing:opencourse:allot', subjects) ? 'flow-btn' : 'flow-btn_disable'} disabled={openAuthor('marketing:opencourse:allot', subjects) ? false : true}>分配流量</Button>
                        <Button type="default" onClick={this.handleMsg}>发送消息</Button>
                        <Button type="default" onClick={this.handleAddMark}>备注</Button>
                    </div>
                    <div style={{marginTop: '5px', display: selectedRowKeys.length > 0 ? 'block' : 'none'}}>
                        <Alert message={alertMessage} type="info" showIcon/>
                    </div>
                    <FormTable
                        dataSource={dataSource}
                        checkChange={this.checkChange}
                        editClick={this.editClick}
                        invalidClick={this.handleNoDoing}
                        loading={loading}
                        changeSore={this.handleChangeSore}
                        selectedKeys={selectedRowKeys}
                        editFlow={this.editFlow}
                        editMsg={this.editMsg}
                        showHistoricalNews={this.showHistoricalNews}
                        subjects={subjects}
                    />
                    <div id="up-or-down">
                        <Button type="default" onClick={this.handleFlow} className={openAuthor('marketing:opencourse:allot', subjects) ? 'flow-btn' : 'flow-btn_disable'} disabled={openAuthor('marketing:opencourse:allot', subjects) ? false : true}>分配流量</Button>
                        <Button type="default" onClick={this.handleMsg}>发送消息</Button>
                        <Button type="default" onClick={this.handleAddMark}>备注</Button>
                    </div>
                    <div style={{overflow: 'hidden'}}>
                        <LocaleProvider locale={zh_CN}>
                            <Pagination
                                showSizeChanger onShowSizeChange={this.handleShowSizeChange}
                                onChange={this.handleChangePage}
                                total={this.state.dataAll.total}
                                showTotal={this.showTotal.bind(this.state.dataAll.total)}
                                current={params.current}
                                pageSize={params.size}
                                defaultPageSize={40}
                            />
                        </LocaleProvider>
                    </div>
                    <CollectionCreateForm
                        onCreate={this.handleReviseNotes}
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
                        visible={flowVisible}
                        title="分配流量"
                        onOk={this.distributeFlow}
                        onCancel={this.cancelFlow}
                        footer={[
                            <Button key="cancel" type="default" onClick={this.cancelFlow}>
                                取消
                            </Button>,
                            <Button key="submit" type="primary" loading={flowLoading} disabled={this.state.disableBtn}
                                    onClick={this.distributeFlow}>
                                {this.state.flowText}
                            </Button>
                        ]}
                    >
                        <div style={{textAlign: 'center'}} id="saleInput">
                            <p style={{
                                textAlign: 'left',
                                display: !inlineFlow ? 'block' : 'none',
                                marginBottom: '-1px',
                                fontSize: '12px'
                            }}>已选择 <span style={{color: '#189ff0'}}>{selectedRowKeys.length}</span> 位用户</p>
                            <span>选择要分配的销售：</span>
                            <Select
                                style={{width: 150, textAlign: 'left'}}
                                placeholder="选择销售"
                                defaultValue="选择销售"
                                value={flowSeller}
                                onChange={this.chooseSellerFlow}
                                getPopupContainer={() => document.getElementById('saleInput')}
                            >
                                {
                                    data && data.sellers && data.sellers.map((value, index) => {
                                        return (
                                            <Option key={value.sellerId} value={value.sellerId}>{value.sellerName}</Option>)
                                    })
                                }
                            </Select>
                        </div>
                    </Modal>
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancelImg}>
                        <img alt="error" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                    <Modal
                        className="historynes-modal"
                        visible={historyNewsVisible}
                        title={historynesTitle}
                        onCancel={this.cancelHistoryNews}
                        footer={null}
                    >
                        <div style={{textAlign: 'center', width: '100%', height: '450px', overflowY: 'scroll'}}
                             className="historynes-box">
                            {
                                historyNewsDataMessage && historyNewsDataMessage.map((value, index) => {
                                    return (
                                        <div className="historynes">
                                            <p className="historynes-title">{value.createBy}通过《{value.courseName}》公开课发送消息：</p>
                                            {
                                                value.msgType == 'text'
                                                &&<p className="historynes-content">{value.content}</p>
                                            }
                                            {
                                                value.msgType == 'image'
                                                &&<img onClick={this.showImg.bind(this,value.url)} src={value.url} />
                                            }
                                            <p className="historynes-timer">{formatDateTime(value.createTime)}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </Modal>
                    <Modal
                        className="send-msg"
                        width={855}
                        height={545}
                        visible={msgVisible}
                        title="发送消息"
                        onOk={this.sendMessage}
                        onCancel={this.cancelMessage}
                        footer={[
                            <Button key="cancel" type="default" onClick={this.cancelMessage}>
                                取消
                            </Button>,
                            <Button key="submit" type="primary" disabled={this.state.msgDisableBtn} loading={sendLoading} onClick={this.sendMessage}>
                                {this.state.sendText}
                            </Button>
                        ]}
                    >
                        <div style={{textAlign: 'center'}}>
                            <p style={{
                                textAlign: 'left',
                                display: !inlineMsg ? 'block' : 'none',
                                margin: '-10px 0 10px 0',
                                fontSize: '12px'
                            }}>
                                已选择<span style={{color: '#189ff0'}}> {selectedRowKeys.length} </span>位用户，
                                其中<span style={{color: '#f40505'}}> {cannotSendMsg} </span>位用户暂不支持发送消息将不会被发送
                            </p>
                            <div style={{border: '1px solid #e8e8e8'}}>
                                <p className="text-click" style={{display: 'none'}}
                                   onClick={this.queryTextList}>文字列表请求</p>
                                <Tabs style={{padding: 0}} onChange={this.changeModal} activeKey={tabKey}>
                                    <TabPane tab="文字" key={0}>
                                        <Text onChangeTextPage={this.onChangeTextPage} dataSource={modalData}
                                              textData={textData} changeText={this.changeText} rightValue={rightValue}
                                              changeContent={this.changeContent}
                                              changeTitleStyle={this.changeTitleStyle} page={textParams.current}/>
                                    </TabPane>
                                    <TabPane tab="图片" key={1}>
                                        <Picture hidePicModal={this.hidePicModal} showPicModal={this.showPicModal}/>
                                    </TabPane>
                                </Tabs>
                                <p className="pic-choose-clear" style={{display: 'none'}}
                                   onClick={this.clearChoosePic}>清空选择图片</p>
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
        )
    }
}
