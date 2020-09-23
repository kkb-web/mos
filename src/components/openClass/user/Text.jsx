import React from 'react';
import {Button, Popconfirm, Table, Pagination, Modal, LocaleProvider, message, Icon, Input} from 'antd';
import zh_CN from "antd/lib/locale-provider/zh_CN";
import {formatDateTime} from "../../../utils/filter";
import { Link } from 'react-router-dom';
import AddText from '../../qrcode/resources/AddText';
import Ellipsis from "ant-design-pro/lib/Ellipsis";
import {addText, checkName} from "../../../api/marketApi";

const {TextArea} = Input;

class Text extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            userName: '', //名称
            visible: false, //新建窗口隐藏
            dataSource: [], //列表数据
            count: null,
            tableRowKey: 0,
            isUpdate: false,
            loading: true,
            dataAll: '', //返回的所有数据
            id: '',
            info: '0',
            title: '',
            content: '',
            disableBtn: true,
            changeInputValue: false
        };
    }

    // 点击新建按钮
    addClick = () => {
        this.setState({
            visible: true,
            disableBtn: true,
            id: 0
        });
        this.form.setFieldsValue({
            name: '',
            content: ''
        });
    };

    // 保存
    addText = () => {
        this.setState({
            disableBtn: true
        });
        this.form.validateFields((err, value) => {
            addText({
                name: value.name,
                content: value.content,
                msgType: 'text',
                business:'OPENCOURSE'
            }).then(res => {
                console.log(res);
                if (res.data.code === 0) {
                    message.success('保存成功');
                    this.setState({
                        visible: false,
                        disableBtn: false
                    });
                    document.querySelector('.text-click').click();
                } else {
                    message.error('保存失败');
                }
            })
        })
    };

    // 隐藏"新建文字消息模板"弹窗
    handleCancel = () => {
        let _this = this;
        if (this.state.changeInputValue) {
            Modal.confirm({
                title: <p style={{fontSize: '14px', lineHeight: '20px', color: '#999', fontWeight: 400}}>你还有正在新建的模板，确定要放弃吗？</p>,
                content: null,
                okText: '确定',
                cancelText: '取消',
                iconType: 'exclamation-circle',
                contentType: 'normal',
                onOk() {
                    _this.setState({
                        visible: false,
                        changeInputValue: false,
                        title: '',
                        content: ''
                    });
                }
            });
        } else {
            this.setState({
                visible: false
            });
        }
    };

    // 接受新建表单数据
    saveFormRef = (form) => {
        this.form = form;
    };

    // 改变标题
    changeTitle = (e) => {
        this.setState({
            title: e.target.value,
            changeInputValue: true
        });
        if (e.target.value !== '' && e.target.value.length <= 20 && this.state.content !== '' && this.state.content.length <= 600) {
            this.setState({
                disableBtn: false
            });
        } else {
            this.setState({
                disableBtn: true
            });
        }
    };

    // 改变内容
    changeContent = (e) => {
        let val = e.target.value;
        let length = val.length;
        this.setState({
            content: e.target.value,
            changeInputValue: true
        });
        length < 601 ? this.setState({info: length}) : '';
        if (this.state.title !== '' && this.state.title.length <= 20 && e.target.value !== '' && e.target.value.length <= 600) {
            this.setState({
                disableBtn: false
            });
        } else {
            this.setState({
                disableBtn: true
            });
        }
    };

    // 检查模板名称
    checkTextName = () => {
        checkName({
            templateId: this.state.id,
            name: this.state.title
        }).then(res => {
            console.log(res.data)
        })
    };

    render() {
        let {disableBtn, info} = this.state;
        const {changeContent, rightValue, changeText, dataSource, textData, onChangeTextPage, changeTitleStyle, page, contentLength} = this.props;
        return(
            <div style={{marginTop: '-25px'}}>
                <div className="left-text-modal">
                    <p>
                        <span className="text-title text-title_active" style={{cursor: 'pointer'}} onClick={() => changeTitleStyle(0)}>全部</span>
                        <span className="text-title" style={{marginLeft: '120px', cursor: 'pointer'}} onClick={() => changeTitleStyle(1)}>收藏</span>
                    </p>
                    <div className="left-text-content">
                        <div className="text-modal-title" style={{textAlign: 'left', padding: '0 20px'}}>
                            <div style={{marginTop: '15px'}}>
                            <span className="collect_cancel add-text-modal" onClick={this.addClick}>
                                <Icon type="plus" style={{marginRight: '5px'}}/>
                                新建模板
                            </span>
                            </div>
                            <p className="collect_cancel text-content self-content" style={{margin: '10px 0 6px'}} onClick={() => changeText({content: ''}, -1)}>自定义消息</p>
                            {
                                dataSource.length === 0 ?
                                    <p style={{textAlign: 'center', paddingTop: '50px'}}>暂无数据</p>:
                                    dataSource && dataSource.map((value, index) => {
                                        return (
                                            <Ellipsis key={index} tooltip lines={1} className="text-content text-template" style={{margin: '0 0 6px', color: index === 0 && page === 1 ? '#189ff0' : 'rgba(0, 0, 0, 0.65)'}}
                                                      onClick={() => changeText(value, index)}>{`${value.name} (${value.createBy})`}</Ellipsis>
                                        )
                                    })
                            }
                        </div>
                    </div>
                    <div style={{display: dataSource.length > 0 ? 'block' : 'none'}}>
                        <LocaleProvider locale={zh_CN}>
                            <Pagination style={{float: 'none'}}
                                        defaultPageSize={20}
                                        current={textData.current}
                                        onChange={onChangeTextPage}
                                        total={textData.total}/>
                        </LocaleProvider>
                    </div>
                </div>
                <div className="right-text-modal">
                    <p style={{textAlign: 'left', paddingLeft: '15px'}}>
                        <span>内容编辑文本框</span>
                    </p>
                    <div>
                        <TextArea placeholder={`#{UserName}同学你好，小助理发现你报了《#{OpenCourseName}》课，已经看了#{PlayDuration}，是不是对课程很感兴趣呢... 小助理这里有为你量身定制的学习计划和免费视频，快来加小助理微信吧~`} className="edit-text-right" value={rightValue} style={{height: 380, marginRight: 0, border: 'none'}} maxLength={600} onChange={changeContent}/>
                        <span style={{textAlign: 'right', display: 'block', background: '#f2f2f2'}}> 最多输入600字，{rightValue.length}/600</span>
                    </div>
                </div>
                <AddText ref={this.saveFormRef} visible={this.state.visible} onCancel={this.handleCancel} checkTextName={this.checkTextName}
                         onOk={this.addText} disableBtn={disableBtn} changeContent={this.changeContent} changeTitle={this.changeTitle} info={info}/>
            </div>
        );
    }
}

export default Text;
