import 'antd/dist/antd.css';
import 'ant-design-pro/dist/ant-design-pro.css';
import {Card, DatePicker, LocaleProvider, Pagination, Table, message} from 'antd';
import React, {Component} from 'react';
import {getDate, getTimeDistance} from '../../../../utils/utils';
import {connect} from "../../../../utils/socket";
import {
    getToken,
    getChartData,
    priceType,
    disabledDate,
    getXDate,
    timeToDate, vipAuthor, getNum
} from "../../../../utils/filter";
import "./Sale.less";
import Doubleades from '../../../charts/Doubleaxes/index';
import zh_CN from "antd/lib/locale-provider/zh_CN";
import DetailData from "./DetailData";
import {getSaleChart, getSellerList} from "../../../../api/vipCourseApi";

const {RangePicker} = DatePicker;

let customCondition = {
    courseId: null,
    startTime: null,
    endTime: null
};
let params = {
    size: 5,    // 分页大小
    current: 1, // 当前页
    // descs: ["price"], // 倒序
    condition: customCondition
};

let chartParams = {
    courseId: null,
    sellerId: null,
    startTime: null,
    endTime: null
};

export default class Sale extends Component {
    constructor (props) {
        super (props);
        this.state = {
            dataSource: [],
            salesType: 'all',
            currentTabKey: '',
            rangePickerValue: getTimeDistance('week'),
            charts:{
                data: [],
                height: 317,
                padding: [],
                scale: {},
            },
            allPrice: '',
            courseId: parseInt(window.location.pathname.slice(15))
        };
    }

    // 渲染
    componentDidMount (){
        customCondition.courseId = chartParams.courseId = this.state.courseId;
        // //链接websocket
        // connect(getToken('username'));
        // //end
        //判断权限--有权限则请求，没权限不请求
        if(vipAuthor('marketing:vipcourse:sales:table', this.props.subjectId)){
            this.selectDate('month', 2);
        }
    };

    // 获取销售排名列表
    getSellerList = () => {
        console.log(params, "=======销售列表提交数据");
        getSellerList(params).then(response => {
            if (response.data.code === 0) {
                this.setState({
                    dataSource: response.data.data.records,
                    total: response.data.data.total,
                    size: response.data.data.size,
                    pages: response.data.data.pages,
                    current: response.data.data.current,
                    allPrice: response.data.data.allPrice
                });
            } else {
                message.error(response.data.msg)
            }
        })
    };

    // 销售图表日期选择
    handleRangePickerChange = (rangePickerValue, dateString) => {
        console.log(new Date(rangePickerValue[0]).getTime(),new Date(rangePickerValue[1]).getTime(), "=========图表日期选择");
        this.setState({
            rangePickerValue
        });
        chartParams.startTime = customCondition.startTime = Math.round((new Date(rangePickerValue[0]).getTime()) / 1000);
        chartParams.endTime = customCondition.endTime = Math.round((new Date(rangePickerValue[1]).getTime()) / 1000);
        let start = dateString[0], end = dateString[1];
        console.log(start, end);
        this.changeData('self', getXDate(start, end));
        this.getSellerList();
        this.changeDateStyle(null);
    };

    // 销售图表改变时间
    selectDate = (type, index) => {
        this.setState({
            rangePickerValue: getTimeDistance(type)
        });
        console.log(getDate(type).value, "=====销售图表时间");
        chartParams.startTime = customCondition.startTime = Math.round(getDate(type).value[0] / 1000);
        chartParams.endTime = customCondition.endTime = Math.round(getDate(type).value[1] / 1000);
        let start = timeToDate(getDate(type).value[0]), end = timeToDate(getDate(type).value[1]);
        console.log(start, end);
        this.changeData('', getXDate(start, end));
        this.getSellerList();
        this.changeDateStyle(index);
        // this.changeChartData(type); // 自动改变横坐标（非后台返回）
    };

    // 改变日期样式
    changeDateStyle = (index) => {
        let aTags = document.querySelectorAll('.click-div a');
        for (let i = 0; i < aTags.length; i++) {
            if (i === index) {
                aTags[i].classList.add('click-a');
            } else {
                aTags[i].classList.remove('click-a');
            }
        }
    };

