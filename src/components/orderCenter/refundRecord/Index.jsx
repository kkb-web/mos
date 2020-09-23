import React, {Component} from "react";
import "./Index.less";
import {
    Table,
    Button,
    Card,
    Modal,
    Popconfirm,
    Badge,
    Pagination,
    message,
    LocaleProvider,
    Col,
    Select,
    Row,
    Input
} from "antd";
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import history from "../../common/History";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import { getToken} from "../../../utils/filter";
import {getRefundRecordList, getRefundList} from "../../../api/orderCenterApi";
import {connect} from "../../../utils/socket";
import FormTable from "./FormTable";


let customCondition = {
    execEndTime: null,      //退款时间-开始
    execStartTime: null,    //退款时间-结束
    applyStartTime: null,   //申请时间-开始
    applyEndTime: null,     //申请时间-结束
    status: null,            //退款状态
    applyBy: null,           //申请人
    itemId: null,            //商品id
    itemSkuId: null,         //商品版本id
    search: null            //搜索
};
let applyData = {
    size: 40,
    current: 1,
    ascs: [],
    descs: ['apply_time'],
    condition: customCondition
};
export default class Refund extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            dataAll: '',           //列表总数据
            dataSource: [],      //列表表单数据
        };
    }

    componentDidMount() {
        this.getRefundRecordListFn();
        // this.PageInit();
        //链接websocket
        connect(getToken('username'));
        //end
    };

    componentWillUnmount() {

    };

    //获取退款记录列表
    getRefundRecordListFn = () => {
        this.setState({
            loading:true
        });
        getRefundList(applyData).then(res => {
            if (res.data.code == 0) {
                this.setState({
                    dataSource: res.data.data.records,
                    dataAll: res.data.data,
                })
            }
            this.setState({
                loading:false
            });
        }).catch(err => {
            console.log(err)
            this.setState({
                loading:false
            });
        })
    };

    // 改变页码
    onChangePage = (page, pageSize) => {
        applyData.size = pageSize;
        applyData.current = page;
        this.getRefundRecordListFn();
    };
    // 改变每页条数
    onShowSizeChange = (current, pageSize) => {
        applyData.size = pageSize;
        applyData.current = current;
        this.getRefundRecordListFn();
    };
    // 展示数据总数
    showTotal = (total) => {
        return `共 ${total} 条数据`;
    };

    render() {
        const {dataSource, loading} = this.state;
        const menus = [
            {
                path: '/app/dashboard/analysis',
                name: '首页'
            },
            {
                path: '#',
                name: '订单中心'
            },
            {
                path: '/app/authority/accounts',
                name: '退款记录'
            }
        ];
        return (
            <div className="refund-record">
                <div className="page-nav">
                    <BreadcrumbCustom paths={menus}/>
                    <p className="title-style">退款记录</p>
                </div>
                <Card bordered={false}>
                    <Row>

                    </Row>
                    <Row className="refund-record-table">
                        <FormTable
                            dataSource={dataSource}
                            changeSore={this.changeSore}
                            loading={loading}
                        />
                    </Row>
                    <Row>
                        <div style={{overflow: 'hidden'}}>
                            <LocaleProvider locale={zh_CN}>
                                <Pagination showSizeChanger onShowSizeChange={this.onShowSizeChange}
                                            onChange={this.onChangePage}
                                            total={this.state.dataAll.total}
                                            showTotal={this.showTotal.bind(this.state.dataAll.total)}
                                            current={applyData.current}
                                            defaultPageSize={40}/>
                            </LocaleProvider>
                        </div>
                    </Row>
                </Card>
            </div>
        )
    }
}
