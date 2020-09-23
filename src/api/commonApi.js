import "./api";
import req from '../utils/request'

// 获取权限列表
export const getAuthorList = () => { return req.get(`/account/comm/permissions`); };
// 获取学科列表
export const getSubjectList = () => { return req.get(`/account/comm/subjects`); };
// 获取销售列表
export const getSellerList = () => { return req.get(`/account/comm/sellers`); };
// 获取角色列表
export const getRoleList = () => { return req.get(`/account/comm/roles`); };
// 获取运营列表
export const getUserList = () => { return req.get(`/qrcode/ad/operation`); };
// 获取设备列表
export const getDeviceList = () => { return req.get(`/account/comm/devices/distinct`); };
// 用户权限
export const getUserAuthorList = () => { return req.get(`/uaa/users/access`); };
//线索状态列表
export const getClueList = () => { return req.get(`/account/comm/clue/status`); };
// 公共课公共号列表
export const getPublicList = () => { return req.get(`/opencourse/apps`); };
// vip课公共号列表
export const getVipPublicList = () => { return req.get(`/vipcourse/apps`); };




//推广名称下拉
export const getCampaignNameList = params => { return req.get(`/campaign/all?search=${params}`); };
//选择平台下拉
export const getPlatformList = () => { return req.get(`/campaign/platform/attribute`); };
//线索确认状态
export const getComfirmStatusList = () => { return req.get(`/account/comm/clue/confirm`); };
