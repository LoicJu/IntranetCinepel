import React, { Component } from 'react';
import { AuthContext } from './AuthProvider';
import { Redirect } from 'react-router';
import Error from './Error';

class Planning extends Component {
  static contextType = AuthContext

  state={
    error: null,
  }
  render(){
    if (!this.context.getIsAuthenticated()) {
      return (<Redirect to ="/login"/>);
    }
    if (this.state.error) {
      return (<Error status={this.state.error.status} detail={this.state.error.detail}/>);
    }
    return (
      <div>
        <div className="intranet_classic">
          <p>hello</p>
        </div>
      </div>
      );
  }
}

export default Planning;