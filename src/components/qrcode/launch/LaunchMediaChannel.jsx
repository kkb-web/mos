import React from 'react';
import {Form, InputNumber, Card, Select, Row, Button} from 'antd';
import {getSelectInfo, addQrcode, deleteQrcode, modifyWeight, getMarktList} from '../../../api/marketApi';
import FormTable from "./LaunchChannelTable";
import './LaunchMediaChannel.less'

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
            adId: this.props.adId,    //广告id
            loading: false,
            subject: [],            //学科编号option
            SelectData: [],         //销售选框option
            salesdata: [],          //销售选框选中数据
            inputval: undefined,    //营销号选框选中的值
            showsalesvalue: undefined,   //销售选框选中的值
            salesvalue: undefined,
            salesId: '',             //销售id
            subjectvalue: '',       //学科编号选中值
            weightvalue: '10',      //权重
            salesflag: false,       //销售验证开关
            subjectflag: false,     //学科编号验证开关
            dataflag: false,
            textMark: '请选择营销号',//学科编号验证文案
            dataSource: [],           //表格数据
        }
    }

    isEmpty = (param) => {
        if (param == null || typeof (param) == "undefined" || param == '' || param == 'undefined') {
            return true;
        }
        return false;
    };
    //添加营销号
    onsubmit = () => {
        let subjectvalue = this.state.inputval; //学科id
        let data = this.state.subjectvalue;
        if (this.isEmpty(this.state.salesvalue)) {
            this.setState({
                salesflag: true
            })
        } else {
            this.setState({
                salesflag: false
            })
        }
        if (subjectvalue == undefined || data.length == 0) {
            this.setState({
                subjectflag: true,
                textMark: '请选择营销号'
            })
        } else {
            this.setState({
                subjectflag: false
            })
        }
        if (this.state.subject.length == 0 && this.state.dataflag) {
            this.setState({
                textMark: '请先绑定营销号'
            })
        }
        if (!this.isEmpty(this.state.salesvalue) && !this.isEmpty(this.state.subjectvalue) && !this.isEmpty(this.state.weightvalue)) {
            let sellersdata = [];
            let subjectData = this.state.subjectvalue;
            for (let i = 0; i < subjectData.length; i++) {
                sellersdata.push({
                    "sellerId": subjectData[i].key,
                    "subjectNum": subjectData[i].label
                })
            }
            let sendData = {
                adId: parseInt(this.state.adId),
                sellers: sellersdata,
                weight: parseInt(this.state.weightvalue),
                salesId: this.state.salesId
            };
            addQrcode(sendData).then(res => {
                if (res.data.code == 0) {
                    this.setState({
                        showsalesvalue: undefined,
                        inputval: undefined,
                        weightvalue: 10,
                        subject: []
                    });
                    this.getMarktList();
                    this.getSelectInfo();
                }
            }).catch(err => {
                console.log(err, "+++++++++++++")
            })
        }
    };
    //选择销售
    handSalesChange = (value) => {
        console.log(value, "测试搜索")
        //选择销售前，先把营销号选框清空
        this.setState({
            subjectvalue: []
        });
        this.setState({
            showsalesvalue: value,
            inputval: undefined,
            salesvalue: value.label,
            salesId: value.key
        });
        let data = this.state.SelectData;
        let subjectdata = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].salesName == value.label) {
                subjectdata = data[i].subjects;
                allSubjectData = data[i].subjects;
            }
        }
        //添加选择全部的操作;
        // if(!subjectdata.length == 0) {
        //     if(subjectdata[0].sellerId !== 0){
        //         subjectdata.unshift({
        //             "sellerId": 0,
        //             "subjectNum": "全部"
        //         })
        //     }
        //     console.log(subjectdata,"3")
        // }
        this.setState({
            subject: subjectdata
        });
        if (this.isEmpty(value.label)) {
            this.setState({
                salesflag: true,
                dataflag: true
            })
        } else {
            this.setState({
                salesflag: false,
                dataflag: true
            })
        }
    };

    //选择营销号
    // TODO 选择营销号框，选全部的操作还没完成；
    handSubjectChange = (value) => {
        let that = this;
        // let datas = [{key:242,label:"web5-3"},{key:251,label:"web5-55"}];
        // if(value[0].key == 0){
        //     // for (let i = 0;i<allSubjectData.length;i++){
        //     //     if(i>0){
        //     //         datas.push({subjectNum:allSubjectData[i].subjectNum})
        //     //     }
        //     // }
        //     // console.log(datas,"++++++")
        //     this.setState({
        //         inputval:datas
        //     })
        // }else {
        //     that.setState({
        //         inputval: value,
        //         subjectvalue: value
        //     });
        // }

        that.setState({
            inputval: value,
            subjectvalue: value
        });
        //选择营销号验证
        if (value.length == 0) {
            this.setState({
                subjectflag: true
            })
        } else {
            this.setState({
                subjectflag: false
            })
        }
    };
    //营销号选择框获取焦点
    subjectFocus = () => {
        console.log(this.state.subject, "选择啊");
        console.log(this.state.salesvalue, "0");
        if (this.state.showsalesvalue == '' || this.state.showsalesvalue == undefined) {
            this.setState({
                salesflag: true,
            })
        } else {
            if (this.state.subject.length == 0) {
                this.setState({
                    subjectflag: true,
                    textMark: '请先绑定营销号'
                })
            } else {
                this.setState({
                    subjectflag: false
                })
            }
        }
    };

    //获取营销号列表
    getMarktList = () => {
        this.setState({
            loading: true
        });
        applyData.id = this.state.adId;
        getMarktList(applyData).then(res => {
            if (res.data.code == 0) {
                this.setState({
                    dataSource: res.data.data.records,
                    loading: false
                });
            }
        }).catch(err => {

            console.log(err, "urlUserInfo")
        })
    };

    //渲染
    componentDidMount() {
        this.getMarktList();
        this.getSelectInfo();
    };

    //删除二维码
    onDelete = (id) => {
        let sendData = {
            id: id
        };
        deleteQrcode(sendData).then(res => {
            if (res.data.code == 0) {
                this.setState({
                    showsalesvalue: undefined,
                    inputval: undefined,
                    weightvalue: 10,
                    subject: []
                });
                this.getMarktList();
                this.getSelectInfo();
            }
        }).catch(err => {
            console.log(err, "Deleteqrcode")
        });
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
            if (data[i].id == id) {
                this.state.dataSource[i].weight = val;
                this.setState({
                    dataSource: data
                });
            }
        }
    };
    //编辑权重
    editWeight = (val, id) => {
        console.log(val, "失去焦点");
        let values = val.target.value;
        if (values == '') {
            values = 10;
        }
        let sendData = {
            id: id,
            weight: parseInt(values)
        };
        modifyWeight(sendData).then(res => {
            if (res.data.code == 0) {
                this.getMarktList();
            }
        }).catch(err => {
            console.log(err, "editWeight")
        });
    };
    //获取权重信息
    onWeight = (value) => {
        this.setState({
            weightvalue: value
        });
        if (this.isEmpty(value)) {
            this.setState({
                weightvalue: 10
            })
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
        let sendData = {
            id: this.state.adId
        }
        getSelectInfo(sendData).then(res => {
            if (res.data.code == 0) {
                let data = res.data.data;
                let salesdata = [];
                for (let i = 0; i < data.length; i++) {
                    salesdata.push(data[i].salesName)
                }
                this.setState({
                    SelectData: res.data.data,
                    salesdata: salesdata
                });
            }
        }).catch(err => {
            console.log(err)
        })
    };

    render() {
        const {dataSource, loading} = this.state;
        return (
            <div>
                <div className="mediachannel">
                    <Card title="渠道情况" className="mediachannel-card" style={{marginBottom: 24, minHeight: '380px', paddingBottom: '80px'}}
                          bordered={false}>
                        <Row style={{marginBottom: '22px'}} gutter={16}>
                            <div id="media">
                                <Select
                                    showSearch
                                    labelInValue
                                    getPopupContainer={() => document.getElementById('media')}
                                    placeholder="选择销售"
                                    value={this.state.showsalesvalue}
                                    style={{width: '200px', marginRight: '10px', position: 'relative'}}
                                    onChange={this.handSalesChange}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {this.state.SelectData && this.state.SelectData.map(SelectData => <Option
                                        key={SelectData.salesId}>{SelectData.salesName}</Option>)}
                                </Select>
                                <p className="channel-sales-p" style={{display: this.state.salesflag ? 'block' : 'none'}}>请选择销售</p>
                                <Select
                                    labelInValue
                                    getPopupContainer={() => document.getElementById('media')}
                                    placeholder="学科-编号"
                                    mode="multiple"
                                    value={this.state.inputval}
                                    style={{
                                        minWidth: '200px',
                                        marginRight: '10px',
                                        position: 'relative',
                                        whiteSpace: 'nowrap'
                                    }}
                                    onChange={this.handSubjectChange}
                                    onFocus={this.subjectFocus}
                                >
                                    {this.state.subject && this.state.subject.map(subject => <Option
                                        key={subject.sellerId}>{subject.subjectNum}</Option>)}
                                </Select>
                                <p className="channel-subject-p" style={{display: this.state.subjectflag ? 'block' : 'none'}}>{this.state.textMark}</p>
                                <InputNumber className="channel-inputnumber" onChange={this.onWeight} defaultValue="10"
                                             max={100} min={0}
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
                    </Card>
                </div>
            </div>
        );
    }
}

const InformationPage = Form.create()(Information);
export default InformationPage;
