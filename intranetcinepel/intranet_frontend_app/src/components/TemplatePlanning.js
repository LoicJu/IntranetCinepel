import React, { Component } from 'react';
import { AuthContext } from './AuthProvider';
import { Redirect } from 'react-router';
import Error from './Error';
import axios from 'axios';

class TemplatePlanning extends Component {
  static contextType = AuthContext
  constructor(props) {
    super(props);
    this.state={
      name : '',
      template : [],
      is_created : false,
      error : null,
    };
    this.submit_form = this.submit_form.bind(this);
    this.getTemplate = this.getTemplate.bind(this);
  };

  submit_form(event) {
    event.preventDefault();

    var templateFormData = new FormData();
    templateFormData.append('name', 'test');

    axios({
      method: 'post',
      url: '/template/create',
      data: templateFormData,
    })
    .then((response) => {
      if (response.status === 200) {
        this.setState({ is_created: true });
      }
    });
  }
  // get in function of a name (scrolllist where there is all the name of the templates) and so get by the id
  getTemplate(){
    axios({
      method: 'get',
      url: '/template/1',
    })
    .then((response) => {
      if (response.status === 200) {
        let allData = this.state.template;
        response.data.map(template => allData.push(template));
        this.setState({
          template: allData,
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
        <form onSubmit={this.submit_form}>
          <div className="form-group">
            <label htmlFor="email">name</label>
            <input
              type="text"
              className="form-control"
              />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-danger">post</button>
          </div>
        </form>
        <button onClick={this.getTemplate}>get</button>
        <div className="col-xs-12">
        <h1>Calendar</h1>
        {this.state.template.map((template) => (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">template title</h5>
              <h6 className="card-subtitle mb-2 text-muted">            
              </h6>
            </div>
          </div>
        ))}
        </div>
       </div>
    );
  }
}

export default TemplatePlanning;