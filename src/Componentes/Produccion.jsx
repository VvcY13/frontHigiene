// src/pages/Produccion.js
import React, { useState } from "react";

function Produccion() {
  // Datos simulados de producción
  const [produccionData, setProduccionData] = useState([
    {
      id: 1,
      producto: "Producto A",
      cantidadProducida: 100,
      fecha: "2024-10-01",
    },
    {
      id: 2,
      producto: "Producto B",
      cantidadProducida: 150,
      fecha: "2024-10-02",
    },
    {
      id: 3,
      producto: "Producto C",
      cantidadProducida: 200,
      fecha: "2024-10-03",
    },
  ]);

  return (
    <div className="container mt-5">
      <h1>Producción</h1>
      <div className="card mt-4">
        <div className="card-header">
          <h3>Registro de Producción</h3>
        </div>
        <div className="card-body">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Cantidad Producida</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {produccionData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.producto}</td>
                  <td>{item.cantidadProducida}</td>
                  <td>{item.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Produccion;
