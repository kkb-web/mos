import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';
import QRCode from 'qrcode.react'

const Search = Input.Search;

class CustomizedForm extends Component{
    constructor(props){
        super(props);
        props.ref(props.form);
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
        console.log(e)
        let input = document.querySelector('#input input')
        input.select()
        document.execCommand("Copy")
        console.log(this.refs.input, '=========')
    };

    componentDidMount() {
        console.log(this.props)
    }

    render(){
        const { visible, onCancel, onCreate, form, id, okText, title } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={visible}
                title={title}
                okText={okText}
                onCancel={onCancel}
                onOk={onCreate}
                id={id}
                footer={null}
            >
                <div style={{overflow: 'hidden', marginTop: '20px'}}>
                    <div style={{
                        width: '180px',
                        height: '180px',
                        marginLeft: '50px',
                        marginRight: '30px',
                        float: 'left'
                    }}>
                        <QRCode value={id} id="qrcode" size={180}/>
                    </div>
                    <p style={{marginLeft: '50px', marginTop: '50px', fontSize: '14px'}}>扫码后直接访问页面</p>
                    <p style={{marginLeft: '50px', color: '#3a8ee6', fontSize: '14px', cursor: 'pointer'}} onClick={this.downloadQrcode}>下载二维码</p>
                </div>
                <div style={{textAlign: 'center'}} id="input">
                    {getFieldDecorator('key')(
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

            </Modal>
        );
    }
}

const CollectionCreateForm = Form.create()(CustomizedForm);
export default CollectionCreateForm;
