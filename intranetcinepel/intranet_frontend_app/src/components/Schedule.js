
import React, { Component } from 'react';
import { AuthContext } from './AuthProvider';
import { Redirect } from 'react-router';
import Error from './Error';
import axios from 'axios';
import regeneratorRuntime from "regenerator-runtime";
import { Button} from 'react-materialize';


class Schedule extends Component {
  _isMounted = false;
  static contextType = AuthContext
  constructor(props) {
    super(props);
    this.state={
      datasSchedule : null,
      error: null
    };
    this.deleteSC = this.deleteSC.bind(this)
  };

  deleteSC(){
    /*axios({
      method: 'delete',
      url: 'api/schedule/1',
    })
    .then((response) => {
      if (response.status === 204) {
      }
    })
    .catch((error) => {
      if(error.response) {
      }
    });*/
    const parser = new DOMParser();
    console.log(this.state.datasSchedule)
    const xml = parser.parseFromString(this.state.datasSchedule, 'text/xml');
    console.log(xml.querySelector('Screen').firstChild.textContent);
  }

  async componentDidMount(){
    this._isMounted = true;
    // get the schedule we'll always get the first one that'll be updated
    
    await axios({
      method: 'get',
      url: 'api/schedule/1',
    })
    .then((response) => {
      if (response.status === 200) {
        if (this._isMounted){
          var xmlParse = (response.data.content).slice(2,-1)
          xmlParse = xmlParse.replaceAll("\\r","")
          xmlParse = xmlParse.replaceAll("\\t","")
          xmlParse = xmlParse.replaceAll("\\n","")
          this.setState({
            datasSchedule : xmlParse
          })
          console.log("test")
        }
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
    console.log("re")
  };

  componentWillUnmount() {
    this._isMounted = false;
  }
  
  render() {
    if (!this.context.getIsAuthenticated()) {
      return (<Redirect to ="/login"/>);
    }
    return (
      <div className="intranet_classic">
        <div className="container">
          Bonjour, voici les horaires
          <div>
          <Button className="buttonCreate" variant="info" onClick={this.deleteSC}>Sauvegarder</Button>
          </div>
        </div>
      </div>
      );
  }
}

export default Schedule;