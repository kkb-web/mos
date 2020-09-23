import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import '../style/index.less';

import dashboard from './childRoutes/dashboard';
import market from './childRoutes/market';
import openCourse from './childRoutes/openCourse';
import authority from './childRoutes/authority';
import user from './childRoutes/user';
import vipCourse from './childRoutes/vipCourse'
import userCenter from './childRoutes/userCenter';
import orderCenter from './childRoutes/orderCenter';
import finance from './childRoutes/finance';
import saledata from './childRoutes/preSaleInformation'
import clueCenter from './childRoutes/clueCenter'
import promotion from './childRoutes/promotion'
import callcenter from './childRoutes/callcenter'
import exportList from './childRoutes/export'
import formList from './childRoutes/formList'

import NoMatch from '../components/common/404';

export default class Routes extends Component {
    render() {
        return (
            <Switch>
                {
                  dashboard.map((value) => {
                    return (
                      <Route exact path={value.path} key={value.component} component={value.component} />
                    )
                  })
                }
                {
                  market.map((value) => {
                    return (
                      <Route exact path={value.path} key={value.component} component={value.component} />
                    )
                  })
                }
                {
                  openCourse.map((value) => {
                    return (
                      <Route exact path={value.path} key={value.component} component={value.component} />
                    )
                  })
                }
                {
                  authority.map((value) => {
                    return (
                      <Route exact path={value.path} key={value.component} component={value.component} />
                    )
                  })
                }
                {
                  user.map((value) => {
                    return (
                      <Route exact path={value.path} key={value.component} component={value.component} />
                    )
                  })
                }
                {
                  vipCourse.map((value) => {
                    return (
                      <Route exact path={value.path} key={value.component} component={value.component} />
                    )
                  })
                }
                {
                  userCenter.map((value) => {
                    return (
                      <Route exact path={value.path} key={value.component} component={value.component} />
                    )
                  })
                }
                {
                  orderCenter.map((value) => {
                    return (
                      <Route exact path={value.path} key={value.component} component={value.component} />
                    )
                  })
                }
                {
                  finance.map((value) => {
                    return (
                      <Route exact path={value.path} key={value.component} component={value.component} />
                    )
                  })
                }
                {
                  saledata.map((value) => {
                    return (
                      <Route exact path={value.path} key={value.component} component={value.component} />
                    )
                  })
                }
                {
                  clueCenter.map((value) => {
                    return (
                      <Route exact path={value.path} key={value.component} component={value.component} />
                    )
                  })
                }
                {
                  promotion.map((value) => {
                    return (
                      <Route exact path={value.path} key={value.component} component={value.component} />
                    )
                  })
                }
                {
                  callcenter.map((value) => {
                    return (
                      <Route exact path={value.path} key={value.component} component={value.component} />
                    )
                  })
                }
                {
                  exportList.map((value) => {
                    return (
                      <Route exact path={value.path} key={value.component} component={value.component} />
                    )
                  })
                }
                {
                  formList.map(value => (
                    <Route exact path={value.path} key={value.component} component={value.component} />
                  ))
                }
                <Route component={NoMatch}/>
            </Switch>
        );
    }
}
