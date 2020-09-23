import React, {Component} from 'react';
import {Table, Form, Icon} from 'antd';
import {formatDateTime} from '../../utils/filter';
import Friends from '../common/Friends';
import './Index.less';
import {urlSellerList} from '../../api/userApi';


let applyData = {
    descs: [], // 倒序
    ascs: [],  // 升序
};

class Local extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            dataSource: [],  //
            modify: '',     // 上次好友变更数
            friendsId:'',    //
            deviceid: '',    // 设备ID
            subjectNo:'',    // 学科-编号
            wechat: '',      // 营销号
            id: '',          // 营销号ID
            salesName: '',   // 所属销售
            friendsChangeType: '',   // 改变量趋势（0正常、1下降、2上升）
            title: '',
        };
    }

    // 获取营销号信息
    getSellerInfo = () => {
        urlSellerList().then(response => {
            this.setState({
                dataSource: response.data.data
            });
        }).catch(err => {
            console.log(err, "urlSellerList")
        })
    }

    // 渲染
    componentDidMount() {
        this.getSellerInfo();
    }

    // 排序
    changeSore = (dataIndex, record, sorter) => {
        applyData.ascs = (sorter.order === "ascend" ? true : false);
        this.getSellerInfo();
    };

    // 点击好友列
    friendClick = (key, record) => {
        this.setState({
            visible: true,
            // 好友数量对话框标题：设备ID-学科-编号-微信号-销售
            title: record.deviceid + '-' + record.subjectNo	 + '-' + record.wechat + '-' + record.salesName,
            id: key,
    });
    }

    // 隐藏"好友数量"弹窗
    handleCancel = () => {
        this.setState({
            visible: false,
        });
        this.getSellerInfo();
    }

    render() {
        const {changeSore, loading} = this.props;
        const {dataSource} = this.state;
        // 营销号列表
        const columns = [{
            title: '学科-编号',
            dataIndex: 'subjectNo',
            width: 80,
        }, {
            title: '二维码',
            dataIndex: 'qrCode',
            width: 120,
            render: (dataIndex) => <span><img style={{width: '100px', height: '100px'}} src={`https://img.kaikeba.com/${dataIndex}`} alt=""/></span>
            // render: (dataIndex) => <span><img style={{width: '100px', height: '100px'}} src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png" alt=""/></span>
        },{
            title: '营销号',
            dataIndex: 'wechat',
            width: 120,
            render: (dataIndex) => dataIndex === null ? <span>/</span> : <span>{dataIndex}</span>
        }, {
            title: '好友',
            dataIndex: 'friends',
            sorter: (a, b) => a.friends - b.friends,
            width: 60,
            render: (dataIndex, record) => <div className="opera" onClick={() => this.friendClick(record.id, record)}>
                <span style={{color: 'rgb(48, 135, 255)'}} >{dataIndex}</span>
                <span style={{color: '#FF0000', fontSize: '12px', verticalAlign: 'top', display: record.friendsChangeType === 2 ? 'inline' : 'none'}}>
                    <Icon style={{paddingLeft: '5px', fontSize: '10px', fontWeight: '100', verticalAlign: 'top'}} type="arrow-up" theme="outlined"/>
                    {record.modify}
                </span>
                <span style={{color: '#669900', fontSize: '12px', verticalAlign: 'top', display: record.friendsChangeType === 1 ? 'inline' : 'none'}}>
                    <Icon style={{paddingLeft: '5px', fontSize: '10px', fontWeight: '100', verticalAlign: 'top'}} type="arrow-down" theme="outlined"/>
                    {record.modify}
                </span>
                <span style={{color: '#000', fontSize: '12px', verticalAlign: 'top', display: record.friendsChangeType === 0 ? 'inline' : 'none'}}>
                    --
                </span>
            </div>
        }, {
            title: '设备IMEI',
            dataIndex: 'imei',
            width: 200,
        }, {
            title: '手机型号',
            dataIndex: 'mobileType',
            width: 60,
        }, {
            title: '分配时间',
            dataIndex: 'allocTime',
            sorter: (a, b) => a.allocTime - b.allocTime,
            width: 150,
            render: (dataIndex) => {
                return formatDateTime(dataIndex)
            }
        }];
        // "好友数量"弹窗title
        const contentTitle =
            <span>
                好友数量
                <span style={{fontSize: '14px', color: '#888', fontWeight: '100', paddingLeft: '20px'}}>
                    {this.state.title}
                </span>
            </span>;
        return (
            <div style={{marginLeft: 38, marginRight: 38,}}>
                <Table
                    key={record => record.id}
                    rowKey={record => record.id}
                    columns={columns}
                    dataSource={dataSource}
                    bordered={false}
                    scroll={{x: '100%'}}
                    className='formTable'
                    loading={loading}
                    pagination={false}
                    onChange={changeSore}
                    locale={{emptyText: '系统还未给你分配营销号哦。如有问题，请联系管理员设置 ：）'}}
                />
                <Friends visible={this.state.visible} title={contentTitle} onCancel={this.handleCancel} sellerId={this.state.id} />
            </div>
        )
    }
}

const MySeller = Form.create()(Local);
export default MySeller;
