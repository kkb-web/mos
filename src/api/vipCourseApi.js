import req from '../utils/request'
import "./api";
import Mock from 'mockjs';
import classList from '../components/vipClass/classList/mock/classList';
import courseList from '../components/vipClass/mock/courseList';
import channelList from '../components/vipClass/mock/channelList';
import classes from '../components/vipClass/mock/classList';
import saleList from '../components/vipClass/mock/saleList';
import vipClassList from '../components/vipClass/vipManage/class/mock/class';
import oldCourse from '../components/vipClass/vipManage/class/mock/oldCourse';
import addClass from '../components/vipClass/vipManage/class/mock/addClass';
import vipCourseDetail from '../components/vipClass/vipManage/mock/vipCourseDetail';
import vipClassDetail from '../components/vipClass/vipManage/class/mock/classDetail';
import sellerList from '../components/vipClass/vipManage/sale/mock/sellerList';
import vipUserList from '../components/vipClass/vipManage/sale/mock/vipUserList';
import editClassList from '../components/vipClass/vipManage/sale/mock/editClassList';
import saleChart from '../components/vipClass/vipManage/sale/mock/chartData';
import vipcoursechartData from '../components/vipClass/vipManage/channel/mock/channelChartData'

//--zljiang
import vipcourselist from '../components/vipClass/vipManage/mock/vipcourselist';
import classingDetail from '../components/vipClass/vipManage/mock/classingDetail'
import createchannel from '../components/vipClass/vipManage/mock/createChannel'
import channelStatus from '../components/vipClass/vipManage/mock/channelStatus'
import vipchannelList from '../components/vipClass/vipManage/channel/mock/vipchannelList'
import vipHistoryPrice from '../components/vipClass/vipManage/channel/mock/historyprice'
import channelChartTreeData from '../components/vipClass/vipManage/channel/mock/channelChartTreeData'


Mock.mock('/classList', classList);
Mock.mock('/vipcourse/common/channel', channelList);
Mock.mock('/vipcourse/common/class', classes);
Mock.mock('/vipcourse/common/seller', saleList);
Mock.mock('/vipcourse/common/course', courseList);
Mock.mock('/vipcourse/class/list', vipClassList);
Mock.mock('/vipcourse/old/course', oldCourse);
Mock.mock('/vipcourse/class', addClass);
Mock.mock('/vipcourse/course/aaaa', vipCourseDetail);
Mock.mock('/vipcourse/class/188', vipClassDetail);
Mock.mock('/vipcourse/seller', sellerList);
Mock.mock('/vipcourse/seller/user', vipUserList);
Mock.mock('/vipcourse/seller/class', editClassList);
Mock.mock('/vipcourse/seller/remark', editClassList);
Mock.mock('/vipcourse/seller/friend', editClassList);
Mock.mock('/vipcourse/seller/chart', saleChart);

//--zljiang
Mock.mock('/vipcourse/course/list', vipcourselist);
Mock.mock('/vipcourse/channel/class', classingDetail);
Mock.mock('/vipcourse/channel', createchannel);
Mock.mock('/vipcourse/channel/status', channelStatus);
Mock.mock('/vipcourse/channel/list', vipchannelList);
Mock.mock('/vipcourse/channel/price', vipHistoryPrice);
Mock.mock('/vipcourse/channel/seller', channelChartTreeData);
Mock.mock('/vipcourse/channel/sales/chart', vipcoursechartData);


let _baseUrl = '';

// 通用下拉
// 渠道下拉
export const getChannels = params => { return req.get( `/vipcourse/seller/channel?courseId=` + params); }; // `/vipcourse/common/channel?courseId=` + params
// 班次下拉
export const getClasses = params => { return req.get( `/vipcourse/common/class?courseId=` + params); }; // `/vipcourse/common/class?courseId=` + params
// 销售下拉
export const getSellers = params => { return req.get( `/vipcourse/${params}/sales`); }; // `/vipcourse/common/seller?courseId=` + params
// 销售下拉渠道
export const getSellersChannel = (params) => { return req.get( `/vipcourse/${params.courseId}/sales/channel`,params); }; // `/vipcourse/common/seller?courseId=` + params
// 课程下拉
export const getCourses = () => { return req.get( `/vipcourse/common/course`); };
// 班次列表
export const getClassList = params => { return req.post( `/vipcourse/classes`, params); };

