import React from 'react';
import "./../common.less";
import {Button, Col, Input} from "antd";

export default class Screen extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    const {searchReset,searchUser,labelName,placeholder,value,onChange,searchDisableBtn,resetDisableBtn} = this.props;
    return (
      <div>
        <Col sm={2} style={{marginTop: '5px', width: '70px'}}>
          <span>{labelName}：</span>
        </Col>
        <Col sm={5} style={{padding: '0'}}>
          <Input autoComplete="off" value={value} onChange={onChange}
                 onPressEnter={searchUser} placeholder={placeholder}/>
        </Col>
        <Col sm={9}>
          <Button type="primary" style={{marginRight: '12px', marginLeft: '25px'}}
                  onClick={searchUser} disabled={searchDisableBtn}>查询</Button>
          <Button type="default" onClick={searchReset}
                  disabled={resetDisableBtn}>全部重置</Button>
        </Col>
      </div>
    )
  }
}
