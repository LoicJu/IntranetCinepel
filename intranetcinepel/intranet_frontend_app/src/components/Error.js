import React, { Component } from 'react';

class Error extends Component {
  render() {
    return(
        <div className="container pt-4">
            <div className="text-center">
                <div className="intranet-classic">
                    <h1 className="text-danger">Oups!</h1>
                    <h2 className="mt-3">{this.props.status}</h2>
                    <div>
                        Désolé, une erreur est apparue. {this.props.detail}
                    </div>
                </div>
            </div>
        </div>
    );
  }
}

export default Error;