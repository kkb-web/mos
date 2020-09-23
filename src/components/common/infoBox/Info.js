import React from 'react'
import {Form, LocaleProvider, Modal} from 'antd'
import InfoForm from './InfoForm'
import './Info.less'

import zh_CN from "antd/lib/locale-provider/zh_CN";

const HOC = (WraperCom) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        name: 'haichen',
        labelNames: [
          {
            id: 1,
            name: 'UnionID',
            required: false,
            message: '',
            value: null,
            placeholder: '',
            disabled: true,
            code:'d-UnionID'
          },
          {
            id: 2,
            name: '微信昵称',
            required: false,
            message: '',
            value: null,
            placeholder: '',
            disabled: true,
            code:'d-nickName'
          },
          {
            id: 3,
            name: '微信号',
            required: false,
            message: '',
            value: null,
            placeholder: '',
            disabled: false,
            code:'d-wechatId'
          },
          {
            id: 4,
            name: '手机号',
            required: false,
            message: '',
            value: null,
            placeholder: '',
            disabled: true,
            code:'d-mobile'
          },
          {
            id: 5,
            name: '表单姓名',
            required: false,
            message: '',
            value: null,
            placeholder: '',
            disabled: true,
            code:'d-name'
          },
        ],
        businessFormItem:[],
        behavior: [
          {
            "description": "看得很认真",
            "time": 1564383400
          },
          {
            "description": "点击很多次",
            "time": 1564383410
          },
          {
            "description": "点击jdds多次",
            "time": 1564342410
          },
          {
            "description": "看得很认真",
            "time": 1564383400
          },
          {
            "description": "点击很多次",
            "time": 1564383410
          },
          {
            "description": "点击jdds多次",
            "time": 1564342410
          },
          {
            "description": "看得很认真",
            "time": 1564383400
          },
          {
            "description": "点击很多次",
            "time": 1564383410
          },
          {
            "description": "点击jdds多次",
            "time": 1564342410
          },
          {
            "description": "点击jdds多次",
            "time": 1564342410
          },
          {
            "description": "看得很认真",
            "time": 1564383400
          },
          {
            "description": "点击很多次",
            "time": 1564383410
          },
          {
            "description": "点击jdds多次",
            "time": 1564342410
          }
        ]
      }
    }

    componentDidMount() {
      this.handData();
    }

    handData = () => {
      let data = this.props.dataSource;
      let labelNames = this.state.labelNames;
      labelNames[0].value = data.unionId;
      labelNames[1].value = data.nickname;
      labelNames[2].value = data.wechatId;
      labelNames[3].value = data.mobile;
      labelNames[4].value = data.name;
      this.setState({
        labelNames: labelNames
      });
    };

    render() {
      const {labelNames, behavior} = this.state;
      const { dataSource,baseFormItem, businessFormItem,InfoBoxType,objId,markList} =this.props;
      let data = dataSource;

      let labelName = labelNames;
      labelName[0].value = data.unionId;
      labelName[1].value = data.nickname;
      labelName[2].value = data.wechatId;
      labelName[3].value = data.mobile;
      labelName[4].value = data.name;
      if(labelName[2].value !== null){
        labelName[2].disabled = true;
      } else {
        labelName[2].disabled = false;
      }
      const allData = labelName;
      return <WraperCom markList={markList} objId={objId} InfoBoxType={InfoBoxType} baseFormItem={baseFormItem} businessFormItem={businessFormItem} labelNames={allData} behavior={allData.behavior} xId={this.props.xId} clueId={this.props.clueId} {...this.props}/>
    }
  }
}

export default HOC(InfoForm)
