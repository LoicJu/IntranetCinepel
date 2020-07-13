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
              <nav>
                <div className="brand-logo left hide-on-med-and-down">
                  <NavLink exact to="/">
                    <img className="logo-img" src="/static/frontend/logo/cinepel_logo.png" alt="cinepel_logo"/>
                  </NavLink>
                </div>
                <div className="right">
                  <ul className="right">
                    <li>
                      <AuthContext.Consumer>
                      {(context) =>
                        (context.getIsAuthenticated() && context.getIsManager() &&
                            <NavLink exact to="/templatePlanning">Template Planning</NavLink>
                        )
                      }
                      </AuthContext.Consumer>
                      <AuthContext.Consumer>
                      {(context) =>
                        (!context.getIsAuthenticated() &&
                            <NavLink to="/login">Se connecter</NavLink>
                        )
                      }
                      </AuthContext.Consumer>
                    </li>
                    <li>
                      <AuthContext.Consumer>
                      {(context) =>
                        (context.getIsAuthenticated() ?
                            <NavLink exact to="/">Planning</NavLink>
                            : <NavLink exact to="/resetPassword">Oublié son mot de passe ?</NavLink>
                        )
                      }
                      </AuthContext.Consumer>
                    </li>
                    <li>
                      <AuthContext.Consumer>
                      {(context) =>
                        (context.getIsAuthenticated() &&
                            <NavLink exact to="/schedule">Horaire</NavLink>
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
                            <NavLink exact to="/profile">Profil</NavLink>
                        )
                      }
                      </AuthContext.Consumer>
                    </li>
                    <li>
                      <AuthContext.Consumer>
                      {(context) =>
                        (context.getIsAuthenticated() && context.getIsManager() &&
                            <NavLink exact to="/userHandler">Gérer les utilisateurs</NavLink>
                        )
                      }
                      </AuthContext.Consumer>
                    </li>
                    <li>
                      <AuthContext.Consumer>
                      {(context) =>
                        (context.getIsAuthenticated() &&
                            <NavLink exact to="/logout">Se déconnecter</NavLink>
                        )
                      }
                      </AuthContext.Consumer>
                    </li>
                  </ul>
                </div>
              </nav>
            </header>
            <div className="content text-light mt-5">
              <Switch>
                <Route exact path="/" component={Planning}/>
                <Route exact path="/templatePlanning" component={TemplatePlanning}/>
                <Route exact path="/schedule" component={Schedule}/>
                <Route exact path="/informations" component={Informations}/>
                <Route exact path="/userHandler" component={UserHandler}/>
                <Route exact path="/profile" component={Profile}/>
                <Route exact path="/logout" component={Logout}/>

                <Route exact path="/login" component={Login}/>
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