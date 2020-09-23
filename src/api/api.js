// import axios from 'axios'
// import {getToken, refreshToken} from '../utils/filter';
// import {message} from 'antd';
//
// axios.defaults.withCredentials = true;
// axios.defaults.timeout = 50000;
// axios.defaults.headers.common['Content-Type'] = 'application/json';
//
// //axios管理请求头统一处理
// axios.interceptors.request.use(
//   config => {
//     // 这里写死一个token，需要在这里取到设置好的token的值
//     const token = getToken('access_token');
//     if (token) {
//       // 这里将token设置到headers中，header的key是Authorization，这个key值根据你的需要进行修改即可
//       config.headers.Authorization = "bearer " + token;
//     }
//     return config
//   },
//   error => {
//     return Promise.reject(error)
//   }
// );
//
// //axios管理返回错误数据统一处理
// axios.interceptors.response.use(
//     response => {
//         // if (response.status && response.status == 200 && response.data.status == 'error') {
//         //     message.error({message: response.data.msg});
//         //     return;
//         // }
//         // console.log(response, "============================axios");
//         return response;
//     },
//     err => {
//         if (err.response.status === 200) {
//             message.error('200')
//         } else if (err.response.status === 500 || err.response.status === 503 || err.response.status === 502) {
//             message.error('500服务端错误，请稍后重试！')
//         } else if (err.response.status === 401) {
//             // refreshToken();
//         } else if (err.response.status === 403) {
//             message.error('抱歉！你暂无权限操作此功能')
//         } else if (err.response.status === 400 || err.response.status === 404) {
//             message.error('400/404 接口请求失败，请重试！如有疑问，联系管理员。')
//         }
//         return Promise.reject(err);
//     }
// );
// /**
//  * get方法，对应get请求
//  * @param {String} url [请求的url地址]
//  * @param {Object} params [请求时携带的参数]
//  */
// export const unTokenget = (url, params) => {
//   return new Promise((resolve, reject) => {
//     axios.get(url, {
//       params: params,
//       headers: {
//         Authorization:''
//       }
//     }).then(res => {
//       resolve(res.data);
//     }).catch(err => {
//       reject(err.data)
//     })
//   });
// };
