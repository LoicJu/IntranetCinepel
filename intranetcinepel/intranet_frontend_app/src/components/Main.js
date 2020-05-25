/******************************************************************************************
* This file serves as the app frame of the SPA, meaning some elements never changes
* - In this case, the element is
*   - Header (usually the case)
*******************************************************************************************/
import React, { Component } from 'react';
import M from 'materialize-css';
import {
  Route,
  NavLink,
  HashRouter,
  Switch,
} from 'react-router-dom';

//import Dashboard from './Dashboard';

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
  // get a reference to the element after the component has mounted
  componentDidMount(){
    M.Sidenav.init(this.sidenav);
  }
  render() {
    // The HashRouter component provides the foundation for the navigation and browser history handling that routing is made up of
    return (
      <HashRouter>
        <AuthProvider>
          <MessageProvider>
            <header>
            <div className="App">
              <nav>
                <div className="container">
                  <ul id="nav-mobile" className="right hide-on-med-and-down">
                      <li><NavLink exact to="/logout">Logout</NavLink></li>
                      <li><NavLink to="/signup">Signup</NavLink></li>
                      <li><NavLink to="/login">Login</NavLink></li>
                      <li><NavLink to="/resetPassword">resetPassword</NavLink></li>
                  </ul>
                </div>
              </nav>
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
            </MessageProvider>
        </AuthProvider>
      </HashRouter>
    );
    // This prop ('exact') ensures the Route is active only if the path is an exact match for what is being loaded
    // without the 'exact', the content of home would always be displayed
  }
}

export default Main;