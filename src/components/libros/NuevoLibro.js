import React, { Component } from 'react';
import {Link }from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import PropTypes from 'prop-types';




class NuevoLibro extends Component{

     state={
          titulo: '',
          ISBN: '',
          editorial: '',
          existencia: '',
          prestados: []
         
     }
     // agrega el libro en la base de datos de firebase
     agregarLibro = e => {
          e.preventDefault();

          // toma una copia de State actual
          const nuevoLibro = this.state;
          // agregar un arreglo de prestados
          nuevoLibro.prestados = [];
          // extraer firestore con sus metodos 
          const { firestore } = this.props;
          // añade a la base de datos y redirecciona al usuario
          firestore.add({collection: 'libros'}, nuevoLibro).then(() => this.props.history.push('/'))
     }

     // agrega el nuevo libro al State
     leerDato = e => {
          this.setState({
               [e.target.name] : e.target.value
          })
     }

     render() {
          
          
          return(
           <div className="row">
                <div className="col-12 mb-4">
                     <Link to="/" className="btn btn-secondary">
                          <i className="fas fa-arrow-circle-left"></i>{' '} Volver al Listado
                     </Link>
                </div>
                <div className="col-12 mb-4">
                     <h2>
                          <i className="fas fa-book"></i>{' '} Nuevo Libro
                     </h2>
                     <div className="row justify-conten-center">
                          <div className="col-md-8 mt-5">
                               <form 
                               onSubmit={this.agregarLibro}
                               >
                                 <div className="from-group">
                                   <label className="font-weight-bold">Título:</label>  
                                  <input type="text"
                                        className="form-control "
                                        name="titulo"
                                        placeholder="Título / Nombre del Libro"
                                        required
                                        value={this.state.titulo}
                                        onChange={this.leerDato}
                                        />
                                   </div>
                                        <div className="from-group">
                                             <label className="font-weight-bold">Editorial:</label>
                                             <input type="text"
                                                  className="form-control"
                                                  name="editorial"
                                                  placeholder="Editorial Libro"
                                                  required
                                                  value={this.state.editorial}
                                                  onChange={this.leerDato}
                                             />
                                        </div>
                                        <div className="from-group">
                                             <label className="font-weight-bold">ISBN:</label>
                                             <input type="text"
                                                  className="form-control"
                                                  name="ISBN"
                                                  placeholder="ISBN / Codigo del Libro"
                                                  required
                                                  value={this.state.ISBN}
                                                  onChange={this.leerDato}
                                             />
                                        </div>
                                        <div className="from-group mb-4">
                                             <label className="font-weight-bold">Existencia:</label>
                                             <input type="number"
                                                   min="0"
                                                  className="form-control"
                                                  name="existencia"
                                                  placeholder="Existencia de Libro/s"
                                                  required
                                                  value={this.state.existencia}
                                                  onChange={this.leerDato}
                                             />
                                        </div>
                                        <input type="submit" className=" btn btn-block btn-success" value="Agregar Libro"  />
                               </form>
                          </div>
                     </div>
                </div>
           </div>
          );
     }
}
NuevoLibro.propTypes ={
     firestore: PropTypes.object.isRequired
}

export default firestoreConnect() (NuevoLibro);
