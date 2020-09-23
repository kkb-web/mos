import React from 'react';
import {Form, Input, Card} from 'antd';
import './Index.less';
import {urlUserInfo} from '../../api/userApi';

const FormItem = Form.Item;

class Information extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            dataSource: {
                realname: '', // 真实姓名
                mobile: '', // 个人手机号
                email: '', // 开课吧邮箱
                role: '', // 角色名称
            }
        }
    }

    //获取个人基本信息
    getUserInfo = () => {
        urlUserInfo().then(response => {
            this.setState({
                dataSource: response.data.data,
            });
            console.log("response.data.data===",response.data.data)

        }).catch(err => {

            console.log(err, "urlUserInfo")
        })
    };

    //渲染
    componentDidMount(){
        this.getUserInfo();
    };

    render() {
        const FormItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 16},
        };
        return (
            <div>
                <div style={{marginLeft: 38, marginRight: 38}}>
                <Card title="个人基本信息（变更需要联系管理员）" style={{marginBottom: 24}} bordered={false}>
                    <Form layout="horizontal" style={{paddingBottom: '20px'}}>
                        <FormItem className="open-course-form" label="真实姓名" {...FormItemLayout} hasFeedback>
                            <Input value={this.state.dataSource.realname} disabled />
                        </FormItem>
                        <FormItem className="open-course-form" label="个人手机号" {...FormItemLayout} hasFeedback>
                                <Input value={this.state.dataSource.mobile} disabled />
                        </FormItem>
                        <FormItem className="open-course-form" label="开课吧邮箱" {...FormItemLayout} hasFeedback>
                                <Input value={this.state.dataSource.email} disabled />
                        </FormItem>
                        <FormItem className="open-course-form" label="角色" {...FormItemLayout} hasFeedback>
                            <span>{this.state.dataSource.role}</span>
                        </FormItem>
                    </Form>
                </Card>
                </div>
            </div>
        );
    }
}

export default Information;
