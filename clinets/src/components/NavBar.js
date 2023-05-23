import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/usuarios">Usuarios</Link>
        </li>
        <li>
          <Link to="/categorias">Categorías</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
