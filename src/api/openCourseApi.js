import req from '../utils/request'
import "./api";

import Mock from 'mockjs';
import fssionList from '../components/openClass/mock/fssions';
Mock.mock('/opencourse/fssions/list', fssionList);
let _baseUrl = '';


// 公开课列表
export const urlCourseList = params => { return req.post( `/opencourse/list`, params); };
// 学员详情列表
export const urlStudentList = params => { return req.post( `/opencourse/students/${params.id}`, params.data); };
// 学生详情筛选条件下拉
export const urlStuCondition = params => { return req.get(`/opencourse/student/boxs/${params}`, params); };
// 公开课学科列表
export const urlSubjectList = params => { return req.get(`/opencourse/list/subjects`, params); };
// 公开课上架
export const courseEnable = params => { return req.put(`/opencourse/${params}/enable`, params); };
// 公开课下架
export const courseDisable = params => { return req.put(`/opencourse/${params}/disable`, params); };
// 学员备注
export const studentRemark = params => { return req.put(`/opencourse/student/remarks`, params); };

// 获取公开课详情
export const getCourseDetail = params => { return req.get(`/opencourse/${params}`); };
// 获取渠道列表
export const channelList = params => { return req.post(`/opencourse/channels/${params.id}`, params.data); };
// 公开课备注
export const openCourseRemark = params => { return req.put(`/opencourse/remark`, params); };
// 切换直播
export const changeLiveStatus = params => { return req.put(`/opencourse/${params.id}/${params.status}`); };
// 切换禁言
export const changeBannedStatus = params => { return req.put(`/opencourse/${params.id}/${params.status}`); };
// 添加渠道
export const addChannel = params => { return req.post(`/opencourse/channel`, params); };
// 获取海报
export const getPoster = params => { return req.get(`/opencourse/poster?channelCode=${params.channelCode}&courseId=${params.courseId}&username=${params.username}`, {timeout: 100000}); };
// 销售联级下拉
export const sellerList = params => { return req.get(`/opencourse/sellers/${params}`); };
// 新建公开课
export const addOpenCourse = params => { return req.post(`/opencourse/add`, params); };
// 编辑公开课
export const editOpenCourse = params => { return req.put(`/opencourse/edit`, params); };
// 获取用户学科列表
export const getUserSubject = () => { return req.get( `/opencourse/subjects`); };


// S11新增
// 选择全部
export const chooseAllUser = params => { return req.post(`/opencourse/${params.courseId}/message/choose`, params.condition); };
// 消息发送
export const sendMsg = params => { return req.post(`/opencourse/${params.courseId}/message`, params.params); };
// 分配流量
export const distributeFlow = params => { return req.post(`/opencourse/allot/${params.sellerId}`, params.ids); };

//历史发送记录
export const historyNews = params =>{return req.get(`/opencourse/${params.courseId}/message/${params.id}`);};
//获取列表数据列表
export const fssionlList = params => { return req.post(`//opencourse/${params.courseId}/fission`, params.data); };
//修改权重
export const modifyWeights = params => { return req.put( `/opencourse/weight/${params.id}/${params.weight}`,params); };
//删除权重
export const deleteWight = params => { return req.delete( `/opencourse/weight/${params.id}`); };
//权重列表
export const fssionWightList = params => { return req.post(`/opencourse/${params.id}/list`, params); };
//添加分流权重
export const addfssionWight = params => { return req.post(`/opencourse/${params.id}/weight`, params.data); };
