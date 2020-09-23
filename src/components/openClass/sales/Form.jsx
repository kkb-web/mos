import React, { Component } from 'react';
import './Form.less';

import { Row, Col, Input, Select, InputNumber, Button, Card} from 'antd';

import FormTable from './FormTable';
import {getHeaders} from "../../../utils/filter";
import {axiosInstance} from "../../../utils/global-props";

const Option = Select.Option;

let originData = '';
let remarks = [];
let customCondition = {
    pv: null,
    channel: null,
    keyWords: null,
    liveDuration: null,
    replayDuration: null,
    mobile: null
};
let applyData = {
    size: 10,
    current: 1,
    orderByField: 'signupTime',
    asc: false,
    condition: {
        open_course_id: null
    },
    customCondition: customCondition
};

export default class UForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            visible: false, //新建窗口隐藏
            dataSource: [],
            dataAll: '',
            count: null,
            tableRowKey: 0,
            isUpdate: false,
            loading: true,
            data: {
                channel: [],
                liveDuration: [],
                mobile: [],
                replayDuration: [],
                pv: []
            }
        };
    }

    // 获取学员列表信息
    getMemberInfo = () => {
        axiosInstance.post({
            url: '/opencourse/statisticsOpenCourseUser/list',
            data: applyData,
            headers: getHeaders()
        }).then(function (response) {
            console.log(response);
            originData = response.data.data;
            this.setState({
                dataSource: response.data.data.records,
                count: response.data.data.records.length,
                loading: false,
                dataAll: response.data.data
            });
        }.bind(this));
    };

    // 渲染
    componentDidMount(){
        let data = {
          id:212
        };
        // fssionWightList(data).then(res=>{
        //
        // }).catch(err=>{
        //
        // });
        let _this = this;
        axiosInstance.get({
            url: '/opencourse/statisticsOpenCourseUser/condition/' + window.location.pathname.slice(12),
            headers: getHeaders()
        }).then(function (res) {
            _this.setState({
                data: res.data.data
            });
            console.log(_this.state.data)
        });
        customCondition.keyWords = null;
        customCondition.pv = null;
        customCondition.channel = null;
        customCondition.liveDuration = null;
        customCondition.replayDuration = null;
        customCondition.mobile = null;
        applyData.condition.open_course_id = window.location.pathname.slice(12);
        this.getMemberInfo();
    };

    // 接受新建表单数据
    saveFormRef = (form) => {
        this.form = form;
    };

    onDelete = (id) => {
        console.log(id)
    };

    // 搜索
    searchUser = () => {
        let inputUser = document.getElementById('search');
        customCondition.keyWords = inputUser.value;
        this.setState({
            loading: true,
        });
        applyData.current = 1;
        this.getMemberInfo();
    };

    onValueChange = (value) => {
        console.log(value)
    };

    handleChange = (e) => {
        console.log(e)
    };

    handleFocus = (e) => {
        console.log(e)
    };

    handleBlur = (e) => {
        console.log(e)
    };

    render(){
        const { dataSource, visible, loading } = this.state;
        return(
            <div className="open-course-sale" style={{margin: "0 30px"}}>
                <Card title="销售情况" style={{ marginBottom: 24 }} bordered={false}>
                    <Row gutter={16} style={{marginBottom: '20px'}}>
                        <Col className="gutter-row" sm={6}>
                            <Select
                                className="select-sale"
                                showSearch
                                placeholder="Select a person"
                                optionFilterProp="children"
                                onChange={this.handleChange}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                <Option value="jack">Jack</Option>
                                <Option value="lucy">Lucy</Option>
                                <Option value="tom">Tom</Option>
                            </Select>
                        </Col>
                        <Col className="gutter-row" sm={3}>
                            <InputNumber min={1} max={100} defaultValue={10} onChange={this.onValueChange} />
                        </Col>
                        <Col className="gutter-row" sm={3}>
                            <Button type="primary" style={{marginRight: '20px'}}
                                    onClick={this.searchUser}>确认添加</Button>
                        </Col>
                    </Row>
                    <FormTable
                        dataSource={dataSource}
                        checkChange={this.checkChange}
                        changeSore={this.changeSore}
                        onDelete={this.onDelete}
                        loading={loading}
                        onChange={this.changeSore}
                    />
                </Card>
            </div>
        )
    }
}
