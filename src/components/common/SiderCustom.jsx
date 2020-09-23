import React, {Component} from 'react';
import {Layout, Menu, Icon} from 'antd';
import {Link} from 'react-router-dom';
import {getToken, setToken} from "../../utils/filter";
import {getMenuList} from "../../api/menuApi";
import {getUserAuthorList} from "../../api/commonApi";

const {Sider} = Layout;
const SubMenu = Menu.SubMenu;

// const menus = [
//     {
//         name: 'dashboard',
//         path: '/app/dashboard',
//         icon: 'dashboard',
//         childMenu: [
//             {
//                 name: '分析页',
//                 path: '/app/dashboard/analysis',
//             },
//             {
//                 name: '监控页',
//                 path: '/app/dashboard/monitor'
//             },
//             {
//                 name: '工作台',
//                 path: '/app/dashboard/workplace'
//             }
//         ]
//     },
//     {
//         name: '营销中心',
//         path: '/app/qrcode',
//         icon: 'appstore-o',
//         childMenu: [
//             {
//                 name: '二维码中转页',
//                 path: '/app/qrcode/list',
//             },
//             {
//                 name: '素材管理',
//                 path: '/app/qrcode/resources'
//             },
//             {
//                 name: '媒体管理',
//                 path: '/app/qrcode/media',
//             },
//             {
//                 name: '投放列表',
//                 path: '/app/qrcode/launch'
//             }
//         ]
//     },
//     {
//         name: '公开课',
//         path: '/app/course',
//         icon: 'video-camera',
//         childMenu: [
//             {
//                 name: '公开课列表',
//                 path: '/app/course/list',
//             }
//         ]
//     },
//     // {
//     //     name: 'VIP课',
//     //     path: '/app/vipcourse',
//     //     icon: 'play-circle-o',
//     //     childMenu: [
//     //         {
//     //             name: 'VIP课列表',
//     //             path: '/app/vipcourse/list',
//     //         }
//     //     ]
//     // },
//     {
//         name: '个人中心',
//         path: '/app/account',
//         icon: 'user',
//         childMenu: [
//             {
//                 name: '基本信息',
//                 path: '/app/account/info',
//             },
//             {
//                 name: '我的营销号',
//                 path: '/app/account/seller',
//             },
//             {
//                 name: '修改密码',
//                 path: '/app/account/password',
//             }
//         ]
//     },
//     {
//         name: '系统管理',
//         path: '/app/authority',
//         icon: 'setting',
//         childMenu: [
//             {
//                 name: '帐号管理',
//                 path: '/app/authority/accounts',
//             },
//             {
//                 name: '设备管理',
//                 path: '/app/authority/device',
//             },
//             {
//                 name: '学科管理',
//                 path: '/app/authority/subject'
//             },
//             {
//                 name: '角色管理',
//                 path: '/app/authority/roles'
//             },
//             {
//                 name: '营销号管理',
//                 path: '/app/authority/market'
//             }
//         ]
//     }
// ];

export default class SiderCustom extends Component {
    constructor(props) {
        super(props);
        const {collapsed} = props;
        this.state = {
            menus: [],
            collapsed: collapsed,
            firstHide: true, //第一次先隐藏暴露的子菜单
            selectedKey: '', //选择的路径
            openKey: '', //打开的路径（选择的上一层）
        }
    }

    // 获取菜单列表
    getMenu = () => {
      getMenuList().then(res => {
          if (res.data.code === 0) {
              this.setState({
                  menus: res.data.data
              });
          }
      })
    };

    getUser = () => {
        getUserAuthorList().then(res => {
            setToken('userAuthorList', JSON.stringify(res.data.data));
        })
    };

    componentDidMount() {
        this.setState({
            selectedKey: this.props.path
        });
        if (getToken('menu')) {
            this.setState({
                menus: JSON.parse(getToken('menu'))
            })
        } else {
            this.getMenu();
        }
        if (!getToken('userAuthorList') || getToken('userAuthorList') === '' || getToken('userAuthorList') === undefined || getToken('userAuthorList') === null) {
            this.getUser()
        }
    }


    componentWillReceiveProps(nextProps) {
        this.onCollapse(nextProps.collapsed);
        this.setMenuOpen(nextProps);
    }

    // 查找第n个字符的位置
    findStr = (str, charStr, num) => {
        let position = str.indexOf(charStr);
        for(let i = 0; i < num; i++){
            position = str.indexOf(charStr, position + 1);
        }
        return position;
    };

