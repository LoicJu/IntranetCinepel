import React, { Component } from 'react';
import { AuthContext } from './AuthProvider';
import { Redirect } from 'react-router';
import Error from './Error';
import axios from 'axios';
import Select from 'react-select';
import { Button, Collection , CollectionItem} from 'react-materialize';
import {ShowTable, updateTableWeekends} from './Table';
import {getMonthName, getDayName, getDaysInMonth, getRowsDataTemplate, setDatas, getHeader, getRowsData, sameDay} from './Utils';
import MonthPickerInput from 'react-month-picker-input';
import regeneratorRuntime from "regenerator-runtime";
import Modal from 'react-modal';
require('react-month-picker-input/dist/react-month-picker-input.css');


// some custom style for the modals
const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    overflow: 'visible'
  }
};

const customStylesCreate ={
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    overflow: 'visible'
  }
};

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
      // date of the calendar
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
  // store a new calendar test if calendar for this month already exist
  async submitPlanning() {
    let authed_user = sessionStorage.getItem('authed_user');
    // close modal
    this.handleCloseModalCreate();
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
  
  // get the chosen calendar
  async handleGetPlanning(event){
    let id = this.state.nameIdPlanning[event.value]
    await axios({
      method: 'get',
      url: 'api/calendar/' + id,
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
    axios({
      method: 'put',
      url: 'api/calendar/' + id + '/',
      data: planningSaveData,
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

  // get all templates names and plannings names 
  componentDidMount(){
    this._isMounted = true; 
    //to define the element modal
    Modal.setAppElement('body');
    // get all templates
    axios({
      method: 'get',
      url: 'api/template/',
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
    axios({
      method: 'get',
      url: 'api/calendar/',
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
    axios({
      method: 'get',
      url: 'api/users/all',
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
    // data to parse in table
    let table = <div></div>;
    let button = <div></div>;
    if (!this.context.getIsAuthenticated()) {
      return (<Redirect to ="/login"/>);
    }
    if(this.state.is_get){
      table = <ShowTable columns={getHeader(this.state.specificContent)} dataSend={getRowsData(this.state.specificContent)} isManager={this.context.getIsManager()}/>
      button = <Button className="buttonCreate" variant="info" onClick={this.savePlanning}>Sauvegarder</Button>
    }
    if(this.context.getIsManager()){
      return (
      <div className="intranet_classic">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="center">
                <h1>Planning</h1>
                <Button className="buttonCreate" variant="info" onClick={this.handleShowModalCreate}>Créer un planning</Button>
                <Button className="buttonCreate" variant="info" onClick={this.handleShowModalDelete}>Supprimer un planning</Button>
                <Select 
                  className="selectMonth"
                  placeholder="Choisissez le planning"
                  onChange={this.handleGetPlanning}
                  options={this.state.nameAllPlanning}
                />
              </div>
            </div>
            <div className="col-lg-6">
              {this.state.users.length > 0 &&
                <Collection className="template_planning_users">
                  {usersList}
                </Collection>
              }
            </div>
          </div>
          <Modal
            isOpen={this.state.showModalCreate}
            onRequestClose={this.handleCloseModalCreate}
            style={customStylesCreate}
            contentLabel="Créer un planning"
          >
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
                className="selectMonth"
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
            isOpen={this.state.showModalDelete}
            onRequestClose={this.handleCloseModalDelete}
            style={customStyles}
            contentLabel="Créer un template"
          >
          <h4>Choisissez le planning à supprimer</h4>
          <Select 
            onChange={this.handleChangeDel}
            options={this.state.nameAllPlanning}
          />
          <Button className="buttonCreate" onClick={this.deletePlanning} className="btn btn-danger">supprimer</Button>
          </Modal>
        </div>
        <div className="table-container">
          <h2>{this.state.namePlanning}</h2>
            {table}
        </div>
        {button}
      </div>
      );
    }
    if (this.state.error) {
      return (<Error status={this.state.error.status} detail={this.state.error.detail}/>);
    }
    return (
      <div className="intranet_classic">
        <div className="container">
          <h1>Planning</h1>
          <Select 
              placeholder="Choisissez le planning"
              onChange={this.handleGetPlanning}
              options={this.state.nameAllPlanning}
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