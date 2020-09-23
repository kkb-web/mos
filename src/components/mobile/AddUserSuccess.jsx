import {Component} from "react";
import React from "react";
import {Link} from "react-router-dom";
import {setTitle} from "../../utils/filter";
import './Index.less';

export default class AddUserSuccess extends Component{
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
        setTitle('添加成功');
    }

    render () {
        return(
            <div style={{width: '100%', minHeight: '100%', background: '#EEF7F8'}}>
                <div className="result_bg_dd success_bg_dd">
                    <img src="https://img.kaikeba.com/kkb_cms_dingtalk_add_success_icon01.png" alt=""/>
                    <p>操作成功</p>
                </div>
                <div className="result_bottom_dd">
                    <p className="result_content_dd">如该用户已成单，点击底部的“创建订单”</p>
                    <Link to='/order/add'><p className="result_button_dd">直接创建订单</p></Link>
                </div>
            </div>
        )
    }
}
