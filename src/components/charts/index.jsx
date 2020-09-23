import React from 'react';
import Doubleades from './Doubleaxes/index';
import {getChartData} from "../../utils/filter";

class media extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            charts:{
                data: [],
                height: 317,
                padding: [],
                scale: {},
            }
        };
    }

    //渲染
    componentDidMount() {
        this.changeData('week')
    };

    //页面离开
    componentWillUnmount(){

    };

    changeData = (date) => {
        let array = [],
            order = 1,
            sales = 10000;
        for (let i = 0; i < getChartData(date).length;i++){
            array.push({
                time: getChartData(date)[i],
                call: 13,
                销售额: sales += 10000,
                订单量: order += 100
            })
        }
        let chartData = this.state.charts;
        chartData.data = array;
        this.setState({
            charts:chartData
        })
    };

    render() {
        return (
            <div>
                <div>
                    <span onClick={this.changeData.bind(this, 'year')}>年</span>
                    <span onClick={this.changeData.bind(this, 'month')}>月</span>
                    <span onClick={this.changeData.bind(this, 'week')}>周</span>
                    <span onClick={this.changeData.bind(this, 'day')}>日</span>
                </div>
                <Doubleades
                    charts={this.state.charts}
                />
            </div>
        )
    }
}

export default media;