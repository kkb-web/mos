import {Component} from "react";
import {Button, message, Spin, Icon} from "antd";
import React from "react";
import {Link} from "react-router-dom";
import * as dd from 'dingtalk-jsapi';
import qs from 'qs';
import {
    noSubjectAuthor,
    setTitle,
    authHeader,
    setToken,
    baseUrl,
    IsPC,
    getToken,
    renderOrderState,
    renderOrderStateColor,
    ddCompanyId
} from "../../utils/filter";
import './Index.less';
import {getOrderMobile} from "../../api/orderCenterApi";
import {urlUserInfo} from "../../api/userApi";
import {getMenuList} from "../../api/menuApi";
import {getUserAuthorList} from "../../api/commonApi";

let getScrollTop  = () => {
    let scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
    if(document.body){
        bodyScrollTop = document.body.scrollTop;
    }
    if(document.documentElement){
        documentScrollTop = document.documentElement.scrollTop;
    }
    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
    return scrollTop;
};
let getScrollHeight = () => {
    let scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
    if(document.body){
        bodyScrollHeight = document.body.scrollHeight;
    }
    if(document.documentElement){
        documentScrollHeight = document.documentElement.scrollHeight;
    }
    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
    return scrollHeight;
};
let getWindowHeight = ()  => {
    let windowHeight = 0;
    if(document.compatMode === "CSS1Compat"){
        windowHeight = document.documentElement.clientHeight;
    }else{
        windowHeight = document.body.clientHeight;
    }
    return windowHeight;
};

let params = {
    size: 10,
    current: 1,
    descs: ['createTime'],
    condition: {}
};

export default class Index extends Component{
    constructor(props) {
        super(props);
        this.state = {
            orderList: [],
            bottomLoading: true,
            loading: true,
            dataAll: {},
            orderStatusList: [
                {key: 0, value: '待处理'},
                {key: 1, value: '处理中'},
                {key: 2, value: '已完成'},
                {key: 3, value: '已超时'},
                {key: 4, value: '已退款'},
                {key: 5, value: '部分退款'},
                {key: 6, value: '已取消'}
            ],
            code: ''     //钉钉免登授权码
        };
    }

    // 获取订单列表
    getOrderList = () => {
        if(parseInt(window.location.href.slice(window.location.href.indexOf('outOrderId=') + 11))){
          params.condition.search = window.location.href.slice(window.location.href.indexOf('outOrderId=') + 11);
        }
        getOrderMobile(params).then(res => {
            if (res.data.code === 0) {
                this.setState({
                    orderList: res.data.data.records,
                    dataAll: res.data.data,
                    loading: false,
                    bottomLoading:false
                });
            }
        })
    };

    // 获取CRM用户信息
    getCrmUserInfo = () => {
        urlUserInfo().then(res => {
            if (res.data.code === 0) {
                setToken('isSale',res.data.data.isSale);
                setToken('realname',res.data.data.realname);
                setToken('mobile',res.data.data.mobile);
            } else {
                message.error('用户信息：' + res.data.msg);
            }
        })
    };

    // 改变标题样式
    changeTitle = (index) => {
        let normalLis = document.querySelectorAll('.order_normal_ul li');
        let lis = document.querySelectorAll('.order_top_ul li');
        for (let i = 0; i < lis.length; i++) {
            if (index === i) {
                lis[i].classList.add('order_top_li_active');
                normalLis[i].classList.add('order_normal_li_active');
            } else {
                lis[i].classList.remove('order_top_li_active');
                normalLis[i].classList.remove('order_normal_li_active');
            }
        }
    };

    componentDidMount() {
        params = {
            size: 10,
            current: 1,
            descs: ['createTime'],
            condition: {}
        };
        if (!getToken('access_token')) {
            this.getUserInfo();
        } else {
            this.getCrmUserInfo();
            this.getUserAuthor();
        }
        setTitle('');
        let _this = this;
        window.onscroll = () => {
            // console.log(getScrollTop(), "======top");
            if(getScrollTop() + getWindowHeight() === getScrollHeight()){
                // alert("已经到最底部了！!");
                if (params.size < _this.state.dataAll.total){
                    params.size += 10;
                    _this.getOrderList();
                    _this.setState({
                        bottomLoading: true
                    })
                } else {
                    _this.setState({
                        bottomLoading: false
                    })
                }
            }
            if (getScrollTop() > 130) {
                document.querySelector('.order_nav_top_dd').style.display = 'block';
            } else {
                document.querySelector('.order_nav_top_dd').style.display = 'none';
            }
        };
        var phoneWidth = parseInt(window.screen.width);
        var phoneScale = phoneWidth / 370;
        var ua = navigator.userAgent;
        if (/Android (\d+\.\d+)/.test(ua)) {
            var version = parseFloat(RegExp.$1);
            if (version > 2.3) {
                document.write('<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale = ' + phoneScale + ', maximum-scale = ' + phoneScale + ', target-densitydpi=device-dpi">');
            } else {

                document.write('<meta name="viewport" content="width=device-width, target-densitydpi=device-dpi">');
            }
        } else {
            document.write('<meta name="viewport" content="width=device-width, user-scalable=no, target-densitydpi=device-dpi">');
        }
    }
    addMeta = ()=> {
        let meta = document.createElement('meta');
        meta.httpEquiv = 'Pragma';
        meta.content='no-cache';
        document.getElementsByTagName('head')[0].appendChild(meta);
    };

