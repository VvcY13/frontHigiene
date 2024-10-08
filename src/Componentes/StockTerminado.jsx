import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

function StockTerminado() {
    const [stockData, setStockData] = useState([]);
    const [newStock, setNewStock] = useState({ id_producto: '', id_medida: '', cantidad_unitaria: '' });
    const [productos, setProductos] = useState([]);
    const [medidas, setMedidas] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(''); // Estado para el producto seleccionado

    const fetchStockData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/productos-medidas');
            const data = await response.json();
            console.log('Datos recuperados:', data);
            setStockData(data);
        } catch (error) {
            console.error('Error fetching stock data:', error);
        }
    };

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/productos');
                const data = await response.json();
                setProductos(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        const fetchMedidas = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/medidas');
                const data = await response.json();
                setMedidas(data);
            } catch (error) {
                console.error('Error fetching measures:', error);
            }
        };

        fetchStockData(); // Llamamos a la función para obtener datos de stock
        fetchProductos(); // Llamamos a la función para obtener productos
        fetchMedidas();   // Llamamos a la función para obtener medidas
    }, []);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
  
      // Verificar si el valor es un número entero
      if (value === '' || /^[0-9]*$/.test(value)) {
          setNewStock({
              ...newStock,
              [name]: value,
          });
      }
  };

    const handleAddStock = async (e) => {
        e.preventDefault();
        try {
            const medidaSeleccionada = medidas.find(medida => medida.id === parseInt(newStock.id_medida));
            if (!medidaSeleccionada) {
                console.error('Medida no encontrada');
                return;
            }

            const cantidadUnit = parseInt(newStock.cantidad_unitaria);
            const cantidadBolsas = parseInt(medidaSeleccionada.cantidad_bolsas) || 1;
            const cantidadBolsones = parseInt(medidaSeleccionada.cantidad_bolsones) || 1;

            const totalBolsas = Math.floor(cantidadUnit / cantidadBolsas);
            const unidadesSobrantes = cantidadUnit % cantidadBolsas;
            const totalBolsones = Math.floor(unidadesSobrantes / cantidadBolsones);
            const sobrantesFinales = unidadesSobrantes % cantidadBolsones;

            const response = await axios.post('http://127.0.0.1:8000/api/productos-medidas', {
                ...newStock,
                totalBolsas,
                totalBolsones,
                sobrantesFinales,
            });

            console.log('Respuesta de la API:', response.data);

            if (response.data) {
                const newRecord = response.data;
                const formattedRecord = {
                    id: newRecord.id,
                    producto: {
                        nombre: newRecord.producto ? newRecord.producto.nombre : 'N/A',
                    },
                    cantidad_unitaria: newRecord.cantidad_unitaria,
                    medida: {
                        cantidad_bolsas: totalBolsas,
                        cantidad_bolsones: totalBolsones,
                        sobrantes: sobrantesFinales,
                    },
                    created_at: newRecord.created_at,
                };

                setStockData((prevStockData) => [...prevStockData, formattedRecord]);
                setNewStock({ id_producto: '', id_medida: '', cantidad_unitaria: '' });
                await fetchStockData();
            } else {
                console.error('No se recibió un registro válido de la API');
            }
        } catch (error) {
            console.error('Error adding stock:', error);
        }
    };

    const handleDeleteStock = (id) => {
        fetch(`http://127.0.0.1:8000/api/productos-medidas/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar el stock');
                }
                setStockData(stockData.filter(item => item.id !== id));
                alert('Eliminado Correctamente');
            })
            .catch(error => console.error('Error al eliminar el stock:', error));
    };

    // Filtrar los datos por el producto seleccionado
    const filteredStockData = selectedProductId
        ? stockData.filter(item => item.id_producto === selectedProductId)
        : stockData;

    // Calcular los totales
    const totalCantidadUnitaria = filteredStockData.reduce((total, item) => total + parseInt(item.cantidad_unitaria), 0);
    const totalBolsas = filteredStockData.reduce((total, item) => {
        const cantidadUnit = parseInt(item.cantidad_unitaria);
        const cantidadBolsas = parseInt(item.medida.cantidad_bolsas) || 1;
        return total + Math.floor(cantidadUnit / cantidadBolsas);
    }, 0);
    const totalBolsones = filteredStockData.reduce((total, item) => {
      const cantidadUnit = parseInt(item.cantidad_unitaria);
      const cantidadBolsones = parseInt(item.medida.cantidad_bolsones) || 1;
  
      // Calculamos cuántos bolsones se pueden llenar directamente
      const bolsonesLlenados = Math.floor(cantidadUnit / cantidadBolsones);
  
      return total + bolsonesLlenados; 
  }, 0); 
  //exportar a un excel
  const exportToExcel = (data) => {
    // Crear un libro de trabajo
    const workbook = XLSX.utils.book_new();
    
    // Convertir los datos en una hoja
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Agregar la hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Stock Data');
    
    // Generar el archivo y descargarlo
    XLSX.writeFile(workbook, 'stock_data.xlsx');
  };
  const formattedData = filteredStockData.map(item => ({
    ID: item.id,
    Producto: item.producto ? item.producto.nombre : 'N/A',
    Cantidad: item.cantidad_unitaria,
    CantidadBolsas: item.medida ? item.medida.cantidad_bolsas : 'N/A',
    ResultadoBolsas: Math.floor(parseInt(item.cantidad_unitaria) / (parseInt(item.medida.cantidad_bolsas) || 1)),
    SobranteBolsas: parseInt(item.cantidad_unitaria) % (parseInt(item.medida.cantidad_bolsas) || 1),
    CantidadBolsones: item.medida ? item.medida.cantidad_bolsones : 'N/A',
    ResultadoBolsones: Math.floor(parseInt(item.cantidad_unitaria) / (parseInt(item.medida.cantidad_bolsones) || 1)),
    SobranteBolsones: parseInt(item.cantidad_unitaria) % (parseInt(item.medida.cantidad_bolsones) || 1),
    Fecha: new Date(item.created_at).toLocaleDateString(),
}));
  
    return (
        <div className="container mt-5">
            <h1>Stock de Productos</h1>
            {/* Botón para exportar */}
            <button onClick={() => exportToExcel(formattedData)} className="btn btn-success mb-3">
                Exportar a Excel
            </button>
            <div className="mb-3">
                <label htmlFor="producto" className="form-label">Filtrar por Producto</label>
                <select
                    className="form-select"
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                >
                    <option value="">Todos los productos</option>
                    {productos.map((producto) => (
                        <option key={producto.id} value={producto.id}>
                            {producto.nombre}
                        </option>
                    ))}
                </select>
            </div>
            <div className="card mt-4">
                <div className="card-header">
                    <h3>Lista de Productos</h3>
                </div>
                <div className="card-body">
                    <table className="table table-bordered w-100">
                        <thead>
                            <tr>
                                <th style={{ width: '5%' }}>ID</th>
                                <th style={{ width: '10%' }}>Producto</th>
                                <th style={{ width: '5%' }}>Cantidad</th>
                                {/*<th style={{ width: '15%' }}>Cantidad Bolsas</th>*/}
                                <th style={{ width: '13%' }}>Resultado Bolsas</th>
                                <th style={{ width: '13%' }}>Sobrante Bolsas</th>
                                {/*<th style={{ width: '10%' }}>Cantidad Bolsones</th>*/}
                                <th style={{ width: '10%' }}>Resultado Bolsones</th>
                                <th style={{ width: '15%' }}>Sobrante Bolsones</th>
                                <th style={{ width: '10%' }}>Fecha</th>
                                <th style={{ width: '20%' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStockData.map((item) => {
                                const cantidadUnit = parseInt(item.cantidad_unitaria);
                                const cantidadBolsas = parseInt(item.medida.cantidad_bolsas) || 1;
                                const cantidadBolsones = parseInt(item.medida.cantidad_bolsones) || 1;

                                const resultadoBolsas = Math.floor(cantidadUnit / cantidadBolsas);
                                const sobranteBolsas = cantidadUnit % cantidadBolsas;
                                const resultadoBolsones = Math.floor(cantidadUnit / cantidadBolsones);
                                const sobranteBolsones = cantidadUnit % cantidadBolsones;

                                return (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.producto ? item.producto.nombre : 'N/A'}</td>
                                        <td>{item.cantidad_unitaria}</td>
                                        {/*<td>{item.medida ? item.medida.cantidad_bolsas : 'N/A'}</td>*/}
                                        <td>{resultadoBolsas}</td>
                                        <td>{sobranteBolsas}</td>
                                        {/*<td>{item.medida ? item.medida.cantidad_bolsones : 'N/A'}</td>*/}
                                        <td>{resultadoBolsones}</td>
                                        <td>{sobranteBolsones}</td>
                                        <td>{new Date(item.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <button className="btn btn-success" onClick={() => handleDeleteStock(item.id)}>Editar</button>
                                            <button className="btn btn-danger" onClick={() => handleDeleteStock(item.id)}>Eliminar</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <h5>Total Cantidades Unitarias: {totalCantidadUnitaria}</h5>
<h5>Total Cantidad Bolsas: {totalBolsas}</h5>
<h5>Total Cantidad Bolsones: {totalBolsones}</h5>

                </div>
            </div>

            <div className="card mt-4">
                <div className="card-header">
                    <h3>Añadir Stock</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleAddStock}>
                        <div className="mb-3">
                            <label htmlFor="producto" className="form-label">Seleccionar Producto</label>
                            <select
                                className="form-select"
                                name="id_producto"
                                value={newStock.id_producto}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccione un producto</option>
                                {productos.map((producto) => (
                                    <option key={producto.id} value={producto.id}>
                                        {producto.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="medida" className="form-label">Seleccionar Medida</label>
                            <select
                                className="form-select"
                                name="id_medida"
                                value={newStock.id_medida}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccione una medida</option>
                                {medidas.map((medida) => (
                                    <option key={medida.id} value={medida.id}>
                                        {medida.nombreMedida}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="cantidad_unitaria" className="form-label">Cantidad Unitaria</label>
                            <input
                                type="number"
                                className="form-control"
                                name="cantidad_unitaria"
                                value={newStock.cantidad_unitaria}
                                onChange={handleInputChange}
                                required
                                step="1"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">Añadir Stock</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default StockTerminado;