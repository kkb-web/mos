import React,{ Component } from 'react'
import {Form, Button, Card, Modal, Row, Col, Input, Checkbox, Table, message, InputNumber, Select, Icon} from 'antd';
import BreadcrumbCustom from '../common/BreadcrumbCustom'
import {getToken} from '../../utils/filter';
const FormItem = Form.Item
const {TextArea} = Input;
const Option = Select.Option;
let formItemArr = [];
let formItemId = 1;
let inputId = 1;

const userName = getToken('realname')
const roleId = getToken('roleId')
let params = {
  name:'',
  remark: '',
  createBy: roleId,
  createName: userName,
  questions: []
}

class AddFormList extends Component {
  constructor(props){
    super(props)
    this.state = {
      rowNum: 1,
      subjects: '',
      selectList: [
        {
          id: 1,
          name: '填空题'
        },
        {
          id: 2,
          name: '下拉选择题'
        },
        {
          id: 3,
          name: '单选题'
        },
        {
          id: 4,
          name: '多选题'
        }
        // {
        //   id: 5,
        //   name: '多行输入框'
        // },
        // {
        //   id: 6,
        //   name: '时间'
        // }
      ],
      selectValue: 1,
      formItemArr: [],
      options: [],
      option: {
        option: ''
      },
      rowArr: [],
      demo: [1,2,3,4,5,6,7,8],
      newSel: [
        {
          sort: 1,
          title: '',
          type: 1,
          isRequired: 1,
          options: []
        }
      ],
      selValueList: [{
  			"sort": 1,//问题序号
  			"title": "您的姓名",//问题标题
  			"type": 1,//类型 1.input 2.select 3.单选 4.多选 5.text 6.时间
  			"isRequired": 1//是否必填
  		},
  		{
  			"sort": 2,
  			"title": "是否有过培训经历",
  			"type": 3,
  			"isRequired": 1,
  			"options": [{//选项集合
  					"option": "是"
  				},
  				{
  					"option": "否"
  				}
  			]
  		},
  		{
  			"sort": 3,
  			"title": "民族",
  			"type": 2,
  			"isRequired": 1,
  			"options": [{
  					"option": "汉族"
  				},
  				{
  					"option": "满族"
  				},
  				{
  					"option": "朝鲜族"
  				}
  			]
  		}]
    }
  }

  componentDidMount() {

  }

  handleRowNum = (e) => {
    console.log(e,'e')
    // console.log(i,'num')
    // this.setState({
    //   rowNum: i
    // })
  }

  topicChange = item => {

    return v => {
      // const { form } = this.props
      // const values = form.getFieldsValue()
      // const keys = Object.keys(values).filter(item => item.indexOf('-') > -1)
      // let newObj = {}
      // let target = [];
      // for(let i in values) {
      //   if(i.indexOf('-') > -1) {
      //     newObj[i] = values[i]
      //   }
      // }
      //
      // const keysNew = Object.keys(newObj);
      // let selValueList = []
      // const rowKeys = keysNew.filter(i => i.indexOf("rowNum") > -1);
      //
      // rowKeys.forEach(item => {
      //   const [name, num] = item.split("-");
      //   let sel = `selectValue-${num}`;
      //   let sub = `subject-${num}`;
      //   selValueList.push({
      //     sort: newObj[item],
      //     type: newObj[sel]
      //   })
      // });
      item.type = v;

      this.setState({
      })
      params.questions.push({type: v})
    }

  }




  ipChange = v => {
    this.setState({
      subjects: v
    })
  }

  addContent = () => {
    const { form } = this.props
    const keys = form.getFieldValue('keys')
    const newKeys = keys.concat(formItemId++)
    form.setFieldsValue({
      keys: newKeys
    })
  }

