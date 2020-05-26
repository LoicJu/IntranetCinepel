import React, { Component } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthProvider';
import { Redirect } from 'react-router';
import Error from './Error';

class Planning extends Component {
  static contextType = AuthContext

  state={
    is_logged_in: false,
    error: null,
  }

  componentDidMount()
  {
    if (this.context.getIsAuthenticated())
    {
      this.setState({
        is_logged_in : true,
      });
    }
  }
  render(){
    if (!this.state.is_logged_in) {
      //return (<Redirect to ="/login"/>);
      return (
        <p>not connected</p>
        );
    }
    if (this.state.error) {
      return (<Error status={this.state.error.status} detail={this.state.error.detail}/>);
    }
    return (
      <p>hello</p>
      );
  }
}


export default Planning;