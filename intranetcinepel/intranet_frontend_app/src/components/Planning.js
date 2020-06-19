import React, { Component } from 'react';
import { AuthContext } from './AuthProvider';
import { Redirect } from 'react-router';
import Error from './Error';
import axios from 'axios';
import Select from 'react-select';
import 'materialize-css';
import { Button} from 'react-materialize';
import {ShowTable} from './Table';
import {getCurrentDate, getMonthName, getDayName, getDaysInMonth} from './Utils';
import MonthPickerInput from 'react-month-picker-input';
import regeneratorRuntime from "regenerator-runtime";
require('react-month-picker-input/dist/react-month-picker-input.css');



class Planning extends Component {
  static contextType = AuthContext
  constructor(props) {
    super(props);
    this.state={
      // to choose from the different templates
      idTemplateGet : null,
      idTemplate : null,
      nameIdTemplate : {},
      nameAllTemplate : [],
      // content of the planning
      content : [{}],
      // the specific content from the planning
      specificContent : [{}],
      // date of the calendar
      datePlanningGet : '',
      // to show all the planning, the "name" of the planning is the date
      nameIdPlanning : {},
      nameAllPlanning : [],
      // to get the current planning
      idPlanningDel : null,
      // data to submit
      specificContentToSubmit : [{}],
      // the date of the planning we'll create 
      datePlanningSubmit : new Date(2020, 5, 1, 0, 0, 0, 0),
      // to show created, delete, error
      is_created : false,
      is_delete : false,
      error: null,
    };
    this.pickAMonth = React.createRef();

    this.handleGetPlanning = this.handleGetPlanning.bind(this);

    this.submitPlanning = this.submitPlanning.bind(this);
    this.handleChangeSubmit = this.handleChangeSubmit.bind(this);
    this.handleChangeSubmitMonth = this.handleChangeSubmitMonth.bind(this);

    this.handleChangeDel = this.handleChangeDel.bind(this);
    this.deletePlanning = this.deletePlanning.bind(this);;
  };
  
