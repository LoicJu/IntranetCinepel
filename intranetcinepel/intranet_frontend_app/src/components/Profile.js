import React, { Component } from 'react';
import { AuthContext } from './AuthProvider';
import { Redirect } from 'react-router';

class Profile extends Component {
  
render() {
  return (
    <AuthContext.Consumer>
    {(context) =>
      (context.getIsAuthenticated()
        ? <p>Bonjour page profile</p>
        : <p> Pas connecte</p>
      )
    }
    </AuthContext.Consumer>
    );
  }
}

export default Profile;