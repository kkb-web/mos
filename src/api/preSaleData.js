import req from '../utils/request'
import './api'

let mockUrl = 'https://easy-mock.com/mock/5cf62a77da5f4d1c7c14afda/example'

// 获取资料列表
export const materialsList = params => req.post(`/materials/list`, params)

// 课程下拉-
export const getCourses = params => req.get(`/materials/auth/course?marketing=${params}`, params)

// 学科下拉-
export const getSubject = params => req.get(`/materials/auth/subject?marketing=${params}`, params)

// 创建人下拉-
export const getUser = params => req.get(`/materials/auth/user?marketing=${params}`, params)

// 获取资料详情
export const getMaterialsDetail = params => req.get(`/materials/${params.materialsId}`, params)

// 获取资料详情（head）
export const getMaterialsTitleDetail = params => req.get(`/materials/title/${params.materialsId}`, params)

// 新增资料提交
export const addMaterials = params => req.post(`/materials/add`, params)

// 编辑资料提交
export const EditMaterials = params => req.put(`/materials/${params.id}`, params)

// 获取学员列表
export const studentList = params => req.post(`/materials/${params.materialsId}/student`, params)

// 学员列表备注
export const studentRemark = params => req.put(`/materials/student/${params.studentId}/remark`, params)

// 学员发送消息
export const sendMessage = params => req.post(`/materials/${params.materialsId}/message`, params)

// 学员发送消息 新建模板
export const addText = params => req.post(`/opencourse/text`, params)

// 学员发送消息 新建模板
export const addImg = params => req.post(`/opencourse/image`, params)

// 学员信息列表-
export const studentMesList = params => req.get(`/materials/student/${params.studentId}/message/list`, params)

// 获取渠道列表
export const channelList = params => req.post(`/materials/channels/${params.materialsId}`, params)

// 列表生成渠道

// 获取渠道链接

// add materials-
export const addChannel = params => req.post(`/materials/channel`, params)

// 销售联级下拉
export const sellerList = params => req.get(`/materials/sellers/${params.materialsId}`)

// 获取渠道链接 -
export const getPoster = params =>
  req.get(`/opencourse/poster?channelCode=${params.channelCode}&courseId=${params.courseId}&username=${params.username}`,
    { timeout: 100000 }
  )
