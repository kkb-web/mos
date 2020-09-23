import {axiosInstance} from "./global-props";
import {getHeaders, wechatUrl} from "./filter";
import axios from "axios";

let baseUrl = (process.env.NODE_ENV === 'development' ? '' : '/wechatupload');

export const wxUrl = (token) => {
    let wxUploadUrl = baseUrl + `/cgi-bin/material/add_material?access_token=${token}&type=image`;
    return wxUploadUrl
};


// 上传图片
export const requestData = (file) => {
    return new Promise(function (resolve, reject) {
        axios.get(wechatUrl() + '/wechat/token', {
            headers: getHeaders()
        }).then((response) => {
            console.log(response.data);
            let uptoken = response.data;
            let param = new FormData(); // 创建form对象
            param.append('media', file, file.name); // 通过append向form对象添加数据
            axios.post(wxUrl(uptoken), param, {
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
