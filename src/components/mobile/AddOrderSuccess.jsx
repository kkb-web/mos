import {Component} from "react";
import React from "react";
import {setTitle} from "../../utils/filter";
import './Index.less'

export default class AddOrderSuccess extends Component{
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.location.id,
        };
    }

    componentDidMount() {
        setTitle('创建成功');
    }

    pushApply = () => {
        this.props.history.push({
            pathname: '/order/add/apply',
            id: this.state.id
        })
    };

    render () {
        return(
            <div style={{width: '100%', minHeight: '100%', background: '#EEF7F8'}}>
                <div className="result_bg_dd success_bg_dd">
                    <img src="https://img.kaikeba.com/kkb_cms_dingtalk_add_success_icon01.png" alt=""/>
                    <p>操作成功</p>
                </div>
                <div className="result_bottom_dd">
                    <p className="result_content_dd">如该用户已成单，点击底部按钮获取报名表</p>
                    <p onClick={this.pushApply} className="result_button_dd">获取报名表</p>
                </div>
            </div>
        )
    }
}
