import "./api";
import req from '../utils/request'

//设备列表
export const urlDeviceList = params =>{ return req.post(`/account/devices`, params);};
//下拉框列表
export const urSellersList = params =>{ return req.get(`/account/comm/users`, params);};
//添加设备
export const urlAddDevice = params =>{ return req.post(`/account/device`, params);};
//学科列表
export const urlSubjectList = params =>{ return req.get(`/account/comm/subjects`, params);};
//编辑设备
export const setformdata = params =>{ return req.get(`/account/device/${params.deviceId}`, params);};
//营销号数据
export const setformdataMarket = params =>{ return req.get(`/account/devices/${params.deviceId}`, params);};
//编辑设备
export const urleditDevice = params =>{ return req.put(`/account/device`, params);};
//删除营销号
export const deletMarket = params =>{ return req.post(`/account/sellers/device/${params.deviceId}`, params.sellerIds);};
//验证微信编号
export const urlCheckWechat = params =>{ return req.get(`/account/seller/${params.subjectId}/${params.number}/`, params);};
