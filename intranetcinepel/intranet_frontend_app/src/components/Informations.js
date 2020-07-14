import React, { Component } from 'react';
import { AuthContext } from './AuthProvider';
import { Redirect } from 'react-router';

class Informations extends Component {
  static contextType = AuthContext
  render() {
    if (!this.context.getIsAuthenticated()) {
      return (<Redirect to ="/login"/>);
    }
    return (
      <div className="intranet-classic">
        <div className="container">
        <h2>Guide d'utilisateur</h2>
        <p>
          Afin de pouvoir vous connecter au site, il faut demander à votre manager qu'il crée votre utilisateur.

          Vous devriez ensuite recevoir un email.
        </p><p>
          Allez sur le site et mettez comme nom d'utilisateur votre email et comme mot de passe, celui fournit dans l'email.

          Vous arriverez directement sur la page de planning.

          Vous pourrez selectionner un planning afin de voir les horaires du mois selectionné.

          Vous pouvez également allez sur la page de profil afin de changer votre mot de passe.

          Il y a également la page des horaires où les horaires des prochains jours sont affichés.
        </p>
        </div>
      </div>
      );
  }
}

export default Informations;