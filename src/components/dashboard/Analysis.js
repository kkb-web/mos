import 'antd/dist/antd.css';
import 'ant-design-pro/dist/ant-design-pro.css';
import {
    ChartCard,
    yuan,
    MiniArea,
    MiniBar,
    MiniProgress,
    Field,
    Bar,
    Pie,
    TimelineChart,
} from 'ant-design-pro/lib/Charts';
import Trend from 'ant-design-pro/lib/Trend';
import NumberInfo from 'ant-design-pro/lib/NumberInfo';
import {
    Row,
    Col,
    Icon,
    Card,
    Tabs,
    Table,
    Radio,
    Tooltip,
    Dropdown,
    Menu,
    DatePicker,
} from 'antd';
import numeral from 'numeral';
import moment from 'moment';
import React, {Component, Fragment} from 'react';
import styles from './Analysis.less';
import {getTimeDistance} from '../../utils/utils';
import {connect} from "../../utils/socket";
import {getToken} from "../../utils/filter";

const {TabPane} = Tabs;
const {RangePicker} = DatePicker;


export default class Analysis extends Component {
    state = {
        salesType: 'all',
        currentTabKey: '',
        rangePickerValue: getTimeDistance('year'),
    };
    componentDidMount (){
        //链接websocket
        connect(getToken('username'));
        //end
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
    selectDate = (type, index) => {
        this.setState({
            rangePickerValue: getTimeDistance(type),
        });
        console.log(this.state.rangePickerValue)
        let aTags = document.querySelectorAll('.click-div a')
        for (let i = 0; i < aTags.length; i++) {
            if (i === index) {
                aTags[i].classList.add('click-a')
            } else {
                aTags[i].classList.remove('click-a')
            }
        }
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
                x: new Date().getTime() + 1000 * 60 * 30 * i,
                y1: Math.floor(Math.random() * 100) + 10,
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
            <div className={styles.salesExtraWrap} >
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
        return (
            <Fragment>
                <Row gutter={24} style={{marginTop: '20px'}}>
                    <Col {...topColResponsiveProps}>
                        <ChartCard
                            title="销售额"
                            action={
                                <Tooltip title="指标说明">
                                    <Icon type="info-circle-o"/>
                                </Tooltip>
                            }
                            total={() => (
                                <span dangerouslySetInnerHTML={{__html: yuan(126560)}}/>
                            )}
                            footer={
                                <Field label="日均销售额" value={`￥${numeral(12423).format('0,0')}`}/>
                            }
                            contentHeight={46}
                        >
                            <span>周同比
                                <Trend flag="up" style={{marginLeft: 8, color: "rgba(0,0,0,.85)"}}>
                                12%
                                </Trend>
                            </span>
                            <span style={{marginLeft: 16}}>日环比
                                <Trend flag="down" style={{marginLeft: 8, color: "rgba(0,0,0,.85)"}}>11%</Trend>
                            </span>
                        </ChartCard>
                    </Col>
                    <Col {...topColResponsiveProps}>
                        <ChartCard
                            title="搜索用户数量"
                            total={numeral(8846).format('0,0')}
                            action={
                                <Tooltip title="指标说明">
                                    <Icon type="info-circle-o"/>
                                </Tooltip>
                            }
                            footer={<Field label="日访问量" value={numeral(1234).format('0,0')}/>}
                            contentHeight={46}
                        >
                            <MiniArea
                                line
                                data={visitData}
                            />
                        </ChartCard>

                    </Col>
                    <Col {...topColResponsiveProps}>
                        <ChartCard
                            title="访问量"
                            action={<Tooltip title="指标说明"><Icon type="info-circle-o"/></Tooltip>}
                            total={numeral(8846).format('0,0')}
                            footer={<Field label="日访问量" value={numeral(1234).format('0,0')}/>}
                            contentHeight={46}
                        >
                            <MiniBar
                                height={46}
                                data={visitData}
                            />
                        </ChartCard>

                    </Col>
                    <Col {...topColResponsiveProps}>
                        <ChartCard
                            title="线上购物转化率"
                            action={<Tooltip title="指标说明"><Icon type="info-circle-o"/></Tooltip>}
                            total="78%"
                            footer={
                                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                    <span>
                                        周同比
                                        <Trend flag="up" style={{marginLeft: 8, color: 'rgba(0,0,0,.85)'}}>12%</Trend>
                                    </span>
                                        <span style={{marginLeft: 16}}>
                                        日环比
                                        <Trend flag="down" style={{marginLeft: 8, color: 'rgba(0,0,0,.85)'}}>11%</Trend>
                                    </span>
                                </div>
                            }
                            contentHeight={46}
                        >
                            <MiniProgress percent={78} strokeWidth={8} target={80}/>
                        </ChartCard>
                    </Col>
                </Row>

                <Card bordered={false} bodyStyle={{padding: 24}}>
                    <div className={styles.salesCard}>
                        <Tabs tabBarExtraContent={salesExtra} size="large" tabBarStyle={{marginBottom: 24}}>
                            <TabPane tab="销售额" key="sales">
                                <Row>
                                    <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                                        <div className={styles.salesBar}>
                                            <Bar
                                                height={295}
                                                title="销售额趋势"
                                                data={salesData}
                                            />
                                        </div>
                                    </Col>
                                    <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                                        <div className={styles.salesRank} style={{marginTop: '10px', marginLeft: '30px' }}>
                                            <h4 className={styles.rankingTitle}>门店销售额排名</h4>
                                            <ul className="list-url" style={{listStyle: 'none'}}>
                                                {rankingListData && rankingListData.map((item, i) => (
                                                    <li key={item.title}>
                                                        <span className={i < 3 ? "first-tir" : ''}>{i + 1}</span>
                                                        <span>{item.title}</span>
                                                        <span>{numeral(item.total).format('0,0')}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tab="访问量" key="views">
                                <Row>
                                    <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                                        <div className={styles.salesBar}>
                                            <Bar
                                                height={292}
                                                title="访问量趋势"
                                                data={salesData}
                                            /></div>
                                    </Col>
                                    <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                                        <div className={styles.salesRank} style={{marginTop: '10px', marginLeft: '30px'}}>
                                            <h4 className={styles.rankingTitle}>门店访问量排名</h4>
                                            <ul className="list-url" style={{listStyle: 'none'}}>
                                                {rankingListData && rankingListData.map((item, i) => (
                                                    <li key={item.title}>
                                                        <span className={i < 3 ? "first-tir" : ''}>{i + 1}</span>
                                                        <span>{item.title}</span>
                                                        <span>{numeral(item.total).format('0,0')}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </Col>
                                </Row>
                            </TabPane>
                        </Tabs>
                    </div>
                </Card>

                <Row gutter={24}>
                    <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                        <Card
                            bordered={false}
                            title="线上热门搜索"
                            extra={iconGroup}
                            style={{marginTop: 24}}
                        >
                            <Row gutter={68}>
                                <Col sm={12} xs={24} style={{marginBottom: 24}}>
                                    <NumberInfo
                                        subTitle={
                                            <span>
                        搜索用户数
                        <Tooltip title="指标文案">
                          <Icon style={{marginLeft: 8}} type="info-circle-o"/>
                        </Tooltip>
                      </span>
                                        }
                                        gap={8}
                                        total={numeral(12321).format('0,0')}
                                        status="up"
                                        subTotal={17.1}
                                    />
                                    <MiniArea line height={45} data={visitData}/>
                                </Col>
                                <Col sm={12} xs={24} style={{marginBottom: 24}}>
                                    <NumberInfo
                                        subTitle="人均搜索次数"
                                        total={2.7}
                                        status="down"
                                        subTotal={26.2}
                                        gap={8}
                                    />
                                    <MiniArea
                                        line
                                        height={45}
                                        data={visitData}
                                    />
                                </Col>
                            </Row>
                            <Table
                                rowKey={record => record.index}
                                size="small"
                                columns={columns}
                                dataSource={searchData}
                                pagination={{
                                    style: {marginBottom: 0},
                                    pageSize: 5,
                                }}
                            />
                        </Card>
                    </Col>
                    <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                        <Card
                            className={styles.salesCard}
                            bordered={false}
                            title="销售额类别占比"
                            bodyStyle={{padding: 24, paddingBottom: 82}}
                            extra={
                                <div className={styles.salesCardExtra}>
                                    {iconGroup}
                                    <div className={styles.salesTypeRadio}>
                                        <Radio.Group value={salesType} onChange={this.handleChangeSalesType}>
                                            <Radio.Button value="all">全部渠道</Radio.Button>
                                            <Radio.Button value="online">线上</Radio.Button>
                                            <Radio.Button value="offline">门店</Radio.Button>
                                        </Radio.Group>
                                    </div>
                                </div>
                            }
                            style={{marginTop: 24, minHeight: 509}}
                        >
                            <h4 style={{marginTop: 8, marginBottom: 32}}>销售额</h4>
                            <Row>
                                <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                    <Pie
                                        // style={{display: 'none'}}
                                        title="销售额"
                                        subTitle="销售额"
                                        total={() => (
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: yuan(salesPieData.reduce((pre, now) => now.y + pre, 0))
                                                }}
                                            />
                                        )}
                                        data={salesPieData}
                                        valueFormat={val => <span dangerouslySetInnerHTML={{__html: yuan(val)}}/>}
                                        height={268}
                                    />
                                </Col>
                                <Col xl={12} lg={12} md={12} sm={12} xs={12} className="an-pie">
                                    <Pie
                                        hasLegend
                                        title="销售额"
                                        subTitle="销售额"
                                        padding="0px"
                                        total={() => (
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: yuan(salesPieData.reduce((pre, now) => now.y + pre, 0))
                                                }}
                                            />
                                        )}
                                        data={salesPieData}
                                        valueFormat={val => <span dangerouslySetInnerHTML={{__html: yuan(val)}}/>}
                                        height={297}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
                <Card
                    className={styles.offlineCard}
                    bordered={false}
                    bodyStyle={{padding: '0 0 32px 0'}}
                    style={{marginTop: 32}}
                >
                    <Tabs activeKey={activeKey} onChange={this.handleTabChange}>
                        {offlineData && offlineData.map(shop => (
                            <TabPane tab={<CustomTab data={shop} currentTabKey={activeKey}/>} key={shop.name}>
                                <div style={{padding: '0 24px'}}>
                                    <TimelineChart
                                        height={400}
                                        data={chartData}
                                        titleMap={{y1: '客流量', y2: '支付笔数'}}
                                    />
                                </div>
                            </TabPane>
                        ))}
                    </Tabs>
                </Card>
            </Fragment>
        );
    }


}
