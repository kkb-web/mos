import React, {Component} from 'react';
import './Form.less';
import {Row, message, Input, Button, Select, Pagination, LocaleProvider} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import {Link} from 'react-router-dom';
import BreadcrumbCustom from '../common/BreadcrumbCustom';
import FormTable from './FormTable';
import {urlCourseList, courseEnable, courseDisable} from "../../api/openCourseApi";
import {getToken, userAuthor} from "../../utils/filter";
import {connect} from "../../utils/socket";

const Search = Input.Search;
let params = {
    size: 40,
    current: 1,
    ascs: null,
    descs: ['createTime'],
    condition: {
        status: null,     // 上下架状态
        name: null,       // 公开课名称
        subjectIds: null    // 学科Id——来自子组件FormTable所属学科选项
    }
};

export default class UForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',   //名称
            visible: false, //新建窗口隐藏
            dataSource: [], //列表数据
            count: null,
            tableRowKey: 0, //列表多选框key
            isUpdate: false,
            loading: true,
            dataAll: '',    //返回的所有数据
            id: '',
            data: [],       // 渠道列表
            openCourseId: '',
            disableBtn: false,
            resetBtn: false
        };
    }

    //渲染
    componentDidMount() {
        params.current = 1;
        params.size = 40;
        params.condition.status = null;
        params.condition.name = null;
        params.condition.subjectIds = null;
        this.getOpenCourseList();
        //链接websocket
        connect(getToken('username'));
        //end
    }

    // 获取公开课列表信息
    getOpenCourseList = () => {
        urlCourseList(params).then(response => {
            this.setState({
                dataSource: response.data.data.records,
                count: response.data.data.records.length,
                loading: false,
                dataAll: response.data.data,
                disableBtn: false,
                resetBtn: false
            })
        })
    };


    //接受新建表单数据
    // saveFormRef = (form) => {
    //     this.form = form;
    // };

    // 排序+筛选
    changeSore = (record, filters, sorter) => {
        // 排序
        console.log(filters,"filters");
        console.log(sorter,"sorter");
        params.ascs = (sorter.order === "ascend" ? [sorter.field] : []);
        params.descs = (sorter.order === "ascend" ? [] : [sorter.field]);
        params.current = 1;
        // 排序后，恢复排序时，数据应当保持和默认一致；
        let arr = Object.keys(sorter); //此方法为ES6新方法，返回值是对象中属性名组成的数组；
        if(arr.length == 0){
            params.descs = ['createTime'];
        }
        // 所属学科筛选条件不为空时执行
        if(JSON.stringify(filters) !== "{}") {
            let array = [];
            for(let i = 0; i < filters.subjects.length; i++) {
                array.push(parseInt(filters.subjects[i]));
            }
            // 学科筛选时，创建时间默认排序
            params.descs = ['createTime'];
            params.condition.subjectIds = array;
        }
        this.getOpenCourseList();
    };

    // 展示公开课总条数
    showTotal = (total) => {
        return `共 ${total} 条数据`;
    };

    // 公海分流
    distriClick = (key) => {
        alert(key)
        message.warning('开发中，敬请期待...')
    };

    // 搜索
    handleChangeUserName = (value) => {
        params.condition.name = value.replace(/\s+/g,"");
        params.current = 1;
        this.setState({
            loading: true,
            disableBtn: true
        });
        this.getOpenCourseList();
    };

    // 搜索动态绑定输入框的值
    handleChangeName = (e) => {
        let data = e.target.value;
        this.setState({
            userName: e.target.value
        });
    };

    // 搜索重置
    resetValue = () => {
        params.condition.name = null;
        params.current = 1;
        this.setState({
            userName: '',
            loading: true,
            resetBtn: true
        });
        this.getOpenCourseList();
    };

    // 上下架搜索
    handleChange = (value) => {
        // 0 全部状态，1 已上架，2已下架
        params.condition.status = (value === '0' ? null : (value === '1' ? 1 : 0));
        params.current = 1;
        let status = value === '0' ? null : (value === '1' ? 1 : 0);
        this.setState({
            loading: true
        });
        this.getOpenCourseList();
    };

    // 改变页码
    handleChangePage = (page, pageSize) => {
        console.log("改变页码",page,pageSize);
        params.size = pageSize;
        params.current = page;
        this.getOpenCourseList();
    };

    // 改变每页条数
    handleShowSizeChange = (current, pageSize) => {
        console.log("改变每页条数",current,pageSize);
        params.size = pageSize;
        params.current = current;
        this.getOpenCourseList();
    };

    //切换上下架状态成功后，全局提示“上架成功/下架成功”
    hanleDelete = (id, status) => {
        this.setState({
            loading: true
        });
        if (status == 0) {
            courseEnable(id).then(() => {
                this.getOpenCourseList();
                message.success("上架成功");
            });
        }
        if (status == 1) {
            courseDisable(id).then(() => {
                this.getOpenCourseList();
                message.success("下架成功");
            });
        }
    };

    render() {
        const {userName, dataSource, visible, loading} = this.state;
        const {Option} = Select;
        const menus = [
            {
                path: '/app/dashboard/analysis',
                name: '首页'
            },
            {
                path: '#',
                name: '公开课'
            },
            {
                path: '#',
                name: '公开课列表'
            }
        ];
        return (
            <div className="launch-list">
                <div className="page-nav">
                    <BreadcrumbCustom paths={menus}/>
                    <p className="title-style">公开课列表</p>
                </div>
                <div className='formBody'>
                    <Row gutter={16}>
                        <div className='plus' style={{display: userAuthor('marketing:opencourse:manage') ? 'inline-block': 'none'}}>
                            <Link to={'/app/course/add'}><Button icon="plus" type="primary">新建</Button></Link>
                        </div>
                        <div className='btnOpera'>
                            <Button onClick={this.resetValue} disabled={this.state.resetBtn}>重置</Button>
                        </div>
                        <div className='btnOpera'>
                            {/*<Search*/}
                                {/*placeholder="搜索名称"*/}
                                {/*value={userName}*/}
                                {/*onChange={this.handleChangeUserName}*/}
                            {/*/>*/}
                            <Search
                                placeholder="搜索名称"
                                onSearch={this.handleChangeUserName}
                                onChange={this.handleChangeName}
                                enterButton
                                value={userName}
                                disabled={this.state.disableBtn}
                            />
                        </div>
                        <div className='btnOpera' id='area'>
                            <Select
                                className={"space"}
                                defaultValue="0"
                                onChange={this.handleChange}
                                getPopupContainer={() => document.getElementById('area')}
                            >
                                <Option value="0">全部状态</Option>
                                <Option value="1">已上架</Option>
                                <Option value="2">已下架</Option>
                            </Select>
                        </div>
                    </Row>
                    <FormTable
                        dataSource={dataSource}
                        checkChange={this.checkChange}
                        changeSore={this.changeSore}
                        editClick={this.editClick}
                        distriClick={this.distriClick}
                        onDelete={this.hanleDelete}
                        loading={loading}
                        id={this.state.tableRowKey}
                    />
                    <div style={{overflow: 'hidden'}}>
                        <LocaleProvider locale={zh_CN}>
                            <Pagination
                                showSizeChanger onShowSizeChange={this.handleShowSizeChange}
                                onChange={this.handleChangePage}
                                total={this.state.dataAll.total}
                                showTotal={this.showTotal.bind(this.state.dataAll.total)}
                                current={params.current}
                                pageSize={params.size}
                                defaultPageSize={40}
                            />
                        </LocaleProvider>
                    </div>
                    {/*<CollectionCreateForm*/}
                        {/*openCourseId={this.state.openCourseId}*/}
                        {/*data={this.state.data}*/}
                        {/*id={this.state.id}*/}
                        {/*ref={this.saveFormRef}*/}
                        {/*onCancel={this.handleCancel}*/}
                        {/*visible={visible}*/}
                        {/*title="推广"*/}
                        {/*style={{fontSize: '20px'}}*/}
                    {/*/>*/}
                </div>
            </div>
        )
    }
}
