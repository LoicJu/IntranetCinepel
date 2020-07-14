import React, { Component } from 'react';
import { AuthContext } from './AuthProvider';
import { Redirect } from 'react-router';
import Error from './Error';
import axios from 'axios';
import Select from 'react-select';
import { Button, Collection , CollectionItem} from 'react-materialize';
import {setDatas, getHeader, getRowsData} from './Utils';
import {ShowTable, updateTableWeekends} from './Table';
import "react-responsive-modal/styles.css";
import Modal from 'react-responsive-modal';


class TemplatePlanning extends Component {
  _isMounted = false;
  static contextType = AuthContext
  constructor(props) {
    super(props);
    this.state={
      users: [],
      namePost : '',
      nameDel : '',
      nameTemplate : '',
      nameIdTemplate : {},
      nameAllTemplate : [],
      content : [{}],
      // to show or not modals
      showModalCreate : false,
      showModalDelete : false,
      // to show is create or get etc.
      is_get : false,
      is_created : false,
      is_save : false,
      error : null,
      is_delete : null,
    };
    this.handleChangePost = this.handleChangePost.bind(this);
    this.handleChangeGet = this.handleChangeGet.bind(this);
    this.handleChangeDel = this.handleChangeDel.bind(this);

    this.submitTemplate = this.submitTemplate.bind(this);
    this.deleteTemplate = this.deleteTemplate.bind(this);
    this.saveTemplate = this.saveTemplate.bind(this);

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
    axios.get('api/template/', {
      headers: {
        'Authorization': "Token " + this.context.getToken()
      }
    })
    .then((response) => {
      if (response.status === 200) {
        this.setState({
          nameAllTemplate: [],
          nameIdTemplate : {},
        });
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
  };

  handleChangePost(event){    
    this.setState({namePost: event.target.value});
  };

  // store a new template
  submitTemplate(event) {
    event.preventDefault();

    //close the modal
    this. handleCloseModalCreate();
    // get the current user
    let authed_user = sessionStorage.getItem('authed_user');

    // create the datas to post
    var templateFormData = new FormData();
    templateFormData.append('name', this.state.namePost);
    templateFormData.append('id_create', authed_user);
    axios.post('api/template/', templateFormData ,{
      headers: {
        'Authorization': "Token " + this.context.getToken()
      }
    })
    .then((response) => {
      if (response.status === 201) {
        this.handleChangeState();
        this.setState({ is_created: true });
        var toastHTML = '<span className="toast">Template créé</span>';
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
  };

  // handle change and get 
  handleChangeGet(event){
    let id = this.state.nameIdTemplate[event.value]
    axios.get('api/template/' + id, {
      headers: {
        'Authorization': "Token " + this.context.getToken()
      }
    })
    .then(response => {
      if (response.status === 200) {
        this.setState({
          nameTemplate : response.data.name,
          content : response.data.template_content,
          is_get : true,
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
  };
  
  // to handle the change of the select for the state
  handleChangeDel(event){
    this.setState({nameDel: event.value});
  };

  // delete a template
  deleteTemplate(){
    // close the modal
    this.handleCloseModalDelete();
    // get id of template
    let id = this.state.nameIdTemplate[this.state.nameDel]
    axios.delete('api/template/' + id, {
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
        var toastHTML = '<span className="toast">Template supprimé</span>';
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
  };
  
  // put, update the tempalte
  saveTemplate(){
    const datasToSet = setDatas(this.state.content);
    this.setState({content: datasToSet})
    let id = this.state.nameIdTemplate[this.state.nameTemplate];
    var templateSaveData = new FormData();
    let dataTemplate = JSON.stringify(this.state.content);
    templateSaveData.append('template_content', dataTemplate);
    axios.put('api/template/' + id + '/', templateSaveData,{
      headers: {
        'Authorization': "Token " + this.context.getToken()
      }
    })
    .then((response) => {
      if (response.status === 204) {
        this.setState({
          is_save: true,
        });
        var toastHTML = '<span className="toast">Template mis à jour</span>';
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
  };

  
  componentDidMount(){
    this._isMounted = true;
    if(this._isMounted)
    {
      // get all templates
      axios.get('api/template/',{
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
      // fetch all users
      axios.get('api/users/all',{
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
    }
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
    let table = <div></div>;
    let button = <div></div>;
    if (!this.context.getIsAuthenticated() || !this.context.getIsManager()) {
      return (<Redirect to ="/login"/>);
    }
    if (this.state.error) {
      return (<Error status={this.state.error.status} detail={this.state.error.detail}/>);
    }
    if(this.state.is_get){
      table = <ShowTable columns={getHeader(this.state.content)} dataSend={getRowsData(this.state.content)} isManager={this.context.getIsManager()} usernameList={usernameList}/>
      button = <Button className="button-create" onClick={this.saveTemplate}>Sauvegarder</Button>
    }
    return (
      <div className="intranet-classic">
        <datalist id="userlist">
          {usernameList}
        </datalist>
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="center">
                <h1>Template</h1>
                <Button className="button-create" onClick={this.handleShowModalCreate}>Créer un template</Button>
                <Button className="button-delete" onClick={this.handleShowModalDelete}>Supprimer un template</Button>
                <Select 
                  placeholder="Choisissez le template"
                  onChange={this.handleChangeGet}
                  options={this.state.nameAllTemplate}
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
              <form onSubmit={this.submitTemplate}>
                <div className="form-group">
                  <label>nom</label>
                  <input
                    name="name"
                    type="text"
                    className="form-control"
                    value={this.state.name}
                    onChange={this.handleChangePost}
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
              <h4>Choisissez le template à supprimer</h4>
              <p>
                <Select 
                  onChange={this.handleChangeDel}
                  options={this.state.nameAllTemplate}
                />
              </p>
              <p>
                <Button onClick={this.deleteTemplate} className="btn btn-danger">supprimer</Button>
              </p>
            </Modal>
        </div>
        <div className="table-container">
          <h2>{this.state.nameTemplate}</h2>
          {table}
        </div>
        {button}
      </div>
    );
  }
}

export default TemplatePlanning;