import React from "react";
import "./AddOrder.less";
import {Form, Input, Select, LocaleProvider, InputNumber} from 'antd';
import zh_CN from "antd/lib/locale-provider/zh_CN";
import {getderCoursePrice} from "../../../api/orderCenterApi";
import {getNum,getToken} from "../../../utils/filter";
import './RefundModal.less'

const FormItem = Form.Item;
const {TextArea} = Input;

class RefundModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    refundBlur = (value)=>{

    };

    render() {
        const {} = this.state;
        const {addcanBackMoneyDetail} = this.props;
        const {getFieldDecorator} = this.props.form;
        const FormItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 16},
        };
        return (
            <div className="refund-modal">
                <Form layout="horizontal">
                    <div style={{marginBottom : '20px'}}>
                        <FormItem className="order-refund-label" label="成单人：" {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('name', {
                                rules: [{required: false}],
                            })(
                                <span>{`${getToken('realname')}(${getToken('mobile')})`}</span>
                            )}
                        </FormItem>
                        <FormItem className="order-refund-label" label="订单编号：" {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('orderNo', {
                                rules: [{required: false}],
                            })(
                                <span>{addcanBackMoneyDetail.id}</span>
                            )}
                        </FormItem>
                        <FormItem className="order-refund-label" label="上课学员：" {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('student', {
                                rules: [{required: false}],
                            })(
                                <span>{addcanBackMoneyDetail.trackName}</span>
                            )}
                        </FormItem>
                        <FormItem className="order-refund-label" label="课程：" {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('course', {
                                rules: [{required: false}],
                            })(
                                <span>{addcanBackMoneyDetail.itemName}</span>
                            )}
                        </FormItem>
                        <FormItem className="order-refund-label" label="班次：" {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('class', {
                                rules: [{required: false}],
                            })(
                                <span>{addcanBackMoneyDetail.itemSkuName}</span>
                            )}
                        </FormItem>
                        <FormItem className="order-refund-label" label="应付金额：" {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('class', {
                                rules: [{required: false}],
                            })(
                                <span>{addcanBackMoneyDetail.price}</span>
                            )}
                        </FormItem>
                        <FormItem className="order-refund-label_b" label="已付金额：" {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('class', {
                                rules: [{required: false}],
                            })(
                                <span>{addcanBackMoneyDetail.payAmount}</span>
                            )}
                        </FormItem>
                    </div>
                    <FormItem label="退款金额：" {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('refund', {
                            rules: [
                                {required: true, message: '退款金额不能为空'},
                                // {max: 2, message: '退款金额不能大于已付金额'}
                            ],
                        })(
                            <InputNumber min={0} max={parseFloat(getNum(parseFloat(addcanBackMoneyDetail.amount ? addcanBackMoneyDetail.amount : 0) - parseFloat(addcanBackMoneyDetail.refundAmount ? addcanBackMoneyDetail.refundAmount : 0)))} onBlur={this.refundBlur} style={{width: '160px'}} placeholder="请输入"/>
                        )}
                        {/*<span style={{marginLeft: '10px'}}>元</span>*/}
                    </FormItem>
                    <FormItem label="退款原因" {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('remark', {
                            rules: [{required: true, message: '退款原因不能为空'}],
                        })(
                            <TextArea rows={3} placeholder="请输入"/>
                        )}
                    </FormItem>
                </Form>
            </div>
        )
    }
}

const CollectionCreateForm = Form.create()(RefundModal);
export default CollectionCreateForm;