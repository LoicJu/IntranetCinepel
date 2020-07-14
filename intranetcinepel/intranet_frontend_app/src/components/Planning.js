import React, { Component } from 'react';
import { AuthContext } from './AuthProvider';
import { Redirect } from 'react-router';
import Error from './Error';
import axios from 'axios';
import Select from 'react-select';
import { Button, Collection , CollectionItem} from 'react-materialize';
import {ShowTable, updateTableWeekends} from './Table';
import {getMonthName, getDayName, getDaysInMonth, getRowsDataTemplate, setDatas, getHeader, getRowsData, sameDay, getHeaderPdf} from './Utils';
import MonthPickerInput from 'react-month-picker-input';
import regeneratorRuntime from "regenerator-runtime";
import "react-responsive-modal/styles.css";
import Modal from 'react-responsive-modal';

// for the month picker
require('react-month-picker-input/dist/react-month-picker-input.css');

// to export to pdf
import jsPDF from "jspdf";
import "jspdf-autotable";

class Planning extends Component {
  _isMounted = false;
  static contextType = AuthContext
  constructor(props) {
    super(props);
    this.state={
      //all users
      users: [],
      // to choose from the different templates
      idTemplateGet : null,
      idTemplate : null,
      nameIdTemplate : {},
      nameAllTemplate : [],
      // content of the planning
      content : [{}],
      // the specific content from the planning
      specificContent : [{}],
      // date of the planning
      datePlanningGet : '',
      // to show all the planning, the "name" of the planning is the date
      nameIdPlanning : {},
      nameAllPlanning : [],
      namePlanning : '',
      // to get the current planning
      idPlanningDel : null,
      // data to submit
      specificContentToSubmit : [{}],
      // the date of the planning we'll create 
      datePlanningSubmit : new Date(2020, 5, 1, 0, 0, 0, 0),
      // to show or not modals
      showModalCreate : false,
      showModalDelete : false,
      // to show created, delete, error
      is_created : false,
      is_delete : false,
      is_get : false,
      is_save : false,
      error: null,
    };
    this.pickAMonth = React.createRef();

    this.handleGetPlanning = this.handleGetPlanning.bind(this);

    this.submitPlanning = this.submitPlanning.bind(this);
    this.handleChangeSubmit = this.handleChangeSubmit.bind(this);
    this.handleChangeSubmitMonth = this.handleChangeSubmitMonth.bind(this);

    this.handleChangeDel = this.handleChangeDel.bind(this);
    this.deletePlanning = this.deletePlanning.bind(this);
    this.savePlanning = this.savePlanning.bind(this);
    this.exportPlanning = this.exportPlanning.bind(this);

    // handle modals
    this.handleShowModalCreate = this.handleShowModalCreate.bind(this);
    this.handleCloseModalCreate = this.handleCloseModalCreate.bind(this);
    this.handleShowModalDelete = this.handleShowModalDelete.bind(this);
    this.handleCloseModalDelete = this.handleCloseModalDelete.bind(this);
  };
  
  handleShowModalCreate(){
    this.setState({showModalCreate : true})
  }
  handleCloseModalCreate(){
    this.setState({showModalCreate : false})
  }
  handleShowModalDelete(){
    this.setState({showModalDelete : true})
  }
  handleCloseModalDelete(){
    this.setState({showModalDelete : false})
  }

