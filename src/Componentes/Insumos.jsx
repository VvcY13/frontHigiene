// src/pages/Insumos.js
import React, { useState } from 'react';

function Insumos() {
  // Datos simulados de insumos
  const [insumoData, setInsumoData] = useState([
    { id: 1, nombre: 'Insumo A', cantidad: 500, unidad: 'kg' },
    { id: 2, nombre: 'Insumo B', cantidad: 250, unidad: 'litros' },
    { id: 3, nombre: 'Insumo C', cantidad: 100, unidad: 'unidades' },
  ]);

  return (
    <div className="container mt-5">
      <h1>Insumos</h1>
      <div className="card mt-4">
        <div className="card-header">
          <h3>Lista de Insumos</h3>
        </div>
        <div className="card-body">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Unidad</th>
              </tr>
            </thead>
            <tbody>
              {insumoData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.nombre}</td>
                  <td>{item.cantidad}</td>
                  <td>{item.unidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Insumos;
