import {axiosInstance} from "./global-props";
import {getHeaders1} from "./filter";
import axios from "axios";
let baseURL = '';

// console.log(process.env.NODE_ENV, window.location.href.indexOf('cmstest'), "========环境");
if (process.env.NODE_ENV === 'development') {
    baseURL = 'https://consoletest.kaikeba.com';
} else {
    if (window.location.href.indexOf('mostest') !== -1) {
        baseURL = 'https://consoletest.kaikeba.com';
    } else if (window.location.href.indexOf('mospre') !== -1) {
        baseURL = 'https://consolepre.kaikeba.com';
    } else {
        baseURL = 'https://console.kaikeba.com';
    }
}

export const requestData = (file) => {
    let param = new FormData(); // 创建form对象
    param.append('file', file, file.name); // 通过append向form对象添加数据
    param.append('type', file.type);

    return new Promise(function(resolve, reject) {
      axios.post(`${baseURL}/campaign/clue/importMos`, param, {
          withCredentials: true,
          timeout: 50000,
          headers: {'Content-Type': 'multipart/roles-data', 'Access-Control-Allow-Origin': '*'},
      }).then(res => {
          resolve(res);
      }).catch(err => {
          console.log(err);
          reject(err);
      });
    })

};
