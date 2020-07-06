import React, { Component } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthProvider';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import Error from './Error';

class ResetPassword extends Component {

  static contextType = AuthContext

  constructor(props) {
    super(props);
    this.state={
      email:'',
      is_authenticated: false,
      is_reset: false,
      error: null,
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

    axios({
      method: 'patch',
      url: 'api/auth/resetPassword',
      data: userFormData,
    })
    .then((response) => {
      this.setState({ is_reset: true });
    })
    .catch((error) => {
      this.setState({
        error: {
          status: error.response.status + ' ' + error.response.statusText,
          detail: error.response.data.detail,
        }
      });
    }
  );
}

render() {
  if (this.state.error) {
    return (<Error status={this.state.error.status} detail={this.state.error.detail}/>);
  }
  if (this.state.is_authenticated) {
    return (<Redirect to ="/" />);
  }
  return (
    <div className="container py-4">
      <div className="intranet_classic">
      {this.state.is_reset &&
        <div>
          <h1>Mise à jour de mot de passe</h1>
          <p>Si l'email que vous avez fourni est lié à un compte, vous reveret bientôt un email contenant un nouveau mot de passe</p>
          <p>Une fois que vous avez recu l'email, vous pouvez vous <Link to="/login">connecter</Link>, n'oublier pas de redéfinir votre mot de passe dans votre page de profil.</p>
        </div>}
      {!this.state.is_reset && !this.state.has_error &&
      <div>
      <p>Pour mettre à jour votre mot de passe, entrez l'adresse email qui est lité à votre compte</p>
        <form onSubmit={this.submit_form}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Enter Email"
              value={this.state.email}
              onChange={this.handle_change}
              required
              />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-danger">réinitialiser le mot de passe</button>
          </div>
        </form>
        </div>}
      </div>
    </div>
    );
  }
}

export default ResetPassword;