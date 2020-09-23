import {axiosInstance} from "./global-props";
import {getHeaders} from "./filter";
import axios from "axios";

export const qiniuUrl = () => {
    let qiniuUploadUrl;
    if (window.location.protocol === 'https:') {
        qiniuUploadUrl = 'https://up.qbox.me';
    } else {
        qiniuUploadUrl = 'http://upload.qiniu.com';
    }
    return qiniuUploadUrl
};

// 上传图片
export const requestData = (file) => {
    return new Promise(function (resolve, reject) {
        axiosInstance.get({
            url: '/common/qiniu/token',
            headers: getHeaders()
        }).then((response) => {
            let uptoken = response.data.data.uptoken;
            let key = response.data.data.key;
            let param = new FormData(); // 创建form对象
            param.append('file', file, file.name); // 通过append向form对象添加数据
            param.append('chunk', '0'); // 添加form表单中其他数据
            param.append('key', key);
            param.append('token', uptoken);
            param.append('type', file.type);
            axios.post(qiniuUrl(), param, {
                headers: {'Content-Type': 'multipart/roles-data'},
            }).then(res => {
                resolve(res);
            }).catch(err => {
                console.log(err);
                reject(err);
            });
        }).catch((err) => {
            // alert(err)
            console.log(err);
        });
    });
};
