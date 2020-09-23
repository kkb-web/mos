import React, {Component} from 'react';
import './ChannelDetail.less';
import {
    Row,
    Col,
    Input,
    Button,
    Select,
    Pagination,
    LocaleProvider,
    message,
    DatePicker,
    Modal,
    Table,
    Card
} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import FormTable from './FormTable';
import {getSellersChannel, getPriceAndSignUpNum, getChannelList} from "../../../../api/vipCourseApi";
import {priceType, formatDateTime, vipCourseUrl, disabledDate, vipAuthor} from "../../../../utils/filter";
import {getDate, getTimeDistance} from "../../../../utils/utils";
import LinkModal from './LinkModal'

const {RangePicker} = DatePicker;
let search = false;
//列表条件
let customCondition = {
    courseId: parseInt(window.location.pathname.slice(15)),
    startTime: null,
    endTime: null,
    sellerIds: null,
    name: null
};
//列表参数
let applyData = {
    size: 40,
    current: 1,
    ascs: [],
    descs: ['createTime'],
    condition: customCondition
};
export default class UForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courseId: parseInt(window.location.pathname.slice(15)),
            visible: false, // 新建窗口隐藏
            classVisible: false,
            dataSource: [],
            timeData: [],
            dataAll: '',
            selectedRowKeys: [],
            tableRowKey: 0,
            isUpdate: false,
            loading: true,
            seller: [],
            channel: [],
            classes: [],
            classValue: 0,
            sellerValue: 0,
            payValue: 0,
            channelValue: 0,
            classesValue: 0,
            disableBtn: false,
            resetBtn: false,
            salePage: 2,
            rangePicker: getTimeDistance('month'),
            replay: true,
            courseCode: '',
            qrCode: '',
            sellerName: [],
            filteredInfo: null,
            inputvalue:null
        };
    }

    //获取vip渠道列表
    getChannelListFn = () => {
        getChannelList(applyData).then(res => {
            if (res.data.code == 0) {
                this.setState({
                    dataSource: res.data.data.records,
                    courseCode: res.data.data.courseCode,
                    loading: false,
                    dataAll: res.data.data,
                    disableBtn: false,
                    resetBtn: false,
                });
            } else {
                this.setState({
                    loading: false,
                });
                message.error(res.data.msg)
            }

            console.log(this.state.dataAll);
            search = true;
        }).catch(err => {
            console.log(err)
        })
    };

    //获取历史价格及报名数列表数据
    getPriceAndSignUpNumFn = (id) => {
        getPriceAndSignUpNum({
            courseId: this.state.courseId,
            channelId: id
        }).then(res => {
            this.setState({
                timeData: res.data.data,
            });
        }).catch(err => {
            console.log(err)
        })
    };

    // 获取销售下拉菜单
    getSellerList = () => {
        let params = {
            courseId: this.state.courseId
        };
        getSellersChannel(params).then(res => {
            let sellsnameData = [];
            for (let i = 0; i < res.data.data.length; i++) {
                sellsnameData.push({
                    value: res.data.data[i].salesId,
                    text: res.data.data[i].salesName
                })
            }
            this.setState({
                seller: res.data.data,
                sellerName: sellsnameData
            })
        })
    };

    componentWillMount() {
        customCondition.courseId = parseInt(window.location.pathname.slice(15));
        this.setState({
            courseId: this.state.courseId || this.props.courseId
        })
    };

    // 渲染
    componentDidMount() {
        //判断权限--有权限则请求，没权限不请求
        if (vipAuthor('marketing:vipcourse:channel:list', this.props.subjectId)) {
            this.selectDetailDate('month', 2);
            this.getSellerList();      //销售下拉（包含渠道列表数据
        }
    };
    //数组类型转换
    changeArrType = (arr) => {
        let data = [];
        for (let i = 0; i < arr.length; i++) {
            data.push(Number(arr[i]))
        }
        return data
    };

    // 排序
    changeSore = (record, filters, sorter) => {
        console.log(sorter.order);
        applyData.descs = (sorter.order === "descend" ? [sorter.field] : []);
        applyData.ascs = (sorter.order === "ascend" ? [sorter.field] : []);
        // 排序后，恢复排序时，数据应当保持和默认一致；
        let arr = Object.keys(sorter); //此方法为ES6新方法，返回值是对象中属性名组成的数组；
        if (arr.length == 0) {
            applyData.descs = ['createTime'];
        }
        console.log(filters,"filters");
        if (filters.salesName) {
            customCondition.sellerIds = (filters.salesName.length === 0 ? null : (filters.salesName.map(index => parseInt(index))));
        }
        // if (filters.salesName.length > 0) {
        //     customCondition.sellerIds = this.changeArrType(filters.salesName);
        // }
        this.setState({
            filteredInfo: filters,
            loading: true,
        });
        applyData.current = 1;
        this.getChannelListFn();
    };

    // 销售筛选
    chooseSeller = (value, e) => {
        console.log(e.key)
        applyData.current = 1;
        let sellerIdsArr = [];
        if(e.key == 99999){
            customCondition.sellerIds = null
        }else {
            sellerIdsArr.push(parseInt(e.key));
            customCondition.sellerIds = sellerIdsArr;
        }
        this.setState({
            loading: true,
            sellerValue: value
        });
        this.getChannelListFn();
    };

    // 搜索
    searchUser = () => {
        let inputUser = document.getElementById('search');
        customCondition.name = inputUser.value;
        this.setState({
            loading: true,
        });
        applyData.current = 1;
        if (search) {
            this.setState({
                loading: true,
                disableBtn: true
            });
            this.getChannelListFn();
        }
    };

    // 重置
    searchReset = () => {
        document.getElementById('search').value = null;
        customCondition.name = null;
        customCondition.sellerIds = null;
        customCondition.classId = null;
        customCondition.channelId = null;
        customCondition.payType = null;
        applyData.current = 1;
        this.setState({
            loading: true,
            sellerValue: 0,
            channelValue: 0,
            classValue: 0,
            payValue: 0,
            resetBtn: true,
            inputvalue:null
        });
        console.log(applyData);
        this.getChannelListFn();
    };

    // 改变页码
    onChangePage = (page, pageSize) => {
        applyData.size = pageSize;
        applyData.current = page;
        this.getChannelListFn();
    };

    // 改变每页条数
    onShowSizeChange = (current, pageSize) => {
        applyData.size = pageSize;
        applyData.current = current;
        this.getChannelListFn();
    };

    // vip用户列表总条数
    showTotal = (total) => {
        return `共 ${total} 条数据`;
    };

    // 显示历史价格弹层
    showHistoryPrice = (id) => {
        this.setState({
            classVisible: true,
            isUpdate: true
        });
        this.getPriceAndSignUpNumFn(id);
    };
    // 隐藏历史价格弹层
    cancelClass = () => {
        this.setState({classVisible: false});
    };
    //显示二维码链接弹层
    showModal = (channelCode, appid) => {
        let appParam;
        if(appid){
          appParam = `?tenant=${appid}`
        }else {
          appParam = ''
        }
        this.setState({
            qrCode: vipCourseUrl(appid) + this.state.courseCode + '/' + channelCode + appParam,
            visible: true,
            isUpdate: true,
        })
    };
    // 隐藏二维码链接弹层
    handleCancel = () => {
        this.setState({visible: false});
    };
    //搜索框onchange
    handInputChange = (e)=>{
        this.setState({
            inputvalue:e.target.value
        });
    };

    // 销售详细数据日期选择
    handleRangePicker = (rangePickerValue, dateString) => {
        console.log(new Date(rangePickerValue[0]).getTime(), new Date(rangePickerValue[1]).getTime(), dateString, "=========详细数据日期选择");
        customCondition.startTime = Math.round(new Date(rangePickerValue[0]).getTime() / 1000);
        customCondition.endTime = Math.round(new Date(rangePickerValue[1]).getTime() / 1000);
        this.setState({
            rangePicker: rangePickerValue
        });
        this.setState({
            loading: true
        });
        this.changeDateStyle(null)
        if (vipAuthor('marketing:vipcourse:channel:list', this.props.subjectId)) {
            this.getChannelListFn();
        }

    };
    // 改变日期样式
    changeDateStyle = (index) => {
        let aTags = document.querySelectorAll('.detail-div2 a');
        for (let i = 0; i < aTags.length; i++) {
            if (i === index) {
                aTags[i].classList.add('click-a')
            } else {
                aTags[i].classList.remove('click-a')
            }
        }
    };

    // 销售详细数据改变时间
    selectDetailDate = (type, index) => {
        console.log(type, index);
        this.setState({
            rangePicker: getTimeDistance(type),
            timeType: type,
            styleIndex: index
        });
        customCondition.startTime = Math.round(getDate(type).value[0] / 1000);
        customCondition.endTime = Math.round(getDate(type).value[1] / 1000);
        let aTags = document.querySelectorAll('.detail-div2 a');
        for (let i = 0; i < aTags.length; i++) {
            if (i === index) {
                aTags[i].classList.add('click-a')
            } else {
                aTags[i].classList.remove('click-a')
            }
        }
        this.setState({
            loading: true
        });
        this.changeDateStyle(index);
        if (vipAuthor('marketing:vipcourse:channel:list', this.props.subjectId)) {
            this.getChannelListFn();
        }

    };

    render() {
        const {dataSource, visible, loading, timeData, classVisible, rangePicker, qrCode, seller, sellerName,inputvalue} = this.state;
        let filteredInfo = this.state.filteredInfo || {};
        const {subjectId} = this.props;
        const {Option} = Select;
        //历史价格及报名数表格
        const locale = {
            emptyText: '没有数据'
        };
        const columns = [{
            title: '班次',
            dataIndex: 'name',
        }, {
            title: '价格',
            dataIndex: 'price',
            render: (dataIndex) => dataIndex ? priceType(dataIndex) : '/'
        }, {
            title: '修改时间',
            dataIndex: 'createTime',
            render: (dataIndex) => dataIndex ? formatDateTime(dataIndex) : '/'
        }, {
            title: '报名人数',
            dataIndex: 'signUp',
        }];
        const detailExtra = (
            <div className="sale-pick">
                <div className="detail-div2" style={{float: 'left'}}>
                    <a style={{marginRight: '20px', color: '#666'}} onClick={() => this.selectDetailDate('today', 0)}>
                        今日
                    </a>
                    <a style={{marginRight: '20px', color: '#666'}} onClick={() => this.selectDetailDate('week', 1)}>
                        本周
                    </a>
                    <a style={{marginRight: '20px', color: '#666'}} onClick={() => this.selectDetailDate('month', 2)}>
                        本月
                    </a>
                    <a style={{marginRight: '20px', color: '#666'}} onClick={() => this.selectDetailDate('year', 3)}>
                        全年
                    </a>
                </div>
                <RangePicker
                    value={rangePicker}
                    onChange={this.handleRangePicker}
                    style={{width: 256}}
                    disabledDate={disabledDate}
                />
            </div>
        );
        const saleDetail = (
            <div>
                <div className="sale-title">
                    详细数据列表
                </div>
                {detailExtra}
            </div>
        );
        return (
            <Card title={saleDetail} bordered={false} bodyStyle={{padding: 24}} style={{marginTop: '20px'}}>
                {vipAuthor('marketing:vipcourse:channel:list', subjectId) ?
                    <div ref={node => this.node = node} className="vip-sale" style={{margin: '-20px'}}>
                        <div className='formBody channel'>
                            <Row gutter={16}>
                                <Col className="gutter-row sale-label label" sm={2} style={{marginTop: '3px'}}>
                                    <span>筛选：</span>
                                </Col>
                                <Col className="gutter-row" id="channellist" sm={16} span={10}>
                                    <Select
                                        style={{width: '160px'}}
                                        defaultValue={0}
                                        value={this.state.sellerValue}
                                        onChange={this.chooseSeller}
                                        getPopupContainer={() => document.getElementById('channellist')}
                                    >
                                        <Option key="99999" value={0}>选择销售</Option>
                                        {
                                            seller && seller.map((value, index) => {
                                                return (<Option key={value.salesId}
                                                                value={index + 1}>{value.salesName}</Option>)
                                            })
                                        }
                                    </Select>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col className="gutter-row sale-label label" sm={2} style={{marginTop: '5px'}}>
                                    <span>搜索：</span>
                                </Col>
                                <Col className="gutter-row" sm={8}>
                                    <Input value={inputvalue} onChange={this.handInputChange} placeholder="搜索渠道名称" id="search"/>
                                </Col>
                                <Col className="gutter-row" sm={9}>
                                    <Button type="primary" style={{marginRight: '20px'}} onClick={this.searchUser}
                                            disabled={this.state.disableBtn}>搜索</Button>
                                    <Button type="default" onClick={this.searchReset}
                                            disabled={this.state.resetBtn}>重置</Button>
                                </Col>
                            </Row>
                            <LocaleProvider locale={zh_CN}>
                                <FormTable
                                    dataSource={dataSource}
                                    changeSore={this.changeSore}
                                    showHistoryPrice={this.showHistoryPrice}
                                    showLink={this.showModal}
                                    loading={loading}
                                    sellerData={sellerName}
                                    filteredInfo={filteredInfo}
                                />
                            </LocaleProvider>
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
                            <Modal
                                visible={classVisible}
                                title="历史价格及报名数"
                                footer={null}
                                onCancel={this.cancelClass}
                            >
                                <div style={{textAlign: 'center', paddingBottom: '20px'}} id="class">
                                    <Table
                                        key={(record, i) => i}
                                        rowKey={(record, i) => i}
                                        columns={columns}
                                        dataSource={timeData}
                                        pagination={false}
                                        bordered={false}
                                        locale={locale}
                                    />
                                </div>
                            </Modal>
                            <LinkModal onCancel={this.handleCancel} id={qrCode} visible={visible}/>
                        </div>
                    </div>
                    :
                    <div style={{textAlign: 'center', margin: '30px auto'}}>没有数据</div>}
            </Card>
        )
    }
}
