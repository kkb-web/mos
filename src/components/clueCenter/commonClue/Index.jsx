import React, {Component} from "react";
import "./../common.less";
import {Card, Pagination, LocaleProvider, Row, Drawer, message} from "antd";
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import ScreenCondion from '../common/ScreeningConditions'
import ScreenSearch from '../common/ScreenSearch'
import InfoBox from '../../common/infoBox/Info'
import zh_CN from "antd/lib/locale-provider/zh_CN";
import {getToken} from "../../../utils/filter";
import {connect} from "../../../utils/socket";
import FormTable from "./FormTable";
import {getCommonCluesList,getClueDetail} from '../../../api/clueCenterApi'
import { getClueList,getSubjectList,getCampaignNameList,getPlatformList} from '../../../api/commonApi'

let params = {
  size: 40,
  current: 1,
  ascs: [],
  descs: ['createTime'],
  condition: {

  }
};

export default class OnlineSaleClue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      disableBtn: false,
      resetBtn: false,
      dataAll: '',           //列表总数据
      dataSource: [],      //列表表单数据
      drawerDataSource:[],
      visible: false,
      searchValue: '',
      clueTypeValue: undefined,
      subjectValue: undefined,
      platformValue: undefined,
      extensionNameValue: undefined,
      clueTypeList: [],
      subjectList: [],
      platformList: [],
      extensionNameList: [],
      clueId:null
    };
  }

  componentDidMount() {
    //链接websocket
    connect(getToken('username'));
    //end
    this.getCommonClueListFn();
    this.getSubjectListFN();
    this.getClueListFn();
    this.getCampaignNameListFn();
    this.getPlatformListFn();
  };

  componentWillUnmount() {

  };

  //列表
  getCommonClueListFn = () => {
    getCommonCluesList(params).then(res => {
      if (res.data.code == 0) {
        this.setState({
          dataSource: res.data.data.records,
          dataAll: res.data.data,
          loading: false,
          disableBtn: false,
          resetBtn: false,
        })
      }else {
        this.setState({
          loading: false
        })
        message.error('无法获取数据')
      }
    }).catch(err => {
      console.log(err)
    })
  };
  //获取线索状态列表
  getClueListFn = ()=>{
    getClueList().then(res=>{
      if(res.data.code === 0){
        this.setState({
          clueTypeList:res.data.data
        })
      }
    }).catch(err=>{
      console.log(err)
    })
  };
  //获取学科下拉列表
  getSubjectListFN = ()=>{
    getSubjectList().then(res=>{
      if (res.data.code === 0){
        let data = res.data.data;
        let Arr = [];
        for(let i=0;i<data.length;i++){
          let obj = {};
          obj.key = data[i].id;
          obj.value = data[i].name;
          Arr.push(obj);
        }
        this.setState({
          subjectList:Arr
        })
      }
    }).catch(err=>{
      console.log(err)
    })
  };
  //获取推广名称
  getCampaignNameListFn = (params) =>{
    const paramNew = params || ''
    getCampaignNameList(paramNew).then(res=>{
      if(res.data.code ===0){
        let data = res.data.data;
        let Arr = [];
        for(let i=0;i<data.length;i++){
          let obj = {};
          obj.key = data[i].code;
          obj.value = data[i].name;
          Arr.push(obj);
        }
        this.setState({
          extensionNameList:Arr
        })
      }
    }).catch(err=>{
      console.log(err)
    })
  };
  //获取平台下拉列表
  getPlatformListFn = ()=>{
    getPlatformList().then(res=>{
      if(res.data.code ===0){
        let data = res.data.data;
        let Arr = [];
        for(let i=0;i<data.length;i++){
          let obj = {};
          obj.key = data[i].platform;
          obj.value = data[i].platformName;
          Arr.push(obj);
        }
        this.setState({
          platformList:Arr
        })
      }
    }).catch(err=>{
      console.log(err)
    })
  };
  //点击详情操作
  onlineSaleDetail = (id) => {
    let sendData = {id:id};
    getClueDetail(sendData).then(res=>{
      if(res.data.code === 0){
        this.setState({
          visible: true,
          drawerDataSource:res.data.data,
          clueId:id
        })
      }
    }).catch(err=>{
      console.log(err)
    });
  };
  //确认线索
  confirmClue = (id) => {
    console.log(id)
  };
  // 关闭遮罩
  onClose = (e) => {
    e.stopPropagation();
    this.setState({
      visible: false
    })
  };


  //线索状态onchange
  clueTypeChange = (value, e) => {
    this.setState({
      clueTypeValue: value,
      loading:true
    });
    params.condition.status = parseInt(value);
    this.getCommonClueListFn();
  };

  //所属学科onchange
  subjectChange = (value) => {
    this.setState({
      subjectValue: value,
      loading:true
    });
    params.condition.subject = parseInt(value);
    this.getCommonClueListFn()
  };
  //选择平台onchange
  platformChange = (value) => {
    this.setState({
      platformValue: value,
      loading:true
    });
    params.condition.platform = value;
    this.getCommonClueListFn()
  };
  //推广名称onchange
  extensionNameChange = (value,e) => {
    this.setState({
      extensionNameValue: value,
      loading:true
    });
    params.condition.campaignName = e.props.children;
    this.getCommonClueListFn()
  };
  //推广名称onBlur
  extensionNameSearch = (value,e) => {
    this.getCampaignNameListFn(value)
  };

  // 搜索用户的输入框
  searchContent = (e) => {
    this.setState({
      searchValue: e.target.value
    })
  };
  // 搜索用户
  searchUser = () => {
    this.setState({
      disableBtn: true,
      loading: true
    });
    params.condition.search = this.state.searchValue.replace(/\s+/g, "");
    params.current = 1;
    this.getCommonClueListFn();
  };
  // 全部重置
  searchReset = () => {
    this.setState({
      resetBtn: true,
      searchValue: '',
      loading: true,
      clueTypeValue: undefined,
      subjectValue: undefined,
      platformValue: undefined,
      extensionNameValue: undefined,
    });
    params.current = 1;
    params.condition = {};
    this.getCommonClueListFn();
  };


  // 改变页码
  onChangePage = (page, pageSize) => {
    params.size = pageSize;
    params.current = page;
    this.setState({
      loading:true
    })
    this.getCommonClueListFn();
  };
  // 改变每页条数
  onShowSizeChange = (current, pageSize) => {
    params.size = pageSize;
    params.current = current;
    this.setState({
      loading:true
    })
    this.getCommonClueListFn();
  };
  // 展示数据总数
  showTotal = (total) => {
    return `共 ${total} 条数据`;
  };

  render() {
    const {
      dataSource, loading,
      visible, clueTypeValue,
      subjectValue, platformValue,
      extensionNameValue, clueTypeList,
      subjectList, platformList,
      extensionNameList, searchValue,
      disableBtn, resetBtn,
      drawerDataSource,clueId
    } = this.state;
    const menus = [
      {
        path: '/app/dashboard/analysis',
        name: '首页'
      },
      {
        path: '#',
        name: '线索中心'
      },
      {
        path: '/app/clue/common',
        name: '公共线索'
      }
    ];

    return (
      <div className="cule-center">
        <div className="page-nav">
          <BreadcrumbCustom paths={menus}/>
          <p className="title-style">公共线索</p>
          <p className="title-describe">指无归属的所有线索。包括：初始状态下待分配的线索、掉库、被销售退回的线索</p>
        </div>
        <Card bordered={false}>
          <Row className="clue-select-box">
            <ScreenCondion
              labelName='线索状态'
              value={clueTypeValue}
              list={clueTypeList}
              onChange={this.clueTypeChange}
              placeholder='请选择'
            />
            <ScreenCondion
              labelName='所属学科'
              value={subjectValue}
              list={subjectList}
              onChange={this.subjectChange}
              placeholder='请选择'
            />
          </Row>
          <Row className="clue-select-box">
            <ScreenCondion
              labelName='选择平台'
              value={platformValue}
              list={platformList}
              onChange={this.platformChange}
              placeholder='请选择'
            />
            <ScreenCondion
              labelName='推广名称'
              value={extensionNameValue}
              list={extensionNameList}
              onChange={this.extensionNameChange}
              onSearch={this.extensionNameSearch}
              placeholder='请选择'
            />
          </Row>
          <Row className="clue-select-box">
            <ScreenSearch
              labelName='线索主体'
              placeholder='微信昵称/微信号/手机号'
              value={searchValue}
              onChange={this.searchContent}
              searchUser={this.searchUser}
              searchReset={this.searchReset}
              searchDisableBtn={disableBtn}
              resetDisableBtn={resetBtn}
            />
          </Row>
          <Row className="cule-center-table">
            <FormTable
              dataSource={dataSource}
              changeSore={this.changeSore}
              loading={loading}
              handDetailOnclick={this.onlineSaleDetail}
              handConfirm={this.confirmClue}
              subjectList={subjectList}
              clueTypeList={clueTypeList}
            />
          </Row>
          <Row>
            <div style={{overflow: 'hidden'}}>
              <LocaleProvider locale={zh_CN}>
                <Pagination
                  showSizeChanger
                  onShowSizeChange={this.onShowSizeChange}
                  onChange={this.onChangePage}
                  total={this.state.dataAll.total}
                  showTotal={this.showTotal.bind(this.state.dataAll.total)}
                  current={params.current}
                  defaultPageSize={40}/>
              </LocaleProvider>
            </div>
          </Row>
        </Card>
        <Drawer
          width={500}
          mask={false}
          placement={'right'}
          closable={true}
          onClose={this.onClose}
          visible={visible}
          getContainer={() => document.querySelector('.cule-center')}
        >
          <InfoBox dataSource={drawerDataSource} xId={clueId} />
        </Drawer>
      </div>
    )
  }
}
