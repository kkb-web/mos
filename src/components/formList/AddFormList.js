import React,{ Component } from 'react'
import {Form, Button, Card, Modal, Row, Col, Input, Checkbox, Table, message, InputNumber, Select, Icon} from 'antd';
import BreadcrumbCustom from '../common/BreadcrumbCustom'
import {getToken} from '../../utils/filter'
import { addForm } from '../../api/formListApi'
// import OptionList from './Option'
const FormItem = Form.Item
const {TextArea} = Input;
const Option = Select.Option;

const userName = getToken('realname')
const roleId = getToken('roleId')
let params = {
  name:'',
  remark: '',
  createBy: roleId,
  createName: userName,
  questions: []
}
let formItemId = 1
let mySel = {}
class AddFormList extends Component {
  constructor(props){
    super(props)
    this.state = {

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
      newSel: [
        {
          id: 1,
          sort: 1,
          title: '',
          type: 1,
          isRequired: 1,
          options: [
          ]
        }
      ],
      sortArr: [],
      selectValue: '',
      subjects: '',
      sel:{},
      optionArr: [{
        sort:1,
        num:0
      }],
      desState: '',
      desHint: ''
    }
  }

  componentDidMount() {
    this.getNewSel()
  }

  handleRowNum = (e) => {
  }

  topicChange = (item,e) => {
    const { newSel,sel } = this.state
    for (let i of newSel) {
      if(i.sort === item){
        i.type = e
      }
    }
    this.setState({
      newSel
    })
  }


  ipChange = v => {
    this.setState({
      subjects: v
    })
  }

  addContent = (sort) => {
    const { newSel,optionArr } = this.state

    let num = 1
    for(let i of optionArr) {
      if(i.num === num){
        ++num
      }
    }
    const newKeys = optionArr.concat({sort:sort,num:num})
                             .filter(i => i.sort === sort)

    for (let k of newSel){
      let o = {}
      if(k.sort === sort){
        for(let c of newKeys){
          o.sort = c.sort
          o.num = c.num
        }
        k.options.push(o)
      }
    }
    this.setState({
      newSel,
      optionArr: newKeys
    })
  }

  minusContent = (k,s) => {
    const { newSel } = this.state
    this.setState({
      newSel: newSel.map(i => {
        return i.sort === s ? {...i,options: i.options.filter(n => n.num !== k)} : i
      })
    })
  }

  getNewSel = () => {
    const { newSel } = this.state
    let sortNew = []
    for(let i of newSel) {
      sortNew.push(i.sort)
    }
    this.setState({
      sortArr: sortNew
    })
  }

  addRowOption = () => {
    const { newSel } = this.state
    let num = 1
    for(let i of newSel) {
      if(i.sort === num){
        num++
      }
    }

    newSel.push({
      sort: num,
      title: '',
      type: 1,
      isRequired: 1,
      options: []
    })

    this.setState({
      newSel: newSel.sort((a,b) => a.sort - b.sort)
    })
  }

  minusRowOption = (f) => {
    const { newSel } = this.state
    if(newSel.length === 1) return
    const sel = newSel.filter(form => form.sort !== f).sort((a,b) => a.sort - b.sort)
    this.setState({
      newSel: sel
    })
  }

  optChange = (opts,num) => {
    let optArr = []
    // const nOpt = opts.filter(o => Number(o.split('_')[0]) === Number(num))
    for(let i in opts) {
      if(Number(i.split('_')[0]) === Number(num)) {

        optArr.push({option:opts[i]})
      }
    }
    return optArr
  }

  handleSubmit = () => {
    const { form: { validateFieldsAndScroll } } = this.props;
    validateFieldsAndScroll((err,values) => {
      if(err)return
      const options = values.option;
      const keys = Object.keys(values).filter(item => item.indexOf('-') > -1)
      let newObj = {}
      let opts = []
      let target = [];
      for(let i in values) {
        if(i.indexOf('-') > -1) {
          newObj[i] = values[i]
        }
      }

      let newOpt = {}
      for(let k in options) {
        newOpt[k] = options[k]
      }

      const keysNew = Object.keys(newObj);
      const rowKeys = keysNew.filter(i => i.indexOf("rowNum") > -1);
      rowKeys.forEach(item => {
        const [name, num] = item.split("-");
        const option = this.optChange(newOpt,num)
        let sel = `selectValue-${num}`;
        let sub = `subject-${num}`;
        target.push({
          sort: newObj[item],
          type: newObj[sel],
          title: newObj[sub],
          isRequired: 1,
          options: option
        });
      });

      params.questions = target
      params.name = values.roleName
      params.remark = values.roleDes
      this.addFormFn(params)

    })
  }

  addFormFn = (params) => {
    addForm(params).then(res => {
      if(res.data.code === 0){
        message.success(`生成表单成功，创建人${userName}`)
        this.props.history.push('/app/form/index')
      }else {
        message.error('表单创建失败');
      }
    })
  }

  remarkCheck = (e) => {
    if (e.target.value.length > 50) {
        this.setState({
            desState: 'error',
            desHint: '描述不得超过50字'
        })
    } else if (e.target.value.length === 0) {
        this.setState({
            desState: '',
            desHint: ''
        })
    } else {
        this.setState({
            desState: 'success',
            desHint: ''
        })
    }
  };

