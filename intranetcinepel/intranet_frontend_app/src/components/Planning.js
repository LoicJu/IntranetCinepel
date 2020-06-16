import React, { Component } from 'react';
import { AuthContext } from './AuthProvider';
import { Redirect } from 'react-router';
import Error from './Error';
import axios from 'axios';
import Select from 'react-select';
import 'materialize-css';
import { Button} from 'react-materialize';
import {ShowTable} from './Table';
import {getCurrentDate, getMonth, getDay} from './DateUtils';
import MonthPickerInput from 'react-month-picker-input';
require('react-month-picker-input/dist/react-month-picker-input.css');

class Planning extends Component {
  static contextType = AuthContext
  constructor(props) {
    super(props);
    this.state={
      specificContent : [{}],
      idTemplate : null,
      nameIdTemplate : {},
      nameAllTemplate : [],
      dateCalendar : '',
      nameAllPlanning : '',
      nameIdPlanning : '',
      idPlanning : null,
      dateCalendarSubmit : null,
      is_created : false,
      is_delete : false,
      error: null,
    };
    this.pickAMonth = React.createRef()

    this.getPlanning = this.getPlanning.bind(this);
    this.submitPlanning = this.submitPlanning.bind(this);

    this.handleChangeSubmit = this.handleChangeSubmit.bind(this);
    this.handleChangeSubmitMonth = this.handleChangeSubmitMonth.bind(this)
  };
  
  handleChangeState(){
    axios({
      method: 'get',
      url: 'api/template/',
    })
    .then((response) => {
      if (response.status === 200) {
        this.setState({
          nameAllPlanning: [],
          nameIdPlanning : {},
        });
        Object.keys(response.data).forEach(key => this.state.nameAllPlanning.push({"value" : response.data[key].date, "label" : response.data[key].date}));
        Object.keys(response.data).forEach(key => this.state.nameIdTemplate[response.data[key].date] = response.data[key].id);
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
    let id = this.state.nameIdTemplate[event.value]
    this.setState({idPlanning : id});
  };

  handleChangeSubmitMonth(event){
    console.log(event)
  }
  // store a new calendar TODO test if calendar for this month already exist
  submitPlanning() {
    let authed_user = sessionStorage.getItem('authed_user');

    var planningFormData = new FormData();
    planningFormData.append('id_template', this.state.idTemplate);
    planningFormData.append('id_creator', authed_user);
    planningFormData.append('date', this.state.dateCalendarSubmit);
    planningFormData.append('specific_content', this.state.specificContent);
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
    
  }
  // change the id from the selected name
  handleChangeDel(event){
    let id = this.state.nameIdPlanning[event.value]
    this.setState({idPlanning : id});
  }

  // delete a planning
  deleteCalendar(){
    axios({
      method: 'delete',
      url: 'api/calendar/' + this.state.idPlanning,
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
  getPlanning(event){
    let id = this.state.nameIdPlanning[event.value]
    axios({
      method: 'get',
      url: 'api/calendar/' + id,
    })
    .then((response) => {
      if (response.status === 200) {
        this.setState({
          dateCalendar : response.data.date,
          specificContent : response.data.specific_content,
          idTemplate : response.data.id_template,
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

  // this functions get the datas from the database and parse them for the react table
  getHeader = function(){
    var keys = this.getKeys();
    var nestedKeys = this.getNestedKeys();
    return keys.map((key, index)=>{
      let isNested = false;
      let nesting = [];
      for(var obj in nestedKeys){
        if (nestedKeys[obj].key == key && nestedKeys[obj].key != "Date"){
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
      for (var test in this.state.specificContent[0][keyCont]){
        nestedKeys.push({
          key : keyCont,
          value : test
        })
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

  // TODO add a select to choose the date to create and to get
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
          <form onSubmit={this.getPlanning}>
            <div className="form-group">
            <Select 
              placeholder="Choisissez le planning"
              options={this.state.nameAllPlanning}
            />
            </div>
            <div className="form-group">
            <button type="submit" variant="info">afficher le calendrier</button>
            </div>
          </form>
          <Select 
            placeholder="Choisissez le planning à supprimer"
            onChange={this.handleChangeDel}
            options={this.state.nameAllPlanning}
          />
          <Button onClick={this.deleteTemplate} className="btn btn-danger">supprimer</Button>
          <div className="container">
            <h2>{this.state.dateCalendar}</h2>
            <ShowTable columns={columns} dataSend={content_data}/>
          </div>
        </div>
       </div>
    );
  }
}

export default Planning;