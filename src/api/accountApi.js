import req from '../utils/request'
import "./api";


// 帐号列表
export const urlAccountList = params => { return req.post(`/account/users`, params); };
// 帐号信息
export const urlAccountInfo = params =>{ return req.get(`/account/user/${params.id}`, params);};
// 新建帐号
export const urlAccountInsert = params =>{ return req.post(`/account/user`, params);};
// 编辑帐号
export const urlAccountEdit = params =>{ return req.put(`/account/user`, params);};
// 帐号启用/禁用
export const urlAccountStatusEdit = params =>{ return req.put(`/account/user/${params.id}/enable`, params);};
// 获取、查询帐户角色
export const urlAccountRole = params => { return req.post(`/account/roles`, params);};
//新建获取、查询分配设备
export const urlAccountSImei = params =>{ return req.get(`/account/user/imei`, params);};
// 编辑获取、查询分配设备
export const urlEditAccountSImei = params =>{ return req.get(`/account/user/imei/${params.id}`, params);};
// 重置密码
export const urlAccountPwd = params => { return req.get(`/account/user/${params.userId}/resetpw`, params); };
// 验证邮箱是否注册
export const urlAccountEmail = params => { return req.get(`/account/user/checkmail/${params.email}`, params); };
