import 'antd/dist/antd.css';
import 'ant-design-pro/dist/ant-design-pro.css';
import {
    MiniArea,
    Pie,
    Gauge,
    WaterWave,
    TagCloud,
} from 'ant-design-pro/lib/Charts';
import Trend from 'ant-design-pro/lib/Trend';
import CountDown from 'ant-design-pro/lib/CountDown';
import NumberInfo from 'ant-design-pro/lib/NumberInfo';
import {
    Row,
    Col,
    Icon,
    Card,
    Tabs,
    Tooltip,
    Dropdown,
    Menu,
    DatePicker,
} from 'antd';
import numeral from 'numeral';
import moment from 'moment';
import React, {Component, Fragment} from 'react';
import styles from './Monitor.less';
import {getTimeDistance} from '../../utils/utils';
import {connect} from "../../utils/socket";
import {getToken} from "../../utils/filter";
import history from "./../common/History";



const {TabPane} = Tabs;
const {RangePicker} = DatePicker;


function fixedZero(val) {
    return val * 1 < 10 ? `0${val}` : val;
}

function getActiveData() {
    const activeData = [];
    for (let i = 0; i < 24; i += 1) {
        activeData.push({
            x: `${fixedZero(i)}:00`,
            y: Math.floor(Math.random() * 200) + i * 50,
        });
    }
    return activeData;
}


const tags = [];
for (let i = 0; i < 50; i += 1) {
    tags.push({
        name: `TagClout-Title-${i}`,
        value: Math.floor((Math.random() * 50)) + 20,
    });
}

export default class Monitor extends Component {
    state = {
        activeData: getActiveData(),
    };

    componentDidMount() {
        this.timer = setInterval(() => {
            this.setState({
                activeData: getActiveData(),
            });
        }, 1000);

        //链接websocket
        connect(getToken('username'));
        //end
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }



    state = {
        salesType: 'all',
        currentTabKey: '',
        rangePickerValue: getTimeDistance('year'),
    };
    handleChangeSalesType = e => {
        this.setState({
            salesType: e.target.value,
        });
    };
    handleTabChange = key => {
        this.setState({
            currentTabKey: key,
        });
    };
    handleRangePickerChange = rangePickerValue => {
        this.setState({
            rangePickerValue,
        });
    };
    selectDate = type => {
        this.setState({
            rangePickerValue: getTimeDistance(type),
        });
    };

    isActive(type) {
        const {rangePickerValue} = this.state;
        const value = getTimeDistance(type);
        if (!rangePickerValue[0] || !rangePickerValue[1]) {
            return;
        }
        if (
            rangePickerValue[0].isSame(value[0], 'day') &&
            rangePickerValue[1].isSame(value[1], 'day')
        ) {
            return styles.currentDate;
        }
    }
    lintodingtalk = ()=>{
        history.push('/dingtalk')
    };

