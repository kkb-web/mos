import React, {PureComponent} from 'react';
import moment from 'moment';
import {Link} from 'react-router-dom';

import {Radar} from 'ant-design-pro/lib/Charts';
import EditableLinkGroup from '../editableLinkGroup/Index';

import './Workplace.less';

import PageHeader from 'ant-design-pro/lib/PageHeader';
import { Row, Col, Card, List, Avatar} from 'antd';
import {connect} from "../../utils/socket";
import {getToken} from "../../utils/filter";

const titles = [
    'Alipay',
    'Angular',
    'Ant Design',
    'Ant Design Pro',
    'Bootstrap',
    'React',
    'Vue',
    'Webpack',
];
const avatars = [
    'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png', // Alipay
    'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png', // Angular
    'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png', // Ant Design
    'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png', // Ant Design Pro
    'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png', // Bootstrap
    'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png', // React
    'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png', // Vue
    'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png', // Webpack
];
const avatars2 = [
    'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
    'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png',
    'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png',
    'https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png',
    'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png',
    'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
    'https://gw.alipayobjects.com/zos/rmsportal/psOgztMplJMGpVEqfcgF.png',
    'https://gw.alipayobjects.com/zos/rmsportal/ZpBqSxLxVEXfcUNoPKrz.png',
    'https://gw.alipayobjects.com/zos/rmsportal/laiEnJdGHVOhJrUShBaJ.png',
    'https://gw.alipayobjects.com/zos/rmsportal/UrQsqscbKEpNuJcvBZBu.png',
];
const links = [
    {
        title: '操作一',
        href: '',
    },
    {
        title: '操作二',
        href: '',
    },
    {
        title: '操作三',
        href: '',
    },
    {
        title: '操作四',
        href: '',
    },
    {
        title: '操作五',
        href: '',
    },
    {
        title: '操作六',
        href: '',
    },
];

