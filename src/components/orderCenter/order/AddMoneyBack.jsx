import React from "react";
import "./AddOrder.less";
import { Form, Input, Select, LocaleProvider, InputNumber, DatePicker, Upload, Icon, Modal } from 'antd';
import zh_CN from "antd/lib/locale-provider/zh_CN";
import { getNum } from "../../../utils/filter";
import { requestData } from "../../../utils/qiniu";
import './AddMoneyBack.less'

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

class RefundModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            courseImage: [],
            fileListCourse: [],
            previewVisible: false,
            previewImage: ''
        };
    }

    moneyBackTime = (value, dateString) => {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time', dateString)
    };
    //回款类型下拉onchangge
    choosebackType = () => {

    };
    //付款方式下拉
    choosepayType = () => {

    };
    // 上传付款凭证格式检查
    beforeUploadCourseThumbnail = (file) => {
        if (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') {
            this.setState({
                uploadThumbnailCourse: true,
                courseThumbnailStatus: 'success'
            })
        } else {
            this.setState({
                uploadThumbnailCourse: false,
                courseThumbnailStatus: 'error',
                courseImage: null
            });
        }
    };
    // 上传付款凭证
    uploadCourseThumbnail = (files) => {
        let fileReader = new FileReader(); // 图片上传，读图片
        let file = files.file; // 获取到上传的对象
        let _this = this;
        fileReader.onload = (function (file) {
            return function (ev) {
                let data = ev.target.result;
                let image = new Image();
                image.onload = () => {
                    requestData(file).then(res => {
                        console.log(res.data.key, "key");
                        let data = _this.state.courseImage;
                        let obj = {
                            "uid": res.data.key,
                            "url": `https://img.kaikeba.com/${res.data.key}`
                        };
                        data.push(obj);
                        _this.props.getKeyList(data);
                        _this.setState({
                            courseImage: data
                        });
                    });
                };
                image.src = data;
            }
        })(file);
        fileReader.readAsDataURL(file); // 读取完毕，显示到页面
    };
    onRemove = (file) => {
        let data = this.state.courseImage;
        data = data.filter(({ uid }) => uid !== file.uid);
        this.props.getKeyList(data);
        this.setState({
            courseImage: data
        })
    };
    onPreviews = (data) => {
        this.setState({
            previewVisible: true,
            previewImage: data.url
        });
        console.log(data)
    };
    handleCancel = () => {
        this.setState({
            previewVisible: false
        })
    };


    render() {
        const { courseImage, previewVisible, previewImage } = this.state;
        console.log(courseImage);
        const { addcanBackMoneyDetail } = this.props;
        const { getFieldDecorator } = this.props.form;


        const FormItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="addmoneyback-modal">
                <div className="addmoneyback-top">
                    <div className="addmoneyback-top-item">
                        <span className="item-left">订单编号：</span>
                        <span className="item-right">{addcanBackMoneyDetail.outOrderId}</span>
                    </div>
                    <div className="addmoneyback-top-item">
                        <span className="item-left">上课学员：</span>
                        <span className="item-right">{addcanBackMoneyDetail.trackName}</span>
                    </div>
                    <div className="addmoneyback-top-item">
                        <span className="item-left">课程：</span>
                        <span className="item-right">{addcanBackMoneyDetail.itemName}</span>
                    </div>
                    <div className="addmoneyback-top-item">
                        <span className="item-left">班次：</span>
                        <span className="item-right">{addcanBackMoneyDetail.itemSkuName}</span>
                    </div>
                    <div className="addmoneyback-top-item">
                        <span className="item-left">应付金额：</span>
                        <span className="item-right">{addcanBackMoneyDetail.amount}</span>
                    </div>
                    <div className="addmoneyback-top-item">
                        <span className="item-left">已付金额：</span>
                        <span className="item-right">{addcanBackMoneyDetail.payAmount ? addcanBackMoneyDetail.payAmount : 0}</span>
                    </div>
                </div>
                <Form layout="horizontal" className="addmoneyback-form">
                    <FormItem label="回款时间：" {...FormItemLayout} hasFeedback>
                        <LocaleProvider locale={zh_CN}>
                            {getFieldDecorator('moneyBackTime', {
                                rules: [{ required: true, message: '回款时间不能为空' }],
                            })(
                                <DatePicker
                                    className="moneyBackTime"
                                    showTime
                                    placeholder="回款时间"
                                    onChange={this.moneyBackTime}
                                    format="YYYY-MM-DD HH:mm"
                                />
                            )}
                        </LocaleProvider>
                    </FormItem>
                    <FormItem label="回款金额：" {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('refund', {
                            rules: [{ required: true, message: '回款金额不能为空' }],
                        })(
                            <InputNumber
                                min={0}
                                max={parseFloat(getNum(parseFloat(addcanBackMoneyDetail.amount ? addcanBackMoneyDetail.amount : 0) - parseFloat(addcanBackMoneyDetail.payAmount ? addcanBackMoneyDetail.payAmount : 0)))}
                                style={{ width: '200px' }}
                                placeholder="请输入"
                            />
                        )}
                        {/*<span style={{marginLeft: '10px'}}>元</span>*/}
                    </FormItem>
                    <div id="backType">
                        <FormItem key='subjectVals' label="回款类型："
                            validateStatus={this.state.backTypeState}
                            help={this.state.backTypeHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('backType', {
                                rules: [{ required: true, message: '回款类型不能为空' }],
                            })(
                                <Select
                                    showSearch
                                    placeholder="请选择回款类型"
                                    getPopupContainer={() => document.getElementById('backType')}
                                    onChange={this.choosebackType}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option key="0" alue="0">全款</Option>
                                    <Option key="1" alue="1">订金</Option>
                                    <Option key="2" alue="2">尾款</Option>
                                    <Option key="99" alue="99">其他</Option>
                                </Select>
                            )}
                        </FormItem>
                    </div>
                    <div id="payType">
                        <FormItem key='subjectVals' label="付款方式："
                            validateStatus={this.state.payTypeState}
                            help={this.state.payTypeHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('payType', {
                                rules: [{ required: true, message: '付款方式不能为空' }],
                            })(
                                <Select
                                    showSearch
                                    placeholder="请选择付款方式"
                                    getPopupContainer={() => document.getElementById('payType')}
                                    onChange={this.choosepayType}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {/*<Option key="0" value="开课吧-支付宝">开课吧-支付宝</Option>*/}
                                    {/*<Option key="1" value="微信">微信</Option>*/}
                                    <Option key="7" value="7">开课吧-支付宝</Option>
                                    <Option key="8" value="8">开课吧-微信</Option>
                                    <Option key="6" value="6">开课吧-工行</Option>
                                    <Option key="2" value="2">贷款</Option>
                                    <Option key="3" value="3">腾讯课堂</Option>
                                    <Option key="4" value="4">网易云课堂</Option>
                                    {/*<Option key="5" value="5">芝士分期贷款</Option>*/}

                                </Select>
                            )}
                        </FormItem>
                    </div>
                    <FormItem label="付款凭证"
                        validateStatus={null} help='' {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('voucherImg', {
                            rules: [{ required: true, message: '请上传付款凭证' }],
                        })(
                            <div className="">
                                <Upload
                                    className="voucherImg"
                                    listType="picture-card"
                                    fileList={courseImage}
                                    customRequest={this.uploadCourseThumbnail}
                                    onRemove={this.onRemove}
                                    onPreview={this.onPreviews}
                                >
                                    {courseImage.length >= 3 ? null : uploadButton}
                                </Upload>
                                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                </Modal>
                            </div>
                        )}
                    </FormItem>
                    <FormItem className="addbackremark" label="备注" {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('remark', {
                            rules: [{ required: false, message: '备注不能为空' }],
                        })(
                            <TextArea rows={2} placeholder="请输入" />
                        )}
                    </FormItem>

                </Form>
            </div>
        )
    }
}

const CollectionCreateForm = Form.create()(RefundModal);
export default CollectionCreateForm;
