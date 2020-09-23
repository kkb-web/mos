import React from 'react';
import {Modal, Form, Button, Table, Input} from 'antd';
import './index.less'

const FormItem = Form.Item;
const {TextArea} = Input;

class Local extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {visible, onCancel, onOk, disableBtn, changeContent, changeTitle, info, checkTextName} = this.props;
        const {getFieldDecorator} = this.props.form;
        return (
            <div>
                <Modal
                    title={"新建文字消息模板"}
                    visible={visible}
                    onCancel={onCancel}
                    onOk={onOk}
                    footer={[
                        <Button key="cancel" type="default" onClick={onCancel}>
                            取消
                        </Button>,
                        <Button key="submit" type="primary" disabled={disableBtn} onClick={onOk}>
                            保存
                        </Button>
                    ]}
                >
                        <Form layout="inline">
                            <FormItem label={'模板名称'}>
                                {getFieldDecorator('name', {
                                    rules: [{
                                        required: true, message: '请输入有效的内容'
                                    }, {
                                        max: 20, message: '模板名称最多20个字'
                                    }],
                                })(
                                    <Input autoComplete="off" placeholder={"建议15字以内"} onChange={changeTitle} onBlur={checkTextName}/>
                                )}
                            </FormItem>
                            <FormItem className={"tip"}>
                                <h6>可使用变量，会根据用户具体数据调取，包括以下：</h6>
                                <h6>{`#{UserName}用户名，#{OpenCourseName}课程名，`}</h6>
                                <h6>{`#{LivePlayDuration}直播时长，#{ReplayPlayDuration}回放时长`}</h6>
                                <h6>{`#{TotalPlayDuration}观看总时长`}</h6>
                            </FormItem>
                            <FormItem className={"textArea"}>
                                {getFieldDecorator('content', {
                                    rules: [{
                                        required: true, message: '请输入模板内容'
                                    }],
                                })(
                                    <TextArea placeholder={`#{UserName}同学你好，小助理发现你报了《#{OpenCourseName}》课，已经看了#{PlayDuration}，是不是对课程很感兴趣呢... 小助理这里有为你量身定制的学习计划和免费视频，快来加小助理微信吧~`} style={{height: 200, marginRight: 0}} maxLength={600} onChange={changeContent}/>
                                )}
                                <span style={{float: 'right', display: 'block'}}> 最多输入600字，{info}/600</span>
                            </FormItem>
                        </Form>
                </Modal>
            </div>
        );
    }
}

const AddText = Form.create()(Local);
export default AddText;