import React from 'react';
import './AddVipChannel.less'
import BreadcrumbCustom from '../../../common/BreadcrumbCustom';
import {
    Button,
    Card,
    Steps,
    message,
    Select
} from 'antd';
import {getClassingDetail, createChannel} from "../../../../api/vipCourseApi";
import {urlUserInfo} from "../../../../api/userApi";
import {connect} from "../../../../utils/socket";
import {getToken,vipCourseUrl,returnFloats} from "../../../../utils/filter";
import {hasIn} from "../../../../utils/utils";
import StepTwo from './AddVipChannelForm'
import StepThird from './AddVipChannelGetCode'
import {getSubjectList, getVipPublicList} from "../../../../api/commonApi";


const Option = Select.Option
const Step = Steps.Step;
let vipTitleStateE,discountPriceState;
class AddChannel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            courseId: parseInt(window.location.pathname.slice(15)) || this.props.location.state.id,         //课程id
            courseName: hasIn(this.props.location.state, 'name') ? this.props.location.state.name : '', //班次名称
            current: 0,                     //当前步骤
            username: '',                   //真实姓名
            channelTypeNormal: 1,       //普通渠道 1：不选中，2：选中
            channelTypeExclusive: 1,   //专属渠道  1：不选中，2：选中
            classingDetailData: '',  //班级信息详情
            channelType: null,      //渠道类型标识符
            buttonStatus: true,  //下一步按钮状态
            link:'',    //推广链接
            vipTitleStateE:'',
            discountPriceState:'',
            publicList: [],
            appId: ''
        };
    }

    // 渲染
    componentDidMount() {
        this.node.scrollIntoView();
        this.getUserInfo();
        // this.getClassingDetailFn()
        this.getVipPublicListFn()

        //链接websocket
        connect(getToken('username'));

        //end

    }

    // 获取公共号列表
    getVipPublicListFn = () => {
      getVipPublicList().then(res => {
        if(res.data.code === 0){
          this.setState({
            publicList: res.data.data
          })

        }
      })
    }
    //获取真实姓名
    getUserInfo = () => {
        urlUserInfo().then(res => {
            this.setState({
                username: res.data.data.realname
            })
        }).catch(err => {
            console.log(err)
        })
    };
    //获取招生中班级详情
    getClassingDetailFn = (appId) => {
        let params = {
            courseId: this.state.courseId,
            appId: appId
        };
        getClassingDetail(params).then(res => {
            if (res.data.code === 0) {
                this.setState({
                    classingDetailData: res.data.data
                });
                if(res.data.data.courseCode !== null && res.data.data.channelCode !== null && res.data.data.appId !== null){
                    this.reateLinkRepeat(res.data.data.courseCode,res.data.data.channelCode,res.data.data.appId)
                }
            }
        }).catch(err => {

        })
    };
    // 下一步
    next() {

        if(this.state.channelType){
            if(this.state.classingDetailData.channelCode !== null ){
                //已经有普通推广渠道则直接跳到第三步
                const current = 2;
                this.setState({current});
            }else {
                //到第二步创建
                const current = this.state.current + 1;
                this.setState({current});
            }
        }else {
            const current = this.state.current + 1;
            this.setState({current});
        }
    }
    //上一步
    prev() {
        const current = this.state.current - 1;
        this.setState({current});
    }

    //选择正常推广渠道
    selectNormal = () => {
        if(!this.state.appId){
          this.setState({
            buttonStatus: true
          })
        }else {
          this.setState({
              channelTypeNormal: 2,
              channelTypeExclusive: 1,
              channelType: true,
              buttonStatus: false
          })
        }
    };
    //选择专属推广渠道
    selectExclusive = () => {
      if(!this.state.appId){
        this.setState({
          buttonStatus: true
        })
      }else{
        this.setState({
            channelTypeNormal: 1,
            channelTypeExclusive: 2,
            channelType: false,
            buttonStatus: false
        })
      }
    };


