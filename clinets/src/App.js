import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import UsuariosTopoForm from './components/UsuariosTopo/UsuariosTopoForm'
import TipoCategoriaForm from './components/TipoCategoria/TipoCategoriaForm';

import CrudUsuarios from './components/UsuariosTopo/UsuariosTopoForm';
import CrudCategorias from './components/TipoCategoria/TipoCategoriaForm';
import CrudInventario from './components/InventarioTopo/InventarioTopoForm';
import CrudEntregas from './components/EntregasTopo/EntregasTopoForm';
import CrudDevoluciones from './components/DevolucionesTopo/DevolucionesTopoForm';


function App() {
  return (
    <div>
      <h1>CRUD RMS</h1>

      <CrudInventario />
      <CrudEntregas />
      <CrudDevoluciones />
      <CrudUsuarios />
      <CrudCategorias />
    </div>
  );
}

export default App;