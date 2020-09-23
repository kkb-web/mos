import React, {Component} from "react";
import "./../common.less";
import {Card, Pagination, LocaleProvider, Row, Drawer, Input, Button, Modal,Form} from "antd";
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import ScreenCondion from '../common/ScreeningConditions'
import ScreenSearch from '../common/ScreenSearch'
import InfoBox from '../../common/infoBox/Info'
import zh_CN from "antd/lib/locale-provider/zh_CN";
import {getToken} from "../../../utils/filter";
import {connect} from "../../../utils/socket";
import FormTable from "./FormTable";
import {getClueDetail, getMyClueList, getClueDetailBase,getClueDetailBusiness,getAllRemark,getNewClueDetail} from '../../../api/clueCenterApi'
import {getSubjectList, getCampaignNameList, getPlatformList, getComfirmStatusList} from '../../../api/commonApi'

let params = {
  size: 40,
  current: 1,
  ascs: [],
  descs: ['create_time'],
  condition: {}
};
const FormItem = Form.Item;
class OnlineSaleClue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      disableBtn: false,
      resetBtn: false,
      modalShow: false,
      dataAll: '',           //列表总数据
      dataSource: [],      //列表表单数据
      drawerDataSource: [],
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
      clueId: null,
      xId: null,
      objId:{},
      baseFormItem: [],
      businessFormItem:[],
      markList:[],
      getNewClue: []
    };
  }

  componentDidMount() {
    //链接websocket
    connect(getToken('username'));
    //end
    this.getMyClueListFn();
    this.getSubjectListFN();
    this.getCampaignNameListFn();
    this.getPlatformListFn();
    this.getComfirmStatusListFn();
  };

  componentWillUnmount() {

  };

  //基本信息字段
  getClueDetailBaseFn = (clueId) => {
    let data = {
      clueId: clueId,
    };
    getClueDetailBase(data).then(res => {
      if(res.data.code == 0){
        this.setState({
          baseFormItem:res.data.data
        })
      }
    }).catch(err => {
      console.log(err)
    })
  };
  //业务信息基本字段
  getClueDetailBusinessFn=(clueId,campaignCode)=>{
    let data ={
      clueId:clueId,
      campaignCode:campaignCode
    };
    getClueDetailBusiness(data).then(res=>{
      if(res.data.code == 0){
        this.setState({
          businessFormItem:res.data.data
        })
      }
    }).catch(err=>{
      console.log(err)
    })
  };

  getNewClueDetailFn = (clueId) => {
    this.setState({
      modalShow: true
    })

    getNewClueDetail(clueId).then(res => {
      if(res.data.code === 0) {
        this.setState({
          getNewClue: res.data.data
        })
      }
    })
  }

  cancleStatus = () => {
    this.setState({
      modalShow: false
    })
  }
  //获取单条线索下全部备注
  getAllRemarkFN = (clueId)=>{
    let data = {
      clueId:clueId
    };
    getAllRemark(data).then(res=>{
      if(res.data.code == 0){
        this.setState({
          markList:res.data.data
        })
      }
    }).catch(err=>{
      console.log(err)
    })
  };
  //列表下拉
  getMyClueListFn = () => {
    getMyClueList(params).then(res => {
      if (res.data.code == 0) {
        this.setState({
          dataSource: res.data.data.records,
          dataAll: res.data.data,
          loading: false,
          disableBtn: false,
          resetBtn: false
        })
      }
    }).catch(err => {
      console.log(err)
    })
  };
  //获取学科下拉列表
  getSubjectListFN = () => {
    getSubjectList().then(res => {
      if (res.data.code === 0) {
        let data = res.data.data;
        let Arr = [];
        for (let i = 0; i < data.length; i++) {
          let obj = {};
          obj.key = data[i].id;
          obj.value = data[i].name;
          Arr.push(obj);
        }
        this.setState({
          subjectList: Arr
        });
      }
    }).catch(err => {
      console.log(err)
    })
  };
  //点击详情操作
  onlineSaleDetail = (clueId, id,campaignCode,objId) => {
    this.getClueDetailBaseFn(clueId);
    this.getClueDetailBusinessFn(clueId,campaignCode);
    this.getAllRemarkFN(clueId);
    let sendData = {id: clueId};
    getClueDetail(sendData).then(res => {
      if (res.data.code === 0) {
        this.setState({
          visible: true,
          drawerDataSource: res.data.data,
          clueId: clueId,
          xId: id,
          objId:objId
        })
      }
    }).catch(err => {
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
    this.getMyClueListFn()
  };
  //获取推广名称
  getCampaignNameListFn = (params) => {
    const paramNew = params || ''
    getCampaignNameList(paramNew).then(res => {
      if (res.data.code === 0) {
        let data = res.data.data;
        let Arr = [];
        for (let i = 0; i < data.length; i++) {
          let obj = {};
          obj.key = data[i].code;
          obj.value = data[i].name;
          Arr.push(obj);
        }
        this.setState({
          extensionNameList: Arr
        })
      }
    }).catch(err => {
      console.log(err)
    })
  };
  //获取平台下拉列表
  getPlatformListFn = () => {
    getPlatformList().then(res => {
      if (res.data.code === 0) {
        let data = res.data.data;
        let Arr = [];
        for (let i = 0; i < data.length; i++) {
          let obj = {};
          obj.key = data[i].platform;
          obj.value = data[i].platformName;
          Arr.push(obj);
        }
        this.setState({
          platformList: Arr
        })
      }
    }).catch(err => {
      console.log(err)
    })
  };

  //推广名称onBlur
  extensionNameSearch = (value,e) => {
    this.getCampaignNameListFn(value)
  };
  //线索确认状态
  getComfirmStatusListFn = () => {
    getComfirmStatusList().then(res => {
      if (res.data.code === 0) {
        this.setState({
          clueTypeList: res.data.data
        })
      }
    }).catch(err => {
      console.log(err)
    })
  };

  //线索状态onchange
  clueTypeChange = (value, e) => {
    this.setState({
      clueTypeValue: value,
      loading: true
    });
    params.condition.confirm = parseInt(value);
    this.getMyClueListFn();
  };
  //所属学科onchange
  subjectChange = (value) => {
    this.setState({
      subjectValue: value,
      loading: true
    });
    params.condition.subject = parseInt(value);
    this.getMyClueListFn();
  };
  //选择平台onchange
  platformChange = (value) => {
    this.setState({
      platformValue: value,
      loading: true
    });
    params.condition.platform = value;
    this.getMyClueListFn();
  };
  //推广名称onchange
  extensionNameChange = (value, e) => {
    this.setState({
      extensionNameValue: value,
      loading: true
    });
    params.condition.campaignName = e.props.children;
    this.getMyClueListFn();
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
    this.getMyClueListFn();
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
    this.getMyClueListFn();
  };
  // 改变页码
  onChangePage = (page, pageSize) => {
    params.size = pageSize;
    params.current = page;
    this.setState({
      loading:true
    })
    this.getMyClueListFn();
  };
  // 改变每页条数
  onShowSizeChange = (current, pageSize) => {
    params.size = pageSize;
    params.current = current;
    this.setState({
      loading:true
    })
    this.getMyClueListFn();
  };
  // 展示数据总数
  showTotal = (total) => {
    return `共 ${total} 条数据`;
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const {
      dataSource, loading,
      visible, clueTypeValue,
      subjectValue, platformValue,
      extensionNameValue, clueTypeList,
      subjectList, platformList,
      extensionNameList, searchValue,
      disableBtn, resetBtn,
      drawerDataSource, clueId, xId,
      baseFormItem, businessFormItem,objId,markList,
      getNewClue
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
        path: '/app/clue/myclue',
        name: '我的线索'
      }
    ];

    const FormItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 16},
    };

    return (
      <div className="cule-center">
        <div className="page-nav">
          <BreadcrumbCustom paths={menus}/>
          <p className="title-style">我的线索</p>
          <p className="title-describe">用于管理属于自己的营销线索，并支持查看和编辑对应线索的行为数据</p>
        </div>
        <Card bordered={false}>
          <Row className="clue-select-box">
            <ScreenCondion
              labelName='确认状态'
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
              handleTable={this.getNewClueDetailFn}
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
        <Modal
          title="预报名信息"
          centered
          visible={this.state.modalShow}
          onCancel={this.cancleStatus}
          footer={[
            <Button key="cancle" onClick={this.cancleStatus}>取消</Button>,
            <Button type="primary" key="close" onClick={this.cancleStatus}>关闭</Button>
          ]}
          >
          <Form className="finace-addbills-form" layout="horizontal">
            {
              getNewClue && getNewClue.map((item, index) => {
                return <FormItem label={item.name} {...FormItemLayout} hasFeedback key={item.id}>
                  {getFieldDecorator(`info${index}`, {
                    initialValue: item.value
                  })(
                    <Input
                      disabled={true}
                      maxLength={20}
                    />
                  )}
                </FormItem>
            })
          }
          </Form>
        </Modal>
        <Drawer
          width={500}
          mask={false}
          placement={'right'}
          closable={true}
          onClose={this.onClose}
          visible={visible}
          destroyOnClose={true}
          getContainer={() => document.querySelector('.cule-center')}
        >
          <InfoBox markList={markList} objId={objId} InfoBoxType="myClue" dataSource={drawerDataSource} clueId={clueId} xId={xId} baseFormItem={baseFormItem}
                   businessFormItem={businessFormItem}/>
        </Drawer>
      </div>
    )
  }
}

const OnlineSaleClueForm = Form.create()(OnlineSaleClue);
export default OnlineSaleClueForm