// + '?tenant='+
    //第一次生成推广链接
    reateLink = (courseCode,channelCode,appId)=>{
        this.setState({
            link:vipCourseUrl(appId) + courseCode + '/' + channelCode + '?tenant=' + appId
        })
    };
    //第二次生成推广链接
    reateLinkRepeat = (courseCode,channelCode,appId)=>{
        this.setState({
            link:vipCourseUrl(appId) + courseCode + '/' + channelCode + '?tenant=' + appId
        })
    };
    //获取子组件表单中的stste；
    sendDataParent = (data)=>{
        console.log(data,"112")
        vipTitleStateE = data.vipTitleStateE;
        discountPriceState = data.discountPriceState;
    };
    // 表单提交
    onsubmit = () => {
        let params = {};
        this.refs.btSubmit.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if (this.state.channelType) {
                    params = {
                        courseId: this.state.courseId,
                        classId: this.state.classingDetailData.classId,
                        name: values.channelName,
                        type: this.state.channelType ? 0 : 1,
                        appId: this.state.appId
                    };
                } else {
                    console.log(values);
                    params = {
                        courseId: this.state.courseId,
                        classId: this.state.classingDetailData.classId,
                        name: values.channelNameE,
                        remark: values.remarks,
                        startTime: values.entryTime ? Math.round(new Date(values.entryTime[0]._d).getTime() / 1000) : undefined,
                        endTime: values.entryTime ?  Math.round(new Date(values.entryTime[1]._d).getTime() / 1000) : undefined,
                        discount: returnFloats(values.discountPrice) * 1,
                        type: this.state.channelType ? 0 : 1,
                        once: values.oneTime ? 1 : 0,
                        timeType: values.entryTimeStatus ? 1 : 0,
                        text: values.showText,
                        appId: this.state.appId
                    };
                }
                if(this.state.channelType){
                    createChannel(params).then(res => {
                        if (res.data.code === 0) {
                            this.reateLink(res.data.data.courseCode,res.data.data.channelCode,res.data.data.appId);
                            this.next()
                        }else if(res.data.code == 10002){
                            message.error(res.data.msg)
                        }else if (res.data.code == 60010) {
                            message.error(res.data.msg)
                        }else {
                            message.error(res.data.msg)
                        }
                    }).catch(err => {
                        console.log(err)
                    });
                }else {
                    if(vipTitleStateE == "success" && discountPriceState == "success"){
                        createChannel(params).then(res => {
                            if (res.data.code === 0) {
                                this.reateLink(res.data.data.courseCode,res.data.data.channelCode,res.data.data.appId);
                                this.next()
                            }else if(res.data.code == 10002){
                                message.error(res.data.msg)
                            }else if (res.data.code == 60010) {
                                message.error(res.data.msg)
                            }else {
                                message.error(res.data.msg)
                            }
                        }).catch(err => {
                            console.log(err)
                        });
                    }
                }
            }
        });
    };

    chooosePublic = (value) => {
      console.log(value)
      this.getClassingDetailFn(value)
      this.setState({
        appId: value
      })

    }

    // <Option value={122}>开课吧服务号</Option>
    //   {this.state.publicList.map(value => <Option key={value.id} value={value.id}>{value.name}</Option>)}


    render() {
        const {publicList,current, username, channelTypeNormal, channelTypeExclusive, classingDetailData, channelType, buttonStatus,link,courseId} = this.state;

        const menus = [
            {
                path: '/app/dashboard/analysis',
                name: '首页'
            },
            {
                path: '/app/vipcourse/list',
                name: 'vip课'
            },
            {
                path: '/app/vipcourse/list',
                name: 'vip课列表'
            },
            {
                path: '/app/vipcourse/' + this.state.courseId + '?page=1',
                name: this.state.courseName
            },
            {
                name: '新建推广渠道',
                path: '#'
            }
        ];
        return (
            <div ref={node => this.node = node} className="addvipchannel">
                <div className="page-nav">
                    <BreadcrumbCustom paths={menus}/>
                    <p className="title-style">新建推广渠道</p>
                    <p className="title-describe">新建属于你自己的推广渠道吧。</p>
                </div>
                <Card style={{marginBottom: 24}} bordered={false}>
                    <Steps current={current}>
                        <Step title="确认推广类型"/>
                        <Step title="填写推广信息"/>
                        <Step title="完成"/>
                    </Steps>
                    <div className="steps-content">
                        {
                            current == 0
                            && <div className="channel-type" style={{marginTop: '0'}}>
                                <div id="pic-input" style={{marginBottom: '40px'}}>
                                  <span><span style={{color: '#f00'}}>*</span>所属公众号：</span>
                                  <Select
                                      showSearch
                                      style={{ width: 180 }}
                                      placeholder="选择公众号"
                                      onChange={this.chooosePublic}
                                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                      getPopupContainer={() => document.getElementById('pic-input')}
                                  >
                                  {
                                    publicList && publicList.map((item, index) => {
                                      return <Option key={index} value={item.appId}>{item.name}</Option>
                                    })
                                  }

                                  </Select>
                                </div>
                                <div onClick={this.selectNormal}
                                     className={channelTypeNormal == 2 ? 'channel-normal channel-focus' : 'channel-normal'}>
                                    <img src="https://img.kaikeba.com/crm-addChannelType.png"/>
                                    <div className="title-box">
                                        <h3>普通推广渠道</h3>
                                        <p>标准价格，获取专属链接&二维码</p>
                                    </div>
                                </div>
                                <div onClick={this.selectExclusive}
                                     className={channelTypeExclusive == 2 ? 'channel-exclusive channel-focus' : 'channel-exclusive'}>
                                    <img src="https://img.kaikeba.com/crm-addChannelType.png"/>
                                    <div className="title-box">
                                        <h3>专属推广渠道</h3>
                                        <p>支持自定义，用于创建非标准价格的付款通道</p>
                                    </div>
                                </div>
                            </div>
                        }
                        {
                            current == 1
                            && <StepTwo sendDataParent={this.sendDataParent}  ref="btSubmit" classingDetailData={classingDetailData} username={username}
                                        channelType={channelType}/>
                        }
                        {
                            current == 2
                            && <div className="channel-step3">
                                <StepThird id={link} courseId={courseId} />
                            </div>
                        }
                    </div>
                    <div className="steps-action">
                        {
                            current === 0
                            && <div className="btn-first">
                                <Button className="btn-next" type="primary" onClick={() => this.next()}
                                        disabled={buttonStatus}>下一步</Button>
                            </div>
                        }
                        {
                            current === 1
                            && <div className="btn-box">
                                <Button className="btn1" onClick={() => this.prev()}>上一步</Button>
                                <Button className="btn2" type="primary" onClick={this.onsubmit}>提交</Button>
                            </div>
                        }
                    </div>
                </Card>
            </div>
        );
    }

}

export default AddChannel;
