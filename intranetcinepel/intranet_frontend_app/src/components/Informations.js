import React, { Component} from 'react';
import { AuthContext } from './AuthProvider';
import { Redirect } from 'react-router';
import axios from 'axios';
import { Button } from 'react-materialize';

import 'jodit';
import 'jodit/build/jodit.min.css';
import JoditEditor from "jodit-react";

class Informations extends Component {
  _isMounted = false;
  static contextType = AuthContext
  constructor(props) {
    super(props);
    this.state={
      content: 'content',
      error: null,
    };
    this.saveContent = this.saveContent.bind(this)
  };

  updateContent = (value) => {
    this.setState({content:value})
  }
  jodit;
	setRef = jodit => this.jodit = jodit;
	
	config = {
		readonly: false // all options from https://xdsoft.net/jodit/doc/
  }
  
  saveContent(){
    var informationsData = new FormData();
    informationsData.append('content', this.state.content);
    axios.put('api/information/1/', informationsData,{
      headers: {
        'Authorization': "Token " + this.context.getToken()
      }
    })
    .then((response) => {
      if (response.status === 200) {
        var toastHTML = '<span className="toast">Informations sauvegardées</span>';
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
  componentDidMount(){
    this._isMounted = true;
    if(this._isMounted)
    {
      axios.get('api/information/1', {
        headers: {
          'Authorization': "Token " + this.context.getToken()
        }
      })
      .then((response) => {
        if (response.status === 200) {
            this.setState({content: response.data.content})
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
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
  render() {
    if (!this.context.getIsAuthenticated()) {
      return (<Redirect to ="/login"/>);
    }
    if(this.context.getIsManager()){
      return (
        <div className="intranet-classic">
          <div className="container">
          <JoditEditor
            editorRef={this.setRef}
            value={this.state.content}
            config={this.config}
            onChange={this.updateContent}
          />
          <Button className="button-create" onClick={this.saveContent}>Sauvegarder</Button>
          </div>
        </div>
        );
    }
    return(
      <div className="intranet-classic">
        <div className="container">
          <div dangerouslySetInnerHTML={{ __html: this.state.content }} />
        </div>
      </div>
    )
  }
}

export default Informations;