// vip课下班次情况
// vip课下的班次列表
export const getVipClass = params => { return req.post( `/vipcourse/${params.condition.courseId}/class/list`, params); };
// 老课程下拉
export const getOldCourses = () => { return req.get( `/vipcourse/course/old`); };
// 新课程下拉
export const getNewCourses = () => { return req.get( `/vipcourse/course/new`); };
// 招生班级查询
export const enrollment = params => { return req.get( `/vipcourse/class/admission?courseId=${params}`); };
// 获取vip课程详情（class）
export const getVipCourseDetail = params => { return req.get( `/vipcourse/course/${params.courseId}`,params); };
// 获取vip课程详情（header ）
export const getVipDetail = params => { return req.get( `/vipcourse/${params.courseId}`,params); };
// 验证班次名称
export const checkClassName = params => { return req.get( `/vipcourse/class/verifyname?${params}`); };
// 新建班次
export const addVipClass = params => { return req.post( `/vipcourse/class`, params); };
// 获取班次详情
export const getClassDetail = params => { return req.get( `/vipcourse/class/${params.classId}`); };// /vipcourse/class?courseId=${params.courseId}&classId=${params.classId}
// 编辑班次
export const editVipClass = params => { return req.put( `/vipcourse/class`, params); };
// 销售排名列表
export const getSellerList = params => { return req.post( `/vipcourse/seller`, params); };
// 获取vip用户列表
export const getVipUserList = params => { return req.post( `/vipcourse/seller/user`, params); };
// 获取修改班次列表
export const getEditClassList = params => { return req.get( `/vipcourse/seller/class?orderId=${params.orderId}`); };// /vipcourse/seller/class?courseId=${params.courseId}&userId=${params.userId}
// 修改班次
export const reviseClass = params => { return req.put( `/vipcourse/seller/class?orderId=${params.orderId}&classId=${params.classId}`); };
// 添加备注
export const addRemark = params => { return req.put( `/vipcourse/seller/remark?orderId=${params.orderId}&remark=${params.remark}`); };
// 添加好友时间
export const addFriendTime = params => { return req.put( `/vipcourse/seller/friend?orderId=${params.orderId}&friendTime=${params.friendTime}`); };
// 销售图表
export const getSaleChart = params => { return req.post( `/vipcourse/seller/chart`, params); };// /vipcourse/seller?courseId=${params.courseId}&sellerId=${params.sellerId}&startTime=${params.startTime}&endTime=${params.endTime}
//vip学科下啦
export const getVipSubjectList = () => { return req.get( `/account/comm/subjects`); };
//vip课程列表--zljaing
export const getVipCourseList = params => { return req.post( `/vipcourse/course/list`, params); };
//获取vip详情（编辑 ）
export const getVipDetailEdit = params => { return req.get( `/vipcourse/course/${params.courseId}`, params); };
//vip详情提交（编辑 ）
export const editVipCourse = params => { return req.put( `/vipcourse/course`, params); };
//创建vip课程
export const createVipCourse = params => { return req.post( `/vipcourse/course`, params); };
//详情修改备注
export const editVipDetailRemark = params => { return req.put( `/vipcourse/course/${params.courseId}/remark?code=${params.code}&remark=${params.remark}`, params); };

/**
 * 渠道
 */
//创建渠道
export const createChannel = params => { return req.post( `/vipcourse/channel`, params); };
//历史价格及报名数列表
export const getPriceAndSignUpNum = params => { return req.post( `/vipcourse/channel/price`, params); };
//查询招生中班级详情
export const getClassingDetail = params => { return req.get( `/vipcourse/channel/class?courseId=${params.courseId}&appId=${params.appId}`, params); };
//查询推广链接按钮状态
export const getChannelStatus = params => { return req.get( `/vipcourse/channel/status?courseId=${params.courseId}`, params); };
//查询销售及其所有的渠道
export const getSellerAndChannels = params => { return req.get( `/vipcourse/channel/seller?courseId=${params.courseId}`, params); };
//渠道列表
export const getChannelList = params => { return req.post( `/vipcourse/channel/list`, params); };
//渠道销量图表
export const getChannelChart = params => { return req.post(`/vipcourse/channel/sales/chart`, params); };
//验证vip课程名称是否重复
export const checkVipcourseName = params => { return req.get( `/vipcourse/course/verifyname?${params}`); };
// 查询销售二维码
export const checkSellerqrCodes = params => { return req.post(`/vipcourse/seller-qrcodes`,params) };
// 删除销售二维码
export const removeSellerqrCodes = params => { return req.dele(`/vipcourse/seller-qrcode/${params.id}`) };
// 修改二维码权重
export const editSellerqrCodesWeight = (id,params) => { return req.formPut(`/vipcourse/seller-qrcode/${id}/weight`, params,{headers: {"Content-Type": 'application/x-www-form-urlencoded'}})};
// 添加销售二维码
export const addSellerqrCodes = params => { return req.post(`/vipcourse/seller-qrcode/batch`,params) };
// 修改二维码配置
export const editSellerqrCodesSetting = (id,params) => { return req.formPut(`/vipcourse/seller-qrcode/${id}`,params) };
