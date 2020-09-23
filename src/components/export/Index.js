import React, {Component} from "react";
import "./Index.less";
import {
    Button,
    Card,
    message,
    LocaleProvider,
    Col,
    Select,
    Row,
    DatePicker,
    Upload,
    Divider,
    Spin
} from "antd";
import BreadcrumbCustom from "../common/BreadcrumbCustom";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import {getToken, splitArr} from "../../utils/filter";
import {exportClue} from "../../api/exportApi";
import {requestData} from "../../utils/importXlsx";
import {connect} from "../../utils/socket";
import {getSubjectList,getPlatformList} from '../../api/commonApi'


const Option = Select.Option;
const {RangePicker} = DatePicker;
message.config({
  top: 100,
  duration: 3,
});

let customCondition = {};
let applyData = {
    size: 40,
    current: 1,
    ascs: [],
    descs: ['createTime'],
    condition: customCondition
};

// let params = {
//     size: 100,
//     current: 1,
//     ascs: [],
//     descs: ['execTime'],
//     condition: {
//         "business": "VIPCOURSE"
//     }
// };

export default class exportList extends Component {
    constructor(props) {
        super(props);
        this.state = {
          orderDate: null,
          subjectList: null,
          platformList: null,
          subjectValue: null,
          platformValue: null,
          newCampaignNums: 0,
          countNums: 0,
          newClueNums: 0,
          clueRepeatNums: 0,
          repeatPhone: [],
          errorRows: 0,
          spinning: false
        };
    }

    componentDidMount() {
      this.getSubjectListFn()
      this.getPlatformListFn()
      connect(getToken('username'));
    };