    // 选择时间改变图表数据
    changeData = (type, date) => {
        console.log(chartParams, "======销售图表提交数据");
        let chartXDate = [];
        getSaleChart(chartParams).then(res => {
            console.log(res.data.data, "========图标返回数据");
            console.log(date, "======横坐标数据");
            let data = res.data.code === 0 ? res.data.data : [];
            let array = [],
                xDate = date.xDate;
            let dataAll = [];
            if (date.type === 'today') {
                for (let i = 0; i < xDate.length; i++) {
                    dataAll.push({
                        time: xDate[i],
                        price: 0,
                        number: 0
                    });
                    for (let j = 0; j < data.length; j++) {
                        if (parseInt(xDate[i].split(':')[0]) === parseInt(data[j].time.split(' ')[1])) {
                            dataAll.splice(i, 1, {
                                time: xDate[i],
                                price: data[j].price,
                                number: data[j].number
                            });
                            break;
                        }
                    }
                }
                chartXDate = dataAll;
                console.log(data, dataAll, '=============today数据');
            } else if (date.type === 'month') {
                let dataAll = [];
                for (let i = 0; i < data.length; i++) {
                    for (let j = data.length-1; j > i; j--) {
                        if (data[i].time.split(' ')[0].toString() === data[j].time.split(' ')[0].toString()) {
                            data[i].price = (data[i].price * 1 + data[j].price * 1);
                            data[i].number = (data[i].number * 1 + data[j].number * 1);
                            data.splice(j, 1)
                        }
                    }
                }
                for (let i = 0; i < xDate.length; i++) {
                    dataAll.push({
                        time: xDate[i],
                        price: 0,
                        number: 0
                    });
                    for (let j = 0; j < data.length; j++) {
                        if (date.date[i].toString() === data[j].time.split(' ')[0].toString()) {
                            dataAll.splice(i, 1, {
                                time: xDate[i],
                                price: data[j].price,
                                number: data[j].number
                            });
                            break;
                        }
                    }
                }
                chartXDate = dataAll;
                console.log(data, dataAll);
            } else if (date.type === 'year') {
                let dataAll = [];
                for (let i = 0; i < data.length; i++) {
                    console.log(data[i].time.slice(0, 6));
                    for (let j = data.length - 1; j > i; j--) {
                        if (data[i].time.slice(0, 7).toString() === data[j].time.slice(0, 7).toString()) {
                            data[i].price = (data[i].price * 1 + data[j].price * 1);
                            data[i].number = (data[i].number * 1 + data[j].number * 1);
                            data.splice(j, 1)
                        }
                    }
                }
                for (let i = 0; i < xDate.length; i++) {
                    dataAll.push({
                        time: xDate[i],
                        price: 0,
                        number: 0
                    });
                    for (let j = 0; j < data.length; j++) {
                        if (date.date[i].toString() === data[j].time.slice(0, 7).toString()) {
                            dataAll.splice(i, 1, {
                                time: xDate[i],
                                price: data[j].price,
                                number: data[j].number
                            });
                            break;
                        }
                    }
                }
                chartXDate = dataAll;
                console.log(data, dataAll);
            } else if (date.type === 'month_week') {
                let dataAll = [], dataArr = [];
                for (let i = 0; i < data.length; i++) {
                    for (let j = data.length - 1; j > i; j--) {
                        if (data[i].time.split(' ')[0].toString() === data[j].time.split(' ')[0].toString()) {
                            data[i].price = (data[i].price * 1 + data[j].price * 1);
                            data[i].number = (data[i].number * 1 + data[j].number * 1);
                            data.splice(j, 1)
                        }
                    }
                }
                for (let i = 0; i < xDate.length; i++) {
                    dataAll.push({
                        time: xDate[i],
                        price: 0,
                        number: 0
                    });
                    for (let j = 0; j < data.length; j++) {
                        if (Math.floor(date.date.indexOf(data[j].time.split(' ')[0])/7) === i) {
                            console.log(data, data[j].time.split(' ')[0], Math.floor(date.date.indexOf(data[j].time.split(' ')[0])/7));
                            dataArr.push({
                                time: data[j].time,
                                price: data[j].price,
                                number: data[j].number,
                                index: i
                            });
                        }
                    }
                }
                for (let m = 0; m < dataArr.length; m ++) {
                    for (let n = dataArr.length - 1; n > m; n--) {
                        if (dataArr[m].index === dataArr[n].index) {
                            dataArr[m].price = (dataArr[m].price * 1 + dataArr[n].price * 1);
                            dataArr[m].number = (dataArr[m].number * 1 + dataArr[n].number * 1);
                            dataArr.splice(n, 1)
                        }
                    }
                }
                for (let k = 0; k < dataArr.length; k++) {
                    dataAll.splice(dataArr[k].index, 1, {
                        time: dataAll[dataArr[k].index].time,
                        price: dataArr[k].price,
                        number: dataArr[k].number
                    })
                }
                chartXDate = dataAll;
                console.log(data, dataArr, dataAll);
            }
            console.log(chartXDate, "=============销售图表横坐标");
            for (let i = 0; i < chartXDate.length; i++){
                array.push({
                    time: chartXDate[i].time,
                    call: 13,
                    销售额: parseFloat(getNum(chartXDate[i].price)),
                    订单量: chartXDate[i].number
                })
            }
            let chartData = this.state.charts;
            chartData.data = array;
            this.setState({
                charts: chartData
            })
        })
    };


