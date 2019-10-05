import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {firebaseConnect} from'react-redux-firebase';
import PropTypes from 'prop-types';

class Navbar  extends Component {

    state = { 
        isAuthenticated: false,
      }

    // recibir los props automaticamente
    static getDerivedStateFromProps(props, state) {
        const {auth} = props;
        if(auth.uid){
            return { isAuthenticated: true}
            
        }else{
            return { isAuthenticated: false}
        }
    }

    // cerrar Sesion
    cerrarSesion= () => {
        const { firebase} = this.props;
        firebase.logout();
    }
    

  
    render() {
        const {auth} = this.props;
        const {isAuthenticated} = this.state;
    return (
   <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-5">
          <nav className="navbar navbar-light"></nav>
          <span className="navbar-brand mb-0 h1">Administrador de Biblioteca</span>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

          <div className="collapse navbar-collapse" id="navbarColor01">
              { isAuthenticated ? (
               <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                    <Link to={'/'} className="nav-link">
                            Libros
                    </Link>
                    </li>
                <li className="nav-item">
                            <Link to={'/suscriptores' } className="nav-link">
                        Suscriptores
                    </Link>
               </li>   
              </ul>
          ): null}
         {isAuthenticated ? (
             <ul className="navbar-nav ml-auto">
                 <li className="nav-item"> 
                     <a href="#!" className="nav-link"> Usuario : {auth.email} </a>
                 </li>
                 <li className="nav-item">
                     <button type="button" className="btn btn-danger" onClick={this.cerrarSesion}>
                        Cerrar Sesión
                     </button>
                 </li>
             </ul>
         ): null }
        </div>
    </nav>
    );
  
 }

}

Navbar.porpTypes = {
    firebase: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
}

export default compose(
    firebaseConnect(),
    connect((state,props)=> ({
        auth: state.firebase.auth

    }))
)(Navbar);

