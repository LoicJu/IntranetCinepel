import React, { Component } from 'react';
import { AuthContext } from './AuthProvider';
import { Redirect } from 'react-router';

class Schedule extends Component {
  static contextType = AuthContext
  render() {
    if (!this.context.getIsAuthenticated()) {
      return (<Redirect to ="/login"/>);
    }
    return (
      <div className="intranet_classic">
        <div className="container">
          Bonjour, voici les horaires
        </div>
      </div>
      );
  }
}

export default Schedule;