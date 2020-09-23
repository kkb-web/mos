import React, { Component } from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import history from '../components/common/History'

import App from '../components/common/App'
import Login from '../components/common/Login'
import Home from '../components/common/Home'
import Demo from '../views/Demo/Rematch'
import NoMatch from '../components/common/404'
import mobile from './childRoutes/mobile'
import { Provider } from 'react-redux'
import store from '../store'
import * as Sentry from '@sentry/browser'
import sentryDSN from '../utils/sentry'

Sentry.init({
  dsn: sentryDSN
})
class MRoute extends Component {
  componentDidCatch(error, errorInfo) {
    Sentry.captureException(error)
  }
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/app" component={App} />
            <Route path="/demo" component={Demo} />
            <Route path="/login" component={Login} />
            {mobile.map(value => (
              <Route
                exact
                path={value.path}
                key={value.component}
                component={value.component}
              />
            ))}
            <Route component={NoMatch} />
          </Switch>
        </Router>
      </Provider>
    )
  }
}

export default MRoute
