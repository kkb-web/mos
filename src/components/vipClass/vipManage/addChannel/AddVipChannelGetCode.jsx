import React, { Component } from 'react';
import {Form, Input,message ,Icon} from 'antd';
import QRCode from 'qrcode.react'
import history from "../../../common/History";

const Search = Input.Search;

class CustomizedForm extends Component{
    constructor(props){
        super(props);

    }
    // 下载二维码
    downloadQrcode = () => {
        let qrcode = document.getElementById('qrcode');
        let img = qrcode.toDataURL("image/png");
        // 将图片的src属性作为URL地址
        let a = document.createElement('a');
        let event = new MouseEvent('click');

        a.download = '微信二维码' + new Date().getTime();
        a.href = img;

        a.dispatchEvent(event)
    };
    // 复制链接
    copyLink = (e) => {
        let input = document.querySelector('#input input')
        input.select()
        document.execCommand("Copy")
        message.success('已复制到剪贴板')
    };

    componentDidMount() {
        console.log(this.props)
    };
    //跳转到渠道详情
    linkToChannelDe = (id)=>{
        history.push({pathname: `/app/vipcourse/${id}?page=4`,state:{id:id}})
    };


    render(){
        const { id ,courseId} = this.props;
        const {getFieldDecorator} = this.props.form;
        return (
            <div>
                <div style={{overflow: 'hidden'}}>
                    <div style={{textAlign:'center'}}>
                        <Icon style={{color:'rgb(87,194,45)',fontSize:'45px'}} type="check-circle" theme="filled" />
                        <p style={{textAlign:'center',marginTop:'30px',marginBottom:'18px'}}>生成后的二维码和链接可在<span onClick={this.linkToChannelDe.bind(this,courseId)} style={{color:'#1890ff',cursor:'pointer'}}>渠道情况</span>中查看</p>
                    </div>
                    <div style={{
                        width: '180px',
                        height: '180px',
                        marginLeft: '50px',
                        marginRight: '30px',
                        float: 'left'
                    }}>
                        <QRCode value={id} id="qrcode" size={180}/>
                    </div>

                    <p style={{marginLeft: '40px', marginTop: '50px', fontSize: '14px',textAlign:'left'}}>我的专属推广链接二维码</p>
                    <p style={{marginLeft: '40px', marginTop: '5px', fontSize: '14px',textAlign:'left'}}>扫码后直接访问商品</p>
                    <p style={{marginLeft: '40px', color: '#3a8ee6', fontSize: '14px', cursor: 'pointer',textAlign:'left'}} onClick={this.downloadQrcode}>下载二维码</p>
                </div>
                <div style={{textAlign: 'center',paddingBottom:'100px'}} id="input">
                    {getFieldDecorator('key',{
                        initialValue:id,
                    })(
                        <Search
                            placeholder="input search text"
                            enterButton="复制"
                            size="large"
                            onSearch={this.copyLink}
                            style={{width: '80%', marginTop: '40px', marginBottom: '20px'}}
                            onChange={this.copyLink}
                        />
                    )}
                </div>
            </div>
        );
    }
}

const CollectionCreateForm = Form.create()(CustomizedForm);
export default CollectionCreateForm;
