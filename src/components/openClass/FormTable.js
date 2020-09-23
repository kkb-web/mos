import React, {Component} from 'react';
import {Table, Popconfirm, LocaleProvider} from 'antd';
import {formatDateTime, openAuthor} from '../../utils/filter'
import {Link} from 'react-router-dom';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import {urlSubjectList} from '../../api/openCourseApi';
import {getSubjectList} from '../../api/commonApi';

export default class FormTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            len: 0,
            dataSource: '',
            subjectData: [],
            subjectLen: 0
        }
    }

    // 获取所属学科名称
    getSubjectName = () => {
        // 学科筛选下拉选项
        urlSubjectList().then(response => {
            if (response.data.code === 0) {
                this.setState({
                    dataSource: response.data.data,
                    len: response.data.data.length
                });
                let data = [];
                for(let i = 0; i < this.state.len; i++) {
                    let temp = {
                        text: this.state.dataSource[i].subjectName,
                        value: this.state.dataSource[i].subjectId
                    };
                    data.push(temp);
                }
                this.setState({
                    data: data
                })
            }
        });
        // 所有学科
        getSubjectList().then(response => {
            if (response.data.code === 0) {
                this.setState({
                    subjectData: response.data.data,
                    subjectLen: response.data.data.length
                });
            }
        })
    };

    // 根据学科ID匹配对应的学科名称
    matchSubject = (dataIndex) => {
        let subjectName = '';
        // 根据", "将字符串拆成字符串数组
        // let array = dataIndex.split(", ");
        for(let j = 0; j < dataIndex.length; j++) {
            for(let i = 0; i < this.state.subjectLen; i++) {
                if(parseInt(dataIndex[j]) === parseInt(this.state.subjectData[i].id)){
                    if(subjectName) {
                        subjectName += '/' + this.state.subjectData[i].name
                    } else {
                        subjectName = this.state.subjectData[i].name
                    }
                }
            }
        }
        if(!subjectName) {
            subjectName = '/'
        }
        return subjectName
    };

    // 渲染
    componentDidMount() {
        this.getSubjectName();
    }

    render() {
        const {onDelete, changeSore, dataSource, distriClick, loading} = this.props;
        const columns = [{
            title: '公开课名称',
            dataIndex: 'name',
            width: 240,
            render: (dataIndex, record) => {
                return  <div style={{textAlign: 'left', paddingRight: 0}}>
                            <img src={"https://img.kaikeba.com/" + record.siteThumbnail + '!w1h1'} style={{width: '55px', height: '55px', marginRight: '10px', float: 'left'}} alt="noImg"/>
                            <div className="course-text" style={{width: 'calc(100% - 65px)', float: 'left'}}>
                                <Link to={'/app/course/' + record.id + '?page=1'}>
                                    <span style={{color: 'rgb(35, 82, 124)', cursor: 'pointer'}}>{dataIndex}</span>
                                </Link>
                                {/*<span style={{color: '#888', display: authSubject(record) ? 'none' : 'block'}}>{dataIndex}</span>*/}
                            </div>
                        </div>
            },
        }, {
            title: '所属学科',
            dataIndex: 'subjects',
            key: 'subjects',
            width: 120,
            filters: this.state.data,
            render: (dataIndex) => dataIndex === null ? <span>/</span> : <span>{this.matchSubject(dataIndex)}</span>
        }, {
            title: 'PV',
            dataIndex: 'pv',
            sorter: (a, b) => a.pv - b.pv,
            width: 80,
            render: (dataIndex) => dataIndex === null ? <span>/</span> : <span>{dataIndex}</span>
        }, {
            title: 'UV',
            dataIndex: 'uv',
            sorter: (a, b) => a.uv - b.uv,
            width: 80,
            render: (dataIndex) => dataIndex === null ? <span>/</span> : <span>{dataIndex}</span>
        }, {
            title: '直播状态',
            dataIndex: 'liveStatus',
            sorter: (a, b) => a.liveStatus - b.liveStatus,
            width: 120,
            render: (dataIndex) => {
                if (dataIndex === 0) {
                    return "直播前"
                } else if (dataIndex === 1) {
                    return "直播中"
                } else if (dataIndex === 2) {
                    return "直播结束"
                } else {
                    return "直播回放"
                }
            }
        }, {
            title: '报名/展示',
            dataIndex: 'signupCount',
            sorter: (a, b) => a.signupCount - b.signupCount,
            width: 130,
            render: (dataIndex, record) => dataIndex === null ? <span>/</span> :
                <span>{dataIndex}／{record.showCount}</span>
        }, {
            title: '上课峰值',
            dataIndex: 'onlinePeak',
            sorter: (a, b) => a.onlinePeak - b.onlinePeak,
            width: 120,
            render: (dataIndex) => dataIndex === null ? <span>/</span> : <span>{dataIndex}</span>
        }, {
            title: '关注人数',
            dataIndex: 'subscribeCount',
            sorter: (a, b) => a.subscribeCount - b.subscribeCount,
            width: 120,
            render: (dataIndex) => dataIndex === null ? <span>/</span> : <span>{dataIndex}</span>
        }, {
            title: '直播时间',
            dataIndex: 'schedule',
            sorter: (a, b) => a.schedule - b.schedule,
            width: 120,
            render: (dataIndex) => {
                return formatDateTime(dataIndex)
            }
        }, {
            title: '状态',
            dataIndex: 'status',
            sorter: (a, b) => a.status - b.status,
            width: 90,
            render: (dataIndex) => {
                return dataIndex === 1 ? <span style={{color: '#009900'}}>已上架</span> :
                    <span style={{color: '#FF6600'}}>已下架</span>
            }
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            sorter: (a, b) => a.createTime - b.createTime,
            width: 120,
            render: (dataIndex) => {
                return formatDateTime(dataIndex)
            }
        }, {
            title: '操作',
            dataIndex: 'opera',
            width: 120,
            render: (text, record) =>
                <div className='opera'>
                    <Link to={'/app/course/' + record.id + '?page=1'} style={{margin: '0 2px', display: (openAuthor('marketing:opencourse:manage', record.subjects) ? 'inline-block': 'none')}}>
                        <span style={{color: 'rgb(35, 82, 124)'}} >
                            编辑
                        </span>
                    </Link>
                    <p style={{margin: '0 2px', color: '#888', cursor: 'text', display: openAuthor('marketing:opencourse:manage', record.subjects) ? 'none' : 'inline-block'}}>编辑</p>
                    <Link to={'/app/course/' + record.id + '?page=2'} style={{margin: '0 2px', display: openAuthor('marketing:opencourse:student', record.subjects) ? 'inline-block': 'none'}}>
                            <span style={{color: 'rgb(35, 82, 124)'}}>
                                学员
                            </span>
                    </Link>
                    <p style={{margin: '0 2px', color: '#888', cursor: 'text', display: openAuthor('marketing:opencourse:student', record.subjects) ? 'none' : 'inline-block'}}>学员</p>
                    <div style={{width: '65px', display: 'inline-block'}}>
                        <Link to={'/app/course/' + record.id + '?page=4'} style={{margin: '0 2px', display: openAuthor('marketing:opencourse:add:allot', record.subjects) ? 'inline-block': 'none'}}>
                            <span style={{color: 'rgb(35, 82, 124)'}}>
                                公海分流
                            </span>
                        </Link>
                        <p style={{margin: '0 2px', color: '#888', cursor: 'text', display: openAuthor('marketing:opencourse:add:allot', record.subjects) ? 'none' : 'inline-block'}}>公海分流</p>
                    </div>
                    <div >
                        <Link to={'/app/course/' + record.id + '?page=3'} style={{margin: '0 2px', display: openAuthor('marketing:opencourse:student', record.subjects) ? 'inline-block': 'none'}}>
                            <span style={{color: 'rgb(35, 82, 124)'}}>
                                渠道
                            </span>
                        </Link>
                        <p style={{margin: '0 2px', color: '#888', cursor: 'text', display: openAuthor('marketing:opencourse:student', record.subjects) ? 'none' : 'inline-block'}}>渠道</p>
                        <span style={{color: 'rgb(35, 82, 124)', margin: '0 2px', display: openAuthor('marketing:opencourse:manage', record.subjects) ? 'inline-block': 'none'}} id={"channel"}>
                            <Popconfirm
                                placement="topRight"
                                title={"确定要" + (record.status === 1 ? '下架' : '上架') + "吗?"}
                                cancelText="取消"
                                okText="确定"
                                onConfirm={() => onDelete(record.id, record.status)}
                                getPopupContainer={() => document.getElementById('tb')}
                            >
                                {record.status === 1 ? '下架' : '上架'}
                            </Popconfirm>
                        </span>
                        <p style={{margin: '0 2px', color: '#888', cursor: 'text', display: openAuthor('marketing:opencourse:manage', record.subjects) ? 'none' : 'inline-block'}}>{record.status === 1 ? '下架' : '上架'}</p>
                    </div>
                    {/*<div style={{width: '65px', display: 'inline-block'}}>*/}
                        {/*<Link to={'/app/course/' + record.id + '?page=5'} style={{margin: '0 2px', display: openAuthor('marketing:opencourse:fission', record.subjects) ? 'inline-block': 'none'}}>*/}
                            {/*<span style={{color: 'rgb(35, 82, 124)'}}>*/}
                                {/*裂变数据*/}
                            {/*</span>*/}
                        {/*</Link>*/}
                        {/*<p style={{margin: '0 2px', color: '#888', cursor: 'text', display: openAuthor('marketing:opencourse:fission', record.subjects) ? 'none' : 'inline-block'}}>裂变数据</p>*/}
                    {/*</div>*/}
                </div>
        }];
        return (
            <LocaleProvider locale={zh_CN}>
                <div >
                    <Table
                        id={"tb"}
                        key={(record, i) => i}
                        rowKey={(record, i) => i}
                        rowSelection={null}
                        columns={columns}
                        dataSource={dataSource}
                        bordered={true}
                        scroll={{x: '100%'}}
                        className='open-course-table formTable'
                        loading={loading}
                        pagination={false}
                        onChange={changeSore}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                    />
                </div>
            </LocaleProvider>
        )
    }
}
