import req from '../../utils/request'

export default {
  state: {
    code: -1,
    msg: '',
    data: null
  },
  reducers: {
    result(state,payload){
      return Object.assign({},state,payload)
    }
  },
  effects: dispatch => ({
    async getFormList(payload, rootState) {
      const res = await req.get('https://mock.kaikeba.com/mock/5d819cd8b368e60022f1d414/formlist/getTableList', payload)
      this.result(res)
    }
  })
}
