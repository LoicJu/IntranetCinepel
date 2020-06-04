import React, { Component } from 'react';
import { AuthContext } from './AuthProvider';
import { Redirect } from 'react-router';
import Error from './Error';
import axios from 'axios';

class Planning extends Component {
  static contextType = AuthContext
  constructor(props) {
    super(props);
    this.state={
      planning : [],
      dateCalendar : 'test',
      error: null,
    };
    this.getCalendar = this.getCalendar.bind(this);
  };
  

  getCalendar(){
    axios({
      method: 'get',
      url: 'api/calendar/1',
    })
    .then((response) => {
      if (response.status === 200) {
        this.setState({
          dateCalendar : response.data.date,
          planning: response.data.specific_content,
        });
      }
    })
    .catch((error) => {
      if(error.response) {
        this.setState({
          error: {
            status: error.response.status + ' ' + error.response.statusText,
            detail: error.response.data.detail,
          }
        });
      }
    });
  }
  
  render(){
    if (!this.context.getIsAuthenticated()) {
      return (<Redirect to ="/login"/>);
    }
    if (this.state.error) {
      return (<Error status={this.state.error.status} detail={this.state.error.detail}/>);
    }
    return (
      <div className="container">
        <div className="intranet_classic">
          <h1>Calendar</h1>
          <button onClick={this.getCalendar}>get</button>
          <h2>{this.state.dateCalendar}</h2>
        </div>
       </div>
    );
  }
}

export default Planning;