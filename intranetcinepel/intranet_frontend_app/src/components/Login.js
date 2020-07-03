import React, { Component } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthProvider';
import { NavLink } from 'react-router-dom';
import { Redirect } from 'react-router';

class Login extends Component {

  static contextType = AuthContext

  constructor(props) {
    super(props);
    this.state={
      email:'',
      password:'',
      is_authenticated: false,
      has_error: false,
    };

    this.handle_change = this.handle_change.bind(this);
    this.submit_form = this.submit_form.bind(this);
  };

  handle_change(event) {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({
      [name]: value
    });
  }


  submit_form(event){
    event.preventDefault();

    let userFormData = new FormData();
    userFormData.append('email', this.state.email);
    userFormData.append('password', this.state.password);

    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFToken';

    axios({
      method: 'post',
      url: 'api/auth/login',
      data: userFormData,
    })
    .then((response) => {
      if (response.status === 200) {
        this.context.setLoginInfo(
          {
            is_authenticated: true,
            user: response.data.user,
            token: response.data.token,
          }
        );
        this.setState({ is_authenticated: true });
      }
    })
    .catch((error) => {
      this.setState({has_error: true});
    }
  );
}

render() {
  if (this.state.is_authenticated) {
    return (<Redirect to ="/" />);
  }
  if (this.context.getIsAuthenticated()) {
    return (<Redirect to ="/"/>);
  }
  return (
    <div className="container pt-4">
      <div className="intranet_classic">
        <form onSubmit={this.submit_form}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              className="form-control"
              name="email"
              placeholder="Enter Email"
              value={this.state.email}
              onChange={this.handle_change}
              required
              />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Enter Password"
              value={this.state.password}
              onChange={this.handle_change}
              />
            {this.state.has_error &&
              <span className='error'>Le mail ou le mot de passe est/sont faux</span>}
              </div>
              <div className="form-group">
                <button type="submit" className="btn btn-info">Se Connecter</button>
              </div>
              <div className="form-group">
                <small id="resetHelp" className="form-text text-muted">
                  Vous avez oublié votre mot de passe ? Cliquez <NavLink className="text-danger" to="/resetPassword">ici</NavLink>
                </small>
              </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;