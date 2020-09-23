import React from 'react'
import BreadcrumbCustom from '../../../common/BreadcrumbCustom'
import { Table, Input, Button, Popconfirm, Form, Select, Icon, Modal, Card, Checkbox, message, Divider } from 'antd';
import './Marketing.less';
import { getSubjectList } from '../../../../api/commonApi';
import { findSellers } from '../../../../api/subjectApi';
import { addSellerqrCodes, checkSellerqrCodes, editSellerqrCodesWeight, removeSellerqrCodes, editSellerqrCodesSetting } from '../../../../api/vipCourseApi';
import qs from 'qs';
const { Option } = Select;
const { Meta } = Card;

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} 不能省略`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input style={{width: "100%"}} ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 0 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      !editable ? <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td> : <td {...restProps} style={{width: "200px"}}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

class Marketing extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '二维码',
        dataIndex: 'qrCode',
        render: (text,record) => {
         return (
           <img src={"https://img.kaikeba.com/"+record.qrCode} style={{width: '51px', height: '51px'}}/>
         ) 
        }
      },
      {
        title: '权重',
        dataIndex: 'weight',
        editable: true
      },
      {
        title: 'PV',
        dataIndex: 'pv',
      },
      {
        title: 'UV',
        dataIndex: 'uv',
      },
      {
        title: '页面长按',
        dataIndex: 'press',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          const changeText = (type, text,isjust) => {
            if (isjust) {
              let c = Object.assign({},this.state.optionText,{
                [type] : {
                  value: text,
                  textNull: this.state.optionText[type]['textNull']
                }
              });
              this.setState({
                optionText: c
              });
              return;
            }
            let c = Object.assign({},this.state.optionText,{
              [type] : {
                value: text,
                textNull: text ? false : true
              }
            });
            this.setState({
              optionText: c
            });
            console.log(this.state.optionText);
          };
          const setOptionText = () => {
            let item = this.state.stRecords;
            setTimeout(() => {
              // console.log(this.state.optionText);
              if (!this.state.optionText.title.value || !this.state.optionText.des.value || !this.state.optionText.tip.value) {
                let filterDemo = Object.entries(this.state.optionText).filter(item => {
                  console.log(item);
                  return !item[1].value || item[1].value === '';
                });
                // console.log(filterDemo);
                filterDemo.forEach(item => {
                  let c = {
                    [item[0]]: {
                      value: this.state.optionText[item[0]]['value'],
                      'textNull': true
                    }
                  };
                  this.setState({
                    optionText: Object.assign({},this.state.optionText,c)
                  });
                });
                return;
              }
              editSellerqrCodesSetting(item.id,qs.stringify({
                title:this.state.optionText.title.value,
                description: this.state.optionText.des.value,
                bottom: this.state.optionText.tip.value
              })).then(() => {
                this.setState({
                  showText: false
                });
                message.success("添加成功");
                this.getDataResource();
              });
            }, 500);
          }
          return (
            this.state.dataSource.length >= 1 ? (
              <section>
                <a onClick={() => {let item = record;this.setState({stRecords:item});this.setOptionText(item);}}>配置文案</a>
                <Modal title="配置文案"
                       visible={this.state.showText}
                       onCancel={() => {
                         this.setState({
                           showText: false
                         });
                         this.setState({stRecords:null});
                       }}
                       onOk={() => {
                         setOptionText()
                       }}
                >
                  <div className="optionText">
                    主题：
                    <div style={{width: '300px',display: 'inline-block'}}>
                      <Input
                        placeholder="不超过30个字"
                        onBlur={(text) => {
                          changeText('title',text.target.value);
                        }}
                        value={this.state.optionText.title.value}
                        onChange={(text) => {
                          changeText('title',text.target.value,'just')
                        }}
                      />
                    </div>
                    {this.state.optionText.title.textNull ? <span style={{marginLeft: "15px"}} className="tipText">请填写此项</span> : ''}
                  </div>
                  <div className="optionText">
                    描述：
                    <div style={{width: '300px',display: 'inline-block'}}>
                      <Input
                        placeholder="不超过30个字"
                        onBlur={(text) => {
                          changeText('des',text.target.value);
                        }}
                        value={this.state.optionText.des.value}
                        onChange={(text) => {
                          changeText('des',text.target.value,'just')
                        }}
                      />
                    </div>
                    {this.state.optionText.des.textNull? <span style={{marginLeft: '15px'}} className="tipText">请填写此项</span> : ''}
                  </div>
                  <div className="optionText">
                    备注：
                    <div style={{width: '300px',display: 'inline-block'}}>
                      <Input
                        placeholder="不超过30个字"
                        onBlur={(text) => {
                          changeText('tip',text.target.value);
                        }}
                        value={this.state.optionText.tip.value}
                        onChange={(text) => {
                          changeText('tip',text.target.value,'just')
                        }}
                      />
                    </div>
                    {this.state.optionText.tip.textNull ? <span style={{marginLeft: '15px'}} className="tipText">请填写此项</span> : ''}
                  </div>
                </Modal>
                <Divider type="vertical" />
                <Popconfirm
                  title="确定删除?"
                  cancelText="取消"
                  okText="确定"
                  onConfirm={() => this.handleDelete(record.id)}
                >
                  <a>删除</a>
                </Popconfirm>
              </section>
            ) : null
          )
        }
      },
    ];

    this.state = {
      dataSource: [],
      count: 2,
      modalVisible: false,
      subjects:[],
      CheckBoxs:[],
      checkBoxsSelected: [],
      CheckBoxsSource:[],
      setOptionText: false,
      optionText:{
        title: {
          value: '',
          textNull: false
        },
        tip: {
          value: '',
          textNull: false
        },
        des: {
          value: '',
          textNull: false
        }
      },
      offsetHeight: 0,
      pagination: {}
    };
    getSubjectList().then(data => {
      this.setState({
        subjects: [{
          id: null,
          name: '请选择学科'
        },...data.data.data]
      });
    });
    this.getDataResource();
  }

  setOptionText(record) {
    this.setState({
      showText: true,
      optionText: {
        title: {
          value: record.title,
          textNull: false
        },
        tip: {
          value: record.bottom,
          textNull: false
        },
        des: {
          value: record.description,
          textNull: false
        }
      }
    });
  }

  handleDelete = key => {
    removeSellerqrCodes({
      id: key
    }).then(() => {
      this.getDataResource(5,1);
    });
  };
  
  getDataResource(size = 5,current = 1) {
    checkSellerqrCodes({
      size,
      current,
      "descs": [
        "create_time"
      ],
      condition:{"class_id":this.props.classId}
    }).then(result => {
      this.setState({
        pagination: {
          current: current,
          pageSize: size,
          total: result.data.data.total,
          showTotal: (total) => {
            return `共${total}条数据`;
          }
        }
      });
      this.setState({
        dataSource: result.data.data.records
      });
    });
  }

  handleSave = row => {
    console.log(row);
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
    const formDate = new FormData();
    formDate.append("weight",row.weight);
    editSellerqrCodesWeight(row.id, qs.stringify({weight:row.weight}));
  };
  
  handleTableChange = (pagination, filters, sorter) => {
    this.getDataResource(pagination.size,pagination.current);
  };

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    /**
     * 返回课程页面
     */
    const setClassRender = () => {
      this.props.setClassRender(true);
    };
    /**
     * 关闭图片选择
     */
    const cancleHandler = () => {
      this.setState({modalVisible: false})
    }
    // subject 列表
    const subjects = this.state.subjects.map(item => <Option key={item.name+item.id} value={item.id}>{item.name}</Option>);
    const setCheckBoxs = CheckBoxs => {
      return CheckBoxs.map(item => 
        <Checkbox value={item.id} key={item.id} defaultChecked={false}>
          <Card
            hoverable
            cover={<img alt={item.qrCode} src={"https://img.kaikeba.com/" + item.qrCode} style={{height: '200px', width: '200px'}} />}
            style={{height1: "250px", width: "200px"}}
          >
            {item.imei}
          </Card>
        </Checkbox>
      )
    };
    const showqrCode = value => {
      let params = {
        "size": 160,
        "current": 1,
        "descs": [
          "createTime"
        ],
        "ascs": [],
        "condition": {
          "subjectId": value, // 根据学科ID查询
          "hasSales": 1  // 是否配置销售，不填返回所有，1：返回配置了的，0，返回没有配置的
        }
      };
      this.setState({
        subjectId: value
      });
      findSellers(params).then(data => {
        if (!data || !data.data || !data.data.data) {
          message.info("请求错误");
        }else{
          setTimeout(() => {
            this.setState({
              CheckBoxs: setCheckBoxs(data.data.data.records),
            });
            this.setState({
              CheckBoxsSource: data.data.data.records,
            });
            this.setState({
              checkBoxsSelected: []
            });
          },0);
        }
      })
    };
    const handlerSetSellers = () => {
      let paramsForm = [];
      this.state.checkBoxsSelected.forEach(item => {
        let pic = this.state.CheckBoxsSource.find(qrcode => {
           return qrcode.id === item;
        });
        if (!pic) {
          console.log(this.state.CheckBoxsSource,item);
          return;
        }
        paramsForm.push({
          classId: this.props.classId,
          qrCode: pic.qrCode,
          salesId: pic.usersid,
          sellerId: item,
          weight: 10,
          subjectNum: this.state.subjectId,
          title: '进行课程激活',
          description: '长按二维码识别添加老师领取学习地址',
          bottom: '发送添加请求后将会在12小时通过'
        })
      });
      addSellerqrCodes(paramsForm).then(result => {
        cancleHandler();
        this.getDataResource();
        if (result.data.code !==0 ){
          message.warn(result.data.msg) 
        }
      });
    };
    return (
      <div className='editable-table'>
        <span onClick={setClassRender} style={{margin: "15px",cursor: 'pointer'}}>
          <Icon type="left" />
          返回
        </span>
        <Select placeholder='请选择学科' style={{width: '150px', marginRight: '15px', marginBottom: '15px'}} onChange={showqrCode}>
          {subjects}
        </Select>
        {this.state.subjectId?<Button type="primary" onClick={() => {
          setTimeout(() => {
            if (!this.state.CheckBoxsSource || this.state.CheckBoxsSource.length === 0) {
              message.warn("当学科程未设置营销号");
              return;
            }
            this.setState({modalVisible: true})
          },15)}}>添加营销号</Button>: <Button type="primary" disabled>添加营销号</Button>}
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={this.state.dataSource}
          columns={columns}
          locale={{emptyText: "暂无数据"}}
          size={this.state.dataSource.size}
          pagination={this.state.pagination}
          rowKey={record => record.id}
          onChange={this.handleTableChange}
        />
        <div
          style={{background: "rgba(0,0,0,0.5)",position: 'fixed',top: 0, left: 0, width: "100%", height: "100%",display: this.state.modalVisible ? "block" : "none",zIndex:"1000"}}
        >
          <div
            style={{height: this.state.CheckBoxsSource.length >=5 ? "85%" : "51%",overflow: 'hidden',display: this.state.modalVisible ? "flex" : "none",width:"61%",flexDirection:"column"}}
            className="classNamemodal"
          >
            <div className="classNamemodaltitle">
              选择营销号
            </div>
            <div style={{height: "85%",paddingLeft:"25px",flexGrow: 1,flexBasis: 0,overflowY:"auto"}}>
              <Checkbox.Group value={this.state.checkBoxsSelected} className="checkqrCode" onChange={(value) => {
                this.setState({
                  checkBoxsSelected: value
                })
              }}>
                <div style={{width: '100%', maxHeight:'100%',overflowY: 'auto',marginBottom: "60px",overflowX: "hidden"}}>
                  {this.state.CheckBoxs}
                </div>
              </Checkbox.Group>
            </div>
            <footer style={{width: '100%'}}>
              <Button type="default" style={{marginRight: '150px'}} onClick={cancleHandler}>取消</Button>
              <Button type="primary" onClick={handlerSetSellers}>确定</Button>
            </footer>
          </div>
        </div>
      </div>
    );
  }
}

export default Marketing;
