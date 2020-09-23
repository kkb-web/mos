import React, {Component} from 'react';
import {Table, Tooltip, Icon} from 'antd';
import {formatDateTime, returnFloat} from '../../../utils/filter'
import history from "../../common/History";

export default class FormTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    //跳转到新建投放
    toLaunchAdd = (id, name) => {
        let data = {id: id, name: name};
        history.push({pathname: '/app/qrcode/launch/add', state: data})
    };
    //跳转到投放列表
    toLaunch = (id, name) => {
        let data = {id: id, name: name};
        history.push({pathname: '/app/qrcode/launch', state: data})
    };

    //跳转到成单列表
    toOrder = (id, name) => {
        let data = {id: id, name: name};
        history.push({pathname: '/app/qrcode/order', state: data})
    };

    render() {
        const {editClick, changeSore, dataSource, loading} = this.props;
        // const rowSelection = {
        //     onChange: checkChange,
        //     getCheckboxProps: record => ({
        //         disabled: record.name === 'Disabled User', // Column configuration not to be checked
        //     }),
        // };
        const locale = {
            emptyText: '没有数据'
        };
        const columns = [{
            title: '媒体名称',
            dataIndex: 'name',
            width: 100,
            className: 'media-name-td',
            render: (dataIndex, record) => dataIndex.length > 9 ?
                <Tooltip key='2' placement="top" title={dataIndex}><p className="media-name"
                                                                      onClick={() => editClick(record.id)} style={{
                    color: 'rgb(24, 144, 255)',
                    cursor: 'pointer',
                    boxOrient: 'vertical'
                }}>{dataIndex}</p>
                </Tooltip> : <span onClick={() => editClick(record.id)} style={{
                    color: 'rgb(24, 144, 255)',
                    cursor: 'pointer',
                    boxOrient: 'vertical'
                }}>{dataIndex}</span>
        }, {
            title: '联系人姓名/昵称',
            dataIndex: 'contactName',
            width: 150,
            render: (dataIndex) => dataIndex === null ? <span>/</span> :
                <Tooltip key='3' placement="top" title={dataIndex}><span
                    className="media-nickName">{dataIndex}</span></Tooltip>
        }, {
            title: '联系人微信',
            dataIndex: 'contactWechat',
            width: 110,
            render: (dataIndex) => dataIndex === null ? <span>/</span> :
                <Tooltip key='4' placement="top" title={dataIndex}> <span
                    className="media-wechatState">{dataIndex}</span></Tooltip>
        }, {
            title: '投放次数',
            dataIndex: 'putNum',
            sorter: (a, b) => a.putNum - b.putNum,
            key: 'Count',
            width: 130,
            render: (dataIndex, record) => dataIndex === null || dataIndex === 0 ? <span>/</span> :
                <span onClick={this.toLaunch.bind(this, record.id, record.name)}
                      style={{color: 'rgb(24, 144, 255)', cursor: 'pointer'}}>{dataIndex}</span>
        }, {
            title: 'UV',
            dataIndex: 'uv',
            sorter: (a, b) => a.uv - b.uv,
            width: 60,
            render: (dataIndex) => dataIndex === null ? <span>/</span> : <span>{dataIndex}</span>
        }, {
            title: 'PV',
            dataIndex: 'pv',
            sorter: (a, b) => a.pv - b.pv,
            width: 60,
            render: (dataIndex) => dataIndex === null ? <span>/</span> : <span>{dataIndex}</span>
        }, {
            title: '总投入',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
            width: 100,
            render: (dataIndex) => dataIndex === null ? <span>/</span> : <span>{returnFloat(dataIndex)}</span>
        }, {
            title: [
                <Tooltip key='2' placement="top" title="新增好友数量">
                    <span>人数</span>
                    <Icon type="info-circle" style={{fontSize: '12px', color: '#afadad'}}/>
                </Tooltip>
            ],
            dataIndex: 'number',
            sorter: (a, b) => a.number - b.number,
            width: 80,
            render: (dataIndex) => dataIndex === null ? <span>/</span> : <span>{dataIndex}</span>
        }, {
            title: [
                <Tooltip key='1' placement="top" title="单价=总投入/人数">
                    <span>单价<Icon type="info-circle" style={{fontSize: '12px', color: '#afadad'}}/></span>
                </Tooltip>
            ],
            dataIndex: 'unitPrice',
            sorter: (a, b) => a.unitPrice - b.unitPrice,
            width: 80,
            render: (dataIndex) => dataIndex === null ? <span>/</span> : <span>{returnFloat(dataIndex)}</span>
        }, {
            title: '成单量',
            dataIndex: 'orderQuantity',
            sorter: (a, b) => a.orderQuantity - b.orderQuantity,
            width: 80,
            render: (dataIndex, record) => dataIndex === null ? <span>/</span> :
                <span onClick={this.toOrder.bind(this, record.id, record.name)}
                      style={{color: 'rgb(24, 144, 255)', cursor: 'pointer'}}>{dataIndex}</span>
        }, {
            title: '总收入',
            dataIndex: 'income',
            sorter: (a, b) => a.income - b.income,
            width: 80,
            render: (dataIndex) => dataIndex === null ? <span>/</span> : <span>{dataIndex}</span>
        }, {
            title: '最新投放时间',
            dataIndex: 'adCreateTime',
            sorter: (a, b) => a.adCreateTime - b.adCreateTime,
            width: 160,
            render: (dataIndex) => dataIndex === null ? <span>/</span> : <span>{formatDateTime(dataIndex)}</span>
        }, {
            title: '操作',
            dataIndex: 'opera',
            width: 90,
            className: 'mediaAction',
            render: (text, record) =>
                <div className='opera'>
                    <span style={{color: 'rgb(24, 144, 255)'}} onClick={() => editClick(record.id)}>
                        编辑
                    </span>
                    <span onClick={this.toLaunchAdd.bind(this, record.id, record.name)}
                          style={{color: 'rgb(24, 144, 255)', marginLeft: '5px'}}>投放</span>
                </div>
        }];
        return (
            <Table
                key={record => record.id}
                rowKey={record => record.id}
                columns={columns}
                dataSource={dataSource}
                bordered={true}
                scroll={{x: '100%'}}
                className='formTable'
                loading={loading}
                pagination={false}
                onChange={changeSore}
                locale={locale}
            />
        )
    }
}
