import React from 'react';
import './Media.less';
import AddMedia from './AddMedia';
import EditMedia from './EditMedia';
import FormTable from './MediaTable';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import BreadcrumbCustom from '../../common/BreadcrumbCustom';
import {Row, Col, Input, Button, Pagination, LocaleProvider, Form} from 'antd';
import {getToken} from "../../../utils/filter";
import {connect} from "../../../utils/socket";
import {getMediaList} from '../../../api/marketApi'
import {emojiRule,filterEmoji} from '../../../utils/filter'

const Search = Input.Search;
let applyData = {
    size: 40,
    current: 1,
    descs: ['createTime'],
    asc: [],
    condition: {}
};
class media extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            tableRowKey: 0,
            loading: true,
            dataAll: '',       //返回的所有数据
            dataSource: [],    //列表数据
            addMedia: false,
            editMedia: false,
        };
    }

    //渲染
    componentDidMount() {
        applyData.current = 1;
        this.getMediaInfoList();
        //链接websocket
        connect(getToken('username'));
        //end
    };
    //页面离开
    componentWillUnmount(){
        applyData = {
            size: 40,
            current: 1,
            descs: ['createTime'],
            asc: [],
            condition: {}
        };
    };

    getMediaInfoList = () => {
        this.setState({
            loading:true
        });
        getMediaList(applyData).then(res=>{
            console.log(res.data.data,"getMediaList")
            this.setState({
                dataSource:res.data.data.records,
                dataAll:res.data.data,
                loading:false
            })
        }).catch(err=>{
            console.log(err)
        })
    };
    //新建媒体
    addMedia = () => {
        this.setState({
            addMedia: true
        });
    };

    //点击弹层的x号
    handleCancel = () => {
        this.setState({
            addMedia: false,
            editMedia: false
        })
    };
    onRef = (ref) => {
        this.child = ref
    };
    //编辑按钮操作
    editClick = (key) => {
        this.setState({
            editMedia: true
        },()=>{
            this.child.setformdata(key)
        })
    };

    //搜索
    onChangeUserName = (value) => {
        //去除空格
        let val = value.replace(/\s+/g,"");
        if(emojiRule().test(val)){
            val = filterEmoji(val)
            console.log(val)
        }
        applyData.condition.name = val;
        applyData.current = 1;
        this.getMediaInfoList();
    };

    // 排序
    changeSore = (dataIndex, record, sorter) => {
        applyData.descs = (sorter.order === "descend" ? [sorter.field] : []);
        applyData.asc = (sorter.order === "ascend" ? [sorter.field] : []);
        // 排序后，恢复排序时，数据应当保持和默认一致；
        let arr = Object.keys(sorter); //此方法为ES6新方法，返回值是对象中属性名组成的数组；
        if (arr.length == 0) {
            applyData.descs = ['createTime'];
        }
        this.getMediaInfoList();
    };

    // 改变页码
    onChangePage = (page, pageSize) => {
        applyData.current = page;
        applyData.size = pageSize;
        this.getMediaInfoList();
    };

    // 改变每页条数
    onShowSizeChange = (current, pageSize) => {
        applyData.current = current;
        applyData.size = pageSize;
        this.getMediaInfoList();
    };

    showTotal = (total) => {
        return `共 ${total} 条数据`;
    };

    render() {
        const {dataSource, loading} = this.state;
        const menus = [
            {
                path: '/app/dashboard/analysis',
                name: '首页'
            },
            {
                path: '#',
                name: '营销中心'
            },
            {
                path: '#',
                name: '媒体管理'
            }
        ];
        return (
            <div>
                <div className="media-nav">
                    <BreadcrumbCustom paths={menus}/>
                    <p className="media-title-style">媒体管理</p>
                </div>
                <div className='media-formBody'>
                    <Row>
                        <Col span={8}>
                            <Button icon="plus" type="primary" onClick={this.addMedia}>新建</Button>
                        </Col>
                        <Col span={8} offset={8}>
                            <div className='media-btnOpera'>
                                <Search
                                    placeholder="搜索媒体名称"
                                    onSearch={this.onChangeUserName}
                                />
                            </div>
                        </Col>
                    </Row>
                    <AddMedia
                        showstate={this.state.addMedia}
                        handleCance={this.handleCancel}
                        getMediaInfo={this.getMediaInfoList}
                    />
                    <EditMedia
                        onRef={this.onRef}
                        showstate={this.state.editMedia}
                        handleCance={this.handleCancel}
                        getMediaInfo={this.getMediaInfoList}
                    />
                    <FormTable
                        dataSource={dataSource}
                        checkChange={this.checkChange}
                        onDelete={this.onDelete}
                        changeSore={this.changeSore}
                        editClick={this.editClick}
                        loading={loading}
                        id={this.state.tableRowKey}
                    />
                    <div style={{overflow: 'hidden'}}>
                        <LocaleProvider locale={zh_CN}>
                            <Pagination showSizeChanger
                                        onShowSizeChange={this.onShowSizeChange}
                                        onChange={this.onChangePage}
                                        total={this.state.dataAll.total}
                                        defaultPageSize={40}
                                        showTotal={this.showTotal.bind(this.state.dataAll.total)}
                                        current={applyData.current}
                            />
                        </LocaleProvider>
                    </div>
                </div>
            </div>
        )
    }
}

const mediaPage = Form.create()(media);
export default mediaPage;