const members = [
    {
        id: 'members-1',
        title: '科学搬砖组',
        logo: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
        link: '',
    },
    {
        id: 'members-2',
        title: '程序员日常',
        logo: 'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png',
        link: '',
    },
    {
        id: 'members-3',
        title: '设计天团',
        logo: 'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png',
        link: '',
    },
    {
        id: 'members-4',
        title: '中二少女团',
        logo: 'https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png',
        link: '',
    },
    {
        id: 'members-5',
        title: '骗你学计算机',
        logo: 'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png',
        link: '',
    },
];
const notices = [
    {
        id: 'xxx1',
        title: titles[0],
        logo: avatars[0],
        description: '那是一种内在的东西，他们到达不了，也无法触及的',
        updatedAt: new Date(),
        member: '科学搬砖组',
        href: '',
        memberLink: '',
    },
    {
        id: 'xxx2',
        title: titles[1],
        logo: avatars[1],
        description: '希望是一个好东西，也许是最好的，好东西是不会消亡的',
        updatedAt: new Date('2017-07-24'),
        member: '全组都是吴彦祖',
        href: '',
        memberLink: '',
    },
    {
        id: 'xxx3',
        title: titles[2],
        logo: avatars[2],
        description: '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
        updatedAt: new Date(),
        member: '中二少女团',
        href: '',
        memberLink: '',
    },
    {
        id: 'xxx4',
        title: titles[3],
        logo: avatars[3],
        description: '那时候我只会想自己想要什么，从不想自己拥有什么',
        updatedAt: new Date('2017-07-23'),
        member: '程序员日常',
        href: '',
        memberLink: '',
    },
    {
        id: 'xxx5',
        title: titles[4],
        logo: avatars[4],
        description: '凛冬将至',
        updatedAt: new Date('2017-07-23'),
        member: '高逼格设计天团',
        href: '',
        memberLink: '',
    },
    {
        id: 'xxx6',
        title: titles[5],
        logo: avatars[5],
        description: '生命就像一盒巧克力，结果往往出人意料',
        updatedAt: new Date('2017-07-23'),
        member: '骗你来学计算机',
        href: '',
        memberLink: '',
    },
];
const activities = [
    {
        id: 'trend-1',
        updatedAt: new Date(),
        user: {
            name: '曲丽丽',
            avatar: avatars2[0],
        },
        group: {
            name: '高逼格设计天团',
            link: 'http://github.com/',
        },
        project: {
            name: '六月迭代',
            link: 'http://github.com/',
        },
        template: '在 @{group} 新建项目 @{project}',
    },
    {
        id: 'trend-2',
        updatedAt: new Date(),
        user: {
            name: '付小小',
            avatar: avatars2[1],
        },
        group: {
            name: '高逼格设计天团',
            link: 'http://github.com/',
        },
        project: {
            name: '六月迭代',
            link: 'http://github.com/',
        },
        template: '在 @{group} 新建项目 @{project}',
    },
    {
        id: 'trend-3',
        updatedAt: new Date(),
        user: {
            name: '林东东',
            avatar: avatars2[2],
        },
        group: {
            name: '中二少女团',
            link: 'http://github.com/',
        },
        project: {
            name: '六月迭代',
            link: 'http://github.com/',
        },
        template: '在 @{group} 新建项目 @{project}',
    },
    {
        id: 'trend-4',
        updatedAt: new Date(),
        user: {
            name: '周星星',
            avatar: avatars2[4],
        },
        project: {
            name: '5 月日常迭代',
            link: 'http://github.com/',
        },
        template: '将 @{project} 更新至已发布状态',
    },
    {
        id: 'trend-5',
        updatedAt: new Date(),
        user: {
            name: '朱偏右',
            avatar: avatars2[3],
        },
        project: {
            name: '工程效能',
            link: 'http://github.com/',
        },
        comment: {
            name: '留言',
            link: 'http://github.com/',
        },
        template: '在 @{project} 发布了 @{comment}',
    },
    {
        id: 'trend-6',
        updatedAt: new Date(),
        user: {
            name: '乐哥',
            avatar: avatars2[5],
        },
        group: {
            name: '程序员日常',
            link: 'http://github.com/',
        },
        project: {
            name: '品牌迭代',
            link: 'http://github.com/',
        },
        template: '在 @{group} 新建项目 @{project}',
    },
];
export default class Workplace extends PureComponent {

