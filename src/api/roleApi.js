import req from '../utils/request'
import "./api";


// 获取权限列表
export const getAuthorList = () => { return req.get(`/account/comm/permissions`); };
// 获取学科列表
export const getSubjectList = () => { return req.get(`/account/comm/subjects`); };
// 添加角色
export const addRole = params => { return req.post(`/account/role`, params); };
// 验证角色名
export const checkRole = params => { return req.get(`/account/role/checkname/${params}`, params); };
// 查询角色
export const queryRole = params => { return req.get(`/account/role/${params}`, params); };
// 编辑角色
export const editRole = params => { return req.put(`/account/role`, params); };
// 获取角色列表
export const getRoleList = params => { return req.post(`/account/roles`, params); };
