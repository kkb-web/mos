import React from "react";
import {
    Chart,
    Geom,
    Axis,
    Tooltip,
    Legend
} from "bizcharts";
import './index.less'
import DataSet from "@antv/data-set";
class Curved extends React.Component {
    render() {
        const {charts,sellerNames} = this.props;
        const ds = new DataSet();
        const dv = ds.createView().source(charts.data);
        dv.transform({
            type: "fold",
            fields:sellerNames ,
            // 展开字段集
            key: "name",
            // key字段
            value: "number" // value字段
        });
        let cols = {};
        if(charts.maxNumber < 5){
            cols = {
                number: {
                    min: 0,
                    max:5,
                    nice: true,
                    range: [0, 1],
                    tickCount: 6
                }
            }
        }else {
            cols = {
                number: {
                    min: 0,
                    nice: true,
                    range: [0, 1]
                }
            }
        }
        return (
            <div className="sale-charts">
                <Chart padding={['auto',10,'auto',50]} height={400} data={dv} scale={cols} forceFit>
                    <Legend/>
                    <Axis name="time"/>
                    <Axis
                        name="number"
                        label={{
                            formatter: val => `${val}`
                        }}
                    />
                    <Tooltip
                        crosshairs={{
                            type: "y"
                        }}
                    />
                    <Geom
                        type="line"
                        position="time*number"
                        size={2}
                        color={"name"}
                        shape={"smooth"}
                    />
                    <Geom
                        type="point"
                        position="time*number"
                        size={4}
                        shape={"circle"}
                        color={"name"}
                        style={{
                            stroke: "#fff",
                            lineWidth: 1
                        }}
                    />
                </Chart>
            </div>
        )
    };
}

export default Curved;
