import req from '../utils/request'
import "./api";


// 学科列表
export const urlSubList = params => { return req.post( `/account/subjects`, params); };
//新建学科
export const urlAddSub = params => { return req.post( `/account/subject`,params); };
//校验name是否重复
export const urlVerificationName = params => { return req.get(`/account/subject/checkname/${params.name}`,params); };
//校验code是否重复
export const urlVerificationCode = params => { return req.get(`/account/subject/checkcode/${params.code}`,params); };
//学科详情
export const urlSubDetail = params => { return req.get(`/account/subject/${params.id}`,params); };
//编辑学科
export const urlEditSub = params => { return req.put(`/account/subject`,params); };
//根据学科查询营销号
export const findSellers = params => { return req.post(`/account/sellers`,params); };
