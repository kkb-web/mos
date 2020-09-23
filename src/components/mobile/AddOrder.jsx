import {Component} from "react";
import {Button, Col, DatePicker, Form, Input, InputNumber, LocaleProvider, message, Row, Select} from "antd";
import React from "react";
import {disabledDate, setTitle, getNum, getToken} from "../../utils/filter";
import './AddOrder.less'
import {source} from "../userCenter/source";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import {addMyUser, checkUser, getCourses, getSaleList} from "../../api/userCenterApi";
import history from "../common/History";
import {AddOfflineOrder, getCourseSelect, getTrackNameSelect} from "../../api/orderCenterApi";
import { userScalable } from "../../utils/filter";
const FormItem = Form.Item;
const {Option} = Select;
const {TextArea} = Input;

let mobileRule = /^1[1-9][0-9]\d{8}$/;
let nameTimer = null, nickTimer = null;

class AddUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            BillTypeSelect: [],
            OrderNumberSelect: [],
            orderDetail: {},  //搜索订单后的详细信息
            orderDetailVisible: false,
            courseDetails:{},
            discountPriceValue:0,
            addOrderChildData: {},
            currentIndex:null
        };
    }

    //上课学员下拉
    getBillTypeSelectFn = () => {
        getTrackNameSelect().then(res => {
            if (res.data.code == 0) {
                this.setState({
                    BillTypeSelect: res.data.data
                })
            }
        }).catch(err => {
            console.log(err)
        })
    };

    //vip课程下拉
    getOrderNumberSelectFn = () => {
        getCourseSelect().then(res => {
            console.log(res.data.data)
            if (res.data.code == 0) {
                this.setState({
                    OrderNumberSelect: res.data.data
                })
            }
        }).catch(err => {
            console.log(err)
        })
    };

    componentDidMount() {
        this.getBillTypeSelectFn();
        this.getOrderNumberSelectFn();
        setTitle('创建订单');
        var phoneWidth = parseInt(window.screen.width);
        var phoneScale = phoneWidth / 370;
        var ua = navigator.userAgent;
        if (/Android (\d+\.\d+)/.test(ua)) {
            var version = parseFloat(RegExp.$1);
            if (version > 2.3) {
                document.write('<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale = ' + phoneScale + ', maximum-scale = ' + phoneScale + ', target-densitydpi=device-dpi">');
            } else {

                document.write('<meta name="viewport" content="width=device-width, target-densitydpi=device-dpi">');
            }
        } else {
            document.write('<meta name="viewport" content="width=device-width, user-scalable=no, target-densitydpi=device-dpi">');
        }
    }

    componentWillUnmount() {
        clearTimeout(nameTimer);
        clearTimeout(nickTimer);
    }

    // 改变用户名
    changeName = (e) => {
        if (e.target.value === '') {
            this.setState({
                nameStatus: 'error',
                nameHint: '姓名不能为空哦~'
            })
        } else {
            this.setState({
                nameStatus: 'success',
                nameHint: ''
            })
        }
    };
    addMeta = ()=> {
        let meta = document.createElement('meta');
        meta.httpEquiv = 'Pragma';
        meta.content='no-cache';
        document.getElementsByTagName('head')[0].appendChild(meta);
    }

    // 提交
    handleSubmit = () => {
        let that = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log(err, values);
            if (!err) {
                //子表单内的班次信息
                let addorderChildData = this.state.addOrderChildData;
                let params = {
                    courseId: addorderChildData.courseId,
                    courseCode: addorderChildData.courseCode,
                    classId: addorderChildData.classId,
                    itemId: addorderChildData.itemId,
                    itemSkuId: addorderChildData.itemSkuId,
                    price: addorderChildData.classPrice,
                    discount: values.shouldPrice ? parseFloat(values.shouldPrice) : 0,
                    trackId: parseInt(values.classUser),
                    remark: values.invoiceRemark ? values.invoiceRemark : null
                };
                console.log(values);
                //添加成功后关闭添加modal，打开回款modal
                AddOfflineOrder(params).then(res => {
                    if (res.data.code == 0) {
                        this.props.history.push({
                            pathname: '/order/add/success',
                            id: res.data.data.id
                        })
                    } else {
                        this.props.history.push({
                            pathname: '/order/add/error'
                        })
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        });
    };
    //优惠金额
    discountPriceFn = (value)=>{
        console.log(value);
        this.setState({
            discountPriceValue: value
        })
        // let courseNames = this.props.form.getFieldValue('course');
        // if(courseNames !== undefined){
        //     if(value > this.state.courseDetails.classPrice){
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
    //获取焦点
    discountPriceFocus = ()=>{
        let courseNames = this.props.form.getFieldValue('course');
        console.log(courseNames)
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
            if (e.target.value !== 0){
                this.props.form.setFieldsValue({
                    discountPrice: getNum(e.target.value, 2)
                });
            }
        }
    };

    //选额订单编号
    chooseOrderNum = (value) => {
        console.log(value);
        let courseData = this.state.OrderNumberSelect;
        let courseDetail;
        for (let i=0;i<courseData.length;i++){
            if(courseData[i].classId == value){
                courseDetail = courseData[i]
            }
        }
        this.setState({
            courseDetails:courseDetail,
            addOrderChildData: courseDetail
        });
        // 防止先填写优惠金额
        this.props.form.setFieldsValue({
            discountPrice: null
        });
        this.setState({
            discountPriceState:'',
            discountPriceHint:''
        })
    };
    borderActive = (e, num) => {
        e.stopPropagation();
        e.stopPropagation();
        if (num == 1) {
            this.setState({
                currentIndex: 99
            })
        } else if (num == 2) {
            document.querySelector('.classUser-item input').click();
            this.setState({
                currentIndex: num
            })
        } else if (num == 3) {
            console.log(document.querySelector('.course-item input'));
            document.getElementById('course').click();
            this.setState({
                currentIndex: num
            })
        }else if (num == 4) {
            this.setState({
                currentIndex: 99
            })
        }else if (num == 5) {
            this.setState({
                currentIndex: 99
            })
        }else if (num == 21) {
            this.setState({
                currentIndex: 99
            })
        }else if (num == 6) {
            document.getElementById('shouldPrice').focus();
        }else if (num == 7) {
            this.setState({
                currentIndex: 99
            })
        }else if (num == 8) {
            document.getElementById('invoiceRemark').focus();
            this.setState({
                currentIndex: num
            })
        }
    };

    render() {
        const {OrderNumberSelect, BillTypeSelect, courseDetails, discountPriceValue} = this.state;
        const {getFieldDecorator} = this.props.form;
        let shouldPrice;
        if (this.state.courseDetails.classPrice) {
            shouldPrice = getNum(parseFloat(courseDetails.classPrice ? courseDetails.classPrice : 0) - parseFloat(discountPriceValue ? discountPriceValue : 0));
        }
        return (
            <div className="mobile-add-order">
                <div className="add_order_dd">
                    创建线下订单
                </div>
                <div className="add_order_bottom_dd">
                    <Form layout="vertical">
                        <Row className={`${this.state.currentIndex == 1 ? 'box-active' : 'null'}`} onClick={(e)=>{this.borderActive(e,'1')}}>
                            <div className="add-order-item-disables">
                                <p className="p1">成单人</p>
                                <p className="p2">{`${getToken('realname')}  (${getToken('mobile')})`}</p>
                            </div>
                        </Row>
                        <Row onClick={(e)=>{this.borderActive(e,'2')}}>
                            <FormItem className={`classUser-item ${this.state.currentIndex == 2 ? 'box-active' : 'null'}`} label="上课学员" hasFeedback>
                                {getFieldDecorator('classUser', {
                                    rules: [
                                        {required: true, message: '请选择上课学员'}
                                    ]
                                })(
                                    <Select
                                        showSearch
                                        placeholder="请选择"
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
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
                        </Row>
                        <Row onClick={(e)=>{this.borderActive(e,'3')}}>
                            <FormItem className={`course-item ${this.state.currentIndex == 3 ? 'box-active' : 'null'}`} className={`${this.state.currentIndex == 3 ? 'box-active' : 'null'}`} label="课程" hasFeedback>
                                {getFieldDecorator('course', {
                                    rules: [
                                        {required: true, message: '请选择课程'}
                                    ]
                                })(
                                    <Select
                                        showSearch
                                        placeholder="请选择"
                                        onChange={this.chooseOrderNum}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                    >
                                        {OrderNumberSelect && OrderNumberSelect.map(value => <Option key={value.classId}>{value.courseName}</Option>)}
                                    </Select>
                                )}
                            </FormItem>
                        </Row>
                        <Row className={`${this.state.currentIndex == 5 ? 'box-active' : 'null'}`} onClick={(e)=>{this.borderActive(e,'5')}}>
                            <div className="add-order-item-disables">
                                <p className="p1">班次原价   （单位：元）</p>
                                <p className="p2">{this.state.courseDetails.coursePrice ? getNum(this.state.courseDetails.coursePrice, 2) : ''}</p>
                            </div>
                        </Row>
                        <Row className={`${this.state.currentIndex == 4 ? 'box-active' : 'null'}`} onClick={(e)=>{this.borderActive(e,'4')}}>
                            <div className="add-order-item-disables">
                                <p className="p1">班次</p>
                                <p className="p2">{this.state.courseDetails.className}</p>
                            </div>
                        </Row>
                        <Row className={`${this.state.currentIndex == 21 ? 'box-active' : 'null'}`} onClick={(e)=>{this.borderActive(e,'21')}}>
                            <div className="add-order-item-disables">
                                <p className="p1">班次销售价   （单位：元）</p>
                                <p className="p2">{this.state.courseDetails.classPrice ? getNum(this.state.courseDetails.classPrice, 2) : ''}</p>
                            </div>
                        </Row>

                        <Row style={{background:'none'}} onClick={(e)=>{this.borderActive(e,'6')}}>
                            <FormItem  style={{width:'50%'}} className={`price-item ${this.state.currentIndex == 6 ? 'box-active' : 'null'}`} label="优惠额度   （单位：元）" hasFeedback validateStatus={this.state.discountPriceState}
                                       help={this.state.discountPriceHint}>
                                {getFieldDecorator('shouldPrice', {
                                    rules: [
                                        {required: false, message: '优惠金额'}
                                    ]
                                })(
                                    <InputNumber className="ordercenter-inputnumber"
                                                 onChange={this.discountPriceFn}
                                                 onFocus={this.discountPriceFocus}
                                                 onBlur={this.discountPriceBlur}
                                                 style={{width:'100%'}}
                                                 min={0}
                                                 max={this.state.courseDetails.classPrice ? this.state.courseDetails.classPrice : 0}
                                                 placeholder="请输入"/>
                                )}
                            </FormItem>
                            <span className="price-item-description">不填写，默认无专属优惠</span>
                        </Row>
                        <Row className={`${this.state.currentIndex == 7 ? 'box-active' : 'null'}`} onClick={(e)=>{this.borderActive(e,'7')}}>
                            <div className="add-order-item-disables">
                                <p className="p1">应付金额   （单位：元）</p>
                                <p className="p2">{shouldPrice}</p>
                            </div>
                        </Row>
                        <Row onClick={(e)=>{this.borderActive(e,'8')}}>
                            <FormItem className={`price-item-remark ${this.state.currentIndex == 8 ? 'box-active' : 'null'}`} label="备注" hasFeedback>
                                {getFieldDecorator('invoiceRemark', {
                                    rules: [{required: false, message: '备注'}],
                                })(
                                    <TextArea
                                        style={{height:'120px'}}
                                        rows={4}
                                    />
                                )}
                            </FormItem>
                        </Row>














                        {/*<Row style={{marginBottom:'12px'}}>*/}
                        {/*<Col span={8} className="user-row-title_mobile add-top-title">成单人：</Col>*/}
                        {/*<Col span={14} className="user-row-input add-top-content">{`${getToken('realname')}(${getToken('mobile')})`}</Col>*/}
                        {/*</Row>*/}
                        {/*<Row>*/}
                        {/*<Col span={8} className="user-row-title user-row-title_mobile">上课学员：</Col>*/}
                        {/*<Col span={14} className="user-row-input heights-common" id="select-bill-type">*/}
                        {/*<FormItem hasFeedback>*/}
                        {/*{getFieldDecorator('classUser', {*/}
                        {/*rules: [*/}
                        {/*{required: true, message: '请选择上课学员'}*/}
                        {/*]*/}
                        {/*})(*/}
                        {/*<Select*/}
                        {/*showSearch*/}
                        {/*placeholder="请选择"*/}
                        {/*getPopupContainer={() => document.getElementById('select-bill-type')}*/}
                        {/*filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}*/}
                        {/*>*/}
                        {/*{*/}
                        {/*BillTypeSelect.map((value) => {*/}
                        {/*return (<Option key={value.id} value={value.id}>{`${value.username}(${value.mobile})`}</Option>)*/}
                        {/*})*/}
                        {/*}*/}
                        {/*</Select>*/}
                        {/*)}*/}
                        {/*</FormItem>*/}
                        {/*</Col>*/}
                        {/*</Row>*/}
                        {/*<Row>*/}
                        {/*<Col span={8} className="user-row-title user-row-title_mobile">课程：</Col>*/}
                        {/*<Col span={14} className="user-row-input heights-common" id="select-orderNumber">*/}
                        {/*<FormItem hasFeedback>*/}
                        {/*{getFieldDecorator('course', {*/}
                        {/*rules: [*/}
                        {/*{required: true, message: '请选择课程'}*/}
                        {/*]*/}
                        {/*})(*/}
                        {/*<Select*/}
                        {/*showSearch*/}
                        {/*placeholder="请选择课程"*/}
                        {/*onChange={this.chooseOrderNum}*/}
                        {/*filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}*/}
                        {/*getPopupContainer={() => document.getElementById('select-orderNumber')}*/}
                        {/*>*/}
                        {/*{OrderNumberSelect.map(value => <Option key={value.classId}>{value.courseName}</Option>)}*/}
                        {/*</Select>*/}
                        {/*)}*/}
                        {/*</FormItem>*/}
                        {/*</Col>*/}
                        {/*</Row>*/}
                        {/*<Row style={{marginBottom:'16px'}}>*/}
                        {/*<Col span={8} className="user-row-title_mobile add-top-title">班次原价：</Col>*/}
                        {/*<Col span={14} className="user-row-input add-top-content" id="user-row-input_sale">{this.state.courseDetails.coursePrice ? getNum(this.state.courseDetails.coursePrice, 2) : ''}</Col>*/}
                        {/*</Row>*/}
                        {/*<Row style={{marginBottom:'16px'}}>*/}
                        {/*<Col span={8} className="user-row-title_mobile add-top-title">班次：</Col>*/}
                        {/*<Col span={14} className="user-row-input add-top-content" id="user-row-input_sale">{this.state.courseDetails.className}</Col>*/}
                        {/*</Row>*/}
                        {/*<Row style={{marginBottom:'16px'}}>*/}
                        {/*<Col span={8} className="user-row-title_mobile add-top-title">班次销售价：</Col>*/}
                        {/*<Col span={14} className="user-row-input add-top-content" id="user-row-input_sale">{this.state.courseDetails.classPrice ? getNum(this.state.courseDetails.classPrice,2) : ''}</Col>*/}
                        {/*</Row>*/}
                        {/*<Row>*/}
                        {/*<Col span={8} className="user-row-title_mobile">优惠金额：</Col>*/}
                        {/*<Col span={14} className="user-row-input heights-common" id="user-row-input_shouldPrice">*/}
                        {/*<FormItem hasFeedback validateStatus={this.state.discountPriceState}*/}
                        {/*help={this.state.discountPriceHint}>*/}
                        {/*{getFieldDecorator('shouldPrice', {*/}
                        {/*rules: [*/}
                        {/*{required: false, message: '优惠金额'}*/}
                        {/*]*/}
                        {/*})(*/}
                        {/*<InputNumber className="ordercenter-inputnumber"*/}
                        {/*onChange={this.discountPriceFn}*/}
                        {/*onFocus={this.discountPriceFocus}*/}
                        {/*onBlur={this.discountPriceBlur}*/}
                        {/*style={{width:'200px'}}*/}
                        {/*min={0}*/}
                        {/*max={this.state.courseDetails.classPrice ? this.state.courseDetails.classPrice : 0}*/}
                        {/*placeholder="请输入优惠金额"/>*/}
                        {/*)}*/}
                        {/*</FormItem>*/}
                        {/*</Col>*/}
                        {/*</Row>*/}
                        {/*<Row style={{marginBottom:'16px'}}>*/}
                        {/*<Col span={8} className="user-row-title_mobile add-top-title">应付金额：</Col>*/}
                        {/*<Col span={14} className="user-row-input add-top-content" id="user-row-input_sale">{shouldPrice}</Col>*/}
                        {/*</Row>*/}
                        {/*<Row>*/}
                        {/*<Col span={8} className="user-row-title_mobile">备注：</Col>*/}
                        {/*<Col span={14} className="user-row-input" id="user-row-input_sale">*/}
                        {/*<FormItem hasFeedback>*/}
                        {/*{getFieldDecorator('invoiceRemark', {*/}
                        {/*rules: [{required: false, message: '备注'}],*/}
                        {/*})(*/}
                        {/*<TextArea*/}
                        {/*placeholder="请输入备注"*/}
                        {/*rows={4}*/}
                        {/*/>*/}
                        {/*)}*/}
                        {/*</FormItem>*/}
                        {/*</Col>*/}
                        {/*</Row>*/}
                    </Form>
                    <div className="add_order_button_dd" onClick={this.handleSubmit}>提 交</div>
                </div>
            </div>
        )
    }
}

const addUser = Form.create()(AddUser);
export default addUser;
