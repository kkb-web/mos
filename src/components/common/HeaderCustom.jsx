import React, { Component } from 'react';
import { Layout, Icon, Menu, message} from 'antd';
import history from './History';
import {authHeader, getToken, removeToken ,baseUrl} from "../../utils/filter";
import {disconnect} from "../../utils/socket"

const { Header } = Layout;
const SubMenu = Menu.SubMenu;

export default class HeaderCustom extends Component{
    constructor(props){
        super(props);
        this.state = {
            collapsed: props.collapsed,
        };
        this.logout = this.logout.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        this.onCollapse(nextProps.collapsed);
    }
    onCollapse = (collapsed) => {
        this.setState({
            collapsed,
        });
    };
    // 退出登录
    logout(){
        let xhr = new XMLHttpRequest();
        xhr.open("delete", baseUrl() + '/uaa/oauth/token?access_token=' + getToken("access_token"), true);
        // 添加http头，发送信息至服务器时内容编码类型
        xhr.setRequestHeader("Authorization", authHeader().Authorization);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 304) {
                    removeToken("access_token");
                    removeToken("username");
                    history.push('/login');
                    disconnect()
                }else{
                    message.error('退出失败！')
                }
            }
        };
        xhr.send();
    }
    render(){
        return(
            <Header style={{ background: '#fff', padding: 0 }} className="header">
                <Icon
                    className="trigger"
                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.props.toggle}
                />
                <Menu
                    mode="horizontal"
                    style={{ lineHeight: '64px', float: 'right' }}
                >
                    {/*<Menu.Item key="schedule">*/}
                    {/*<Link to="/app/header/Calendars">*/}
                    {/*<Badge count={3} overflowCount={99} style={{height:'15px',lineHeight:'15px'}}>*/}
                    {/*<Icon type="schedule" style={{fontSize:16, color: '#1DA57A' }}/>*/}
                    {/*</Badge>*/}
                    {/*</Link>*/}
                    {/*</Menu.Item>*/}
                    <SubMenu
                        title={<span>
                            <img style={{width: '30px', marginRight: '10px'}} src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" alt=""/>
                            {/*<Icon type="user" style={{fontSize:16, color: '#1DA57A' }}/>*/}
                            {this.props.username}
                        </span>}
                    >
                        <Menu.Item key="logout" style={{textAlign:'center'}} className="logout">
                            <span onClick={this.logout}>logout</span>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </Header>
        )
    }
}
