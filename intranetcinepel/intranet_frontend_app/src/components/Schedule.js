
import React, { Component } from 'react';
import { AuthContext } from './AuthProvider';
import { Redirect } from 'react-router';
import Error from './Error';
import axios from 'axios';
import regeneratorRuntime from "regenerator-runtime";
import { Button} from 'react-materialize';
import Select from 'react-select';
import {onlyUnique, getHour, getDayDate, onlyUniqueDate, getDayNameDate} from './Utils'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

class Schedule extends Component {
  _isMounted = false;
  static contextType = AuthContext
  constructor(props) {
    super(props);
    this.state={
      datasSchedule : null,
      columns : [],
      rowData : {},
      dateData : [],
      rowDataSpecific: [],
      is_get : false,
      error: null
    };
    this.setSchedule = this.setSchedule.bind(this)
    this.handleChangeGet = this.handleChangeGet.bind(this)
  };


  setSchedule(){
    // parse the xml
    const parser = new DOMParser();
    const xml = parser.parseFromString(this.state.datasSchedule, 'text/xml');
    var columnsToSet = [];
    xml.querySelectorAll('Screen').forEach(screen => {
        columnsToSet.push(screen.firstChild.data)
      }
    );
    // take unique values
    var columnUnique = columnsToSet.filter(onlyUnique);
    // set state columns to the array
    this.state.columns.push({"headerName" : "heure", "field" : "heure"})
    Object.keys(columnUnique).forEach
      (key => this.state.columns.push
          ({"headerName" : columnUnique[key], "field" : columnUnique[key]})
      );
    
    // we parse the 4 datas we need
    var datasToRow = [];
    var datasDate = [];
    xml.querySelectorAll('Show').forEach(datas => {
      var eachData = [];
      datas.querySelectorAll('ShowTime').forEach(specificData =>{
          eachData.push(getDayDate(specificData.firstChild.data))
          datasDate.push(getDayDate(specificData.firstChild.data))
          eachData.push(getHour(specificData.firstChild.data))
        }
      );
      datas.querySelectorAll('Screen').forEach(specificData =>{
          eachData.push(specificData.firstChild.data)
        }
      );
      datas.querySelectorAll('Name').forEach(specificData =>{
          eachData.push(specificData.firstChild.data)
        }
      );
      datasToRow.push(eachData)
      }
    );

    // get only unique dates
    var uniqueDates = [];
    for (var i = 0; i < datasDate.length; i++) {
      if (!onlyUniqueDate(datasDate[i], uniqueDates)) {
        uniqueDates.push(datasDate[i]);
      }
    }
    // set all the date in dateData
    Object.keys(uniqueDates).forEach
      (key => this.state.dateData.push
          ({"value" : uniqueDates[key], "label" : getDayNameDate(uniqueDates[key])})
      );
    // set the datas in datasToRow
    Object.keys(datasToRow).forEach
      (key => this.state.rowData[datasToRow[key][0]] =
          {"heure": datasToRow[key][1],
            [datasToRow[key][2]]: datasToRow[key][3],
          }
      );    
  }

  handleChangeGet(event){
    for (const [key, value] of Object.entries(this.state.rowData)) {
      var dateRow = new Date(key)
      if(dateRow.getDate()==event.value.getDate()){
        this.state.rowDataSpecific.push(value)
      }
    }
    this.setState({is_get : true})
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
    if(this._isMounted){
      this.setSchedule()
    }
  };

  componentWillUnmount() {
    this._isMounted = false;
  }
  
  render() {
    let table = <div></div>;
    if (!this.context.getIsAuthenticated()) {
      return (<Redirect to ="/login"/>);
    }
    if (this.state.error) {
      return (<Error status={this.state.error.status} detail={this.state.error.detail}/>);
    }
    if(this.state.is_get){
      table = <div
      className="ag-theme-alpine tableUser"
      style={{
      width: '100%',
       }}
      >
      <AgGridReact
        columnDefs={this.state.columns}
        rowData={this.state.rowDataSpecific}>
      </AgGridReact>
      </div>
    }
    return (
      <div className="intranet_classic">
        <div className="container">
          <h2>Horaires</h2>
          <div>
          <Select 
            placeholder="Choisissez la date"
            onChange={this.handleChangeGet}
            options={this.state.dateData}
          />
          </div>
        </div>
        <div className="table-container-schedule">
        {table}
        </div>
      </div>
      );
  }
}

export default Schedule;