
import "./api";
import Mock from 'mockjs';
import req from '../utils/request'


// 线索导出
// export const exportClue = params => {return axios.get(baseUrl() +`/account/clue/export?startTime=${params.startTime}&endTime=${params.endTime}`, params); };
export const exportClue = params => {return req.post(`/account/clue/export`, params); };
// 线索导入
export const importClue = params => {return req.post(`/campaign/clue/importMos`, params); };
