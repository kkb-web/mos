import React from 'react';
import {Button, Popconfirm, Table, Pagination, LocaleProvider, message, Icon, Modal} from 'antd';
import './index.less'
import zh_CN from "antd/lib/locale-provider/zh_CN";
import {formatDateTime} from "../../../utils/filter";
import AddText from './AddText';
import {
    addText,
    cancelCollectTemplate, checkName,
    collectTemplate,
    deleteTemplate,
    editText,
    getTextList
} from "../../../api/marketApi";
import Ellipsis from "ant-design-pro/lib/Ellipsis";

let params = {
    size: 40,
    current: 1,
    descs: ['createTime'],
    ascs: null
};

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
            shelves: '', //上下架
            id: null,
            info: '0',
            title: '',
            content: '',
            disableBtn: true,
            status: 'add',
            changeInputValue: false
        };
    }

    // 获取文字列表
    getTextList = () => {
        this.setState({
            loading: true
        });
        getTextList(params).then(res => {
            console.log(res.data.data, "=========文字列表");
            if(res.data.code === 0){
              this.setState({
                  dataAll: res.data.data,
                  dataSource: res.data.data.records
              })
            }

            this.setState({
              loading: false
            })

        })
    };

    // 渲染
    componentDidMount() {
        this.getTextList();
    }

    // 点击新建按钮
    addClick = () => {
        this.setState({
            visible: true,
            disableBtn: true,
            status: 'add',
            id: 0
        });
        this.form.setFieldsValue({
            name: '',
            content: ''
        });
    };

    // 编辑文字模板
    editText = (record) => {
        console.log(record, "=======编辑文字模板");
        this.setState({
            visible: true,
            disableBtn: false,
            status: 'edit',
            id: record.id,
            title: record.name,
            content: record.content
        });
        this.form.setFieldsValue({
            name: record.name,
            content: record.content
        });
    };

    // 保存
    addText = () => {
        this.setState({
            disableBtn: true
        });
        this.form.validateFields((err, value) => {
            if (this.state.status === 'add') {
                addText({
                    name: value.name,
                    content: value.content,
                    msgType: 'text',
                    business:'TEMPLATE'
                }).then(res => {
                    console.log(res);
                    if (res.data.code === 0) {
                        message.success('保存成功');
                        this.setState({
                            visible: false,
                            disableBtn: true,
                            title: '',
                            content: ''
                        });
                        params.current = 1;
                        this.getTextList();
                    } else {
                        message.error(res.data.msg);
                        this.setState({
                            visible: false,
                            disableBtn: false
                        });
                    }
                })
            } else {
                editText({
                    id: this.state.id,
                    name: this.state.title,
                    content: this.state.content,
                    msgType: 'text'
                }).then(res => {
                    if (res.data.code === 0) {
                        message.success('保存成功');
                        this.setState({
                            visible: false,
                            disableBtn: true,
                            title: '',
                            content: ''
                        });
                        this.getTextList();
                    } else {
                        message.error(res.data.msg);
                        this.setState({
                            visible: false,
                            disableBtn: false
                        });
                    }
                })
            }
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

    // 排序
    changeSore = (record, filters, sorter) => {
        params.ascs = (sorter.order === "ascend" ? [sorter.field] : []);
        params.descs = (sorter.order === "ascend" ? [] : [sorter.field]);
        params.current = 1;
        // 排序后，恢复排序时，数据应当保持和默认一致；
        let arr = Object.keys(sorter); //此方法为ES6新方法，返回值是对象中属性名组成的数组；
        if(arr.length == 0){
            params.descs = ['createTime'];
        }
        this.getTextList();
    };

    // 改变页码
    onChangePage = (page, pageSize) => {
        params.current = page;
        params.size = pageSize;
        this.getTextList();
    };

    // 改变每页条数
    onShowSizeChange = (current, pageSize) => {
        params.current = current;
        params.size = pageSize;
        this.getTextList();
    };

    showTotal = (total) => {
        return `共 ${total} 条数据`;
    };

    // 收藏
    onStore = (record) => {
        if (record.collectId) {
            cancelCollectTemplate({collectId: record.collectId}).then(res => {
                if (res.data.code === 0) {
                    message.success("取消收藏");
                    this.getTextList();
                } else {
                    message.error("取消收藏失败");
                }
            })
        } else {
            collectTemplate({templateId: record.id,business:'TEMPLATE'}).then(res => {
                if (res.data.code === 0) {
                    message.success("收藏成功");
                    this.getTextList();
                } else {
                    message.error("收藏失败");
                }
            })
        }
    };

    //删除
    onDelete = (id) => {
        deleteTemplate({templateId: id}).then(res => {
            if (res.data.code === 0) {
                message.success("删除成功");
                this.getTextList()
            } else {
                message.error("删除失败");
            }
        })
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
        console.log({templateId: this.state.id, name: this.state.title});
        checkName({
            templateId: this.state.id,
            name: this.state.title
        }).then(res => {
            console.log(res.data)
        })
    };

    render() {
        const columns = [{
            title: '模板名称',
            dataIndex: 'name',
            width: 90,
            render: (dataIndex) => <Ellipsis tooltip lines={3}>{dataIndex}</Ellipsis>

        },{
            title: '内容详情',
            dataIndex: 'content',
            width: 340,
            render: (dataIndex) => dataIndex === null ? <span>/</span> : <Ellipsis tooltip lines={3}>{dataIndex}</Ellipsis>
        },{
            title: '创建时间',
            dataIndex: 'createTime',
            sorter: (a, b) => a.createTime - b.createTime,
            width: 80,
            render: (dataIndex) => {
                return formatDateTime(dataIndex)
            }
        },{
            title: '创建者',
            dataIndex: 'createBy',
            width: 70,
            render: (dataIndex) => dataIndex === null ? <span>/</span> : <span>{dataIndex}</span>
        },{
            title: '收藏',
            dataIndex: 'collectId',
            sorter: (a, b) => a.collectId - b.collectId,
            width: 70,
            render: (dataIndex) => {
                return dataIndex ? <span style={{color: '#009900'}}>已收藏</span> : <span style={{color: '#FF6600'}}>未收藏</span>
            }
        },{
            title: '操作',
            dataIndex: 'opera',
            width: 120,
            render: (text, record) =>
                <div>
                    <span className="text-opera" style={{color: 'rgb(35, 82, 124)', marginLeft: '5px'}} onClick={() => this.onStore(record)}>
                        {record.collectId ? '取消收藏' : '收藏'}
                    </span>
                    {record.isDelete === 1 ?
                    <span className="text-opera" style={{color: 'rgb(35, 82, 124)', marginLeft: '5px'}} onClick={this.editText.bind(this, record)}>
                            编辑
                    </span>:
                    <span style={{color: '#888', marginLeft: '5px'}}>
                            编辑
                    </span>}
                    {record.isDelete === 1 ?
                        <Popconfirm title="确定要删除吗？" placement="topRight" okText="确定" cancelText="取消" icon={<Icon type="close-circle" theme="filled" style={{color:'red'}}/>} onConfirm={() => this.onDelete(record.id)}>
                            <span className="text-opera" style={{color: 'rgb(35, 82, 124)', marginLeft: '5px'}}>
                                删除
                            </span>
                        </Popconfirm> :
                        <span style={{color: '#888', marginLeft: '5px'}}>
                            删除
                        </span>}
                </div>
        }];
        let {disableBtn, info, dataSource, loading} = this.state;
        return(
            <div className="textBox">
                <Button type="primary" onClick={this.addClick}>新建</Button>
                <Table
                    key ={record => record.id}
                    rowKey={record => record.id}
                    columns={columns}
                    dataSource={dataSource}
                    bordered={false}
                    scroll={{x:'100%'}}
                    className='textTable'
                    loading={loading}
                    pagination={false}
                    onChange={this.changeSore}
                />
                <div style={{overflow: 'hidden'}}>
                    <LocaleProvider locale={zh_CN}>
                        <Pagination showSizeChanger onShowSizeChange={this.onShowSizeChange}
                                    onChange={this.onChangePage}
                                    defaultPageSize = {40}
                                    total={this.state.dataAll.total}
                                    showTotal={this.showTotal.bind(this.state.dataAll.total)}
                                    current={params.current}/>
                    </LocaleProvider>
                </div>
                <AddText ref={this.saveFormRef} visible={this.state.visible} onCancel={this.handleCancel} checkTextName={this.checkTextName}
                         onOk={this.addText} disableBtn={disableBtn} changeContent={this.changeContent} changeTitle={this.changeTitle} info={info}/>
            </div>
        );
    }
}

export default Text;
