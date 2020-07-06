import React, { Component } from 'react';
import { AuthContext } from './AuthProvider';
import { Redirect } from 'react-router';
import axios from 'axios';

class Profile extends Component {
  static contextType = AuthContext
  constructor(props) {
    super(props);
    this.state={
      email: '',
      username: '',
      password:'',
      confirm_password:'',
      errors: {
        username:'',
        password: '',
        confirm_password: '',
        other: ''
      },
    };

    this.handle_change = this.handle_change.bind(this);
    this.submit_form = this.submit_form.bind(this);
    this.has_errors = this.has_errors.bind(this);
  };

  handle_change(event) {
    const name = event.target.name;
    const value = event.target.value;

    var errors = {...this.state.errors}

    switch(name){
      case 'password':
        if(value.length != 0 && value.length < 8){
          errors.password = 'Ce mot de passe est trop petit';
        }
        else{
          if(this.state.confirm_password.length > 0 && value != this.state.confirm_password){
            errors.confirm_password = 'Le mot de passe n\'est pas pareil!';
          }
          else{
            errors.confirm_password = '';
          }
          errors.password = '';
        }
        break;
      case 'confirm_password':
        if(value != this.state.password){
          errors.confirm_password = 'Le mot de passe n\'est pas pareil!'
        }
        else{
          errors.confirm_password = '';
        }
        break;
        
      default: break;
    }
    this.setState({
    [name]: value,
    errors
   });
  }

  submit_form(event) {
    event.preventDefault();

    let authed_user_id = sessionStorage.getItem('authed_user');

    let userFormData = new FormData();
    userFormData.append('password', this.state.password);
    userFormData.append('username', this.state.username);

    axios({
      method: 'patch',
      url: 'api/users/' + authed_user_id,
      data: userFormData,
    })
    .then((response) => {
      if(response.status === 200) {
        this.context.setUser(response.data.user);
        this.setState({ is_updated: true});
        var toastHTML = '<span className="toast">Mot de passe mis à jour</span>';
        M.toast({html: toastHTML});
      }
    })
    .catch((error) => {
      if (error.response) {
        var errors = {...this.state.errors}
        errors.other = error.response.data;
        this.setState({errors});
      }
    })
  }

  has_errors(){
    let has_error = false;
    let errors = this.state.errors;
    for (var error in this.state.errors) {
      if(errors[error].length > 0) {
        has_error = true;
      }
    }

    return has_error;
  }

  componentDidMount(){
    this._isMounted = true;
    let authed_user = sessionStorage.getItem('authed_user');
    let user = sessionStorage.getItem('user');
    axios({
      method: 'get',
      url: 'api/users/' + (user ? user : authed_user),
    })
    .then((response) => {
      if (this._isMounted){
        if(response.status === 200) {
          this.setState({
            email : authed_user !== null && authed_user == response.data.user.id ? response.data.user.email : '',
            username: response.data.user.username,
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

  componentWillUnmount() {
    this._isMounted = false;
  }
  
  render() {
    if (!this.context.getIsAuthenticated()) {
      return (<Redirect to ="/login"/>);
    }
    return (
      <div className="intranet_classic">
        <div className="container">
          <h2>{this.state.username}</h2>
          <form onSubmit={this.submit_form}>
            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="Entrez le nouveau mot de passe"
                value={this.state.password}
                onChange={this.handle_change}
              />
              {this.state.errors.password.length > 0 &&
                <span className='error'>{this.state.errors.password}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="confirm_password">Confirmer le mot de passe</label>
              <input
                type="password"
                className="form-control"
                name="confirm_password"
                placeholder="Confirmer le mot de passe"
                value={this.state.confirm_password}
                onChange={this.handle_change}
              />
              {this.state.errors.confirm_password.length > 0 &&
                <span className='error'>{this.state.errors.confirm_password}</span>}
              {this.state.errors.other.length > 0 &&
                <span className='error'>{this.state.errors.other}</span>}
            </div>
            <div className="form-group">
            {this.has_errors()
                ? <button type="submit" className="btn btn-danger" disabled>confirmer</button>
                : <button type="submit" className="btn btn-danger">confirmer</button>
            }
            </div>
          </form>
        </div>
      </div>
      );
  }
}

export default Profile;