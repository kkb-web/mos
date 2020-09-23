import React from 'react';
import './AddOpenCourse.less';
import BreadcrumbCustom from '../common/BreadcrumbCustom';
import {Tabs, Form, Button, Radio, Row, Col, Input, Spin, Modal, message, Switch} from 'antd';
import {getToken, formatDateTime, liveState, openAuthor} from "../../utils/filter";
import EditOpenCourse from "./EditOpenCourse";
import MemberList from './user/Form';
import Channel from './channel/Form';
import Fission from './fssionData/Index';
import Sales from './distributionFlow/Form';
import CollectionCreateForm from './CustomizedForm';
import history from "../common/History";
import {changeBannedStatus, changeLiveStatus, openCourseRemark, getCourseDetail} from "../../api/openCourseApi";
import {connect} from "../../utils/socket";


const TabPane = Tabs.TabPane;
let status = '';
let emojiRule = /([\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70-\uDD71\uDD7E-\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01-\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50-\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96-\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF])|(\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F-\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95-\uDD96\uDDA4-\uDDA5\uDDA8\uDDB1-\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB-\uDEEC\uDEF0\uDEF3-\uDEF6])|(\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0])/g;

class Local extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            data: {},
            dataAll: [],
            loading: true,
            preStatus: "0",
            status: "0",    //公开课状态
            contentStatus: '',
            visible: false,
            modelVisible: false,
            id: '',
            openCourseId: '',
            liveBanned: true,
            remark: '',
            remarkTxt: '',
            tabKey: '1',
            noReplayUrl: false,
            btnFlage:false,
        };
    }

    // 渲染前
    componentWillMount() {
        this.setState({
            loading: true,
            tabKey: window.location.search.slice(6)
        });
    }

    // 获取公开课编辑页的相关信息
    componentDidMount() {
        window.addEventListener('popstate', this.pushHistory);
        getCourseDetail(parseInt(window.location.pathname.slice(12))).then(response => {
            if (response.data.code === 0) {
                let data = response.data.data;
                this.setState({
                    data: data,
                    status: data.liveStatus.toString(),
                    // liveBanned: data.liveBanned === 0,
                    remark: data.remark,
                    loading: false
                });
            } else {
                message.error(response.data.msg)
            }
        });
        //链接websocket
        connect(getToken('username'));
        //end
    };

    componentWillUnmount() {
        window.removeEventListener('popstate', this.pushHistory);
    }

    pushHistory = (state) => {
        // 监听到返回事件，注意，只有触发了返回才会执行这个方法
        history.push('/app/course/list')
    };

    //接受新建表单数据
    saveFormRef = (form) => {
        this.form = form;
    };

    //取消
    handleCancel = () => {
        this.setState({visible: false});
    };

    // 推广
    // showChannel = () => {
    //     let key = window.location.pathname.slice(12);
    //     const form = this.form;
    //     let data = [];
    //     let _this = this;
    //     axiosInstance.get({
    //         url: '/opencourse/channel/list/' + key,
    //         headers: getHeaders()
    //     }).then(function (res) {
    //         data = res.data.data;
    //         form.setFieldsValue({
    //             key: openCourseUrl() + '/opencourse/' + key + '?channel=' + data[0].code,
    //         });
    //         _this.setState({
    //             id: openCourseUrl() + '/opencourse/' + key + '?channel=' + data[0].code,
    //             dataAll: data
    //         });
    //     });
    //     this.setState({
    //         visible: true,
    //         openCourseId: key
    //     });
    // };

    // 切换详情与学员列表
    callback = (key) => {
        history.push('/app/course/' + window.location.pathname.slice(12) + '?page=' + key)
    };

    // 切换直播
    handleValueChange = (e) => {
        if ((this.state.data.replayUrl === '' || !this.state.data.replayUrl) && parseInt(e.target.value) === 3) {
            this.setState({
                tabKey: '1',
                noReplayUrl: true
            });
            history.push('/app/course/' + window.location.pathname.slice(12) + '?page=1');
            message.error('请提交回放地址后，再切换直播状态');
            setTimeout(function () {
                document.getElementById('root').scrollTop = 1930;
            }, 1000)
        } else {
            this.setState({
                preStatus: e.target.value,
                modelVisible: true
            });
        }
    };

    // 确定修改直播状态
    handleOk = () => {
        this.setState({
            btnFlage:true,
        });
        let preStatus = this.state.preStatus;
        if (parseInt(preStatus) === 0) {
            status = 'livebefore'
        } else if (parseInt(preStatus) === 1) {
            status = 'live'
        } else if (parseInt(preStatus) === 2) {
            status = 'liveend'
        } else {
            status = 'liveplayback'
        };
        changeLiveStatus({
            id: parseInt(window.location.pathname.slice(12)),
            status: status
        }).then(res => {
            if (res.data.code === 0) {
                this.setState({
                    modelVisible: false,
                    status: preStatus,
                    btnFlage:false
                });

                message.success('直播状态切换成功');
            } else {
                message.error(res.data.msg);
            }
        });
    };

    // 关闭切换直播状态提示
    handleModelCancel = () => {
        this.setState({
            modelVisible: false,
        });
    };

    // 检测备注文字
    checkRemark = (e) => {
        if (e.target.value.length > 100) {
            this.setState({
                remarkTxt: '不能超过100字'
            })
        } else if (emojiRule.test(e.target.value)) {
            this.setState({
                remarkTxt: '禁止输入emoji'
            })
        } else {
            this.setState({
                remarkTxt: ''
            })
        }
    };

    // 修改备注
    editRemark = (e) => {
        let remark = e.target.value;
        if (remark !== '' && remark !== this.state.remark) {
            openCourseRemark({
                id: parseInt(window.location.pathname.slice(12)),
                remark: remark
            }).then(res => {
                if (res.data.code === 0) {
                    this.setState({
                        remark: remark
                    });
                    message.success('备注成功')
                } else {
                    message.error(res.data.msg)
                }
            })
        }
    };

    // 切换禁言
    changeBanned = (bool) => {
        // console.log(bool, "=======禁言");
        // changeBannedStatus({
        //     id: parseInt(window.location.pathname.slice(12)),
        //     status: bool ? 'openmute' : 'closemute'
        // }).then(res => {
        //     if (res.data.code !== 0) {
        //         message.error(res.data.msg)
        //     }
        // })
        this.setState({
            liveBanned: bool
        })
    };

    // 切换tab
    changeTab = (key) => {
        this.setState({
            tabKey: key
        })
    };

    render() {
        const {visible, data} = this.state;
        const menus = [
            {
                path: '/app/dashboard/analysis',
                name: '首页'
            },
            {
                path: '/app/course/list',
                name: '公开课列表'
            },
            {
                name: this.state.data.name,
                path: '#'
            }
        ];
        return (
            this.state.loading ? <Spin size="large" style={{marginTop: "120px"}} className="loading"/> :
                <div>
                    <div className="page-nav course-header">
                        <BreadcrumbCustom paths={menus}/>
                        <Row>
                            <Col xs={24} sm={10} style={{textAlign: "left"}}>
                                <img style={{width: '30px', float: 'left', marginRight: '10px'}}
                                     src="https://img.kaikeba.com/course-icon.png" alt=""/>
                                <p className="course-title">{this.state.data.name}</p>
                            </Col>
                            <Col className="right-button video-status" xs={24} sm={14} style={{display: openAuthor('marketing:opencourse:manage', this.state.data.subjects)  ? 'block': 'none'}}>
                                <Radio.Group value={this.state.status} onChange={this.handleValueChange}>
                                    <Radio.Button disabled={data.status == 1 ? parseInt(this.state.status) > 0 : true} value="0"
                                                  style={{width: '90px', textAlign: 'center'}}>直播前</Radio.Button>
                                    <Radio.Button disabled={data.status == 1 ? parseInt(this.state.status) > 1 : true} value="1"
                                                  style={{width: '90px', textAlign: 'center'}}>直播中</Radio.Button>
                                    <Radio.Button disabled={data.status == 1 ? parseInt(this.state.status) > 2 : true} value="2"
                                                  style={{width: '90px', textAlign: 'center'}}>直播结束</Radio.Button>
                                    <Radio.Button disabled={data.status == 1 ? parseInt(this.state.status) > 3 : true} value="3"
                                                  style={{width: '90px', textAlign: 'center'}}>直播回放</Radio.Button>
                                </Radio.Group>
                                {/*<Button style={{marginLeft: '10px'}} type="primary" onClick={this.showChannel}>推广</Button>*/}
                            </Col>
                        </Row>
                        <Row className="index-content">
                            <Col xs={24} sm={15} style={{textAlign: 'left'}}>
                                <Row style={{paddingLeft: '16px', paddingRight: '16px'}}>
                                    <Col xs={24} sm={9} style={{paddingLeft: '16px', paddingRight: '16px'}}>
                                        <div className="index-term">创建人：<span>{data.createByName ? data.createByName : '/'}</span></div>
                                    </Col>
                                    <Col xs={24} sm={6} style={{paddingLeft: '16px', paddingRight: '16px'}}>
                                        <div className="index-term up-down">上架状态：{
                                            data.status === 1 ?
                                                <span style={{color: '#009900'}}>已上架</span> :
                                                <span style={{color: '#FF6600'}}>已下架</span>}
                                        </div>
                                    </Col>
                                    {/*<Col xs={24} sm={9} style={{paddingLeft: '16px', paddingRight: '16px'}}>*/}
                                        {/*<span>直播间结束禁言开关：</span>*/}
                                        {/*<Switch checkedChildren="开" disabled={parseInt(this.state.status) > 1} unCheckedChildren="关" onChange={this.changeBanned} checked={this.state.liveBanned} />*/}
                                    {/*</Col>*/}
                                    <Col xs={24} sm={10} style={{paddingLeft: '16px', paddingRight: '16px'}}>
                                        <div className="index-term">创建时间：<span>{formatDateTime(data.createTime)}</span>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={12} style={{paddingLeft: '16px', paddingRight: '16px'}}>
                                        <div className="index-term pv-uv">PV/UV：<span>{data.pv ? data.pv : 0}/{data.uv ? data.uv : 0}</span>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={24} style={{paddingLeft: '16px', paddingRight: '16px'}}>
                                        <div className="index-term">
                                            备注：<Input defaultValue={data.remark} id="remark-input"
                                                      onBlur={this.editRemark}
                                                      onChange={this.checkRemark}
                                                      placeholder="请于两个工作日前确认"/>
                                        </div>
                                        <div style={{color: '#f5222d'}}>{this.state.remarkTxt}</div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col className="right-button" xs={24} sm={6} style={{float: 'right'}}>
                                <Row className="head-status">
                                    <Col xs={24} sm={8}>
                                        <div className="advance-title">状态</div>
                                        <div className="advance-text">{liveState(parseInt(this.state.status))}</div>
                                    </Col>
                                    <Col xs={24} sm={8}>
                                        <div className="advance-title">报名</div>
                                        <div className="advance-text">{data.signupCount ? data.signupCount : 0}人</div>
                                    </Col>
                                    <Col xs={24} sm={8}>
                                        <div className="advance-title">上课</div>
                                        <div className="advance-text">{data.attendCount ? data.attendCount : 0}人</div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                    <div>
                        <Tabs style={{margin: '0 -30px'}} onTabClick={this.changeTab} activeKey={this.state.tabKey} defaultActiveKey={window.location.search.slice(6)}
                              onChange={this.callback}>
                            <TabPane className="detail" tab="详情" key="1">
                                <EditOpenCourse noReplayUrl={this.state.noReplayUrl} liveStatus={this.state.status} preStatus={this.state.preStatus}/>
                            </TabPane>
                            {
                                openAuthor('marketing:opencourse:student', this.state.data.subjects) ?
                                    <TabPane tab="学员列表" key="2">
                                        <MemberList subjects={this.state.data.subjects}/>
                                    </TabPane> : null
                            }
                            {
                                openAuthor('marketing:opencourse:student', this.state.data.subjects) ?
                                    <TabPane tab="渠道推广" key="3">
                                        <Channel/>
                                    </TabPane> : null
                            }
                            {
                                openAuthor('marketing:opencourse:add:allot', this.state.data.subjects) ?
                                    <TabPane tab="公海分流" key="4">
                                        <Sales/>
                                    </TabPane> : null
                            }
                            {/*{*/}
                                {/*openAuthor('marketing:opencourse:fission', this.state.data.subjects) ?*/}
                                    {/*<TabPane tab="裂变数据" key="5">*/}
                                        {/*<Fission/>*/}
                                    {/*</TabPane> :null*/}
                            {/*}*/}
                        </Tabs>
                    </div>
                    <Modal
                        title="提示"
                        visible={this.state.modelVisible}
                        onOk={this.handleOk}
                        onCancel={this.handleModelCancel}
                        footer={[
                            <Button key="back" onClick={this.handleModelCancel}>取消</Button>,
                            <Button key="submit" type="primary"  onClick={this.handleOk} disabled={this.state.btnFlage}>
                                确定
                            </Button>,
                        ]}
                    >
                        <p>是否确认切换直播状态？</p>
                    </Modal>
                    <CollectionCreateForm openCourseId={this.state.openCourseId} data={this.state.dataAll}
                                          id={this.state.id} ref={this.saveFormRef} onCancel={this.handleCancel}
                                          visible={visible} title="推广"
                                          style={{fontSize: '20px'}}/>
                </div>
        );
    }

}

const CourseInfoForm = Form.create()(Local);
export default CourseInfoForm;
