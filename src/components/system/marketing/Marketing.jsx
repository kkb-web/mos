import React from 'react';
import BreadcrumbCustom from '../../common/BreadcrumbCustom';
import {Form} from 'antd';
import MarketForm from './Form';
import {connect} from "../../../utils/socket";
import {getToken} from "../../../utils/filter";

class Local extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            titleState: '',
            titleHint: ''
        };
    }

    // 渲染
    componentDidMount () {
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
                name: '系统管理',
                path: '#'
            },
            {
                name: '营销号管理',
                path: '#'
            }
        ];
        return (
            <div>
                <div className="page-nav">
                    <BreadcrumbCustom paths={menus}/>
                    <p className="title-style">营销号管理</p>
                    <p className="title-describe">管理和记录销售营销号，以及与设备的对应关系，记录和编辑营销号的好友数量等。</p>
                </div>
                <div className='formBody'>
                    <MarketForm />
                </div>
            </div>
        );
    }

}

const CollectionCreateForm = Form.create()(Local);
export default CollectionCreateForm;
