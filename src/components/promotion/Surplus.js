import React from 'react';
import {Modal, Form, Button, Table, Input, message, LocaleProvider, Pagination} from 'antd';
import {urlFriendsList, urlFriends} from '../../api/userApi';
import {formatDateTime} from "../../utils/filter";
import {getMountList, setMountList} from '../../api/promotionApi'
import zh_CN from "antd/lib/locale-provider/zh_CN";
const FormItem = Form.Item;

const params = {
    base: {
      size: 5,    // 分页大小
      current: 1, // 当前页
    },
    campaignId: ''

}
let uploadState = true;

class Local extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputHint: '',
            inputState: '',
            total: '',  // 总行数
            size: '',   // 行数
            pages:'',   // 页数
            current:'',  // 当前页码
            dataSource:[],  // 行记录
            id:'',  // 好友数量id
            number:'',   // 修改数值
            createTime:'',  // 修改时间
            salesName:'',  // 修改人
            sellerId: '',
            disableBtn: false
        };
    }

    // 点击好友列时调用，此时的props发生变化
    componentWillReceiveProps(nextProps) {
        this.setState({
            sellerId: nextProps.sellerId,
            visible: nextProps.visible
        }, () => {
            if (this.state.visible) {
                this.getFriendsList();
            }
        })
    }

    // 获取好友数量列表
    getFriendsList = () => {
        params.campaignId = this.state.sellerId;
        getMountList(params).then(response => {
          console.log(response)
            this.setState({
                dataSource: response.data.data.records,
                total: response.data.data.total,
                size: response.data.data.size,
                pages: response.data.data.pages,
                current: response.data.data.current,
            });
        }).catch(err => {
            console.log(err, "urlFriendsList")
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const friendData = {
            campaignId: this.props.sellerId,  // 营销号Id
            surplusAmount: {
              surplusAmount: ''
            }  // 数值
        };
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!values.surplusAmount) {
                this.setState({
                    inputHint: '请输入有效的数字',
                    inputState: 'error',
                });
                uploadState = false;
            } else {
                this.setState({
                    inputHint: '',
                    inputState: 'success'
                });
            }
            if (!err) {
                console.log('Received values of form: ', values);
            }
            friendData.surplusAmount.surplusAmount = values.surplusAmount;
        });

        //点击修改，添加一条新纪录到列表
        if (uploadState) {
            this.setState({
                disableBtn: true
            });
            console.log(friendData,'numberVal')
            setMountList(friendData).then(response => {
                this.setState({
                    disableBtn: false
                });
                switch (response.data.code) {
                    case 0: {
                        message.success('修改成功');
                        this.getFriendsList();
                        this.props.form.setFieldsValue({
                            surplusAmount: ''
                        })
                    }
                    break;
                    case 1: {
                        message.error('修改失败');
                    }
                    break;
                    case 400: {
                        message.error('请求参数异常');
                    }
                    break;
                    case 10001: {
                        message.error('数据不存在');
                    }
                    break;
                    case 10004: {
                        message.error('认证授权失败');
                    }
                    break;
                }
            });
        }
    };

    // 验证修改金额数：仅支持输入数字，范围[0,100000000]
    checkInput = (rule, value, callback) => {
        const flagPattern=/^([1-9][0-9]*)+(\.[0-9]{1,2})?$/;
        let result=flagPattern.test(value);  // 正则表达式校验结果
        if(!result || value > 100000000 || value < 0){
            callback('请输入有效的数字');
            uploadState = false;
        } else {
            callback();
            uploadState = true;
        }
    }

    //页码相关
    onChangePage =(page, pageSize)=>{
        params.base.current = page;
        params.base.size = pageSize;
        this.getFriendsList();
    };

    render() {
        const friendColumns = [{
            title: '修改数值',
            dataIndex: 'surplusAmount',
            render: (dataIndex) => {
              return <span>¥{dataIndex}</span>
            }
        }, {
            title: '修改时间',
            dataIndex: 'createTime',
            render: (dataIndex) => {
                return formatDateTime(dataIndex)
            }
        }, {
            title: '修改人',
            dataIndex: 'modifier',
        }];

        const {visible, onCancel, title, sellerId } = this.props;
        const {getFieldDecorator} = this.props.form;
        const {dataSource} = this.state;


        return(
            <div>
                <Modal
                    title={title}
                    visible={visible}
                    footer={null}
                    onCancel={onCancel}
                    sellerId={sellerId}
                    destroyOnClose={true}
                >
                    <Form layout="inline">
                        <FormItem label={'当前剩余金额'} >
                            {getFieldDecorator('surplusAmount', {
                                rules: [{
                                    required: true, message:  '请输入有效的数字'
                                },{
                                    pattern: '[0-9]', message:  '请输入有效的数字'
                                },{
                                    validator: this.checkInput
                                }],
                            })(
                                <Input/>
                            )}
                        </FormItem>
                        <FormItem>
                            <Button
                                type="primary"
                                htmlType="submit"
                                onClick={this.handleSubmit}
                                disabled={this.state.disableBtn}
                            >
                                修改
                            </Button>
                        </FormItem>
                    </Form>
                    <Table
                        key={record => record.id}
                        rowKey={record => record.id}
                        style={{marginTop: '10px'}}
                        columns={friendColumns}
                        dataSource={dataSource}
                        pagination={false}
                        bordered={false}
                    />
                    <div style={{overflow: 'hidden',marginTop: '20px'}}>
                        <LocaleProvider locale={zh_CN}>
                            <Pagination
                                        onChange={this.onChangePage.bind(this)}
                                        pageSize={params.base.size}
                                        total={this.state.total}
                                        current={params.base.current}
                                        size={'small'}
                            />
                        </LocaleProvider>
                    </div>
                </Modal>
            </div>
        );
    }
}

const Friends = Form.create()(Local);

export default Friends;
