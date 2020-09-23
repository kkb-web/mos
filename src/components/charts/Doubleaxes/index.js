import React from "react";
import {
    G2,
    Chart,
    Geom,
    Axis,
    Tooltip,
    Coord,
    Label,
    Legend,
    View,
    Guide,
    Shape,
    Facet,
    Util
} from "bizcharts";
import "./index.less"

class Doubleaxes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chartIns:null   //chart实例
        };
    }
    render() {
        let that = this;
        let { charts } = this.props;
        let items = [
            {
                value: "销售额",
                marker: {
                    symbol: "square",
                    fill: "rgb(132, 196, 251)",
                    radius: 5
                }
            },
            {
                value: "订单量",
                marker: {
                    symbol: "hyphen",
                    stroke: "rgb(123, 210, 132)",
                    radius: 5,
                    lineWidth: 3
                }
            }
        ];
        const scale = {
            call: {
                min: 0
            },
            销售额: {
                min: 0,
            },
            订单量: {
                min: 0,
            }
        };
        return (
            <div className="sale-chart">
                <Chart
                    height={charts.height}
                    padding={['auto',50,'auto',70]}
                    scale={scale}
                    forceFit
                    data={charts.data}
                    onGetG2Instance={chart => {
                        chart.animate(true);
                        that.setState({
                            chartIns:chart
                        })
                    }}
                >
                    <Legend
                        custom={true}
                        allowAllCanceled={true}
                        items={items}
                        onClick={ev => {
                            const item = ev.item;
                            const value = item.value;
                            const checked = ev.checked;
                            const geoms = this.state.chartIns.getAllGeoms();
                            for (let i = 0; i < geoms.length; i++) {
                                const geom = geoms[i];
                                if (geom.getYScale().field === value) {
                                    if (checked) {
                                        geom.show();
                                    } else {
                                        geom.hide();
                                    }
                                }
                            }
                        }}
                    />
                    <Axis
                        name="订单量"
                        grid={null}
                        label={{
                            textStyle: {
                                fill: "rgb(123, 210, 132)"
                            }
                        }}
                    />
                    <Tooltip />
                    <Geom type="interval" position="time*销售额" color="rgb(132, 196, 251)" />
                    <Geom
                        type="line"
                        position="time*订单量"
                        color="rgb(123, 210, 132)"
                        size={3}
                        shape="smooth"
                    />
                    <Geom
                        type="point"
                        position="time*订单量"
                        color="rgb(123, 210, 132)"
                        size={3}
                        shape="circle"
                    />
                </Chart>
            </div>
        );
    }
}

export default Doubleaxes;