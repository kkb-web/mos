import req from '../utils/request'
import "./api";
import Mock from 'mockjs';

import RefundList from '../components/finance/refund/mock/refundList';
import ReceivablesData from '../components/finance/receivables/mock/receivablesData';
import confirmBill from '../components/finance/receivables/mock/confirmBill';
import BillList from '../components/finance/invoice/mock/InvoiceData';
import BillTypeSelect from '../components/finance/invoice/mock/billtypeData';
import OrderNumberSelect from '../components/finance/invoice/mock/ordernumData';
import OrderDetails from '../components/finance/invoice/mock/orderDetails';

let _baseUrl = '192.168.87.199:9090';
Mock.mock('/finance/refund/list', RefundList);
Mock.mock('/finance/receivables/list', ReceivablesData);
Mock.mock('/finance/receivables/confirmbill', confirmBill);
Mock.mock('/finance/invoice/list', BillList);
Mock.mock('/finance/billtype/select', BillTypeSelect);
Mock.mock('/finance/ordernum/select', OrderNumberSelect);
Mock.mock('/finance/order/details', OrderDetails);

//线上
// 获取退款列表
export const getRefundList = params => { return req.post(`/finance/reconciliation/refund/list`, params); };
// 确认退款
export const refundOk = params => { return req.put(`/finance/reconciliation/refund/${params}`, params); };
//发票管理列表
export const getBillList = params => { return req.post(`/finance/invoice/list`, params); };
//新增发票
// export const AddBill = params => { return req.post(`/finance/invoice/list`, params); };
//收款管理列表
export const getReceivableList = params => { return req.post(`/finance/reconciliation/pay/list`, params); };
// 确认账单
export const confirmBills = params => { return req.put(`/finance/reconciliation/pay/${params}`, params); };
// 已付金额表上面的信息
export const getReceivableDetail = params => { return req.get(`/finance/reconciliation/pay/price/${params}`); };
// 批量确认收款
export const batchCollect = params => { return req.put(`/finance/reconciliation/pay/batch`, params); };
// 确认收款总额
export const batchMoney = params => { return req.post(`/finance/reconciliation/sum`, params); };


//mock
// 获取收款管理列表
// export const ReceivablesList = params => { return req.post(_baseUrl + `/finance/receivables/list`, params); };
// 确认账单
// export const confirmBills = params => { return req.get(_baseUrl + `/finance/receivables/confirmbill`, params); };
//发票管理列表
// export const getBillList = params => { return req.post(_baseUrl + `/finance/invoice/list`, params); };
//发票类型下拉
export const getBillTypeSelect = params => { return req.get(_baseUrl + `/finance/billtype/select`, params); };
//订单编号下拉
export const getOrderNumberSelect = params => { return req.get(`/finance/order/infos`, params); };
// 新增发票
export const addBill = params => { return req.post(`/finance/invoice`, params); };
//订单编号请求数据
export const getOrderDetail = params => { return req.get(`/finance/order/${params}`, params); };
