import React, { Component } from 'react';
import './Form.less';

import { Row, Col, Input, Button, Select, Pagination, LocaleProvider, message} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';

import CollectionCreateForm from './CustomizedForm';
import FormTable from './FormTable';
import {channelList, getPoster, sellerList, addChannel} from "../../../api/openCourseApi";
import {getToken, openCourseUrl} from "../../../utils/filter";
import {requestData} from "../../../utils/qiniu";
import {getSubjectList, getPublicList} from "../../../api/commonApi";

let originData = '';
let search = false;
let customCondition = {
    name: null,
    sellerId: null,
    code: null
};
let applyData = {
    size: 40,
    current: 1,
    ascs: [],
    descs: ['createTime'],
    condition: customCondition
};

let emojiRule = /([\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70-\uDD71\uDD7E-\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01-\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50-\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96-\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF])|(\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F-\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95-\uDD96\uDDA4-\uDDA5\uDDA8\uDDB1-\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB-\uDEEC\uDEF0\uDEF3-\uDEF6])|(\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0])/g;

export default class UForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            visible: false, //新建窗口隐藏
            dataSource: [],
            dataAll: '',
            datas: [],
            count: null,
            selectedRowKeys: [],
            tableRowKey: 0,
            isUpdate: false,
            loading: true,
            first: true,
            openCourseId: '',
            id: '',
            seller: [],
            channel: [],
            load: true,
            hint: 'none',
            sellerValue: 0,
            channelValue: 0,
            publicValue: 0, // 公共号
            disableBtn: false,
            resetBtn: false,
            buildBtn: false,
            value: '',
            headUrl: null,
            img: null,
            channelTxt: '',
            headText: '',
            publicTxt: '',
            nickText: '',
            publicList: []
        };
    }

    // 获取学员列表信息
    getChannelInfo = () => {
        channelList({
            id: parseInt(window.location.pathname.slice(12)),
            data: applyData
        }).then(response => {
            console.log(response.data.data, "=======渠道列表");
            originData = response.data.data;
            this.setState({
                dataSource: response.data.data.records,
                count: response.data.data.records.length,
                loading: false,
                dataAll: response.data.data,
                disableBtn: false,
                resetBtn: false
            });
            search = true;
        })
    };

    // 获取销售联级菜单
    getSellerList = () => {
        sellerList(parseInt(window.location.pathname.slice(12))).then(res => {
            this.setState({
                seller: res.data.data
            })
        })
    };

    // 渲染
    componentDidMount(){
        let input = document.querySelectorAll('input');
        for (let i = 0; i < input.length; i++) {
            input[i].autocomplete = "off"
        }
        applyData.current = 1;
        customCondition.name = null;
        customCondition.sellerId = null;
        customCondition.code = null;
        this.getSellerList();
        this.searchReset();
    };

    // 排序
    changeSore = (dataIndex, record, sorter) => {
        console.log(sorter.order);
        if (sorter.order !== undefined) {
            applyData.ascs = (sorter.order === "ascend" ? [sorter.field] : []);
            applyData.descs = (sorter.order === "ascend" ? [] : [sorter.field]);
        } else {
            applyData.descs = ['createTime']
        }
        applyData.current = 1;
        this.getChannelInfo();
    };

    // 接受新建表单数据
    saveFormRef = (form) => {
        this.form = form;
    };

    // 获取海报
    showPoster = (id,  record) => {
        console.log(record);
        const form = this.form;
        this.setState({
            id: id,
            visible: true,
            tableRowKey: id,
            isUpdate: true,
            load: true,
            hint: 'none'
        });
        if (id !== 0) {
            form.setFieldsValue({
                key: openCourseUrl() + '/opencourse/' + window.location.pathname.slice(12) + '?channel=' + record.code,
            });
            getPoster({
                courseId: parseInt(window.location.pathname.slice(12)),
                channelCode: record.code,
                username: getToken('username')
            }).then(res => {
                if (res.data.code === 0) {
                    this.setState({
                        id: res.data.data.img,
                        datas: res.data.data,
                        load: false
                    });
                } else {
                    message.error(res.data.msg);
                    this.setState({
                        load: false,
                        hint: 'block'
                    });
                }
            }).catch(err => {
                this.setState({
                    load: false,
                    hint: 'block'
                });
            });
        }
    };

    // 取消
    handleCancel = () => {
        this.setState({ visible: false });
        if (this.state.id === 0) {
            // document.querySelector('.txt').style.display = 'block';
            document.querySelector('.channel-poster').style.display = 'none';
            this.setState({
                visible: false,
                headUrl: null,
                img: null,
                value: null,
                userName: null
            })
        }
        // document.getElementById('channel-btn').classList.remove('have-value');
        // document.getElementById('channel-btn').classList.add('no-value');
    };

    // 销售筛选
    chooseSeller = (value, e) => {
        let channel = parseInt(value) === 0 ? [] : this.state.seller[value - 1].channels;
        this.setState({
            channel: channel,
            sellerValue: value,
            channelValue: 0,
        });
        applyData.current = 1;
        customCondition.code = null;
        customCondition.sellerId = e.key;
        this.setState({
            loading: true,
        });
        this.getChannelInfo();
    };

    // 渠道筛选
    chooseChannel = (value, e) => {
        applyData.current = 1;
        customCondition.code = e.key;
        this.setState({
            loading: true,
            channelValue: value
        });
        this.getChannelInfo();
    };

    // 搜索
    searchUser = () => {
        let inputUser = document.getElementById('search');
        customCondition.name = inputUser.value;
        this.setState({
            loading: true,
        });
        applyData.current = 1;
        if (search) {
            this.setState({
                loading: true,
                disableBtn: true
            });
            this.getChannelInfo();
        }
    };

    // 重置
    searchReset = () => {
        document.getElementById('search').value = null;
        customCondition.name = null;
        customCondition.sellerId = null;
        customCondition.code = null;
        this.setState({
            loading: true,
            sellerValue: 0,
            channelValue: 0,
            resetBtn: true
        });
        applyData.current = 1;
        this.getSellerList();
        this.getChannelInfo();
        this.setState({
            channel: []
        })
    };

    // 改变页码
    onChangePage = (page, pageSize) => {
        applyData.size = pageSize;
        applyData.current = page;
        this.getChannelInfo();
    };

    // 改变每页条数
    onShowSizeChange = (current, pageSize) => {
        applyData.size = pageSize;
        applyData.current = current;
        this.getChannelInfo();
    };

    showTotal = (total) => {
        return `共 ${total} 条数据`;
    };

    // 上传头像格式检查
    beforeUpload = (file) => {
        if (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') {
            this.setState({
                uploadHeadUrl: true,
            })
        } else {
            this.setState({
                uploadHeadUrl: false,
                img: null
            });
        }
    };

    // 上传头像
    uploadPic = (files) => {
        let fileReader = new FileReader(); // 图片上传，读图片
        let file = files.file; // 获取到上传的对象
        let _this = this;
        fileReader.onload = (function (file) {
            return function (ev) {
                _this.setState({
                    img: ev.target.result,
                    headText: ''
                })
            }
        })(file);
        fileReader.readAsDataURL(file); // 读取完毕，显示到页面
        if (this.state.uploadHeadUrl) {
            requestData(file).then(res => {
                this.setState({
                    headUrl: res.data.key
                });
            })
        } else {
            message.error('格式错误，请上传jpg/jpeg/png格式的图片')
        }
    };

    changeChannel = (e) => {
        this.setState({
            value: e.target.value
        });
        if (e.target.value.length > 50) {
            this.setState({
                channelTxt: '渠道名称不能超过50字'
            })
        } else if (!(e.target.value.indexOf(" ") === -1)) {
            this.setState({
                channelTxt: '禁止输入空格'
            })
        } else if (emojiRule.test(e.target.value)) {
            this.setState({
                channelTxt: '禁止输入emoji'
            })
        } else {
            this.setState({
                channelTxt: ''
            })
        }
    };

    // 用户昵称
    changeUserName = (e) => {
        console.log(e.target.value);
        this.setState({
            userName: e.target.value
        });
        if (this.state.userName !== '') {
            this.setState({
                nickText: ''
            });
        }
    };



    // 渠道生成点击
    buildChannel = () => {


        if (this.state.value !== '' && this.state.headUrl && this.state.userName !== '') {
            this.setState({
                buildBtn: true
            });
            addChannel({
                openCourseId: parseInt(window.location.pathname.slice(12)),
                name: this.state.value,
                headImgUrl: this.state.headUrl,
                nickname: this.state.userName
            }).then(res => {
                console.log(res.data);
                this.setState({
                    buildBtn: false
                });
                if (res.data.code === 0) {
                    // this.setState({
                    //     code: res.data.data
                    // });
                    // this.props.form.setFieldsValue({
                    //     key: openCourseUrl() + '/opencourse/' + window.location.pathname.slice(12) + '?channel=' + res.data.data
                    // });
                    // this.buildPoster();
                    message.success('渠道已生成！');
                    document.getElementById('get-channel').click();
                    this.setState({
                        visible: false,
                        headUrl: null,
                        img: null,
                        value: null,
                        userName: null
                    })
                    // document.querySelector('.txt').style.display = 'none';
                    // document.querySelector('.channel-poster').style.display = 'block';
                } else {
                    message.error(res.data.msg);
                    // document.querySelector('.txt').style.display = 'block';
                    // document.querySelector('.channel-poster').style.display = 'none';
                }
            });
        } else {
          if (this.state.value === '') {
              this.setState({
                  channelTxt: '请输入渠道名称'
              })
          }
          if (this.state.userName === '') {
              this.setState({
                  nickText: '请输入昵称'
              })
          }
          if (!this.state.headUrl) {
              this.setState({
                  headText: '请上传自定义头像'
              })
          }
        }
    };

    render(){
        const { dataSource, visible, loading } = this.state;

        const { Option} = Select;
        return(
            <div className="open-course-channel" style={{margin: "0 30px"}}>
                <div className='formBody'>
                    <Row gutter={16}>
                        <Col className="gutter-row label" sm={3}>
                            <Button icon="plus" type="primary" style={{marginBottom: '5px'}} onClick={this.showPoster.bind(this, 0)}>添加</Button>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className="gutter-row label" sm={2} style={{marginTop: '3px'}}>
                            <span>筛选：</span>
                        </Col>
                        <Col className="gutter-row" id="channel" sm={8} span={3}>
                            <Select
                                defaultValue={0}
                                value={this.state.sellerValue}
                                onChange={this.chooseSeller}
                                getPopupContainer={() => document.getElementById('channel')}
                            >
                                <Option value={0}>选择销售</Option>
                                {
                                    this.state.seller && this.state.seller.map((value, index) => {
                                        return (<Option key={value.sellerId} value={index + 1}>{value.sellerName}</Option>)
                                    })
                                }
                            </Select>
                            <Select
                                defaultValue={0}
                                value={this.state.channelValue}
                                onChange={this.chooseChannel}
                                getPopupContainer={() => document.getElementById('channel')}
                            >
                                <Option value={0}>选择渠道</Option>
                                {
                                    this.state.channel && this.state.channel.map((value, index) => {
                                        return (<Option key={value.channelCode} value={index + 1}>{value.channelName}</Option>)
                                    })
                                }
                            </Select>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className="gutter-row label" sm={2} style={{marginTop: '5px'}}>
                            <span>搜索：</span>
                        </Col>
                        <Col className="gutter-row" sm={8}>
                            <Input placeholder="搜索渠道名称" id="search"/>
                        </Col>
                        <Col className="gutter-row" sm={9}>
                            <Button type="primary" style={{marginRight: '20px'}} onClick={this.searchUser} disabled={this.state.disableBtn}>搜索</Button>
                            <Button type="default" onClick={this.searchReset} disabled={this.state.resetBtn}>全部重置</Button>
                        </Col>
                    </Row>
                    <FormTable
                        dataSource={dataSource}
                        changeSore={this.changeSore}
                        editClick={this.showPoster}
                        loading={loading}
                    />
                    <div style={{overflow: 'hidden'}}>
                        <LocaleProvider locale={zh_CN}>
                            <Pagination showSizeChanger onShowSizeChange={this.onShowSizeChange}
                                        onChange={this.onChangePage}
                                        total={this.state.dataAll.total}
                                        showTotal={this.showTotal.bind(this.state.dataAll.total)}
                                        current={applyData.current}
                                        defaultPageSize={40}/>
                        </LocaleProvider>
                    </div>
                    <CollectionCreateForm openCourseId={this.state.openCourseId} data={this.state.datas}
                                          id={this.state.id} ref={this.saveFormRef} onCancel={this.handleCancel}
                                          hint={this.state.hint}
                                          visible={visible} title="推广" loading={this.state.load}
                                          disableBtn={this.state.buildBtn}
                                          uploadPic={this.uploadPic}
                                          beforeUpload={this.beforeUpload}
                                          img={this.state.img}
                                          changeUserName={this.changeUserName}
                                          userName={this.state.userName}
                                          value={this.state.value}
                                          changeChannel={this.changeChannel}
                                          channelTxt={this.state.channelTxt}
                                          headText={this.state.headText}
                                          nickText={this.state.nickText}
                                          buildChannel={this.buildChannel}
                                          style={{fontSize: '20px'}} getChannel={this.searchReset}/>
                </div>
            </div>
        )
    }
}
