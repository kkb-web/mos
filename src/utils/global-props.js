import axios from 'axios';
import {message} from 'antd';
import {refreshToken} from "./filter";

let baseURL = '';

// console.log(process.env.NODE_ENV, window.location.href.indexOf('cmstest'), "========环境");
if (process.env.NODE_ENV === 'development') {
    baseURL = 'https://consoletest.kaikeba.com';
} else {
    if (window.location.href.indexOf('crmtest') !== -1) {
        baseURL = 'https://consoletest.kaikeba.com';
    } else if (window.location.href.indexOf('crmpre') !== -1) {
        baseURL = 'https://consolepre.kaikeba.com';
    } else {
        baseURL = 'https://console.kaikeba.com';
    }
}

export const axiosHttp = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
    timeout: 50000
});

function sendAjax (method, {url, params, data, headers, commit, successType, errorType}) {
    const request = axiosHttp.request({
        url,
        params,
        data,
        headers,
        method: method.toLowerCase()
    });

    request.then((res) => {
        // console.log('response success: ', res, "=================global");
        if (res.status === 200 || res.state === 304 || res.state === 301 || res.state === 302) {
            if (commit) {
                commit(successType, res.data.info)
            }
        } else {
            console.log('response error: ', res);
            if (commit) {
                commit(errorType, JSON.stringify(res.data))
            }
        }
    }).catch((error) => {
        if (error.response.status === 500 || error.response.status === 503 || error.response.status === 502) {
            message.error('500服务端错误，请稍后重试！')
        } else if (error.response.status === 401) {
            refreshToken();
        } else if (error.response.status === 403) {
            message.error('抱歉！你暂无权限操作此功能')
        } else if (error.response.status === 400 || error.response.status === 404) {
            message.error('400/404 接口请求失败，请重试！如有疑问，联系管理员。')
        } else {
            if (error.response.statusText) {
                // message.error(error.response.statusText);
            }
        }
    });
    return request
}

export const axiosInstance = {
    get (paramBean) {
        return sendAjax('get', paramBean)
    },
    post (paramBean) {
        return sendAjax('post', paramBean)
    },
    put (paramBean) {
        return sendAjax('put', paramBean)
    },
    delete (paramBean) {
        return sendAjax('delete', paramBean)
    }
};
