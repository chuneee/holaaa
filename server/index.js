const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "inventario_topografia",
  dateStrings: 'date'
});

app.post("/createUser", (req, res) => {
  const nombre = req.body.nombre;
  const departamento = req.body.departamento;
  const numero = req.body.numero;

  db.query(
    "INSERT INTO usuarios_topo (nombre,departamento,numero) VALUES (?,?,?)",
    [nombre, departamento, numero],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error creating user");
      } else {
        res.send("Usuario generado con éxito!!");
      }
    }
  );
});

app.put("/updateUser", (req, res) => {
  const id_usuario = req.body.id_usuario;
  const nombre = req.body.nombre;
  const departamento = req.body.departamento;
  const numero = req.body.numero;

  db.query(
    "UPDATE usuarios_topo SET nombre=?,departamento=?,numero=? WHERE id_usuario=?",
    [nombre, departamento, numero, id_usuario],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al modificar el usuario");
      } else {
        res.send(result);
      }
    }
  );
});


app.delete("/deleteUser/:id_usuario", (req, res) => {
  const id_usuario = req.params.id_usuario;

  db.query("DELETE FROM usuarios_topo WHERE id_usuario=?", id_usuario,
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al Eliminar el usuario");
      } else {
        res.send(result);
      }
    }
  );
});


app.get("/usuarios", (req, res) => {
  db.query("SELECT * FROM usuarios_topo", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error retrieving users");
    } else {
      res.send(result);
    }
  });
});

// app.listen(3001, () => {
//   console.log("Servidor corriendo en el puerto 3001");
// });

// -------------------------------------------------------Tabla tipo categoria--------------------------------------------------------

app.post("/createtipo", (req, res) => {
  const tipo = req.body.tipo;

  db.query(
    "INSERT INTO tipo_categoria (tipo) VALUES (?)",
    [tipo],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error creating category");
      } else {
        res.send("Categoría creada con éxito!!");
      }
    }
  );
});

app.put("/updatetipo", (req, res) => {
  const id_tipo = req.body.id_tipo;
  const tipo = req.body.tipo;

  db.query(
    "UPDATE tipo_categoria SET tipo = ? WHERE id_tipo = ?",
    [tipo, id_tipo],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al modificar la categoría");
      } else {
        res.send(result);
      }
    }
  );
});

app.delete("/delete/:id_tipo", (req, res) => {
  const id_tipo = req.params.id_tipo;

  db.query("DELETE FROM tipo_categoria WHERE id_tipo = ?", id_tipo,
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al eliminar la categoría");
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/categorias", (req, res) => {
  db.query("SELECT * FROM tipo_categoria", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error retrieving categories");
    } else {
      res.send(result);
    }
  });
});

// app.listen(3001, () => {
//   console.log("Servidor corriendo en el puerto 3001");
// });


// -------------------------------------------------------Tabla tipo categoria--------------------------------------------------------


// -------------------------------------------------------Tabla Inventario_Topografia--------------------------------------------------------
app.post("/createInventario", (req, res) => {
  const descripcion = req.body.descripcion;
  const no_serie = req.body.no_serie;
  const condicion = req.body.condicion;
  const marca = req.body.marca;
  const modelo = req.body.modelo;
  const id_tipo = req.body.id_tipo;
  const existencia = req.body.existencia;
  const comentarios = req.body.comentarios;
  const id_estatus = req.body.id_estatus;

  db.query(
    "INSERT INTO inventario_topo (descripcion, no_serie, condicion, marca, modelo, id_tipo, existencia, comentarios, id_estatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [descripcion, no_serie, condicion, marca, modelo, id_tipo, existencia, comentarios, id_estatus],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error creating article");
      } else {
        res.send("Artículo creado con éxito!!");
      }
    }
  );
});

app.put("/updateInventario", (req, res) => {
  const id_articulo = req.body.id_articulo;
  const descripcion = req.body.descripcion;
  const no_serie = req.body.no_serie;
  const condicion = req.body.condicion;
  const marca = req.body.marca;
  const modelo = req.body.modelo;
  const id_tipo = req.body.id_tipo;
  const existencia = req.body.existencia;
  const comentarios = req.body.comentarios;
  const id_estatus = req.body.id_estatus;
  console.log("Received data:", req.body);

  db.query(
    "UPDATE inventario_topo SET descripcion = ?, no_serie = ?, condicion = ?, marca = ?, modelo = ?, id_tipo = ?, existencia = ?, comentarios = ?, id_estatus = ? WHERE id_articulo = ?",
    [descripcion, no_serie, condicion, marca, modelo, id_tipo, existencia, comentarios, id_estatus, id_articulo],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al modificar el artículo");
      } else {
        res.send(result);
      }
    }
  );
});

