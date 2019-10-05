import React, { Component } from 'react';
import {compose} from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect} from 'react-redux-firebase';
import {Link} from 'react-router-dom';
import Spinner from '../layout/Spinner';
import PropTypes from 'prop-types';



class EditarSuscriptor extends Component {

// crear REFS
     nombreInput = React.createRef();
     apellidoInput = React.createRef();
     codigoInput = React.createRef();
     carreraInput = React.createRef();

     // editar usuario en la base de datos 
     editarSuscriptor = e => {
          e.preventDefault();

          // crea el objeto que se actualizara
          const suscriptorActualizado = {
               nombre: this.nombreInput.current.value,
               apellido: this.apellidoInput.current.value,
               carrera: this.carreraInput.current.value,
               codigo: this.codigoInput.current.value

          }
          
          // extrayendo suscriptor , firestore, history de props

          const { suscriptor, firestore, history} = this.props;

          // almacena en la base de datos con firestore

          firestore.update({
               collection: 'suscriptores',
               doc : suscriptor.id
          }, suscriptorActualizado).then(history.push('/suscriptores'));
     }


     render() {
          const { suscriptor} = this.props;
          if(!suscriptor) return <Spinner />
          return (
              <div className="row">
                  <div className="col-12 mb-4">
                       <Link to={'/suscriptores'} className="btn btn-secondary">
                            <i className="fas fa-arrow-circle-left"></i>{' '}
                            Volver al Listado
                       </Link>
                   </div> 
                   <div className="col-12">
                        <h2>
                             <i className="fas fa-user"></i>{' '}
                             Editar Usuario
                        </h2>
                        <div className="row justify-content-center">
                             <div className="col-md-8 mt-5">
                                  <form onSubmit={this.editarSuscriptor} >
                                      <div className="form-group">
                                        <label>Nombre:</label>
                                          <input type="text" 
                                          className="form-control" 
                                          name="nombre"
                                          placeholder="Nombre del Suscriptor" 
                                          required 
                                          ref={this.nombreInput}
                                          defaultValue={suscriptor.nombre}
                                          />
                                      </div>

                                        <div className="form-group">
                                             <label>Apellido:</label>
                                             <input type="text"
                                                  className="form-control"
                                                  name="apellido"
                                                  placeholder="Apellido del Suscriptor"
                                                  required
                                                  ref={this.apellidoInput}
                                                  defaultValue={suscriptor.apellido}
                                             />
                                        </div> 

                                        <div className="form-group">
                                             <label>Carrera:</label>
                                             <input type="text"
                                                  className="form-control"
                                                  name="carrera"
                                                  placeholder="Carrera del Suscriptor"
                                                  required
                                                  ref={this.carreraInput}
                                                  defaultValue={suscriptor.carrera}
                                             />
                                        </div> 

                                        <div className="form-group">
                                             <label>Codigo:</label>
                                             <input type="text"
                                                  className="form-control"
                                                  name="codigo"
                                                  placeholder="Codigo de Estudiante"
                                                  required
                                                  ref={this.codigoInput}
                                                  defaultValue={suscriptor.codigo}
                                             />
                                        </div> 
                                        <input type="submit" value=" Guardar Cambios " className="btn btn-success btn-block" />
                                  </form>
                          </div>
                     </div>   
                   </div>
              </div>
          )
     }
}
EditarSuscriptor.porpTypes = {
     firestore: PropTypes.object.isRequired
}

export default compose(
 firestoreConnect(props => [
      {
           collection: 'suscriptores',
           storeAs: 'suscriptor',
           doc: props.match.params.id
      }
 ]), 
 connect(({ firestore: {ordered }}, props ) => ({
      suscriptor : ordered.suscriptor && ordered.suscriptor[0]
 }))
)( EditarSuscriptor);
