import React from 'react';
import BreadcrumbCustom from '../common/BreadcrumbCustom';
import {Row, Col, Tabs, Popover} from 'antd';
import {formatDateTime, getToken} from '../../utils/filter';
import MySeller from './MySeller';
import Information from './Information';
import ChangePassword from './ChangePassword';
import history from '../common/History';
import './Index.less';
import {urlUserInfo} from '../../api/userApi';
import {connect} from "../../utils/socket";

const TabPane = Tabs.TabPane;

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: {
                realname: '',      // 真实姓名
                loginTimes: '',    // 登录次数
                createTime: '',    // 创建时间
                lastLoginTime: '', // 最近一次登录
                orders: '',        // 订单量
                sales: '',         // 销售总额
                sellers: '',       // 营销号数
            },
            tabName: '',           // tab页标签名称
            activeKey: ''          // 当前tab页key
        };
    }

    //获取个人中心页头信息
    getUserInfo = () => {
        urlUserInfo().then(response => {
            this.setState({
                dataSource: response.data.data
            })
        }).catch(err => {
            console.log(err, "urlUserInfo")
        })
    };


    // 切换基本信息、我的营销号、修改密码
    onChange = (key) => {
        history.push('/app/user/' + key);
    };

    //渲染
    componentDidMount() {
        this.getUserInfo();
        //链接websocket
        connect(getToken('username'));
        //end
    }
    handleHover = () => {
        console.log('hover in title')
    }


    render() {
        // 通过路由参数设置三级面包屑名称
        let name = '';
        if (this.props.match.params.name === 'info') {
            name = '基本信息'
        } else if (this.props.match.params.name === 'myseller') {
            name = '我的营销号'
        } else {
            name = '修改密码'
        }
        // 面包屑菜单
        const menus = [
            {
                path: '/app/dashboard/analysis',
                name: '首页'
            },
            {
                path: '/app/user/info',
                name: '个人中心'
            },
            {
                path: '/app/user/' + this.props.match.params.name,
                name: name
            }
        ];

        const popCont = (
            <div>
                <p>提成以公司财务实际计算范围为准</p>
            </div>
        )
        return (
            <div>
                <div className="page-nav course-header">
                    <BreadcrumbCustom paths={menus}/>
                    <Row>
                        <Col xs={24} sm={10} style={{textAlign: "left"}}>
                            <img style={{width: '30px', float: 'left', marginRight: '10px'}}
                                 src="https://img.kaikeba.com/course-icon.png" alt=""/>
                            <p className="course-title">
                                {this.state.dataSource.realname}
                            </p>
                        </Col>
                    </Row>
                    <Row className="index-content">
                        <Col xs={24} sm={12} style={{textAlign: 'left'}}>
                            <Row style={{paddingLeft: '16px', paddingRight: '16px'}}>
                                <Col xs={24} sm={24} style={{paddingLeft: '16px', paddingRight: '16px'}}>
                                    <div className="index-term">登录次数：<span>{this.state.dataSource.loginTimes}次</span></div>
                                </Col>
                                <Col xs={24} sm={24} style={{paddingLeft: '16px', paddingRight: '16px'}}>
                                    <div
                                        className="index-term">创建时间：<span>{formatDateTime(this.state.dataSource.createTime)}</span>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} style={{paddingLeft: '16px', paddingRight: '16px'}}>
                                    <div
                                        className="index-term">最近一次登录：<span>{formatDateTime(this.state.dataSource.lastLoginTime)}</span>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col className="right-button" xs={24} sm={6} style={{float: 'right'}}>
                            <Row className="head-status">
                                <Col xs={24} sm={7}>
                                    <div className="advance-title">订单量</div>
                                    <div className="advance-text">{this.state.dataSource.orders}</div>
                                </Col>
                                <Popover content={popCont} title="提示">
                                    <Col title="提成以公司财务实际计算范围为准" xs={24} sm={10}>
                                        <div className="advance-title">销售总额</div>
                                        <div className="advance-text">{this.state.dataSource.sales}</div>
                                    </Col>
                                </Popover>

                                <Col xs={24} sm={7}>
                                    <div className="advance-title">营销号</div>
                                    <div className="advance-text">{this.state.dataSource.sellers}</div>
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
                        <TabPane tab="基本信息" key="info">
                            <Information/>
                        </TabPane>
                        <TabPane tab="我的营销号" key="myseller">
                            <MySeller/>
                        </TabPane>
                        <TabPane tab="修改密码" key="password">
                            <ChangePassword/>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        );
    }

}

export default User;
