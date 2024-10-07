// src/components/Layout.js
import React from 'react';
import { Link, Outlet } from 'react-router-dom';

function Layout() {
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/'; // Redirigir al login
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          
          <Link className="nav-link" to="/home">Higiene y Cuidado</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
              <Link className="nav-link" to="/stock">Stock</Link>
              </li>
              <li className="nav-item">
              <Link className="nav-link" to="/almacenes">Almacenes</Link>
              </li>
              <li className="nav-item">
              <Link className="nav-link" to="/produccion">Producción</Link>
              </li>
              <li className="nav-item">
              <Link className="nav-link" to="/insumos">Insumos</Link>
              </li>
            </ul>
            <button className="btn btn-outline-danger" onClick={handleLogout}>Cerrar Sesión</button>
          </div>
        </div>
      </nav>

      {/* Aquí se renderiza el contenido de cada página */}
      <div className="container mt-5">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
