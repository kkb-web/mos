import req from '../utils/request'
import "./api";
import Mock from 'mockjs';

import MyUserList from '../components/userCenter/myUser/mock/myUserList';
import OrderUserList from '../components/userCenter/orderUser/mock/oredrUserList';
import CheckUserName from '../components/userCenter/myUser/mock/checkName';
import MyUserDetail from '../components/userCenter/myUser/mock/myUserDetail'

Mock.mock('/account/trackpool/list', MyUserList);
Mock.mock('/vipcourse/order/center/perform', OrderUserList);
Mock.mock('/account/trackpool/check/param', CheckUserName);
Mock.mock('/account/trackpool', CheckUserName);
Mock.mock('/user/myuser/detail', MyUserDetail);


let _baseUrl = '';

// 获取我的用户列表
export const getMyUserList = params => { return req.post(`/account/trackpool/list`, params); };
// 添加用户获取销售下拉
export const getSaleList = () => { return req.get( `/account/comm/users`); };
// 意向课程下拉
export const getCourses = () => { return req.get( `/vipcourse/client/course/list`); };
// 班次下拉
export const getClasses = params => { return req.get( `/vipcourse/client/${params}/class/list`); };
// 检查用户姓名/昵称/手机号
export const checkUser = params => { return req.post( `/account/trackpool/check/param?${params.id}`, params.params); };
// 添加我的用户
export const addMyUser = params => { return req.post( `/account/trackpool`, params); };
// 获取我的用户信息
export const getMyUserDetail = params => { return req.get( `/account/trackpool/${params}`, params); };
// 编辑我的用户
export const editMyUser = params => { return req.put( `/account/trackpool`, params); };

// 获取成单用户列表
export const getOrderUserList = params => { return req.post(`/vipcourse/order/center/perform`, params); };
// 获取成单用户信息
export const getOrderUserDetail = params => { return req.get( `/account/order/trackpool/${params.id}/${params.outOrderId}`); };
// 编辑成单用户
export const editOrderUser = params => { return req.put( `/account/trackpool`, params); };
// 查询用户订单
export const queryUserOrder = params => { return req.get( `/vipcourse/${params}/order/info`); };
