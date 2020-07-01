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
      usernameCreate:'',
      emailCreate:'',
      managerCreate : false,
      cityCreate : 'Neuchatel',
      idEdit : '',
      usernameEdit:'',
      emailEdit:'',
      managerEdit : false,
      cityEdit : '',
      errors: {
        username:'',
        email: '',
      },
      showModalCreate : false,
      showModalEdit : false,
      // to know if created, delete, etc
      is_delete : false,
      is_created : false,
      is_updated : false,
    };
    this.handleShowModalCreate = this.handleShowModalCreate.bind(this);
    this.handleCloseModalCreate = this.handleCloseModalCreate.bind(this);
    this.handleShowModalEdit = this.handleShowModalEdit.bind(this);
    this.handleCloseModalEdit = this.handleCloseModalEdit.bind(this);

    this.submitForm = this.submitForm.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.updateUser = this.updateUser.bind(this);

    this.handleChange = this.handleChange.bind(this);
    this.hasErrors = this.hasErrors.bind(this);
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

  handleShowModalCreate(){
    this.setState({showModalCreate : true})
  }
  handleCloseModalCreate(){
    this.setState({showModalCreate : false})
  }

  handleShowModalEdit(User){
    this.setState({
      idEdit : User.id,
      usernameEdit : User.username,
      emailEdit : User.email,
      managerEdit : User.is_manager,
      cityEdit : User.city,
      showModalEdit : true,
    })
  }

  handleCloseModalEdit(){
    this.setState({showModalEdit : false})
  }
  // no possible errors in the select sections
  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    var errors = {...this.state.errors}

    switch(name) {
      case 'usernameCreate':
        if(value.length < 4) {
          errors.username = 'The username is too small !';
        } else {
          errors.username = '';
        }
        break;

      case 'usernameEdit':
        if(value.length < 4) {
          errors.username = 'The username is too small !';
        } else {
          errors.username = '';
        }
        break;
      
      case 'emailCreate':
        errors.email = '';
        break;

      case 'emailEdit':
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
  
  async submitForm(event) {
    event.preventDefault();
    this.handleCloseModalCreate();

    var userFormData = new FormData();
    userFormData.append('username', this.state.usernameCreate);
    userFormData.append('email', this.state.emailCreate);
    userFormData.append('is_manager', this.state.managerCreate)
    userFormData.append('city', this.state.cityCreate)
    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFToken';
    await axios({
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
    this.handleChangeState();
  }

  async updateUser(event){
    event.preventDefault();
    this.handleCloseModalEdit();
    
    var userEditData = new FormData();
    userEditData.append('username', this.state.usernameEdit);
    userEditData.append('email', this.state.emailEdit);
    userEditData.append('is_manager', this.state.managerEdit)
    userEditData.append('city', this.state.cityEdit)
    await axios({
      method: 'patch',
      url: 'api/users/' + this.state.idEdit,
      data: userEditData,
    })
    .then((response) => {
      if (response.status === 200) {
        this.setState({ is_updated: true });
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
    this.handleChangeState();
  };

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
      if (response.status === 200) {
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

  // render the page
  render(){
    // get all the users
    let usersList = [];
    this.state.users.map(User =>{
      usersList.push(
        <CollectionItem key={User.id}>
          <h4>{User.username}</h4>
          <Button className="buttonUser" onClick={this.handleShowModalEdit.bind(this, User)}>Editer</Button><Button onClick={this.deleteUser.bind(this, User.id)}>Supprimer</Button>
        </CollectionItem>
      )
    });
    // get all the cities
    let cityList = [];
    this.state.cities.map(city=>{
      cityList.push(
        <option key={city} value={city}>{city}</option>
      )
    })
    // if not authentificated or manager, go to login
    if (!this.context.getIsAuthenticated() || !this.context.getIsManager()) {
      return (<Redirect to ="/login"/>);
    }
    // if error, show error
    if (this.state.error) {
      return (<Error status={this.state.error.status} detail={this.state.error.detail}/>);
    }
    // return the page
    return (
      <div className="intranet_classic">
        <div className="container">
        <Button className="buttonCreate" variant="info" onClick={this.handleShowModalCreate}>Créer un utilisateur</Button>
        <Modal
          isOpen={this.state.showModalCreate}
          onRequestClose={this.handleCloseModalCreate}
          style={customStyles}
          contentLabel="Créer un utilisateur"
        >
 
          <h2>Créer un utilisateur</h2>
          <form onSubmit={this.submitForm}>
            <div className="form-group">
              <label htmlFor="usernameCreate">Nom d'utilisateur</label>
              <input
                type="text"
                className="form-control"
                name="usernameCreate"
                placeholder="Entrer le nom d'utilisateur"
                onChange={this.handleChange}
                required
                />
              {this.state.errors.username.length > 0 &&
                <span className="error">{this.state.errors.username}</span>
              }
            </div>
            <div className="form-group">
              <label htmlFor="emailCreate">Email</label>
              <input
                type="email"
                className="form-control"
                name="emailCreate"
                placeholder="Entrer l'email"
                onChange={this.handleChange}
                required
                />
              {this.state.errors.email.length > 0 &&
                <span className="error">{this.state.errors.email}</span>
              }
            </div>
            <div className="form-group">
              <label htmlFor="managerCreate">Manager</label>
              <select
                className="form-control"
                name="managerCreate"
                onChange={this.handleChange}
                >
                <option value="false">non</option>
                <option value="true">oui</option>
                </select>
            </div>
            <div className="form-group">
              <label htmlFor="cityCreate">Ville</label>
              <select
                className="form-control"
                name="cityCreate"
                onChange={this.handleChange}
                >
                {cityList}
                </select>
            </div>
            <div className="form-group">
              {this.hasErrors()
                ? <button type="submit" className="btn btn-danger" disabled>Créer</button>
                : <button type="submit" className="btn btn-danger">Créer</button>}
            </div>
          </form>
          <button className="btn btn-light" onClick={this.handleCloseModalCreate}>Annuler</button>
        </Modal>
        {this.state.users.length > 0 &&
           <div className="intranet_classic">
             <Collection header="Employés">
              {usersList}
            </Collection>
          </div> 
        }
        <Modal
          isOpen={this.state.showModalEdit}
          onRequestClose={this.handleCloseModalEdit}
          style={customStyles}
          contentLabel="Editer un utilisateur"
        >
          <h2>{this.state.usernameEdit}</h2>
          <form onSubmit={this.updateUser}>
            <div className="form-group">
              <label htmlFor="usernameEdit">Nom d'utilisateur</label>
              <input
                type="text"
                className="form-control"
                name="usernameEdit"
                value={this.state.usernameEdit}
                onChange={this.handleChange}
                required
                />
              {this.state.errors.username.length > 0 &&
                <span className="error">{this.state.errors.username}</span>
              }
            </div>
            <div className="form-group">
              <label htmlFor="emailEdit">Email</label>
              <input
                type="email"
                className="form-control"
                name="emailEdit"
                value={this.state.emailEdit}
                onChange={this.handleChange}
                required
                />
              {this.state.errors.email.length > 0 &&
                <span className="error">{this.state.errors.email}</span>
              }
            </div>
            <div className="form-group">
              <label htmlFor="managerEdit">Manager</label>
              <select
                className="form-control"
                name="managerEdit"
                onChange={this.handleChange}
                value={this.state.managerEdit}
                >
                <option value="false">non</option>
                <option value="true">oui</option>
                </select>
            </div>
            <div className="form-group">
              <label htmlFor="cityEdit">Ville</label>
              <select
                className="form-control"
                name="cityEdit"
                onChange={this.handleChange}
                value={this.state.cityEdit}
                >
                {cityList}
                </select>
            </div>
            <div className="form-group">
              {this.hasErrors()
                ? <button type="submit" className="btn btn-danger" disabled>Créer</button>
                : <button type="submit" className="btn btn-danger">Créer</button>}
            </div>
          </form>
          <button className="btn btn-light" onClick={this.handleCloseModalEdit}>Annuler</button>
        </Modal>
        </div>
      </div>
      );
  }
}

export default userHandler;