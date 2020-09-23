import React, {Component} from 'react';
import { Drawer, Row, Col } from 'antd';
import {formatDateDay} from "../../../utils/filter";
import './Drawer.less'

export default class DrawerView extends Component {

    render() {
        const {visible, onClose, detailData, onDrawClick} = this.props;
        return (
            <div style={{width: visible ? '480px': 0}} className="drawer-my-user" onClick={onDrawClick}>
                <Drawer
                    width={480}
                    zIndex={0}
                    mask={false}
                    title="基本信息"
                    placement={'right'}
                    closable={true}
                    onClose={onClose}
                    visible={visible}
                    className="my-user-drawer"
                    getContainer={() => document.querySelector('.drawer-my-user')}
                >
                    <Row className="drawer-row-height" style={{marginTop: '10px'}}>
                        <Col span={6} className="drawer-col-title">用户姓名：</Col>
                        <Col span={18}>{detailData.username}</Col>
                    </Row>
                    <Row className="drawer-row-height">
                        <Col span={6} className="drawer-col-title">用户手机号：</Col>
                        <Col span={18}>{detailData.mobile}</Col>
                    </Row>
                    <Row className="drawer-row-height">
                        <Col span={6} className="drawer-col-title">用户微信昵称：</Col>
                        <Col span={18}>{detailData.nickname}</Col>
                    </Row>
                    <Row className="drawer-row-height">
                        <Col span={6} className="drawer-col-title">用户来源：</Col>
                        <Col span={18}>{detailData.value}</Col>
                    </Row>
                    <Row className="drawer-row-height">
                        <Col span={6} className="drawer-col-title">所属销售：</Col>
                        <Col span={18}>{detailData.sellerName}</Col>
                    </Row>
                    <Row className="drawer-row-height">
                        <Col span={6} className="drawer-col-title">添加好友时间：</Col>
                        <Col span={18}>{detailData.friendTime ? formatDateDay(detailData.friendTime) : ''}</Col>
                    </Row>
                    {/*<Row className="drawer-row-height">*/}
                        {/*<Col span={6} className="drawer-col-title">其他信息：</Col>*/}
                        {/*<Col span={18}>{detailData.other}</Col>*/}
                    {/*</Row>*/}
                    <p className="drawer-title-user" style={{marginTop: '10px'}}>意向课程</p>
                    <Row className="drawer-row-height" style={{marginTop: '10px'}}>
                        <Col span={6} className="drawer-col-title">意向课程：</Col>
                        <Col span={18}>{detailData.intentionName}</Col>
                    </Row>
                    <Row className="drawer-row-height">
                        <Col span={6} className="drawer-col-title">备注信息：</Col>
                        <Col span={18}>{detailData.remark}</Col>
                    </Row>
                </Drawer>
            </div>
        );
    }
}
