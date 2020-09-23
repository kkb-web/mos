import React, { Component } from 'react';
import './Form.less';
import {Button, InputNumber, Icon } from 'antd';

let bool = true;

export default class Selector extends Component{
    constructor(props) {
        super(props);
        this.state = {
            disable: true,
            minValue: 0,
            maxValue: 0
        }
    }

    // 渲染
    componentDidMount() {
        document.querySelector('body').onclick = () => {
            let listAll = document.querySelectorAll('.list');
            for (let i = 0; i < listAll.length; i++) {
                listAll[i].style.display = 'none';
            }
            bool = true
        }
    }

    // 显示下拉列表
    showList = (name) => {
        console.log(name, bool);
        if (bool) {
            document.querySelector('.list.' + name).style.display = 'block';
            bool = false
        } else {
            document.querySelector('.list.' + name).style.display = 'none';
            bool = true
        }
    };

    // 获取自定义部分的最小值
    minValue = (name, value) => {
        this.setState({
            minValue: value
        })
    };

    // 获取自定义部分的最大值
    maxValue = (name, value) => {
        this.setState({
            maxValue: value
        })
    };

    render () {
        const {name, dataSource, buttonTxt, chooseValue, valueOk} = this.props;
        return (
            <div id="space" className="space" style={{display: 'inline', position: 'relative'}}>
                <Button style={{color: 'rgba(0, 0, 0, 0.65)'}} onClick={this.showList.bind(this, name)}>{buttonTxt.replace(/_/g,"-")}<Icon type="down" theme="outlined" style={{fontSize: '14px', color: 'rgba(0, 0, 0, 0.25)'}} /></Button>
                <div className={"list " + name} style={{width: '350px'}}>
                    <ul>
                        {
                            dataSource && dataSource.map((value, index) => {
                                return (<li key={index} onClick={() => chooseValue(value, name)}>{value.value.replace(/_/g,"-")}</li>)
                            })
                        }
                        <li>
                            自定义：
                            <InputNumber id="min" min={0} onClick={this.showList.bind(this, name)} onChange={this.minValue.bind(this, name)}/> ~ <InputNumber onClick={this.showList.bind(this, name)} min={0} onChange={this.maxValue.bind(this, name)}/>
                            <Button type="primary" style={{marginLeft: '10px'}} onClick={() => valueOk(this.state.minValue, this.state.maxValue, name)}>确定</Button>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}
