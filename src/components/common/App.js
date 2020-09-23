import React, {Component, Fragment} from 'react';
import {Redirect} from 'react-router-dom';
import {Layout} from 'antd';
import '../../style/index.less';
import {getToken, setToken} from "../../utils/filter";
import {closenote} from "../../utils/socket";

import SiderCustom from './SiderCustom';
import HeaderCustom from './HeaderCustom';

import Routes from '../../routes/routes';


const {Content, Footer} = Layout;

export default class App extends Component {
    state = {
        collapsed: getToken("sider_collapsed") === "true",
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        }, function () {
            setToken("sider_collapsed", this.state.collapsed);
        });
    };

    componentDidMount() {
        //保存Sider收缩
        if (getToken("sider_collapsed") === 'true') {
            setToken("sider_collapsed", true);
        } else {
            setToken("sider_collapsed", false);
        }
    }

    render() {
        const {collapsed} = this.state;
        const {location} = this.props;
        let name;
        if (getToken("access_token") === null) {
            closenote()
            return <Redirect to="/login"/>
        } else {
            name = getToken('username')
        }

        return (
            <Layout className="ant-layout-has-sider" style={{minHeight: '100%'}}>
                <SiderCustom collapsed={collapsed} path={location.pathname}/>
                <Layout id="content">
                    <HeaderCustom collapsed={collapsed} toggle={this.toggle} username={name}/>
                    <Content style={{margin: '0 16px'}}>
                        <Routes />
                    </Content>
                    <Footer style={{textAlign: 'center', margin: '30px 0 10px 0', color: 'rgba(0, 0, 0, .45)'}}>
                        <div style={{marginBottom: '10px'}}>
                            <span style={{margin: '22px'}}>帮助</span>
                            <span style={{margin: '22px'}}>隐私</span>
                            <span style={{margin: '22px'}}>条例</span>
                        </div>
                        <Fragment>
                            copyright © 2018 北京开课吧科技有限公司版权所有
                        </Fragment>
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}
