import axios from 'axios'
import {getToken, refreshToken} from '../utils/filter'
import {message} from 'antd';
import {baseUrl} from '../utils/filter'
import {hasIn, handleError} from '../utils/utils'
// import { domainPrefix } from '@/api/config'
// import { isTestEnv, getApiPrefix, getApiHttp } from '@/utils/env'
// import { apiError } from '@/utils/log'

axios.defaults.withCredentials = true
axios.defaults.timeout = 50000
axios.defaults.headers.common['Content-Type'] = 'application/json'
// Vue.prototype.axios = axios
// const apiPrefix = getApiPrefix()
// const apiHttp = getApiHttp()
// 错误状态码 有返回错误直接进行操作-
// const errorStatus = [401, 500, 502, 504, 400]

// const preFix = isTestEnv ? 'test.' : domainPrefix
// const urlPassport = `http://${preFix}passport.kaikeba.com/?redirect=http://${domainPrefix}learn.kaikeba.com/transfer`

// const baseURL = `${apiHttp}://${apiPrefix}weblearn.kaikeba.com`
axios.defaults.baseURL = baseUrl()
// axios.defaults.baseURL = 'http://api.shudong.wang/v1'

//axios 管理请求头统一处理
axios.interceptors.request.use(
  config => {
    // 这里写死一个token，需要在这里取到设置好的token的值
    const token = getToken('access_token');
    if (token) {
      // 这里将token设置到headers中，header的key是Authorization，这个key值根据你的需要进行修改即可
      config.headers.Authorization = "bearer " + token;
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
);

// 中间件 拦截请求-
axios.interceptors.response.use(
  response => {

    return response
  },
  err => {
    console.log(err,'errorhaichen')
    console.log(err.response,'errorstatus')
    // debugger
    if (!err.response) {
      // apiError('ApiError', err)
      return
    }
    // const res = err.response
    // const option = { status: res.status, url: res.config.url, params: res.config.params }

    // apiError('ApiError', option)
    // return Promise.reject(err)
    if (err.response.status === 200) {
        message.error('200')
    } else if ([500,502,503].indexOf(err.response.status) > -1) {
        message.error('500服务端错误，请稍后重试！')
    } else if (err.response.status === 401) {
        refreshToken();
    } else if (err.response.status === 403) {
        message.error('抱歉！你暂无权限操作此功能')
    } else if ([400,404].indexOf(err.response.status) > -1) {
        message.error('400/404 接口请求失败，请重试！如有疑问，联系管理员。')
    }
    return Promise.reject(err);
  }
)

/**
 * get
 * @param url
 * @param data
 * @param config
 * @returns {Promise}
 */

const get = (url, params = {}, config = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url, params, Object.assign({},config))
      .then(response => {
        if(!hasIn(response.data,'data')) {
          response.data.data = ''
        }
        resolve(response)
      })
      .catch(err => {
        handleError(reject,err)
      })
  })
}


/**
 * post
 * @param url
 * @param data
 * @param config
 * @returns {Promise}
 */

const post = (url, data = {}, config = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .post(url, data,Object.assign({},config) )
      .then(
      response => {
        if(!hasIn(response.data,'data')) {
          response.data.data = ''
        }
        resolve(response)
      },
      err => {
        handleError(reject,err)
      }
    )
  })
}

/**
 * put
 * @param url
 * @param data
 * @param config
 * @returns {Promise}
 */

const put = (url, data = {}, config = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .put(url, data, Object.assign({},config) )
      .then(
      response => {
        if(!hasIn(response.data,'data')) {
          response.data.data = ''
        }
        resolve(response)
      },
      err => {
        handleError(reject,err)
      }
    )
  })
}


/**
 * delete
 * @param url
 * @param data
 * @returns {Promise}
 */

const dele = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(url, data)
      .then(
      response => {
        if(!hasIn(response.data,'data')) {
          response.data.data = ''
        }
        resolve(response)
      },
      err => {
        handleError(reject,err)
      }
    )
  })
}

const formPut = (url, data = {}) => {
  const config = {
    method: 'put',
    url: url,
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  return new Promise((resolve, reject) => {
    axios(config).then(
        response => {
          if(!hasIn(response.data,'data')) {
            response.data.data = ''
          }
          resolve(response)
        },
        err => {
          handleError(reject,err)
        }
      )
  })
}

export default {
  get,
  post,
  put,
  dele,
  formPut
}
