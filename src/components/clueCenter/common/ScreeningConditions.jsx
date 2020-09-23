import React from 'react';
import "./../common.less";
import {Col, Select} from "antd";

const Option = Select.Option;
export default class Screen extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    const {value,labelName,placeholder,list,onChange,onSearch} = this.props;
    return (
      <div>
        <Col sm={2} style={{marginTop: '5px', width: '70px'}}>
          <span>{labelName}：</span>
        </Col>
        <Col sm={5} style={{padding: 0, marginRight: '25px'}} id="refund_status_select">
          <Select
            showSearch
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            onSearch={onSearch}
            style={{width: '100%'}}
            filterOption={(input, option) => {
              return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            }
            getPopupContainer={() => document.getElementById('refund_status_select')}
          >
            {list && list.map((value, index) => <Option key={index} value={value.key}>{value.value}</Option>)}
          </Select>
        </Col>
      </div>
    )
  }
}
