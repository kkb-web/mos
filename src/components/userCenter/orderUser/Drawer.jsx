import React, {Component} from 'react';
import {Drawer, Row, Col, Table, Badge} from 'antd';
import {formatDateTime, priceType,renderOrderState} from "../../../utils/filter";
import Ellipsis from "ant-design-pro/lib/Ellipsis";
import './OrderUserList.less'

export default class DrawerView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {visible, onClose, detailData, details, onDrawClick, dataSource} = this.props;
        const columns = [{
            title: '订单编号',
            dataIndex: 'outOrderId',
            width: 150,
            render: (dataIndex) => <span>{dataIndex ? dataIndex : '/'}</span>
        }, {
            title: '购买课程',
            dataIndex: 'name',
            render: (dataIndex) => <Ellipsis tooltip lines={1}>{dataIndex ? dataIndex : '/'}</Ellipsis>
        }, {
            title: '状态',
            dataIndex: 'orderStatus',
            render: (dataIndex) => {
                return dataIndex !== null ? renderOrderState(dataIndex) : <span>/</span>
            },
            // render: (dataIndex) => dataIndex === 0 ? <span><Badge status="error"/>未完成</span> : <span><Badge status="success"/>已完成</span>
        }, {
            title: '应付总额',
            dataIndex: 'price',
            render: (dataIndex) => <span>{dataIndex ? priceType(dataIndex) : '/'}</span>
        }, {
            title: '实际支付',
            dataIndex: 'amount',
            render: (dataIndex) => <span>{dataIndex ? priceType(dataIndex) : '/'}</span>
        }];

        return (
            <div style={{width: visible ? '600px': 0}} className="drawer-order-user" onClick={onDrawClick}>
                <Drawer
                    width={600}
                    // zIndex={0}
                    mask={false}
                    title="基本信息"
                    placement={'right'}
                    closable={true}
                    onClose={onClose}
                    visible={visible}
                    className="order-user-drawer"
                    getContainer={() => document.querySelector('.drawer-order-user')}
                >
                    <div className="drawer-row-height" style={{marginTop: '10px'}}>
                        <span className="drawer-col-title">用户姓名：</span>
                        <span className="drawer-col-content">{detailData.username}</span>
                    </div>
                    <div className="drawer-row-height">
                        <span className="drawer-col-title">用户手机号：</span>
                        <span className="drawer-col-content">{detailData.mobile}</span>
                    </div>
                    <div className="drawer-row-height">
                        <span className="drawer-col-title">用户微信昵称：</span>
                        <span className="drawer-col-content">{detailData.nickname}</span>
                    </div>
                    {details && details.map((value, index) =>
                        <div className="drawer-row-height" key={index}>
                            <span className="drawer-col-title">{value.questionKey}：</span>
                            <span className="drawer-col-content">{value.questionValue}</span>
                        </div>
                    )}
                    <p className="drawer-title-user">意向课程</p>
                    <div className="drawer-row-height" style={{marginTop: '10px'}}>
                        <span className="drawer-col-title">意向课程：</span>
                        <span className="drawer-col-content">{detailData.intentionName}</span>
                    </div>
                    <div className="drawer-row-height">
                        <span className="drawer-col-title">备注信息：</span>
                        <span className="drawer-col-content">{detailData.remark}</span>
                    </div>
                    <p className="drawer-title-user">订单信息</p>
                    <Table
                        key={(record, i) => i}
                        rowKey={(record, i) => i}
                        columns={columns}
                        dataSource={dataSource}
                        pagination={false}
                        rowSelection={null}
                        locale={{emptyText: '没有数据'}}
                        style={{marginBottom: 20}}
                    />
                </Drawer>
            </div>
        );
    }
}
