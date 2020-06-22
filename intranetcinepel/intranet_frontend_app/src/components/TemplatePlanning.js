import React, { Component } from 'react';
import { AuthContext } from './AuthProvider';
import { Redirect } from 'react-router';
import Error from './Error';
import axios from 'axios';
import Select from 'react-select';
import { Button} from 'react-materialize';
import {ShowTable, getDatas} from './Table';

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
  };

  handleChangePost(event){    
    this.setState({namePost: event.target.value});
  };

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
  

  saveTemplate(){
    this.setDatas();
    let id = this.state.nameIdTemplate[this.state.nameTemplate];
    var templateSaveData = new FormData();
    let dataTemplate = JSON.stringify(this.state.content);
    templateSaveData.append('template_content', dataTemplate);
    console.log(dataTemplate)
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
  
  setDatas = function(){
    let datasContent = this.state.content;
    let datasToSave = getDatas();
    datasContent.map((row, index)=>{
      Object.entries(row).map(([key1,value1])=>{
        if(typeof value1 === 'object'){
          Object.entries(value1).map(([key2,value2])=>{
            if(key2 in datasToSave[index]){
              datasContent[index][key1][key2] = datasToSave[index][key2]
            }
          })
        }
        else{
          if(key1 in datasToSave[index]){
            datasContent[index][key1] = datasToSave[index][key1]
          }
        }
      });
    });
    // no need to setState because datas is a copy of state.content
  }

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
    for (var keyCont in this.state.content[0]){
      for (var value in this.state.content[0][keyCont]){
        if(this.state.content[0][keyCont] instanceof Object){
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
    return Object.keys(this.state.content[0]);
  }

  getRowsData = function(){
    var items = this.state.content;
    var datas = [];
    items.map((row, index)=>{
      var rowData = {}
      Object.entries(row).map(([key1,value1])=>{
        if(typeof value1 === 'object'){
          Object.entries(value1).map(([key2,value2])=>{
            rowData[key2] = value2;
          })
        }
        else{
          rowData[key1] = value1;
        }
      });
      datas.push(rowData)
    });
    return datas;
  }

  render(){
    let table = <div></div>;
    if (!this.context.getIsAuthenticated()) {
      return (<Redirect to ="/login"/>);
    }
    if (this.state.error) {
      return (<Error status={this.state.error.status} detail={this.state.error.detail}/>);
    }
    if(this.state.is_get){
      table = <ShowTable columns={this.getHeader()} dataSend={this.getRowsData()}/>
    }
    return (
      <div className="intranet_classic">
        <div className="container">
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
          <Select 
            placeholder="Choisissez le template à supprimer"
            onChange={this.handleChangeDel}
            options={this.state.nameAllTemplate}
          />
          <Button onClick={this.deleteTemplate} className="btn btn-danger">supprimer</Button>
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
          <Button variant="info" onClick={this.saveTemplate}>
            Sauvegarder
          </Button>
       </div>
    );
  }
}

export default TemplatePlanning;