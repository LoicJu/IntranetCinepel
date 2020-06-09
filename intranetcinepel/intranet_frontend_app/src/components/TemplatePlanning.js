import React, { Component,useMemo, useState, useEffect } from 'react';
import { AuthContext } from './AuthProvider';
import { Redirect } from 'react-router';
import Error from './Error';
import axios from 'axios';
import Table from "./Table";
import {AppProvider, Page} from '@shopify/polaris';
import Select from 'react-select'

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
      columns : [],
      data : [],
      is_created : false,
      error : null,
      is_delete : null,
    };
    this.handleChangePost = this.handleChangePost.bind(this);
    this.handleChangeGet = this.handleChangeGet.bind(this);
    this.handleChangeDel = this.handleChangeDel.bind(this);
    this.submitTemplate = this.submitTemplate.bind(this);
    this.deleteTemplate = this.deleteTemplate.bind(this);
  };

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

  }

  handleChangePost(event){    
    this.setState({namePost: event.target.value});
  }

  // store a new template
  submitTemplate(event) {
    event.preventDefault();

    let authed_user = sessionStorage.getItem('authed_user');

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
  }

  // handle change and get 
  handleChangeGet(event){
    let id = this.state.nameIdTemplate[event.value]
    axios({
      method: 'get',
      url: 'api/template/' + id,
      responseType: 'json',
    })
    .then((response) => {
      if (response.status === 200) {
        this.state.columns = [];
        this.state.data = [];
        Object.keys(response.data.columns).forEach(key => this.state.columns.push(response.data.columns[key]));
        Object.keys(response.data.content).forEach(key => this.state.data.push(response.data.content[key]));
        this.setState({
          nameTemplate : response.data.name,
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
  
  handleChangeDel(event){
    this.setState({nameDel: event.value});
  }

  // delete a template
  deleteTemplate(){
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
  }
  
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
  }

  render(){
    if (!this.context.getIsAuthenticated()) {
      return (<Redirect to ="/login"/>);
    }
    if (this.state.error) {
      return (<Error status={this.state.error.status} detail={this.state.error.detail}/>);
    }
    return (
      <div className="container">
        <div className="intranet_classic">
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
              <button type="submit" className="btn btn-danger">créer</button>
            </div>
          </form>
          <Select 
            placeholder="Choisissez le template à supprimer"
            onChange={this.handleChangeDel}
            options={this.state.nameAllTemplate}
          />
          <button onClick={this.deleteTemplate}>supprimer</button>
          <Select 
            placeholder="Choisissez le template"
            onChange={this.handleChangeGet}
            options={this.state.nameAllTemplate}
         />
          <AppProvider>
            <Page title={this.state.nameTemplate}>
              <Table headings={this.state.columns} rows={this.state.data} />
            </Page>
          </AppProvider>
        </div>
       </div>
    );
  }
}

export default TemplatePlanning;