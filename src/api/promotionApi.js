import req from '../utils/request'
import "./api";

// 获取菜单列表
export const getSubjectsSelect = () => { return req.get(`/uaa/users/menu`); };
// 获取分配引擎list
export const getEngineList = () => { return req.get(`/allot/list`); };
// 获取分配引擎详情
export const getEngineDetail = (params) => { return req.get(`/allot/${params}/rule`); };
// 获取推广list
export const getPromotionList = (params) => { return req.post(`/campaign/list`, params); };
// 创建推广
export const createPromotion = (params) => { return req.post(`/campaign/add`, params); };
// 编辑推广
export const editPromotion = (params) => { return req.put(`/campaign/edit`, params); };
// 编辑推广详情
export const campaignEdit = (params) => { return req.get(`/campaign/edit/${params}`); };
// 推广下啦
export const getCampaignAll = (params) => { return req.get(`/campaign/all`); };
// 获取剩余可用余额列表
export const getMountList = (params) => { return req.post(`/campaign/${params.campaignId}/amount`,params.base); };
// 修改剩余可用余额列表
export const setMountList = (params) => { return req.put(`/campaign/${params.campaignId}/amount`,params.surplusAmount); };
// 引擎下啦
export const getAllotDrop = (params) => { return req.get(`/allot/droplist`); };
// 引擎默认
export const getDefaultAllot = (params) => { return req.get(`/allot/campaign/${params}`); };
// 配置分配引擎
export const setAllot = (params) => { return req.post(`/allot/${params.allotId}/campaign/${params.code}`); };
//启用/停用
export const changePromotionStatus = (params) => { return req.put(`/campaign/${params.id}/status/${params.status}`,params); };
//线索确认
export const comfirmClue = (params) => { return req.post(`/account/clue/${params.id}/confirm?wechatId=${params.wechatId}`, params); };
//线索绑定
export const bindingClue = (params) => { return req.get(`/account/clue/binding/${params.id}?wechatId=${params.wechatId}`,params); };
