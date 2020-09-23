import React from 'react';
import './Launch.less';
import BreadcrumbCustom from '../../common/BreadcrumbCustom';
import {Form} from 'antd';
import LaunchForm from './Form';
import {connect} from "../../../utils/socket";
import {getToken} from "../../../utils/filter";


class Local extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            fromMediaId: this.props.location.state ? this.props.location.state.id : null,
            fromMediaName: this.props.location.state ? this.props.location.state.name : '选择媒体名称',
        };
    }

    // 渲染
    componentDidMount() {
        if (this.props.location.state) {
            console.log(this.props.location.state, "222");
            console.log(this.state.fromMediaId, this.state.fromMediaName)
        }
        //链接websocket
        connect(getToken('username'));
        //end
    }

    render() {
        const menus = [
            {
                path: '/app/dashboard/analysis',
                name: '首页'
            },
            {
                name: '营销中心',
                path: '#'
            },
            {
                name: '投放列表',
                path: '#'
            }
        ];
        return (
            <div>
                <div className="page-nav">
                    <BreadcrumbCustom paths={menus}/>
                    <p className="title-style">投放列表</p>
                </div>
                <div className='formBody'>
                    <LaunchForm
                        fromMediaId={this.state.fromMediaId}
                        fromMediaName={this.state.fromMediaName}/>
                </div>
            </div>
        );
    }

}

const CollectionCreateForm = Form.create()(Local);
export default CollectionCreateForm;
