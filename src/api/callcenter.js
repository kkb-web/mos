import "./api";
import req from '../utils/request'

// 登录授权
export const logIn = () => { return req.get(`/account/session`); };
// export const logIn = () => { return axios.get('https://console.kaikeba.com/account/session'); };
