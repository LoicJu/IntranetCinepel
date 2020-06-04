import React, { Component } from 'react';
import { AuthContext } from './AuthProvider';
import { Redirect } from 'react-router';
import Error from './Error';
import axios from 'axios';
import { useTable } from 'react-table'

class TemplatePlanning extends Component {
  static contextType = AuthContext
  constructor(props) {
    super(props);
    this.state={
      name : '',
      nameTemplate : 'a',
      columns : [],
      data : null,
      is_created : false,
      error : null,
      is_delete : null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitTemplate = this.submitTemplate.bind(this);
    this.getTemplate = this.getTemplate.bind(this);
    this.deleteTemplate = this.deleteTemplate.bind(this);
  };
  
  handleChange(event){    
    this.setState({name: event.target.value});
  }
  // store a new template
  submitTemplate(event) {
    event.preventDefault();

    // TODO store elsewhere than session ? see security
    let authed_user = sessionStorage.getItem('authed_user');

    var templateFormData = new FormData();
    templateFormData.append('name', this.state.name);
    templateFormData.append('id_create', authed_user);
    axios({
      method: 'post',
      url: 'api/template/',
      data: templateFormData,
    })
    .then((response) => {
      if (response.status === 200) {
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

  // TODO get in function of a name (scrolllist where there is all the name of the templates) and so get by the id
  getTemplate(){
    axios({
      method: 'get',
      url: 'api/template/3',
    })
    .then((response) => {
      if (response.status === 200) {
        this.setState({
          nameTemplate : response.data.name,
          columns: response.data.content,
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
  
  deleteTemplate(){
    axios({
      method: 'delete',
      url: 'api/template/1',
    })
    .then((response) => {
      if (response.status === 200) {
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
              onChange={this.handleChange}
              />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-danger">post</button>
          </div>
        </form>
        <button onClick={this.getTemplate}>get</button>
        <div>
          <h4>{this.state.nameTemplate}</h4>
        </div>
        <button onClick={this.deleteTemplate}>del</button>
        </div>
       </div>
    );
  }
}

export default TemplatePlanning;