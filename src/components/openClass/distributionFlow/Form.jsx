import React from 'react';
import {Form, InputNumber, Card, Select, Row, Button,message} from 'antd';
import {fssionWightList,modifyWeights,deleteWight,addfssionWight,sellerList} from "../../../api/openCourseApi";
import FormTable from "./FormTable";
import './Form.less'

const Option = Select.Option;
let applyData = {
    size: 100,
    current: 1,
    descs: ['id'],
    asc: [],
    condition: {}
};
let allSubjectData = [];

class Information extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            adId: window.location.pathname.slice(12),    //广告id
            loading: false,
            SelectData: [],         //销售选框option
            salesdata: [],          //销售选框选中数据
            showsalesvalue: undefined,   //销售选框选中的值
            salesvalue: undefined,
            salesId: '',             //销售id
            weightvalue: '10',      //权重
            salesflag: false,       //销售验证开关
            subjectflag: false,     //学科编号验证开关
            dataflag: false,
            textMark: '请选择营销号',//学科编号验证文案
            dataSource: [],           //表格数据
            btnState:false
        }
    }

    //渲染
    componentDidMount() {
        this.getMarktList();
        this.getSelectInfo();
    };

    componentWillReceiveProps(){
        this.getMarktList();
        this.getSelectInfo();
    };

    isEmpty = (param) => {
        if (param == null || typeof (param) == "undefined" || param == '' || param == 'undefined') {
            return true;
        }
        return false;
    };
    //添加营销号
    onsubmit = () => {
        if (this.isEmpty(this.state.salesvalue)) {
            this.setState({
                salesflag: true
            })
        } else {
            this.setState({
                salesflag: false
            })
        }
        if (!this.isEmpty(this.state.salesvalue) && !this.isEmpty(this.state.weightvalue)) {
            let data = [];
            let subjectData = this.state.showsalesvalue;
            for (let i = 0; i < subjectData.length; i++) {
                data.push({
                    "id":"",
                    "sellerId": parseInt(subjectData[i].key),
                    "sellerName":subjectData[i].label,
                    "weight": parseInt(this.state.weightvalue)
                })
            }
            //添加时，删除列表重复添加元素;
            let currentdata = this.state.dataSource;
            for(let i=0;i<currentdata.length;i++){
                for(let j=0 ; j<data.length;j++){
                    if(data[j].sellerId == currentdata[i].sellerId){
                        data.splice(j, 1);
                    }
                }
            }
            let dataSource = [...data,...this.state.dataSource];
            this.setState({
                dataSource: dataSource,
                showsalesvalue: undefined,
                weightvalue: 10,
                salesvalue: []
            });

            let sendData = {
                id: parseInt(this.state.adId),
                data:data
            };
            // console.log(parseInt(this.state.weightvalue))
            // console.log(sendData);
            // addfssionWight(sendData).then(res => {
            //     if (res.data.code == 0) {
            //         this.setState({
            //             showsalesvalue: undefined,
            //             weightvalue: 10,
            //             salesvalue:[]
            //         });
            //         this.getMarktList();
            //         this.getSelectInfo();
            //     }
            // }).catch(err => {
            //     console.log(err, "+++++++++++++")
            // })
        }
    };
    //请求接口保存数据
    onsubmitAll = () =>{
        let dataSource = this.state.dataSource;
        for(let i=0;i<dataSource.length;i++){
            delete dataSource[i].sellerName;
        }
        if(dataSource.length == 0){
            dataSource = [null]
        }
        let sendData = {
            id: parseInt(this.state.adId),
            data:dataSource
        };
        this.setState({
            btnState:true
        });
        addfssionWight(sendData).then(res => {
            if (res.data.code == 0) {
                this.setState({
                    showsalesvalue: undefined,
                    weightvalue: 10,
                    salesvalue:[],
                    btnState:false
                });
                message.success('保存成功')
                this.getMarktList();
                this.getSelectInfo();
            }else {
                message.error('保存失败，请重新保存')
            }
        }).catch(err => {
            message.error('保存失败，请重新保存')
            console.log(err, "+++++++++++++")
        })
    };
    //选择销售
    handSalesChange = (value) => {
        console.log(value);
        let dataKeys = [];
        let dataLabel = [];
        let data = value;
        for (let i=0;i<data.length;i++){
            dataKeys.push(data[i].key);
            dataLabel.push(data[i].label)
        }
        this.setState({
            showsalesvalue: value,
            salesvalue: dataLabel,
            salesId: dataKeys
        });
    };


    //获取营销号列表
    getMarktList = () => {
        this.setState({
            loading: true
        });
        applyData.id = window.location.pathname.slice(12);
        fssionWightList(applyData).then(res => {
            if (res.data.code == 0) {
                this.setState({
                    dataSource: res.data.data,
                    loading: false
                });
            }
        }).catch(err => {

            console.log(err, "urlUserInfo")
        })
    };

    //删除二维码
    onDelete = (id) => {
        console.log(id);
        let dataSource = this.state.dataSource;
        for(let i=0;i<dataSource.length;i++){
            if(dataSource[i].sellerId == id){
                dataSource.splice(i, 1);
                break;
            }
        }
        this.setState({
            dataSource:dataSource
        })
    };

    //编辑权重onchange
    editWeightOnchange = (value, id) => {
        let val = value;
        if (value < 0) {
            val = 10
        }
        if (value > 100) {
            val = 100
        }
        let data = this.state.dataSource;
        for (let i = 0; i < data.length; i++) {
            if (data[i].sellerId == id) {
                this.state.dataSource[i].weight = val;
                this.setState({
                    dataSource: data
                });
            }
        }
    };
    //编辑权重
    editWeight = (val, id) => {
        let values = val.target.value;
        if (values == '') {
            values = 10;
        }
        let dataSource = this.state.dataSource;
        for(let i=0;i<dataSource.length;i++){
            if(dataSource[i].sellerId == id){
                dataSource[i].weight = parseInt(values)
            }
        }
        this.setState({
            dataSource:dataSource
        });


        // let sendData = {
        //     id: id,
        //     weight: parseInt(values)
        // };
        // modifyWeights(sendData).then(res => {
        //     if (res.data.code == 0) {
        //         this.getMarktList();
        //     }
        // }).catch(err => {
        //     console.log(err, "editWeight")
        // });
    };
    //获取权重信息
    onWeight = (value) => {
        let data = value;
        this.setState({
            weightvalue: data
        });
    };
    onWeightBurl = (e)=>{
        if(1 <= e.target.value <= 100){
            console.log('12')
            this.setState({
                weightvalue: e.target.value
            });
        }
        if(e.target.value == ''){
            this.setState({
                weightvalue: 10
            });
        }
    };

    //排序
    changeSore = (dataIndex, record, sorter) => {
        applyData.descs = (sorter.order === "descend" ? [sorter.field] : []);
        applyData.asc = (sorter.order === "ascend" ? [sorter.field] : []);
        // 排序后，恢复排序时，数据应当保持和默认一致；
        let arr = Object.keys(sorter); //此方法为ES6新方法，返回值是对象中属性名组成的数组；
        if (arr.length == 0) {
            applyData.descs = ['id'];
        }
        this.getMarktList()
    };

    //获取级联选框信息
    getSelectInfo() {
        sellerList(window.location.pathname.slice(12)).then(res => {
            if (res.data.code == 0) {
                console.log(res.data.data);
                let data = [];
                let resData = res.data.data;
                // let data = res.data.data;
                // let salesdata = [];
                // for (let i = 0; i < data.length; i++) {
                //     salesdata.push(data[i].salesName)
                // }
                this.setState({
                    SelectData: res.data.data
                });
            }
        }).catch(err => {
            console.log(err)
        })
    };

    render() {
        const {dataSource, loading,weightvalue} = this.state;
        return (
            <div>
                <div className="mediachannel">
                    <Card title="渠道情况" className="mediachannel-card" style={{marginBottom: 24, minHeight: '380px', paddingBottom: '80px'}}
                          bordered={false}>
                        <Row style={{marginBottom: '22px'}} gutter={16}>
                            <div id="media">
                                <Select
                                    mode="multiple"
                                    showSearch
                                    labelInValue
                                    getPopupContainer={() => document.getElementById('media')}
                                    placeholder="选择销售"
                                    value={this.state.showsalesvalue}
                                    style={{width: '300px', marginRight: '10px', position: 'relative'}}
                                    onChange={this.handSalesChange}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {this.state.SelectData && this.state.SelectData.map(SelectData => <Option
                                        key={SelectData.sellerId}>{SelectData.sellerName}</Option>)}
                                </Select>
                                <p className="channel-sales-p" style={{display: this.state.salesflag ? 'block' : 'none'}}>请选择销售</p>
                                <InputNumber className="channel-inputnumber" value={weightvalue} onBlur={this.onWeightBurl} onChange={this.onWeight} defaultValue="10"
                                             max={100} min={1}
                                             style={{width: '200px', marginRight: '25px'}}
                                             placeholder="请填写权重"/>
                                <Button onClick={this.onsubmit} type="primary">确认添加</Button>
                            </div>
                        </Row>
                        <Row style={{margin: '0px'}} gutter={16}>
                            <FormTable
                                dataSource={dataSource}
                                checkChange={this.checkChange}
                                onDelete={this.onDelete}
                                editWeight={this.editWeight}
                                editWeightOnchange={this.editWeightOnchange}
                                changeSore={this.changeSore}
                                loading={loading}
                                id={this.state.tableRowKey}
                            />
                        </Row>
                        <Row style={{textAlign: 'center',marginTop:'20px'}} gutter={16}>
                            <p style={{marginTop:'30px',marginBottom:'10px'}}>添加数据/修改数据之后，只有保存数据才可生效哦，保存之前确保营销号设置无误</p>
                            <Button width={80} onClick={this.onsubmitAll} type="primary">保存数据</Button>
                        </Row>
                    </Card>
                </div>
            </div>
        );
    }
}

const InformationPage = Form.create()(Information);
export default InformationPage;
