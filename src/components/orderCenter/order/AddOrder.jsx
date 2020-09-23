import React from "react";
import "./AddOrder.less";
import {
    Upload,
    Form,
    Input,
    Icon,
    Button,
    message,
    Select,
    Progress,
    Card,
    Modal,
    Spin,
    DatePicker, LocaleProvider, InputNumber
} from 'antd';
import history from "../../common/History";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import {formatDateTime, getToken} from "../../../utils/filter";
import {getderCoursePrice} from "../../../api/orderCenterApi";
import {getNum} from "../../../utils/filter";

const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;
let emojiRule = /([\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70-\uDD71\uDD7E-\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01-\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50-\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96-\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF])|(\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F-\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95-\uDD96\uDDA4-\uDDA5\uDDA8\uDDB1-\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB-\uDEEC\uDEF0\uDEF3-\uDEF6])|(\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0])/g;


let customCondition = {
    name: null,
    sellerId: null
};
let applyData = {
    size: 40,
    current: 1,
    ascs: [],
    descs: [],
    condition: customCondition
};

class AddBills extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderDetail: {},  //搜索订单后的详细信息
            orderDetailVisible: false,
            courseDetails:{},
            discountPriceValue:0
        };
    }

    componentDidMount() {

    };

    componentWillUnmount() {

    };
    //基础价格失去焦点补齐小数点
    priceBlur = (e) => {
        console.log(e.target.value)
        if(e.target.value !==''){
            this.props.form.setFieldsValue({
                amountInvoice: getNum(e.target.value, 2)
            });
        }
    };
    //获取焦点
    discountPriceFocus = ()=>{
        let courseNames = this.props.form.getFieldValue('courseNames');
        console.log(courseNames);
        if(courseNames == undefined){
            this.setState({
                discountPriceState:'error',
                discountPriceHint:'请先选择课程'
            })
        }
    };
    //失去焦点
    discountPriceBlur = (e)=>{
        if(e.target.value ==''){
            this.setState({
                discountPriceState:null,
                discountPriceHint:'',
                discountPrice:null,
                discountPriceValue:0
            })
        }else {
            console.log(e.target.value,"失去焦点");
            if (e.target.value !== 0){
                this.props.form.setFieldsValue({
                    discountPrice: getNum(e.target.value, 2)
                });
            }
        }
    };

    //优惠金额
    discountPriceFn = (value)=>{
        console.log(value);
        this.setState({
            discountPriceValue: value
        })
        // let courseNames = this.props.form.getFieldValue('courseNames');
        // if(courseNames !== undefined){
        //     if(value >= this.state.courseDetails.classPrice){
        //         this.setState({
        //             discountPriceState:'error',
        //             discountPriceHint:'优惠金额不得大于班次价格'
        //         })
        //     }else if(value ==''){
        //         this.setState({
        //             discountPriceState:null,
        //             discountPriceHint:'',
        //             discountPrice:null,
        //             discountPriceValue:0
        //         })
        //     }else {
        //         this.setState({
        //             discountPriceState:'success',
        //             discountPriceHint:'',
        //             discountPriceValue:value
        //         })
        //     }
        // }
    };

    //选额订单编号
    chooseOrderNum = (value) => {
        console.log(value);
        let courseData = this.props.OrderNumberSelect;
        let courseDetail;
        for (let i=0;i<courseData.length;i++){
            if(courseData[i].classId == value){
                courseDetail = courseData[i]
            }
        }
        this.setState({
            courseDetails:courseDetail,
            discountPriceValue: 0
        });
        this.props.getprosState(courseDetail);
        // 防止先填写优惠金额
        this.props.form.setFieldsValue({
            discountPrice: null
        });
        this.setState({
            discountPriceState:'',
            discountPriceHint:''
        })
    };


    render() {
        const {BillTypeSelect, OrderNumberSelect} = this.props;
        const {courseDetails, discountPriceValue} = this.state;
        const {getFieldDecorator} = this.props.form;
        const FormItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 16},
        };
        let shouldPrice;
        if (this.state.courseDetails.classPrice) {
            shouldPrice = getNum(parseFloat(courseDetails.classPrice ? courseDetails.classPrice : 0) - parseFloat(discountPriceValue ? discountPriceValue : 0));
        }
        return (
            <div className="ordercenter-addorder">
                <Form className="finace-addbills-form" layout="horizontal">
                    <div id="datePicker_bill">
                        <FormItem className="item-height" label="成单人：" {...FormItemLayout} hasFeedback>
                            <LocaleProvider locale={zh_CN}>
                                {getFieldDecorator('invoiceTime', {
                                    rules: [{required: false, message: '成单人'}],
                                })(
                                    <p style={{marginBottom:0}}>{`${getToken('realname')}(${getToken('mobile')})`}</p>
                                )}
                            </LocaleProvider>
                        </FormItem>
                    </div>
                    <div id="select-bill-type" className="select-bill-type">
                        <FormItem key='subjectVals' label="上课学员："
                                  validateStatus={this.state.billTypeState}
                                  help={this.state.billTypetHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('classUser', {
                                rules: [{required: true, message: '请选择上课学员'}],
                            })(
                                <Select
                                    showSearch
                                    placeholder="请选择"
                                    getPopupContainer={() => document.getElementById('select-bill-type')}
                                    onChange={this.chooseSubject}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {
                                        BillTypeSelect && BillTypeSelect.map((value) => {
                                            return (<Option key={value.id} value={value.id}>{`${value.username}(${value.mobile})`}</Option>)
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </div>
                    <div id="select-orderNumber" className="select-orderNumber">
                        <FormItem key='subjectVals' label="课程"
                                  validateStatus={this.state.orderNumberState}
                                  help={this.state.orderNumberHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('courseNames', {
                                rules: [{required: true, message: '请选择课程'}],
                            })(
                                <Select
                                    showSearch
                                    placeholder="请选择课程"
                                    onChange={this.chooseOrderNum}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    getPopupContainer={() => document.getElementById('select-orderNumber')}
                                >
                                    {OrderNumberSelect && OrderNumberSelect.map(value => <Option
                                        key={value.classId}>{value.courseName}</Option>)}
                                </Select>
                            )}
                        </FormItem>
                    </div>
                    <FormItem className="item-height" label="基础价格：" {...FormItemLayout} hasFeedback>
                        <LocaleProvider locale={zh_CN}>
                            {getFieldDecorator('basePrice', {
                                rules: [{required: false, message: ''}],
                            })(
                                <p style={{marginBottom:0}}>{this.state.courseDetails.coursePrice ? getNum(this.state.courseDetails.coursePrice, 2) : ''}</p>
                            )}
                        </LocaleProvider>
                    </FormItem>
                    <FormItem className="item-height" label="班次：" {...FormItemLayout} hasFeedback>
                        <LocaleProvider locale={zh_CN}>
                            {getFieldDecorator('classNum', {
                                rules: [{required: false, message: ''}],
                            })(
                                <p style={{marginBottom:0}}>{this.state.courseDetails.className}</p>
                            )}
                        </LocaleProvider>
                    </FormItem>
                    <FormItem className="item-height" label="班次价格：" {...FormItemLayout} hasFeedback>
                        <LocaleProvider locale={zh_CN}>
                            {getFieldDecorator('classPrice', {
                                rules: [{required: false, message: ''}],
                            })(
                                <p style={{marginBottom:0}}>{this.state.courseDetails.classPrice ? getNum(this.state.courseDetails.classPrice,2) : ''}</p>
                            )}
                        </LocaleProvider>
                    </FormItem>
                    <FormItem label="优惠金额：" {...FormItemLayout} validateStatus={this.state.discountPriceState}
                              help={this.state.discountPriceHint} hasFeedback>
                        <LocaleProvider locale={zh_CN}>
                            {getFieldDecorator('discountPrice', {
                                rules: [{required: false, message: ''}],
                            })(
                                <InputNumber className="ordercenter-inputnumber"
                                             onChange={this.discountPriceFn}
                                             onFocus={this.discountPriceFocus}
                                             onBlur={this.discountPriceBlur}
                                             style={{width:'200px'}}
                                             min={0}
                                             max={this.state.courseDetails.classPrice ? parseFloat(this.state.courseDetails.classPrice - 0.01) : 0}
                                             placeholder="请输入优惠金额"/>
                            )}
                        </LocaleProvider>
                    </FormItem>
                    <FormItem className="item-height" label="应付金额：" {...FormItemLayout} hasFeedback>
                        <LocaleProvider locale={zh_CN}>
                            {getFieldDecorator('shouldPrice', {
                                rules: [{required: false, message: ''}],
                            })(
                                <p style={{marginBottom:0}}>{shouldPrice}</p>
                            )}
                        </LocaleProvider>
                    </FormItem>
                    <FormItem label="备注" {...FormItemLayout} hasFeedback
                              validateStatus={this.state.remarkState}
                              help={this.state.remarkHint}>
                        {getFieldDecorator('invoiceRemark', {
                            rules: [{required: false, message: '备注'}],
                        })(
                            <TextArea
                                rows={2}
                            />
                        )}
                    </FormItem>
                </Form>
            </div>
        )
    }
}

const CollectionCreateForm = Form.create()(AddBills);
export default CollectionCreateForm;