    // 日期筛选
    handleRangePicker = (rangePickerValue, dateString) => {
        this.setState({
            orderDate: rangePickerValue
        });
        applyData.current = 1;
        customCondition.startTime = parseInt(new Date(new Date(rangePickerValue[0]).toLocaleDateString()).getTime()/1000);
        customCondition.endTime = parseInt((new Date(new Date(rangePickerValue[1]).toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)/1000);
    };

    //所属学科onchange
    subjectChange = (value) => {
      console.log(value,'value')
      this.setState({
        subjectValue: value
      });
      customCondition.subject = value;
    };
    //选择平台onchange
    platformChange = (value) => {
      this.setState({
        platformValue: value
      });
      customCondition.platform = value;
    };

    // 搜索用户
    searchUser = () => {
      if(!customCondition.startTime && !customCondition.endTime) {
        message.error('请选择时间')
        return
      }
      console.log(customCondition,'customCondition')
      exportClue(customCondition).then(res => {
        if(res.data.code === 0) {
          message.success('导出成功，请查收邮件')
        }else {
          message.error('导出失败')
        }
      })
      // let params = `startTime=${customCondition.startTime}&endTime=${customCondition.endTime}`
      // if(customCondition.subject) {
      //   params += `&subject=${customCondition.subject}`
      // }
      //
      // if(customCondition.platform) {
      //   params += `&platform=${customCondition.platform}`
      // }

      // window.location.href = `${baseUrl()}/account/clue/export?${params}`

    };

    // 上传课程缩略图icon
     uploadCourseThumbnail = (files) => {
         this.setState({
           newCampaignNums: 0,
           countNums: 0,
           newClueNums: 0,
           clueRepeatNums: 0,
           repeatPhone: [],
           errorRows: 0,
           spinning: true
         })
         let fileReader = new FileReader(); // 图片上传，读图片
         let file = files.file; // 获取到上传的对象
         let _this = this;
         fileReader.onload = (function (file) {
           requestData(file).then(res => {
             _this.setState({
               spinning: false
             })
             if(res.data.code === 0){
               message.success('导入成功')
               const dataMsg = JSON.parse(res.data.msg)
               _this.setState({
                 newCampaignNums: dataMsg.newCampaignNums,
                 countNums: dataMsg.countNums,
                 newClueNums: dataMsg.newClueNums,
                 clueRepeatNums: dataMsg.clueRepeatNums,
                 repeatPhone: splitArr(dataMsg.repeatPhone, 8),
                 errorRows: dataMsg.errorRows
               })
             }else if(res.data.code === 1){
               message.error(res.data.msg)
             }else {
               message.error('导入失败')
             }
           });

         })(file);
         fileReader.readAsDataURL(file); // 读取完毕，显示到页面
     };

    //获取学科下拉列表
    getSubjectListFn = ()=>{
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

    componentWillUnmount() {
      this.searchReset()
    }


    // 全部重置
    searchReset = () => {
        this.setState({
            searchValue: null,
            orderTypeValue: undefined,
            orderStatusValue: undefined,
            orderDate: undefined,
            platformValue:undefined,
            subjectValue:undefined
        });
        customCondition.search = null;
        customCondition.startTime = null;
        customCondition.endTime = null;
    };

    render() {
        const { subjectList,
          orderDate,
          platformList,
          newCampaignNums,
          countNums,
          newClueNums,
          clueRepeatNums,
          repeatPhone,
          errorRows,
          spinning
        } = this.state;


        const menus = [
            {
                path: '/app/dashboard/analysis',
                name: '首页'
            },
            {
                path: '#',
                name: '线索I/O'
            },
            {
                path: '/app/export/index',
                name: '线索I/O'
            }
        ];
        return (
            <div className="ordercenter-order">
                <div className="page-nav">
                    <BreadcrumbCustom paths={menus}/>
                    <p className="title-style">线索I/O</p>
                </div>
                <Card bordered={false}>
                  <Divider>导出功能</Divider>
                    <Row className="my-user-search" gutter={16}>
                        <Col sm={2} style={{textAlign: 'right', width: '65px', marginTop: '5px'}}>
                            <span>日期：</span>
                        </Col>
                        <Col sm={6} style={{padding: 0}} id="order_status_select">
                            <LocaleProvider locale={zh_CN}>
                                <RangePicker
                                    value={orderDate}
                                    onChange={this.handleRangePicker}
                                    style={{width: '100%'}}
                                />
                            </LocaleProvider>
                        </Col>
                        <Col sm={4} style={{marginTop: '5px', width: '100px'}}>
                          <span>所属学科：</span>
                        </Col>
                        <Col sm={4} style={{padding: 0, marginRight: '25px'}} id="refund_status_select">
                          <Select
                            mode="multiple"
                            showSearch
                            placeholder='请选择'
                            onChange={this.subjectChange}
                            style={{width: '100%'}}
                            getPopupContainer={() => document.getElementById('refund_status_select')}
                          >
                            {subjectList && subjectList.map((value, index) => <Option key={index} value={value.key}>{value.value}</Option>)}
                          </Select>
                        </Col>
                        <Col sm={4} style={{marginTop: '5px', width: '100px'}}>
                          <span>选择平台：</span>
                        </Col>
                        <Col sm={4} style={{padding: 0, marginRight: '25px'}} id="refund_status_select">
                          <Select
                            mode="multiple"
                            showSearch
                            placeholder='请选择'
                            onChange={this.platformChange}
                            style={{width: '100%'}}
                            getPopupContainer={() => document.getElementById('refund_status_select')}
                          >
                            {platformList && platformList.map((value, index) => <Option key={index} value={value.key}>{value.value}</Option>)}
                          </Select>
                        </Col>
                    </Row>
                    <Row gutter={16} style={{marginBottom:'20px',marginTop: '20px'}}>
                        <Col className="" sm={13} style={{marginBottom: '20px'}}>
                            <Button type="primary" style={{marginRight: '12px', marginLeft: '10px'}}
                                    onClick={this.searchUser} disabled={this.state.disableBtn}>导出</Button>

                            <Button type="primary" onClick={this.searchReset}
                                    disabled={this.state.resetBtn}>全部重置</Button>
                        </Col>

                        <Divider>导入功能</Divider>
                        <Col className="" sm={13}  style={{marginTop: '20px'}}>

                          <Upload
                              accept=".xls,.xlsx"
                              customRequest={this.uploadCourseThumbnail}
                              beforeUpload={this.beforeUploadCourseThumbnail}
                          >
                          <Button type="upload" style={{marginRight: '12px', marginLeft: '10px'}}
                            disabled={this.state.disableBtn}>导入</Button>
                          </Upload>
                          <a href={require('./xls/template.xlsx')} download>下载导入模版</a>
                          <div style={{marginLeft: '10px',marginTop:'10px'}}>
                            <div className="">
                              <p>总解析条数 {countNums}</p>
                              <p>新推广名称成功数 {newCampaignNums}</p>
                              <p>新推广线索成功数 {newClueNums}</p>
                              <p>推广线索重复数 {clueRepeatNums}</p>
                              <div style={{marginBottom:'10px'}}>线索重复手机号 {
                                  repeatPhone && repeatPhone.map((item,index) => {
                                    return <p style={{marginBottom:'0px'}} key={index}>{item.join(',')}</p>
                                  })
                                }</div>
                              <p style={{color: '#f00'}}>错误数量 {errorRows}</p>
                            </div>
                          </div>
                        </Col>

                    </Row>
                </Card>
                <div style={{display: spinning ? 'block' : 'none'}} className="spin-box">
                  <Spin className="spin" spinning={spinning} size="large" />
                </div>

            </div>
        )
    }
}
