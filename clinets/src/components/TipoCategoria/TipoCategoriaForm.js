import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';

const CrudCategorias = () => {
  const [tipo, setTipo] = useState('');
  const [editarcategoria, setEditarcategoria] = useState(false);
  const [categoriasList, setCategorias] = useState([]);
  const [id_tipo, setId_tipo] = useState('');

  useEffect(() => {
    getCategorias();
  }, []);

  const addCategoria = () => {
    Axios.post('http://localhost:3001/createtipo', {
      tipo: tipo
    })
      .then(() => {
        getCategorias();
        limpiarCategoria();
        Swal.fire({
          title: '<strong>Registro Exitoso!</strong>',
          html: '<i>Categoría ' + tipo + ' ha sido generada correctamente</i>',
          icon: 'success',
          timer: 3000
        });
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al agregar la categoría',
          icon: 'error',
          timer: 3000
        });
        console.error(error);
      });
  };

  const updateCategoria = () => {
    Axios.put('http://localhost:3001/updatetipo', {
      id_tipo: id_tipo,
      tipo: tipo
    })
      .then(() => {
        getCategorias();
        limpiarCategoria();
        Swal.fire({
          title: '<strong>Actualización Exitosa!</strong>',
          html: '<i>Categoría ' + tipo + ' actualizada correctamente</i>',
          icon: 'success',
          timer: 3000
        });
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al actualizar la categoría',
          icon: 'error',
          timer: 3000
        });
        console.error(error);
      });
  };

  const deleteCategoria = (val) => {
    const tipoCategoria = val.tipo;
    const idTipo = val.id_tipo;

    Swal.fire({
      title: 'Confirmar eliminado?',
      html: '<i>Realmente desea eliminar la categoría <strong>' + tipoCategoria + '</strong>?</i>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/delete/${idTipo}`)
          .then(() => {
            getCategorias();
            limpiarCategoria();
            Swal.fire('Eliminada!', tipoCategoria + ' fue eliminada.', 'success');
          })
          .catch((error) => {
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al eliminar la categoría',
              icon: 'error',
              timer: 3000
            });
            console.error(error);
          });
      }
    });
  };

  const editarCategoria = (val) => {
    setEditarcategoria(true);
    setTipo(val.tipo);
    setId_tipo(val.id_tipo);
  };

  const limpiarCategoria = () => {
    setTipo('');
    setEditarcategoria(false);
  };

  const getCategorias = () => {
    Axios.get('http://localhost:3001/categorias')
      .then((response) => {
        setCategorias(response.data);
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al obtener las categorías',
          icon: 'error',
          timer: 3000
        });
        console.error(error);
      });
  };

  return (
    <div className="container">
      <div className="card text-center">
        <div className="card-header">Gestión de categorías</div>
        <div className="card-body">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Tipo:
            </span>
            <input
              type="text"
              onChange={(event) => {
                setTipo(event.target.value);
              }}
              className="form-control"
              value={tipo}
              placeholder="Introduzca el tipo de categoría"
              aria-label="Tipo de Categoría"
              aria-describedby="basic-addon1"
            />
          </div>
        </div>
        <div className="card-footer text-muted">
          {editarcategoria ? (
            <div>
              <button className="btn btn-warning m-2" onClick={updateCategoria}>
                Actualizar
              </button>
              <button className="btn btn-info m-2" onClick={limpiarCategoria}>
                Cancelar
              </button>
            </div>
          ) : (
            <button className="btn btn-success" onClick={addCategoria}>
              Registrar
            </button>
          )}
        </div>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">ID Categoría</th>
            <th scope="col">Tipo</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(categoriasList) && categoriasList.length > 0 ? (
            categoriasList.map((val, key) => {
              return (
                <tr key={val.id_tipo}>
                  <th>{val.id_tipo}</th>
                  <td>{val.tipo}</td> {/* Aquí se muestra el nombre del tipo */}
                  <td>
                    <div className="btn-group" role="group" aria-label="Basic example">
                      <button
                        type="button"
                        onClick={() => editarCategoria(val)}
                        className="btn btn-info"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          deleteCategoria(val);
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
              <td colSpan="3">No hay categorías registradas</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CrudCategorias;