    setMenuOpen = (props) => {
        const {path} = props;
        this.setState({
            openKey: path.slice(0, this.findStr(path,'/', 2)),
            selectedKey: path
        });
        // console.log(path.slice(0, this.findStr(path,'/', 2)), this.findStr(path,'/', 2), path.substr(0, path.lastIndexOf('/')), path, this.state.selectedKey, "==============展开菜单");
    };
    onCollapse = (collapsed) => {
        this.setState({
            collapsed,
            firstHide: collapsed,
        });
    };

    menuClick = (e) => {
        this.setState({
            selectedKey: e.key
        });
    };
    openMenu = (v) => {
        this.setState({
            openKey: v[v.length - 1],
            firstHide: false,
        })
    };

    render() {
        const {collapsed, firstHide, openKey, selectedKey} = this.state;
        return (
            <Sider
                trigger={null}
                collapsed={collapsed}
            >
                <div style={{backgroundColor: 'rgba(0, 40, 77, 1)', marginBottom: '15px', overflow: 'hidden', padding: '8px 0 7px'}}>
                    <div className="logo" style={collapsed ? {
                        background: 'url("https://img.kaikeba.com/logo_small1.png") no-repeat center center',
                        backgroundSize: '45%',
                        backgroundPosition: '24px 8px'
                    } : {
                        background: 'url("https://img.kaikeba.com/0919b3c8-c404-49e2-ba85-d317f526a9ed.png") no-repeat center center',
                        backgroundSize: '64%', marginLeft: '-10px'}}
                    />
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    onClick={this.menuClick}
                    onOpenChange={this.openMenu}
                    openKeys={firstHide ? null : [openKey]}
                >

                    {
                        this.state.menus && this.state.menus.map((value, index) => {
                            return (
                                <SubMenu
                                    key={value.url}
                                    title={<span><Icon type={value.icon} className="icon-menu"/><span>{value.name}</span></span>}
                                >
                                    {
                                        value.childMenu ? value.childMenu.map((val, i) => {
                                            return (
                                                <Menu.Item key={val.url}>
                                                    <Link to={val.url}><span>{val.name}</span></Link>
                                                </Menu.Item>
                                            )
                                        }) : null
                                    }
                                </SubMenu>
                            )
                        })
                    }
                    {/*<SubMenu*/}
                        {/*key="/app/dashboard"*/}
                        {/*title={<span><Icon type="dashboard" /><span>dashboard</span></span>}*/}
                    {/*>*/}
                        {/*<Menu.Item key="/app/dashboard/analysis">*/}
                            {/*<Link to={'/app/dashboard/analysis'}><span>分析页</span></Link>*/}
                        {/*</Menu.Item>*/}
                        {/*<Menu.Item key="/app/dashboard/monitor">*/}
                            {/*<Link to={'/app/dashboard/monitor'}><span>监控页</span></Link>*/}
                        {/*</Menu.Item>*/}
                        {/*<Menu.Item key="/app/dashboard/workplace">*/}
                            {/*<Link to={'/app/dashboard/workplace'}><span>工作台</span></Link>*/}
                        {/*</Menu.Item>*/}
                    {/*</SubMenu>*/}
                    {/*<SubMenu*/}
                        {/*key="/app/qrcode"*/}
                        {/*title={<span><Icon type="setting"/><span>营销中心</span></span>}*/}
                    {/*>*/}
                        {/*<Menu.Item key="/app/qrcode/list">*/}
                            {/*<Link to={'/app/qrcode/list'}><span>二维码中转页</span></Link>*/}
                        {/*</Menu.Item>*/}
                    {/*</SubMenu>*/}
                    {/*<SubMenu*/}
                        {/*key="/app/course"*/}
                        {/*title={<span><Icon type="appstore-o"/><span>公开课</span></span>}*/}
                    {/*>*/}
                        {/*<Menu.Item key="/app/course/list">*/}
                            {/*<Link to={'/app/course/list'}><span>公开课列表</span></Link>*/}
                        {/*</Menu.Item>*/}
                    {/*</SubMenu>*/}
                    {/*<SubMenu*/}
                    {/*key="/app/header"*/}
                    {/*title={<span><Icon type="area-chart" /><span>图表</span></span>}*/}
                    {/*>*/}
                    {/*<Menu.Item key="/app/header/Calendars">*/}
                    {/*<Link to={'/app/header/Calendars'}><span>日历</span></Link>*/}
                    {/*</Menu.Item>*/}
                    {/*</SubMenu>*/}
                    {/*<Menu.Item key="/app/richText">*/}
                    {/*<Link to={'/app/richText'}><Icon type="edit" /><span>富文本</span></Link>*/}
                    {/*</Menu.Item>*/}
                </Menu>
            </Sider>
        )
    }
}
