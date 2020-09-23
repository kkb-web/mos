import React from 'react';
import BreadcrumbCustom from '../../common/BreadcrumbCustom';
import {Form, Button, Card, Modal, Row, Col, Input, Checkbox, Table, message} from 'antd';
import history from '../../common/History';
import {connect} from "../../../utils/socket";
import {getToken} from "../../../utils/filter";
import {getAuthorList, getSubjectList, addRole, checkRole} from "../../../api/roleApi";

const FormItem = Form.Item;
const {TextArea} = Input;

let permissionIdList = [];
let selfList = [];
let subjects = [];

class Local extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            titleState: '',
            titleHint: '',
            desState: '',
            desHint: '',
            bordered: false,
            pagination: false,
            data: [],
            subjects: [],
            columns: [],
            visible: false,
            disableBtn: false
        };
    }

    // 组件渲染之前，请求权限列表，以画表
    componentWillMount () {
        getAuthorList().then(res => {
            console.log(res.data.data, "=======权限列表");
            this.setState({
                data: res.data.data
            });
            console.log(this.state.data)
        });

    }

    // 组件渲染
    componentDidMount () {
        permissionIdList = [];
        selfList = [];
        subjects = [];
        // 画表
        this.createColumn();
        //链接websocket
        connect(getToken('username'));
        //end
    };

    // 定义表的行和列
    createColumn = () => {
        let columns = [];
        columns = [{
            title: <span><Checkbox onChange={this.onCheckAllChange.bind(this, 'autority')}
                                   onClick={this.sendAllId}
                                   className='autorityAll'/><span>全部权限</span></span>,
            dataIndex: 'name',
            key: 'name',
            render: (dataIndex, record, i) => {
                return <span>
                        <Checkbox onClick={this.changeValue.bind(this, 'autority', i, record.id)}
                                  onChange={this.sendId.bind(this, i, record.id)}
                                  className='autority'/>
                        <span>{dataIndex}</span>
                    </span>
            }
        },{
            title: <span><Checkbox onChange={this.onCheckAllChange.bind(this, 'self')}
                                   onClick={this.sendAllSelf}
                                   className='selfAll'/><span>仅见自己</span></span>,
            dataIndex: 'self',
            key: 'self',
            render: (dataIndex, record, i) => {
                return <Checkbox onClick={this.changeValue.bind(this, 'self', i, record.id)}
                                 disabled={record.data === 0}
                                 onChange={this.sendSelf.bind(this, i, record.id)}
                                 className="self"/>
            }
        },{
            title: <span><Checkbox onChange={this.onCheckAllChange.bind(this, 'all')}
                                   onClick={this.sendAllSubject}
                                   className='subjects-all subjectAll allAll'/><span>全部学科</span></span>,
            dataIndex: 'all',
            key: 'all',
            render: (dataIndex, record, i) => {
                return <Checkbox onClick={this.changeValue.bind(this, 'all', i, record.subject)}
                                 disabled={record.subject === 0}
                                 onChange={this.sendSubjects.bind(this, 'author_' + i, record.id)}
                                 className={"subjects-all all all_" + i}/>
            }
        }];
        getSubjectList().then(res => {
            this.setState({
                subjects: res.data.data
            });
            console.log(res.data.data, "========学科列表");
            for (let j = 0; j < this.state.subjects.length; j++) {
                columns.push({
                    title: <span><Checkbox className={'all-title alls_' + this.state.subjects[j].id + 'All'}
                                           onClick={this.changeSubValue.bind(this, 'all-title', j, this.state.subjects[j].id)}
                                           onChange={this.onCheckAllChange.bind(this, 'alls_' + this.state.subjects[j].id)}/><span>{this.state.subjects[j].name}</span></span>,
                    dataIndex: this.state.subjects[j].name,
                    key: this.state.subjects[j].id,
                    render: (dataIndex, record, i) => {
                        return <Checkbox onClick={this.changeValue.bind(this, 'alls_' + this.state.subjects[j].id, i, this.state.subjects[j].id)}
                                         onChange={this.sendSubject.bind(this, i, record.id, 'alls_' + this.state.subjects[j].id, this.state.subjects[j].id)}
                                         disabled={record.subject === 0} className={'alls_' + this.state.subjects[j].id + ' alls author_' + i}/>
                    }
                })
            }
            this.setState({
                columns: columns
            })
        });
    };

    // 表头的checkbox change事件，用于选中一列
    onCheckAllChange = (name, e) => {
        let spans = document.querySelectorAll('.' + name + ' .ant-checkbox');
        let checks = document.querySelectorAll('.' + name + ' input');
        if (e.target.checked) {
            for (let i = 0; i < checks.length; i++) {
                checks[i].checked = true;
                spans[i].classList.add('ant-checkbox-checked')
            }
        } else {
            for (let i = 0; i < checks.length; i++) {
                checks[i].checked = false;
                spans[i].classList.remove('ant-checkbox-checked')
            }
        }
        if (name === 'all') {
            let span = document.querySelectorAll('.alls .ant-checkbox');
            let check = document.querySelectorAll('.alls input');
            let spanTag = document.querySelectorAll('.all-title .ant-checkbox');
            let checkTag = document.querySelectorAll('.all-title input');
            if (e.target.checked) {
                for (let j = 0; j < check.length; j++) {
                    check[j].checked = true;
                    span[j].classList.add('ant-checkbox-checked')
                }
                for (let k = 0; k < checkTag.length; k++) {
                    checkTag[k].checked = true;
                    spanTag[k].classList.add('ant-checkbox-checked')
                }
            } else {
                for (let j = 0; j < check.length; j++) {
                    check[j].checked = false;
                    span[j].classList.remove('ant-checkbox-checked')
                }
                for (let k = 0; k < checkTag.length; k++) {
                    checkTag[k].checked = false;
                    spanTag[k].classList.remove('ant-checkbox-checked')
                }
            }
        }
    };

    // 表中每个checkbox check的事件，用于选中时添加数据到请求列表中
    changeValue = (name, i, permissionId, e) => {
        // console.log(name, i, permissionId, e);
        let spans = document.querySelectorAll('.' + name + ' .ant-checkbox');
        let checks = document.querySelectorAll('.' + name + ' input');
        if (e.target.checked) {
            checks[i].checked = true;
            spans[i].classList.add('ant-checkbox-checked');
        } else {
            let titleAll = document.querySelector('.' + name + 'All .ant-checkbox');
            titleAll.checked = false;
            titleAll.classList.remove('ant-checkbox-checked');
            if (name !== 'autority' && name !== 'self') {
                let subjectAll = document.querySelector('.subjectAll .ant-checkbox');
                let all = document.querySelector('.all_' + i + ' .ant-checkbox');
                all.checked = false;
                all.classList.remove('ant-checkbox-checked');
                subjectAll.checked = false;
                subjectAll.classList.remove('ant-checkbox-checked');
            }
            checks[i].checked = false;
            spans[i].classList.remove('ant-checkbox-checked');
        }
    };

    // 所有学科的change事件
    changeSubValue = (name, i, subjectId, e) => {
        // console.log(name, i, subjectId, e);
        // subjects = [];
        let spans = document.querySelectorAll('.' + name + ' .ant-checkbox');
        let checks = document.querySelectorAll('.' + name + ' input');
        if (e.target.checked) {
            checks[i].checked = true;
            spans[i].classList.add('ant-checkbox-checked');
            for (let i = 0; i < this.state.data.length; i++) {
                subjects.push({
                    permissionId: this.state.data[i].id,
                    subjectId: subjectId
                })
            }
        } else {
            let alls = document.querySelectorAll('.subjects-all .ant-checkbox');
            for (let j = 0; j < alls.length; j++) {
                alls[j].checked = false;
                alls[j].classList.remove('ant-checkbox-checked');
            }
            checks[i].checked = false;
            spans[i].classList.remove('ant-checkbox-checked');
            for (let i = 0; i < this.state.data.length; i++) {
                for (let j in subjects) {
                    if (subjects[j].permissionId === this.state.data[i].id && parseInt(subjects[j].subjectId) === parseInt(subjectId)) {
                        subjects.splice(j, 1)
                    }
                }
            }
        }
        // console.log(subjects, "=========subjectList")
    };

    // 获取选中权限的所有id
    sendAllId = (e) => {
        console.log(e);
        permissionIdList = [];
        if (e.target.checked) {
            for (let i = 0; i < this.state.data.length; i++) {
                permissionIdList.push(this.state.data[i].id)
            }
        } else {
            permissionIdList = []
        }
        // console.log(permissionIdList, "+++++++++list");
    };

    // 获取选中权限的所有学科
    sendSubjects = (name, id, e) => {
        let spans = document.querySelectorAll('.' + name + ' .ant-checkbox');
        let checks = document.querySelectorAll('.' + name + ' input');
        if (e.target.checked) {
            for (let j = 0; j < this.state.subjects.length; j++) {
                subjects.push({
                    permissionId: id,
                    subjectId: this.state.subjects[j].id
                })
            }
            console.log(subjects, "========353")
            for (let i = 0; i < checks.length; i++) {
                checks[i].checked = true;
                spans[i].classList.add('ant-checkbox-checked')
            }
        } else {
            let allTitle = document.querySelectorAll('.all-title .ant-checkbox');
            for (let k = 0; k < allTitle.length; k++) {
                allTitle[k].checked = false;
                allTitle[k].classList.remove('ant-checkbox-checked');
            }
            for (let i = 0; i < checks.length; i++) {
                checks[i].checked = false;
                spans[i].classList.remove('ant-checkbox-checked')
            }
            for (let j = 0; j < this.state.subjects.length; j++) {
                for (let i in subjects) {
                    if (subjects[i].permissionId ===  id && subjects[i].subjectId.toString() === this.state.subjects[j].id.toString()) {
                        subjects.splice(i, 1);
                    }
                }
            }
        }
    };

    // 获取所有尽自己可见的列
    sendAllSelf = (e) => {
        selfList = [];
        if (e.target.checked) {
            for (let i = 0; i < this.state.data.length; i++) {
                selfList.push({
                    permissionId: this.state.data[i].id,
                    self: 1
                })
            }
        } else {
            selfList = []
        }
        console.log(selfList, "+++++++++selfList")
    };

    // 获取所有学科id
    sendAllSubject = (e) => {
        subjects = [];
        if (e.target.checked) {
            for (let i = 0; i < this.state.subjects.length; i++) {
                for (let j = 0; j < this.state.data.length; j++) {
                    subjects.push({
                        permissionId: this.state.data[j].id,
                        subjectId: this.state.subjects[i].id
                    })
                }
            }
        } else {
            subjects = []
        }
        // console.log(subjects, "+++++++subjectsList")
    };

    // 获取表中选中权限的id
    sendId = (i, permissionId, e) => {
        console.log(i, permissionId, e);
        if (e.target.checked) {
            permissionIdList.push(permissionId)
        } else {
            permissionIdList.splice(permissionIdList.indexOf(permissionId), 1)
        }
        console.log(permissionIdList, "+++++++++list");
    };

    // 获取表中选中仅自己的id
    sendSelf = (i, permissionId, e) => {
        console.log(i, permissionId, e);
        if (e.target.checked) {
            selfList.push({
                permissionId: permissionId,
                self: 1
            })
        } else {
            for (let i in selfList) {
                if (selfList[i].permissionId === permissionId) {
                    selfList.splice(i, 1)
                }
            }
        }
        console.log(selfList, '++++++++selfList')
    };

    // 获取表中选中学科的id
    sendSubject = (i, permissionId, name, id, e) => {
        console.log(i, permissionId, e);
        if (e.target.checked) {
            subjects.push({
                permissionId: permissionId,
                subjectId: id
            })
        } else {
            for (let i in subjects) {
                console.log(subjects[i], permissionId, id, "========12345");
                if (subjects[i].permissionId === permissionId && subjects[i].subjectId.toString() === id.toString()) {
                    subjects.splice(i, 1);
                    console.log(subjects[i])
                }
            }
        }
        console.log(subjects)
    };

    // 角色名称检查
    titleCheck = (e) => {
        if (e.target.value.length > 15) {
            this.setState({
                titleState: 'error',
                titleHint: '名称不得超过15字'
            })
        } else if (e.target.value.length === 0) {
            this.setState({
                titleState: 'error',
                titleHint: '名称不能为空'
            })
        } else {
            this.setState({
                titleState: 'success',
                titleHint: ''
            })
        }
    };

    // 描述信息检查
    desCheck = (e) => {
        if (e.target.value.length > 50) {
            this.setState({
                desState: 'error',
                desHint: '名称不得超过50字'
            })
        } else if (e.target.value.length === 0) {
            this.setState({
                desState: '',
                desHint: ''
            })
        } else {
            this.setState({
                desState: 'success',
                desHint: ''
            })
        }
    };

    // 检查角色名是否重复
    checkRole = (e) => {
        console.log(e.target.value)
        if(e.target.value !== '') {
            checkRole(e.target.value).then(res => {
                if (res.data.code === 0) {
                    this.setState({
                        titleState: '',
                        titleHint: ''
                    })
                } else {
                    this.setState({
                        titleState: 'error',
                        titleHint: '用户名已存在'
                    })
                }
            })
        }
    };

    // 提交角色信息
    handleSubmit = () => {
        let apply = [];
        const { form: { validateFieldsAndScroll } } = this.props;
        validateFieldsAndScroll((errors, values) => {
            console.log(values, values.roleName, values.roleDes, "===表单输入数据");
            console.log(permissionIdList, selfList, subjects);
            if (!values.roleName) {
                this.setState({
                    titleState: 'error',
                    titleHint: '名称不能为空'
                })
            }
            let flag = null;
            for (let i = 0; i < permissionIdList.length; i++) {
                flag = false;
                for (let j = 0; j < selfList.length; j++) {
                    if (selfList[j].permissionId === permissionIdList[i]) {
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                    apply.push({
                        permissionId: permissionIdList[i],
                        self: 1,
                        subjects: []
                    });
                } else {
                    apply.push({
                        permissionId: permissionIdList[i],
                        self: 0,
                        subjects: []
                    });
                }
                for (let k = 0; k < subjects.length; k++) {
                    if (subjects[k].permissionId === permissionIdList[i]) {
                        apply[i].subjects.push(subjects[k].subjectId)
                    } else {
                        // alert(subjects[k].permissionId)
                    }
                }
            }
            let hash = {};
            apply = apply.reduce(function (item, next) {
                hash[next.permissionId] ? '' : hash[next.permissionId] = true && item.push(next);
                return item;
            }, []);
            let applyDes = {
                name: values.roleName,
                description: values.roleDes,
                details: apply
            };
            console.log(applyDes);
            if (permissionIdList.length > 0) {
                this.setState({
                    disableBtn: true,
                });
                addRole(applyDes).then(res => {
                    this.setState({
                        disableBtn: false
                    });
                    if (res.data.code === 0) {
                        message.success('创建成功！');
                        history.push('/app/authority/roles')
                    } else {
                        message.error(res.data.msg);
                    }
                })
            } else {
                if (values.roleName) {
                    message.warning('角色权限提示：您设置的选项中还有未勾选的权限，将无法进行对应的操作！')
                }
            }
        })
    };

    // 取消操作
    handleCancel = () => {
        const { form: { validateFields } } = this.props;
        validateFields((errors, values) => {
            console.log(values, values.roleName, values.roleDes, "===表单输入数据");
            if (values.roleName !== undefined || values.roleDes !== undefined || permissionIdList.length > 0 || selfList.length > 0 || subjects.length > 0) {
                this.setState({
                    visible: true
                })
            } else {
                history.push('/app/authority/roles')
            }
        })
    };

    // 取消时，点击模态弹窗确定事件
    handleOk = () => {
        history.push('/app/authority/roles')
    };

    // 取消时，点击模态弹窗取消事件
    handleTipCancel = () => {
        this.setState({
            visible: false
        })
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const FormItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 16},
        };
        const menus = [
            {
                path: '/app/dashboard/analysis',
                name: '首页'
            },
            {
                name: '系统管理',
                path: '/app/authority/roles'
            },
            {
                name: '角色权限',
                path: '/app/authority/roles'
            },
            {
                name: '新建角色',
                path: '#'
            }
        ];
        return (
            <div>
                <div className="page-nav">
                    <BreadcrumbCustom paths={menus}/>
                    <p className="title-style">新建角色</p>
                    <p className="title-describe">角色创建成功后，默认处于启用状态。</p>
                </div>
                <Card title="基本信息" style={{marginBottom: 24}} bordered={false}>
                    <Form layout="horizontal" style={{paddingBottom: '20px'}}>
                        <FormItem className="open-course-form" label="角色名称" validateStatus={this.state.titleState}
                                  help={this.state.titleHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('roleName', {
                                rules: [{required: true, message: '角色名称不能为空'}],
                            })(
                                <Input placeholder="要求简单易懂，控制在15字以内" onChange={this.titleCheck} onBlur={this.checkRole}/>
                            )}
                        </FormItem>
                        <FormItem className="open-course-form" label="简要描述（建议填写）" validateStatus={this.state.desState}
                                  help={this.state.desHint} {...FormItemLayout} hasFeedback>
                            {getFieldDecorator('roleDes', {
                                rules: [{required: false}],
                            })(
                                <TextArea placeholder="简要描述角色拥有的权限，控制在50字以内。" rows={4} onChange={this.desCheck}/>
                            )}
                        </FormItem>
                    </Form>
                </Card>
                <Card title="设置可查看及操作权限" style={{marginBottom: 24}} bordered={false}>
                    <Row>
                        <Col>
                            <div style={{float: 'right', marginBottom: '15px'}}>
                                <span>说明：</span>
                                <img src="https://img.kaikeba.com/introduce.png" alt=""/>
                                {/*<Checkbox checked/>*/}
                                {/*<span>选中</span>*/}
                                {/*<Checkbox checked={false}/>*/}
                                {/*<span>未选中</span>*/}
                                {/*<Checkbox disabled/>*/}
                                {/*<span>无学科之分，无需选择</span>*/}
                            </div>
                        </Col>
                    </Row>
                    {/*<RoleForm/>*/}
                    <Table
                        rowKey={(record, i) => i}
                        {...this.state}
                        columns={this.state.columns}
                        dataSource={this.state.data}
                    />
                </Card>
                <div className="upload-title bottom-btn">
                    <Button type="default" style={{marginRight: '20px'}} onClick={this.handleCancel}>取消</Button>
                    <Modal
                        title="提示"
                        okText="确定"
                        cancelText="取消"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleTipCancel}
                    >
                        <p>检测到表单中有修改的内容，确定要放弃编辑吗？</p>
                    </Modal>
                    <Button disabled={this.state.disableBtn} type="primary" onClick={this.handleSubmit}>提交</Button>
                </div>
                {/*</div>*/}
            </div>
        );
    }

}

const AddRoleForm = Form.create()(Local);
export default AddRoleForm;
