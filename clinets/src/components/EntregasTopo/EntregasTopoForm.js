import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';

const CrudEntregas = () => {
    const [entregas, setEntregas] = useState([]);
    const [fechaEntrega, setFechaEntrega] = useState('');
    const [idUsuarioEntrega, setIdUsuarioEntrega] = useState('');
    const [idArticulo, setIdArticulo] = useState('');
    const [comentario, setComentario] = useState('');
    const [entregado, setEntregado] = useState('');
    const [selectedEntrega, setSelectedEntrega] = useState(null);

    useEffect(() => {
        getEntregas();
    }, []);

    const addEntrega = () => {
        Axios.post('http://localhost:3001/createEntrega', {
            fecha_entrega: fechaEntrega,
            id_usuario_entrega: idUsuarioEntrega,
            id_articulo: idArticulo,
            comentario: comentario,
            entregado: entregado,
        })
            .then(() => {
                getEntregas();
                limpiarEntrega();
                Swal.fire({
                    title: '<strong>Registro Exitoso!</strong>',
                    html: '<i>Entrega realizada correctamente</i>',
                    icon: 'success',
                    timer: 3000,
                });
            })
            .catch((error) => {
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al agregar la entrega',
                    icon: 'error',
                    timer: 3000,
                });
                console.error(error);
            });
    };

    const deleteEntrega = (val) => {
        const idEntrega = val.id_entrega;
        Swal.fire({
            title: "Confirmar eliminado?",
            html: "<i>Realmente desea eliminar la entrega con ID " + idEntrega + "?</i>",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, eliminar!",
        }).then((result) => {
            if (result.isConfirmed) {
                Axios.delete(`http://localhost:3001/deleteEntrega/${idEntrega}`)
                    .then(() => {
                        getEntregas();
                        Swal.fire(
                            "Eliminado!",
                            "Entrega con ID " + idEntrega + " fue eliminada.",
                            "success"
                        );
                    })
                    .catch((error) => {
                        Swal.fire({
                            title: "Error",
                            text: "Hubo un problema al eliminar la entrega",
                            icon: "error",
                            timer: 3000,
                        });
                        console.error(error);
                    });
            }
        });
    };

    const editEntrega = (entrega) => {
        setSelectedEntrega(entrega);

        // Asignar los valores de la entrega a los campos de edición
        setFechaEntrega(entrega.fecha_entrega);
        setIdUsuarioEntrega(entrega.id_usuario_entrega);
        setIdArticulo(entrega.id_articulo);
        setComentario(entrega.comentario);
        setEntregado(entrega.entregado);
    };

    const updateEntrega = () => {
        Axios.put('http://localhost:3001/updateEntrega', {
            id_entrega: selectedEntrega.id_entrega,
            fecha_entrega: fechaEntrega,
            id_usuario_entrega: idUsuarioEntrega,
            id_articulo: idArticulo,
            comentario: comentario,
            entregado: entregado,
        })
            .then(() => {
                getEntregas();
                cancelEditEntrega();
                Swal.fire({
                    title: '<strong>Actualización Exitosa!</strong>',
                    html: '<i>La entrega se ha actualizado correctamente</i>',
                    icon: 'success',
                    timer: 3000,
                });
            })
            .catch((error) => {
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al actualizar la entrega',
                    icon: 'error',
                    timer: 3000,
                });
                console.error(error);
            });
    };


    const cancelEditEntrega = () => {
        setSelectedEntrega(null);
        limpiarEntrega();
    };



    const limpiarEntrega = () => {
        setFechaEntrega('');
        setIdUsuarioEntrega('');
        setIdArticulo('');
        setComentario('');
        setEntregado('');
    };

    const getEntregas = () => {
        Axios.get('http://localhost:3001/entregas')
            .then((response) => {
                setEntregas(response.data);
            })
            .catch((error) => {
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al obtener las entregas',
                    icon: 'error',
                    timer: 3000
                });
                console.error(error);
            });
    };

    return (
        <div className="container">
            <div className="card text-center">
                <div className="card-header">Gestión de entregas</div>
                <div className="card-body">
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">
                            Fecha de entrega:
                        </span>
                        <input
                            type="date"
                            onChange={(event) => setFechaEntrega(event.target.value)}
                            className="form-control"
                            value={fechaEntrega}
                            placeholder="Seleccione una fecha"
                            aria-label="Fecha de entrega"
                            aria-describedby="basic-addon1"
                        />
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">
                            ID Usuario de entrega:
                        </span>
                        <input
                            type="text"
                            onChange={(event) => {
                                setIdUsuarioEntrega(event.target.value);
                            }}
                            className="form-control"
                            value={idUsuarioEntrega}
                            placeholder="Ingrese el ID del usuario de entrega"
                            aria-label="ID Usuario de entrega"
                            aria-describedby="basic-addon1"
                        />
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">
                            ID Artículo:
                        </span>
                        <input
                            type="text"
                            onChange={(event) => {
                                setIdArticulo(event.target.value);
                            }}
                            className="form-control"
                            value={idArticulo}
                            placeholder="Ingrese el ID del artículo"
                            aria-label="ID Artículo"
                            aria-describedby="basic-addon1"
                        />
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">
                            Comentario:
                        </span>
                        <input
                            type="text"
                            onChange={(event) => {
                                setComentario(event.target.value);
                            }}
                            className="form-control"
                            value={comentario}
                            placeholder="Ingrese un comentario"
                            aria-label="Comentario"
                            aria-describedby="basic-addon1"
                        />
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">
                            Entregado:
                        </span>
                        <select
                            className="form-control"
                            value={entregado}
                            onChange={(event) => setEntregado(event.target.value)}
                        >
                            <option value="true">Sí</option>
                            <option value="false">No</option>
                        </select>
                    </div>

                </div>
                <div className="card-footer text-muted">
                    {selectedEntrega ? (
                        <>
                            <button className="btn btn-primary me-2" onClick={updateEntrega}>
                                Actualizar entrega
                            </button>
                            <button className="btn btn-secondary" onClick={cancelEditEntrega}>
                                Cancelar
                            </button>
                        </>
                    ) : (
                        <button className="btn btn-success" onClick={addEntrega}>
                            Registrar entrega
                        </button>
                    )}
                </div>
            </div>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">ID Entrega</th>
                        <th scope="col">Fecha de entrega</th>
                        <th scope="col">ID Usuario de entrega</th>
                        <th scope="col">ID Artículo</th>
                        <th scope="col">Comentario</th>
                        <th scope="col">Entregado</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(entregas) && entregas.length > 0 ? (
                        entregas.map((val, key) => {
                            return (
                                <tr key={val.id_entrega}>
                                    <th>{val.id_entrega}</th>
                                    <td>{val.fecha_entrega}</td>
                                    <td>{val.id_usuario_entrega}</td>
                                    <td>{val.id_articulo}</td>
                                    <td>{val.comentario}</td>
                                    <td>{val.entregado ? 'Disponible' : 'No disponible'}</td>
                                    <td>
                                        <div className="btn-group" role="group" aria-label="Basic example">
                                            <button
                                                type="button"
                                                onClick={() => editEntrega(val)}
                                                className="btn btn-info"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    deleteEntrega(val);
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
                            <td colSpan="7">No hay entregas registradas</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CrudEntregas;
