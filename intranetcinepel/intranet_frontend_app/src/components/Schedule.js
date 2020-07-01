
import React, { Component } from 'react';
import { AuthContext } from './AuthProvider';
import { Redirect } from 'react-router';
import Error from './Error';
import axios from 'axios';
import { Button} from 'react-materialize';

class Schedule extends Component {
  static contextType = AuthContext
  constructor(props) {
    super(props);
    this.state={
      datasSchedule : null,
      error: null
    };
    this.showSchedule = this.showSchedule.bind(this);
  };

  showSchedule(){
    axios({
      method: 'get',
      headers: "'Access-Control-Allow-Origin':true",
      mode: 'cors',
      url: 'http://ticketapi.cinepel.ch:11709/2.0/tms?apikey=C1n3pelX4TMSNE5Qx4',
    })
    .then((response) => {
      console.log(response)
      if (response.status === 200) {
        console.log(response)
        setState({
          datasSchedule : response.data
        })
      }
    })
    .catch((error) => {
      console.log(error)
      if(error.response) {
        console.log(error.response)
        this.setState({
          error: {
            status: error.response.status + ' ' + error.response.statusText,
            detail: error.response.data.detail,
          }
        });
      }
    });
  }

  componentDidMount(){
    // get the schedule
    axios({
      method: 'get',
      headers: '"Access-Control-Allow-Origin":"*"',
      url: 'http://ticketapi.cinepel.ch:11709/2.0/tms?apikey=C1n3pelX4TMSNE5Qx4',
    })
    .then((response) => {
      console.log(response)
      if (response.status === 200) {
        console.log(response)
        setState({
          datasSchedule : response.data
        })
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
  };

  render() {
    if (!this.context.getIsAuthenticated()) {
      return (<Redirect to ="/login"/>);
    }
    return (
      <div className="intranet_classic">
        <div className="container">
          Bonjour, voici les horaires
          <Button className="buttonCreate" variant="info" onClick={this.showSchedule}>Sauvegarder</Button>
        </div>
      </div>
      );
  }
}

export default Schedule;