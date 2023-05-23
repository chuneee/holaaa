import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';

const CrudDevoluciones = () => {
    const [devoluciones, setDevoluciones] = useState([]);
    const [fechaDevolucion, setFechaDevolucion] = useState('');
    const [idUsuarioRecibe, setIdUsuarioRecibe] = useState('');
    const [idArticulo, setIdArticulo] = useState('');
    const [comentario, setComentario] = useState('');
    const [idEntrega, setIdEntrega] = useState('');
    const [selectedDevolucion, setSelectedDevolucion] = useState(null);

    useEffect(() => {
        getDevoluciones();
    }, []);

    const addDevolucion = () => {
        Axios.get(`http://localhost:3001/devoluciones/${idEntrega}`)
            .then((response) => {
                const devoluciones = response.data;
                if (devoluciones.length > 0) {
                    Swal.fire({
                        title: 'Error',
                        text: 'Ya existe una devolución para este ID de entrega',
                        icon: 'error',
                        timer: 3000,
                    });
                } else {
                    Axios.post('http://localhost:3001/createDevolucion', {
                        fecha_devolucion: fechaDevolucion,
                        id_usuario_recibe: idUsuarioRecibe,
                        id_articulo: idArticulo,
                        comentario: comentario,
                        id_entrega: idEntrega,
                    })
                        .then(() => {
                            Axios.put(`http://localhost:3001/inventario/${idArticulo}/disponible`)
                                .then(() => {
                                    getDevoluciones();
                                    limpiarDevolucion();
                                    Swal.fire({
                                        title: '<strong>Registro Exitoso!</strong>',
                                        html: '<i>Devolución realizada correctamente</i>',
                                        icon: 'success',
                                        timer: 3000,
                                    });
                                })
                                .catch((error) => {
                                    Swal.fire({
                                        title: 'Error',
                                        text: 'Hubo un problema al actualizar el estado del artículo',
                                        icon: 'error',
                                        timer: 3000,
                                    });
                                    console.error(error);
                                });
                        })
                        .catch((error) => {
                            Swal.fire({
                                title: 'Error',
                                text: 'Hubo un problema al agregar la devolución',
                                icon: 'error',
                                timer: 3000,
                            });
                            console.error(error);
                        });
                }
            })
            .catch((error) => {
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al verificar las devoluciones existentes',
                    icon: 'error',
                    timer: 3000,
                });
                console.error(error);
            });
    };

    const deleteDevolucion = (val) => {
        const idDevolucion = val.id_devolucion;
        Swal.fire({
            title: 'Confirmar eliminado?',
            html: '<i>Realmente desea eliminar la devolución con ID ' + idDevolucion + '?</i>',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!',
        }).then((result) => {
            if (result.isConfirmed) {
                Axios.delete(`http://localhost:3001/deleteDevolucion/${idDevolucion}`)
                    .then(() => {
                        getDevoluciones();
                        Swal.fire(
                            'Eliminado!',
                            'Devolución con ID ' + idDevolucion + ' fue eliminada.',
                            'success'
                        );
                    })
                    .catch((error) => {
                        Swal.fire({
                            title: 'Error',
                            text: 'Hubo un problema al eliminar la devolución',
                            icon: 'error',
                            timer: 3000,
                        });
                        console.error(error);
                    });
            }
        });
    };

    const editDevolucion = (devolucion) => {
        setSelectedDevolucion(devolucion);

        // Asignar los valores de la devolución a los campos de edición
        setFechaDevolucion(devolucion.fecha_devolucion);
        setIdUsuarioRecibe(devolucion.id_usuario_recibe);
        setIdArticulo(devolucion.id_articulo);
        setComentario(devolucion.comentario);
        setIdEntrega(devolucion.id_entrega);
    };

    const updateDevolucion = () => {
        Axios.put('http://localhost:3001/updateDevolucion', {
            id_devolucion: selectedDevolucion.id_devolucion,
            fecha_devolucion: fechaDevolucion,
            id_usuario_recibe: idUsuarioRecibe,
            id_articulo: idArticulo,
            comentario: comentario,
            id_entrega: idEntrega,
        })
            .then(() => {
                Axios.put(`http://localhost:3001/inventario/${idArticulo}/disponible`)
                    .then(() => {
                        getDevoluciones();
                        cancelEditDevolucion();
                        Swal.fire({
                            title: '<strong>Actualización Exitosa!</strong>',
                            html: '<i>La devolución se ha actualizado correctamente</i>',
                            icon: 'success',
                            timer: 3000,
                        });
                    })
                    .catch((error) => {
                        Swal.fire({
                            title: 'Error',
                            text: 'Hubo un problema al actualizar el estado del artículo',
                            icon: 'error',
                            timer: 3000,
                        });
                        console.error(error);
                    });
            })
            .catch((error) => {
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al actualizar la devolución',
                    icon: 'error',
                    timer: 3000,
                });
                console.error(error);
            });
    };

    const cancelEditDevolucion = () => {
        setSelectedDevolucion(null);
        limpiarDevolucion();
    };

    const limpiarDevolucion = () => {
        setFechaDevolucion('');
        setIdUsuarioRecibe('');
        setIdArticulo('');
        setComentario('');
        setIdEntrega('');
    };

    const getDevoluciones = () => {
        Axios.get('http://localhost:3001/devoluciones')
            .then((response) => {
                setDevoluciones(response.data);
            })
            .catch((error) => {
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al obtener las devoluciones',
                    icon: 'error',
                    timer: 3000,
                });
                console.error(error);
            });
    };

    return (
        <div className="container">
            <div className="card text-center">
                <div className="card-header">Gestión de devoluciones</div>
                <div className="card-body">
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">
                            Fecha de devolución:
                        </span>
                        <input
                            type="date"
                            onChange={(event) => setFechaDevolucion(event.target.value)}
                            className="form-control"
                            value={fechaDevolucion}
                            placeholder="Seleccione una fecha"
                            aria-label="Fecha de devolución"
                            aria-describedby="basic-addon1"
                        />
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">
                            ID Usuario que recibe:
                        </span>
                        <input
                            type="text"
                            onChange={(event) => {
                                setIdUsuarioRecibe(event.target.value);
                            }}
                            className="form-control"
                            value={idUsuarioRecibe}
                            placeholder="Ingrese el ID del usuario que recibe"
                            aria-label="ID Usuario que recibe"
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
                            ID Entrega:
                        </span>
                        <input
                            type="text"
                            onChange={(event) => {
                                setIdEntrega(event.target.value);
                            }}
                            className="form-control"
                            value={idEntrega}
                            placeholder="Ingrese el ID de la entrega"
                            aria-label="ID Entrega"
                            aria-describedby="basic-addon1"
                        />
                    </div>
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        {!selectedDevolucion ? (
                            <button onClick={addDevolucion} className="btn btn-success me-md-2" type="button">
                                Agregar Devolución
                            </button>
                        ) : (
                            <>
                                <button onClick={updateDevolucion} className="btn btn-success me-md-2" type="button">
                                    Guardar Cambios
                                </button>
                                <button
                                    onClick={cancelEditDevolucion}
                                    className="btn btn-secondary me-md-2"
                                    type="button"
                                >
                                    Cancelar Edición
                                </button>
                            </>
                        )}
                    </div>
                    <hr />
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID Devolución</th>
                                <th>Fecha de Devolución</th>
                                <th>ID Usuario que recibe</th>
                                <th>ID Artículo</th>
                                <th>Comentario</th>
                                <th>ID Entrega</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {devoluciones.map((devolucion) => (
                                <tr key={devolucion.id_devolucion}>
                                    <td>{devolucion.id_devolucion}</td>
                                    <td>{devolucion.fecha_devolucion}</td>
                                    <td>{devolucion.id_usuario_recibe}</td>
                                    <td>{devolucion.id_articulo}</td>
                                    <td>{devolucion.comentario}</td>
                                    <td>{devolucion.id_entrega}</td>
                                    <td>
                                        <button
                                            onClick={() => editDevolucion(devolucion)}
                                            className="btn btn-info me-md-2"
                                            type="button"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => deleteDevolucion(devolucion)}
                                            className="btn btn-danger"
                                            type="button"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CrudDevoluciones;
