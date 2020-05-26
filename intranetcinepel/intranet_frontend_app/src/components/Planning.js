import React, { Component } from 'react';
import { AuthContext } from './AuthProvider';
import { Redirect } from 'react-router';

class Planning extends Component {
  
render() {
  return (
    <AuthContext.Consumer>
    {(context) =>
      (context.getIsAuthenticated()
        ? <p>Bonjour page Planning</p>
        : <p> Pas connecte TO LOGIN</p>
      )
    }
    </AuthContext.Consumer>
    );
  }
}

export default Planning;