    componentDidMount() {
        //链接websocket
        connect(getToken('username'));
        //end
    };
    renderActivities() {
        return activities && activities.map(item => {
            const events = item.template.split(/@\{([^{}]*)\}/gi).map(key => {
                if (item[key]) {
                    return (
                        <a href={item[key].link} key={item[key].name}>
                            {item[key].name}
                        </a>
                    );
                }
                return key;
            });
            return (
                <List.Item key={item.id}>
                    <List.Item.Meta
                        avatar={<Avatar src={item.user.avatar} />}
                        title={
                            <span>
                <a className="username">{item.user.name}</a>
                                &nbsp;
                                <span className="event">{events}</span>
              </span>
                        }
                        description={
                            <span className="datetime" title={item.updatedAt}>
                {moment(item.updatedAt).fromNow()}
              </span>
                        }
                    />
                </List.Item>
            );
        });
    }
    render() {
        const pageHeaderContent = (
            <div className="pageHeaderContent">
                <div className="avatar">
                    <Avatar
                        size="large"
                        src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
                    />
                </div>
                <div className="content">
                    <div className="contentTitle">早安，曲丽丽，祝你开心每一天！</div>
                    <div>交互专家 | 蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED</div>
                </div>
            </div>
        );
        const breadcrumbList = [{
            title: '首页',
            href: '/app/dashboard/analysis',
        }, {
            title: 'dashboard',
            href: '/app/dashboard/analysis',
        }, {
            title: '工作台',
        }];

        const radarOriginData = [
            {
                name: '个人',
                ref: 10,
                koubei: 8,
                output: 4,
                contribute: 5,
                hot: 7,
            },
            {
                name: '团队',
                ref: 3,
                koubei: 9,
                output: 6,
                contribute: 3,
                hot: 1,
            },
            {
                name: '部门',
                ref: 4,
                koubei: 1,
                output: 6,
                contribute: 5,
                hot: 7,
            },
        ];
        const radarData = [];
        const radarTitleMap = {
            ref: '引用',
            koubei: '口碑',
            output: '产量',
            contribute: '贡献',
            hot: '热度',
        };
        radarOriginData.forEach((item) => {
            Object.keys(item).forEach((key) => {
                if (key !== 'name') {
                    radarData.push({
                        name: item.name,
                        label: radarTitleMap[key],
                        value: item[key],
                    });
                }
            });
        });

        const extraContent = (
            <div className="extraContent">
                <div className="statItem">
                    <p>项目数</p>
                    <p>56</p>
                </div>
                <div className="statItem">
                    <p>团队内排名</p>
                    <p>
                        8
                        <span> / 24</span>
                    </p>
                </div>
                <div className="statItem">
                    <p>项目访问</p>
                    <p>2,223</p>
                </div>
            </div>
        );
        return (
            <div>
                <div style={{margin: "1px -20px 24px"}}>
                    <PageHeader content={pageHeaderContent} extraContent={extraContent}
                                breadcrumbList={breadcrumbList}/>
                </div>
                <div className="content">
                <Row gutter={24}>
                    <Col xl={16} lg={24} md={24} sm={24} xs={24}>
                        <Card
                            className="projectList"
                            style={{marginBottom: 24}}
                            title="进行中的项目"
                            bordered={false}
                            extra={<Link to="/">全部项目</Link>}
                            bodyStyle={{padding: 0}}
                        >
                            {notices && notices.map((item,i) => (
                                <Card.Grid className="projectGrid" key={i}>
                                    <Card bodyStyle={{padding: 0}} bordered={false}>
                                        <Card.Meta
                                            title={
                                                <div className="cardTitle">
                                                    <Avatar size="small" src={item.logo}/>
                                                    <Link to={item.href}>{item.title}</Link>
                                                </div>
                                            }
                                            description={item.description}
                                        />
                                        <div className="projectItemContent">
                                            <Link to={item.memberLink}>{item.member || ''}</Link>
                                            {item.updatedAt && (
                                                <span className="datetime" title={item.updatedAt}>
                          {moment(item.updatedAt).fromNow()}
                        </span>
                                            )}
                                        </div>
                                    </Card>
                                </Card.Grid>
                            ))}
                        </Card>
                        <Card
                            bodyStyle={{padding: 0}}
                            bordered={false}
                            className="activeCard"
                            title="动态"
                        >
                            <List size="large">
                                <div className="activitiesList">{this.renderActivities()}</div>
                            </List>
                        </Card>
                    </Col>
                    <Col xl={8} lg={24} md={24} sm={24} xs={24}>
                        <Card
                            style={{marginBottom: 24}}
                            title="快速开始 / 便捷导航"
                            bordered={false}
                            bodyStyle={{padding: 0}}
                        >
                            <div className="optional">
                                <EditableLinkGroup onAdd={() => {}} links={links} linkElement={Link} />
                            </div>
                        </Card>
                        <Card
                            style={{marginBottom: 24}}
                            bordered={false}
                            title="XX 指数"
                            loading={radarData.length === 0}
                        >
                            <div className="chart">
                                <Radar hasLegend height={343} data={radarData}/>
                            </div>
                        </Card>
                        <Card bodyStyle={{paddingTop: 12, paddingBottom: 12}} bordered={false} title="团队">
                            <div className="members">
                                <Row gutter={48}>
                                    {members && members.map(item => (
                                        <Col span={12} key={`members-item-${item.id}`}>
                                            <Link to={item.link}>
                                                <Avatar src={item.logo} size="small"/>
                                                <span className="member">{item.title}</span>
                                            </Link>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        </Card>
                    </Col>
                </Row>
                </div>
            </div>
        );
    }
}
