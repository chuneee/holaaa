import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import '../../App.css';




const CrudInventario = () => {
  const [descripcion, setDescripcion] = useState('');
  const [no_serie, setNo_serie] = useState('');
  const [condicion, setCondicion] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [id_tipo, setID_tipo] = useState('');
  const [existencia, setExistencia] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [id_estatus, setID_estatus] = useState('');

  const [editar, setEditar] = useState(false);
  const [inventarioList, setInventario] = useState([]);
  const [id_articulo, setId_articulo] = useState('');
  const [tipos, setTipos] = useState([]); // Estado para almacenar los tipos
  const [filtro, setFiltro] = useState('');
  const [filtroModelo, setFiltroModelo] = useState('');



  useEffect(() => {
    getInventario(1);
    getTipos(); // Obtener los tipos al cargar el componente
  }, []);


  const getInventario = (page) => {
    const pageNumber = page || 1; // Establece 1 como valor predeterminado si `page` es undefined

    Axios.get(`http://localhost:3001/inventario/page/${pageNumber}`)
      .then((response) => {
        console.log(response.data);
        setInventario(
          response.data.map((item) => ({
            ...item,
            id_tipo: item.nombre_tipo,
            id_estatus: item.nombre_estatus,
          }))
        );
        setCurrentPage(pageNumber); // Actualiza el estado de currentPage con el número de página actual
      })
      .catch((error) => {
        console.error(error);
      });
  };


  const getTipos = () => {
    Axios.get('http://localhost:3001/categorias') // Endpoint para obtener los tipos desde la base de datos
      .then((response) => {
        console.log(response.data); // Para ver que es lo que esta mandando
        setTipos(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };




  const add = () => {
    const idEstatusActivo = 1;
    Axios.post('http://localhost:3001/createInventario', {
      descripcion: descripcion,
      no_serie: no_serie,
      condicion: condicion,
      marca: marca,
      modelo: modelo,
      id_tipo: id_tipo,
      existencia: existencia,
      comentarios: comentarios,
      id_estatus: idEstatusActivo // Establecer el valor del estatus activo
    })
      .then(response => {
        if (response.status === 200) {
          getInventario(currentPage); // Llama a getInventario con el número de página actual
          limpiarInventario();
          Swal.fire({
            title: '<strong>Registro Exitoso!</strong>',
            html: '<i>Artículo ' + descripcion + ' ha sido generado correctamente</i>',
            icon: 'success',
            timer: 3000
          });
        } else {
          throw new Error('Error al agregar el artículo');
        }
      })
      .catch(error => {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al agregar el artículo',
          icon: 'error',
          timer: 3000
        });
        console.error(error);
      });
  };

  const update = () => {
    const previousPage = currentPage; // Guarda el número de página actual antes de la actualización
  
    Axios.put('http://localhost:3001/updateInventario', {
      id_articulo,
      descripcion,
      no_serie,
      condicion,
      marca,
      modelo,
      id_tipo,
      existencia,
      comentarios,
      id_estatus
    })
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          getInventario(previousPage); // Vuelve a obtener los datos del inventario usando la página anterior
          limpiarInventario();
          Swal.fire({
            title: '<strong>Actualización Exitosa!</strong>',
            html: '<i>Artículo ' + descripcion + ' actualizado correctamente</i>',
            icon: 'success',
            timer: 3000
          });
        } else {
          throw new Error('Error al actualizar el artículo');
        }
      })
      .catch(error => {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al actualizar el artículo',
          icon: 'error',
          timer: 3000
        });
        console.error(error);
      });
  };
  
  const deleteInventario = (id_articulo) => {
    console.log("Eliminar artículo con ID:", id_articulo);

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el artículo del inventario',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/deleteInventario/${id_articulo}`)
          .then((response) => {
            console.log(response.data);
            getInventario();
            Swal.fire({
              title: '<strong>Eliminación Exitosa!</strong>',
              html: '<i>Artículo eliminado correctamente</i>',
              icon: 'success',
              timer: 3000
            });
          })
          .catch((error) => {
            console.log(error);
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al eliminar el artículo',
              icon: 'error',
              timer: 3000
            });
            console.error(error);
          });
      }
    });
  };


  const editarInventario = (id_articulo) => {
    setEditar(true);

    Axios.get(`http://localhost:3001/inventario/item/${id_articulo}`)
      .then(response => {
        if (response.status !== 200) {
          throw new Error('Error al obtener los datos del artículo');
        }
        return response.data;
      })
      .then(data => {
        if (data.length > 0) {
          const articulo = data[0];
          setDescripcion(articulo.descripcion);
          setNo_serie(articulo.no_serie);
          setCondicion(articulo.condicion);
          setMarca(articulo.marca);
          setModelo(articulo.modelo);
          setID_tipo(articulo.id_tipo);
          setExistencia(articulo.existencia);
          setComentarios(articulo.comentarios);
          setID_estatus(articulo.id_estatus);
          setId_articulo(articulo.id_articulo);
        } else {
          throw new Error('No se encontró ningún artículo con el ID especificado');
        }
      })
      .catch(error => {
        console.error(error);
        // Manejar el error, mostrar un mensaje de error, etc.
      });
  };

  const limpiarInventario = () => {
    setDescripcion('');
    setNo_serie('');
    setCondicion('');
    setMarca('');
    setModelo('');
    setID_tipo('');
    setExistencia('');
    setComentarios('');
    setID_estatus('');
    setEditar(false);
    setId_articulo('');
  };

  const handleSearch = () => {
    console.log('Buscar clicado');
    console.log('Valor de filtro:', filtro);
  
    Axios.get('http://localhost:3001/inventario/search?filtro=' + filtro)
      .then((response) => {
        console.log('Respuesta del servidor:', response.data);
        setInventario(
          response.data.map((item) => ({
            ...item,
            id_tipo: item.nombre_tipo,
            id_estatus: item.nombre_estatus,
          }))
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
  const handleReset = () => {
    setFiltro('');
    setFiltroModelo('');
    setInventario([]);
    handleSearch();
  };

  const handlePreviousPage = () => {
    const previousPage = currentPage - 1 > 0 ? currentPage - 1 : 1;
    getInventario(previousPage);
  };

  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    getInventario(nextPage);
  };

  const [currentPage, setCurrentPage] = useState(1);



  return (
    <div className="fixed-container">
      {/* <div className="fixed-container"> */}
      <h1 className="text-center mt-3">CRUD de Inventario</h1>
      <div className="row">
        <div className="col-md-4">
          <div className="card mt-4">
            <div className="card-body">
              <h5>Agregar/Editar Artículo</h5>

              <div className="d-flex justify-content-end mb-3">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Buscar por descripción o modelo"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleSearch}>
                  Buscar
                </button>
                <button className="btn btn-secondary ms-2" onClick={handleReset}>
                  Limpiar
                </button>
              </div>


              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <input type="text" className="form-control" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Número de Serie</label>
                <input type="text" className="form-control" value={no_serie} onChange={(e) => setNo_serie(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Condición</label>
                <input type="text" className="form-control" value={condicion} onChange={(e) => setCondicion(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Marca</label>
                <input type="text" className="form-control" value={marca} onChange={(e) => setMarca(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Modelo</label>
                <input type="text" className="form-control" value={modelo} onChange={(e) => setModelo(e.target.value)} />
              </div>


              <div className="mb-3">
                <label className="form-label">Tipo</label>
                <select className="form-control" value={id_tipo} onChange={(e) => setID_tipo(e.target.value)}>
                  <option value="">Seleccionar tipo</option>
                  {tipos.map((tipo) => (
                    <option key={tipo.id_tipo} value={tipo.id_tipo}>
                      {tipo.tipo}
                    </option>
                  ))}
                </select>
              </div>


              <div className="mb-3">
                <label className="form-label">Existencia</label>
                <input type="text" className="form-control" value={existencia} onChange={(e) => setExistencia(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Comentarios</label>
                <input type="text" className="form-control" value={comentarios} onChange={(e) => setComentarios(e.target.value)} />
              </div>
              {/* <div className="mb-3">
                <label className="form-label">ID Estatus</label>
                <input type="text" className="form-control" value={id_estatus} onChange={(e) => setID_estatus(e.target.value)} />
              </div> */}
              {!editar ? (
                <button type="button" className="btn btn-primary" onClick={add}>
                  Agregar
                </button>
              ) : (
                <button type="button" className="btn btn-warning" onClick={update}>
                  Actualizar
                </button>
              )}
              <button type="button" className="btn btn-secondary ms-2" onClick={limpiarInventario}>
                Limpiar
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <table className="table mt-4">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Descripción</th>
                <th scope="col">Número de Serie</th>
                <th scope="col">Condición</th>
                <th scope="col">Marca</th>
                <th scope="col">Modelo</th>
                <th scope="col">Tipo</th>
                <th scope="col">Existencia</th>
                <th scope="col">Comentarios</th>
                <th scope="col">Estatus</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {inventarioList.map((val, key) => {
                return (
                  <tr key={key}>
                    <td>{val.id_articulo}</td>
                    <td>{val.descripcion}</td>
                    <td>{val.no_serie}</td>
                    <td>{val.condicion}</td>
                    <td>{val.marca}</td>
                    <td>{val.modelo}</td>
                    <td>{val.nombre_tipo}</td>
                    <td>{val.existencia}</td>
                    <td>{val.comentarios}</td>
                    <td>
                      <span className={val.nombre_estatus === 'disponible' ? 'disponible' : 'no-disponible'} readOnly>
                        {val.nombre_estatus}
                      </span>
                    </td>
                    <td>
                      <button type="button" className="btn btn-info me-2" onClick={() => editarInventario(val.id_articulo)}>
                        Editar
                      </button>
                      <button type="button" className="btn btn-danger" onClick={() => deleteInventario(val.id_articulo)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* </div> */}
      <div className="pagination-container">
        <button className="btn btn-primary" onClick={handlePreviousPage}>
          Anterior
        </button>
        <button className="btn btn-primary" onClick={handleNextPage}>
          Siguiente
        </button>
      </div>


    </div>
  );
};

export default CrudInventario;
