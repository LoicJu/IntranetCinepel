import React, { Component } from 'react';
import { AuthContext } from './AuthProvider';
import { Redirect } from 'react-router';

class Schedule extends Component {
  
render() {
  return (
    <AuthContext.Consumer>
    {(context) =>
      (context.getIsAuthenticated()
        ? <p>Bonjour page Schedule</p>
        : <p> Pas connecte</p>
      )
    }
    </AuthContext.Consumer>
    );
  }
}

export default Schedule;