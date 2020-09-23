import React, { Component } from 'react'
import {
  Form,
  Row,
  Col,
  InputNumber,
  Input,
  Icon
} from 'antd'
const FormItem = Form.Item
const {TextArea} = Input;
const Option = Select.Option;


class OptionList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      select:[]
    }
  }

  render() {
    return (
      <Form key={rowId} layout="inline">
        <Row key={rowId}>
        <Col xs={3}>
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
                    onChange={this.topicChange.bind(this)}
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
    )
  }
}
const CollectionCreateForm = Form.create()(OptionList);
export default CollectionCreateForm;
