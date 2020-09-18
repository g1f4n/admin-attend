/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
// reactstrap components
import { Container } from 'reactstrap';
// core components
import AdminNavbar from 'components/Navbars/AdminNavbar.js';
import AdminFooter from 'components/Footers/AdminFooter.js';
import Sidebar from 'components/Sidebar/Sidebar.js';

import routes from 'routes.js';
import routes2 from 'routes2.js';
import { getUserRole } from 'utils';

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      roles: ''
    };
  }

  componentWillMount() {
    this.setState({ roles: getUserRole() });
  }
  componentDidMount() {
    this.setState({ roles: getUserRole() });
  }
  componentDidUpdate(e) {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.mainContent.scrollTop = 0;
  }
  getRoutes = (routes) => {
    if (this.state.roles === 'admin') {
      return routes.map((prop, key) => {
        if (prop.layout === '/admin') {
          return <Route path={prop.layout + prop.path} component={prop.component} key={key} />;
        } else if (prop.layout === '/leader') {
          return <Route path={prop.layout + prop.path} component={prop.component} key={key} />;
        }
      });
    } else if (this.state.roles === 'leader') {
      return routes.map((prop, key) => {
        if (prop.layout === '/admin') {
          return <Route path={prop.layout + prop.path} component={prop.component} key={key} />;
        } else if (prop.layout === '/leader') {
          return <Route path={prop.layout + prop.path} component={prop.component} key={key} />;
        }
      });
    }
  };
  getBrandText = (path) => {
    if (this.state.roles === 'admin') {
      for (let i = 0; i < routes.length; i++) {
        if (this.props.location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
          return routes[i].name;
        }
      }
      return routes[1].name;
    } else if (this.state.roles === 'leader') {
      for (let i = 0; i < routes2.length; i++) {
        if (this.props.location.pathname.indexOf(routes2[i].layout + routes2[i].path) !== -1) {
          return routes2[i].name;
        }
      }
      return routes2[1].name;
    }
    // return routes[i].name;
  };
  render() {
    return (
      <React.Fragment>
        <Sidebar
          {...this.props}
          routes={
            this.state.roles === 'admin' ? routes : this.state.roles === 'leader' ? routes2 : ''
          }
          logo={{
            innerLink: `${this.state.roles}/index`,
            imgSrc: require('assets/img/brand/argon-react.png'),
            imgAlt: '...'
          }}
        />
        <div className="main-content" ref="mainContent">
          <AdminNavbar
            {...this.props}
            brandText={this.getBrandText(this.props.location.pathname)}
          />
          <Switch>
            {/* {this.state.loading ? (
							console.log('loading...')
						) : this.state.roles === 'admin' ? (
							this.getRoutes(routes)
						): this.state.roles} */}
            {this.getRoutes(this.state.roles === 'admin' ? routes : routes2)}
            {/* {this.state.roles === 'admin'
              ? this.getRoutes(routes)
              : this.state.roles === 'leader'
              ? this.getRoutes(routes2)
              : ''} */}
            {/* {window.localStorage.getItem('roles') === 'admin' ? (
              <Redirect from="*" to={`/admin/index`} />
            ) : (
              <Redirect from="*" to={`/leader/index`} />
            )} */}
            <Redirect from="*" to={`/${this.state.roles}/index`} />
          </Switch>
          <Container fluid>
            <AdminFooter />
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

export default Admin;
