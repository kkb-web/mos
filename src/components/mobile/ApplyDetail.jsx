import {Component} from "react";
import React from "react";
import {setTitle} from "../../utils/filter";
import {getOrderUserDetail} from "../../api/userCenterApi";
import {message} from "antd";
import './ApplyDetail.less'

// 查找第n个字符的位置
const findStr = (str, charStr, num) => {
    let position = str.indexOf(charStr);
    for(let i = 0; i < num; i++){
        position = str.indexOf(charStr, position + 1);
    }
    return position;
};

export default class ApplyDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            orderId: this.props.match.params.orderId,
            id: this.props.match.params.id,
            detailData: {},
            details: []
        };
    }

    // 获取详情
    getDetail = () => {
        console.log(this.state.id, this.state.orderId);
        getOrderUserDetail({
            id: this.state.id,
            outOrderId: this.state.orderId
        }).then(res => {
            if (res.data.code === 0) {
                let value = res.data.data;
                console.log(value, "======用户详情");
                this.setState({
                    detailData: value,
                    details: value.questions ? value.questions : []
                });
            } else {
                message.error(res.data.msg)
            }
        });
    };

    componentDidMount() {
        this.getDetail();
        setTitle('报名信息');
    }

    render () {
        let {detailData, details} = this.state;
        return(
            <div style={{width: '100%', minHeight: '100%', background: 'rgb(238, 247, 248)', padding:'20px 0'}}>
                <div className="detail-content_mobile">
                    <div className="detail-item_mobile">
                        <p className="detail-title_mobile">用户姓名</p>
                        <p className="detail-text_mobile">{detailData.username ? detailData.username : '/'}</p>
                    </div>
                    <div className="detail-item_mobile">
                        <p className="detail-title_mobile">手机号</p>
                        <p className="detail-text_mobile">{detailData.mobile ? detailData.mobile : '/'}</p>
                    </div>
                    <div className="detail-item_mobile">
                        <p className="detail-title_mobile">微信昵称</p>
                        <p className="detail-text_mobile">{detailData.nickname ? detailData.nickname : '/'}</p>
                    </div>
                    {details && details.map((value, index) =>
                        <div className="detail-item_mobile" key={index}>
                            <p className="detail-title_mobile">{value.questionKey}</p>
                            <p className="detail-text_mobile">{value.questionValue}</p>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}
