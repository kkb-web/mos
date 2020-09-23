import React, {Component} from 'react';
import {Table,Popconfirm} from 'antd';
// import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import {
    formatDateTime,
    formatDateDay,
    renderPaymentMethod,
    renderPayType,
    priceType,
    getNum
} from "../../../utils/filter";


export default class FormTable extends Component {
    constructor(props) {
        super(props);
    }




    render() {
        const {changeSore, dataSource, loading,handleBillClick,showImgClick,cancelConfirmClick,onSelectChange,selectedRowKeys} = this.props;
        // const {selectedRowKeys} = this.state;
        console.log(selectedRowKeys,'selectedRowKeys111')
        function rederImg(ImgList) {
            let ArrData = ImgList.split(',');
            return (
                <div>
                    {
                        ArrData.map((id, index) => {
                            return <div key={id} onClick={() => showImgClick(id)} className="paymentvoucherimg-box"><img
                                className="paymentvoucherimg" key={index} src={`https://img.kaikeba.com/${id}`}/></div>
                        })
                    }
                </div>
            )
        }
        const textTitleNode = (
            <div className="popconfirm-box">
                <p style={{fontSize:'14px',color:'gb(0,0,0,.6)',marginBottom:'2px'}} className="popconfirm-content">确认账单无误了吗？</p>
                <p style={{fontSize:'12px',color:'red',marginBottom:'6px'}} className="popconfirm-descript">（确认后不可回退）</p>
            </div>
        );

        const locale = {
            emptyText: '没有数据'
        };
        const pagination = {
            defaultPageSize: 40
        }
        const rowSelection = {
            selectedRowKeys,
            onChange: onSelectChange,
            getCheckboxProps: record => ({
                disabled: record.status === 1,
                statsu: record.status
            })

        };
        const columns = [{
            title: '流水号',
            dataIndex: 'no',
            width: 100,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
            }
        }, {
            title: '流水金额',
            dataIndex: 'applyAmount',
            width: 100,
            render: (dataIndex) => {
                return dataIndex ? <span>{priceType(dataIndex)}</span> : <span>/</span>
            }
        }, {
            title: '订单编号',
            dataIndex: 'orderId',
            // sorter: (a, b) => a.uv - b.uv,
            width: 80,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>0</span>
            }
        }, {
            title: '回款时间',
            dataIndex: 'applyTime',
            // sorter: (a, b) => a.uv - b.uv,
            width: 95,
            render: (dataIndex) => {
                return dataIndex ? <span>{formatDateTime(dataIndex)}</span> : <span>/</span>
            }
        }, {
            title: '流水类型',
            dataIndex: 'auto',
            // sorter: (a, b) => a.uv - b.uv,
            width: 90,
            render: (dataIndex) => {
                return dataIndex == 1 ? <span>自动</span> : <span>手动</span>
            }
        }, {
            title: '销售',
            dataIndex: 'sellerName',
            // sorter: (a, b) => a.uv - b.uv,
            width: 90,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
            }
        }, {
            title: '支付类型',
            dataIndex: 'transaction',
            // sorter: (a, b) => a.uv - b.uv,
            width: 80,
            render: (dataIndex) => {
                return <span>{renderPayType(dataIndex)}</span>
            }
        }, {
            title: '支付方式',
            dataIndex: 'payType',
            // sorter: (a, b) => a.uv - b.uv,
            width: 90,
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
            title: '上课学员',
            dataIndex: 'trackName',
            // sorter: (a, b) => a.uv - b.uv,
            width: 80,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
            }
        }, {
            title: '微信昵称',
            dataIndex: 'nickname',
            // sorter: (a, b) => a.uv - b.uv,
            width: 80,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
            }
        }, {
            title: '课程',
            dataIndex: 'itemName',
            // sorter: (a, b) => a.uv - b.uv,
            width: 80,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
            }
        }, {
            title: '班次',
            dataIndex: 'itemSkuName',
            // sorter: (a, b) => a.uv - b.uv,
            width: 80,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
            }
        }, {
            title: '付款凭证',
            dataIndex: 'vouchers',
            // sorter: (a, b) => a.uv - b.uv,
            width: 90,
            render: (dataIndex) => {
                return dataIndex ?  rederImg(dataIndex) : <span>/</span>
            },
        }, {
            title: '对账时间',
            dataIndex: 'execTime',
            // sorter: (a, b) => a.uv - b.uv,
            width: 95,
            render: (dataIndex) => {
                return dataIndex ? <span>{formatDateTime(dataIndex)}</span> : <span>/</span>
            },
        }, {
            title: '对账人员',
            dataIndex: 'execByName',
            // sorter: (a, b) => a.uv - b.uv,
            width: 80,
            render: (dataIndex) => {
                return dataIndex ? <span>{dataIndex}</span> : <span>/</span>
            },
        }, {
            title: '状态',
            dataIndex: 'status',
            // sorter: (a, b) => a.uv - b.uv,
            width: 90,
            render: (dataIndex) => {
                return dataIndex == 1 ? <span className="billyes">已对账</span> : <span className="billno">未对账</span>
            },
        }, {
            title: '操作',
            dataIndex: 'opera',
            width: 90,
            render: (dataIndex, record) =>
                <div>
                    {
                        record.status == 0 ? <Popconfirm title={textTitleNode} onConfirm={()=>handleBillClick(record.id)} onCancel={()=>cancelConfirmClick()} okText="确认" cancelText="取消"><span style={{color: 'rgb(24, 144, 255)',cursor:'pointer'}}>确认账单</span> </Popconfirm> :
                            <span style={{color: 'rgb(206, 206, 206)',cursor:'default'}}>
                                 确认账单
                            </span>
                    }

                </div>
        }];
        return (
            <Table
                key={(record, i) => i}
                rowKey={(record, i) => record.id}
                rowSelection={rowSelection}
                columns={columns}
                dataSource={dataSource}
                bordered={true}
                scroll={{x: '100%'}}
                className='formTable'
                loading={loading}
                pagination={false}
                locale={locale}
            />
        )
    }
}
