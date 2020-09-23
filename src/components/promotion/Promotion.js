import React from 'react'
import {
  Row,
  Col,
  Button,
  message,
  LocaleProvider,
  Pagination,
  Modal
} from 'antd'
import BreadcrumbCustom from '../common/BreadcrumbCustom'
import ProFormTable from './ProFormTable'
import AddPromo from './AddPromo'
import EditPromo from './EditPromo'
import Surplus from "./Surplus"
import {getPromotionListRematch,getPromotionList, setAllot, changePromotionStatus, createPromotion, campaignEdit, editPromotion} from "../../api/promotionApi";
import {getSubjectList} from "../../api/commonApi";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import {PromotionFilterObj} from "../../utils/filter";

let params = {
    size: 40,
    current: 1
};

// let promotionData = {
//   campaignPlanList: [],
//   name: undefined,
//   platform: undefined
// }
export default class Promotion extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      promoVisible: false,
      engineVisible: false,
      editVisible: false,
      dataSource: [],
      loading: true,
      dataAll: '',
      editCam: [],
      subjectSelect: [],
      subjectList:[],
      editCampaign: [],
      moneyEdit: false,
      allotId: 0,
      campaignId: 0,
      code: 0,
      editProBtn: false,
      platformId: 'BAIDU',
      amountId: undefined,
      campaignCode:''
    }
  }


