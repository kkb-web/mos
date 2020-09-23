import {Component} from "react";
import React from "react";
import {message, Spin} from "antd";
import {setTitle} from "../../utils/filter";
import {getPosterMobile} from "../../api/orderCenterApi";

export default class GetApplyTable extends Component{
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.location.id,
            loading: true,
            img: ''
        };
    }

    // 获取海报
    getPoster = () => {
        getPosterMobile(this.state.id).then(res => {
            if (res.data.code === 0) {
                this.setState({
                    img: res.data.data.img,
                    loading: false
                })
            } else {
                message.error(res.data.msg)
            }
        })
    };

    componentDidMount() {
        this.getPoster();
        setTitle('长按保存报名表');
        console.log(this.state.id);
    }



    render () {
        let {loading, img} = this.state;
        return(
            loading ?
                <Spin style={{width: '100%', margin: '200px auto'}} size="large"/> :
                <img src={img} style={{width: '100%'}} alt=""/>
        )
    }
}
