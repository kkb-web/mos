import React from 'react';
import {Tabs} from 'antd';
import BreadcrumbCustom from '../../common/BreadcrumbCustom';
import './index.less'
import Text from "./Text";
import Picture from "./Picture";
import {getToken} from "../../../utils/filter";
import {connect} from "../../../utils/socket";

const TabPane = Tabs.TabPane;

class Resources extends React.Component {
    //渲染
    componentDidMount(){
        //链接websocket
        connect(getToken('username'));
        //end
    };
    render() {
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
                path: '/app/qrcode/resources',
                name: '素材管理'
            }
        ];
        return (
            <div>
                <div className="page-nav">
                    <BreadcrumbCustom paths={menus}/>
                    <p className="title-style">素材管理</p>
                </div>
                <div className="tab-layout">
                    <Tabs style={{margin: '0 -30px'}} className="tabLine">
                        <TabPane tab="文字" key="1"><Text/></TabPane>
                        <TabPane tab="图片" key="2"><Picture/></TabPane>
                    </Tabs>
                </div>
            </div>
        );
    }
}

export default Resources