  handleChangeState(){
    axios.get('api/planning/', {
      headers: {
        'Authorization': "Token " + this.context.getToken()
      }
    })
    .then((response) => {
      if (response.status === 200) {
        this.setState({
          nameAllPlanning: [],
          nameIdPlanning : {},
        });
        Object.keys(response.data).forEach
          (key => this.state.nameAllPlanning.push
              ({"value" : new Date(response.data[key].date), 
                "label" :  getMonthName(new Date(response.data[key].date)) + ' ' + (new Date(response.data[key].date)).getFullYear()}));
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

  // get the correct id of the template from the planning we want to submit
  handleChangeSubmit(event){
    let id = this.state.nameIdTemplate[event.value];
    this.setState({idTemplate : id});
  };

  handleChangeSubmitMonth(event){
    let dateEvent = event.split('/')
    // year, month, day, hours, minutes, seconds, milliseconds
    this.setState({datePlanningSubmit : new Date(dateEvent[1], dateEvent[0]-1, 1, 0, 0, 0, 0)});
  }
  // store a new planning test if planning for this month already exist
  async submitPlanning() {
    let authed_user = sessionStorage.getItem('authed_user');
    // close modal
    this.handleCloseModalCreate();
    // to get all the content from the template
    await axios.get('api/template/' + this.state.idTemplate, {
      headers: {
        'Authorization': "Token " + this.context.getToken()
      }
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
    // test if the planning for this month already exist.
    var alreadyExist = false
    this.state.nameAllPlanning.map(date=>{
      if(sameDay(date.value,this.state.datePlanningSubmit))
      {
        alreadyExist = true
      }
    })
    if(!alreadyExist)
    {
      // we create the formData to post
      var planningFormData = new FormData();
      planningFormData.append('id_template', this.state.idTemplate);
      planningFormData.append('id_creator', authed_user);
      planningFormData.append('date', this.state.datePlanningSubmit);
      planningFormData.append('specific_content', JSON.stringify(this.state.specificContentToSubmit));
      axios.post('api/planning/',  planningFormData, {
        headers: {
          'Authorization': "Token " + this.context.getToken()
        }
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
    }
  };

  parseTemplateToPlanning(){
    const month = this.state.datePlanningSubmit.getMonth();
    const year = this.state.datePlanningSubmit.getFullYear();
    const days = getDaysInMonth(month, year);
    const dataTemplate = getRowsDataTemplate(this.state.content);
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
    // close modal
    this.handleCloseModalDelete();
    axios.delete('api/planning/' + this.state.idPlanningDel, {
      headers: {
        'Authorization': "Token " + this.context.getToken()
      }
    })
    .then((response) => {
      if (response.status === 204) {
        this.handleChangeState()
        this.setState({
          is_delete: true,
        });
        var toastHTML = '<span className="toast">Planning supprimé</span>';
        M.toast({html: toastHTML});
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
  
  // get the chosen planning
  async handleGetPlanning(event){
    let id = this.state.nameIdPlanning[event.value]
    await axios.get('api/planning/' + id, {
      headers: {
        'Authorization': "Token " + this.context.getToken()
      }
    })
    .then((response) => {
      if (response.status === 200) {
        this.setState({
          datePlanningGet : new Date(response.data.date),
          specificContent : response.data.specific_content,
          idTemplateGet : response.data.id_template,
          is_get : true,
          namePlanning : getMonthName(new Date(response.data.date)) + ' ' + (new Date(response.data.date)).getFullYear(),
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
    updateTableWeekends();
  }

  savePlanning(){
    const datasToSet = setDatas(this.state.specificContent);
    this.setState({specificContent: datasToSet})
    let id = this.state.nameIdPlanning[this.state.datePlanningGet];
    var planningSaveData = new FormData();
    let dataPlanning = JSON.stringify(this.state.specificContent);
    planningSaveData.append('specific_content', dataPlanning);
    axios.put('api/planning/' + id + '/', planningSaveData,{
      headers: {
        'Authorization': "Token " + this.context.getToken()
      }
    })
    .then((response) => {
      if (response.status === 204) {
        this.setState({
          is_save: true,
        });
        var toastHTML = '<span className="toast">Planning créé</span>';
        M.toast({html: toastHTML});
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

  // to export to pdf
  exportPlanning(){
    
    var headerToParse = getHeaderPdf(this.state.specificContent)
    var headers=[[]]
    headerToParse.map(obj=> {
      if(obj.nesting){
        obj.nesting.forEach(elem => headers[0].push(elem.Header))
      }
      else{
        headers[0].push(obj.Header)
      }
    })
    var datasToParse = getRowsData(this.state.specificContent)
    var data = []
    datasToParse.map(obj=> data.push(Object.values(obj)))
    
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "landscape"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    var e = document.getElementById("selectMonth");
    const title = e.textContent;

    let content = {
      startY: 50,
      head: headers,
      body: data
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save(title + ".pdf")
    
  }

  // get all templates names and plannings names 
  componentDidMount(){
    this._isMounted = true; 
    // get all templates
    axios.get('api/template/', {
      headers: {
        'Authorization': "Token " + this.context.getToken()
      }
    })
    .then((response) => {
      if (response.status === 200) {
        if (this._isMounted){
          Object.keys(response.data).forEach(key => this.state.nameAllTemplate.push({"value" : response.data[key].name, "label" : response.data[key].name}));
          Object.keys(response.data).forEach(key => this.state.nameIdTemplate[response.data[key].name] = response.data[key].id);
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
    axios.get('api/planning/', {
      headers: {
        'Authorization': "Token " + this.context.getToken()
      }
    })
    .then((response) => {
      if (response.status === 200) {
        if (this._isMounted){
          Object.keys(response.data).forEach
          (key => this.state.nameAllPlanning.push
              ({"value" : new Date(response.data[key].date), 
                "label" :  getMonthName(new Date(response.data[key].date)) + ' ' + (new Date(response.data[key].date)).getFullYear()}));
          Object.keys(response.data).forEach(key => this.state.nameIdPlanning[response.data[key].date] = response.data[key].id);
          this.state.nameAllPlanning.sort((a,b) => a.value - b.value);
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
    // fetch all users
    axios.get('api/users/all', {
      headers: {
        'Authorization': "Token " + this.context.getToken()
      }
    })
    .then((response) => {
      if (response.status === 200) {
        if (this._isMounted){
          let allData = this.state.users;
          response.data.map(user => allData.push(user));
          this.setState({
            users: allData,
          });
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
  };

  componentWillUnmount() {
    this._isMounted = false;
  }
  render(){
    // get all the users
    let usersList = [];
    this.state.users.map(User =>{
      usersList.push(
        <CollectionItem key={User.id}>
          <h5>{User.username}</h5>
          <label>Informations : </label>{User.infos}<br></br>
          <label>Vacances : </label>{User.holidays}
        </CollectionItem>
      )
    });
    // to select in users when adding in template
    let usernameList = [];
    this.state.users.map(User =>{
      usernameList.push(<option key={User.id} value={User.username}></option>)
    })
    // data to parse in table
    let table = <div></div>;
    let buttonSave = <div></div>;
    let buttonExport = <div></div>
    if (!this.context.getIsAuthenticated()) {
      return (<Redirect to ="/login"/>);
    }
    if(this.state.is_get){
      table = <ShowTable columns={getHeader(this.state.specificContent)} dataSend={getRowsData(this.state.specificContent)} isManager={this.context.getIsManager()}/>
      buttonSave = <Button className="button-create" variant="info" onClick={this.savePlanning}>Sauvegarder</Button>
      buttonExport = <Button className="button-create" variant="info" onClick={this.exportPlanning}>Exporter en pdf</Button>
    }
    if(this.context.getIsManager()){
      return (
      <div className="intranet-classic">
        <datalist id="userlist">
          {usernameList}
        </datalist>
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="center">
                <h1>Planning</h1>
                <Button className="button-create" onClick={this.handleShowModalCreate}>Créer un planning</Button>
                <Button className="button-delete" onClick={this.handleShowModalDelete}>Supprimer un planning</Button>
                <Select 
                  id="selectMonth"
                  className="select-month"
                  placeholder="Choisissez le planning"
                  onChange={this.handleGetPlanning}
                  options={this.state.nameAllPlanning}
                  className="select-planning-template"
                />
              </div>
            </div>
            <div className="col-lg-6">
              {this.state.users.length > 0 &&
                <Collection className="show-users">
                  {usersList}
                </Collection>
              }
            </div>
          </div>
          <Modal
            open={this.state.showModalCreate}
            onClose={this.handleCloseModalCreate}
          >
          <br></br>
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
                className="select-month"
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
          </Modal>
          <Modal
            open={this.state.showModalDelete}
            onClose={this.handleCloseModalDelete}
          >
          <br></br>
          <h4>Choisissez le planning à supprimer</h4>
          <p>
            <Select 
              onChange={this.handleChangeDel}
              options={this.state.nameAllPlanning}
            />
          </p>
          <p>
            <Button className="button-delete" onClick={this.deletePlanning}>supprimer</Button>
          </p>
          </Modal>
        </div>
        <div className="table-container">
          <h2>{this.state.namePlanning}</h2>
            {table}
        </div>
        {buttonSave}
        {buttonExport}
      </div>
      );
    }
    if (this.state.error) {
      return (<Error status={this.state.error.status} detail={this.state.error.detail}/>);
    }
    return (
      <div className="intranet-classic">
        <div className="container">
          <h1>Planning</h1>
          <Select 
              placeholder="Choisissez le planning"
              onChange={this.handleGetPlanning}
              options={this.state.nameAllPlanning}
              className="select-planning-template"
            />
        </div>
        <div className="table-container">
          <h2>{this.state.namePlanning}</h2>
          {table}
        </div>
       </div>
    );
  }
}

export default Planning;