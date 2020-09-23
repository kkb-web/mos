import React from 'react';
import './AddVipChannelForm.less'
import {
    Form,
    Input,
    DatePicker,
    Checkbox,
    LocaleProvider,
    Switch
} from 'antd';
import {priceType, disabledDateBefore, range,getNum,getToken} from "../../../../utils/filter";
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';

const { TextArea } = Input;
const {RangePicker} = DatePicker;
const FormItem = Form.Item;
let emojiRule = /([\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70-\uDD71\uDD7E-\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01-\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50-\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96-\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF])|(\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F-\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95-\uDD96\uDDA4-\uDDA5\uDDA8\uDDB1-\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB-\uDEEC\uDEF0\uDEF3-\uDEF6])|(\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0])/g;

class Local extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            channelType: false,
            discountPrice:'',
            discountPriceStatus:true,
            currentTime:null,
            currentHourse:'',
            currentDate:'',
            showChooseTime: true,
            showText: true
        };
    }

    // 渲染
    componentDidMount() {
        this.node.scrollIntoView();
        this.props.form.setFieldsValue({
            oneTime: true,
            entryTimeStatus: true
        })
        if(!this.props.channelType){
            document.getElementById('discountPrice').onmousewheel = function (event) {
                return false
            };
        }
    }
    //传值给父组件
    sendDataParent = ()=>{
      let childDate = {
          vipTitleStateE:this.state.vipTitleStateE,
          discountPriceState:this.state.discountPriceState
      };
      return childDate
    };
    // 渠道名称检查
    titleCheck = (e) => {
        if (e.target.value.length === 0) {
            this.setState({
                vipTitleHint: '渠道名称不能为空',
                vipTitleState: 'error'
            })
        } else if (!(e.target.value.indexOf(" ") === -1)) {
            this.setState({
                vipTitleHint: '禁止输入空格',
                vipTitleState: 'error'
            })
        } else if (emojiRule.test(e.target.value)) {
            this.setState({
                vipTitleHint: '禁止输入emoji',
                vipTitleState: 'error'
            })
        } else if (e.target.value.length == 20) {
            this.setState({
                vipTitleHint: '字数需在20字以内',
                vipTitleState: 'error'
            })
        } else {
            this.setState({
                vipTitleHint: '',
                vipTitleState: 'success'
            })
        }
    };
    // 专属渠道名称检查
    titleCheck = (e) => {
        if (e.target.value.length === 0) {
            this.setState({
                vipTitleHintE: '渠道名称不能为空',
                vipTitleStateE: 'error'
            })
        } else if (!(e.target.value.indexOf(" ") === -1)) {
            this.setState({
                vipTitleHintE: '禁止输入空格',
                vipTitleStateE: 'error'
            })
        } else if (emojiRule.test(e.target.value)) {
            this.setState({
                vipTitleHintE: '禁止输入emoji',
                vipTitleState: 'error'
            })
        } else if (e.target.value.length == 20) {
            this.setState({
                vipTitleHintE: '字数需在20字以内',
                vipTitleStateE: 'error'
            })
        } else {
            this.setState({
                vipTitleHintE: '',
                vipTitleStateE: 'success'
            })
        }
    };
    //备注信息检查
    remarksCheck = (e)=>{
        if (e.target.value.length === 0) {
            this.setState({
                remarksHint: '',
                remarksState: ''
            })
        } else if (!(e.target.value.indexOf(" ") === -1)) {
            this.setState({
                remarksHint: '禁止输入空格',
                remarksState: 'error'
            })
        } else if (emojiRule.test(e.target.value)) {
            this.setState({
                remarksHint: '禁止输入emoji',
                remarksState: 'error'
            })
        } else if (e.target.value.length == 30) {
            this.setState({
                remarksHint: '字数需在30字以内',
                remarksState: 'error'
            })
        } else {
            this.setState({
                remarksHint: '',
                remarksState: 'success'
            })
        }
    };
    //获取当前时间
    getNowDate = ()=>{
        let result = [],
            result2 = [],
            hourseIndex,
            minutesIndex;
        for (let i = 0; i < 24; i++) {
            result.push(i);
        }
        for (let i = 0; i < 60; i++) {
            result2.push(i);
        }
        let myDate = new Date();
        let hourse = myDate.getHours();
        let minutes = myDate.getMinutes();
        for(let i=0;i<result.length;i++){
            if(result[i] == hourse){
                hourseIndex = i;
                break
            }
        }
        for(let i=0;i<result2.length;i++){
            if(result2[i] == minutes){
                minutesIndex = i;
                break
            }
        }
        let timeDate = {
            hourseIndex:hourseIndex,
            minutesIndex:minutes,
            myDate:myDate
        };
        return timeDate
    };

    //处理当前时间
    disabledTime = (data,type)=>{
        let timeDate = this.getNowDate();
        let currentHourse = this.state.currentHourse;
        if (type === 'start') {
            if(moment(this.state.currentDate).isAfter(timeDate.myDate)){
                return {
                    disabledHours: () => [],
                    disabledMinutes: () => [],
                    disabledSeconds: () => [],
                };
            }else {
                return {
                    disabledHours: () => range(0, 24).splice(0, timeDate.hourseIndex),
                    disabledMinutes: () => currentHourse == timeDate.hourseIndex ? range(0, 60).splice(0, timeDate.minutesIndex) : [],
                    disabledSeconds: () => [],
                };
            }
        }
    };

    //减法
    digitLength = (num)=>{
        const eSplit = num.toString().split(/[eE]/);
        const len = (eSplit[0].split('.')[1] || '').length - (+(eSplit[1] || 0));
        return len > 0 ? len : 0;
    };
    //精确减法
    minus =(num1,num2)=>{
        const baseNum = Math.pow(10, Math.max(this.digitLength(num1), this.digitLength(num2)));
        let sum = (num1 * baseNum - num2 * baseNum) / baseNum;
        return sum
    };
    //优惠价格检查
    priceCheck = (e) => {
        let roleType = getToken('isSale');
        console.log(roleType);
        let diffMoney = this.minus(this.props.classingDetailData.price,e.target.value);
        if(roleType == 0){
        //  是销售
            let salesDiscount = parseFloat(getNum(parseFloat(this.props.classingDetailData.price) * 0.99));
            console.log(parseFloat(this.props.classingDetailData.price) * 0.99,"12");
            console.log(getNum(parseFloat(this.props.classingDetailData.price) * 0.99),"123")
            console.log(salesDiscount,"1234")
            if (parseFloat(e.target.value) >= 0.01 && parseFloat(e.target.value) <= salesDiscount) {
                this.setState({
                    discountPriceHint: '',
                    discountPriceState: 'success',
                    discountPriceStatus:false,
                    discountPrice:diffMoney,
                })
            } else if (e.target.value === '') {
                this.setState({
                    discountPriceHint: '请输价格',
                    discountPriceState: 'error',
                    discountPrice:0,
                    discountPriceStatus:true
                })
            } else if(parseFloat(e.target.value) <= 0){
                this.setState({
                    discountPriceHint: '请输入有效范围内的数字(0,' + salesDiscount + ']',
                    discountPriceState: 'error',
                    discountPrice:0,
                    discountPriceStatus:true
                })
            }else {
                this.setState({
                    discountPriceHint: '优惠额度不能超过 ' + salesDiscount + '元',
                    discountPriceState: 'error',
                    discountPrice:0,
                    discountPriceStatus:true
                })
            }

        }else {
        //    非销售
            let notSalesDiscount = parseFloat(getNum(parseFloat(this.props.classingDetailData.price) * 0.99));
            if (parseFloat(e.target.value) >= 0.01 && parseFloat(e.target.value) <= notSalesDiscount) {
                this.setState({
                    discountPriceHint: '',
                    discountPriceState: 'success',
                    discountPriceStatus:false,
                    discountPrice:diffMoney,
                })
            } else if (e.target.value === '') {
                this.setState({
                    discountPriceHint: '请输价格',
                    discountPriceState: 'error',
                    discountPrice:0,
                    discountPriceStatus:true
                })
            } else {
                this.setState({
                    discountPriceHint: '优惠额度不能超过 ' + notSalesDiscount + '元',
                    discountPriceState: 'error',
                    discountPrice:0,
                    discountPriceStatus:true
                })
            }
        }
    };

    selectTime = (date, dateString)=>{
        this.setState({
            currentHourse:dateString[0].slice(10, 13),
            currentDate:dateString[0]
        })
    };

    checkboxstate = (e)=>{
        console.log(`checked = ${e.target.checked}`);
    };

    // 选择时间开关
    chooseTime = (value) => {
        this.setState({
            showChooseTime: value
        })
    };

    changeOnce = (value) => {
        this.props.form.setFieldsValue({
            oneTime: value
        });
        this.setState({
            showText: value
        })
    };

    render() {
        let childDtat = {
            vipTitleStateE:this.state.vipTitleStateE,
            discountPriceState:this.state.discountPriceState
        };
        this.props.sendDataParent(childDtat);
        const { discountPrice ,discountPriceStatus} = this.state;
        const { channelType,classingDetailData,username } = this.props;
        const {getFieldDecorator} = this.props.form;
        const placeholders = `${username}_默认渠道`;
        const FormItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 15},
        };
        const FormItemLayoutprice = {
            labelCol: {span: 6},
            wrapperCol: {span: 6},
        };
        let FormData = null;
        // 条件渲染
        if(channelType){
            FormData = <div className="normal-box" style={{display: channelType ? 'block' : 'none'}}>
                <div className="channelName-box">
                    <FormItem className="open-course-form" label="渠道名称" validateStatus={this.state.vipTitleState}
                              help={this.state.vipTitleHint} {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('channelName', {
                            initialValue:placeholders,
                            rules: [{required: true, message: '渠道名称不能为空'}],
                        })(
                            <Input maxLength={20} placeholder={placeholders} onChange={this.titleCheck}/>
                        )}
                    </FormItem>
                    <p className="channelNameTips">可不填写，默认「真实姓名_默认渠道」，如下</p>
                </div>
                <div className="channeldetail">
                    <p><span>当前推广班次：</span>{classingDetailData.className}</p>
                    <p><span>班次价格：</span>{priceType(classingDetailData.price)}</p>
                </div>
            </div>
        }else {
            FormData = <div className="normal-box especially" style={{display: channelType ? 'none' : 'block'}}>
                <div className="channelName-box">
                    <FormItem className="open-course-form" label="渠道名称" validateStatus={this.state.vipTitleStateE}
                              help={this.state.vipTitleHintE} {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('channelNameE', {
                            rules: [{required: true, message: '渠道名称不能为空'}],
                        })(
                            <Input maxLength={20} placeholder="如立减1000" onChange={this.titleCheck}/>
                        )}
                    </FormItem>
                    <FormItem className="open-course-form" label="备注信息" validateStatus={this.state.remarksState}
                              help={this.state.remarksHint} {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('remarks', {
                            rules: [{required: false, message: '备注信息不能为空'}],
                        })(
                            <Input maxLength={30} placeholder="简要描述" onChange={this.remarksCheck}/>
                        )}
                    </FormItem>
                    <div style={{position:'relative'}}>
                        <FormItem className="open-course-form" label="优惠金额" validateStatus={this.state.discountPriceState}
                                  help={this.state.discountPriceHint} {...FormItemLayoutprice} hasFeedback>
                            {getFieldDecorator('discountPrice', {
                                rules: [{required: true, message: '优惠金额不能为空'}],
                            })(
                                <Input prefix="￥" type='number' min={0.01} max={100000} onBlur={this.priceBlur}
                                       placeholder="1000.00" onChange={this.priceCheck}/>
                            )}
                        </FormItem>
                        <div className="discount-price" style={{display:discountPriceStatus ? 'none' : 'inline-block'}}>
                            优惠后价格 ¥{getNum(discountPrice)}
                        </div>
                    </div>
                    <FormItem className="open-course-form" validateStatus="" label="设置生效时间" {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('entryTimeStatus', {
                            rules: [{required: false}],
                        })(
                            <Switch onChange={this.chooseTime} checkedChildren="开" unCheckedChildren="关" defaultChecked />
                        )}
                        <span style={{color: 'rgba(0, 0, 0, 0.45)', marginLeft: '10px'}}>点击打开才会展开时间选择器</span>
                    </FormItem>
                    {this.state.showChooseTime ?
                    <LocaleProvider locale={zh_CN}>
                        <FormItem className="open-course-form channel_time" label={null} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('entryTime', {
                                rules: [{required: true, message: '生效时间不能为空'}],
                            })(
                                <RangePicker style={{marginLeft: '40%'}} disabledTime={this.disabledTime} disabledDate={disabledDateBefore} onChange={this.selectTime} showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm"/>
                            )}
                        </FormItem>
                    </LocaleProvider> : null}
                    <FormItem className="open-course-form" validateStatus="" label="仅限一次" {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('oneTime', {
                            rules: [{required: false}],
                        })(
                            <Switch onChange={this.changeOnce} checkedChildren="开" unCheckedChildren="关" defaultChecked />
                        )}
                        <span style={{color: 'rgba(0, 0, 0, 0.45)', marginLeft: '10px'}}>开启后，该优惠链接支付成功一次后即失效。</span>
                    </FormItem>
                    {this.state.showText ?
                    <FormItem className="open-course-form" validateStatus="" label="用户页面展示文案：" {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('showText', {
                            rules: [{required: false}],
                        })(
                            <TextArea rows={3}  placeholder={`Hi，{微信昵称}，这是我专门为你生成的专属优惠哦，请尽快使用吧`} />
                        )}
                    </FormItem> : null}
                    <div style={{clear: 'both'}}></div>
                    {/*<div className="checkbox">*/}
                        {/*{getFieldDecorator('onece', {*/}
                            {/*rules: [{required: false, message: '优惠价格不能为空'}],*/}
                        {/*})(*/}
                            {/*<Checkbox onChange={this.checkboxstate}>只能用一次<span className="checkbox-span">(如选中，则该链接只能支付一次，支付完成后该链接即失效)</span></Checkbox>*/}
                        {/*)}*/}
                    {/*</div>*/}
                </div>
            </div>
        }
        return (
            <div ref={node => this.node = node} className="addvipchannelForm">
                <Form layout="horizontal" style={{paddingBottom: '20px'}}>
                    {FormData}
                </Form>
            </div>
        );
    }

}

const CollectionCreateForm = Form.create()(Local);
export default CollectionCreateForm;
