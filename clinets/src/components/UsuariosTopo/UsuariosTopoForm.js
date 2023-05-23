import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';

const CrudUsuarios = () => {
  const [crudusuarios, setCrudusuarios] = useState([]);
  const [nombre, setNombre] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [numero, setNumero] = useState('');
  const [editar, setEditar] = useState(false);
  const [usuariosList, setUsuarios] = useState([]);
  const [id_usuario, setId_usuario] = useState('');

  useEffect(() => {
    getUsuarios();
  }, []);

  const add = () => {
    Axios.post('http://localhost:3001/createUser', {
      nombre: nombre,
      departamento: departamento,
      numero: numero
    })
      .then(() => {
        getUsuarios();
        limpiarusuario();
        Swal.fire({
          title: '<strong>Registro Exitoso!</strong>',
          html: '<i>Usuario ' + nombre + ' ha Generado Correctamente</i>',
          icon: 'success',
          timer: 3000
        });
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al agregar el usuario',
          icon: 'error',
          timer: 3000
        });
        console.error(error);
      });
  };

  const update = () => {
    Axios.put('http://localhost:3001/updateUser', {
      id_usuario: id_usuario,
      nombre: nombre,
      departamento: departamento,
      numero: numero
    })
      .then(() => {
        getUsuarios();
        limpiarusuario();
        Swal.fire({
          title: '<strong>Actualizacion Exitosa!</strong>',
          html: '<i>Usuario ' + nombre + ' actualizado Correctamente</i>',
          icon: 'success',
          timer: 3000
        });
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al actualizar el usuario',
          icon: 'error',
          timer: 3000
        });
        console.error(error);
      });
  };

  const deleteUsuario = (val) => {
    const nombreUsuario = val.nombre;
    const idUsuario = val.id_usuario;

    Swal.fire({
      title: 'Confirmar eliminado?',
      html: '<i>Realmente desea eliminar a <strong>' + nombreUsuario + '</strong>?</i>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/deleteUser/${idUsuario}`)
          .then(() => {
            getUsuarios();
            limpiarusuario();
            Swal.fire('Eliminado!', nombreUsuario + ' fue eliminado.', 'success');
          })
          .catch((error) => {
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al eliminar al usuario',
              icon: 'error',
              timer: 3000
            });
            console.error(error);
          });
      }
    });
  };
  

  const editarUsuario = (val) => {
    setEditar(true);
    setNombre(val.nombre);
    setDepartamento(val.departamento);
    setNumero(val.numero);
    setId_usuario(val.id_usuario);
  };

  const limpiarusuario = () => {
    setNombre('');
    setDepartamento('');
    setNumero('');
    setEditar(false);
  };

  const getUsuarios = () => {
    Axios.get('http://localhost:3001/usuarios')
      .then((response) => {
        setUsuarios(response.data);
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al obtener los usuarios',
          icon: 'error',
          timer: 3000
        });
        console.error(error);
      });
  };

  return (
    <div className="container">
      <div className="card text-center">
        <div className="card-header">Gestion de usuarios</div>
        <div className="card-body">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Nombre:
            </span>
            <input
              type="text"
              onChange={(event) => {
                setNombre(event.target.value);
              }}
              className="form-control"
              value={nombre}
              placeholder="Introduzca su nombre completo"
              aria-label="Pancho Pantera"
              aria-describedby="basic-addon1"
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Departamento:
            </span>
            <input
              type="text"
              onChange={(event) => {
                setDepartamento(event.target.value);
              }}
              className="form-control"
              value={departamento}
              placeholder="Introduzca el departamento asignado"
              aria-label="Topografia"
              aria-describedby="basic-addon1"
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Numero Celular:
            </span>
            <input
              type="text"
              onChange={(event) => {
                setNumero(event.target.value);
              }}
              className="form-control"
              value={numero}
              placeholder="Introduzca un numero de contacto"
              aria-label="911"
              aria-describedby="basic-addon1"
            />
          </div>
        </div>
        <div className="card-footer text-muted">
          {editar ? (
            <div>
              <button className="btn btn-warning m-2" onClick={update}>
                Actualizar
              </button>
              <button className="btn btn-info m-2" onClick={limpiarusuario}>
                Cancelar
              </button>
            </div>
          ) : (
            <button className="btn btn-success" onClick={add}>
              Registrar
            </button>
          )}
        </div>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">ID Usuario</th>
            <th scope="col">Nombre</th>
            <th scope="col">Departamento</th>
            <th scope="col">Numero Celular</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(usuariosList) && usuariosList.length > 0 ? (
            usuariosList.map((val, key) => {
              return (
                <tr key={val.id_usuario}>
                  <th>{val.id_usuario}</th>
                  <td>{val.nombre}</td>
                  <td>{val.departamento}</td>
                  <td>{val.numero}</td>
                  <td>
                    <div className="btn-group" role="group" aria-label="Basic example">
                      <button
                        type="button"
                        onClick={() => editarUsuario(val)}
                        className="btn btn-info"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          deleteUsuario(val);
                        }}
                        className="btn btn-danger"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5">No hay usuarios registrados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CrudUsuarios;
