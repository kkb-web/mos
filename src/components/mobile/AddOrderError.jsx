import {Component} from "react";
import React from "react";
import {Link} from "react-router-dom";
import {setTitle} from "../../utils/filter";
import './Index.less'

export default class AddOrderError extends Component{
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
        setTitle('创建失败');
    }

    render () {
        return(
            <div style={{width: '100%', minHeight: '100%', background: '#EEF7F8'}}>
                <div className="result_bg_dd error_bg_dd">
                    <img src="https://img.kaikeba.com/kkb_cms_dingtalk_add_success_icon02.png" alt=""/>
                    <p>操作失败</p>
                </div>
                <div className="result_bottom_dd">
                    <p className="result_content_dd">操作失败了，可截图向管理员反馈</p>
                    <Link to='/order/add'><p className="result_button_dd">点击重试</p></Link>
                </div>
            </div>
        )
    }
}
