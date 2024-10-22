// src/pages/Insumos.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function Insumos() {
  const [insumoData, setInsumoData] = useState([]);
  const [nombre, setNombre] = useState("");
  const [diametroStandar, setDiametroStandar] = useState("");
  const [kilosStandar, setKilosStandar] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInsumos();
  }, []);

  const fetchInsumos = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/insumos");
      setInsumoData(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/insumos", {
        nombre,
        diametro_standar: diametroStandar,
        kilos_standar: kilosStandar,
      });
      setInsumoData([...insumoData, response.data]);
      setNombre("");
      setDiametroStandar("");
      setKilosStandar("");
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setError(err.response.data);
      } else {
        console.error(err);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/insumos/${id}`);
      setInsumoData(insumoData.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Insumos</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Diámetro Estándar (cm)</label>
          <input
            type="number"
            className="form-control"
            value={diametroStandar}
            onChange={(e) => setDiametroStandar(e.target.value)}
            required
            min="0"
          />
        </div>
        <div className="form-group">
          <label>Kilos Estándar</label>
          <input
            type="number"
            className="form-control"
            value={kilosStandar}
            onChange={(e) => setKilosStandar(e.target.value)}
            required
            min="0"
          />
        </div>
        {error && (
          <div className="alert alert-danger">{JSON.stringify(error)}</div>
        )}
        <button type="submit" className="btn btn-primary mt-3">
          Agregar Insumo
        </button>
      </form>

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
                <th>Diámetro Estándar</th>
                <th>Kilos Estándar</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {insumoData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.nombre}</td>
                  <td>{item.diametro_standar}</td>
                  <td>{item.kilos_standar}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="btn btn-danger"
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
}

export default Insumos;