// db.query("DELETE FROM inventario_topo WHERE id_articulo = ?", [id_articulo],
//   (err, result) => {
//     if (err) {
//       console.log(err);
//       res.status(500).send("Error al eliminar el artículo");
//     } else {
//       res.send(result);
//     }
//   }
// );

app.delete("/deleteInventario/:id_articulo", (req, res) => {
  const id_articulo = req.params.id_articulo;
  console.log("Deleting article with ID:", id_articulo);

  db.query("DELETE FROM inventario_topo WHERE id_articulo = ?", id_articulo, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error al eliminar el artículo");
    } else {
      console.log("Article deleted successfully");
      res.send(result);
    }
  });
});


app.get("/inventario", (req, res) => {
  db.query(
    "SELECT inventario_topo.*, tipo_categoria.tipo AS nombre_tipo, estatus_inventario.nombre_estatus FROM inventario_topo JOIN tipo_categoria ON inventario_topo.id_tipo = tipo_categoria.id_tipo JOIN estatus_inventario ON inventario_topo.id_estatus = estatus_inventario.id_estatus",
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al obtener los artículos del inventario");
      } else {
        res.send(result);
      }
    }
  );
});



app.get("/inventario/page/:page", (req, res) => {
  const page = req.params.page || 1; // Obtén el número de página de los parámetros de la solicitud o utiliza 1 como valor predeterminado
  const limit = 16; // Número de registros por página
  const offset = (page - 1) * limit; // Calcula el desplazamiento basado en el número de página

  const query = `SELECT inventario_topo.*, tipo_categoria.tipo AS nombre_tipo, estatus_inventario.nombre_estatus 
                 FROM inventario_topo 
                 JOIN tipo_categoria ON inventario_topo.id_tipo = tipo_categoria.id_tipo 
                 JOIN estatus_inventario ON inventario_topo.id_estatus = estatus_inventario.id_estatus
                 LIMIT ${limit} OFFSET ${offset}`;

  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error retrieving articles");
    } else {
      res.send(result);
    }
  });
});



app.get("/inventario/item/:id_articulo", (req, res) => {
  const id_articulo = req.params.id_articulo;

  db.query(
    "SELECT inventario_topo.*, tipo_categoria.tipo AS nombre_tipo, estatus_inventario.nombre_estatus FROM inventario_topo JOIN tipo_categoria ON inventario_topo.id_tipo = tipo_categoria.id_tipo JOIN estatus_inventario ON inventario_topo.id_estatus = estatus_inventario.id_estatus WHERE inventario_topo.id_articulo = ?",
    [id_articulo], // Pasa el valor del ID del artículo como un arreglo
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving article");
      } else {
        res.send(result);
      }
    }
  );
});


app.get("/inventario/search", (req, res) => {
  const filtro = req.query.filtro;
  console.log(filtro);

  db.query(
    "SELECT inventario_topo.*, tipo_categoria.tipo AS nombre_tipo, estatus_inventario.nombre_estatus FROM inventario_topo JOIN tipo_categoria ON inventario_topo.id_tipo = tipo_categoria.id_tipo JOIN estatus_inventario ON inventario_topo.id_estatus = estatus_inventario.id_estatus WHERE LOWER(inventario_topo.descripcion) LIKE LOWER(?) OR LOWER(inventario_topo.modelo) LIKE LOWER(?)",
    ["%" + filtro.toLowerCase() + "%", "%" + filtro.toLowerCase() + "%"],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al recuperar los artículos");
      } else {
        res.send(result);
      }
    }
  );
});




app.listen(3001, () => {
  console.log("Servidor corriendo en el puerto 3001");
});

// ------------------------------------------------------------------------------------------------
// Marcar el artículo como no disponible
app.put('/inventario/:id/no-disponible', (req, res) => {
  const idArticulo = req.params.id;

  db.query(
    'UPDATE inventario_topo SET id_estatus = 2 WHERE id_articulo = ?',
    [idArticulo],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error al actualizar el estado del artículo');
      } else {
        res.sendStatus(200);
      }
    }
  );
});

// Marcar el artículo como disponible
app.put('/inventario/:id/disponible', (req, res) => {
  const idArticulo = req.params.id;

  db.query(
    'UPDATE inventario_topo SET id_estatus = 1 WHERE id_articulo = ?',
    [idArticulo],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error al actualizar el estado del artículo');
      } else {
        res.sendStatus(200);
      }
    }
  );
});
// ------------------------------------------------------------------------------------------------


// -------------------------------------------------------Tabla Inventario_Topografia--------------------------------------------------------


// -------------------------------------------------------Tabla entregas--------------------------------------------------------


