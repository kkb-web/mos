import req from '../utils/request'
import "./api";
import Mock from 'mockjs';


import getRefundRecordData from '../components/orderCenter/mock/orderListData';
import AddorderCoursePrice from '../components/orderCenter/mock/addOrderCourseData';
import AlreacdPay from '../components/orderCenter/mock/alreadyPayData';
import MoneyBackDetail from '../components/orderCenter/mock/moneyBackDetail';
import BillState from '../components/orderCenter/mock/billStateData';




Mock.mock('/order/ordercenter/list', getRefundRecordData);
Mock.mock('/order/ordercenter/addorderprice', AddorderCoursePrice);

Mock.mock('/order/ordercenter/alreacdpay', AlreacdPay);
Mock.mock('/order/ordercenter/moneybackdetail', MoneyBackDetail);
Mock.mock('/order/ordercenter/billstate', BillState);

//线上
export const getOrderList = params => { return req.post(`/vipcourse/order/center`, params); };
//获取退款记录
export const getRefundList = params => { return req.post(`/vipcourse/order/center/refund`, params); };
//获取报名表
export const getSignUpTab = params => { return req.get(`/vipcourse/order/${params}/exam`); };
//退款详情
export const getMoneyBackDetailTab = params => { return req.post(`/finance/reconciliation/refund/list`, params); };
//添加线下订单
export const AddOfflineOrder = params => { return req.post(`/vipcourse/order/center/offline`, params); };
//添加线下订单上课学员
export const getTrackNameSelect = params => { return req.get(`/account/trackpool`); };
//获取创建线下订单课程下拉
export const getCourseSelect = params => { return req.get(`/vipcourse/course/class/dropdown`); };
//获取班次信息
export const getderCoursePrice = params => { return req.post(`/order/ordercenter/addorderprice`, params); };
// 获取班次信息2
export const getClass = params => { return req.get(`/vipcourse/common/class?courseId=${params}`); };
//新增回款详细信息
export const geAddCanbackDetail = params => { return req.get(`/vipcourse/order/pay/${params}`); };
//新增回款提交
export const AddCanbacksubmit = params => { return req.post(`/finance/reconciliation/pay`, params); };
//申请退款表单提交
export const refundSubmit = params => { return req.post(`/finance/reconciliation/refund`, params); };
//发票状态table
export const getBillStetsForm = params => { return req.post(`/finance/invoice/list`, params); };
//获取报名表
export const getPreSignUpTab = params => { return req.get(`/vipcourse/order/${params}/vipExam`); };



//mock数据
let _baseUrl = '';
export const getRefundRecordList = params => { return req.post(_baseUrl  + `/order/ordercenter/list`, params); };
// export const getderCoursePrice = params => { return req.post(_baseUrl  + `/order/ordercenter/addorderprice`, params); };
export const getAlreacdPayTab = params => { return req.post(_baseUrl  + `/order/ordercenter/alreacdpay`, params); };
// export const getMoneyBackDetailTab = params => { return req.post(_baseUrl  + `/order/ordercenter/moneybackdetail`, params); };
export const getBillStateTab = params => { return req.post(_baseUrl  + `/order/ordercenter/billstate`, params); };

// 获取移动端的订单列表
export const getOrderMobile = params => {return req.post(`/vipcourse/order/center`, params);};
// 移动端获取海报
export const getPosterMobile = params => {return req.get(`/vipcourse/order/${params}/exam`);};
