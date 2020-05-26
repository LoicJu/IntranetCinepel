import React, { Component } from 'react';
import { AuthContext } from './AuthProvider';

class Informations extends Component {
  
render() {
  return (
    <AuthContext.Consumer>
    {(context) =>
      (context.getIsAuthenticated()
        ? <p>Bonjour page info</p>
        : <p>help get back to login</p>
      )
    }
    </AuthContext.Consumer>
    );
  }
}

export default Informations;