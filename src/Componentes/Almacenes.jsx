import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Almacenes() {
  const [almacenStockData, setAlmacenStockData] = useState([]); // Datos del almacen stock
  const [almacenMaquinaData, setAlmacenMaquinaData] = useState([]); // Datos del almacen maquina
  const [insumos, setInsumos] = useState([]);
  const [insumoSeleccionado, setInsumoSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState(0);
  const [cantidadDisponible, setCantidadDisponible] = useState(0);
  const [mensaje, setMensaje] = useState('');

  // Función para obtener los insumos desde la API
  const fetchInsumos = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/insumos');
      setInsumos(response.data);
    } catch (error) {
      console.error('Error al obtener insumos:', error);
    }
  };

  // Función para obtener los datos del almacen_stock
  const fetchAlmacenStockData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/almacen-stock');
      setAlmacenStockData(response.data);
    } catch (error) {
      console.error('Error al obtener datos del almacen stock:', error);
    }
  };

  // Función para obtener los datos del almacen_maquina
  const fetchAlmacenMaquinaData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/almacen-maquina');
      setAlmacenMaquinaData(response.data);
    } catch (error) {
      console.error('Error al obtener datos del almacen maquina:', error);
    }
  };

  // Función para obtener la cantidad disponible del insumo seleccionado en el almacen_stock
  const fetchCantidadDisponible = async () => {
    if (insumoSeleccionado) {
      try {
        const response = await axios.get(`http://localhost:8000/api/almacen_stock/${insumoSeleccionado}`);
        setCantidadDisponible(response.data.cantidad); // Ajusta según la respuesta de tu API
      } catch (error) {
        console.error('Error al obtener cantidad disponible:', error);
      }
    }
  };

  // Efecto para cargar insumos y datos de los almacenes al montar el componente
  useEffect(() => {
    fetchInsumos();
    fetchAlmacenStockData();
    fetchAlmacenMaquinaData();
  }, []);

  // Efecto para verificar cantidad disponible al seleccionar un insumo
  useEffect(() => {
    fetchCantidadDisponible();
  }, [insumoSeleccionado]);

  // Manejar el envío del formulario de traspaso
  const handleTraspasoSubmit = async (e) => {
    e.preventDefault();

    const cantidadNumerica = parseInt(cantidad); // Convertir a número

    if (cantidadNumerica <= 0) {
      setMensaje(`Error: La cantidad debe ser mayor a 0.`);
      return;
    }

    if (cantidadNumerica > cantidadDisponible) {
      setMensaje(`Error: No hay suficiente cantidad disponible. Solo hay ${cantidadDisponible}.`);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/almacen-maquina/traspasar', {
        insumo_id: insumoSeleccionado,
        cantidad: cantidadNumerica, // Usar la cantidad numérica
      });

      setMensaje(`Traspaso realizado con éxito: ${response.data.message}`);
      setCantidad(0);
      setInsumoSeleccionado(''); // Resetear insumo seleccionado
      setCantidadDisponible(0); // Resetear la cantidad disponible
      
      // Volver a cargar los datos de los almacenes después del traspaso
      fetchAlmacenStockData();
      fetchAlmacenMaquinaData();
      
    } catch (error) {
      if (error.response) {
        setMensaje(`Error: ${error.response.data.message || 'No se pudo realizar el traspaso.'}`);
      } else {
        setMensaje('Error al comunicarse con el servidor.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1>Almacenes</h1>
      {mensaje && <div className="alert alert-info">{mensaje}</div>}

      {/* Formulario de traspaso de insumos */}
      <form onSubmit={handleTraspasoSubmit} className="mt-4">
        <h3>Traspasar Insumos</h3>
        <div className="form-group">
          <label htmlFor="insumo">Seleccionar Insumo</label>
          <select
            className="form-control"
            id="insumo"
            value={insumoSeleccionado}
            onChange={(e) => setInsumoSeleccionado(e.target.value)}
            required
          >
            <option value="">Seleccione un insumo</option>
            {insumos.map((insumo) => (
              <option key={insumo.id} value={insumo.id}>
                {insumo.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="cantidad">Cantidad a Traspasar (Disponible: {cantidadDisponible})</label>
          <input
            type="number"
            className="form-control"
            id="cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            min="1"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Traspasar Insumo
        </button>
      </form>

      {/* Sección para mostrar los datos de los almacenes */}
      <h3 className="mt-5">Almacén Stock</h3>
      <ul className="list-group">
        {almacenStockData.map((item) => (
          <li key={item.id} className="list-group-item">
            {item.insumo.nombre} - Cantidad: {item.cantidad}
          </li>
        ))}
      </ul>

      <h3 className="mt-5">Almacén Máquina</h3>
      <ul className="list-group">
        {almacenMaquinaData.map((item) => (
          <li key={item.id} className="list-group-item">
            {item.insumo.nombre} - Cantidad: {item.cantidad}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Almacenes;
