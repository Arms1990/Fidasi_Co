import React, { Component, Suspense } from 'react';
import { Route, withRouter, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import AppLayout from '../../layout/AppLayout';


const Page = React.lazy(() =>
  import(/* webpackChunkName: "details-page" */ './page')
);

const Notifications = React.lazy(() =>
  import(/* webpackChunkName: "notifications-page" */ './notifications')
);

// const Profile = React.lazy(() =>
//   import(/* webpackChunkName: "profile-page" */ './profile')
// );

class App extends Component {
  render() {
    const { match } = this.props;

    return (
      <AppLayout>
        <div className="dashboard-wrapper">
          <Suspense fallback={<div className="loading" />}>
            <Switch>

              {/* <Redirect from={`${match.url}/`} to={`${match.url}/dashboard`} /> */}

              {/* <Route
                path={`${match.url}/`}
                render={props => <Page {...props} />}
              /> */}

              {/* <Route
                path={`${match.url}/profile`}
                render={props => <Profile {...props} />}
              /> */}

              <Route
                path={`${match.url}/notifications`}
                render={props => <Notifications {...props} />}
              />

              <Route
                path={`${match.url}/:slug/:subSlug?`}
                render={props => <Page {...props} />}
              />
              
              {/* <Redirect to="/error" /> */}
            </Switch>
          </Suspense>
        </div>
      </AppLayout>
    );
  }
}
const mapStateToProps = ({ authUser, menu }) => {
  const { containerClassnames } = menu;
  const { token } = authUser;
  return { token, containerClassnames };
};

export default withRouter(
  connect(
    mapStateToProps,
    {}
  )(App)
);
