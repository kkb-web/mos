import React from 'react'
import { Link } from 'react-router-dom'
import {
  Row,
  Button,
  Pagination,
  LocaleProvider,
  Modal,
  Form,
  Input
} from 'antd'
import FormTable from './FormTable'
import BreadcrumbCustom from '../common/BreadcrumbCustom';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { getFormList, getForm } from '../../api/formListApi'
import { getToken } from "../../utils/filter";
import { connect } from "../../utils/socket";
import './index.less'
let params = {
  "pageSize": 40,
  "nowPage": 1,
  "descs": ["createTime"]
};
const FormItem = Form.Item
class FormList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      formList: [],
      loading: false,
      visible: false,
      modalShow: false,
      code: '',
      formQuestions: [],
      newSel: [
        {
          sort: 1,
          title: '',
          type: 1,
          isRequired: 1,
          options: []
        }
      ],
      totalCount: 0
    }
  }

  componentDidMount() {
    this.getFormList()
    connect(getToken('username'));
  }


  getFormList = () => {
    getFormList(params).then(res => {
      if (res.data.code === 0) {
        this.setState({
          dataSource: res.data.data.records,
          totalCount: res.data.data.totalCount
        })
      }
    })
  }

  getForm = (code) => {
    const params = { code }
    getForm(params).then(res => {
      if (res.data.code === 0) {
        this.setState({
          formList: res.data.data,
          formQuestions: res.data.data.questions
        })
      }
    })
  }
  
  changeModal = (code) => {
    this.setState({
      code,
      modalShow: true
    })
    this.getForm(code)
  }

  onChangePage = (page, pageSize) => {
    params.nowPage = page;
    params.pageSize = pageSize;
    this.getFormList();
  };

  cancleStatus = () => {
    this.setState({
      modalShow: false
    })
  }

  onShowSizeChange = (current, pageSize) => {
    params.pageSize = pageSize;
    params.nowPage = current;
    this.getFormList();
  };

  render() {
    const { dataSource, loading, formList, formQuestions } = this.state;
    const { getFieldDecorator } = this.props.form;

    const menus = [
      {
        path: '/app/dashboard/analysis',
        name: '首页'
      },
      {
        path: '#',
        name: '表单'
      },
      {
        path: '#',
        name: '表单列表'
      }
    ];

    return (
      <div className="launch-list">
        <div className="page-nav">
          <BreadcrumbCustom paths={menus} />
          <p className="title-style">表单列表</p>
        </div>
        <div className='formBody'>
          <Row gutter={16}>
            <div className='plus'>
              <Link to={'/app/form/add'}><Button icon="plus" type="primary">新建</Button></Link>
            </div>
          </Row>
          <FormTable
            dataSource={dataSource}
            changeModal={this.changeModal}
            loading={loading}
          />
          <div style={{ overflow: 'hidden' }}>

          </div>
        </div>
        <LocaleProvider locale={zh_CN}>
          <Pagination
            showSizeChanger onShowSizeChange={this.onShowSizeChange}
            onChange={this.onChangePage}
            total={this.state.totalCount}
            current={params.nowPage}
            pageSize={params.pageSize}
            defaultPageSize={40}
          />
        </LocaleProvider>
        <Modal
          title="预览表单"
          centered
          visible={this.state.modalShow}
          onCancel={this.cancleStatus}
          footer={[
            <Button key="cancle" onClick={this.cancleStatus}>取消</Button>,
            <Button type="primary" key="close" onClick={this.cancleStatus}>关闭</Button>
          ]}
        >
          <div className="pre-title">{formList.name}</div>
          <div className="pre-remark">{formList.remark}</div>

          <Form className="finace-addbills-form" layout="vertical">
            {
              formQuestions && formQuestions.map((item, index) => {

                return <FormItem key={item.sort} label={`${item.title}:`} hasFeedback>
                  {getFieldDecorator(`info${index}`, {
                    initialValue: item.options && item.options.map(o => o.option).join(',')
                  })(
                    <Input
                      disabled={true}
                      maxLength={20}
                    />
                  )}
                </FormItem>
              })
            }
          </Form>
        </Modal>
      </div>
    )
  }
}

const CollectionCreateForm = Form.create()(FormList);
export default CollectionCreateForm;
