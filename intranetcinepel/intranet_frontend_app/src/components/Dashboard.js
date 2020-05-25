import React, { Component } from 'react';
import axios from 'axios';
var $ = require('jquery');

import {
  NavLink
} from 'react-router-dom';

import { MContext } from './MessageProvider';
import { AuthContext } from './AuthProvider';


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  
  showLoginWarning() {
    $('#loginWarningModal').modal('show');
  }

  render() {
    return (
      <div className="container pt-4">
        <div className="row">
          <div className="modal fade" id="loginWarningModal" tabIndex="-1" role="dialog" aria-labelledby="loginWarningModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content text-light">
                <div className="modal-header">
                  <h5 className="modal-title" id="loginWarningModalLabel">Login first</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <p>You must be logged in to use this feature !</p>
                  <p>Click <NavLink className="notLoggedLink" exact to="/login">here</NavLink> to login or <NavLink className="notLoggedLink" exact to="/signup">here</NavLink> to create an account if you don't have one.</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;