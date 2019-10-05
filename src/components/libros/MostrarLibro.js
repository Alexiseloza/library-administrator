import React, { Component } from 'react';
import {compose} from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect} from 'react-redux-firebase';
import {Link} from 'react-router-dom';
import Spinner from '../layout/Spinner';
import PropTypes from 'prop-types';

class MostrarLibro extends Component {
        
     devolverLibro = id => {
          // extraer firestore
          const { firestore } = this.props;

          // toma una copia del libro
          const libroActualizado = {...this.props.libro};

          // elimina, la persona que realizo la devlucion de la seccion prestados
          const prestados = libroActualizado.prestados.filter(elemento => elemento.codigo !== id);
          libroActualizado.prestados = prestados;

          // actualizar enla base de datos
          firestore.update({
               collection: 'libros',
               doc: libroActualizado.id
          }, libroActualizado)
     }

     render(){

          // extraer libro de la firebase
          const {libro } = this.props;

          if(!libro) return <Spinner/>
            // boton para pedir prestamo de libro

            let btnPrestamo;
            if(libro.existencia - libro.prestados.length > 0) {
                 btnPrestamo = <Link to={`/libros/prestamo/${libro.id}`} className="btn btn-success my-3 btn-block "> <i className="fas fa-book"></i> {''} Solicitar Libro</Link>
            }else {
                 btnPrestamo = null;
            }

          return(
               <div className="row">
                  <div className="col-md-5 mb-4">
                    <Link to="/" className="btn btn-secondary">
                         <i className="fas fa-arrow-circle-left"></i>{' '}
                              Volver a la Lista
                    </Link>
                    </div>  

                    <div className="col-md-6">
                         <Link to={`/libros/editar/${libro.id}`} className="btn btn-primary float-right">
                              <i className="fas fa-pencil-alt"></i> {'  '} Editar Libro
                    </Link>
                    </div>
                    <hr className="mx-5 w-100"></hr>
                    <div className="col-12 ">
                         
                         <h3 className="mb-4 "> {''} <span className="font-weight-bold">Titulo: </span>{''}
                              {libro.titulo} 
                         </h3>
                         <p>
                              <span className="font-weight-bold">
                                   Editorial:
                         </span> {' '} {libro.editorial}

                         </p>
                         <p>
                              <span className="font-weight-bold">
                                   Codigo ISBN:
                         </span> {' '} {libro.ISBN}

                         </p>
                         <p>
                              <span className="font-weight-bold">
                                   Inventario:
                         </span> {' '} {libro.existencia}

                         </p>
                         <p>
                              <span className="font-weight-bold">
                                   Existancia:
                         </span> {' '} {libro.existencia - libro.prestados.length + 1}

                         </p>
                         {btnPrestamo}

                         {/*Muestra los usuarios que tiene un libro prestado */}
                         <h3 className="my-2 mt-5 text-center ">Usuarios que tienen Libros Prestados</h3>
                         {libro.prestados.map(prestado => (
                              <div key={prestado.codigo} className="card my-2"> 
                                 <h4 className="card-header">
                                   {prestado.nombre}  {prestado.apellido}
                                  </h4>
                                  <div className="card-body">
                                       <p>
                                            <span className="font-weight-bold">Codigo: {''}</span>
                                            {prestado.codigo}
                                       </p>

                                        <p>
                                             <span className="font-weight-bold">Carrera: {''}</span>
                                             {prestado.carrera}
                                        </p>
                                        <p>
                                             <span className="font-weight-bold">Fecha: {''}</span>
                                             {prestado.fecha_solicitud}
                                        </p>
                                  </div>
                                  <div className="card-footer">
                                       <button type="button"
                                        className="btn btn-primary font-weight-bold"
                                        onClick={ () => this.devolverLibro(prestado.codigo)}
                                        >Devolver Libro</button>
                                  </div>
                              </div>
                         ))}
                    </div>
                    
                    
               </div>
          );

     }
}

MostrarLibro.propTypes = {
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
)(MostrarLibro);