  handleChangeState(){
    axios({
      method: 'get',
      url: 'api/calendar/',
    })
    .then((response) => {
      if (response.status === 200) {
        this.setState({
          nameAllPlanning: [],
          nameIdPlanning : {},
        });
        Object.keys(response.data).forEach(key => this.state.nameAllPlanning.push({"value" : response.data[key].date, "label" : response.data[key].date}));
        Object.keys(response.data).forEach(key => this.state.nameIdPlanning[response.data[key].date] = response.data[key].id);
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

  // get the correct id of the template from the calendar we want to submit
  handleChangeSubmit(event){
    let id = this.state.nameIdTemplate[event.value];
    this.setState({idTemplate : id});
  };

  handleChangeSubmitMonth(event){
    let dateEvent = event.split('/')
    // year, month, day, hours, minutes, seconds, milliseconds
    this.setState({datePlanningSubmit : new Date(dateEvent[1], dateEvent[0]-1, 1, 0, 0, 0, 0)});
  }
  // store a new calendar TODO test if calendar for this month already exist
  async submitPlanning() {
    let authed_user = sessionStorage.getItem('authed_user');

    // to get all the content from the template
    await axios({
      method: 'get',
      url: 'api/template/' + this.state.idTemplate,
    })
    .then(response => {
      if (response.status === 200) {
        this.setState({
          content : response.data.template_content,
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
    // parsing the content of the template in the content of the planning
    this.parseTemplateToPlanning()
    // we create the formData to post
    var planningFormData = new FormData();
    planningFormData.append('id_template', this.state.idTemplate);
    planningFormData.append('id_creator', authed_user);
    planningFormData.append('date', this.state.datePlanningSubmit);
    planningFormData.append('specific_content', JSON.stringify(this.state.specificContentToSubmit));
    axios({
      method: 'post',
      url: 'api/calendar/',
      data: planningFormData,
    })
    .then((response) => {
      if (response.status === 201) {
        this.handleChangeState();
        this.setState({ is_created: true });
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

  parseTemplateToPlanning(){
    const month = this.state.datePlanningSubmit.getMonth();
    const year = this.state.datePlanningSubmit.getFullYear();
    const days = getDaysInMonth(month, year);
    const dataTemplate = this.getRowsDataTemplate();
    let allData = [];
    const dayOfWeek = (days[0].getDay() + 6) % 7;
    // we parse for all the day in the month
    days.forEach(function(day){
      let numberDate = day.getDate()
      let dayToParse = (numberDate-1 + dayOfWeek);
      let dataTempCopy = JSON.parse(JSON.stringify(dataTemplate));
      let dataToPush = dataTempCopy[dayToParse%28];
      let strDate = getDayName(day) + ' ' + numberDate;
      dataToPush.Date = strDate;
      allData.push(dataToPush);
      }
    );
    this.setState({
      specificContentToSubmit: allData,
    });
  }

  // change the id from the selected name
  handleChangeDel(event){
    let id = this.state.nameIdPlanning[event.value]
    this.setState({idPlanningDel : id});
  }

  // delete a planning
  deletePlanning(){
    axios({
      method: 'delete',
      url: 'api/calendar/' + this.state.idPlanningDel,
    })
    .then((response) => {
      if (response.status === 204) {
        this.handleChangeState()
        this.setState({
          is_delete: true,
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
  
  // get the chosen calendar
  handleGetPlanning(event){
    let id = this.state.nameIdPlanning[event.value]
    axios({
      method: 'get',
      url: 'api/calendar/' + id,
    })
    .then((response) => {
      if (response.status === 200) {
        this.setState({
          datePlanningGet : new Date(response.data.date),
          specificContent : response.data.specific_content,
          idTemplateGet : response.data.id_template,
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
  
  // get all templates names and plannings names 
  componentDidMount(){
    axios({
      method: 'get',
      url: 'api/template/',
    })
    .then((response) => {
      if (response.status === 200) {
        Object.keys(response.data).forEach(key => this.state.nameAllTemplate.push({"value" : response.data[key].name, "label" : response.data[key].name}));
        Object.keys(response.data).forEach(key => this.state.nameIdTemplate[response.data[key].name] = response.data[key].id);
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
    axios({
      method: 'get',
      url: 'api/calendar/',
    })
    .then((response) => {
      if (response.status === 200) {
        Object.keys(response.data).forEach(key => this.state.nameAllPlanning.push({"value" : response.data[key].date, "label" : response.data[key].date}));
        Object.keys(response.data).forEach(key => this.state.nameIdPlanning[response.data[key].date] = response.data[key].id);
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

  getRowsDataTemplate = function(){
    var items = this.state.content;
    return items.map((row, index)=>{
      return row
    })
  }

  // this functions get the datas from the database and parse them for the react table
  getHeader = function(){
    var keys = this.getKeys();
    var nestedKeys = this.getNestedKeys();
    return keys.map((key, index)=>{
      let isNested = false;
      let nesting = [];
      for(var obj in nestedKeys){
        if (nestedKeys[obj].key == key){
          isNested = true;
          nesting.push({'Header' : nestedKeys[obj].value  ,  'accessor' : nestedKeys[obj].value },);
        }
      }
      if(isNested){
        return{
          Header: key,
          columns:nesting,
        }
      }
      else{
        return {
          Header: key,
          accessor: key
        };
      }
    })
  }

  getNestedKeys = function(){
    let nestedKeys = [];
    for (var keyCont in this.state.specificContent[0]){
      for (var value in this.state.specificContent[0][keyCont]){
        if(this.state.specificContent[0][keyCont] instanceof Object){
          nestedKeys.push({
            key : keyCont,
            value : value
          })
        }
      } 
    }
    return nestedKeys;
  }
  getKeys = function(){
    return Object.keys(this.state.specificContent[0]);
  }

  getRowsData = function(){
    var items = this.state.specificContent;
    return items.map((row, index)=>{
      return row
    })
  }

  render(){
    // data to parse in table
    const columns= this.getHeader();
    const content_data = this.getRowsData();
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
          <form onSubmit={this.submitPlanning}>
            <div className="form-group">
              <label>Template de base</label>
              <Select 
                placeholder="Choisissez le template de base"
                onChange={this.handleChangeSubmit}
                options={this.state.nameAllTemplate}
              />
            </div>
            <div className="form-group">
              <label>Date</label>
              <MonthPickerInput
                year={2020}
                month={5}
                onChange={this.handleChangeSubmitMonth}
              />
            </div>
            <div className="form-group">
              <Button type="submit" variant="info">
              Créer
              </Button>
            </div>
          </form>
          <Select 
            placeholder="Choisissez le planning à supprimer"
            onChange={this.handleChangeDel}
            options={this.state.nameAllPlanning}
          />
          <Button onClick={this.deletePlanning} className="btn btn-danger">supprimer</Button>
          <Select 
            placeholder="Choisissez le planning"
            onChange={this.handleGetPlanning}
            options={this.state.nameAllPlanning}
          />
          <div className="container">
            <h2></h2>
            
          </div>
        </div>
       </div>
    );
  }
}

export default Planning;