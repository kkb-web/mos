import React, { Component } from 'react';
import {
    Row, Col, Table, InputNumber, Button, Select, Pagination,
    LocaleProvider, Modal, message, Form, Input
} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import FormTable from './FormTable';
import CollectionCreateForm from './CustomizedForm';

import {visitorsList,addVisitor,getLaunchList,getMediaNameList,judgeMarketExists} from '../../../api/marketApi'

import {getSubjectList} from "../../../api/roleApi";

import {formatDateTime, openCourseUrl} from "../../../utils/filter";
import history from "../../common/History";
let rule = /^[0-9]*$/;

const FormItem = Form.Item;
let customCondition = {},
    sendDataVisitor = {};
let sendData = {
    size: 40,
    current: 1,
    descs: ["createTime"],
    ascs: [],
    condition: customCondition
};

export default class UForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            mediaId:null,
            mediaName:null,
            loading: true,
            friVisible: false,
            dataSource: [],
            dataAll: '',
            //媒体select
            fromMediaId:this.props.fromMediaId ? this.props.fromMediaId : null,
            //从投放页面点击投放次数默认选中当前媒体
            fromMediaName:this.props.fromMediaName ? this.props.fromMediaName : '0',
            mediaList:[],
            //学科list
            subjectList: [],
            //阅读量弹框
            browseVisible:false,
            visitorList:[],
            addVisitorVal:null,
            addVisitorState:'',
            addVisitorHint:'',
            visitTotal:'',
            adId:null,//广告id
            //获取链接
            linkVisible:false,
            visibleSet:false,
            qrId:null,
            tableRowKey: 0,
            isUpdate: false,
            marketExists:null,
            isOneQrCode:false,
            imgageId:''
        };
    }

    // 获取营销列表信息
    getLaunchInfo = () => {
        getLaunchList(sendData).then((response) =>{
            this.setState({
                dataSource: response.data.data.records,
                count: response.data.data.records.length,
                loading: false,
                dataAll: response.data.data
            });
        });
    };

    // 获取媒体列表
    getMedias = () => {
        getMediaNameList().then((response) => {
            if(response.data.code == 0){
                this.setState({
                    mediaList: response.data.data
                });
            }
        });

    };

    // 获取学科列表
    getSubjects = () => {
        console.log(1111)
        getSubjectList().then((response) => {
            this.setState({
                subjectList: response.data.data
            });
        });
    };
    // 媒体筛选
    chooseMedia = (value, e) => {
        console.log(e.key)
        if (e.key !== null) {
            customCondition.mediaId = e.key;
        } else {
            customCondition.mediaId = null;
        }
        sendData.current = 1;
        this.setState({
            loading: true,
        });
        this.getLaunchInfo();
    };

    // 学科筛选
    chooseSubject = (value, e) => {
        if (e.key !== null) {
            customCondition.subjectId = e.key;
        } else {
            customCondition.subjectId = null;
        }
        sendData.current = 1;
        this.setState({
            loading: true,
        });
        this.getLaunchInfo();
    };

    // 重置
    searchReset = () => {
        customCondition.mediaId = null;
        customCondition.subjectId = null;
        console.log(customCondition.mediaId,'customCondition.mediaId')
        this.setState({
            loading: true,
        });
        sendData.current = 1;
        this.getLaunchInfo();
        let selects = document.querySelectorAll('.ant-select-selection-selected-value');
        selects[0].innerHTML = '选择媒体名称';
        selects[1].innerHTML = '选择学科';
    };

    // 渲染
    componentDidMount(){
        customCondition.subjectId = null;
        customCondition.mediaId = null;

        if(this.props.fromMediaName && this.props.fromMediaId){
            customCondition.mediaId = this.props.fromMediaId;
        }

        this.getLaunchInfo();//获取投放列表
        this.getSubjects();//学科下拉
        this.getMedias(); //媒体下拉

    };

    componentWillUnmount() {
        sendData = {
            size: 40,
            current: 1,
            descs: ["createTime"],
            ascs: [],
            condition: customCondition
        };
    };

    // 排序
    changeSore = (record, filters, sorter) => {
        this.setState({
            loading:true
        });
        sendData.ascs = (sorter.order === "ascend" ? [sorter.field] : []);
        sendData.descs = (sorter.order === "ascend" ? [] : [sorter.field]);
        //排序后，恢复排序时，数据应当保持和默认一致；
        let arr = Object.keys(sorter); //此方法为ES6新方法，返回值是对象中属性名组成的数组；
        if(arr.length == 0){
            sendData.descs = ['createTime'];
        }

        this.getLaunchInfo();
    };

    // 改变页码
    onChangePage = (page, pageSize) => {
        sendData.size = pageSize;
        sendData.current = page;
        this.getLaunchInfo();
    };

    // 改变每页条数
    onShowSizeChange = (current, pageSize) => {
        sendData.size = pageSize;
        sendData.current = current;
        this.getLaunchInfo();
    };

    // 分页总共条数
    showTotal = (total) => {
        return `共 ${total} 条数据`;
    };

    //点击阅读量
    clickRead =(id)=>{
        this.setState({
            browseVisible:true,
            adId:id,
            addVisitorState:'',
            addVisitorHint:''
        });
        this.getVisitorsList(id);
    };

    getVisitorsList = (id)=>{
        sendDataVisitor = {
            id:id,
            size:5,
            current:1
        };
        visitorsList(sendDataVisitor).then((response) =>{
            if(response.data.code == 0){
                this.setState({
                    visitorList: response.data.data.records,
                    visitTotal:response.data.data
                });
            }
        });
    };
    // 改变页码
    onChangeReadPage = (page, pageSize) => {
        sendDataVisitor.size = pageSize;
        sendDataVisitor.current = page;
        this.getVisitorsList();
    };
    // 阅读table取消
    handleCancelBrowse=()=>{
        this.setState({
            browseVisible:false,
            addVisitorVal:null
        })
    };
    //获取添加浏览人数
    addVisitorChange =(value)=>{
        if (!rule.test(value)) {
            this.setState({
                addVisitorVal:value,
                addVisitorState: 'error',
                addVisitorHint: '请输入整数'
            })
        }else{
            this.setState({
                addVisitorVal:value,
                addVisitorState: 'success',
                addVisitorHint: ''
            })
        }
    };
    //添加浏览人数提交
    addBrowseNumber=()=>{
        let sendData = {
            id:this.state.adId,
            visitors:this.state.addVisitorVal
        };

        if(sendData.visitors && this.state.addVisitorVal){
            addVisitor(sendData).then((response) =>{
                message.success('浏览人数添加成功');
                this.setState({
                    browseVisible: false,
                    addVisitorVal:null
                });
                this.getLaunchInfo();
            });
        };
    };

    //点击付款截图
    clickPayment=(img)=>{
        window.open('https://img.kaikeba.com/'+ img)
    };
    //点击文章标题
    clickArticle =(link)=>{
        window.open(link);
    };
    //操作渠道
    clickChannel= (adId,id,name) => {
        let data = {adId: adId,id: id, name: name};
        history.push({pathname: '/app/qrcode/mediachannel', state: data});
    };
    //接受新建表单数据
    saveFormRef = (form) => {
        this.form = form;
    };
    clickLink= (key,mediaId,mediaName) => {
        this.setState({
            adId:key,
            mediaId:mediaId,
            mediaName:mediaName
        });

        //验证是否设置营销号
        let sendData = {
            id:key
        },
        _this = this;
        judgeMarketExists(sendData).then((response) =>{
            if(response.data.code == 0){
                _this.setState({
                    marketExists: response.data.data
                });
                if(response.data.data == true){
                    _this.setState({
                        linkVisible: true,
                        tableRowKey: key,
                        isUpdate: true,
                        isOneQrCode:false,
                        qrId: openCourseUrl() + "/weightQrcode/" + key
                    });
                }else if(response.data.data == false){
                    _this.setState({
                        visibleSet:true
                    })
                }else{
                    _this.setState({
                        linkVisible: true,
                        tableRowKey: key,
                        isUpdate: true,
                        isOneQrCode:true,
                        qrId: openCourseUrl() + "/weightQrcode/" + key,
                        imgageId: response.data.data
                    });
                }
            }
        });

    };
    handleCancelLink =()=>{
        this.setState({
            linkVisible:false,
            visibleSet:false,
        })
    };
    //点击去设置
    onOKToChannel = (adId,id,name)=>{
        let data = {adId: this.state.adId,id: this.state.mediaId, name: this.state.mediaName};
        history.push({pathname: '/app/qrcode/mediachannel', state: data});

    };
    clickEdit= (adId,id,name) => {
        let data = {adId: adId,id: id, name: name};
        history.push({pathname: '/app/qrcode/mediadetails', state: data})
    };


    render(){
        const { dataSource, loading, visitorList,linkVisible,visitTotal,visibleSet,fromMediaName,isOneQrCode,imgageId} = this.state;
        const { Option} = Select;
        const locale = {
            emptyText: '你要的数据如此珍稀，世界上并未发现'
        };

        const columnVisitorses = [{
            title: '浏览人数',
            dataIndex: 'visitors',
            render: (dataIndex) => {
                return dataIndex ? dataIndex: "/"
            }
        },{
            title: '修改时间',
            dataIndex: 'createTime',
            render: (dataIndex) => {
                return dataIndex === null ? "/" : formatDateTime(dataIndex)
            }
        },{
            title: '修改人',
            dataIndex: 'modifier',
            render: (dataIndex, record) => {
                return dataIndex === null ?  <span>/</span> : <span>{dataIndex}</span>
            }
        }];
        const FormItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19},
        };

        return(
            <div style={{margin: "0"}}>
                <div className=''>
                    <Row gutter={16}>
                        <Col className="gutter-row" id="channel" sm={16} span={16}>
                            <span style={{marginRight:'6px'}}>筛选：</span>
                            <Select
                                showSearch
                                style={{ width: '150px'}}
                                onChange={this.chooseMedia}
                                defaultValue={fromMediaName}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                getPopupContainer={() => document.getElementById('channel')}
                            >
                                <Option value="0">选择媒体名称</Option>
                                {
                                    this.state.mediaList && this.state.mediaList.map((value, index) => {
                                        return (<Option key={value.mediaId} value={index + 1} name={value.mediaName}>{value.mediaName}</Option>)
                                    })
                                }
                            </Select>
                            <Select
                                onChange={this.chooseSubject}
                                defaultValue="0"
                                getPopupContainer={() => document.getElementById('channel')}
                            >
                                <Option value="0">选择学科</Option>
                                {
                                    this.state.subjectList && this.state.subjectList.map((value, index) => {
                                        return (<Option key={value.id} value={index + 1}>{value.name}</Option>)
                                    })
                                }
                            </Select>
                            <Button type="default" onClick={this.searchReset} style={{marginLeft:'20px'}}>全部重置</Button>
                        </Col>
                    </Row>
                    <FormTable
                        dataSource = {dataSource}
                        checkChange = {this.checkChange}
                        changeSore = {this.changeSore}
                        loading = {loading}
                        clickChannel = {this.clickChannel}
                        clickLink = {this.clickLink}
                        clickEdit = {this.clickEdit}
                        clickRead = {this.clickRead}
                        clickArticle = {this.clickArticle}
                        clickPayment = {this.clickPayment}
                    />
                    <div style={{overflow: 'hidden', marginTop: '10px'}}>
                        <LocaleProvider locale={zh_CN}>
                            <Pagination showSizeChanger onShowSizeChange={this.onShowSizeChange}
                                        onChange = {this.onChangePage}
                                        total = {this.state.dataAll.total}
                                        showTotal = {this.showTotal.bind(this.state.dataAll.total)}
                                        defaultPageSize={40}
                                        current={sendData.current}/>
                        </LocaleProvider>
                    </div>
                </div>
                {/*浏览人数*/}
                <div>
                    <Modal
                        title={[
                            <h4 key='title'>浏览人数</h4>
                        ]}
                        visible={this.state.browseVisible}
                        onCancel={this.handleCancelBrowse}
                        destroyOnClose='true'
                        footer={null}
                    >
                        <Form layout="inline" style={{marginBottom:'20px'}}>
                            <FormItem label={'浏览人数'} validateStatus={this.state.addVisitorState}
                                      help={this.state.addVisitorHint}  hasFeedback>
                                <InputNumber placeholder="请输入人数" style={{width:'120px',marginRight:'34px'}}
                                             onChange={this.addVisitorChange}
                                             defaultValue={this.state.addVisitorVal}
                                />
                            </FormItem>
                            <FormItem>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    onClick={this.addBrowseNumber}
                                >
                                    确定
                                </Button>
                            </FormItem>
                        </Form>

                        <Table columns={columnVisitorses}
                               dataSource={visitorList}
                               pagination={false}
                               size="middle"
                               key={(record, i) => i}
                               rowKey={(record, i) => i}
                               locale={locale}/>
                        <div style={{overflow: 'hidden', marginTop: '10px'}}>
                            <LocaleProvider locale={zh_CN}>
                                <Pagination onChange = {this.onChangeReadPage}
                                            total = {visitTotal.total}
                                            defaultPageSize={5}
                                            current={sendDataVisitor.current}/>
                            </LocaleProvider>
                        </div>
                    </Modal>
                </div>
                {/*end*/}
                {/*获取链接*/}
                <CollectionCreateForm id={this.state.qrId} ref={this.saveFormRef} onCancel={this.handleCancelLink}
                                      visible={linkVisible}  visibleSet={visibleSet}
                                      marketExists={this.state.marketExists}
                                      isOneQrCode={isOneQrCode}
                                      imgageId={imgageId}
                                      onOK={this.onOKToChannel} />
                {/*end*/}
            </div>
        )
    }
}
