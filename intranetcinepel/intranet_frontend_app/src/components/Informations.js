import React, { Component } from 'react';
import { AuthContext } from './AuthProvider';
import { Redirect } from 'react-router';

class Informations extends Component {
  static contextType = AuthContext
  render() {
    if (!this.context.getIsAuthenticated()) {
      return (<Redirect to ="/login"/>);
    }
    return (
      <div className="intranet_classic">
        <div className="container">
          Bonjour, bienvenue sur le site intranet cinepel
        </div>
      </div>
      );
  }
}

export default Informations;