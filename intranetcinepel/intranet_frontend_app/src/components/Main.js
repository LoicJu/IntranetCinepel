/******************************************************************************************
* This file serves as the app frame of the SPA, meaning some elements never changes
* - In this case, the element is
*   - Header (usually the case)
*******************************************************************************************/
import React, { Component } from 'react';
import {
  Route,
  NavLink,
  HashRouter,
  Switch,
} from 'react-router-dom';

import Dashboard from './Dashboard';

//import Profile from './Profile';
//import UpdateUser from './UpdateUser';

//import Search from './Search';
import ResetPassword from './ResetPassword'

import Login from './Login';
import Signup from './Signup';
import Logout from './Logout';

import AuthProvider from './AuthProvider';
import {AuthContext} from './AuthProvider';
import MessageProvider from './MessageProvider';

import Error from './Error';

// when a link is clicked, a CSS class is automatically added to the element nammed 'active'

class Main extends Component {
  render() {
    // The HashRouter component provides the foundation for the navigation and browser history handling that routing is made up of
    return (
      <HashRouter>
        <AuthProvider>
          <MessageProvider>
            <header>
              <nav className="navbar navbar-expand-lg navbar-dark csruby-bg-darkest">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav d-lg-none d-block">
                        <li className="nav-item active">
                            <NavLink className="nav-link text-danger" exact to="/"><i className="fas fa-home"></i> Dashboard</NavLink>
                        </li>
                    </ul>
                  <ul className="navbar-nav ml-auto">
                    <li className="nav-item active">
                      <AuthContext.Consumer>
                      {(context) =>
                        (context.getIsAuthenticated() &&
                          <NavLink className="nav-link text-danger" exact to="/logout"><i className="fas fa-sign-out-alt"></i> Logout</NavLink>
                        )
                      }
                      </AuthContext.Consumer>
                    </li>
                  </ul>
                </div>
              </nav>
              <div className="csruby-nav-underline csruby-bg-red">
              </div>
            </header>
            <div className="content text-light mt-5">
              <Switch>

                <Route exact path="/login" component={Login}/>
                <Route exact path="/signup" component={Signup}/>
                <Route exact path="/logout" component={Logout}/>
                <Route exact path="/resetPassword" component={ResetPassword}/>

                <Route exact render={(props) => <Error {...props} status={'404 Not Found'} detail={'Requested page not found.'}/> }/>
              </Switch>
            </div>
            <footer className="csruby-bg-darkest text-white py-4 mt-5">
              <div className="container">
                <div className="row">
                  <div className="col-lg">
                    <h5 className="my-3">&nbsp;</h5>
                    <p className="text-lg-right">&copy; Intranet Cinepel</p>
                  </div>
                </div>
              </div>
            </footer>
          </MessageProvider>
        </AuthProvider>
      </HashRouter>
    );
    // This prop ('exact') ensures the Route is active only if the path is an exact match for what is being loaded
    // without the 'exact', the content of home would always be displayed
  }
}

export default Main;