
import "./api";
import Mock from 'mockjs';
import req from '../utils/request'

import AllClues from '../components/clueCenter/mock/allClue'
import Occupied from '../components/clueCenter/mock/occupied'
import OnlineSaleClue from '../components/clueCenter/mock/onlineSaleClue'
import TelSaleClue from '../components/clueCenter/mock/telSaleClue'

let _baseUrl = '';
Mock.mock('/clue/my/cluelist', AllClues);
Mock.mock('/clue/my/occupiedlist', Occupied);
Mock.mock('/clue/onlinesaleclue/list', OnlineSaleClue);
Mock.mock('/clue/telsaleclue/list', TelSaleClue);

//mock数据
export const getAllCluesList = params => { return req.post(_baseUrl + `/clue/my/cluelist`, params); };
export const getOnlineSaleClueList = params => { return req.post(_baseUrl + `/clue/onlinesaleclue/list`, params); };

//线上数据
//获取公共线索列表
export const getCommonCluesList = params => { return req.post(`/account/clue/list`, params); };
//获取我的线索列表
export const getMyClueList = params => { return req.post(`/account/clue/my`, params); };
//获取线索详情
export const getClueDetail = params =>{return req.post(`/account/clue/${params.id}`, params); };
//创建备注
export const setRemark = params =>{return req.post( `/account/clue/remark`, params); };
//获取线索详情基本信息表单字段
export const getClueDetailBase = params =>{return req.get(`/clue/field/basic/${params.clueId}`, params); };
//获取线索详情业务信息表单字段
export const getClueDetailBusiness = params =>{return req.get(`/clue/field/value/${params.clueId}?campaignCode=${params.campaignCode}`, params); };
//字段值管理
export const changeClue = params =>{return req.post(`/clue/values`, params); };
//获取备注记录
export const getAllRemark = params =>{return req.get(`/clue/remark/list?clueId=${params.clueId}`, params); };
//获取新加
export const getNewClueDetail = params =>{return req.post(`/clue/getClueProperties/${params}`, params); };
