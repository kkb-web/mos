import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;

const { TextArea } = Input;

class CustomizedForm extends Component{
    state = {
        autoCompleteResult: [],
    };
    constructor(props){
        super(props);
    }

    render(){
        const { visible, onCancel, onCreate, form, okText, title, onRemarkCheck, titleState, titleHint} = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={visible}
                title={title}
                okText={okText}
                onCancel={onCancel}
                onOk={onCreate}
            >
                <div style={{textAlign: 'center'}} id="input">
                    <FormItem validateStatus={titleState} help={titleHint} hasFeedback>
                    {getFieldDecorator('remark')(
                        <TextArea rows={4} onChange={onRemarkCheck}/>
                    )}
                    </FormItem>
                </div>
            </Modal>
        );
    }
}

const CollectionCreateForm = Form.create()(CustomizedForm);
export default CollectionCreateForm;
