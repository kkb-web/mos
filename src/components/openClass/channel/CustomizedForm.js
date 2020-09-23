import React, { Component } from 'react';
import {Modal, Form, Input, Button, Select, message, Spin, Upload, Icon} from 'antd';
import {getToken, openCourseUrl} from "../../../utils/filter";
import {addChannel, getPoster} from "../../../api/openCourseApi";
import {requestData} from "../../../utils/qiniu";
import {getSubjectList, getPublicList} from "../../../api/commonApi";

const FormItem = Form.Item
const Search = Input.Search;
const Option = Select.Option;

let emojiRule = /([\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70-\uDD71\uDD7E-\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01-\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50-\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96-\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF])|(\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F-\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95-\uDD96\uDDA4-\uDDA5\uDDA8\uDDB1-\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB-\uDEEC\uDEF0\uDEF3-\uDEF6])|(\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0])/g;

class CustomizedForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: [],
            value: '',
            code: '',
            img: '',
            channelTxt: '',
            loading: true,
            hint: 'none',
            disableBtn: false,
            fileList: [],
            visible: true,
            subjectList: [],
            publicList: []
        }
    }

    // componentDidMount () {
    // }
    //
    // componentWillReceiveProps (nextProps) {
    //   const {publicList} = nextProps;
    //   this.setState({
    //     publicList: publicList
    //   })
    // }

    // 下载二维码
    downloadQrcode = () => {
        let qrcode = document.getElementById('qrcode');
        // let img = qrcode.toDataURL("image/png");
        let img = qrcode.src;
        // console.log(img);
        // 将图片的src属性作为URL地址
        let a = document.createElement('a');
        let event = new MouseEvent('click');
        a.download = '微信二维码' + new Date().getTime() + '.png';
        a.href = img;
        a.dispatchEvent(event)
    };

    // 复制链接
    copyLink = () => {
        let input = document.querySelector('#input input');
        input.select();
        document.execCommand("Copy");
        if (input.value !== '') {
            // message.config({top: 350})
            message.success('已复制到剪贴报')
        }
    };



    // 渠道名称检查
    changeStyle = (e) => {
        // this.setState({
        //     value: e.target.value
        // });
        if (e.target.value.length > 50) {
            this.setState({
                channelTxt: '渠道名称不能超过50字'
            })
        } else if (!(e.target.value.indexOf(" ") === -1)) {
            this.setState({
                channelTxt: '禁止输入空格'
            })
        } else if (emojiRule.test(e.target.value)) {
            this.setState({
                channelTxt: '禁止输入emoji'
            })
        } else {
            this.setState({
                channelTxt: ''
            })
        }
    };
    //
    // handleSubmit = () => {
    //   this.props.form.validateFields((err, values) => {
    //     if(!err){
    //       delete values.key
    //       console.log(values)
    //     }
    //   })
    // }
    // 渠道生成点击
    buildChannel = () => {
        console.log({
            openCourseId: parseInt(window.location.pathname.slice(12)),
            name: this.state.value
        }, "======添加渠道参数");
        if (this.state.value.length <= 50 && this.state.headUrl && this.state.userName) {
            this.setState({
                disableBtn: true
            });
            addChannel({
                openCourseId: parseInt(window.location.pathname.slice(12)),
                name: this.state.value,
                headImgUrl: this.state.headUrl,
                nickname: this.state.userName
            }).then(res => {
                console.log(res.data);
                this.setState({
                    disableBtn: false
                });
                if (res.data.code === 0) {
                    // this.setState({
                    //     code: res.data.data
                    // });
                    // this.props.form.setFieldsValue({
                    //     key: openCourseUrl() + '/opencourse/' + window.location.pathname.slice(12) + '?channel=' + res.data.data
                    // });
                    // this.buildPoster();
                    message.success('渠道已生成！');
                    document.getElementById('get-channel').click();
                    this.setState({
                        visible: false,
                        headUrl: null,
                        img: null,
                        value: null,
                        userName: null
                    })
                    // document.querySelector('.txt').style.display = 'none';
                    // document.querySelector('.channel-poster').style.display = 'block';
                } else {
                    message.error(res.data.msg);
                    // document.querySelector('.txt').style.display = 'block';
                    // document.querySelector('.channel-poster').style.display = 'none';
                }
            });
        }
    };

    // publicIdToName = (id)=>{
    //   let data = this.props.subjectList;
    //   for (let i=0;i<data.length;i++){
    //     if(data[i].id == id){
    //       return data[i].name
    //     }
    //   }
    // };


    // 生成海报
    // buildPoster = () => {
    //     this.setState({
    //         hint: 'none'
    //     });
    //     getPoster({
    //         courseId: parseInt(window.location.pathname.slice(12)),
    //         channelCode: this.state.code,
    //         username: getToken('username')
    //     }).then(res => {
    //         console.log(res, "========");
    //         if (res.data.code === 0) {
    //             this.setState({
    //                 img: res.data.data.img,
    //                 loading: false
    //             });
    //         } else {
    //             message.error(res.data.msg);
    //             this.setState({
    //                 loading: false,
    //                 hint: 'block'
    //             });
    //         }
    //     }).catch(err => {
    //         this.setState({
    //             loading: false,
    //             hint: 'block'
    //         });
    //     });
    // };

    // <Button disabled={disableBtn} id='channel-btn' type="primary" onClick={buildChannel} className='have-value'>生成</Button>

    // <div style={{marginLeft: '40px', display: id === 0 ? 'block': 'none'}} className="channel">
    //
    //   <button id='get-channel' onClick={getChannel} style={{opacity: 0}}/>
    //   <div style={{color: "rgb(245, 34, 45)", marginLeft: '80px'}}>{channelTxt}</div>
    // </div>

    // <FormItem label="自定义头像">
    //   {
    //     getFieldDecorator('')
    //   }
    // </FormItem>


    // <Form>
    //   <div id="select-public" layout="horizontal">
    //     <FormItem label="用户报名公共号" {...FormItemLayout} hasFeedback>
    //       {
    //         getFieldDecorator('public', {
    //           rules: [{
    //             required: true, message: '请选择公共号'
    //           }],
    //         })(
    //           <Select
    //             showSearch
    //             placeholder="请填写推广名称"
    //             onChange={this.chooosePublic}
    //             filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
    //             getPopupContainer={() => document.getElementById('select-public')}
    //           >
    //             <Option value="haichen">haichen</Option>
    //             <Option value="haichen1">haichen</Option>
    //             <Option value="haichen2">haichen</Option>
    //             <Option value="haichen3">haichen</Option>
    //           </Select>
    //         )
    //       }
    //     </FormItem>
    //   </div>
    //   <FormItem key="channelVals" label="渠道名称" {...FormItemLayout} hasFeedback>
    //     {
    //       getFieldDecorator('channel', {
    //         rules: [{
    //           required: true, message: '渠道名称不能为空'
    //         }],
    //         initialValue: 'haichen'
    //       })(
    //         <Input maxLength={20}  placeholder="请填写渠道名称"/>
    //       )
    //     }
    //   </FormItem>
    //
    // </Form>

    render(){
        const {visible, onCancel, onCreate, form, data, id, okText, title, openCourseId, getChannel, loading, hint, disableBtn, uploadPic, beforeUpload, img, userName, value, changeChannel, buildChannel, channelTxt, changeUserName, headText, nickText} = this.props;
        const { getFieldDecorator } = form;
        const FormItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 16},
        };
        const uploadButton = (
            <div>
                <Icon type={'plus'}/>
                <div className="ant-upload-text">上传</div>
            </div>
        );
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
                className="channel-model"
            >
                <div style={{marginLeft: '40px', display: id === 0 ? 'block': 'none'}} className="channel">
                    <span><span style={{color: 'red', marginRight: '2px'}}>*</span>渠道名称：</span>
                    <Input defaultValue={userName} value={value} id='channel-input' style={{width: '200px', marginLeft: '5px', marginRight: '10px'}} onChange={changeChannel} placeholder="营销号1"/>
                    <button id='get-channel' onClick={getChannel} style={{opacity: 0}}/>
                    <div style={{color: "rgb(245, 34, 45)", marginLeft: '80px'}}>{channelTxt}</div>
                </div>

                <div style={{display: id === 0 ? 'block': 'none'}}>
                    <div style={{marginTop: "20px", overflow: 'hidden'}}>
                        {/*style={{margin: '30px 0px 30px 90px'}}*/}
                        {/*<p style={{fontSize: '14px', marginBottom: '10px'}}>提示：</p>*/}
                        {/*<p>销售个人微信推广渠道建议以“营销号名称”做标识</p>*/}
                        {/*<p>销售个人qq推广渠道建议以“qq名称”做标识</p>*/}
                        {/*<p>问答平台推广渠道建议以“问答平台名称”做标识</p>*/}
                        {/*<p>搜索引擎推广渠道建议以“搜索平台引擎平台名称”做标识</p>*/}
                        {/*<p>微博推广渠道建议以“微博名称”做标识</p>*/}
                        {/*<p>自媒体推广渠道建议以“自媒体平台名称”做标识</p>*/}
                        {/*<p>短视频推广渠道建议以“短视频平台名称”做标识</p>*/}
                        {/*<p>论坛推广渠道建议以“论坛名称”做标识</p>*/}
                        <span style={{float: 'left', marginLeft: '26px', marginRight: '5px'}}><span style={{color: 'red', marginRight: '2px'}}>*</span>自定义头像：</span>
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            fileList={this.state.fileList}
                            customRequest={uploadPic}
                            beforeUpload={beforeUpload}
                        >
                            {img ? <img src={img} alt="noImg"/> : uploadButton}
                        </Upload>
                        <p style={{width: '150px', float: 'left', color: 'rgba(0, 0, 0, 0.65)', fontSize: '12px', fontWeight: '300', marginTop: '95px'}}>
                            提示：<br/>
                            上传成功后，此头像与昵称将用于海报信息展示。
                        </p>
                    </div>
                    <div style={{color: "rgb(245, 34, 45)", marginLeft: '122px', overflow: 'hidden'}}>{headText}</div>
                    <div style={{marginTop: "20px"}}>
                        <span style={{float: 'left', marginLeft: '68px', marginRight: '5px'}}><span style={{color: 'red', marginRight: '2px'}}>*</span>昵称：</span>
                        <Input defaultValue={userName} value={userName} id='user-input' placeholder="请输入昵称" style={{width: '200px'}} onChange={changeUserName}/>
                        <div style={{color: "rgb(245, 34, 45)", marginLeft: '122px'}}>{nickText}</div>
                    </div>
                    <div style={{textAlign: 'center', marginTop: '20px'}}>
                        <Button disabled={disableBtn} id='channel-btn' type="primary" onClick={buildChannel} className='have-value'>生成</Button>
                    </div>
                </div>
                <div className='channel-poster' style={{display: id !== 0 ? 'block': 'none'}}>
                    <p style={{display: id === 0 ? 'block': 'none', fontSize: '10px', marginLeft: '116px', marginTop: '5px'}}>已生成的海报和链接可以在[渠道推广]中下载和复制</p>
                    <div style={{overflow: 'hidden', marginTop: '20px'}}>
                        <div style={{
                            width: '180px',
                            height: '320px',
                            marginLeft: '40px',
                            marginRight: '30px',
                            float: 'left'
                        }}>
                            {/*<QRCode value={this.state.value === '' ? id : this.state.value} id="qrcode" size={180}/>*/}
                            <Spin size="large" style={{height: '320px', margin: "70px 60px", display: this.state.loading && id === 0 ? 'block' : 'none'}} />
                            <Spin size="large" style={{height: '320px', margin: "70px 60px", display: loading && id !== 0 ? 'block' : 'none'}} />
                            <p style={{height: '320px', marginTop: '50px', textAlign: 'center', display: id === 0 ? this.state.hint : hint}}>海报获取失败，关闭弹框后请重新获取</p>
                            <img style={{width: '180px'}}  id='qrcode' src={id === 0 ? this.state.img : id} alt=""/>
                        </div>
                        <p style={{marginLeft: '50px', marginTop: '40px', fontSize: '14px'}}>我的专属推广渠道海报和链接</p>
                        <p style={{marginLeft: '50px', marginTop: '-10px', fontSize: '14px'}}>微信扫描或打开后可报名和观看</p>
                        <p style={{marginLeft: '50px', color: '#3a8ee6', fontSize: '14px', cursor: 'pointer',  display:  id === 0 ? (this.state.loading ? 'none' : 'block') : (loading ? 'none' : 'block')}} onClick={this.downloadQrcode.bind(this, '二维码')}>下载海报</p>
                        <p style={{marginLeft: '50px', color: '#888', fontSize: '14px', display:  id === 0 ? (this.state.loading ? 'block' : 'none') : (loading ? 'block' : 'none')}}>下载海报</p>
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
                </div>
            </Modal>
        );
    }
}

const CollectionCreateForm = Form.create()(CustomizedForm);
export default CollectionCreateForm;
