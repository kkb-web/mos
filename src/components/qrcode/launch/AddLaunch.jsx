import React from 'react';
import './Launch.less';
import BreadcrumbCustom from '../../common/BreadcrumbCustom';
import {Upload, Form, Input,InputNumber,Modal, Icon, Button, Card, Select, Col, DatePicker, message, LocaleProvider} from 'antd';
import zh_CN from "antd/lib/locale-provider/zh_CN";
import QRCode from 'qrcode.react'
import moment from 'moment';

import {addLaunch,uoloadCertificate,getCertificate} from "../../../api/marketApi";
import {getSubjectList} from "../../../api/roleApi";
import {requestData} from "../../../utils/qiniu";
import {guid} from "../../../utils/utils"
import {openCourseUrl} from "../../../utils/filter"
import history from "../../common/History";

const FormItem = Form.Item;
const Option = Select.Option;
let rule = /^[0-9]*$/;


class Local extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uuId:guid(),
            //媒体列表页面获取
            mediaId:this.props.location.state.id,//this.props.location.state.id
            mediaName:this.props.location.state.name,//this.props.location.state.name
            //上传
            loading: false,
            img:null,
            fileLists:[],
            uploadImgFlag:true,
            uploadImgStatus:null,
            //付款截图key
            certificateKey:null,
            //选择学科
            subjectHint:null,
            subjectState:null,
            subjectVal:null,
            subjectList:[],
            //选择时间
            currentTime:null,
            timeState:null,
            timeHint:null,
            timeVal:null,
            //推广周期
            generalizeVal:3,
            generalizeHint:null,
            generalizeState:null,
            //投放价格
            priceVal:null,
            priceCheckState:null,
            priceCheckHint:null,
            //文章标题
            articleCheckHint: null,
            articleCheckState: null,
            //文章链接
            linkHint:null,
            linkState:null,
            //提交
            visible:false,
            //选择模板
            templateId:1,
            //获取付款定时器
            timer:null,
            btnFlag:true,
            certificate:null,
            disableBtn:false
        };
    };

    componentDidMount () {
        this.node.scrollIntoView();
        let input = document.querySelectorAll('input');
        for (let i = 0; i < input.length; i++) {
            input[i].autocomplete = "off"
        }
        //获取学科
        getSubjectList().then(res => {
            this.setState({
                subjectList: res.data.data
            })
        });
        // this.getCertificateFn();
        //轮训获取付款截图
        this.timer = setInterval(this.getCertificateFn,10000)
    };

    componentWillUnmount() {
        this.setState({
            timer:null
        })
    };
    //获取付款截图
    getCertificateFn =()=>{
        let sendData ={
            uuid:this.state.uuId
        };
        getCertificate(sendData).then(res => {
            if(res.data.code == 0){
              this.setState({
                  btnFlag:false,
                  img:'https://img.kaikeba.com/' + res.data.data
              })
            }

        });
    };
    //选择学科
    chooseSubject = (value) => {
        if (value) {
            this.setState({
                subjectVal: value,
                subjectState: 'success',
                subjectHint: ''
            })
        } else {
            this.setState({
                subjectVal: value,
                subjectState: 'error',
                subjectHint: '请选择学科'
            })
        }
    };
    //选择时间
    chooseData = (date, dateString)=>{
        if (dateString) {
            this.setState({
                timeVal:dateString,
                timeState: 'success',
                timeHint: ''
            })
        } else {
            this.setState({
                timeVal:dateString,
                timeState: 'error',
                timeHint: '请选择投放日期'
            })
        }
    };

    // 上传二维码格式检查
    beforeUploadImg = (file) => {
        if (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') {
            this.setState({
                uploadImgFlag: true,
                uploadImgStatus: 'success',
            })
        } else {
            this.setState({
                uploadImgFlag: false,
                uploadImgStatus: 'error',
                img: null
            });
        }
    };

    // 上传二维码图片
    uploadImg = (files) => {
        let fileReader = new FileReader(), // 图片上传，读图片
            file = files.file, // 获取到上传的对象
            _this = this;
        fileReader.onload = (function () {
            return function (ev) {
                _this.setState({
                    img: ev.target.result
                })
            }
        })(file);
        fileReader.readAsDataURL(file); // 读取完毕，显示到页面

        if(this.state.uploadImgFlag){
            requestData(file).then(res => {
                _this.setState({
                    certificateKey:res.data.key
                });
                let sendData = {
                    uuid: _this.state.uuId,
                    certificate:res.data.key
                };
                uoloadCertificate(sendData).then(resData=>{
                    if(resData.data.code == 0){
                        message.success('上传成功');
                    }
                })

            })
        }else{
            message.error('格式错误，请上传jpg/jpeg/png格式的图片')
        }

    };
    //点击上传
    clickUpload = () => {
        let input = document.querySelector('.qrimg-upload input')
        input.click()
    };
    //点击图片预览
    previewImg =()=>{
        window.open(''+this.state.img+'')
    };

    //文章标题
    articleCheck = (e)=> {
       if (e.target.value.length > 30) {
            this.setState({
                articleCheckHint: '文章标题少于30字',
                articleCheckState: 'error'
            })
        }else {
           this.setState({
               articleCheckHint: '',
               articleCheckState: 'success'
           })
       }
    };
    // 文章链接检查
    checkLink = (e) => {
        let reg = /^(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
        if(e.target.value == ''){
            this.setState({
                linkHint: '',
                linkState: 'success',
            })
        }else if (!reg.test(e.target.value)) {
            this.setState({
                linkHint: '请输入正确的文章链接',
                linkState: 'error',
            })
        }else {
            this.setState({
                linkHint: '',
                linkState: 'success',
            })
        }
    };
    //投放日期
    chooseGeneralize = (value)=>{
        if (!rule.test(value)) {
            this.setState({
                generalizeVal:value,
                generalizeState: 'error',
                generalizeHint: '请输入[1，365]的整数'
            })
        }else if (value >=1 && value <= 365) {
            this.setState({
                generalizeVal:value,
                generalizeState: 'success',
                generalizeHint:''
            })
        }else {
            this.setState({
                generalizeState: 'error',
                generalizeVal:value,
                generalizeHint:'推广周期范围在[1，365]'

            })
        }
    };
    //价格检查(0,1000,000]
    priceCheckFn = (value) =>{
        if (value > 0 && value <= 1000000 ) {
            this.setState({
                priceVal:value,
                priceCheckHint: '',
                priceCheckState: 'success'
            })
        }else {
            this.setState({
                priceVal:value,
                priceCheckHint: '投放价格范围在（0，1000,000]',
                priceCheckState: 'error'
            })
        }
    };

    //提交
    handleSubmit =()=>{
        let sendData = {};
        this.props.form.validateFieldsAndScroll((err, values) => {
            let timeVal = this.state.timeVal ? this.state.timeVal :values.timeVal;
            let startTime = Math.round(new Date(timeVal).getTime()/1000),
                time = null;
            if(Number(this.state.generalizeVal) >= 1 && Number(this.state.generalizeVal) < 365){
                time = 86400*parseInt(this.state.generalizeVal);
                this.setState({
                    generalizeState: 'success',
                    generalizeHint:''
                })
            }else{
                this.setState({
                    generalizeState: 'error',
                    generalizeVal:this.state.generalizeVal,
                    generalizeHint:'推广周期范围在[1，365]'

                })
            };

            sendData = {
                uuid:this.state.uuId,
                mediaId:this.state.mediaId,
                subjectId:this.state.subjectVal,
                startTime:startTime,
                endTime:startTime + time,
                price:this.state.priceVal,
                templateId:this.state.templateId,
                title:values.title ? values.title :null,
                link:values.link ? values.link :null,
            };
            //学科不可为空
            if(!this.state.subjectVal){
                this.setState({
                    subjectHint: '学科不可为空',
                    subjectState: 'error'
                })
            };
            if(!startTime){
                this.setState({
                    timeHint: '投放日期不可为空',
                    timeState: 'error'
                })
            };
            if(Number(values.generalizeVal)<0){
                this.setState({
                    generalizeHint: '推广周期范围在[1，365]',
                    generalizeState: 'error'
                })
            };
            if(!this.state.priceVal){
                this.setState({
                    priceCheckHint: '投放价格不可为空',
                    priceCheckState: 'error'
                })
            };

            let _this = this;
            console.log(222,sendData)
            if(sendData.subjectId != null &&  !isNaN(sendData.startTime)
                && !isNaN(sendData.endTime) &&
                (Number(this.state.priceVal) > 0 && Number(this.state.priceVal) <= 1000000)&&
                (Number(this.state.generalizeVal) >= 1
                    && Number(this.state.generalizeVal) <= 365
                    && rule.test(this.state.generalizeVal))
                && this.state.linkState !='error'){
                console.log(1111,sendData);
                this.setState({
                    disableBtn: true
                });
                addLaunch(sendData).then(res => {
                    if (res.data.code === 0) {
                        this.setState({
                            disableBtn: false
                        });
                        let pushHistoryData = {adId: res.data.data,id: _this.state.mediaId, name: _this.state.mediaName};
                        message.success('提交成功');
                        history.push({pathname: '/app/qrcode/mediachannel', state: pushHistoryData});
                    } else {
                        message.error(res.data.msg)
                    }
                }).catch(err => {
                    this.setState({
                        load: 'none'
                    });
                })
            }

        })

    };
    // 取消弹出model
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    // 确认取消
    handleOk = () => {
        this.setState({
            visible: false,
        });
        this.props.form.resetFields();
        history.push('/app/qrcode/media');
    };
    // 取消弹出model中取消
    handleTipCancel = () => {
        this.setState({
            visible: false,
        });
    };

    // 取消
    handleCancel = () => {
        let fieldsvalue = this.props.form.getFieldsValue();
        // 将JSON数据的key值存为一个数组，便于获取对象fieldsvalue的长度
        let arr = Object.keys(fieldsvalue);
        // 设置一个计数器，用来记录控件值为空的个数
        let count = 1;
        // 遍历表单中所有控件的值
        for (let i in fieldsvalue){
            count++;
            // 如果控件的值不为空，则显示提示框
            if(fieldsvalue[i]){
                this.showModal();
                break;
            }else if(count>arr.length) {      // 当遍历完所有的控件都为空时，返回上一级菜单
                history.push("/app/qrcode/media")
            }
        }
    };
    //选中模板
    checkTemplate =(id)=>{
        this.setState({
            templateId :id,
        })
    };

    // datePicker禁止选择最后日期
    handleEndOpenChange = (open) => {
        this.setState({currentTime:Number(moment().valueOf()-8640000) });
    };

    // datePicker禁止选择日期
    disabledEndDate = (endValue) => {
        const startValue = this.state.currentTime;

        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    };


    render() {
        const {getFieldDecorator} = this.props.form;
        const FormItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19},
        };
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'}/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const menus = [
            {
                path: '/app/dashboard/analysis',
                name: '首页'
            },
            {
                path: '/app/qrcode/launch',
                name: '投放列表'
            },
            {
                name: '新建媒体投放',
                path: '#'
            }
        ];
        return (
            <div ref={node => this.node = node}>
                <div className="page-nav">
                    <BreadcrumbCustom paths={menus}/>
                    <p className="title-style">新建媒体投放</p>
                </div>
                {/*基本信息*/}
                <Card title="基本信息" style={{ marginBottom: 24 }} bordered={false}>
                    <Form layout="horizontal" style={{paddingBottom: '20px'}}>
                        <FormItem className="qrcode-form" label="媒体名称"  {...FormItemLayout} hasFeedback>
                            <span>{this.state.mediaName}</span>
                        </FormItem>
                        <FormItem className="open-course-form" label="学科" validateStatus={this.state.subjectState}
                                  help={this.state.subjectHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('subjectVal', {
                                rules: [{required: true, message: '请选择学科'}],
                            })(
                                <div className='subject-list' style={{display: 'inline'}}>
                                    <Select
                                        style={{ width: '300px'}}
                                        placeholder="请选择所属学科"
                                        getPopupContainer={() => document.querySelector('.subject-list')}
                                        onChange={this.chooseSubject}
                                    >
                                        {/*{this.state.subjectList.map((value, index) => {*/}
                                            {/*return (<Option key={parseInt(value.subjectId)} value={parseInt(value.subjectId)}>{value.subjectName}</Option>)*/}
                                        {/*})}*/}
                                        {
                                            this.state.subjectList && this.state.subjectList.map((value) => {
                                                return (<Option key={value.id} value={value.id}>{value.name}</Option>)
                                            })
                                        }
                                    </Select>
                                </div>
                            )}
                        </FormItem>
                        <div id="selectTime">
                            <FormItem className="open-course-form" label="投放日期" validateStatus={this.state.timeState}
                                      help={this.state.timeHint}{...FormItemLayout} hasFeedback>
                                <LocaleProvider locale={zh_CN}>
                                    {getFieldDecorator('timeVal', {
                                        rules: [{required: true, message: '投放日期不能为空'}],
                                    })(
                                        <DatePicker style={{width: '300px'}}
                                                    disabledDate={this.disabledEndDate}
                                                    onOpenChange={this.handleEndOpenChange}
                                                    className="date-picker"
                                                    onChange={this.chooseData}
                                                    getCalendarContainer={() => document.getElementById('selectTime')}/>
                                    )}
                                </LocaleProvider>
                            </FormItem>
                        </div>
                        <FormItem className="qrcode-form" label="推广统计周期" validateStatus={this.state.generalizeState}
                                  help={this.state.generalizeHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('generalizeVal', {
                                rules: [{required: true, message: '推广统计周期不能为空'}],
                                initialValue:3
                            })(
                                <InputNumber style={{width:'120px',marginRight:'6px'}} onChange={this.chooseGeneralize}/>
                            )}
                            <span>天</span>
                            <span className="tip-text">此数据用于计算本次投放带来的vip课程成单量</span>

                        </FormItem>
                        <FormItem className="qrcode-form" label="投放价格" validateStatus={this.state.priceCheckState}
                                  help={this.state.priceCheckHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('priceVal', {
                                rules: [{required: true, message: '投放价格不能为空'}],
                            })(
                                <InputNumber onChange={this.priceCheckFn} style={{width:'120px',marginRight:'6px'}}/>
                            )}
                            <span>元</span>
                            <span className="tip-text">投放价格在新建后不可更改，请谨慎填写</span>
                        </FormItem>

                        <FormItem className="qrcode-form" label="付款截图" {...FormItemLayout}>
                            <div className="qrcode-photo">
                                {getFieldDecorator('qrcode', {
                                    rules: [{required: false, message: ''}],
                                })(
                                    <div className="qrimg-upload">
                                        <Col span={5}>
                                            <p>方式一：微信端上传</p>
                                            <div>
                                                <QRCode value={openCourseUrl() + '/upload/'+this.state.uuId}
                                                        id="qrcode" size={150}/>
                                            </div>
                                            <p>扫描二维码上传付款截图</p>
                                        </Col>
                                        <Col span={5}>
                                            <p>方式二：PC端上传</p>
                                            <Upload
                                                name="avatar"
                                                listType="picture-card"
                                                className="avatar-uploader"
                                                fileList={this.state.fileLists}
                                                customRequest={this.uploadImg}
                                                beforeUpload={this.beforeUploadImg}
                                            >
                                                {this.state.img ? <img src={this.state.img} alt="noImg"/> : uploadButton}
                                            </Upload>
                                            <div style={{marginTop: '10px'}}>
                                                <Button type="default" style={{width: '100px', textAlign: 'center'}}
                                                        onClick={this.clickUpload}>上传</Button>
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <p style={{width:'100px',height:'196px'}}></p>
                                            <Button type="primary" style={{width: '60px', textAlign: 'center',height:'26px'}}
                                                    disabled={this.state.btnFlag}  onClick={this.previewImg}>预览</Button>
                                            <p style={{color:'#ccc',fontSize:'12px',marginTop:'-12px',
                                                marginLeft:'-34px',fontWeight:'100'}}>点击按钮可预览付款大图</p>
                                        </Col>
                                    </div>
                                )}
                            </div>
                        </FormItem>
                    </Form>
                </Card>
                {/*二维码中转页样式模板*/}
                <Card title="二维码中转页样式模板" style={{ marginBottom: 24 }} bordered={false}>
                    <div className="clearfix">
                        <div className="f-left template-warp">
                            <p>通用模板1</p>
                            <div className="template-img" onClick={this.checkTemplate.bind(this,1)}>
                                <img src="https://img.kaikeba.com/crm_template_1_new1.jpg" alt="模板"/>
                                <p className="mask-tempalte" style={{display: this.state.templateId==1 ? 'block' : 'none'}}>
                                    <Icon type="check" className="check-icon"/>
                                </p>
                            </div>
                        </div>
                        <div className="f-left template-warp">
                            <p>通用模版2</p>
                            <div className="template-img" onClick={this.checkTemplate.bind(this,5)}>
                                <img src="https://img.kaikeba.com/crm_template_2_new1.png" alt="模板"/>
                                <p className="mask-tempalte" style={{display: this.state.templateId==5 ? 'block' : 'none'}}>
                                    <Icon type="check" className="check-icon"/>
                                </p>
                            </div>
                        </div>
                        <div className="f-left template-warp">
                            <p>资料赠送模板</p>
                            <div className="template-img" onClick={this.checkTemplate.bind(this,2)}>
                                <img src="https://img.kaikeba.com/crm_template_2.jpg" alt="模板"/>
                                <p className="mask-tempalte" style={{display: this.state.templateId==2 ? 'block' : 'none'}}>
                                    <Icon type="check" className="check-icon"/>
                                </p>
                            </div>
                        </div>
                        <div className="f-left template-warp">
                            <p>公开课模板</p>
                            <div className="template-img" onClick={this.checkTemplate.bind(this,3)}>
                                <img src="https://img.kaikeba.com/crm_template_3_copy.jpg" alt="模板"/>
                                <p className="mask-tempalte" style={{display: this.state.templateId==3 ? 'block' : 'none'}}>
                                    <Icon type="check" className="check-icon"/>
                                </p>
                            </div>
                        </div>
                        <div className="f-left template-warp">
                            <p>添加社群模板</p>
                            <div className="template-img" onClick={this.checkTemplate.bind(this,4)}>
                                <img src="https://img.kaikeba.com/page_d.png" alt="模板"/>
                                <p className="mask-tempalte" style={{display: this.state.templateId==4 ? 'block' : 'none'}}>
                                    <Icon type="check" className="check-icon"/>
                                </p>
                            </div>
                        </div>

                        {/*<div className="f-left template-warp">*/}
                            {/*<p className="more-template">更多模板，敬请期待...</p>*/}
                        {/*</div>*/}
                    </div>
                </Card>
                {/*投放文章信息*/}
                <Card title="投放文章信息" bordered={false} style={{ marginBottom: 24 }}>
                    <Form layout="horizontal" style={{paddingBottom: '20px'}}>
                        <FormItem className="qrcode-form" label="文章标题"  {...FormItemLayout} hasFeedback
                                  validateStatus={this.state.articleCheckState}
                                  help={this.state.articleCheckHint}>
                            {getFieldDecorator('title', {
                                rules: [{required: false, message: ''}],
                            })(
                                <Input placeholder="建议30字以内" onChange={this.articleCheck} style={{ width: 300}}/>
                            )}
                        </FormItem>
                        <FormItem className="qrcode-form" label="文章链接" {...FormItemLayout} hasFeedback
                                  validateStatus={this.state.linkState}
                                  help={this.state.linkHint} >
                            {getFieldDecorator('link', {
                                rules: [{required: false, message: ''}],
                            })(
                                <Input  style={{ width: 300}} onChange={this.checkLink}/>
                            )}
                        </FormItem>
                    </Form>
                </Card>
                {/*提交*/}
                <div className="upload-title bottom-btn">
                    <Button type="default" style={{marginRight: '20px'}} onClick={this.handleCancel}>取消</Button>
                    <Modal
                        title="提示"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleTipCancel}
                        okText="确定"
                        cancelText="取消"
                    >
                        <p>表单中仍有内容，是否确认取消？</p>
                    </Modal>
                    <Button type="primary" onClick={this.handleSubmit} disabled={this.state.disableBtn}>提交</Button>
                </div>
            </div>
        );
    }

}

const CollectionCreateForm = Form.create()(Local);
export default CollectionCreateForm;
