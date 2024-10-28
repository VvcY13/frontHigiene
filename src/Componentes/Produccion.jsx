import React, { useState, useEffect } from "react";
import axios from "axios";

function Produccion() {
  const [produccionData, setProduccionData] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [insumosAgregados, setInsumosAgregados] = useState([]);
  const [formData, setFormData] = useState({
    insumo_id: "",
    inicial: "",
    tipo_medida: "mm",
    final: "",
  });
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const obtenerInsumos = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/insumos");
        setInsumos(response.data);
      } catch (error) {
        setMensaje("Error al cargar los insumos.");
      }
    };

    const obtenerProducciones = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/producciones");
        console.log(response.data);
        setProduccionData(response.data);
      } catch (error) {
        setMensaje("Error al cargar las producciones.");
      }
    };

    obtenerInsumos();
    obtenerProducciones();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const agregarInsumo = () => {
    if (formData.insumo_id && formData.inicial) {
      // Buscar el insumo completo por ID, convirtiendo insumo_id a número
      const insumoSeleccionado = insumos.find(insumo => insumo.id === Number(formData.insumo_id));
      if (insumoSeleccionado) {
        const nuevoInsumo = {
          insumo_id: insumoSeleccionado.id,
          nombre: insumoSeleccionado.nombre,
          inicial: formData.inicial,
          tipo_medida: formData.tipo_medida,
          final: formData.final,
        };
        setInsumosAgregados([...insumosAgregados, nuevoInsumo]);
        setFormData({ insumo_id: "", inicial: "", tipo_medida: "mm", final: "" });
      }
    }
  };

  const registrarProduccion = async (e) => {
    e.preventDefault();
    if (insumosAgregados.length === 0) {
      setMensaje("Por favor, agregue al menos un insumo antes de registrar la producción.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/produccion/inicio", {
        insumos: insumosAgregados,
      });

      setMensaje("Producción registrada exitosamente.");
      setProduccionData([
        ...produccionData,
        {
          id: response.data.produccion_id,
          producto: `Insumo ${insumosAgregados.map(item => item.nombre).join(", ")}`, // Usar el nombre
          cantidadProducida: insumosAgregados.reduce((sum, item) => sum + Number(item.inicial), 0),
          fecha: new Date().toISOString().split("T")[0],
        },
      ]);
      setInsumosAgregados([]); // Limpiar la lista de insumos agregados
    } catch (error) {
      if (error.response) {
        setMensaje(`Error: ${error.response.data.message || "Error al registrar la producción."}`);
      } else {
        setMensaje("Error al registrar la producción.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1>Producción</h1>

      <div className="card mt-4">
        <div className="card-header">
          <h3>Registrar Nueva Producción</h3>
        </div>
        <div className="card-body">
          {mensaje && <div className="alert alert-info">{mensaje}</div>}
          <form onSubmit={registrarProduccion}>
            <div className="mb-3">
              <label htmlFor="insumo_id" className="form-label">Insumo</label>
              <select
                className="form-select"
                id="insumo_id"
                name="insumo_id"
                value={formData.insumo_id}
                onChange={handleChange}
                required={insumosAgregados.length === 0}
              >
                <option value="">Seleccione un insumo</option>
                {insumos.map((insumo) => (
                  <option key={insumo.id} value={insumo.id}>
                    {insumo.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="inicial" className="form-label">Medida Inicial</label>
              <input
                type="number"
                className="form-control"
                id="inicial"
                name="inicial"
                value={formData.inicial}
                onChange={handleChange}
                required={insumosAgregados.length === 0}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="tipo_medida" className="form-label">Tipo de Medida</label>
              <select
                className="form-select"
                id="tipo_medida"
                name="tipo_medida"
                value={formData.tipo_medida}
                onChange={handleChange}
              >
                <option value="mm">Milímetros (mm)</option>
                <option value="kg">Kilogramos (kg)</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="final" className="form-label">Medida Final</label>
              <input
                type="number"
                className="form-control"
                id="final"
                name="final"
                value={formData.final}
                onChange={handleChange}
                required={insumosAgregados.length === 0}
              />
            </div>
            <button type="button" className="btn btn-secondary" onClick={agregarInsumo}>Agregar Insumo</button>
            <button type="submit" className="btn btn-primary">Registrar Producción</button>
          </form>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">
          <h3>Insumos Agregados</h3>
        </div>
        <div className="card-body">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Nombre Insumo</th> {/* Cambiado de ID Insumo a Nombre Insumo */}
                <th>Cantidad Inicial</th>
                <th>Tipo de Medida</th>
              </tr>
            </thead>
            <tbody>
              {insumosAgregados.map((item, index) => (
                <tr key={index}>
                  <td>{item.nombre}</td> {/* Mostrar el nombre en vez del ID */}
                  <td>{item.inicial}</td>
                  <td>{item.tipo_medida}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card mt-4">
  <div className="card-header">
    <h3>Producciones Registradas</h3>
  </div>
  <div className="card-body">
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>ID</th>
          <th>Insumos</th> {/* Cambiado para mostrar insumos */}
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        {produccionData.map((produccion) => (
          <tr key={produccion.id}>
            <td>{produccion.id}</td>
            <td>
              {produccion.insumos.map(insumo => (
                <div key={insumo.id}>
                  <strong>{insumo.insumo.nombre}</strong>: {insumo.inicial} {insumo.tipo_medida} (Final: {insumo.final})
                </div>
              ))}
            </td>
           
            <td>{new Date(produccion.created_at).toLocaleDateString()}</td> {/* Formato de fecha */}
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
