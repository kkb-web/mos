/**
 * Created by edz on 2018/10/25.
 */
/**
 * Created by edz on 2018/10/23.
 */
import React from 'react'
import {Card, Modal, Upload, Select, Form, InputNumber, Input, Button, Icon, message, Tooltip} from 'antd';
import {requestData} from "../../../../utils/qiniu";
import {urlSubjectList, setformdataMarket, deletMarket, urlCheckWechat} from '../../../../api/deviceApi'

const FormItem = Form.Item;
const Option = Select.Option;
let selectvalue = '';
let inputNumvalue ='';
let keylist = [];


class ListMart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            urlSubjectLists: [],
            shareThumbnails: [],
            imageUrl: '',
            indexcount:this.props.indexs,
            issuccess:false,
            nowImg:'',
            selectFlag:''  //select开关
        }
    }

    componentDidMount() {
        this.props.onRef(this);
        this.fnurlSubjectList();
        // this.editselects()
        this.setState({
            nowImg:this.props.data.qrCode
        })
    }
    myName = () => {
        return keylist
    };

    //学科列表
    fnurlSubjectList = () => {
        urlSubjectList().then(res => {
            this.setState({
                urlSubjectLists: res.data.data
            })
        }).catch(err => {

        })
    }
    //解析学科列表，传入学科id，返回学科name
    subjectJson = (id) => {
        const data = this.state.urlSubjectLists;
        for (var i = 0; i < data.length; i++) {
            if (data[i].id === id) {
                // return data[i].name
                return data[i].name ? data[i].name : null
            }
        }
    }
    //上传微信二维码图片
    uploadPic = (files) => {
        let fileReader = new FileReader(); // 图片上传，读图片
        let file = files.file; // 获取到上传的对象
        let _this = this;
        fileReader.onload = (function (file) {
            return function (ev) {
                _this.setState({
                    imageUrl: ev.target.result
                })
            }
        })(file);
        fileReader.readAsDataURL(file); // 读取完毕，显示到页面
        if (this.state.uploadThumbnail) {
            requestData(file).then(res => {
                let counts = this.state.indexcount;
                let obj = [counts,res.data.key];
                _this.setState({
                    thumbnailStatus: 'success',
                });
                this.setState({
                    nowImg:res.data.key
                },function () {
                    keylist = obj
                });
                this.props.setRead()
            }).catch(err =>{
                _this.setState({
                    thumbnailStatus: 'error',
                })
            })
        } else {
            message.error('格式错误，请上传jpg/jpeg/png格式的图片')
        }
    };
    //select获取焦点
    selectOnfocus = () =>{
        if(this.state.indexcount == 1){
            this.setState({
                selectFlag:'true'
            })
        }
    }
    //select
    selectChange = (val) => {
        if(this.state.indexcount == 1){
           let inputval = this.props.forad.getFieldValue('num99991');
            if(inputval =='' || inputval == undefined){
                inputNumvalue = ''
            }else {
                inputNumvalue = inputval
            }
        }
        selectvalue = val;
        if (val == '' || val == undefined){
            this.setState({
                subjectState:'error',
                subjectHint:'学科不能为空!'
            })
        }else {
            if(inputNumvalue == undefined || inputNumvalue == ''){
                console.log("不做操作")
            }else {
                let subjectdata = {
                    number: inputNumvalue,
                    subjectId: val
                }
                urlCheckWechat(subjectdata).then(res => {
                    if (res.data.data) {
                        this.setState({
                            wxNumberstate: 'error',
                            wxNumberHite: '微信编号不可重复，请重新输入!',
                            subjectState:'success',
                            subjectHint:''
                        })
                    } else {
                        this.setState({
                            wxNumberstate: 'success',
                            wxNumberHite: '',
                            subjectState:'success',
                            subjectHint:''
                        })
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        }

    };
    //微信号
    inputNum = (val)=>{
        console.log(this.props.forad.getFieldValue('subjectId99991'));
        inputNumvalue = val;
        let selvalueobj = this.props.data.subjectId;
        let selvalue = selvalueobj || selectvalue;
        let selectresult = '';
        const data = this.state.urlSubjectLists;
        for(let i=0;i<data.length;i++){
            if(data[i].name == selvalue){
                selectresult = data[i].id
            }else {
                selectresult = selvalue
            }
        }
        if(selectresult == undefined || selectresult == ''){
            console.log("不操作")
        }else {
            if(val == '' || val == undefined ){
                this.setState({
                    wxNumberstate: 'error',
                    wxNumberHite: '微信编号不能为空!',
                })
            }else {
                if (this.state.indexcount == 1){
                    if(this.state.selectFlag){
                        let subjectdata = {
                            number: val,
                            subjectId: selvalue
                        }
                        urlCheckWechat(subjectdata).then(res => {
                            if (res.data.data) {
                                this.setState({
                                    wxNumberstate: 'error',
                                    wxNumberHite: '微信编号不可重复，请重新输入!',
                                    subjectState:'success',
                                    subjectHint:''
                                })
                            } else {
                                this.setState({
                                    wxNumberstate: 'success',
                                    wxNumberHite: '',
                                    subjectState:'success',
                                    subjectHint:''
                                })
                            }
                        }).catch(err => {
                            console.log(err)
                        })
                    }
                }else {
                    let subjectdata = {
                        number: val,
                        subjectId: selvalue
                    }
                    urlCheckWechat(subjectdata).then(res => {
                        if (res.data.data) {
                            this.setState({
                                wxNumberstate: 'error',
                                wxNumberHite: '微信编号不可重复，请重新输入!',
                                subjectState:'success',
                                subjectHint:''
                            })
                        } else {
                            this.setState({
                                wxNumberstate: 'success',
                                wxNumberHite: '',
                                subjectState:'success',
                                subjectHint:''
                            })
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                }
            }
        }


    }
    上传微信二维码图片验证
    beforeUploadThumbnail = (file) => {
        if (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') {
            this.setState({
                uploadThumbnail: true
            });
        } else {
            this.setState({
                uploadThumbnail: false,
                thumbnailStatus: 'error',
                img: null
            });
        }
    };
    clickOneUpload = () => {
        let classt ='.thumbnai-pic' + this.props.data.id +  " " +  'input';
        let inputUpload = document.querySelector(classt)
        inputUpload.click()
    };

    inputNumbers = (e)=>{
        if(e.target.value ==''){
            this.setState({
                wxNumberstate: 'error',
                wxNumberHite: '微信编号不能为空!',
            })
        }
    }
    //删除
    clickHandler = () => {
        this.props.clickHandler()
    }

    render() {
        const {getFieldDecorator} = this.props.forad;
        const FormItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 16},
        };
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'}/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const aa='form-item thumbnai-pic';
        const clasone = 'form-item';
        const classtwo ='thumbnai-pic' + this.props.data.id;
        const item = this.props.data;
        const qrdata = this.props.qrdatas
        return (
            <div className="add-binding-box">
                <div style={{cursor: 'pointer', position: 'absolute', top: '10px', right: '10px',}}
                     onClick={this.clickHandler}>
                    <Tooltip title={item.id > 980 ? "删除营销号" : "取消绑定"}>
                        <Icon type="close" theme="outlined"/>
                    </Tooltip>
                </div>
                <div id="subject">
                <FormItem className="add-binding-box-form first" label="学科"
                          validateStatus={this.state.subjectState}
                          help={this.state.subjectHint} {...FormItemLayout}>
                    {getFieldDecorator('subjectId' + item.id, {
                            rules: [{
                                required: true,
                                type: 'string',
                                message: '学科不能为空'
                            }], initialValue: this.subjectJson(item.subjectId)
                        }
                    )(
                        <Select
                            id="SET"
                            onFocus={this.selectOnfocus}
                            onBlur={this.selectBlur}
                            onChange={this.selectChange}
                            placeholder="选择所属学科"
                            getPopupContainer={() => document.getElementById('subject')}
                        >
                            {this.state.urlSubjectLists && this.state.urlSubjectLists.map(d => <Option id="select"
                                                                         key={d.id}>{d.name}</Option>)}
                        </Select>
                    )}
                </FormItem>
                </div>
                <FormItem className="add-binding-box-form" label="微信编号"
                          validateStatus={this.state.wxNumberstate}
                          help={this.state.wxNumberHite} {...FormItemLayout} hasFeedback>
                    {getFieldDecorator('num' + item.id, {
                        rules: [{required: true, message: '微信编号不能为空'}],
                        initialValue: item.num
                    })(
                        <InputNumber min={0} max={10000} onChange={this.inputNum} onFocus={this.inputNumbersFous}
                                     onBlur={this.inputNumbers}/>
                    )}
                </FormItem>
                <FormItem className="add-binding-box-form" label="微信号"
                          validateStatus={this.state.wxchatState}
                          help={this.state.wxchatHint} {...FormItemLayout} hasFeedback>
                    {getFieldDecorator('wechat' + item.id, {
                        rules: [{required: true, message: '微信号不能为空'}],
                        initialValue: item.wechat
                    })(
                        <Input onChange={this.wechatCheck} placeholder="对应的微信号"/>
                    )}
                </FormItem>
                <FormItem id="device_inputs" className="open-course-form" label="微信二维码图片"
                          validateStatus={this.state.thumbnailStatus} {...FormItemLayout} hasFeedback>
                    {getFieldDecorator('qrCode' + item.id, {
                        rules: [{required: true, message: '请上传缩略图'}],
                        initialValue: item.qrCode
                    })(
                        <div className={clasone + " " + classtwo }>
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                fileList={this.state.fileLists}
                                customRequest={this.uploadPic}
                                beforeUpload={this.beforeUploadThumbnail}
                            >
                                {
                                    item.id > 980 ? (qrdata[this.state.indexcount] ?
                                        <img src={'https://img.kaikeba.com/' +qrdata[this.state.indexcount]} alt="noImg"/> : uploadButton) : (
                                        <img src={'https://img.kaikeba.com/' + this.state.nowImg } alt="noImg"/>)

                                }
                            </Upload>
                            <div style={{marginTop: '10px'}}>
                                <Button type="default" style={{width: '100px', textAlign: 'center'}}
                                        onClick={this.clickOneUpload}>上传</Button>
                            </div>
                        </div>
                    )}
                </FormItem>
                <FormItem className="add-binding-box-form" label="好友数"
                          validateStatus={this.state.friendsState}
                          help={this.state.friendsHint} {...FormItemLayout} hasFeedback>
                    {getFieldDecorator('friends' + item.id, {
                        rules: [{required: false, message: '好友数不能为空'}],
                        initialValue: item.friends
                    })(
                        <Input onChange={this.friendsCheck} placeholder=""/>
                    )}
                </FormItem>
                <FormItem className="add-binding-box-form" label="手机号"
                          validateStatus={this.state.mobileState}
                          help={this.state.mobileHint} {...FormItemLayout} hasFeedback>
                    {getFieldDecorator('mobile' + item.id, {
                        rules: [{required: false, message: '手机号不能为空'}],
                        initialValue: item.mobile
                    })(
                        <Input onChange={this.mobileCheck} placeholder="该微信号注册用的手机号"/>
                    )}
                </FormItem>
            </div>

        )
    }
}
const CollectionCreateForm = Form.create()(ListMart);
export default CollectionCreateForm;
