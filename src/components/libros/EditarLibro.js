import React, { Component } from 'react';
import {compose} from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect} from 'react-redux-firebase';
import {Link} from 'react-router-dom';
import Spinner from '../layout/Spinner';
import PropTypes from 'prop-types';


class EditarLibro extends Component {


     // crear REFS
     tituloInput = React.createRef();
     editorialInput = React.createRef();
     ISBNInput = React.createRef();
     existenciaInput = React.createRef();


     // editar usuario en la base de datos 

     actualizarLibro = e => {
          e.preventDefault();

          // crea el objeto que se actualizara
          const libroActualizado = {
               titulo: this.tituloInput.current.value,
               editorial: this.editorialInput.current.value,
               ISBN: this.ISBNInput.current.value,
               existencia: this.existenciaInput.current.value
          }

          // extrayendo suscriptor , firestore, history de props

          const { libro, firestore, history } = this.props;

          // almacena en la base de datos con firestore

          firestore.update({
               collection: 'libros', doc: libro.id
          }, libroActualizado).then(history.push('/'));
     };

     
     render(){

          
          const { libro} = this.props;
          if(!libro) return <Spinner />

          


          
          return (
               <div className="row">
                  <div className="col-12 mb-4">
                       <Link to={'/'} className="btn btn-secondary">
                            <i className="fas fa-arrow-circle-left"></i>{' '}
                            Volver al Listado
                       </Link>
                   </div> 
                   <div className="col-12">
                        <h2>
                             <i className="fas fa-book"></i>{' '}
                             Editar Libro
                        </h2>
                        <div className="row justify-content-center">
                             <div className="col-md-8 mt-5">
                                   <form 
                               onSubmit={this.actualizarLibro}
                               >
                                 <div className="from-group">
                                   <label className="font-weight-bold">Título:</label>  
                                  <input type="text"
                                        className="form-control "
                                        name="titulo"
                                        placeholder="Título / Nombre del Libro"
                                        required
                                        defaultValue={libro.titulo}
                                        ref={this.tituloInput}
                                        />
                                   </div>
                                        <div className="from-group">
                                             <label className="font-weight-bold">Editorial:</label>
                                             <input type="text"
                                                  className="form-control"
                                                  name="editorial"
                                                  placeholder="Editorial Libro"
                                                  required
                                                  defaultValue={libro.editorial}
                                                  ref={this.editorialInput}
                                             />
                                        </div>
                                        <div className="from-group">
                                             <label className="font-weight-bold">ISBN:</label>
                                             <input type="text"
                                                  className="form-control"
                                                  name="ISBN"
                                                  placeholder="ISBN / Codigo del Libro"
                                                  required
                                                  defaultValue={libro.ISBN}
                                                  ref={this.ISBNInput}
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
                                                  defaultValue={libro.existencia}
                                                  ref={this.existenciaInput}
                                             />
                                        </div>
                                        <input type="submit" className=" btn btn-block btn-success" value="Editar Libro"  />
                               </form>
                             </div>
                         </div>  
                    </div> 
                  </div>                   
          );
     }
          
     
}

EditarLibro.porpTypes = {
     firestore: PropTypes.object.isRequired
}

export default compose(
     firestoreConnect(props => [{
          collection: 'libros',
          storeAs: 'libro',
          doc: props.match.params.id
     }]),
     connect(({
          firestore: {
               ordered
          }
     }, props) => ({
          libro: ordered.libro && ordered.libro[0]
     }))
)(EditarLibro);
