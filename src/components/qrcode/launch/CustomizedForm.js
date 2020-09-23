import React, {Component} from 'react';
import {Modal, Form, Input, message} from 'antd';
import QRCode from 'qrcode.react'

const Search = Input.Search;

class CustomizedForm extends Component {
    constructor(props) {
        super(props);

    }
    //讲图片转换成base64
    getBase64Image = (image,width,height) => {
        let canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        let dataURL = canvas.toDataURL('image/png');
        return dataURL;
    };
    // 下载二维码
    downloadQrcode = () => {
        if (this.props.isOneQrCode) {
            let that = this;
            let qrcode = document.getElementById('qrcodeimage');
            let URL = 'https://img.kaikeba.com/' + this.props.imgageId;
            let image = new Image();
            image.crossOrigin = '';
            image.src = URL;
            image.onload = function(){
                let imgBase64 = that.getBase64Image(image,qrcode.width,qrcode.height);
                let a = document.createElement('a');
                let event = new MouseEvent('click');
                a.download = '微信二维码' + new Date().getTime();
                a.href = imgBase64;
                a.dispatchEvent(event)
            };
        }else {
            let qrcode = document.getElementById('qrcode');
            let img = qrcode.toDataURL("image/png");
            // 将图片的src属性作为URL地址
            let a = document.createElement('a');
            let event = new MouseEvent('click');
            a.download = '微信二维码' + new Date().getTime();
            a.href = img;
            a.dispatchEvent(event)
        }
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


    render() {
        const {visible, visibleSet, onCancel, form, id, marketExists, onOK, isOneQrCode, imgageId} = this.props;
        const {getFieldDecorator} = form;
        let qrCodeShowHtml = null;
        const qrCodeImage = isOneQrCode ?
            <img id="qrcodeimage" src={`https://img.kaikeba.com/${imgageId}`} style={{width: '100%'}}/> :
            <QRCode value={id} id="qrcode" size={180}/>
        if (marketExists) {
            qrCodeShowHtml = (<Modal
                visible={visible}
                title="获取链接"
                onCancel={onCancel}
                id={id}
                footer={null}
            >
                <div id="boxid" style={{overflow: 'hidden', marginTop: '20px'}}>
                    <div style={{
                        width: '180px',
                        height: '180px',
                        marginLeft: '50px',
                        marginRight: '30px',
                        float: 'left'
                    }}>
                        {qrCodeImage}
                        {/*<QRCode value={id} id="qrcode" size={180}/>*/}
                    </div>
                    <p style={{marginLeft: '50px', marginTop: '50px', fontSize: '14px'}}>扫码后直接访问页面</p>
                    <p style={{marginLeft: '50px', color: '#3a8ee6', fontSize: '14px', cursor: 'pointer'}}
                       onClick={this.downloadQrcode}>下载二维码</p>
                </div>
                <div style={{textAlign: 'center'}} id="input">
                    {getFieldDecorator('key', {
                        initialValue: id,
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

            </Modal>)
        } else {
            qrCodeShowHtml = (
                <Modal
                    visible={visibleSet}
                    title="获取链接"
                    onCancel={onCancel}
                    okText="去设置"
                    onOk={onOK}
                >
                    <div>
                        还没设置营销号，设置营销号才能获取链接，赶快去设置吧
                    </div>

                </Modal>
            )
        }
        return (
            <div>
                {qrCodeShowHtml}
            </div>

        );
    }
}

const CollectionCreateForm = Form.create()(CustomizedForm);
export default CollectionCreateForm;
