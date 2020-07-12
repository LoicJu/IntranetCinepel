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
  _isMounted = false;
  static contextType = AuthContext
  constructor(props){
    super(props);
    this.state = {
      users: [],
      cities : ["Neuchatel", "Delemont", "Bienne", "Chaux-de-fonds", "Berne"],
      // states for create
      usernameCreate:'',
      emailCreate:'',
      managerCreate : false,
      cityCreate : 'Neuchatel',
      // states for edit
      idEdit : '',
      usernameEdit:'',
      emailEdit:'',
      managerEdit : false,
      holidaysEdit : '',
      infosEdit : '',
      cityEdit : '',
      errors: {
        username:'',
        email: '',
      },
      error : null,
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
    axios.get('api/users/all', {
      headers: {
        'Authorization': "Token " + this.context.getToken()
      }
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
      infosEdit : User.infos,
      holidaysEdit : User.holidays,
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
    await axios.post('api/auth/register', userFormData, {
      headers: {
        'Authorization': "Token " + this.context.getToken()
      }
    })
    .then((response) => {
      if (response.status === 200) {
        this.setState({ is_created: true });
      }
      var toastHTML = '<span className="toast">Employé créé</span>';
      M.toast({html: toastHTML});
    })
    .catch((error) => {
      console.log(error.response)
      if (error.response) {
        var errors = {...this.state.errors}
        if('email' in error.response.data) {
          errors.email = 'Un employé avec cet email existe déjà';
          this.setState({errors});
        }
      }
    });
    // immediatly reset password
    let userPasswordFormData = new FormData();
    userPasswordFormData.append('email', this.state.emailCreate);

    axios({
      method: 'patch',
      url: 'api/auth/resetPassword',
      data: userPasswordFormData,
    })
    .then((response) => {
      this.setState({ is_created: true });
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
    this.handleChangeState();
  }

  async updateUser(event){
    event.preventDefault();
    this.handleCloseModalEdit();
    
    var userEditData = new FormData();
    userEditData.append('username', this.state.usernameEdit);
    userEditData.append('email', this.state.emailEdit);
    userEditData.append('is_manager', this.state.managerEdit);
    userEditData.append('city', this.state.cityEdit);
    userEditData.append('infos', this.state.infosEdit);
    userEditData.append('holidays', this.state.holidaysEdit);
    await axios.patch('api/users/' + this.state.idEdit, userEditData, {
      headers: {
        'Authorization': "Token " + this.context.getToken()
      }
    })
    .then((response) => {
      if (response.status === 200) {
        this.setState({ is_updated: true });
        var toastHTML = '<span className="toast">Employé édité</span>';
        M.toast({html: toastHTML});
      }
    })
    .catch((error) => {
      if (error.response) {
        var errors = {...this.state.errors}
        this.setState({errors});
      }
    });
    this.handleChangeState();
  };

  deleteUser(event){
    axios.delete('api/users/' + event, {
      headers: {
        'Authorization': "Token " + this.context.getToken()
      }
    })
    .then((response) => {
      if (response.status === 200) {
        this.handleChangeState()
        this.setState({
          is_delete: true,
        });
        var toastHTML = '<span className="toast">Employé supprimé</span>';
        M.toast({html: toastHTML});
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
    this._isMounted = true;
    //to define the element modal
    Modal.setAppElement('body');
    // fetch all users
    axios.get('api/users/all', {
      headers: {
        'Authorization': "Token " + this.context.getToken()
      }
    })
    .then((response) => {
      if (response.status === 200) {
        if (this._isMounted){
          let allData = this.state.users;
          response.data.map(user => allData.push(user));
          this.setState({
            users: allData,
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

  // render the page
  render(){
    // get all the users
    let usersList = [];
    this.state.users.map(User =>{
      usersList.push(
        <CollectionItem key={User.id}>
          <h4>{User.username}</h4>
          <Button className="buttonUser" onClick={this.handleShowModalEdit.bind(this, User)}>Editer</Button>
          <Button onClick={e =>
            window.confirm("Etes-vous sûr de vouloir supprimer cet employé ?") &&
            this.deleteUser(User.id)
          }>Supprimer</Button>
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
        {this.state.users.length > 0 &&
           <div className="intranet_classic">
             <Collection header="Employés">
              {usersList}
            </Collection>
          </div> 
        }
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
                ? <button type="submit" className="btn btn-info" disabled>Créer</button>
                : <button type="submit" className="btn btn-info">Créer</button>}
            </div>
          </form>
          <button className="btn btn-light" onClick={this.handleCloseModalCreate}>Annuler</button>
        </Modal>
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
              <label>Informations</label>
              <textarea
                rows="4"
                cols="50"
                className="form-control"
                name="infosEdit"
                value={this.state.infosEdit}
                onChange={this.handleChange}
                />
            </div>
            <div className="form-group">
              <label>Vacances</label>
              <textarea
                rows="4"
                cols="50"
                className="form-control"
                name="holidaysEdit"
                value={this.state.holidaysEdit}
                onChange={this.handleChange}
                />
            </div>
            <div className="form-group">
              {this.hasErrors()
                ? <button type="submit" className="btn btn-info" disabled>Editer</button>
                : <button type="submit" className="btn btn-info">Editer</button>}
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