    // 获取用户权限
    getUserAuthor = () => {
        getUserAuthorList().then(res => {
            // alert('权限列表'+ JSON.stringify(res));
            if (res.data.code === 0) {
                setToken('userAuthorList', JSON.stringify(res.data.data));
                this.getOrderList();
                console.log(res.data.data, "======用户权限")
            } else {
                message.error('权限列表：' + res.data.msg)
            }
        })
    };

    // 获取进入钉钉的用户信息
    getUserInfo=()=>{
        let that = this;
        dd.ready(function() {
            dd.runtime.permission.requestAuthCode({
                corpId: ddCompanyId(), // 企业id
                onSuccess: function (info) {
                    that.setState({
                        code: info.code   // 通过该免登授权码可以获取用户身份
                    });
                    console.log(info, "这是dd的应用");
                    // alert(JSON.stringify(info) + '/' + info.code);
                    that.DingTalkLogin(info.code);
                },
            });
        });
    };

    // 钉钉端登录
    DingTalkLogin = (code)=>{
        let _this = this;
        let data = qs.stringify({
                code: code,
                grant_type: 'dingtalk'
            }),
            xhr = new XMLHttpRequest();

        //发送登录请求
        xhr.open("POST", baseUrl() + '/uaa/oauth/token', true);
        // 添加http头，发送信息至服务器时内容编码类型
        xhr.setRequestHeader("Authorization", authHeader().Authorization);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                // alert(xhr.status);
                if (xhr.status === 200 || xhr.status === 304) {
                    let res = JSON.parse(xhr.responseText);
                    // alert(JSON.stringify(res) + '/' + xhr.responseText + '/' + res.access_token);
                    setToken('access_token', res.access_token);
                    setToken('refresh_token', res.refresh_token);
                    _this.getCrmUserInfo();
                    _this.getUserAuthor();
                } else if (xhr.status === 400) {
                    let err = JSON.parse(xhr.responseText);
                    console.log(err.error_description);
                    message.error(err.error_description); //失败信息
                } else if (xhr.status === 401) {
                    _this.props.history.push({pathname: '/author/none'})
                } else if (xhr.status === 500 || xhr.status === 502 || xhr.status === 503) {
                    message.error('500服务端错误，请稍后重试!'); //失败信息
                }
            }
        };
        xhr.send(data);
    };

    // 改变订单状态
    changeOrderStatus = (value, index) => {
        params.current = 1;
        params.size = 10;
        params.condition.orderStatus = value;
        this.getOrderList();
        this.changeTitle(index);
    };

    // 获取报名表
    pushApply = (id) => {
        this.props.history.push({
            pathname: '/order/add/apply',
            id: id
        })
    };

    render () {
        let {orderList, loading, bottomLoading, orderStatusList} = this.state;
        let timestamps = (new Date()).getTime();
        let hash = Math.floor(timestamps/1000);
        return(
            loading ?
                <Spin style={{width: '100%', margin: '200px auto'}} size="large"/> :
                <div style={{width: '100%', position: 'absolute', top: 0, bottom: 0, background: '#EEF7F8'}}>
                    <div className="order_header_dd">
                        <div style={{textAlign: 'right'}}>
                            <Link to={'/user/add'} style={{
                                marginRight: '10px',
                                display: noSubjectAuthor('marketing:usercenter:myuser') ? 'inline-block' : 'none'
                            }}>
                                <p style={{
                                    display: 'inline-block',
                                    width: '100px',
                                    height: '30px',
                                    lineHeight: '30px',
                                    textAlign: 'center',
                                    color: '#fff',
                                    fontSize: '14px',
                                    borderRadius: '20px',
                                    background: '#232323',
                                    fontWeight: 500
                                }}>添加用户</p>
                            </Link>
                            <Link to={`/order/add?hash=${hash}`} style={{
                                marginRight: '20px',
                                display: noSubjectAuthor('marketing:ordercenter:list') ? 'inline-block' : 'none'
                            }}>
                                <p style={{
                                    display: 'inline-block',
                                    width: '100px',
                                    height: '30px',
                                    lineHeight: '30px',
                                    textAlign: 'center',
                                    color: '#00AFF2',
                                    fontSize: '14px',
                                    borderRadius: '20px',
                                    background: '#fff',
                                    fontWeight: 500
                                }}>创建订单</p>
                            </Link>
                        </div>
                        <div style={{
                            textAlign: 'left',
                            padding: '10px 14px',
                            marginTop: '10px',
                            fontWeight: 600,
                            fontSize: '21px',
                            color: '#fff'
                        }}>
                            订单列表
                        </div>
                        <div className="order_nav_dd">
                            <ul className="order_normal_ul">
                                <li className="order_normal_li order_normal_li_active" onClick={this.changeOrderStatus.bind(this, null, 0)}>全部</li>
                                {orderStatusList && orderStatusList.map((value, index) =>
                                    <li className="order_normal_li" key={index} onClick={this.changeOrderStatus.bind(this, value.key, index + 1)}>{value.value}</li>
                                )}
                            </ul>
                        </div>
                        <div className="order_nav_top_dd">
                            <ul className="order_top_ul">
                                <li className="order_top_li order_top_li_active" onClick={this.changeOrderStatus.bind(this, null, 0)}>全部</li>
                                {orderStatusList && orderStatusList.map((value, index) =>
                                    <li className="order_top_li" key={index} onClick={this.changeOrderStatus.bind(this, value.key, index + 1)}>{value.value}</li>
                                )}
                            </ul>
                        </div>
                    </div>
                    <div className="order_bottom_dd">
                        {orderList.length > 0 ?
                            <div id="order-items_content">
                                {orderList && orderList.map((value, index) =>
                                    <div className="order-items_mobile" key={index}>
                                        <div className="order-item-header">
                                            <p className="order-no_mobile">
                                                <span className="order-title_mobile">订单编号：</span>
                                                <span className="order-content_mobile">{value.outOrderId}</span>
                                            </p>
                                            <p className="order-type_mobile">
                                                <span className="order-title_mobile">类型：</span>
                                                <span
                                                    className="order-content_mobile">{value.type === 0 ? '线上订单' : '后台订单'}</span>
                                            </p>
                                        </div>
                                        <p className="order-item_mobile">
                                            <span className="order-title_mobile"><img src="https://img.kaikeba.com/order_icon_1_dd.png" alt=""/>课程：</span>
                                            <span className="order-content_mobile">{value.courseName}</span>
                                        </p>
                                        <p className="order-item_mobile">
                                            <span className="order-title_mobile"><img src="https://img.kaikeba.com/order_icon_2_dd.png" alt=""/>班次：</span>
                                            <span className="order-content_mobile">{value.className}</span>
                                        </p>
                                        <p className="order-item_mobile">
                                            <span className="order-title_mobile"><img src="https://img.kaikeba.com/order_icon_3_dd.png" alt=""/>学员：</span>
                                            <span className="order-content_mobile">{value.trackName}</span>
                                        </p>
                                        <p className="order-item_mobile">
                                            <span className="order-title_mobile"><img src="https://img.kaikeba.com/order_icon_4_dd.png" alt=""/>金额：</span>
                                            <span className="order-content_mobile">{value.amount}</span>
                                        </p>
                                        <div className="order-item-bottom">
                                            <p className="order-status_mobile"
                                               style={{color: renderOrderStateColor(value.orderStatus)}}>
                                                {renderOrderState(value.orderStatus)}
                                            </p>
                                            {
                                                value.entryBlank !== 1 ?
                                                    <p className="order-apply_mobile" onClick={this.pushApply.bind(this, value.id)}>获取报名表</p> :
                                                    <p className="order-apply-already_mobile">已填表</p>
                                            }
                                        </div>
                                    </div>
                                )}
                                {bottomLoading ? <div style={{margin: '5px auto', textAlign: 'center', width: '100%'}}><Icon
                                    type="loading"/></div> : null}
                            </div> :
                            <div style={{textAlign: 'center'}}>
                                <img style={{width: '50%', marginTop: '80px', maxWidth: '240px'}}
                                     src="https://img.kaikeba.com/order_no_icon.png" alt=""/>
                                <p style={{color: 'rgb(191, 190, 190)'}}>暂无订单数据</p>
                            </div>
                        }
                    </div>
                </div>
        )
    }
}
