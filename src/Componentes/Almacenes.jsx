import React, { useState } from 'react';

function Almacenes() {
  // Datos simulados de almacenes
  const [almacenData, setAlmacenData] = useState([
    { id: 1, nombre: 'Almacén Principal', ubicacion: 'Centro', capacidad: 1000 },
    { id: 2, nombre: 'Almacén Secundario', ubicacion: 'Norte', capacidad: 500 },
    { id: 3, nombre: 'Almacén Temporal', ubicacion: 'Este', capacidad: 200 },
  ]);

  return (
    <div className="container mt-5">
      <h1>Almacenes</h1>
      <div className="card mt-4">
        <div className="card-header">
          <h3>Lista de Almacenes</h3>
        </div>
        <div className="card-body">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Ubicación</th>
                <th>Capacidad (m³)</th>
              </tr>
            </thead>
            <tbody>
              {almacenData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.nombre}</td>
                  <td>{item.ubicacion}</td>
                  <td>{item.capacidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Almacenes;