  minusContent = k => {
    const { form } = this.props
    const keys = form.getFieldValue('keys')
    if(keys.length === 0 ) return
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    })
  }


  addRowOption = () => {
    const { rowArr,newSel } = this.state
    rowArr.push(formItemArr++)
    newSel.push({
      sort: 1,
      title: '',
      type: 1,
      isRequired: 1,
      options: []
    })
    this.setState({
      rowArr,
      newSel
    })



  }

  minusRowOption = (f,e) => {
    const { rowArr } = this.state
    if(rowArr.length === 0) return
    this.setState({
      rowArr: rowArr.filter(form => form !== f)
    })
  }

  handleSubmit = () => {
    const { form: { validateFieldsAndScroll } } = this.props;

    validateFieldsAndScroll((err,values) => {

      console.log(values,'values-haichen')
      const keys = Object.keys(values).filter(item => item.indexOf('-') > -1)
      let newObj = {}
      let target = [];
      for(let i in values) {
        if(i.indexOf('-') > -1) {
          newObj[i] = values[i]
        }
      }

      const keysNew = Object.keys(newObj);
      const rowKeys = keysNew.filter(i => i.indexOf("rowNum") > -1);

      rowKeys.forEach(item => {
        const [name, num] = item.split("-");
        let sel = `selectValue-${num}`;
        let sub = `subject-${num}`;
        target.push({
          sort: newObj[item],
          type: newObj[sel],
          title: newObj[sub],
          isRequired: 1,
          options: []
        });
      });
      //
      // this.setState({
      //   selValueList
      // })

      console.log(target,'targettargettarget')
    })
  }


  render() {
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const { rowNum, subjects, selectValue, selectList, formItemArr,demo,rowArr,selValueList } = this.state
    getFieldDecorator('keys', { initialValue: [] })
    getFieldDecorator('formItem', { initialValue: [] })

    const keys = getFieldValue('keys')
    const formItem = keys.map((key,index) => (
      <FormItem
        label={`选项${index+2}`}
        required={false}
        key={key}
      >
        {
          getFieldDecorator(`option[${key}]`, {

          })(
            <Input style={{width: '160px'}} placeholder="输入选项" onChange={this.ipChange}/>
          )
        }
        {
          keys.length > 0 ? (
            <Icon style={{marginTop: '14px'}} onClick={() => this.minusContent(key)} type="minus-circle" />
          ) : null
        }
      </FormItem>
    ))

    const itemDemo = rowArr.map(item => {
      const rowId = item+1
      return <Form key={rowId} layout="inline"><Row key={rowId}>
        <Col xs={3}>
          {rowId}
          <FormItem label="序号">
            {
              getFieldDecorator(`rowNum-${rowId}`, {
                initialValue: rowNum || 1
              })(
                <InputNumber
                  key={rowId}
                  min={1}
                  placeholder="序号"
                  style={{width: '60px'}}
                  />
              )
            }

          </FormItem>
        </Col>
        <Col xs={5}>
          <FormItem label="题目">
            {
              getFieldDecorator(`subject-${rowId}`, {
                initialValue: subjects || ''
              })(
                <Input key={rowId} placeholder="输入标题，如姓名"/>
              )
            }

          </FormItem>
        </Col>
        <Col xs={5}>
          <FormItem label="题目类型">
            <div id={`topic-type${rowId}`} style={{width: '150px'}}>
              {
                getFieldDecorator(`selectValue-${rowId}`, {
                  initialValue: selectValue
                })(
                  <Select
                    key={rowId}
                    showSearch
                    getPopupContainer={() => document.getElementById(`topic-type${rowId}`)}
                    placeholder="题目类型"
                    onChange={this.topicChange(item)}
                  >
                    {selectList && selectList.map((topic,index) => <Option value={topic.id} key={`topic${topic.id}`}>{topic.name}</Option>)}
                  </Select>
                )
              }

            </div>
          </FormItem>
        </Col>
        {
          selValueList && selValueList.map(s => {

            s.sort === rowId && s.type !==1 && <Col xs={5}>
              <FormItem label={`选项${inputId}`}>
                {
                  getFieldDecorator(`option-${rowId}`, {
                    initialValue: ''
                  })(
                    <Input style={{width: '160px'}} placeholder="输入选项" key={rowId}/>
                  )
                }

              </FormItem>
              <div>{s.sort} {rowId} {s.type}</div>
              <Icon style={{marginTop: '14px',marginLeft: '-16px'}} onClick={this.addContent} type="plus-circle"></Icon>
              {formItem}
            </Col>
          })
        }

        <Col xs={3}><FormItem>
          <Button type="primary" style={{marginRight: '10px'}} onClick={this.addRowOption}>添加</Button>
          <Button onClick={(e) => this.minusRowOption(item,e)}>删除</Button>
        </FormItem></Col>
    </Row></Form>
    })
    const menus = [
      {
        path: '/app/dashboard/analysis',
        name: '首页'
      },
      {
        path: '#',
        name: '表单工具'
      },
      {
        path: '/app/form/index',
        name: '表单列表'
      },
      {
        path: '#',
        name: '新建表单'
      }
    ]
    const FormItemLayout = {
        labelCol: {span: 7},
        wrapperCol: {span: 16},
    };
    return <div className="launch-list">
            <div className="page-nav">
                <BreadcrumbCustom paths={menus}/>
                <p className="title-style">新建表单</p>
            </div>

            <Card title="表单主体信息" style={{marginBottom: 24}} bordered={false}>
                <Form layout="horizontal" style={{paddingBottom: '20px'}}>
                    <FormItem className="open-course-form" label="表单标题" validateStatus={this.state.titleState}
                              help={this.state.titleHint} {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('roleName', {
                            rules: [{required: false, message: '角色名称不能为空'}],
                        })(
                            <Input placeholder="输入表单名称，用户可见" onChange={this.titleCheck} onBlur={this.checkRole}/>
                        )}
                    </FormItem>
                    <FormItem className="open-course-form" label="表单描述（可选）" validateStatus={this.state.desState}
                              help={this.state.desHint} {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('roleDes', {
                            rules: [{required: false}],
                        })(
                            <TextArea placeholder="用于展示在表单标题下，用户可见" rows={4} onChange={this.desCheck}/>
                        )}
                    </FormItem>
                </Form>
            </Card>
            <Card title="表单详情" style={{marginBottom: 24}} bordered={false}>
              <Form layout="inline">

                <Row>
                  <Col xs={3}>
                    <FormItem label="序号">
                      {
                        getFieldDecorator('rowNum-0', {
                          initialValue: rowNum || 1
                        })(
                          <InputNumber
                            min={1}
                            placeholder="序号"
                            style={{width: '60px'}}
                            />
                        )
                      }

                    </FormItem>
                  </Col>
                  <Col xs={5}>
                    <FormItem label="题目">
                      {
                        getFieldDecorator('subject-0', {
                          initialValue: subjects || ''
                        })(
                          <Input placeholder="输入标题，如姓名"/>
                        )
                      }
                    </FormItem>
                  </Col>
                  <Col xs={5}>
                    <FormItem label="题目类型">
                      <div id="topic-type" style={{width: '150px'}}>
                        {
                          getFieldDecorator('selectValue-0' ,{
                            initialValue: selectValue
                          })(
                            <Select
                              showSearch
                              getPopupContainer={() => document.getElementById('topic-type')}
                              placeholder="题目类型"
                            >
                            {selectList && selectList.map((topic,index) => <Option value={topic.id} key={`topic${topic.id}`}>{topic.name}</Option>)}
                            </Select>
                          )
                        }

                      </div>
                    </FormItem>
                    {selectValue}
                  </Col>
                  {
                    selectValue !== 1 && <Col xs={5}>
                      <FormItem label={`选项${inputId}`}>
                        {
                          getFieldDecorator('option[0]',{
                            initialValue: ''
                          })(
                            <Input style={{width: '160px'}} placeholder="输入选项"/>
                          )
                        }

                      </FormItem>
                      <Icon style={{marginTop: '14px',marginLeft: '-16px'}} onClick={this.addContent} type="plus-circle"></Icon>
                      {formItem}
                    </Col>
                  }

                  <Col xs={3}><FormItem>
                    <Button type="primary" style={{marginRight: '10px'}} onClick={this.addRowOption}>添加</Button>
                    <Button onClick={this.minusRowOption}>删除</Button>
                  </FormItem></Col>
                </Row>

              </Form>
              {itemDemo}
            </Card>
            <div className="upload-title bottom-btn">
                <Button type="default" style={{marginRight: '20px'}} onClick={this.handleCancel}>取消</Button>
                <Modal
                    title="提示"
                    okText="确定"
                    cancelText="取消"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleTipCancel}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                </Modal>
                <Button disabled={this.state.disableBtn} type="primary" onClick={this.handleSubmit}>提交</Button>
            </div>
          </div>
  }
}
const CollectionCreateForm = Form.create()(AddFormList);
export default CollectionCreateForm;
