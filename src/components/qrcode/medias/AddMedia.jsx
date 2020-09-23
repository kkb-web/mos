import React from 'react';
import {Input, Modal, Form, Button} from 'antd';
import {addMedia} from '../../../api/marketApi'
import {emojiRule} from '../../../utils/filter'

const FormItem = Form.Item;
class addmedia extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mediaName: '',
            medianickName: '',
            mediawechat: '',
            mediaNameState:'',
            mediaNameHint:'',
            nickNameState:'',
            nickNameHint:'',
            wechatState:'',
            wechatHint:'',
            loading: false,
            disableBtn: false
        };
    }
    componentDidMount(){

    };
    //点击弹层的x号
    handleCancel =() =>{
        this.props.handleCance();
        this.setState({
            mediaNameState:'',
            mediaNameHint:'',
            nickNameState:'',
            nickNameHint:'',
            wechatState:'',
            wechatHint:'',
        })
    };
    handleOkAdd = (e)=>{
        e.preventDefault();
        let that = this;
        let applyData= {};
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                applyData.name = values.mediaName.replace(/\s+/g,"");
                applyData.contactName = values.medianickName;
                applyData.contactWechat = values.mediawechat;
                if(values.medianickName == undefined || values.medianickName == ""){
                    applyData.contactName = null;
                }
                if(values.mediawechat == undefined || values.mediawechat == ""){
                    applyData.contactWechat = null;
                }
                if(applyData.contactName !== null && applyData.contactName.length>0){
                    applyData.contactName = values.medianickName.replace(/\s+/g,"");
                }
                if(applyData.contactWechat !== null && applyData.contactWechat.length>0){
                    applyData.contactWechat = values.mediawechat.replace(/\s+/g,"");
                }
                that.setState({
                    disableBtn: true
                });
                addMedia(applyData).then(res =>{
                    that.setState({
                        disableBtn: false
                    });
                    if(res.data.code == 0){
                        that.props.getMediaInfo()
                        that.handleCancel()
                    }else if (res.data.code == 10002){
                        this.setState({
                            mediaNameState:'error',
                            mediaNameHint:'该媒体名称已存在'
                        })
                    }
                }).catch(err=>{
                    console.log(err)
                })
            }else {
                this.setState({
                    mediaNameState:'error',
                    mediaNameHint:'媒体名称不能为空'
                })
            }
        });
        // message.loading('正在提交中...', 5);
        // message.destroy()
    };

    //验证媒体名称
    nameCheck = (e) =>{
        console.log(e.target.value)
        if(e.target.value ==''){
            this.setState({
                mediaNameState:'error',
                mediaNameHint:'媒体名称不能为空'
            })
        } else if (!(e.target.value.indexOf(" ") === -1)) {
            this.setState({
                mediaNameState: 'error',
                mediaNameHint: '禁止输入空格'
            })
        }else if(emojiRule().test(e.target.value)){
            this.setState({
                mediaNameState: 'error',
                mediaNameHint: '禁止输入表情'
            })
        }else if(e.target.value.length>30){
            this.setState({
                mediaNameState: 'error',
                mediaNameHint: '媒体名称少于30字'
            })
        }else {
            this.setState({
                mediaNameState:'success',
                mediaNameHint:''
            })
        }
    };
    //联系人昵称验证
    medianickNameCheck = (e)=>{
        console.log(e.target.value)
        if(e.target.value ==''){
            this.setState({
                nickNameState:'',
                nickNameHint:''
            })
        } else if (!(e.target.value.indexOf(" ") === -1)) {
            this.setState({
                nickNameState: 'error',
                nickNameHint: '禁止输入空格'
            })
        }else if(emojiRule().test(e.target.value)){
            this.setState({
                nickNameState: 'error',
                nickNameHint: '禁止输入表情'
            })
        }else if(e.target.value.length>20){
            this.setState({
                nickNameState: 'error',
                nickNameHint: '联系人姓名/昵称少于20字'
            })
        }else {
            this.setState({
                nickNameState:'success',
                nickNameHint:''
            })
        }
    };
    //微信号验证
    mediawechatCheck = (e)=>{
        if(e.target.value ==''){
            this.setState({
                wechatState:'',
                wechatHint:''
            })
        } else if (!(e.target.value.indexOf(" ") === -1)) {
            this.setState({
                wechatState: 'error',
                wechatHint: '禁止输入空格'
            })
        }else if(emojiRule().test(e.target.value)){
            this.setState({
                wechatState: 'error',
                wechatHint: '禁止输入表情'
            })
        }else if(e.target.value.length>20){
            this.setState({
                wechatState: 'error',
                wechatHint: '联系人微信少于20字'
            })
        }else {
            this.setState({
                wechatState:'success',
                wechatHint:''
            })
        }
    };

    render() {
        const {getFieldDecorator} = this.props.form,
            FormItemLayout = {
                labelCol: {span: 7},
                wrapperCol: {span: 14},
            };
        const showstate = this.props.showstate;
        return (
            <div className='media-model-add'>
                <Modal
                    title={[
                        <h4 style={{marginBottom:'0'}} key='media-title'>新建媒体</h4>
                    ]}
                    visible={showstate}
                    onCancel={this.handleCancel}
                    okText="确定"
                    className="media-models"
                    onOk={this.handleOkAdd}
                    destroyOnClose='true'
                    loading={this.state.loading}
                    footer={[
                        <Button key="cancel" type="default" onClick={this.handleCancel}>
                            取消
                        </Button>,
                        <Button key="submit" type="primary" disabled={this.state.disableBtn} onClick={this.handleOkAdd}>
                            确定
                        </Button>
                    ]}
                >
                    <Form layout="horizontal">
                        <FormItem className="media-model-code" label="媒体名称"
                                  validateStatus={this.state.mediaNameState}
                                  help={this.state.mediaNameHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('mediaName', {
                                rules: [{required: true, message: '媒体名称不能为空'}],
                            })(
                                <Input placeholder="请输入媒体名称" onChange={this.nameCheck}/>
                            )}
                        </FormItem>
                        <FormItem className="media-model-code" label="联系人姓名/昵称"
                                  validateStatus={this.state.nickNameState}
                                  help={this.state.nickNameHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('medianickName', {
                                rules: [{required: false, message: '联系人姓名/昵称不能为空'}],
                            })(
                                <Input placeholder="联系人的真实姓名或微信昵称" onChange={this.medianickNameCheck}/>
                            )}
                        </FormItem>
                        <FormItem className="media-model-code" label="联系人微信"
                                  validateStatus={this.state.wechatState}
                                  help={this.state.wechatHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('mediawechat', {
                                rules: [{required: false, message: '联系人微信不能为空'}],
                            })(
                                <Input placeholder="联系人微信号" onChange={this.mediawechatCheck}/>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }

}
const addmediaPage = Form.create()(addmedia);
export default addmediaPage;