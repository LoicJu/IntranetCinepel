import React, { Component } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthProvider';
import { Redirect } from 'react-router';
import { Button, Collection , CollectionItem} from 'react-materialize';
import Modal from 'react-modal';

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

class userHandler extends Component {
  static contextType = AuthContext

  constructor(props){
    super(props);
    this.state = {
      users: [],
      cities : ["Neuchatel", "Delemont", "Bienne", "Chaux-de-fonds", "Berne"],
      username:'',
      email:'',
      manager : false,
      city : '',
      errors: {
        username:'',
        email: '',
      },
      showModal : false,
      // to know if created, delete, etc
      is_delete : false,
    };
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.hasErrors = this.hasErrors.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }
  
  handleChangeState(){
    axios({
      method: 'get',
      url: 'api/users/all',
    })
    .then((response) => {
      if (response.status === 200) { 
        let allData = [];
        response.data.map(user => allData.push(user));
        this.setState({
          users: allData,
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

  handleShowModal(){
    this.setState({showModal : true})
  }
  handleCloseModal(){
    this.setState({showModal : false})
  }

  // no possible errors in the select sections
  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    var errors = {...this.state.errors}

    switch(name) {
      case 'username':
      if(value.length < 4) {
        errors.username = 'The username is too small !';
      } else {
        errors.username = '';
      }
      break;

      case 'email':
      errors.email = '';
      break;
      
      default: break;
    }

    this.setState({
      [name]: value,
      errors,
    });
  };

  hasErrors() {
    let has_error = false;
    let errors = this.state.errors;
    for (var error in this.state.errors) {
      if(errors[error].length > 0) {
        has_error = true;
      }
    }

    return has_error;
  }
  
  submitForm(event) {
    event.preventDefault();

    var userFormData = new FormData();
    userFormData.append('username', this.state.username);
    userFormData.append('email', this.state.email);
    userFormData.append('is_manager', this.state.manager)
    userFormData.append('city', this.state.city)
    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFToken';

    axios({
      method: 'post',
      url: 'api/auth/register',
      data: userFormData,
    })
    .then((response) => {
      if (response.status === 200) {
        this.setState({ is_created: true });
      }
    })
    .catch((error) => {
      if (error.response) {
        var errors = {...this.state.errors}
        if('email' in error.response.data) {
          errors.email = 'A user with this email already exists !';
          this.setState({errors});
        }
      }
    });
  }

  deleteUser(event){
    axios({
      method: 'delete',
      url: 'api/users/' + event,
    })
    .then((response) => {
      if (response.status === 200) {
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
  //fetch all users in users
  componentDidMount(){
    //to define the element modal
    Modal.setAppElement('body');
    // fetch all users
    axios({
      method: 'get',
      url: 'api/users/all',
    })
    .then((response) => {
      if (response.status === 200) { //add test if connected and manager
        let allData = this.state.users;
        response.data.map(user => allData.push(user));
        this.setState({
          users: allData,
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
    let usersList = [];
    this.state.users.map(User =>{
      usersList.push(
        <CollectionItem key={User.id}>
          <h4>{User.username}</h4>
          <Button>Editer</Button><Button onClick={this.deleteUser.bind(this, User.id)}>Supprimer</Button>
        </CollectionItem>
      )
    });
    let cityList = [];
    this.state.cities.map(city=>{
      cityList.push(
        <option key={city} value={city}>{city}</option>
      )
    })
    if (!this.context.getIsAuthenticated() || !this.context.getIsManager()) {
      return (<Redirect to ="/login"/>);
    }
    if (this.state.error) {
      return (<Error status={this.state.error.status} detail={this.state.error.detail}/>);
    }
    return (
      <div className="intranet_classic">
        <Button variant="info" onClick={this.handleShowModal}>Créer un utilisateur</Button>
        <Modal
          isOpen={this.state.showModal}
          onRequestClose={this.handleCloseModal}
          style={customStyles}
          contentLabel="Créer un utilisateur"
        >
 
          <h2>Créer un utilisateur</h2>
          <form onSubmit={this.submitForm}>
            <div className="form-group">
              <label htmlFor="username">Nom d'utilisateur</label>
              <input
                type="text"
                className="form-control"
                name="username"
                placeholder="Entrer le nom d'utilisateur"
                onChange={this.handleChange}
                required
                />
              {this.state.errors.username.length > 0 &&
                <span className="error">{this.state.errors.username}</span>
              }
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="Entrer l'email"
                onChange={this.handleChange}
                required
                />
              {this.state.errors.email.length > 0 &&
                <span className="error">{this.state.errors.email}</span>
              }
            </div>
            <div className="form-group">
              <label htmlFor="manager">Manager</label>
              <select
                className="form-control"
                name="manager"
                onChange={this.handleChange}
                >
                <option value="false">non</option>
                <option value="true">oui</option>
                </select>
            </div>
            <div className="form-group">
              <label htmlFor="city">City</label>
              <select
                className="form-control"
                name="city"
                onChange={this.handleChange}
                >
                {cityList}
                </select>
            </div>
            <div className="form-group">
              {this.hasErrors()
                ? <button type="submit" className="btn btn-danger" disabled>Submit</button>
                : <button type="submit" className="btn btn-danger">Submit</button>}
            </div>
          </form>
          <button onClick={this.handleCloseModal}>close</button>
        </Modal>
        {this.state.users.length > 0 &&
           <div className="intranet_classic">
             <Collection header="Employés">
              {usersList}
            </Collection>
          </div> 
        }
      </div>
      );
  }
}

export default userHandler;