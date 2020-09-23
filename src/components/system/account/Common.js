//验证名字是否符合规则
export function nameCheckGlobal(value) {
    if (value.length === 0) {
        return {
            nameHint: '名称不能为空',
            nameState: 'error'
        }
    } else if (value.length > 10) {
        return{
            nameHint: '名称少于10个字',
            nameState: 'error'
        }
    }else if(!(/^[\u0391-\uFFE5A-Za-z]+$/).test(value)){
        return{
            nameHint: '仅支持汉字和字母',
            nameState: 'error'
        }
    }else{
        return{
            nameHint: '',
            nameState: 'success'
        }

    }
}

//验证手机号是否符合规则
export function phoneCheckGlobal (value){
    let phonereg=/^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!phonereg.test(value)) {
        return {
            phoneValHint: '请输入正确的手机号',
            phoneState: 'error'
        }
    } else {
        return {
            phoneValHint:'',
            phoneState: 'success'
        }
    }
}

//验证mail是否符合规则
export function mailValCheckGlobal (value){
    if(!(/^[A-Za-z]\w{1,15}@kaikeba.com/).test(value)){
        return {
            mailValHint: '请输入有效的开课吧邮箱',
            mailState: 'error'
        }
    }else{
        return {
            mailValHint: '',
            mailState: ''
        }

    }
};




