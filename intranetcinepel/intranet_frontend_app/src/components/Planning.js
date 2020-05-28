import React, { Component } from 'react';
import { AuthContext } from './AuthProvider';
import { Redirect } from 'react-router';
import Error from './Error';
import axios from 'axios';

class Planning extends Component {
  static contextType = AuthContext

  state={
    planning : [],
    error: null,
  }
  
  componentDidMount(){
    axios({
      method: 'get',
      url: '/calendar/1',
    })
    .then((response) => {
      if (response.status === 200) {
        let allData = this.state.planning;
        response.data.map(user => allData.push(user));
        this.setState({
          planning: allData,
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
        <div className="col-xs-12">
        <h1>Calendar</h1>
        {this.state.planning.map((planning) => (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{planning.title}</h5>
              <h6 className="card-subtitle mb-2 text-muted">            
              </h6>
            </div>
          </div>
        ))}
        </div>
       </div>
    );
  }
}

export default Planning;