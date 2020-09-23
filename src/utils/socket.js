import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import {notification, Button, Icon, message} from 'antd';
import React from 'react';
import {authHeader, getToken, removeToken} from "./filter";
import history from "../components/common/History";
import {baseUrl} from './filter'

let stompClient = null,
    host = baseUrl() + "/websocket";

const key = `open${Date.now()}`;
const icon = (<Icon type="exclamation-circle" style={{ color: '#108ee9' }} />);
//点击"X"号关闭
const closeFn = () => {
    closenote();
};
export const closenote = () =>{
    notification.close(key);
    history.push('/login');
};
//点击"知道了"
const userKnow = () =>{
    closenote();
    // let xhr = new XMLHttpRequest();
    // xhr.open("delete", baseUrl() + '/uaa/oauth/token?access_token=' + getToken("access_token"), true);
    // // 添加http头，发送信息至服务器时内容编码类型
    // xhr.setRequestHeader("Authorization",authHeader().Authorization);
    // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // xhr.onreadystatechange = function() {
    //     if (xhr.readyState === 4) {
    //         if (xhr.status === 200 || xhr.status === 304) {
    //             removeToken("access_token");
    //             removeToken('username');
    //             history.push('/login');
    //             //断开socket链接
    //             disconnect();
    //         }else{
    //             message.error('退出失败！')
    //         }
    //     }
    // };
    // xhr.send();
};

const btn = (
    <Button type="primary" size="small" onClick={userKnow}>
        知道了
    </Button>
);

export const connect = (name) => {
    let headers = {key: name, business: 'CONSOLE'},
        socket = new SockJS(host);
    stompClient = Stomp.over(socket);
    stompClient.connect( headers, function() {
         stompClient.subscribe('/kkb/queue/CONSOLE', function (response) {
             if (typeof(response.body) === 'string') {
                 response.body = JSON.parse(response.body);
             }
             if (response.body.code === 2) {
                 notification.open({
                     message: '您的帐号信息发生了变化，确认后重新登录',
                     description: '如有疑问，可联系系统管理员。',
                     duration: null,
                     btn,
                     key,
                     icon,
                     onClose: closeFn,
                 });
                 removeToken("access_token");
                 removeToken('username');
             }
        });
    });
};

export const disconnect = () =>{
    if (stompClient != null) {
        stompClient.disconnect();
        stompClient = null;
    }
    console.log("Disconnected");
};





