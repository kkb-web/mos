import React from 'react';
import {Form, Pagination, Select, DatePicker, Col, Button, Row, LocaleProvider} from 'antd';
import BreadcrumbCustom from '../../common/BreadcrumbCustom';
import FormTable from './FormTable';
import zh_CN from "antd/lib/locale-provider/zh_CN";
import {getMediaNameList, getOrderList} from "../../../api/marketApi";
import {getUserList} from "../../../api/commonApi";
import {connect} from "../../../utils/socket";
import {getToken} from "../../../utils/filter";

const {RangePicker} = DatePicker;
const {Option} = Select;
const condition = {
    mediaId: undefined,
    adBy: undefined,
    startTime: undefined,
    endTime: undefined
};
const params = {
    size: 40,
    current: 1,
    ascs: null,
    descs: ['createTime'],
    condition: condition
};


class Local extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataAll: '',
            dataSource: [],
            mediaName: [],
            sellerName: [],
            rangePickerValue: [],
            mediaValue: '0',
            sellerValue: '0',
            loading: true
        };
    }

    // 渲染
    componentDidMount() {
        condition.mediaId = undefined;
        condition.adBy = undefined;
        condition.startTime = undefined;
        condition.endTime = undefined;
        if (this.props.location.state) {
            condition.mediaId = this.props.location.state.id;  // 从媒体列表或投放列表跳转到成单列表时带的参数id
            this.setState({
                mediaValue: this.props.location.state.name     // 从媒体列表或投放列表跳转到成单列表时带的参数name
            })
        }
        this.getOrderList();
        this.getMediaName();
        this.getSeller();
        //链接websocket
        connect(getToken('username'));
        //end
    }

    // 获取成单列表
    getOrderList = () => {
        getOrderList(params).then(res => {
            if (res.data.code === 0) {
                this.setState({
                    dataAll: res.data.data,
                    dataSource: res.data.data.records,
                });
            } else {
                this.setState({
                    dataAll: '',
                    dataSource: [],
                });
            }
            this.setState({
                loading: false,
            });
        })
    };

    // 获取媒体名称下拉
    getMediaName = () => {
        getMediaNameList().then(res => {
            if (res.data.code === 0) {
                this.setState({
                    mediaName: res.data.data,
                });
            } else {
                this.setState({
                    mediaName: [],
                });
            }
        })
    };

    // 获取运营下拉
    getSeller = () => {
        getUserList().then(res => {
            if (res.data.code === 0) {
                this.setState({
                    sellerName: res.data.data,
                });
            } else {
                this.setState({
                    sellerName: [],
                });
            }
        })
    };

    // 选择媒体下拉
    chooseMedia = (value, e) => {
        if (e.key) {
            condition.mediaId = e.key;
        } else {
            condition.mediaId = '';
        }
        params.current = 1;
        this.setState({
            mediaValue: value,
            loading: true,
        });
        this.getOrderList();
    };

    // 选择运营下拉
    chooseSeller = (value, e) => {
        console.log(e.key)
        if (e.key) {
            condition.adBy = e.key;
        } else {
            condition.adBy = '';
        }
        params.current = 1;
        this.setState({
            sellerValue: value,
            loading: true,
        });
        this.getOrderList();
    };

    // 选择投放时间
    chooseDate = (rangePickerValue) => {
        let dateStart = new Date(rangePickerValue[0]);
        let dateEnd = new Date(rangePickerValue[1]);
        // 设置日期的初始时间为00:00:00 - 23:59:59
        dateStart.setHours(0);
        dateStart.setMinutes(0);
        dateStart.setSeconds(0);
        dateEnd.setHours(23);
        dateEnd.setMinutes(59);
        dateEnd.setSeconds(59);
        // 将日期格式转化为时间戳形式
        condition.startTime = parseInt(dateStart.getTime()/1000);
        condition.endTime = parseInt(dateEnd.getTime()/1000);
        params.current = 1;
        this.setState({
            loading: true,
            rangePickerValue
        });
        this.getOrderList();
    };

    // 重置
    searchReset = () => {
        condition.mediaId = undefined;
        condition.adBy = undefined;
        condition.startTime = undefined;
        condition.endTime = undefined;
        this.setState({
            rangePickerValue: [],
            mediaValue: '0',
            sellerValue: '0',
            loading: true,
        });
        params.current = 1;
        this.getOrderList();
    };

    // 排序
    handleChangeSore = (dataIndex, record, sorter) => {
        let sorterValue = sorter.field;
        params.ascs = (sorter.order === "ascend" ? [sorterValue] : []);
        params.descs = (sorter.order === "ascend" ? [] : [sorterValue]);
        params.current = 1;
        this.setState({
            loading: true,
        });
        this.getOrderList();
    };

    // 改变页码
    handleChangePage = (page, pageSize) => {
        params.size = pageSize;
        params.current = page;
        this.setState({
            loading: true,
        });
        this.getOrderList();
    };

    // 改变每页条数
    handleShowSizeChange = (current, pageSize) => {
        params.size = pageSize;
        params.current = current;
        this.setState({
            loading: true,
        });
        this.getOrderList();
    };

    // 展示数据总条数
    showTotal = (total) => {
        return `共 ${total} 条数据`;
    };

    render() {
        const menus = [
            {
                path: '/app/dashboard/analysis',
                name: '首页'
            },
            {
                name: '营销中心',
                path: '#'
            },
            {
                name: '成单列表',
                path: '#'
            }
        ];
        const {dataSource, dataAll, loading, rangePickerValue, mediaValue, sellerValue} = this.state;
        return (
            <div>
                <div className="page-nav">
                    <BreadcrumbCustom paths={menus}/>
                    <p className="title-style">成单列表</p>
                </div>
                <div className='formBody'>
                    {/*筛选项*/}
                    <div>
                        <Row gutter={16}>
                            <Col className="gutter-row" id="channel" sm={16} span={16}>
                                <span style={{marginRight: '6px', marginLeft: '28px'}}>筛选：</span>
                                <Select
                                    showSearch
                                    style={{width: '160px', marginRight: '30px'}}
                                    onChange={this.chooseMedia}
                                    value={mediaValue}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    getPopupContainer={() => document.getElementById('channel')}
                                >
                                    <Option value="0">选择媒体名称</Option>
                                    {
                                        this.state.mediaName && this.state.mediaName.map((value, index) => {
                                            return (<Option key={value.mediaId} value={index + 1}
                                                            name={value.mediaName}>{value.mediaName}</Option>)
                                        })
                                    }
                                </Select>
                                <Select
                                    showSearch
                                    style={{width: '140px'}}
                                    onChange={this.chooseSeller}
                                    value={sellerValue}
                                    getPopupContainer={() => document.getElementById('channel')}
                                >
                                    <Option value="0">选择运营</Option>
                                    {
                                        this.state.sellerName && this.state.sellerName.map((value, index) => {
                                            return (<Option key={value.realname}
                                                            value={index + 1}>{value.realname}</Option>)
                                        })
                                    }
                                </Select>
                                <Button type="default"
                                        onClick={this.searchReset}
                                        style={{marginLeft: '20px'}}>全部重置</Button>
                            </Col>
                            <Col className="gutter-row" id="date" sm={16} span={16}>
                                <span style={{marginRight: '6px'}}>投放日期：</span>
                                <LocaleProvider locale={zh_CN}>
                                    <RangePicker
                                        value={rangePickerValue}
                                        format={"YYYY-MM-DD"}
                                        onChange={this.chooseDate}
                                        getCalendarContainer={() => document.getElementById('date')}
                                    />
                                </LocaleProvider>
                            </Col>
                        </Row>
                    </div>
                    {/*表格*/}
                    <FormTable
                        dataSource={dataSource}
                        onChange={this.handleChangeSore}
                        changeSore={this.handleChangeSore}
                        loading={loading}
                    >
                    </FormTable>
                    {/*分页*/}
                    <div style={{overflow: 'hidden', marginTop: '20px'}}>
                        <LocaleProvider locale={zh_CN}>
                            <Pagination
                                showSizeChanger
                                onShowSizeChange={this.handleShowSizeChange}
                                onChange={this.handleChangePage}
                                total={dataAll.total}
                                showTotal={this.showTotal.bind(dataAll.total)}
                                current={params.current}
                                pageSize={params.size}
                                defaultPageSize={40}
                            />
                        </LocaleProvider>
                    </div>
                </div>
            </div>
        );
    }

}

const CollectionCreateForm = Form.create()(Local);
export default CollectionCreateForm;
