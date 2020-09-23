import React from 'react';
import BreadcrumbCustom from '../../common/BreadcrumbCustom';
import {Row, Col, Tabs} from 'antd';
import {formatDateTime, getToken} from '../../../utils/filter';
import {launchDetail} from '../../../api/marketApi';
import MediaChannel from './LaunchMediaChannel';
import MediaDetails from './LaunchMediaDetails';
import history from '../../common/History';
import './LaunchMediaInfo.less';
import {connect} from "../../../utils/socket";

const TabPane = Tabs.TabPane;

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // adId:3,
            // mediaId:2,
            // mediaName:'哈哈',
            //投放列表传值过来的
            adId: this.props.location.state.adId,//this.props.location.state.adId
            mediaId: this.props.location.state.id,//this.props.location.state.id
            mediaName: this.props.location.state.name,//this.props.location.state.id
            dataSource: {},
            launchDetailData:{},
            pvUvPress: '',
            tabName: '',           // tab页标签名称
            activeKey: ''          // 当前tab页key
        };
    }

    componentWillMount() {

    };

    //渲染
    componentDidMount() {
        this.node.scrollIntoView();
        this.getUserInfo();
        //链接websocket
        connect(getToken('username'));
        //end
    }

    //获取个人中心页头信息
    getUserInfo = () => {
        let sendData = {
            id:this.state.adId
        }
        launchDetail(sendData).then(res => {
            let press = res.data.data.press == null ?  '0' : res.data.data.press;
            let pvUvPress = res.data.data.pv + '/' + res.data.data.uv + '/' + press;
            // let pvUvPress = res.data.data.uv + '/' + res.data.data.pv + '/90';
            console.log(res.data,"++++++++++++");
            this.setState({
                dataSource: res.data.data,
                launchDetailData:res.data,
                pvUvPress:pvUvPress
            })
        }).catch(err => {
            console.log(err, "urlUserInfo")
        })
    };
    // 切换基本信息、我的营销号、修改密码
    onChange = (key) => {
        history.push('/app/qrcode/' + key);
    };

    render() {
        // 通过路由参数设置三级面包屑名称
        let name = ''
        if (this.props.match.params.name === 'mediadetails') {
            name = '编辑媒体投放'
        } else {
            name = '渠道管理'
        }
        // 面包屑菜单
        const menus = [
            {
                path: '/app/dashboard/analysis',
                name: '首页'
            },
            {
                path: '#',
                name: '营销中心'
            },
            {
                path: '/app/qrcode/' + this.props.match.params.name,
                name: name
            }
        ];

        return (
            <div ref={node => this.node = node}>
                <div className="page-nav course-header">
                    <BreadcrumbCustom paths={menus}/>
                    <Row>
                        <Col xs={24} sm={10} style={{textAlign: "left"}}>
                            <h2>{this.state.dataSource.mediaName}</h2>
                        </Col>
                    </Row>
                    <Row className="index-content">
                        <Col xs={24} sm={12} style={{textAlign: 'left'}}>
                            <Row style={{paddingLeft: '16px', paddingRight: '16px'}}>
                                <Col xs={24} sm={24} style={{paddingLeft: '16px', paddingRight: '16px'}}>
                                    <div
                                        className="index-term">创建人：<span>{this.state.dataSource.creator}</span>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} style={{paddingLeft: '16px', paddingRight: '16px'}}>
                                    <div
                                        className="index-term">创建时间：<span>{formatDateTime(this.state.dataSource.createTime)}</span>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col className="right-button" xs={24} sm={12} style={{float: 'right'}}>
                            <Row className="head-status">
                                <Col xs={24} sm={12}>
                                    <div className="advance-title">PV/UV/长按</div>
                                    <div className="advance-text">{this.state.pvUvPress}</div>
                                </Col>
                                <Col xs={24} sm={6}>
                                    <div className="advance-title">价格</div>
                                    <div className="advance-text">{this.state.dataSource.price}</div>
                                </Col>
                                <Col xs={24} sm={6}>
                                    <div className="advance-title">总人数</div>
                                    <div className="advance-text">{this.state.dataSource.number}</div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
                <div>
                    <Tabs
                        style={{margin: '0 -30px'}}
                        onChange={this.onChange.bind(this)}
                        activeKey={this.props.match.params.name}
                    >
                        <TabPane tab="信息详情" key="mediadetails">
                            <MediaDetails
                                adId={this.state.adId}
                                mediaId={this.state.mediaId}
                                mediaName={this.state.mediaName}
                                launchDetailData={this.state.launchDetailData}
                            />
                        </TabPane>
                        <TabPane tab="渠道管理" key="mediachannel">
                            <MediaChannel adId={this.state.adId}/>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        );
    }

}

export default User;
