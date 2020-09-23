import React from 'react';
import {Input, Modal, Form, Button} from 'antd';
import {editMedia, getMediaDetails} from '../../../api/marketApi'
import {emojiRule} from '../../../utils/filter'

let mediaId;
const FormItem = Form.Item;
class editmedia extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editMediaName:'',
            editMedianickName:'',
            editMediaWechat:'',
            mediaDetails:'',
            editMediaNameState:'',
            editMediaNameHint:'',
            editNickNameState:'',
            editNickNameHint:'',
            editWechatState:'',
            editWechatHint:'',
            disableBtn: false
        };
    }
    componentDidMount(){
        this.props.onRef(this);
    };

    //媒体详情
    setformdata(key){
        this.setState({
            editMediaNameState:'success',
            editMediaNameHint:''
        });
        let applyData = {
            id: key
        };
        getMediaDetails(applyData).then(res=>{
            if(res.data.code == 0){
                this.setState({
                    mediaDetails:res.data.data,
                },()=>{
                    mediaId = key;
                });
                if(res.data.data.contactName){
                    this.setState({
                        editNickNameState:'success'
                    })
                };
                if(res.data.data.contactName){
                    this.setState({
                        editWechatState:'success'
                    })
                }
                this.props.form.setFieldsValue({
                    editMediaName: res.data.data.name,
                    editMedianickName: res.data.data.contactName,
                    editMediaWechat:res.data.data.contactWechat
                });

            }
        }).catch(err=>{
            console.log(err);
        });
    }
    //点击弹层的x号
    handleCancel =() =>{
        this.props.handleCance();
        this.setState({
            editMediaNameState:'',
            editMediaNameHint:'',
            editNickNameState:'',
            editNickNameHint:'',
            editWechatState:'',
            editWechatHint:''
        })
    };
    //弹层确认编辑
    handleOkedit = (e)=>{
        e.preventDefault();
        let that = this;
        let applyData= {};
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                applyData.id = mediaId;
                applyData.name = values.editMediaName;
                applyData.contactName = values.editMedianickName;
                applyData.contactWechat = values.editMediaWechat;
                if(values.editMedianickName == undefined || values.editMedianickName == ""){
                    applyData.contactName = null;
                }
                if(values.editMediaWechat == undefined || values.editMediaWechat == ""){
                    applyData.contactWechat = null;
                }
                if(applyData.contactName !== null && applyData.contactName.length>0){
                    applyData.contactName = values.editMedianickName.replace(/\s+/g,"");
                }
                if(applyData.contactWechat !== null && applyData.contactWechat.length>0){
                    applyData.contactWechat = values.editMediaWechat.replace(/\s+/g,"");
                }
                that.setState({
                    disableBtn: true
                });
                editMedia(applyData).then(res =>{
                    that.setState({
                        disableBtn: false
                    });
                    if(res.data.code == 0){
                        this.handleCancel()
                        this.props.getMediaInfo()
                    }else if (res.data.code == 10002){
                        this.setState({
                            editMediaNameState:'error',
                            editMediaNameHint:'该媒体名称已存在'
                        })
                    }
                }).catch(err=>{
                    console.log(err)
                })
            }
        });
    };
    //验证媒体名称
    nameCheck = (e) =>{
        if(e.target.value ==''){
            this.setState({
                editMediaNameState:'error',
                editMediaNameHint:'媒体名称不能为空'
            })
        } else if (!(e.target.value.indexOf(" ") === -1)) {
            this.setState({
                editMediaNameState: 'error',
                editMediaNameHint: '禁止输入空格'
            })
        }else if(emojiRule().test(e.target.value)){
            this.setState({
                editMediaNameState: 'error',
                editMediaNameHint: '禁止输入表情'
            })
        }else if(e.target.value.length>30){
            this.setState({
                editMediaNameState: 'error',
                editMediaNameHint: '媒体名称少于30字'
            })
        }else {
            this.setState({
                editMediaNameState:'success',
                editMediaNameHint:''
            })
        }
    };
    //联系人昵称验证
    editMedianickNameCheck =(e) =>{
        if(e.target.value ==''){
            this.setState({
                editNickNameState:'',
                editNickNameHint:''
            })
        } else if (!(e.target.value.indexOf(" ") === -1)) {
            this.setState({
                editNickNameState: 'error',
                editNickNameHint: '禁止输入空格'
            })
        }else if(emojiRule().test(e.target.value)){
            this.setState({
                editNickNameState: 'error',
                editNickNameHint: '禁止输入表情'
            })
        }else if(e.target.value.length>20){
            this.setState({
                editNickNameState: 'error',
                editNickNameHint: '联系人姓名/昵称少于20字'
            })
        }else {
            this.setState({
                editNickNameState:'success',
                editNickNameHint:''
            })
        }
    };
    //微信号验证
    editMediaWechatCheck = (e) =>{
        if(e.target.value ==''){
            this.setState({
                editWechatState:'',
                editWechatHint:''
            })
        } else if (!(e.target.value.indexOf(" ") === -1)) {
            this.setState({
                editWechatState: 'error',
                editWechatHint: '禁止输入空格'
            })
        }else if(emojiRule().test(e.target.value)){
            this.setState({
                editWechatState: 'error',
                editWechatHint: '禁止输入表情'
            })
        }else if(e.target.value.length>20){
            this.setState({
                editWechatState: 'error',
                editWechatHint: '联系人微信少于20字'
            })
        }else {
            this.setState({
                editWechatState:'success',
                editWechatHint:''
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
            <div className='media-model-edit'>
                <Modal
                    title={[
                        <h4 style={{marginBottom:'0'}} key='media-title-edit'>编辑媒体</h4>
                    ]}
                    visible={showstate}
                    onCancel={this.handleCancel}
                    okText="确定"
                    cancelText="取消"
                    className="media-models-edit"
                    onOk={this.handleOkedit}
                    destroyOnClose='true'
                    footer={[
                        <Button key="cancel" type="default" onClick={this.handleCancel}>
                            取消
                        </Button>,
                        <Button key="submit" type="primary" disabled={this.state.disableBtn} onClick={this.handleOkedit}>
                            确定
                        </Button>
                    ]}
                >
                    <Form layout="horizontal">
                        <FormItem className="media-model-code" label="媒体名称"
                                  validateStatus={this.state.editMediaNameState}
                                  help={this.state.editMediaNameHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('editMediaName', {
                                rules: [{required: true, message: '媒体名称不能为空'}],
                            })(
                                <Input placeholder="请输入媒体名称" onChange={this.nameCheck}/>
                            )}
                        </FormItem>
                        <FormItem className="media-model-code" label="联系人姓名/昵称"
                                  validateStatus={this.state.editNickNameState}
                                  help={this.state.editNickNameHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('editMedianickName', {
                                rules: [{required: false, message: '联系人姓名/昵称不能为空'}],
                            })(
                                <Input placeholder="联系人的真实姓名或微信昵称" onChange={this.editMedianickNameCheck}/>
                            )}
                        </FormItem>
                        <FormItem className="media-model-code" label="联系人微信"
                                  validateStatus={this.state.editWechatState}
                                  help={this.state.editWechatHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('editMediaWechat', {
                                rules: [{required: false, message: '联系人微信不能为空'}],
                            })(
                                <Input placeholder="联系人微信号" onChange={this.editMediaWechatCheck}/>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}
const editmediaPage = Form.create()(editmedia);
export default editmediaPage;