    // 图表显示单个销售数据
    changeSellerData = (record, index) => {
        console.log(record, index);
        chartParams.sellerId = record.sellerId;
        this.changeData('', getXDate(timeToDate(chartParams.startTime * 1000), timeToDate(chartParams.endTime * 1000)));
        let names = document.querySelectorAll('.vip-seller-name');
        for (let i = 0; i < names.length; i++) {
            if (index === i) {
                names[i].style.color = '#1890ff';
            } else {
                names[i].style.color = '#333';
            }
        }
    };

    // 点击表头查看所有数据
    showAllData = () => {
        chartParams.sellerId = null;
        this.changeData('', getXDate(timeToDate(chartParams.startTime * 1000), timeToDate((chartParams.endTime - 1) * 1000)));
        let names = document.querySelectorAll('.vip-seller-name');
        for (let i = 0; i < names.length; i++) {
            names[i].style.color = '#333';
        }
    };

    // 分页
    onChangePage =(page, pageSize)=>{
        params.current = page;
        params.size = pageSize;
        this.getSellerList();
    };

    render() {
        const {rangePickerValue, current, size} = this.state;
        const sortNum = (current - 1) * size
        const salesExtra = (
            <div className="sale-pick">
                <div className="click-div" style={{float: 'left'}}>
                    <a style={{marginRight: '20px', color: '#666'}} onClick={() => this.selectDate('today', 0)}>
                        今日
                    </a>
                    <a style={{marginRight: '20px', color: '#666'}} onClick={() => this.selectDate('week', 1)}>
                        本周
                    </a>
                    <a style={{marginRight: '20px', color: '#666'}} onClick={() => this.selectDate('month', 2)}>
                        本月
                    </a>
                    <a style={{marginRight: '20px', color: '#666'}} onClick={() => this.selectDate('year', 3)}>
                        全年
                    </a>
                </div>
                <RangePicker
                    value={rangePickerValue}
                    onChange={this.handleRangePickerChange}
                    style={{width: 256}}
                    disabledDate={disabledDate}
                />
            </div>
        );
        const saleChart = (
          <div>
              <div className="sale-title">
                  销售图表
              </div>
              {salesExtra}
          </div>
        );
        const locale = {
            emptyText: '没有数据'
        };
        const columns = [{
            title: '排名',
            dataIndex: 'number',
            // render: (dataIndex, record, i) => {console.log(current,"dataIndex")}
            render: (dataIndex, record, i) => (i + 1) > 3 ? ((i + 1) + sortNum) :
                <p style={{display: 'inline-block', marginBottom: '0', width: '20px', height: '20px', borderRadius: '50%', background: '#314659', color: '#fff'}}>{(i + 1) + sortNum}</p>
        }, {
            title: <span style={{cursor: 'pointer'}} onClick={this.showAllData}>销售</span>,
            dataIndex: 'salesName',
            render: (dataIndex, record, i) =>
                <span className="vip-seller-name" onClick={() => this.changeSellerData(record, i)}>
                    {dataIndex}
                </span>
        }];
        // {
        //     title: '销售金额',
        //     dataIndex: 'price',
        //     render: (dataIndex) => priceType(dataIndex)
        // }
        /*<h4>总销售额：￥{priceType(allPrice ? allPrice : 0)}</h4>*/
        const {dataSource, allPrice} = this.state;
        console.log(dataSource,"hason")
        const {subjectId} = this.props;
        return (
            <div className="vip-course-sale" style={{margin: "0 30px"}}>
                <Card title={saleChart} bordered={false} bodyStyle={{padding: 24}}>
                    {vipAuthor('marketing:vipcourse:sales:table', subjectId) && dataSource.length !== 0 ?
                        <div>
                            <Doubleades
                                charts={this.state.charts}
                            />
                            <div className="right-table">

                                <Table
                                    key={(record, i) => i}
                                    rowKey={(record, i) => i}
                                    style={{marginTop: '10px'}}
                                    columns={columns}
                                    dataSource={dataSource}
                                    currentPage={current}
                                    pagination={false}
                                    bordered={false}
                                    locale={locale}
                                />
                                <div className="right-table-page">
                                    <LocaleProvider locale={zh_CN}>
                                        <Pagination
                                            // showSizeChanger
                                            onChange={this.onChangePage.bind(this)}
                                            pageSize={params.size}
                                            total={this.state.total}
                                            current={params.current}
                                            size={'small'}
                                        />
                                    </LocaleProvider>
                                </div>
                            </div>
                        </div> :
                        <div style={{textAlign: 'center', margin: '30px auto'}}>没有数据</div>
                    }
                </Card>
                <DetailData classId={this.props.classId ? this.props.classId : null} subjectId={subjectId}/>
            </div>
        );
    }


}