app.post("/createEntrega", (req, res) => {
  const { fecha_entrega, id_usuario_entrega, id_articulo, comentario, entregado } = req.body;

  // Insertar la entrega en la tabla "entregas"
  db.query(
    "INSERT INTO entregas (fecha_entrega, id_usuario_entrega, id_articulo, comentario, entregado) VALUES (?, ?, ?, ?, ?)",
    [fecha_entrega, id_usuario_entrega, id_articulo, comentario, entregado],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al crear la entrega");
      } else {
        // Actualizar el estado del artículo en la tabla "inventario_topo" a no disponible
        db.query(
          "UPDATE inventario_topo SET id_estatus = 2 WHERE id_articulo = ?",
          [id_articulo],
          (err, result) => {
            if (err) {
              console.log(err);
              res.status(500).send("Error al actualizar el estado del artículo");
            } else {
              // Marcar como no disponible exitosamente
              // También puedes enviar el resultado de la entrega si es necesario
              res.send("Entrega realizada correctamente");
            }
          }
        );
      }
    }
  );
});

app.delete("/deleteEntrega/:id_entrega", (req, res) => {
  const id_entrega = req.params.id_entrega;

  db.query("DELETE FROM entregas WHERE id_entrega=?", id_entrega, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error al eliminar la entrega");
    } else {
      res.send(result);
    }
  });
});

app.get("/entregas", (req, res) => {
  db.query("SELECT * FROM entregas", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error al obtener las entregas");
    } else {
      res.send(result);
    }
  });
});


app.put("/updateEntrega", (req, res) => {
  const id_entrega = req.body.id_entrega;
  const fecha_entrega = req.body.fecha_entrega;
  const id_usuario_entrega = req.body.id_usuario_entrega;
  const id_articulo = req.body.id_articulo;
  const comentario = req.body.comentario;
  const entregado = req.body.entregado;

  db.query(
    "UPDATE entregas SET fecha_entrega=?, id_usuario_entrega=?, id_articulo=?, comentario=?, entregado=? WHERE id_entrega=?",
    [fecha_entrega, id_usuario_entrega, id_articulo, comentario, entregado, id_entrega],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al modificar la entrega");
      } else {
        res.send(result);
      }
    }
  );
});

// -------------------------------------------------------Tabla entregas--------------------------------------------------------

// -------------------------------------------------------Tabla devoluciones--------------------------------------------------------


// Crear una devolución y marcar el artículo como disponible
app.post('/createDevolucion', (req, res) => {
  const { fecha_devolucion, id_usuario_recibe, id_articulo, comentario, id_entrega } = req.body;

  // Insertar la devolución en la tabla "devoluciones"
  db.query(
    'INSERT INTO devoluciones (fecha_devolucion, id_usuario_recibe, id_articulo, comentario, id_entrega) VALUES (?, ?, ?, ?, ?)',
    [fecha_devolucion, id_usuario_recibe, id_articulo, comentario, id_entrega],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error al crear la devolución');
      } else {
        // Actualizar el estado del artículo en la tabla "inventario_topo" a disponible
        db.query(
          'UPDATE inventario_topo SET id_estatus = 1 WHERE id_articulo = ?',
          [id_articulo],
          (err, result) => {
            if (err) {
              console.log(err);
              res.status(500).send('Error al actualizar el estado del artículo');
            } else {
              res.send('Devolución realizada correctamente');
            }
          }
        );
      }
    }
  );
});

app.delete("/deleteDevolucion/:id_devolucion", (req, res) => {
  const id_devolucion = req.params.id_devolucion;

  db.query("DELETE FROM devoluciones WHERE id_devolucion=?", id_devolucion, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error al eliminar la devolución");
    } else {
      res.send(result);
    }
  });
});

app.get("/devoluciones", (req, res) => {
  db.query("SELECT * FROM devoluciones", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error al obtener las devoluciones");
    } else {
      res.send(result);
    }
  });
});

app.put("/updateDevolucion", (req, res) => {
  const { id_devolucion, fecha_devolucion, id_usuario_recibe, id_articulo, comentario, id_entrega } = req.body;

  db.query(
    "UPDATE devoluciones SET fecha_devolucion=?, id_usuario_recibe=?, id_articulo=?, comentario=?, id_entrega=? WHERE id_devolucion=?",
    [fecha_devolucion, id_usuario_recibe, id_articulo, comentario, id_entrega, id_devolucion],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al modificar la devolución");
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/devoluciones/:id_entrega", (req, res) => {
  const id_entrega = req.params.id_entrega;

  db.query("SELECT * FROM devoluciones WHERE id_entrega = ?", id_entrega, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error al obtener las devoluciones");
    } else {
      res.send(result);
    }
  });
});

