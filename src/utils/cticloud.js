export class Cit {
  constructor () {
    this.CTILink = window.CTILink
  }
  // 预览外呼 打电话
  previewOutcall (num) {
    var params = {}
    params.tel = num
    // params.userField = {'userFiled1':'value1', 'userFiled2':'value2'}
    // const CTILink = CTILink || window.CTILink
    console.log('this.CTILink',this.CTILink)
    this.CTILink.Agent.previewOutcall(params)
  }

  // 改变绑定的号码
  changeBindTel (num) {
    var params = {}
    params.bindTel = num
    params.bindType = 3
    this.CTILink.Agent.changeBindTel(params)
  }

  // 预览外呼取消
  previewOutcallCancel () {
    this.CTILink.Session.previewOutcallCancel()
  }

  // 挂断
  unlink () {
    // const callback = (data) => {
    //   console.log('电话挂断', data)
    // }
    this.CTILink.Session.unlink()
  }
}

export default new Cit()
