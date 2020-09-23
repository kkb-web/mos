import React, { Component } from 'react';
import { Modal, Form, Select, Input } from 'antd';
import {getDeviceList} from "../../../api/marketApi";

const FormItem = Form.Item;
const Option = Select.Option;

class CustomizedForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            autoCompleteResult: [],
            deviceList: []
        }
    }

    componentDidMount = () => {
        getDeviceList().then((response) => {
            console.log(response.data.data, "======设备列表");
            this.setState({
                deviceList: response.data.data
            });
            console.log(this.state.deviceList)
        });
    };

    render(){
        const { visible, onCancel, onCreate, form, okText, title, handleChange} = this.props;
        const { getFieldDecorator } = form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        const label = <span><span style={{color: 'rgba(255, 0, 0, 0.85)'}}>*</span> 设备IMEI</span>
        return (
            <Modal
                visible={visible}
                title={title}
                okText={okText}
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form layout="horizontal" className="model-select">
                    <FormItem label={label} {...formItemLayout} hasFeedback>

                        <Select
                            showSearch
                            placeholder="选择设备"
                            optionFilterProp="children"
                            onChange={handleChange}
                            notFoundContent="无匹配结果"
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {
                                this.state.deviceList && this.state.deviceList.map((value) => {
                                    return (<Option key={value.id} value={value.id}>{  value.type == null ? value.imei : value.imei + "-" + value.type }</Option>)
                                })
                            }
                        </Select>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

const CollectionCreateForm = Form.create()(CustomizedForm);
export default CollectionCreateForm;
