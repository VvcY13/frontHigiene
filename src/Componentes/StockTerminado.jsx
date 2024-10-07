import React, { useState } from 'react';

function StockTerminado() {
  // Datos simulados de stock de productos
  const [stockData, setStockData] = useState([
    { id: 1, producto: 'Pads de Entrenamiento', cantidad: 150 },
    { id: 2, producto: 'Pads para Adultos', cantidad: 200 },
    { id: 3, producto: 'Rollo de Tela A', cantidad: 50 },
    { id: 4, producto: 'Rollo de Tela B', cantidad: 75 }
  ]);

  return (
    <div className="container mt-5">
      <h1>Stock de Productos</h1>
      <div className="card mt-4">
        <div className="card-header">
          <h3>Lista de Productos</h3>
        </div>
        <div className="card-body">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {stockData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.producto}</td>
                  <td>{item.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StockTerminado;