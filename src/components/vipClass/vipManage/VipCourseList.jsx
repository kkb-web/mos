import React from 'react';
import './VipCourseList.less'
import {connect} from "../../../utils/socket";
import {getToken, noSubjectAuthor} from "../../../utils/filter";
import {getVipCourseList} from "../../../api/vipCourseApi";
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import history from "../../common/History";
import {Row, Col, List, Card, Button, Icon, message} from "antd";

export default class VipCourseList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: '',
      list: [],
      Jurisdiction: true
    }
  }


  // 渲染
  componentDidMount() {
    this.node.scrollIntoView();
    this.getVipCourseList();
    //链接websocket
    connect(getToken('username'));
    //end
  }

  // 获取vip课程列表信息
  getVipCourseList = () => {
    getVipCourseList().then(res => {
      this.setState({
        loading: false
      });
      if (res.data.code === 0) {
        this.setState({
          list: res.data.data,
        })
      } else {
        message.error(res.data.msg);
        this.setState({
          loading: false,
        })
      }
    }).catch(err => {
      console.log(err)
      this.setState({
        loading: false,
      })
    })
  };
  LinkToAdd = () => {
    history.push({pathname: `/app/vipcourse/add`})
  };
  LinkToEdit = (e,id) => {
    e.stopPropagation();
    e.preventDefault();
    history.push({pathname: `/app/vipcourse/${id}?page=1`, state: {id: id}});
  };
  LinkToClass = (e,id) => {
    e.stopPropagation();
    e.preventDefault();
    history.push({pathname: `/app/vipcourse/${id}?page=2`, state: {id: id}})
  };
  LinkToSale = (e,id) => {
    e.stopPropagation();
    e.preventDefault();
    history.push({pathname: `/app/vipcourse/${id}?page=3`, state: {id: id}})
  };
  LinkToChannel = (e,id) => {
    e.stopPropagation();
    e.preventDefault();
    history.push({pathname: `/app/vipcourse/${id}?page=4`, state: {id: id}})
  };


  render() {
    const {list, loading} = this.state;
    const Edits = (props) => {
      return props.Jurisdiction == 0 ? <a href={`/app/vipcourse/${props.id}?page=1`}><div onClick={(e)=>this.LinkToEdit(e,props.id)}>编辑</div></a> :
        <a className="edit">编辑</a>;
    };
    const Class = (props) => {
      return props.Jurisdiction == 0 ? <a href={`/app/vipcourse/${props.id}?page=2`}><div onClick={(e)=>this.LinkToClass(e,props.id)}>班次</div></a> :
        <a className="edit">班次</a>;
    };
    const Sale = (props) => {
      return props.Jurisdiction == 0 ? <a href={`/app/vipcourse/${props.id}?page=3`}><div onClick={(e)=>this.LinkToSale(e,props.id)}>销售</div></a> :
        <a className="edit">销售</a>;
    };
    const Channel = (props) => {
      return props.Jurisdiction == 0 ? <a href={`/app/vipcourse/${props.id}?page=4`}><div onClick={(e)=>this.LinkToChannel(e,props.id)}>渠道</div></a> :
        <a className="edit">渠道</a>;
    };
    const menus = [
      {
        path: '/app/dashboard/analysis',
        name: '首页'
      },
      {
        name: 'vip课程',
        path: '#'
      },
      {
        name: '课程列表',
        path: '#'
      }
    ];
    return (
      <div>
        <div ref={node => this.node = node} className="vip-page-nav">
          <BreadcrumbCustom paths={menus}/>
          <p className="vip-title-style">VIP课列表</p>
          <div className="viplist-top-box">
            <Row gutter={24}>
              <Col span={18}>
                <p
                  className="viplist-descript">VIP课程，即开课吧官方发布的核心教育产品，它的特点是高客单价，以直播教学为主，定期开班。目前发布的课程有8门：Web全栈架构师、JavaScript核心晋升之路、Java高级架构师、百万年薪架构师、Python数据分析、机器学习训练营、产品经理、UXD全能设计师。</p>
              </Col>
              <Col span={6}>
                <div className="viplist-title-img"><img
                  src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"/></div>
              </Col>
            </Row>
          </div>
        </div>
        <div className='vipcourselist-formBody'>
          <div className="viplist-cardList">
            <List
              rowKey="id"
              loading={loading}
              grid={{gutter: 24, lg: 3, md: 2, sm: 1, xs: 1}}
              dataSource={[...list, '']}
              renderItem={item =>
                item ? (
                  <List.Item key={item.id}>
                    <Card hoverable className="viplist-card"
                          actions={[
                            <Edits Jurisdiction={item.limited} id={item.id}/>,
                            <Class Jurisdiction={item.limited} id={item.id}/>,
                            <Sale Jurisdiction={item.limited} id={item.id}/>,
                            <Channel Jurisdiction={item.limited} id={item.id}/>,
                          ]}
                          extra={
                            item.type == 1 ? <div className="viptag">低价小课</div> :
                              <div className="viptag02">VIP课程</div>
                          }
                    >
                      <Card.Meta
                        onClick={item.limited == 0 ? (e)=>this.LinkToEdit(e,item.id) : null}
                        avatar={<img alt="" className="viplist-cardAvatar"
                                     src={'https://img.kaikeba.com/' + item.icon + '!w1h1'}/>}
                        title={item.limited == 0 ? <a>{item.name}</a> :
                          <a style={{color: 'rgba(0,0,0,.45)', cursor: 'default'}}>{item.name}</a>}
                        description={
                          <p className="viplist-item">{item.description}</p>
                        }
                      />
                    </Card>
                  </List.Item>
                ) : (
                  <List.Item>
                    <Button disabled={!noSubjectAuthor("marketing:vipcourse:manager")} onClick={this.LinkToAdd}
                            type="dashed" className="viplist-newButton">
                      <Icon type="plus"/> 新增VIP课程
                    </Button>
                  </List.Item>
                )
              }
            />
          </div>
        </div>
      </div>
    );
  }
}
