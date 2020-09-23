import React, { Component } from 'react';
import { Modal, Form, Input, Button, Select } from 'antd';
import QRCode from 'qrcode.react'
import {getHeaders, openCourseUrl} from "../../utils/filter";
import {axiosInstance} from "../../utils/global-props";

const Search = Input.Search;
const Option = Select.Option;

class CustomizedForm extends Component{
    constructor(props){
        super(props);
        this.state={
            data: [],
            name: '',
            value: ''
        }
    }
    handleChange = (value) => {
        this.setState({
            name: value
        })
    };
    // 下载二维码
    downloadQrcode = () => {
        let qrcode = document.getElementById('qrcode');
        let img = qrcode.toDataURL("image/png");
        console.log(img)
        // 将图片的src属性作为URL地址
        let a = document.createElement('a');
        let event = new MouseEvent('click');

        a.download = '微信二维码' + new Date().getTime();
        a.href = img;

        a.dispatchEvent(event)
    };
    // 复制链接
    copyLink = () => {
        let input = document.querySelector('#input input');
        input.select();
        document.execCommand("Copy");
        console.log(this.refs.input, '=========');
    };

    // 渠道生成点击
    buildQrcode = () => {
        let _this = this;
        // 获取渠道列表
        axiosInstance.get({
            url: '/opencourse/channel/list/' + this.props.openCourseId,
            headers: getHeaders()
        }).then(function (res) {
            let data= res.data.data;
            let boolValue = true;
            for (let i = 0; i < data.length; i++) {
                if (data[i].name === _this.state.name) {
                    boolValue = true;
                    _this.setState({
                        value: openCourseUrl() + '/opencourse/' + _this.props.openCourseId + '?channel=' + data[i].code
                    });
                    _this.props.form.setFieldsValue({
                        key: openCourseUrl() + '/opencourse/' + _this.props.openCourseId + '?channel=' + data[i].code
                    });
                    break;
                } else {
                    boolValue = false;
                }
            }
            // 生成新渠道
            if (!boolValue) {
                axiosInstance.post({
                    url: '/opencourse/add/channel',
                    data: {
                        openCourseId: _this.props.openCourseId,
                        name: _this.state.name
                    },
                    headers: getHeaders()
                }).then(function (res) {
                    console.log(res);
                    if (res.data.code === 0) {
                        _this.setState({
                            value: openCourseUrl() + '/opencourse/' + _this.props.openCourseId + '?channel=' + res.data.data.code
                        });
                        _this.props.form.setFieldsValue({
                            key: openCourseUrl() + '/opencourse/' + _this.props.openCourseId + '?channel=' + res.data.data.code
                        });
                    }
                });
            }
        });
    }

    render(){
        const { visible, onCancel, onCreate, form, data, id, okText, title, openCourseId } = this.props;
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
                data={data}
                openCourseId={openCourseId}
            >
                <div style={{marginLeft: '40px'}} className="channel">
                    <span>渠道ID：</span>
                    <Select
                        mode="combobox"
                        placeholder="英文小写"
                        onChange={this.handleChange}
                        style={{ width: '200px', marginLeft: '5px', marginRight: '10px' }}
                    >
                        {data && data.map((value, index) => {
                            return (<Option key={value.name}>{value.name}</Option>)
                        })}
                    </Select>
                    {/*<Input style={{width: '200px', marginLeft: '5px', marginRight: '10px'}} placeholder="英文小写"/>*/}
                    <Button type="primary" onClick={this.buildQrcode}>生成</Button>
                </div>
                <div style={{overflow: 'hidden', marginTop: '20px'}}>
                    <div style={{
                        width: '180px',
                        height: '180px',
                        marginLeft: '40px',
                        marginRight: '30px',
                        float: 'left'
                    }}>
                        <QRCode value={this.state.value === '' ? id : this.state.value} id="qrcode" size={180}/>
                        {/*<img  id='qrcode' src="https://img.kaikeba.com/1540974792213.png" alt=""/>*/}
                        {/*{getFieldDecorator('key')(*/}
                            {/*<QRCode id="qrcode" size={180}/>*/}
                        {/*)}*/}
                        <img id="qrcode" src="https://img.kaikeba.com/1540974792213.png" style={{width: '180px', height: '180px'}} alt=""/>
                    </div>
                    <p style={{marginLeft: '50px', marginTop: '20px', fontSize: '14px'}}>我的专属推广链接二维码</p>
                    <p style={{marginLeft: '50px', marginTop: '-10px', fontSize: '14px'}}>扫码后直接访问商品</p>
                    <p style={{marginLeft: '50px', color: '#3a8ee6', fontSize: '14px', cursor: 'pointer'}} onClick={this.downloadQrcode.bind(this, '二维码')}>下载二维码</p>
                </div>
                <div style={{textAlign: 'center'}} id="input">
                    {getFieldDecorator('key')(
                        <Search
                            placeholder="网址"
                            enterButton="复制"
                            size="large"
                            onSearch={this.copyLink}
                            style={{width: '84%', marginTop: '40px', marginBottom: '20px'}}
                            onChange={this.copyLink}
                            className="search"
                        />
                    )}
                </div>

            </Modal>
        );
    }
}

const CollectionCreateForm = Form.create()(CustomizedForm);
export default CollectionCreateForm;
