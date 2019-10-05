import React, { Component } from 'react';
import {compose} from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect} from 'react-redux-firebase';
import {Link} from 'react-router-dom';
import Spinner from '../layout/Spinner';
import PropTypes from 'prop-types';
import FichaSuscriptor from '../suscriptores/FichaSuscriptor';

// REDUX Actions
import { buscarUsuario } from '../../actions/buscarUsuarioActions';


class PrestamoLibro extends Component{

     state={ 
          noResultado : false,
          busqueda :'' 
     }
     
     // buscar alumno
     buscarAlumno = e => {
          e.preventDefault();

          // obtiene el valor a buscar
          const {busqueda} = this.state;
          
          // extrae los datos de firestore
          const { firestore, buscarUsuario } = this.props;

          // hace la consulta 
          const coleccion = firestore.collection('suscriptores');
          const consulta = coleccion.where("codigo", "==", busqueda).get();

          // leer resultados de busqueda
          consulta.then(resultado => {
               if(resultado.empty) {
                     // resultado NO encontrado
                    // almacenar en REDUX un objeto vacio
                    buscarUsuario({});
                    // actualiza el state en base a los resultados o NO !
                    this.setState({
                      noResultado: true,
                      resultado: {}   });
               }else {
                    // resultado encontrado
                    // coloca el resultado en el State de redux

                    const datos = resultado.docs[0];
                    buscarUsuario(datos.data());
                    // actualiza el state en base a los resultados o NO !
                    this.setState({
                         //resultado: datos.data(),
                         noResultado: false

                    })
               }
          })

     }

     // almacena el codigo en el state
     leerDato = e => {
          this.setState({
               [e.target.name] : e.target.value
          })
     }

     // almacena los datos del solicitante
     solicitarPrestamo =() => {
          const {usuario} = this.props;

          // fecha de solicitud
          usuario.fecha_solicitud = new Date().toLocaleDateString();
          // modificacion. porque los pros no se pueden clonar
          let prestados = [];
          prestados = [...this.props.libro.prestados, usuario];
       // copia del objeto y agregar prestados
          const libro = {...this.props.libro};

          // ellimina los prestados anteriores 
          delete libro.prestados;
          // asignar prestados
          libro.prestados = prestados;

          // obtiene firestore y history de props
          const { firestore, history} = this.props;

          // almacenar en la base de datos de firebase
          firestore.update({
               collection: 'libros',
               doc: libro.id
          }, libro).then(history.push('/'));
     }


     render() {

          // extraer el libro 
          const { libro} = this.props;
          // spinner de carga
          if(!libro) return <Spinner />

          // extraer datos alumno
          const { usuario} = this.props;

          let fichaAlumno, btnSolicitar;
          
          if(usuario.nombre){
               fichaAlumno = <FichaSuscriptor 
                            alumno={usuario}
               />
               btnSolicitar = <button type="button" 
                                    className="btn btn-warning btn-block mb-4" 
                                    onClick={this.solicitarPrestamo}>
                                    Solicitar Libro</button>
          }else{
               
          }

          // mostrar Mensaje de error
          const {noResultado}= this.state;
          let mensajeResultado = '';
          if(noResultado){
               mensajeResultado = <div className=" alert alert-danger display-4 text-center font-weight-bold">Usuario No encontrado!! </div>
          }else{
              mensajeResultado = null;
          }

          return(
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
                              Solicitar Prestamo : <span className="text-danger"> {libro.titulo} </span> 
                        </h2>
                        <div className="row justify-content-center mt-5">
                             <div className="col-md-8">
                                 <form onSubmit={this.buscarAlumno}  className="mb-4" >
                                      <legend className="color-primary text-center"> Buscar suscriptor por Codigo </legend>
                                      <div className="form-group">
                                           <input
                                           type="text"
                                           name="busqueda"
                                           placeholder="Buscar Usuario"
                                           className="form-control"
                                           onChange={this.leerDato}

                                           />
                                      </div>
                                      <input className="btn btn-block btn-success" type="submit" value="Buscar" />
                                </form> 
                                         {/* boton alumno y ficha */ }
                                {fichaAlumno}  {btnSolicitar}
                                {/* Mensaje Resultado*/}
                                {mensajeResultado}
                             </div>
                        </div>
                    </div>
             </div>
          );
     }
}





PrestamoLibro.porpTypes = {
     firestore: PropTypes.object.isRequired
}

export default compose(
     firestoreConnect(props => [{
          collection: 'libros',
          storeAs: 'libro',
          doc: props.match.params.id
     }]),
     connect(({ firestore: {ordered}, usuario}, props) => ({
          libro: ordered.libro && ordered.libro[0],
          usuario: usuario
     }), {buscarUsuario})
)(PrestamoLibro);
