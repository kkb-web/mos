import React, {Component} from 'react';
import {Table, Tooltip, Popconfirm, Modal, Select} from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import {formatDateTime, getNum, renderPaymentMethod, renderPayType} from "../../../utils/filter";

export default class FormTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            previewVisible: false,
            previewImage: ''
        }
    }

    previewImageFn = () => {
        this.setState({
            previewVisible: true
        })
    };
    handleCancel = () => {
        this.setState({
            previewVisible: false
        })
    };

    render() {
        const {previewVisible, previewImage} = this.state;
        const {changeSore, dataSource, loading, refundFn, moneyBackFn, moneyBackDetailFn, billStateFn, alreadyPayFn, signUpTabFn, previewImageFn} = this.props;


        function rederImg(ImgList) {
            let ArrData = ImgList.split(',');
            return (
                <div>
                    {
                        ArrData.map((id, index) => {
                            return <div key={index} onClick={() => previewImageFn(id)} className="paymentvoucherimg-box"><img
                                className="paymentvoucherimg" src={`https://img.kaikeba.com/${id}`}/></div>
                        })
                    }
                </div>
            )
        }

        const locale = {
            emptyText: '没有数据'
        };
        const columns = [{
            title: '回款编号',
            dataIndex: 'no',
            width: 100,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
            }
        }, {
            title: '添加人',
            dataIndex: 'applyByName',
            width: 90,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
            }
        }, {
            title: '回款时间',
            dataIndex: 'applyTime',
            // sorter: (a, b) => a.uv - b.uv,
            width: 70,
            render: (dataIndex) => {
                return dataIndex ? <span className="class-color">{formatDateTime(dataIndex)}</span> : <span>/</span>
            }
        }, {
            title: '回款金额',
            dataIndex: 'applyAmount',
            // sorter: (a, b) => a.uv - b.uv,
            width: 70,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
            }
        }, {
            title: '付款类型',
            dataIndex: 'transaction',
            // sorter: (a, b) => a.uv - b.uv,
            width: 90,
            render: (dataIndex) => {
                return <span>{renderPayType(dataIndex)}</span>
            }
        }, {
            title: '付款方式',
            dataIndex: 'payType',
            // sorter: (a, b) => a.uv - b.uv,
            width: 70,
            render: (dataIndex) => {
                return dataIndex !== undefined ? <span>{renderPaymentMethod(dataIndex)}</span> : <span>/</span>
            }
        }, {
            title: '分期数',
            dataIndex: 'emi',
            width: 90,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
            }
        }, {
            title: '服务费',
            dataIndex: 'chargeAmount',
            width: 90,
            render: (dataIndex) => {
                return dataIndex ? <span>{getNum(dataIndex)}</span> : <span>/</span>
            }
        }, {
            title: '付款凭证',
            dataIndex: 'vouchers',
            // sorter: (a, b) => a.uv - b.uv,
            width: 100,
            render: (dataIndex) => {
                return dataIndex ?  rederImg(dataIndex) : <span>/</span>
            },
        }, {
            title: '备注',
            dataIndex: 'remark',
            // sorter: (a, b) => a.uv - b.uv,
            width: 90,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
            }
        }, {
            title: '状态',
            dataIndex: 'status',
            // sorter: (a, b) => a.uv - b.uv,
            width: 80,
            render: (dataIndex) => {
                return dataIndex == 1 ? <span className="billyes">已对账</span> : <span className="billno">未对账</span>
            },
        }, {
            title: '操作人',
            dataIndex: 'execByName',
            // sorter: (a, b) => a.uv - b.uv,
            width: 80,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
            }
        }, {
            title: '操作时间',
            dataIndex: 'execTime',
            // sorter: (a, b) => a.uv - b.uv,
            width: 80,
            render: (dataIndex, record) => {
                return dataIndex ? <span>{formatDateTime(dataIndex)}</span> : <span>/</span>
            },
        }];
        return (
            <Table
                key={(record, i) => i}
                rowKey={(record, i) => i}
                rowSelection={null}
                columns={columns}
                dataSource={dataSource}
                bordered={true}
                scroll={{x: '100%'}}
                className='formTable'
                loading={loading}
                pagination={false}
                onChange={changeSore}
                locale={locale}
            />
        )
    }
}
