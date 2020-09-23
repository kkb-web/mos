import req from '../utils/request'
import "./api";

// 个人中心基本信息
export const urlUserInfo = params => { return req.get(`/account/info`, params); };
// 营销号列表
export const urlSellerList = params => { return req.post( `/account/mysellers`, params); };
// 修改密码提交新密码
export const urlPassword = params => {return req.put(`/account/passwd`, params); };
// 修改密码验证原密码
export const urlCheckPassword = params => {return req.post(`/account/checkpw`, params); };
// 好友数量列表
export const urlFriendsList = params => {return req.post(`/account/sellers/friends`, params); };
// 修改好友数量
export const urlFriends = params => {return req.post(`/account/seller/friend/${params.sellerId}`, params); };
