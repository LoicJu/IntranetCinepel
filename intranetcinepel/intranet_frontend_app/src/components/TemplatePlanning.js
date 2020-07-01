import React, { Component } from 'react';
import { AuthContext } from './AuthProvider';
import { Redirect } from 'react-router';
import Error from './Error';
import axios from 'axios';
import Select from 'react-select';
import { Button} from 'react-materialize';
import {setDatas, getHeader, getRowsData} from './Utils';
import {ShowTable} from './Table';
import Modal from 'react-modal';

// some custom style for the modals
const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

class TemplatePlanning extends Component {
  static contextType = AuthContext
  constructor(props) {
    super(props);
    this.state={
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
    axios({
      method: 'get',
      url: 'api/template/',
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
    axios({
      method: 'post',
      url: 'api/template/',
      data: templateFormData,
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

  // handle change and get 
  handleChangeGet(event){
    let id = this.state.nameIdTemplate[event.value]
    axios({
      method: 'get',
      url: 'api/template/' + id,
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
  };
  
  handleChangeDel(event){
    this.setState({nameDel: event.value});
  };

  // delete a template
  deleteTemplate(){
    // close the modal
    this.handleCloseModalDelete();
    // get id of template
    let id = this.state.nameIdTemplate[this.state.nameDel]
    axios({
      method: 'delete',
      url: 'api/template/' + id,
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
  };
  
  // put, update the tempalte
  saveTemplate(){
    const datasToSet = setDatas(this.state.content);
    this.setState({content: datasToSet})
    let id = this.state.nameIdTemplate[this.state.nameTemplate];
    var templateSaveData = new FormData();
    let dataTemplate = JSON.stringify(this.state.content);
    templateSaveData.append('template_content', dataTemplate);
    axios({
      method: 'put',
      url: 'api/template/' + id + '/',
      data: templateSaveData,
    })
    .then((response) => {
      if (response.status === 204) {
        this.setState({
          is_save: true,
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
  };

  
  componentDidMount(){
    //to define the element modal
    Modal.setAppElement('body');
    // get all templates
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
  };

  render(){
    let table = <div></div>;
    let button = <div></div>;
    if (!this.context.getIsAuthenticated() || !this.context.getIsManager()) {
      return (<Redirect to ="/login"/>);
    }
    if (this.state.error) {
      return (<Error status={this.state.error.status} detail={this.state.error.detail}/>);
    }
    if(this.state.is_get){
      table = <ShowTable columns={getHeader(this.state.content)} dataSend={getRowsData(this.state.content)} isManager={this.context.getIsManager()}/>
      button = <Button variant="info" onClick={this.saveTemplate}>Sauvegarder</Button>
    }
    return (
      <div className="intranet_classic">
        <div className="container">
          <h1>Template</h1>
            <Button variant="info" onClick={this.handleShowModalCreate}>Créer un template</Button>
            <Button variant="info" onClick={this.handleShowModalDelete}>Supprimer un template</Button>
            <Modal
              isOpen={this.state.showModalCreate}
              onRequestClose={this.handleCloseModalCreate}
              style={customStyles}
              contentLabel="Créer un template"
            >
              <form onSubmit={this.submitTemplate}>
                <div className="form-group">
                  <label>name</label>
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
              isOpen={this.state.showModalDelete}
              onRequestClose={this.handleCloseModalDelete}
              style={customStyles}
              contentLabel="Créer un template"
            >
              <h4>Choisissez le template à supprimer</h4>
              <Select 
                onChange={this.handleChangeDel}
                options={this.state.nameAllTemplate}
              />
              <br>
              </br>
              <Button onClick={this.deleteTemplate} className="btn btn-danger">supprimer</Button>
            </Modal>
            <Select 
              placeholder="Choisissez le template"
              onChange={this.handleChangeGet}
              options={this.state.nameAllTemplate}
            />
          </div>
          <div>
            <h2>{this.state.nameTemplate}</h2>
            {table}
          </div>
          {button}
       </div>
    );
  }
}

export default TemplatePlanning;