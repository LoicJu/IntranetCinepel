import React, { Component } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthProvider';
import { Redirect } from 'react-router';
class userHandler extends Component {
  static contextType = AuthContext

  constructor(props){
    super(props);
    this.state = {
      users: [],
      error: null,
    };
  }
  // TODO edit and delete
  // TODO state loader and placeholder for loading ?
  //fetch all users in users
  componentDidMount(){
    axios({
      method: 'get',
      url: 'api/users/all',
    })
    .then((response) => {
      if (response.status === 200) { //add test if connected and manager
        let allData = this.state.users;
        response.data.map(user => allData.push(user));
        this.setState({
          users: allData,
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
    let usersList = [];
    this.state.users.map(User =>{
      usersList.push(
        <li className="collection-item" key={User.id}> {User.username}</li>
      )
    });

    if (!this.context.getIsAuthenticated()) {
      return (<Redirect to ="/login"/>);
    }
    if (this.state.error) {
      return (<Error status={this.state.error.status} detail={this.state.error.detail}/>);
    }
    return (
      <div className="result-container" id="result-container">
      {this.state.users.length > 0
        ? <div className="intranet_classic">
          <ul className="collection with-header">
            <li className="collection-header"><h4>Employés</h4></li>
            {usersList}
          </ul>    
        </div> 
        : <h3 className="text-dark text-center">{this.state.loaded == true && 'No users found...'}</h3>
      }
      {this.state.loaded == false &&
        <div className="text-center">
          <div className="loadingio-spinner-rolling-oq809e0ojtq">
            <div className="ldio-5u0wj89ps2u">
              <div></div>
            </div>
          </div>
        </div>
      }
      </div>
      );
  }
}

export default userHandler;