// 改变页码
  onChangePage = (page, pageSize) => {
    params.size = pageSize;
    params.current = page;
    this.setState({
      loading:true
    })
    this.getPromotionListFn();
  };
  // 改变每页条数
  onShowSizeChange = (current, pageSize) => {
    params.size = pageSize;
    params.current = current;
    this.setState({
      loading:true
    })
    this.getPromotionListFn();
  };
  showTotal = (total) => {
      return `共 ${total} 条数据`;
  };

  componentDidMount() {
    // this.getRefundRecordListFn()
    this.getPromotionListFn()
    this.getSubjectListFn()
  }

  getPromotionListFn = () => {
    getPromotionList(params).then(res => {
      if(res.data.code === 0){
        this.setState({
          dataSource:res.data.data.records,
          loading: false,
          dataAll:res.data.data
        });
      }
    })
  }

  // getPromotionListFn = () => {
  //   getPromotionList(params).then(res => {
  //     console.log(res,'getPromotionList')
  //     if(res.data.code === 0){
  //       this.setState({
  //         dataSource:res.data.data.records,
  //         loading: false,
  //         dataAll:res.data.data
  //       });
  //     }
  //   })
  // }
  //获取学科-by zljiang
  getSubjectListFn = ()=>{
    getSubjectList().then(res=>{
      if(res.data.code == 0){
        this.setState({
          subjectList:res.data.data
        })
      }
    })
  };

  // // 获取学科
  // getSubjectsSelectFn = () => {
  //   getSubjectsSelect(params).then(res => {
  //     if(res.data.code === 0) {
  //       this.setState({
  //         subjectSelect: res.data.data
  //       })
  //     }
  //   })
  // }

  //获取推广列表
  // getRefundRecordListFn = () => {
  //     getBillList(params).then(res => {
  //         if (res.data.code == 0) {
  //             this.setState({
  //                 dataSource: res.data.data.records,
  //                 dataAll: res.data.data,
  //                 loading: false,
  //                 disableBtn: false,
  //                 resetBtn: false
  //             })
  //         } else {
  //             message.error(res.data.msg)
  //             this.setState({
  //                 loading: false
  //             })
  //         }
  //     }).catch(err => {
  //         console.log(err)
  //         this.setState({
  //             loading: false
  //         })
  //     })
  // };

  onSubmitEngine = () => {
    let that = this;
    this.refs.engineSubmit.validateFieldsAndScroll((err, values) => {
      if(!err){
        const {campaignCode} = this.state
        setAllot({
          allotId: values.engine,
          code:campaignCode
        }).then(res => {
          console.log(res,'engineSubmit')
          if(res.data.code === 0) {
            message.success('新建成功')
            this.getPromotionListFn()
            that.handleCancel();
          }else {
            that.setState({
                addBillBtnState: false
            });
            message.error(res.data.msg)
          }
        }).cache(err => {
            that.setState({
                addBillBtnState: false
            });
        })
      }
    })
  }

  getRadioFn = (e) => {
    // this.props.form.resetFields();
    this.setState({
      platformId: e.target.value
    })
  }
  // 新增推广
  onSubmitForm = () => {
      let that = this;
      this.refs.btSubmit.validateFieldsAndScroll((err, values) => {
          if (!err) {
              const {platformId} = this.state

              let paramsData = {
                campaignPlanList: [],
              }
              let arr = []
              for (let i in values) {
                let o = {}
                o[i] = values[i]
                arr.push(o)
              }
              let newArr =arr.slice(0,2)
              let objArr = arr.slice(2)
              objArr.map(obj => {
                paramsData.campaignPlanList.push(PromotionFilterObj(obj))
              })
              paramsData.name = newArr[0].promoname
              paramsData.subjects = newArr[1].subjects
              paramsData.platform = platformId
              createPromotion(paramsData).then(res => {
                if(res.data.code === 0){
                  message.success('新建成功')
                  that.handleCancel();
                  that.getPromotionListFn();
                } else {
                  message.error(res.data.msg)
                }
              }).catch(err => {
                console.log(err)
              })
          }
      });
  };

  subjectNameToId = (name)=>{
    let data = this.state.subjectList;
    for (let i=0;i<data.length;i++){
      if(data[i].name == name){
        return data[i].id
      }
    }
  };

  // 编辑推广
  onEditSubmit = () => {
      let that = this;
      this.refs.editSubmit.validateFieldsAndScroll((err, values) => {
          if (!err) {
              this.setState({
                editProBtn:true
              })
              const {platformId, campaignId, code} = this.state
              console.log(values.platformId,'values.placement')
              let paramsData = {
                campaignPlanList: [],
              }
              let arr = []
              for (let i in values) {
                let o = {}
                o[i] = values[i]
                arr.push(o)
              }
              let newArr =arr.slice(0,2)
              let objArr = arr.slice(2)
              objArr.map(obj => {
                paramsData.campaignPlanList.push(PromotionFilterObj(obj))
              })
              paramsData.name = newArr[0].promoname
              paramsData.subjects = typeof newArr[1].subjects == 'number' ? newArr[1].subjects : this.subjectNameToId(newArr[1].subjects);
              paramsData.platform = platformId
              paramsData.id = campaignId
              paramsData.code = code
              editPromotion(paramsData).then(res => {
                this.setState({
                  editProBtn:false
                })
                console.log(res,'createPromotionres')
                if(res.data.code === 0){
                  message.success('编辑成功')
                  that.handleCancel();
                  that.getPromotionListFn();
                } else {
                  message.error(res.data.msg)
                }
              }).catch(err => {
                console.log(err)
              })
          }
      });
  };

  addBillBtn = () => {
    this.setState({
      promoVisible: true
    })
  }
  handleCancel = () => {
      this.setState({
          promoVisible: false,
          moneyEdit: false,
          engineVisible: false,
          editVisible: false
      });
  };

  // 分配引擎确认
  editCampaign = (campaignId, code) => {
    this.setState({
      editVisible: true,
      code,
      campaignId
    })

    campaignEdit(campaignId).then(res => {
      if(res.data.code === 0){
        console.log(res,'.data.platform')
        this.setState({
          editCam: res.data.data.data,
          platformEdit: res.data.data.data.platform,
          platformId:res.data.data.data.platform
        })
      }
    })
  }


  editEngineClick = (campaignCode) => {
    console.log(campaignCode,'allotId')
    this.setState({
      engineVisible: true,
      campaignCode
    })
  }
  //编辑money按钮操作
  editMoneyClick = (key) => {
      this.setState({
          moneyEdit: true,
          amountId: key
      })
  };

  handleSurCancel = () => {
    this.setState({
        moneyEdit: false
    });
    this.getPromotionListFn()
  }

  onDelete = (id, status) => {
    console.log(`${id}+:${status}`);
    let data = {
      id:id,
      status:status == 0 ? 1 :0
    };
    changePromotionStatus(data).then(res=>{
      this.setState({
          loading: true
      });
      if(res.data.code === 0){
        console.log('chengong')
        this.getPromotionListFn()
      }
    }).catch(err=>{
      console.log(err)
    })
}

  // editMoneyClick = (key) => {
  //     this.setState({
  //         moneyEdit: true
  //     },()=>{
  //         this.child.setformdata(key)
  //     })
  // };


  // index.js-invoice
  render() {
    const {campaignCode,subjectList,editCam, Visible, dataSource, loading, subjectSelect, promoVisible, engineVisible, moneyEdit, allotId, campaignId, editVisible} = this.state
    console.log(campaignId,'createTimellll')
    const menus = [
      {
        path: '/app/dashboard/analysis',
        name: '首页'
      },
      {
        path: '#',
        name: '推广管理'
      },
      {
        path: '#',
        name: '推广列表'
      }
    ];
    return (
      <div className="launch-list">
        <div className="page-nav">
          <BreadcrumbCustom paths={menus}/>
          <p className="title-style">推广列表</p>
          <div className="viplist-top-box">
              <Row gutter={24}>
                  <Col span={18}>
                      <p className="viplist-descript">管理所有线索的渠道来源</p>
                  </Col>
              </Row>
          </div>
        </div>
        <div className="formBody">
          <Row className="finace-bills-add">
            <Button onClick={this.addBillBtn} type="primary">新建推广</Button>
          </Row>
          <Row>
            <ProFormTable
              dataSource={dataSource}
              checkChange={this.checkChange}
              editMoneyClick={this.editMoneyClick}
              editEngineClick={this.editEngineClick}
              onDelete={this.onDelete}
              editCampaign={this.editCampaign}
              loading={loading}
              subjectList={this.state.subjectList}
            />
          </Row>
          <Row>
            <div style={{overflow: 'hidden'}}>
                <LocaleProvider locale={zh_CN}>
                    <Pagination showSizeChanger onShowSizeChange={this.onShowSizeChange}
                                onChange={this.onChangePage}
                                total={this.state.dataAll.total}
                                showTotal={this.showTotal.bind(this.state.dataAll.total)}
                                current={params.current}
                                defaultPageSize={40}
                    />
                </LocaleProvider>
            </div>
          </Row>
          <LocaleProvider locale={zh_CN}>
            <Modal
              title="创建推广"
              className="Add-modals"
              okText="确定"
              cancelText="取消"
              visible={promoVisible}
              destroyOnClose={true}
              style={{top: '80px'}}
              footer={[
                  <button onClick={this.handleCancel} type="button" className="ant-btn">取消</button>,
                  <button disabled={this.state.addBillBtnState} onClick={this.onSubmitForm} type="button"
                          className="ant-btn ant-btn-primary">确定</button>
              ]}
              onOk={this.onSubmitForm}
              onCancel={this.handleCancel}
            >
              <div>
                <AddPromo key="addPromo" modalFlag="promotion"
                   getRadioFn={this.getRadioFn}
                    platformId={this.state.platformId}
                     subjectSelect={subjectSelect}

                          ref="btSubmit"/>
              </div>
            </Modal>
          </LocaleProvider>
          <LocaleProvider locale={zh_CN}>
            <Modal
              title="编辑推广"
              className="Add-modals"
              okText="确定"
              cancelText="取消"
              visible={editVisible}
              destroyOnClose={true}
              style={{top: '80px'}}
              footer={[
                  <button onClick={this.handleCancel} type="button" className="ant-btn">取消</button>,
                  <button disabled={this.state.editProBtn} onClick={this.onEditSubmit} type="button"
                          className="ant-btn ant-btn-primary">确定</button>
              ]}
              onOk={this.onEditSubmit}
              onCancel={this.handleCancel}
            >
              <div>
                <EditPromo key="editPromo" editCam={editCam} subjectList={subjectList}
                          ref="editSubmit"/>
              </div>
            </Modal>
          </LocaleProvider>
          <LocaleProvider locale={zh_CN}>
            <Modal
              title="配置分配引擎"
              className="Add-modals"
              okText="确定"
              cancelText="取消"
              visible={engineVisible}
              destroyOnClose={true}
              style={{top: '80px'}}
              footer={[
                  <button onClick={this.handleCancel} type="button" className="ant-btn">取消</button>,
                  <button disabled={this.state.addBillBtnState} onClick={this.onSubmitEngine} type="button"
                          className="ant-btn ant-btn-primary">确定</button>
              ]}
              onOk={this.onSubmitEngine}
              onCancel={this.handleCancel}
            >
              <div>
                <AddPromo modalFlag="engine"
                  subjectSelect={subjectSelect}
                  allotId={allotId}
                  campaignCode={campaignCode}
                          ref="engineSubmit"/>
              </div>
            </Modal>
          </LocaleProvider>
          <Surplus visible={moneyEdit} title="更新本次剩余金额" onCancel={this.handleSurCancel} sellerId={this.state.amountId}></Surplus>

        </div>
      </div>
    )
  }
}
