import 'antd/dist/antd.css';
import 'ant-design-pro/dist/ant-design-pro.css';
import {Card, DatePicker, Tree, LocaleProvider, Pagination, Table} from 'antd';
import React, {Component} from 'react';
import {getDate, getTimeDistance} from '../../../../utils/utils';
import {timeToDate, getXDate, disabledDate, vipAuthor} from "../../../../utils/filter";
import "./ChannelList.less";
import LineDiagram from '../../../charts/LineDiagram/index'
import DetailData from "./ChannelDetail";
import {
    getSellerAndChannels,
    getChannelChart
} from "../../../../api/vipCourseApi";

const {RangePicker} = DatePicker;
const {TreeNode} = Tree;
let lastchecked = [];
let sellerdataFix = [];  //全员key
let params = {
    courseId: parseInt(window.location.pathname.slice(15)),
    users: [],
    channels: [],
    startTime: null,
    endTime: null
};

export default class Sale extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rangePickerValue: getTimeDistance('month'),
            charts: {
                data: [],
                height: 400,
                padding: [],
                scale: {},
            },
            courseId: parseInt(window.location.pathname.slice(15)),
            expandedKeys: [],
            autoExpandParent: true,
            autoExpandParent2: true,
            checkedKeys: [],
            selectedKeys: [],
            selectedKeysChannel: [],
            checkedType: null,
            allSellerData: [],
            allSellerAndChannel: [], //具体销售及渠道
            treeData: [],    //图形需要的数据
            treeDataChannel: [],
            allChannel: [],   //全部销售的id和渠道id；
            ArrHead: [],
            sellerNames: [],
            sellerNames2: [],
            dataFlage: [],
            timeType: 'month',
            styleIndex: 1,
            checkedKeysChannel: [],   //渠道选中数组
            allChannelsalesId: []     //全部渠道中销售的id

        };
    }

    //获取销售及其所有渠道
    getSellerAndChannelsFn = () => {
        let alldata = {
            courseId: this.state.courseId
        };
        getSellerAndChannels(alldata).then(res => {
            if (res.data.code === 0) {
                let checkedKeys = [];
                let salesNames = [];
                let users = res.data.data.users;
                for (let i = 0; i < users.length; i++) {
                    checkedKeys.push(users[i].sellerId)
                }
                for (let i = 0; i < users.length; i++) {
                    salesNames.push(users[i].salesName)
                }
                this.setState({
                    dataFlage: res.data.data.user,
                    sellerNames: salesNames
                });
                params.users = this.changeArrType(checkedKeys);
                this.HandleTreeData(res.data.data);
                this.selectDate('month', 2);

            }
        }).catch(err => {
            console.log(err)
        })
    };
    //数组类型转换
    changeArrType = (arr) => {
        let data = [];
        for (let i = 0; i < arr.length; i++) {
            data.push(Number(arr[i]))
        }
        return data
    };
    //处理树型图数据
    HandleTreeData = (data) => {
        let allSellerData = [{
            title: '全组人员',
            key: "9999",
            children: []
        }];
        let allChannelSellerkey = [];
        let allChannelKey = [];
        let allChannelobj = [];
        let allChannel = [];
        let checkedKeys = [];
        let allSellerAndChannel = [];
        for (let i = 0; i < data.users.length; i++) {
            allSellerData[0].children.push({
                title: data.users[i].salesName,
                key: String(data.users[i].sellerId)
            })
        }
        for (let i = 0; i < data.user.length; i++) {
            allSellerAndChannel.push({
                title: data.user[i].salesName,
                key: String(data.user[i].sellerId + '_' + i), //具体销售下的销售id自定义添加判别
                children: data.user[i].channels
            })
        }
        let ArrHead = [];
        for (let i = 0; i < allSellerAndChannel.length; i++) {
            ArrHead.push(allSellerAndChannel[i].key)
        }
        for (let i = 0; i < allSellerData[0].children.length; i++) {
            checkedKeys.push(allSellerData[0].children[i].key)
        }
        for (let i = 0; i < allSellerAndChannel.length; i++) {
            if (allSellerAndChannel[i].children.length > 0) {
                let changeData = allSellerAndChannel[i].children.map(item => {
                    return {
                        key: String(item.channelId),
                        title: item.channelName
                    }
                });
                allSellerAndChannel[i].children = changeData;
            }
        }
        //销售中所有的销售id
        let allsalesTwoId = [];
        let saleschildren = allSellerData[0].children;
        for (let i = 0; i < saleschildren.length; i++) {
            allsalesTwoId.push(saleschildren[i].key)
        }
        console.log(allsalesTwoId)
        //渠道中所有销售id
        let allChannelsalesId = [];
        for (let i = 0; i < allSellerAndChannel.length; i++) {
            allChannelsalesId.push(allSellerAndChannel[i].key)
        }
        //处理全部的销售渠道
        for (let i = 0; i < allSellerAndChannel.length; i++) {
            allChannelSellerkey.push(allSellerAndChannel[i].key);
            allChannelobj.push(...allSellerAndChannel[i].children)
        }
        for (let i = 0; i < allChannelobj.length; i++) {
            allChannelKey.push(allChannelobj[i].key)
        }
        ArrHead = ["9999", ...ArrHead];
        allChannel = [...allChannelSellerkey, ...allChannelKey];
        this.setState({
            allSellerData: allSellerData,
            allSellerAndChannel: allSellerAndChannel,
            expandedKeys: ['9999'],
            checkedKeys: allsalesTwoId,
            allChannel: allChannel,
            ArrHead: ArrHead,
            treeData: allSellerData,
            treeDataChannel: allSellerAndChannel,
            allChannelsalesId: allChannelsalesId
        });
        lastchecked = ["9999", ...checkedKeys];
        sellerdataFix = lastchecked;  //设置固定的全员key
    };

    onExpand = (expandedKeys) => {
        console.log('onExpand', expandedKeys);
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };

    //渠道check
    onCheckChannel = (checkedKeys, info) => {
        let allChannelsalesId = this.state.allChannelsalesId;
        for (let i = 0; i < allChannelsalesId.length; i++) {
            checkedKeys = checkedKeys.filter(item => item !== allChannelsalesId[i]);
        }
        params.channels = this.changeArrType(checkedKeys);
        params.users = [];
        let namedata = this.state.allSellerAndChannel;
        let allChannelobj = [];
        let name = [];
        for (let i = 0; i < namedata.length; i++) {
            allChannelobj.push(...namedata[i].children)
        }
        for (let i = 0; i < allChannelobj.length; i++) {
            for (let j = 0; j < checkedKeys.length; j++) {
                if (parseInt(checkedKeys[j]) == parseInt(allChannelobj[i].key)) {
                    name.push(allChannelobj[i].title)
                    break
                }
            }
        }
        console.log(name);
        this.setState({
            sellerNames: name,
            checkedKeys: [],
            checkedKeysChannel: checkedKeys
        });
        console.log(this.state.sellerNames, "++");
        this.selectDate(this.state.timeType, this.state.styleIndex)
    };
    //渠道select
    onSelectChannel = (selectedKeys, info) => {
        let checkedKeysData = this.state.checkedKeysChannel;
        if (info.node.props.checked) {
            let deletdata = info.node.props.eventKey; //删除单个值
            if (info.node.props.children) {
                //删除一组值
                const childrenKeys = info.node.getNodeChildren().map(item => item.key);
                console.log(checkedKeysData, "&&&&&&&&!!")
                console.log(childrenKeys, "&&&&&&&&")
                for (let i = 0; i < childrenKeys.length; i++) {
                    checkedKeysData = checkedKeysData.filter(item => item !== childrenKeys[i]);
                }
            } else {
                checkedKeysData = checkedKeysData.filter(item => item !== deletdata);
            }

        } else {
            let addData = info.node.props.eventKey;
            console.log(addData, '没选中时，select的当前值');
            if (info.node.props.children) {
                const childrenKeys = info.node.getNodeChildren().map(item => item.key);
                checkedKeysData = checkedKeysData.concat(childrenKeys);
            } else {
                checkedKeysData = checkedKeysData.concat(addData);
            }
        }
        console.log(selectedKeys);
        console.log(checkedKeysData, "11111");
        let channelsData = checkedKeysData.filter(function (element, index, self) {
            return self.indexOf(element) === index;
        });
        params.channels = this.changeArrType(channelsData);
        params.users = [];
        let namedata = this.state.allSellerAndChannel;
        let allChannelobj = [];
        let name = [];
        for (let i = 0; i < namedata.length; i++) {
            allChannelobj.push(...namedata[i].children)
        }
        for (let i = 0; i < allChannelobj.length; i++) {
            for (let j = 0; j < checkedKeysData.length; j++) {
                if (parseInt(checkedKeysData[j]) == parseInt(allChannelobj[i].key)) {
                    name.push(allChannelobj[i].title)
                    break
                }
            }
        }
        console.log(name)
        this.setState({
            sellerNames: name,
            selectedKeysChannel: selectedKeys,
            checkedKeysChannel: checkedKeysData,
            selectedKeys: [],
            checkedKeys: []
        });
        this.selectDate(this.state.timeType, this.state.styleIndex)
    };

    //销售onCheck
    onCheck = (checkedKeys, info) => {
        checkedKeys = checkedKeys.filter(item => item !== '9999');
        console.log(checkedKeys);
        params.channels = [];
        params.users = this.changeArrType(checkedKeys);
        let namedata = this.state.allSellerData;
        let allChannelobj = namedata[0].children;
        let name = [];
        for (let i = 0; i < allChannelobj.length; i++) {
            for (let j = 0; j < checkedKeys.length; j++) {
                if (parseInt(checkedKeys[j]) == parseInt(allChannelobj[i].key)) {
                    name.push(allChannelobj[i].title)
                    break
                }
            }
        }
        console.log(name);
        this.setState({
            sellerNames: name,
            checkedKeys: checkedKeys,
            checkedKeysChannel: []
        });
        this.selectDate(this.state.timeType, this.state.styleIndex)
    };

    //销售onSelect
    onSelect = (selectedKeys, info) => {
        let checkedKeysData = this.state.checkedKeys;
        console.log(checkedKeysData)
        if (info.node.props.checked) {
            let deletdata = info.node.props.eventKey; //删除单个值
            if (info.node.props.children) {
                //删除一组值
                const childrenKeys = info.node.getNodeChildren().map(item => item.key);
                console.log(checkedKeysData, "&&&&&&&&!!")
                console.log(childrenKeys, "&&&&&&&&")
                for (let i = 0; i < childrenKeys.length; i++) {
                    checkedKeysData = checkedKeysData.filter(item => item !== childrenKeys[i]);
                }
            } else {
                checkedKeysData = checkedKeysData.filter(item => item !== deletdata);
            }

        } else {
            let addData = info.node.props.eventKey;
            console.log(addData, '没选中时，select的当前值');
            if (info.node.props.children) {
                const childrenKeys = info.node.getNodeChildren().map(item => item.key);
                checkedKeysData = checkedKeysData.concat(childrenKeys);
            } else {
                checkedKeysData = checkedKeysData.concat(addData);
            }
        }
        console.log(selectedKeys);
        console.log(checkedKeysData, "11111");
        let usersData = checkedKeysData.filter(function (element, index, self) {
            return self.indexOf(element) === index;
        });
        params.users = this.changeArrType(usersData);
        params.channels = [];
        let namedata = this.state.allSellerData;
        let allChannelobj = namedata[0].children;
        let name = [];
        for (let i = 0; i < allChannelobj.length; i++) {
            for (let j = 0; j < checkedKeysData.length; j++) {
                if (parseInt(checkedKeysData[j]) == parseInt(allChannelobj[i].key)) {
                    name.push(allChannelobj[i].title)
                    break
                }
            }
        }
        console.log(name);
        this.setState({
            sellerNames: name,
            selectedKeysChannel: [],
            checkedKeysChannel: [],
            selectedKeys: selectedKeys,
            checkedKeys: checkedKeysData
        });
        this.selectDate(this.state.timeType, this.state.styleIndex)
    };
    renderTreeNodes = data => data.map((item, index) => {
        if (item.children) {
            return (
                <TreeNode ref={'ad' + index} title={item.title} key={item.key} dataRef={item}>
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode {...item} />;
    });
    renderTreeNodes2 = data => data.map((item, index) => {
        if (item.children) {
            return (
                <TreeNode ref={'ad' + index} title={item.title} key={item.key} dataRef={item}>
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode {...item} />;
    });

    //挂载前渲染
    componentWillMount() {
        params.courseId = parseInt(window.location.pathname.slice(15));
    };

    // 渲染
    componentDidMount() {
        //判断权限--有权限则请求，没权限不请求
        if(vipAuthor('marketing:vipcourse:channel:table', this.props.subjectId)){
            this.getSellerAndChannelsFn();
        }
    };
    componentWillUnmount(){
        this.selectDate('week',1)
    };


    // 销售图表日期选择
    handleRangePickerChange = (rangePickerValue, dateString) => {
        console.log(new Date(rangePickerValue[0]).getTime(), new Date(rangePickerValue[1]).getTime(), dateString, "=========图表日期选择");
        console.log(rangePickerValue, "=========图表日期选择2");
        this.setState({
            rangePickerValue:rangePickerValue
        });
        params.startTime  = Math.round(new Date(rangePickerValue[0]).getTime() / 1000);
        params.endTime  = Math.round(new Date(rangePickerValue[1]).getTime() / 1000);
        let start = dateString[0], end = dateString[1];
        if(vipAuthor('marketing:vipcourse:channel:table', this.props.subjectId)){
            this.changeData('self', getXDate(start, end));
        }
        // this.selectDate(this.state.timeType, this.state.styleIndex)
        this.changeDateStyle(null);
    };

    // 改变日期样式
    changeDateStyle = (index) => {
        console.log(index,"index")
        let aTags = document.querySelectorAll('.click-div2 a');
        for (let i = 0; i < aTags.length; i++) {
            if (i === index) {
                aTags[i].classList.add('click-a');
            } else {
                aTags[i].classList.remove('click-a');
            }
        }
    };

    // 销售图表改变时间
    selectDate = (type, index) => {
        this.setState({
            rangePickerValue: getTimeDistance(type),
            timeType: type,
            styleIndex: index
        });
        console.log(getDate(type).value, "=====销售图表时间");
        params.startTime = Math.round(getDate(type).value[0] / 1000);
        params.endTime = Math.round(getDate(type).value[1] / 1000);
        let start = timeToDate(getDate(type).value[0]), end = timeToDate(getDate(type).value[1]);
        if(vipAuthor('marketing:vipcourse:channel:table', this.props.subjectId)){
            this.changeData('', getXDate(start, end));
        }
        this.changeDateStyle(index);
        // this.changeChartData(type); // 自动改变横坐标（非后台返回）
    };

    // 选择时间改变图表数据
    changeData = (type, date) => {
        let chartXDate = [];
        if(params.channels == null && params.users == null){
            params.channels = null;
            params.users = null;
        }else {
            if (params.users.length == 0 && params.channels.length == 0) {
                params.channels = null;
                params.users = null;
            }
        }
        getChannelChart(params).then(res => {
            if (res.data.code == 0) {
                if(this.state.checkedKeys.length == 0 && this.state.checkedKeysChannel.length == 0){
                    let chartData = this.state.charts;
                    chartData.data = [];
                    this.setState({
                        charts: chartData,
                        sellerNames: []
                    });
                } else {
                    let data = res.data.code === 0 ? res.data.data : [];
                    let sellerNames = this.state.sellerNames,
                        xDate = date.xDate;
                    let dataAll = [], name = {};
                    if (date.type === 'today') {
                        console.log(data, name, "======所有人");
                        for (let i = 0; i < xDate.length; i++) {
                            dataAll.push({
                                time: xDate[i],
                            });
                            for (let k = 0; k < sellerNames.length; k++) {
                                dataAll[i][sellerNames[k]] = 0;
                            }
                            for (let j = 0; j < data.length; j++) {
                                if (parseInt(xDate[i].split(':')[0]) === parseInt(data[j].time.split(' ')[1])) {
                                    dataAll[i][data[j].name] = data[j].number;
                                }
                            }
                        }
                        chartXDate = dataAll;
                        console.log(data, dataAll, '=============today数据');
                    } else if (date.type === 'month') {
                        let dataAll = [];
                        for (let i = 0; i < data.length; i++) {
                            for (let j = data.length - 1; j > i; j--) {
                                if (data[i].time.split(' ')[0].toString() === data[j].time.split(' ')[0].toString() && data[i].name === data[j].name) {
                                    data[i].number = (data[i].number * 1 + data[j].number * 1);
                                    data.splice(j, 1)
                                }
                            }
                        }
                        console.log(data, "=======数据");
                        for (let i = 0; i < xDate.length; i++) {
                            dataAll.push({
                                time: xDate[i],
                            });
                            for (let k = 0; k < sellerNames.length; k++) {
                                dataAll[i][sellerNames[k]] = 0;
                            }
                            for (let j = 0; j < data.length; j++) {
                                if (date.date[i].toString() === data[j].time.split(' ')[0].toString()) {
                                    dataAll[i][data[j].name] = data[j].number;
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
                                if (data[i].time.slice(0, 7).toString() === data[j].time.slice(0, 7).toString() && data[i].name === data[j].name) {
                                    data[i].number = (data[i].number * 1 + data[j].number * 1);
                                    data.splice(j, 1)
                                }
                            }
                        }
                        console.log(data);
                        for (let i = 0; i < xDate.length; i++) {
                            dataAll.push({
                                time: xDate[i],
                            });
                            for (let k = 0; k < sellerNames.length; k++) {
                                dataAll[i][sellerNames[k]] = 0;
                            }
                            for (let j = 0; j < data.length; j++) {
                                if (date.date[i].toString() === data[j].time.slice(0, 7).toString()) {
                                    dataAll[i][data[j].name] = data[j].number;
                                }
                            }
                        }
                        chartXDate = dataAll;
                        console.log(data, dataAll);
                    } else if (date.type === 'month_week') {
                        let dataAll = [], dataArr = [];
                        for (let i = 0; i < data.length; i++) {
                            for (let j = data.length - 1; j > i; j--) {
                                if (data[i].time.split(' ')[0].toString() === data[j].time.split(' ')[0].toString() && data[i].name === data[j].name) {
                                    data[i].number = (data[i].number * 1 + data[j].number * 1);
                                    data.splice(j, 1)
                                }
                            }
                        }
                        for (let i = 0; i < xDate.length; i++) {
                            dataAll.push({
                                time: xDate[i],
                            });
                            for (let k = 0; k < sellerNames.length; k++) {
                                dataAll[i][sellerNames[k]] = 0;
                            }
                            for (let j = 0; j < data.length; j++) {
                                if (Math.floor(date.date.indexOf(data[j].time.split(' ')[0]) / 7) === i) {
                                    dataArr.push({
                                        name: data[j].name,
                                        time: data[j].time,
                                        number: data[j].number,
                                        index: i
                                    });
                                }
                            }
                        }
                        for (let m = 0; m < dataArr.length; m++) {
                            for (let n = dataArr.length - 1; n > m; n--) {
                                if (dataArr[m].index === dataArr[n].index && dataArr[m].name === dataArr[n].name) {
                                    dataArr[m].number = (dataArr[m].number * 1 + dataArr[n].number * 1);
                                    dataArr.splice(n, 1)
                                }
                            }
                        }
                        for (let k = 0; k < dataArr.length; k++) {
                            dataAll[dataArr[k].index][dataArr[k].name] = dataArr[k].number
                        }
                        chartXDate = dataAll;
                        console.log(data, dataArr, dataAll);
                    }
                    console.log(chartXDate, "==============最终图表数据");
                    let allnumber = [];
                    let numberData = chartXDate;
                    let lastName = this.state.sellerNames;
                    for (let i =0;i<numberData.length;i++){
                        for (let j=0;j<sellerNames.length;j++){
                            allnumber.push(numberData[i][lastName[j]])
                        }
                    }
                    allnumber.sort(function (a,b) {
                        return a-b
                    });
                    let maxNumber = allnumber[allnumber.length-1];
                    let chartData = this.state.charts;
                    chartData.maxNumber = maxNumber;
                    chartData.data = chartXDate;
                    this.setState({
                        charts: chartData,
                        sellerNames: this.state.sellerNames
                    })
                }
            }
        })
    };


    render() {
        const {rangePickerValue, treeDataChannel, charts, sellerNames, dataFlage} = this.state;
        const {subjectId} = this.props;
        const salesExtra = (
            <div className="sale-pick">
                <div className="click-div2" style={{float: 'left'}}>
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
                    渠道销量图表
                </div>
                {salesExtra}
            </div>
        );
        return (
            <div className="vip-course-sale" style={{margin: "0 30px"}}>
                <Card title={saleChart} bordered={false} bodyStyle={{padding: 24}}>
                    {
                        vipAuthor('marketing:vipcourse:channel:table', subjectId) && dataFlage.length !== 0 ?
                            <div>
                                <div className="right-table">
                                    <h4>渠道选择</h4>
                                    <div className="treebox">
                                        <div className="treebox-within">
                                            <Tree
                                                checkable
                                                onExpand={this.onExpand}
                                                expandedKeys={this.state.expandedKeys}
                                                autoExpandParent={this.state.autoExpandParent}
                                                onCheck={this.onCheck}
                                                checkedKeys={this.state.checkedKeys}
                                                onSelect={this.onSelect}
                                                selectedKeys={this.state.selectedKeys}
                                            >
                                                {this.renderTreeNodes(this.state.allSellerData)}
                                            </Tree>
                                            <Tree
                                                className="tree2"
                                                checkable
                                                autoExpandParent={this.state.autoExpandParent2}
                                                onCheck={this.onCheckChannel}
                                                checkedKeys={this.state.checkedKeysChannel}
                                                onSelect={this.onSelectChannel}
                                                selectedKeys={this.state.selectedKeysChannel}
                                            >
                                                {this.renderTreeNodes2(treeDataChannel)}
                                            </Tree>
                                        </div>
                                    </div>
                                </div>
                                <LineDiagram charts={charts} sellerNames={sellerNames}/>
                            </div> :
                            <div style={{textAlign: 'center', margin: '30px auto'}}>没有数据</div>
                    }
                </Card>
                <DetailData subjectId={subjectId} courseID={this.state.courseId}/>
            </div>
        );
    }


}