  renderOption = (keys,sort) => {
    const {getFieldDecorator} = this.props.form;
    return keys.map((key,index) => {

    return <FormItem
        label={`选项`}
        key={key.num}
      >
        {
          getFieldDecorator(`option[${key.sort}_${key.num}]`, {
            rules: [{required: true, message: '不能为空'}]
          })(
            <Input style={{width: '160px'}} placeholder="输入选项"/>
          )
        }
        {
          keys.length > 0 ? (
            <Icon style={{marginTop: '14px',cursor: 'pointer'}} onClick={this.minusContent.bind(this,key.num,key.sort)} type="minus-circle" />
          ) : null
        }
      </FormItem>
    })
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const { newSel,subjects,selectList } = this.state

    getFieldDecorator('keys', { initialValue: [] })
    getFieldDecorator('formItem', { initialValue: [] })

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

    return (
        <div className="launch-list">
          <div className="page-nav">
              <BreadcrumbCustom paths={menus}/>
              <p className="title-style">新建表单</p>
          </div>

          <Card title="表单主体信息" style={{marginBottom: 24}} bordered={false}>
              <Form layout="horizontal" style={{paddingBottom: '20px'}}>
                  <FormItem className="open-course-form" label="表单标题" validateStatus={this.state.titleState}
                            help={this.state.titleHint} {...FormItemLayout} hasFeedback>
                      {getFieldDecorator('roleName', {
                          rules: [{required: true, message: '标题不能为空'}],
                      })(
                          <Input placeholder="输入表单名称，用户可见" onChange={this.titleCheck} onBlur={this.checkRole}/>
                      )}
                  </FormItem>
                  <FormItem className="open-course-form" label="表单描述（可选）" validateStatus={this.state.desState}
                            help={this.state.desHint} {...FormItemLayout} hasFeedback>
                      {getFieldDecorator('roleDes', {
                          rules: [{required: false}],
                      })(
                          <TextArea placeholder="用于展示在表单标题下，用户可见" rows={4} onBlur={this.remarkCheck} onChange={this.remarkCheck}/>
                      )}
                  </FormItem>
              </Form>
          </Card>
          <Card title="表单详情" style={{marginBottom: 24}} bordered={false}>
            {
              newSel && newSel.map((item,index) => {

                return <Form key={item.sort} layout="inline">
                  <Row>
                  <Col sm={3}>

                    <FormItem label="序号">
                      {
                        getFieldDecorator(`rowNum-${item.sort}`, {
                          rules: [{required: true, message: '不能为空'}],
                          initialValue: item.sort || 1
                        })(
                          <InputNumber
                            key={item.sort}
                            min={1}
                            placeholder="序号"
                            style={{width: '60px'}}
                            />
                        )
                      }
                    </FormItem>
                  </Col>
                  <Col sm={5}>
                    <FormItem label="题目">
                      {
                        getFieldDecorator(`subject-${item.sort}`, {
                          rules: [{required: true, message: '不能为空'}],
                          initialValue: subjects || ''
                        })(
                          <Input key={item.sort} placeholder="输入标题，如姓名"/>
                        )
                      }

                    </FormItem>
                  </Col>
                  <Col sm={4}>
                    <FormItem label="题目类型">
                      <div id={`topic-type${index}`} style={{width: '130px'}}>
                        {
                          getFieldDecorator(`selectValue-${item.sort}`, {
                            rules: [{required: true, message: '不能为空'}],
                            initialValue: item.type
                          })(
                            <Select
                              key={index}
                              showSearch
                              getPopupContainer={() => document.getElementById(`topic-type${index}`)}
                              placeholder="题目类型"
                              onChange={this.topicChange.bind(this,item.sort)}
                            >
                              {selectList && selectList.map((topic,index) => <Option value={topic.id} key={`topic${topic.id}`}>{topic.name}</Option>)}
                            </Select>
                          )
                        }
                      </div>
                    </FormItem>
                  </Col>
                  {
                    item.type !== 1 && <Col sm={5}>
                     <FormItem label={`选项`}>
                       {
                         getFieldDecorator(`option[${item.sort}_0]`, {
                           rules: [{required: true, message: '不能为空'}],
                           initialValue: ''
                         })(
                           <Input style={{width: '160px'}} placeholder="输入选项" key={item.sort}/>
                         )
                       }

                     </FormItem>
                     <Icon style={{marginTop: '14px',marginLeft: '-16px',cursor: 'pointer'}} onClick={this.addContent.bind(this,item.sort)} type="plus-circle"></Icon>
                      {this.renderOption(item.options,item.sort)}

                   </Col>
                  }

                  <Col sm={3}><FormItem>
                    <Button type="primary" style={{marginRight: '10px'}} onClick={this.addRowOption}>添加</Button>
                    <Button onClick={(sort) => this.minusRowOption(item.sort)}>删除</Button>
                  </FormItem></Col>
                </Row></Form>
              })
            }
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
    )
  }
}
const CollectionCreateForm = Form.create()(AddFormList);
export default CollectionCreateForm;
