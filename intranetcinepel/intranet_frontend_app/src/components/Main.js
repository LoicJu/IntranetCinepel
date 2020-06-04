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

import Login from './Login';
import ResetPassword from './ResetPassword';
import Signup from './Signup';
import Logout from './Logout';

import AuthProvider from './AuthProvider';
import {AuthContext} from './AuthProvider';
import MessageProvider from './MessageProvider';

import Planning from './Planning';
import TemplatePlanning from './TemplatePlanning';
import Schedule from './Schedule';
import Informations from './Informations';
import UserHandler from './UserHandler';
import Profile from './Profile';

import Error from './Error';

class Main extends Component {
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
                  <li><NavLink exact to="/">Intranet Cinepel</NavLink></li>
                  <li>
                    <AuthContext.Consumer>
                    {(context) =>
                      (context.getIsAuthenticated() ?
                          <NavLink exact to="/templatePlanning">TemplatePlanning</NavLink>
                          :<NavLink to="/login">Login</NavLink>
                      )
                    }
                    </AuthContext.Consumer>
                  </li>
                  <li>
                    <AuthContext.Consumer>
                    {(context) =>
                      (context.getIsAuthenticated() ?
                          <NavLink exact to="/">Planning</NavLink>
                          : <NavLink exact to="/resetPassword">resetPassword</NavLink>
                      )
                    }
                    </AuthContext.Consumer>
                  </li>
                  <li>
                    <AuthContext.Consumer>
                    {(context) =>
                      (context.getIsAuthenticated() ?
                          <NavLink exact to="/schedule">Schedule</NavLink>
                          :<NavLink exact to="/signUp">signUp</NavLink>
                      )
                    }
                    </AuthContext.Consumer>
                  </li>
                  <li>
                    <AuthContext.Consumer>
                    {(context) =>
                      (context.getIsAuthenticated() &&
                          <NavLink exact to="/informations">Informations</NavLink>
                      )
                    }
                    </AuthContext.Consumer>
                  </li>
                  <li>
                    <AuthContext.Consumer>
                    {(context) =>
                      (context.getIsAuthenticated() &&
                          <NavLink exact to="/userHandler">UserHandler</NavLink>
                      )
                    }
                    </AuthContext.Consumer>
                  </li>
                  <li>
                    <AuthContext.Consumer>
                    {(context) =>
                      (context.getIsAuthenticated() &&
                          <NavLink exact to="/logout">Logout</NavLink>
                      )
                    }
                    </AuthContext.Consumer>
                  </li>
                  <li>
                    <AuthContext.Consumer>
                    {(context) =>
                      (context.getIsAuthenticated() &&
                          <NavLink exact to="/profile"> Profile</NavLink>
                      )
                    }
                    </AuthContext.Consumer>
                  </li>
                  </ul>
                </div>
              </nav>
          </div>
            </header>
            <div className="content text-light mt-5">
              <Switch>
                <Route exact path="/" component={Planning}/>
                <Route exact path="/templatePlanning" component={TemplatePlanning}/>
                <Route exact path="/schedule" component={Schedule}/>
                <Route exact path="/informations" component={Informations}/>
                <Route exact path="/userHandler" component={UserHandler}/>
                <Route exact path="/logout" component={Logout}/>
                <Route exact path="/profile" component={Profile}/>

                <Route exact path="/login" component={Login}/>
                <Route exact path="/resetPassword" component={ResetPassword}/>
                <Route exact path="/signup" component={Signup}/>

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