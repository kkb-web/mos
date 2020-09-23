import React from "react";
import "./AddInvoice.less";
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
    InputNumber,
    DatePicker, LocaleProvider
} from 'antd';
import history from "../../common/History";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import {formatDateTime, getToken} from "../../../utils/filter";
import {getOrderDetail} from "../../../api/financeApi";
import {priceType,getNum,disabledDate} from "../../../utils/filter";

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
        };
    }

    componentDidMount() {

    };

    componentWillUnmount() {

    };

    //基础价格失去焦点补齐小数点
    priceBlur = (e) => {
        console.log(e.target.value);
        if(e.target.value !==''){
            this.props.form.setFieldsValue({
                amountInvoice: getNum(e.target.value, 2)
            });
        }
    };

    //开票时间onchange
    DatePickerOnchange = (date, dateString) => {
        console.log(date, dateString);
    };

    //选额订单编号
    chooseOrderNum = (value) => {
        console.log(value);
        getOrderDetail(value).then(res => {
            if (res.data.code == 0) {
                console.log(res.data.data);
                this.setState({
                    orderDetail: res.data.data,
                    orderDetailVisible: true
                })
            }
        }).catch(err => {
            console.log(err)
        })
    };


    render() {
        console.log(this.props,'this.props')
        const {orderDetail} = this.state;
        const {BillTypeSelect, OrderNumberSelect} = this.props;
        const {getFieldDecorator} = this.props.form;
        const FormItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 16},
        };
        const menus = [
            {
                path: '/app/dashboard/analysis',
                name: '首页'
            },
            {
                path: '#',
                name: '财务管理'
            },
            {
                path: '/app/authority/accounts',
                name: '发票管理'
            }
        ];
        return (
            <div className="finace-addbills">
                <Form className="finace-addbills-form" layout="horizontal">
                    <div id="datePicker_bill">
                        <FormItem label="开票时间" {...FormItemLayout} hasFeedback>
                            <LocaleProvider locale={zh_CN}>
                                {getFieldDecorator('invoiceTime', {
                                    rules: [{required: true, message: '开票时间不能为空'}],
                                })(
                                    <DatePicker
                                        onChange={this.DatePickerOnchange}
                                        disabledDate={disabledDate}
                                        getCalendarContainer={() => document.getElementById('datePicker_bill')}
                                    />
                                )}
                            </LocaleProvider>
                        </FormItem>
                    </div>
                    <div id="select-bill-type" className="select-bill-type">
                        <FormItem key='subjectVals' label="发票类型"
                                  validateStatus={this.state.billTypeState}
                                  help={this.state.billTypetHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('billType', {
                                rules: [{required: true, message: '请选择发票类型'}],
                            })(
                                <Select
                                    placeholder="请选择发票类型"
                                    getPopupContainer={() => document.getElementById('select-bill-type')}
                                    onChange={this.chooseSubject}
                                >
                                    {
                                        BillTypeSelect && BillTypeSelect.map((value) => {
                                            return (<Option key={value.id} value={value.name}>{value.name}</Option>)
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </div>
                    <FormItem label="票据抬头" {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('billHead', {
                            rules: [{required: true, message: '票据抬头不能为空'}],
                        })(
                            <Input maxLength={20} placeholder="请输入票据抬头"
                                   onChange={this.titleCheck}/>
                        )}
                    </FormItem>
                    <div id="select-orderNumber" className="select-orderNumber">
                        <FormItem key='subjectVals' label="订单编号"
                                  validateStatus={this.state.orderNumberState}
                                  help={this.state.orderNumberHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('orderNumber', {
                                rules: [{required: true, message: '请选择订单编号'}],
                            })(
                                <Select
                                    showSearch
                                    placeholder="搜索订单编号"
                                    onChange={this.chooseOrderNum}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    getPopupContainer={() => document.getElementById('select-orderNumber')}
                                >
                                    {OrderNumberSelect ? OrderNumberSelect.map(value => <Option value={value.outOrderId}>{value.outOrderId.toString()}</Option>) : null}
                                </Select>
                            )}
                        </FormItem>
                    </div>
                    <div className="orderdetail" style={{display: this.state.orderDetailVisible ? 'block':'none'}}>
                        <div>
                            <span className="orderdetail-left">用<span className="placeholder-left"></span>户：</span>
                            <span>{orderDetail.trackName}</span>
                        </div>
                        <div>
                            <span className="orderdetail-left">课<span className="placeholder-left"></span>程：</span>
                            <span>{orderDetail.itemName}</span>
                        </div>
                        <div>
                            <span className="orderdetail-left">销<span className="placeholder-left"></span>售：</span>
                            <span >{orderDetail.sellerName}</span>
                        </div>
                        <div>
                            <span className="orderdetail-left">剩余可开票金额：</span>
                            <span>{priceType(orderDetail.payAmount)}</span>
                        </div>
                    </div>
                    <FormItem label="开票金额" {...FormItemLayout} hasFeedback
                              validateStatus={this.state.amountState}
                              help={this.state.amountHint}>
                        {getFieldDecorator('amountInvoice', {
                            rules: [{required: true, message: '请输入开票金额'}],
                        })(
                            <InputNumber style={{width: '100%'}} max={parseFloat(orderDetail.payAmount ? orderDetail.payAmount : 0)} placeholder="请输入开票金额" onBlur={this.priceBlur}/>
                        )}
                    </FormItem>
                    <FormItem label="发票号码" {...FormItemLayout} hasFeedback
                              validateStatus={this.state.invoiceNumberState}
                              help={this.state.invoiceNumberHint}>
                        {getFieldDecorator('invoiceNumber', {
                            rules: [{required: false, message: '请输入发票号码'}],
                        })(
                            <Input maxLength={20} placeholder="请输入发票号码" onBlur={this.titleCheckRepeat}
                                   onChange={this.titleCheck}/>
                        )}
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