    render() {
        const {rangePickerValue, salesType, currentTabKey} = this.state;
        const visitData = [];
        const beginDay = new Date().getTime();
        for (let i = 0; i < 20; i += 1) {
            visitData.push({
                x: moment(new Date(beginDay + (1000 * 60 * 60 * 24 * i))).format('YYYY-MM-DD'),
                y: Math.floor(Math.random() * 100) + 10,
            });
        }
        const salesData = [];
        for (let i = 0; i < 12; i += 1) {
            salesData.push({
                x: `${i + 1}月`,
                y: Math.floor(Math.random() * 1000) + 200,
            });
        }
        const rankingListData = [];
        for (let i = 0; i < 7; i += 1) {
            rankingListData.push({
                title: `工专路 ${i} 号店`,
                total: 323234,
            });
        }
        const chartData = [];
        for (let i = 0; i < 20; i += 1) {
            chartData.push({
                x: (new Date().getTime()) + (1000 * 60 * 30 * i),
                y1: Math.floor(Math.random() * 100) + 1000,
                y2: Math.floor(Math.random() * 100) + 10,
            });
        }
        const offlineData = [];
        for (let i = 0; i < 10; i += 1) {
            offlineData.push({
                name: `门店${i}`,
                cvr: Math.ceil(Math.random() * 9) / 10,
            });
        }
        const searchData = [];
        for (let i = 0; i < 50; i += 1) {
            searchData.push({
                index: i + 1,
                keyword: `搜索关键词-${i}`,
                count: Math.floor(Math.random() * 1000),
                range: Math.floor(Math.random() * 100),
                status: Math.floor((Math.random() * 10) % 2),
            });
        }
        const activeKey = currentTabKey || (offlineData[0] && offlineData[0].name);
        const CustomTab = ({data, currentTabKey: currentKey}) => (
            <Row gutter={8} style={{width: 138, margin: '8px 0'}}>
                <Col span={12}>
                    <NumberInfo
                        title={data.name}
                        subTitle="转化率"
                        gap={2}
                        total={`${data.cvr * 100}%`}
                        theme={currentKey !== data.name && 'light'}
                    />
                </Col>
                <Col span={12} style={{paddingTop: 36}}>
                    <Pie
                        animate={false}
                        color={currentKey !== data.name && '#BDE4FF'}
                        inner={0.55}
                        tooltip={false}
                        margin={[0, 0, 0, 0]}
                        percent={data.cvr * 100}
                        height={64}
                    />
                </Col>
            </Row>
        );
        const menu = (
            <Menu>
                <Menu.Item>操作一</Menu.Item>
                <Menu.Item>操作二</Menu.Item>
            </Menu>
        );
        const salesExtra = (
            <div className={styles.salesExtraWrap}>
                <div className={styles.salesExtra}>
                    <a className={this.isActive('today')} onClick={() => this.selectDate('today')}>
                        今日
                    </a>
                    <a className={this.isActive('week')} onClick={() => this.selectDate('week')}>
                        本周
                    </a>
                    <a className={this.isActive('month')} onClick={() => this.selectDate('month')}>
                        本月
                    </a>
                    <a className={this.isActive('year')} onClick={() => this.selectDate('year')}>
                        全年
                    </a>
                </div>
                <RangePicker
                    value={rangePickerValue}
                    onChange={this.handleRangePickerChange}
                    style={{width: 256}}
                />
            </div>
        );
        const columns = [
            {
                title: '排名',
                dataIndex: 'index',
                key: 'index',
            },
            {
                title: '搜索关键词',
                dataIndex: 'keyword',
                key: 'keyword',
                render: text => <a href="/">{text}</a>,
            },
            {
                title: '用户数',
                dataIndex: 'count',
                key: 'count',
                sorter: (a, b) => a.count - b.count,
                className: styles.alignRight,
            },
            {
                title: '周涨幅',
                dataIndex: 'range',
                key: 'range',
                sorter: (a, b) => a.range - b.range,
                render: (text, record) => (
                    <Trend flag={record.status === 1 ? 'down' : 'up'}>
            <span style={{marginRight: 4}}>
              {text}
                %
            </span>
                    </Trend>
                ),
                align: 'right',
            },
        ];
        const salesPieData = [
            {
                x: '家用电器',
                y: 4544,
            },
            {
                x: '食用酒水',
                y: 3321,
            },
            {
                x: '个护健康',
                y: 3113,
            },
            {
                x: '服饰箱包',
                y: 2341,
            },
            {
                x: '母婴产品',
                y: 1231,
            },
            {
                x: '其他',
                y: 1231,
            },
        ];
        const iconGroup = (
            <span className={styles.iconGroup}>
        <Dropdown overlay={menu} placement="bottomRight">
          <Icon type="ellipsis"/>
        </Dropdown>
      </span>
        );

        const topColResponsiveProps = {
            xs: 24,
            sm: 12,
            md: 12,
            lg: 12,
            xl: 6,
            style: {marginBottom: 24},
        };

        const targetTime = new Date().getTime() + 3900000;
        const { activeData = [] } = this.state;
        // const { tags } = monitor;

        return (
            <Fragment>
                <Row gutter={24} style={{marginTop: '24px'}}>
                    <Col xl={18} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
                        <Card title="活动实时交易情况" bordered={false}>
                            <Row>
                                <Col md={6} sm={12} xs={24}>
                                    <NumberInfo
                                        subTitle="今日交易总额"
                                        suffix="元"
                                        total={numeral(124543233).format('0,0')}
                                    />
                                </Col>
                                <Col md={6} sm={12} xs={24}>
                                    <NumberInfo subTitle="销售目标完成率" total="92%" />
                                </Col>
                                <Col md={6} sm={12} xs={24}>
                                    <NumberInfo subTitle="活动剩余时间" total={<CountDown target={targetTime} />} />
                                </Col>
                                <Col md={6} sm={12} xs={24}>
                                    <NumberInfo
                                        subTitle="每秒交易总额"
                                        suffix="元"
                                        total={numeral(234).format('0,0')}
                                    />
                                </Col>
                            </Row>
                            <div style={{height:453 , textAlign:'center'}} className={styles.mapChart}>
                                <Tooltip title="等待后期实现">
                                    <img style={{maxWidth:'100%', maxHeight:437}}
                                        src="https://gw.alipayobjects.com/zos/rmsportal/HBWnDEUXCnGnGrRfrpKa.png"
                                        alt="map"
                                    />
                                </Tooltip>
                            </div>
                        </Card>
                    </Col>
                    <Col xl={6} lg={24} md={24} sm={24} xs={24}>
                        <Card title="活动情况预测" style={{ marginBottom: 24 }} bordered={false}>
                            {/*<ActiveChart />*/}
                            <div className={styles.activeChart}>
                                <NumberInfo subTitle="目标评估" total="有望达到预期" />
                                <div style={{ marginTop: 32 }}>
                                    <MiniArea
                                        animate={false}
                                        line
                                        borderWidth={2}
                                        height={84}
                                        scale={{
                                            y: {
                                                tickCount: 3,
                                            },
                                        }}
                                        yAxis={{
                                            tickLine: false,
                                            label: false,
                                            title: false,
                                            line: false,
                                        }}
                                        data={activeData}
                                    />
                                </div>
                                {activeData && (
                                    <div className={styles.activeChartGrid}>
                                        {/*<p>{[...activeData].sort()[activeData.length - 1].y + 200} 亿元</p>*/}
                                        {/*<p>{[...activeData].sort()[Math.floor(activeData.length / 2)].y} 亿元</p>*/}
                                    </div>
                                )}
                                {activeData && (
                                    <div className={styles.activeChartLegend}>
                                        <span>00:00</span>
                                        {/*<span>{activeData[Math.floor(activeData.length / 2)].x}</span>*/}
                                        {/*<span>{activeData[activeData.length - 1].x}</span>*/}
                                    </div>
                                )}
                            </div>
                        </Card>
                        <Card
                            title="券核效率"
                            style={{ marginBottom: 24 }}
                            bodyStyle={{ textAlign: 'center' }}
                            bordered={false}
                        >
                            <Gauge title="跳出率" height={180} percent={87} />
                        </Card>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col xl={12} lg={24} sm={24} xs={24}>
                        <Card title="各品类占比" bordered={false} className={styles.pieCard}>
                            <Row style={{ padding: '16px 0' }}>
                                <Col span={8}>
                                    <Pie
                                        animate={false}
                                        percent={28}
                                        subTitle="中式快餐"
                                        total="28%"
                                        height={128}
                                        lineWidth={2}
                                    />
                                </Col>
                                <Col span={8}>
                                    <Pie
                                        animate={false}
                                        color="#5DDECF"
                                        percent={22}
                                        subTitle="西餐"
                                        total="22%"
                                        height={128}
                                        lineWidth={2}
                                    />
                                </Col>
                                <Col span={8}>
                                    <Pie
                                        animate={false}
                                        color="#2FC25B"
                                        percent={32}
                                        subTitle="火锅"
                                        total="32%"
                                        height={128}
                                        lineWidth={2}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col xl={6} lg={12} sm={24} xs={24}>
                        <Card
                            title="热门搜索"
                            // loading={loading}
                            bordered={false}
                            bodyStyle={{ overflow: 'hidden' }}
                        >
                            <TagCloud
                                data={tags}
                                height={165}
                            />
                        </Card>
                    </Col>
                    <Col xl={6} lg={12} sm={24} xs={24}>
                        <Card
                            title="资源剩余"
                            bodyStyle={{ textAlign: 'center', fontSize: 0 }}
                            bordered={false}
                        >
                            <WaterWave height={165} title="补贴资金剩余" percent={34} />
                        </Card>
                    </Col>
                </Row>
            </Fragment>
        );
    }
}
