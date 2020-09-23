import req from '../utils/request'
import "./api";
import AddText from '../components/qrcode/resources/mock/addText'
import TextList from '../components/qrcode/resources/mock/textList'
import ImgList from '../components/qrcode/resources/mock/imgList'
import Mock from 'mockjs';

Mock.mock('/opencourse/text', AddText);
Mock.mock('/opencourse/text/list', TextList);
Mock.mock('/opencourse/template/collect/1', AddText);
Mock.mock('/opencourse/template/1', AddText);
Mock.mock('/opencourse/image/list', ImgList);
Mock.mock('/opencourse/image', AddText);



// 获取营销列表
export const getMarketList = params => { return req.post( `/account/sellers`, params); };
// 获取学科列表
export const getSubjectList = () => { return req.get( `/account/comm/subjects`); };
// 获取销售列表
export const getUserList = () => { return req.get( `/account/comm/users`); };
// 获取设备列表
export const getDeviceList = () => { return req.get( `/account/comm/devices/distinct`); };
// 选择设备
export const chooseDevice = params => { return req.get( `/account//sellers/${params.sellerId}/${params.deviceId}`); };

//获取媒体列表
export const getMediaList = params => { return req.post( `/qrcode/media/list`,params); };
//添加媒体
export const addMedia = params => { return req.post( `/qrcode/media`,params); };
//编辑媒体
export const editMedia = params => { return req.put( `/qrcode/media`,params); };
//媒体详情
export const getMediaDetails = (params) => { return req.get( `/qrcode/media/${params.id}`,params); };


//销售-学科级联下拉
export const getSelectInfo = (params) => { return req.get( `/qrcode/seller/${params.id}`,params); };
//添加营销号
export const addQrcode = params => { return req.post( `/qrcode/qr/${params.adId}`,params); };
//删除二维码
export const deleteQrcode = params => { return req.dele( `/qrcode/qr/${params.id}`, params);};
//修改权重
export const modifyWeight = params => { return req.put( `/qrcode/qr/${params.id}?weight=${params.weight}`,params); };
//渠道营销号列表
export const getMarktList = params => { return req.post( `/qrcode/ad/${params.id}/qr`,params); };



//投放列表
export const getLaunchList = params => { return req.post(`/qrcode/ad/list`,params); };
//添加投放
export const addLaunch = params => { return req.post(`/qrcode/ad`,params); };
//编辑投放
export const editLaunch = params => { return req.put(`/qrcode/ad`,params); };
//投放详情
export const launchDetail = params => { return req.get(`/qrcode/ad/${params.id}`,params); };
//阅读量列表
export const visitorsList = params => { return req.post(`/qrcode/ad/${params.id}/visitorses`,params); };
//新增阅读量
export const addVisitor = params => { return req.post(`/qrcode/ad/${params.id}/visitors`,params); };
//媒体名称
export const getMediaNameList = params => { return req.get(`/qrcode/media`,params); };
//上传付款截图
export const uoloadCertificate = params => { return req.post(`/qrcode/ad/${params.uuid}/certificate?certificate=${params.certificate}`,params); };
//获取获取付款截图
export const getCertificate = params => { return req.get(`/qrcode/ad/${params.uuid}/certificate`,params); };
//判断是否设置营销号d
export const judgeMarketExists = params => { return req.get(`/qrcode/ad/${params.id}/exists`,params); };

//获取成单列表数据
export const getOrderList = params => { return req.post(`/qrcode/order/list`, params);};


// 素材管理相关
// 获取文字列表
export const getTextList = params => { return req.post(`/opencourse/text/list`, params); };
// 获取收藏文本列表
export const getCollectTextList = params => { return req.post(`/opencourse/text/collect/list`, params); };
// 新建文字模板
export const addText = params => { return req.post(`/opencourse/text`, params); };
// 编辑文字模板
export const editText = params => { return req.put(`/opencourse/text`, params); };
// 收藏
export const collectTemplate = params => { return req.post(`/opencourse/template/collect/${params.templateId}?business=${params.business}`)};
// 取消收藏
export const cancelCollectTemplate = params => { return req.dele(`/opencourse/template/collect/${params.collectId}`); };
// 删除模板
export const deleteTemplate = params => { return req.dele(`/opencourse/template/${params.templateId}`); };
// 获取图片列表
export const getImgList = params => { return req.post(`/opencourse/image/list`, params); };
// 新建图片模板
export const addImg = params => { return req.post(`/opencourse/image`, params); };
// 修改图片名称
export const editImgName = params => { return req.put(`/opencourse/image`, params); };
// 创建筛选
export const createByFilter = params => { return req.get(`/opencourse/template/createby`, params); };
// 验证素材名称
export const checkName = params => {return req.get(`/opencourse/template/checkname?templateId=${params.templateId}&name=${params.name}`); };
// 公开课发送消息文字模板
export const getMsgTextList = params => { return req.post(`/opencourse/message/text/list`, params); };
// 图片限制上传数量
export const limitPicNumber = () => {return req.get(`/opencourse/template/material/count`); };

// 发送消息的收藏
export const getCollectTemplate = params => { return req.post(`/opencourse/${params.msgType}/collect/list`, params.params); };
