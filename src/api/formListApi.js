import req from '../utils/request'

// 新建表单
export const addForm = params => req.post(`/form/addForm`, params);
// 查询表单
export const getForm = params => req.post(`/form/getForm`,params)
// getFormList
export const getFormList = params => req.post(`/form/getFormList`,params)
