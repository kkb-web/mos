/**
 * Created by edz on 2018/10/7.
 */
import React from 'react'
import {Card, Modal, Upload, Select, Form, InputNumber, Input, Button, Icon, message, Tooltip} from 'antd';
import {requestData} from "../../../../utils/qiniu";
import {urlSubjectList, setformdataMarket, deletMarket, urlCheckWechat} from '../../../../api/deviceApi'
import FormList from './FormItem'

const confirm = Modal.confirm;
let selectvale = ''
let inputnumblur = ''
let qrdata =[]
let dw = []
let deleteID =[]
let market = []
let Addqrdata =[]

class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            titleState: '',
            img: '',
            loading: false,
            urlSubjectLists: [],
            todos: [],
            type: '',
            num: [{
                num: 2,
            }, {
                num: 1
            }],
            sellersId: {},
            COUNT: 999,
            fileLists: [],
            imageUrl: [],
            imageList: [],
            shareThumbnails: [],
            subjectIdSelect: '',
            friendsHint: '',
            friendsState: '',
            mobileState: '',
            mobileHint: '',
            deleteID:[],
            deviceId:'',
            Addqrdata:[]
        }
        this.sendmessage = this.sendmessage2.bind(this)
    }

    fnurlSubjectList = () => {
        urlSubjectList().then(res => {
            console.log(res.data.data, "+++++++++++++++")
            this.setState({
                urlSubjectLists: res.data.data
            })
        }).catch(err => {

        })
    }
    componentWillUnmount (){
        selectvale = ''
        inputnumblur = ''
        qrdata =[]
        dw = []
        deleteID =[]
        market = []
    }
    componentDidMount() {
        this.setState({
            type: this.props.types
        })
        if (this.props.types === 'edit') {
            let data = {
                deviceId: this.props.deviceID
            }
            this.setState({
                sellersId: data,
                deviceId:this.props.deviceID
            })
            this.setformdatamarkets(data)
        }
        this.fnurlSubjectList()
    }

    //请求营销号数据
    setformdatamarkets = (id) => {
        setformdataMarket(id).then(res => {
            const marketdata = res.data.data
            console.log(res.data.data, "++++++++")
            for (let i = 0; i < marketdata.length; i++) {
                qrdata.push(marketdata[i].qrCode)
                market.push(marketdata[i].id)
            }
            this.setState({
                todos: res.data.data,
            })
            console.log(qrdata,"kelist")
            this.props.getvalue(this.state.todos)
        }).catch(err => {
            console.log(err)
        })
    }

    //编辑页面中有内容的营销号删除函数
    delectDataYes = (id,index) => {
        let that = this;
        confirm({
            title: '确认取消绑定该设备吗？',
            content: '将此营销号取消绑定设备后，营销号将处于无人认领状态，不能再用于其他用途。确定要继续吗?',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                that.fnreplayform(id,index)
                deleteID.push( parseInt(id))
                that.setState({
                    deleteID: deleteID
                })
                that.props.deleteID(deleteID)
                console.log(deleteID)
            },
            onCancel() {
                console.log('您取消了')
            },
        });
    }
    delectDataNo = (id, index) => {
        let datas = this.state.todos
        qrdata.splice(index, 1)
        this.setState({
            Addqrdata:qrdata
        })
        this.setState({
            // 此处为数组过滤 不懂速查   arr.filter()
            todos: datas.filter(item => {
                if (item.id !== id) {
                    return item
                }
            }),
        }, function () {
            this.props.getvalue(this.state.todos)
        })
        // this.props.getvalue(this.state.todos)
    }


    // 通过自身方法调用父组件的函数deleteFn(通过this.props获取)
    clickHandler = (id, index) => {
        let that = this;
        if (this.props.types === 'edit') {
            id > 998 ? this.delectDataNo(id, index) : this.delectDataYes(id, index)
        } else {
            qrdata.splice(index, 1)
            console.log(qrdata,"删除后数据")
            this.setState({
                Addqrdata:qrdata
            })
            this.props.deleteFn(id)
            this.setState({
                img: '',
                thumbnailStatus: ''
            })
        }
    }
    //删除成功，刷新列表
    fnreplayform = (id, index) => {
        let datas = this.state.todos
        qrdata.splice(index, 1)
        market.splice(index,1)
        this.setState({
            // 此处为数组过滤 不懂速查   arr.filter()
            todos: datas.filter(item => {
                if (item.id !== id) {
                    return item
                }
            })
        }, function () {
            this.props.getvalue(this.state.todos)
        })
    }

    //新增营销号（编辑页面）
    EditaddMarket = () => {
        const Arr = []
        const data = this.state.todos
        for (var i = 0; i < data.length; i++) {
            Arr.push('https://img.kaikeba.com/' + data[i].qrCode)
        }
        this.setState({
            todos: this.state.todos.concat({
                id: this.state.COUNT,
                text: 1
            })
        }, function () {
            this.props.getvalue(this.state.todos)
        })


        this.setState({
            COUNT: this.state.COUNT + 1,
            type: "Add",
            imageUrl: Arr
        })
    }

    onRef = (ref)=>{
        this.child = ref
    }

    sendmessage2 = () =>{
        dw = this.child.myName()
        console.log(dw,"dw")
        if(dw[0] == 0){
            qrdata.splice(0,1)
            qrdata.unshift(dw[1])
        }
        if(dw[0] == 1){
            qrdata.splice(1,1)
            qrdata.push(dw[1])
        }
        Addqrdata = qrdata
        this.setState({
            Addqrdata:Addqrdata
        })

    }
    //新增提交
    getItemsValue = () => {
        let types = false
        let alldata = []
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const sendData = [];
                const sendData2 = [];
                const subjecdata = this.state.urlSubjectLists;
                const dataArr = this.props.types === 'edit' ? this.state.todos : this.props.todos
                console.log(dataArr, "+++")
                for (var i = 0; i < dataArr.length; i++) {
                    let datasource = this.props.form.getFieldsValue(['subjectId' + dataArr[i].id, 'num' + dataArr[i].id, 'wechat' + dataArr[i].id, 'friends' + dataArr[i].id, 'mobile' + dataArr[i].id])
                    sendData.push(datasource)
                    for (var j = 0; j < sendData.length; j++) {
                        var obj = {}
                        obj.id = market[i]
                        obj.subjectId = sendData[j]['subjectId' + dataArr[i].id]
                        obj.num = sendData[j]['num' + dataArr[i].id]
                        obj.wechat = sendData[j]['wechat' + dataArr[i].id]
                        obj.friends = parseInt(sendData[j]['friends' + dataArr[i].id])
                        obj.mobile = sendData[j]['mobile' + dataArr[i].id]
                        obj.qrCode = qrdata[i]
                        sendData2.push(obj)
                    }
                }
                for (var i = 0; i < sendData2.length; i++) {
                    if (sendData2[i].subjectId == undefined) {
                        sendData2.splice(i, 1)
                    }
                }
                console.log(sendData2,"我的数据")
                for (var i = 0; i < sendData2.length; i++) {
                    for (let k = 0; k < subjecdata.length; k++) {
                        if (sendData2[i].subjectId == subjecdata[k].name) {
                            sendData2[i].subjectId = subjecdata[k].id
                        }
                    }
                }
                console.log(sendData2, "+++++________")

                let falg = false
                this.props.form.validateFields((err, values) => {
                    if (!err) {
                        falg = true
                    }
                });
                if (falg) {
                    // return sendData2;
                    const moredata = sendData2
                    // let aa = "NaN"
                    // for (var i = 0; i < moredata.length; i++) {
                    //     let dw = moredata[i].subjectId.toString()
                    //     if (dw == aa) {
                    //         moredata.splice(i, 1)
                    //     }
                    // }
                    if(moredata.length == 2 ){
                        if(moredata[0].num == moredata[1].num){
                            message.warn('微信编号不能重复！')
                            return null
                        }else if(moredata[0].wechat == moredata[1].wechat){
                            message.warn('微信号不能重复！')
                            return null
                        }else {
                            types = true
                            alldata = moredata;
                        }
                    }else {
                        types = true
                        alldata = moredata;
                    }
                }

            }
        });
        if(types){
            return alldata
        }
    }

    //检测表单内容是否有变化
    checkFormchangge = () => {
        let fieldsvalue = this.props.form.getFieldsValue();
        console.log(fieldsvalue.content);
        // 将JSON数据的key值存为一个数组，便于获取对象fieldsvalue的长度
        let arr = Object.keys(fieldsvalue);
        // 设置一个计数器，用来记录控件值为空的个数
        let count = 1;
        // 遍历表单中所有控件的值
        for (let i in fieldsvalue) {
            count++;
            // 如果控件的值不为空，则显示提示框
            if (fieldsvalue[i]) {
                return false
            } else if (count > arr.length) {      // 当遍历完所有的控件都为空时，返回上一级菜单
                return true
            }
        }
    }

    inputNumbersFous = () => {
        if (typeof(selectvale) == 'undefined') {
            this.setState({
                subjectState: 'error',
                subjectHint: '请先填写学科!',
            })
        } else {
            this.setState({
                subjectState: 'success',
                subjectHint: '',
            })
        }
    }

    wechatCheck = (e) => {
        if (e.target.value.length === 0) {
            this.setState({
                wxchatState: 'error',
                wxchatHint: '微信号不能为空'
            })
        } else if (e.target.value.length > 0) {
            this.setState({
                wxchatState: 'success',
                wxchatHint: ''
            })
        }
    }
    // 好友数验证
    friendsCheck = (e) => {
        if (e.target.value.length === 0) {
            this.setState({
                friendsState: 'error',
                friendsHint: '好友数不能为空'
            })
        } else if (e.target.value.length > 0) {
            this.setState({
                friendsHint: '',
                friendsState: 'success',
            })
        }
    }

    render() {
        const FormItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 16},
        };
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'}/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const data = this.props.types === 'edit' ? this.state.todos : this.props.todos
        return (
            <ul style={{paddingLeft: '0'}}>
                <Form layout="horizontal">
                    {data && data.map((item, index) => {
                        return <li style={{listStyle: 'none'}} key={index}>
                            <FormList key={item.id} setRead={this.sendmessage} qrdatas = {this.state.Addqrdata} indexs={index} onRef={this.onRef} forad = {this.props.form} wrappedComponentRef={(form) => this.formRef = form} data={data[index]}
                                      clickHandler={this.clickHandler.bind(this, item.id,index)}></FormList>
                        </li>
                    })}
                </Form>
            </ul>
        )
    }


}
const CollectionCreateForm = Form.create()(List);
export default CollectionCreateForm;
