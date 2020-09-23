// crmtest crmpre crm
// marketing operation system
const DEV = 'dev'
const PRE = 'pre'
const PROD = 'prod'
const TEST = 'test'
const { hostname } = window.location
export const envObj = { DEV, PRE, TEST, PROD }
// get env
export const isDevEnv =
  process.env.REACT_APP_ENV === DEV || hostname === 'localhost'
export const isTestEnv = process.env.REACT_APP_ENV === TEST
export const isPreEnv = process.env.REACT_APP_ENV === PRE
export const isProdEnv = process.env.REACT_APP_ENV === PROD

// 获取当前域名的前缀
// export const getDomainPrefix = () => {
//   let prefix = env.find(item => {
//     if (hostname.indexOf(item) === 0) return item
//   })
//   return prefix || ''
// }

// 当前api的前缀
// export const getApiPrefix = () => {
//   if (isDevEnv) return 'test-'
//   if (isTestEnv) return 'test-'
//   if (isPreEnv) return 'pre-'
//   return ''
// }
// api的请求头 http or https
// export const getApiHttp = () => {
//   if (isDevEnv) return 'http'
//   if (isTestEnv) return 'http'
//   if (isPreEnv) return 'https'
//   return 'https'
// }

// 获取当前环境
export const getEnv = process.env.REACT_APP_ENV
