import React, { Component } from 'react';
import { Table, Icon} from 'antd';
import {formatDateTime, formatDatehhmmss, openAuthor} from '../../../utils/filter';

export default class FormTable extends Component{
    constructor(props){
        super(props);
    }

    canSendMsg = (record) => {
        let time = record.interactionTime,
            nowTime = parseInt(new Date().getTime() / 1000),
            valueTime = Math.ceil((nowTime - time) / 60 / 60 / 24);
        if (record.subscribe === 0 || valueTime > 2) {
            return false
        } else {
            return true
        }
    };

    render(){
        const { checkChange, changeSore, editClick, dataSource, loading, invalidClick, selectedKeys, editFlow, editMsg,showHistoricalNews,subjects} = this.props;
        const locale = {
            emptyText: '没有数据'
        };
        const rowSelection = {
            selectedRowKeys: selectedKeys,
            onChange: checkChange,
            getCheckboxProps: record => ({
                id: record.id.toString(),
                remark: record.remark
            }),
        };
        const columns = [{
            title: '头像',
            dataIndex: 'headimgurl',
            width: 80,
            render: (dataIndex) => (
                !dataIndex ?
                <Icon type="user" /> :
                <img src={dataIndex} alt="headimgurl" style={{width: '50px', height: '50px', borderRadius: '50%'}}/>)
        },{
            title: '昵称/备注',
            dataIndex: 'nickname',
            width: 140,
            render: (dataIndex, record) =>
            {
                return <div onClick={() => editClick(record.id, record.remark)}>
                    <p style={{color: 'rgb(35, 82, 124)', cursor: 'pointer',marginBottom:'0'}}>{dataIndex === null ? '/' : dataIndex}</p>
                    <p style={{
                        color: '#333',
                        cursor: 'pointer',
                        width: '120px',
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>{record.remark}</p>
                    {
                        record.level == 1
                        &&<span style={{
                            padding:'2px 4px',
                            borderRadius:'3px',
                            display:'inline-block',
                            width:'48px',
                            height:'18px',
                            lineHeight:'13px',
                            fontSize:'12px',
                            background:'rgba(102,25,200,1)',
                            color:'#fff'
                        }}>1度</span>
                    }
                    {
                        record.level == 2
                        &&<span style={{
                            padding:'2px 4px',
                            borderRadius:'3px',
                            display:'inline-block',
                            width:'48px',
                            height:'18px',
                            lineHeight:'13px',
                            fontSize:'12px',
                            background:'rgba(102,25,200,.7)',
                            color:'#fff'
                        }}>2度</span>
                    }
                    {
                        record.level == 3
                        &&<span style={{
                            padding:'2px 4px',
                            borderRadius:'3px',
                            display:'inline-block',
                            width:'48px',
                            height:'18px',
                            lineHeight:'13px',
                            fontSize:'12px',
                            background:'rgba(102,25,200,.4)',
                            color:'#fff'
                        }}>3度</span>
                    }
                    {
                        record.level >= 4
                        &&<span style={{
                            padding:'2px 4px',
                            borderRadius:'3px',
                            display:'inline-block',
                            width:'48px',
                            height:'18px',
                            lineHeight:'13px',
                            fontSize:'12px',
                            background:'#CAC8CB',
                            color:'#fff'
                        }}>3度+</span>
                    }
                </div>
            }
        },{
            title: '销售',
            dataIndex: 'sellerName',
            sorter: (a, b) => a.sellerName - b.sellerName,
            width: 110,
            render: (dataIndex) => {
                return dataIndex === null ?  <span>/</span> : <span>{dataIndex}</span>
            }
        },{
            title: '渠道',
            dataIndex: 'channelName',
            sorter: (a, b) => a.channelName - b.channelName,
            width: 110,
            render: (dataIndex, record) => {
                return dataIndex === null ?  <span>/</span> : <span style={{color: record.allot === 1 ? '#faad14' : 'rgba(0, 0, 0, 0.65)'}}>{dataIndex}</span>
            }
        },{
            title: '查看',
            dataIndex: 'pv',
            sorter: (a, b) => a.pv - b.pv,
            width: 95,
            render: (dataIndex) => {
                return dataIndex === null ?  <span>/</span> : <span>{dataIndex}</span>
            }
        },{
            title: '报名',
            dataIndex: 'signup',
            sorter: (a, b) => a.signupTime - b.signupTime,
            width: 95,
            render: (dataIndex, record) => {
                return record.signupTime ? <Icon type="check-circle" theme="filled" style={{color: '#009900', fontSize: '20px'}}/> : <Icon type="close-circle" theme="filled" style={{color: '#d42400', fontSize: '20px'}}/>
            }
        },{
            title: '直播时长',
            dataIndex: 'liveDuration',
            sorter: (a, b) => a.liveDuration - b.liveDuration,
            width: 150,
            render: (dataIndex) => {
                return dataIndex === null ? "/" : formatDatehhmmss(dataIndex)
            }
        },{
            title: '回放时长',
            dataIndex: 'replayDuration',
            sorter: (a, b) => a.replayDuration - b.replayDuration,
            width: 150,
            render: (dataIndex) => {
                return dataIndex === null ? "/" : formatDatehhmmss(dataIndex)
            }
        },{
            title: '观看时长',
            dataIndex: 'durationCount',
            sorter: (a, b) => a.durationCount - b.durationCount,
            width: 150,
            render: (dataIndex) => {
                return dataIndex === null ? "/" : formatDatehhmmss(dataIndex)
            }
        },{
            title: '报名时间',
            dataIndex: 'signupTime',
            sorter: (a, b) => a.signupTime - b.signupTime,
            width:150,
            render: (dataIndex) => {
                return dataIndex === null ? "/" : formatDateTime(dataIndex)
            }
        },{
            title: '关注时间',
            dataIndex: 'subscribeTime',
            sorter: (a, b) => a.subscribeTime - b.subscribeTime,
            width:150,
            render: (dataIndex, record) => {
                return dataIndex === null ? "/" : <span style={{color: record.subscribe === 1 ? '#000' : '#F40505'}}>{formatDateTime(dataIndex)}</span>
            }
        },{
            title: '消息',
            dataIndex: 'messageCount',
            width: 140,
            render: (dataIndex,record) => {
                return dataIndex === null ?  <span>/</span> : <span onClick={() => showHistoricalNews(record.id)} style={{color:'#1890ff',cursor: 'pointer'}}>{dataIndex}</span>
            }
        },{
            title: '操作',
            dataIndex: 'opera',
            width:90,
            render: (text, record) =>
                <div>
                    <span className="user-text" style={{color: 'rgb(35, 82, 124)', cursor: 'pointer', display: this.canSendMsg(record) ? 'inline': 'none'}} onClick={() => editMsg(record)}>
                         发送消息
                    </span>
                    <span style={{color: '#888', cursor: 'text !important', display: !this.canSendMsg(record) ? 'inline': 'none'}}>发送消息</span>
                    <span className="user-text" style={{color: 'rgb(35, 82, 124)', cursor: 'pointer', display: openAuthor('marketing:opencourse:allot', subjects) ? 'inline': 'none'}} onClick={() => editFlow(record)}>
                         分配
                    </span>
                    <span style={{color: '#888', cursor: 'text !important', display: openAuthor('marketing:opencourse:allot', subjects) ? 'none': 'inline'}}>分配</span>
                    <span className="user-text" style={{color: 'rgb(35, 82, 124)', cursor: 'pointer'}} onClick={() => editClick(record.id, record.remark)}>
                         备注
                    </span>
                </div>
        }];
        return(
            <Table
                key={record => record.id}
                rowKey={record => record.id}
                columns={columns}
                dataSource={dataSource}
                rowSelection={rowSelection}
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
