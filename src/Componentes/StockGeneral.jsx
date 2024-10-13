import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StockGeneral() {
    const [stockData, setStockData] = useState([]);
    const [totalStock, setTotalStock] = useState(0);
    const [productos, setProductos] = useState([]);
    const [medidas, setMedidas] = useState([]);
    const [selectedProducto, setSelectedProducto] = useState('');
    const [selectedMedida, setSelectedMedida] = useState('');
    const [numeroGuia, setNumeroGuia] = useState('');
    const [selectedProductos, setSelectedProductos] = useState([]);
    const [cantidad, setCantidad] = useState(1);

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/stock-general');
                setStockData(response.data);
                calculateTotalStock(response.data);

                const productosSet = new Set(response.data.map(item => item.producto.nombre));
                setProductos(Array.from(productosSet));

                const medidasSet = new Set(response.data.map(item => item.medida.nombreMedida));
                setMedidas(Array.from(medidasSet));
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        };

        fetchStockData();
    }, []);

    const calculateTotalStock = (data) => {
        const total = data.reduce((acc, item) => acc + parseInt(item.stock_total), 0);
        setTotalStock(total);
    };

    const handleDeleteStock = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/stock-general/${id}`);
            setStockData(stockData.filter(item => item.id !== id));
            calculateTotalStock(stockData.filter(item => item.id !== id));
            alert('Eliminado Correctamente');
        } catch (error) {
            console.error('Error deleting stock:', error);
        }
    };

    const handleAddProducto = (producto, medida, cantidad) => {
        const newProduct = { id_producto: producto.id, id_medida: medida.id, cantidad: Number(cantidad) }; // Asegúrate de convertir a número
        setSelectedProductos(prev => {
            const exists = prev.find(item => item.id_producto === newProduct.id_producto && item.id_medida === newProduct.id_medida);
            if (exists) {
                return prev.map(item =>
                    item.id_producto === newProduct.id_producto && item.id_medida === newProduct.id_medida
                        ? { ...item, cantidad: item.cantidad + newProduct.cantidad } // Aquí ya está como número
                        : item
                );
            }
            return [...prev, newProduct];
        });
    };

    // Nueva función para eliminar un producto seleccionado
    const handleDeleteSelectedProducto = (id_producto, id_medida) => {
        setSelectedProductos(prev => prev.filter(item => !(item.id_producto === id_producto && item.id_medida === id_medida)));
    };

    const handleRegisterSalida = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/salidas', {
                numero_guia: numeroGuia,
                productos: selectedProductos,
            });
            alert(response.data.message);
            const updatedStockResponse = await axios.get('http://127.0.0.1:8000/api/stock-general');
            setStockData(updatedStockResponse.data);
            calculateTotalStock(updatedStockResponse.data);
            setNumeroGuia('');
            setSelectedProductos([]);
            setCantidad(1);
        } catch (error) {
            console.error('Error registering salida:', error.response.data.message);
            alert('Error: ' + error.response.data.message);
        }
    };

    const filteredStockData = stockData.filter(item => {
        const productMatch = selectedProducto ? item.producto.nombre === selectedProducto : true;
        const medidaMatch = selectedMedida ? item.medida.nombreMedida === selectedMedida : true;
        return productMatch && medidaMatch;
    });

    return (
        <div className="container mt-5">
            <h1>Stock General</h1>

            {/* Formulario para registrar salida */}
            <div className="mb-3">
                <label htmlFor="numeroGuia" className="form-label">Número de Guía</label>
                <input
                    type="text"
                    id="numeroGuia"
                    className="form-control"
                    value={numeroGuia}
                    onChange={(e) => setNumeroGuia(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="productoSeleccionado" className="form-label">Seleccionar Producto</label>
                <select
                    id="productoSeleccionado"
                    className="form-select"
                    value={selectedProducto}
                    onChange={(e) => setSelectedProducto(e.target.value)}
                >
                    <option value="">Seleccione un producto</option>
                    {productos.map((producto, index) => (
                        <option key={index} value={producto}>{producto}</option>
                    ))}
                </select>
            </div>

            <div className="mb-3">
                <label htmlFor="medidaSeleccionada" className="form-label">Seleccionar Medida</label>
                <select
                    id="medidaSeleccionada"
                    className="form-select"
                    value={selectedMedida}
                    onChange={(e) => setSelectedMedida(e.target.value)}
                >
                    <option value="">Seleccione una medida</option>
                    {medidas.map((medida, index) => (
                        <option key={index} value={medida}>{medida}</option>
                    ))}
                </select>
            </div>

            {/* Input para cantidad */}
            <div className="mb-3">
                <label htmlFor="cantidad" className="form-label">Cantidad</label>
                <input
                    type="number"
                    id="cantidad"
                    className="form-control"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    min="1"
                />
            </div>

            <button className="btn btn-primary" onClick={() => {
                const productoSeleccionado = stockData.find(item => item.producto.nombre === selectedProducto);
                const medidaSeleccionada = stockData.find(item => item.medida.nombreMedida === selectedMedida);

                if (productoSeleccionado && medidaSeleccionada) {
                    if (cantidad > productoSeleccionado.stock_total) {
                        alert('No se cuenta con stock suficiente.');
                    } else {
                        handleAddProducto(productoSeleccionado.producto, medidaSeleccionada.medida, cantidad);
                    }
                } else {
                    alert('Seleccione un producto y una medida válidos.');
                }
            }}>Agregar Producto</button>

            <button className="btn btn-primary" onClick={handleRegisterSalida}>Registrar Salida</button>

            {/* Resumen de productos seleccionados */}
            <div>
                <h3>Productos Seleccionados</h3>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">Producto</th>
                            <th scope="col">Medida</th>
                            <th scope="col">Cantidad</th>
                            <th scope="col">Acciones</th> {/* Nueva columna para acciones */}
                        </tr>
                    </thead>
                    <tbody>
                        {selectedProductos.map((item, index) => (
                            <tr key={index}>
                                <td>{stockData.find(s => s.producto.id === item.id_producto)?.producto.nombre}</td>
                                <td>{stockData.find(s => s.medida.id === item.id_medida)?.medida.nombreMedida}</td>
                                <td>{item.cantidad}</td>
                                <td>
                                    <button className="btn btn-danger" onClick={() => handleDeleteSelectedProducto(item.id_producto, item.id_medida)}>
                                        Eliminar
                                    </button>
                                </td> {/* Botón para eliminar el producto seleccionado */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th scope="col">Producto</th>
                        <th scope="col">Medida</th>
                        <th scope="col">Stock Total</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStockData.map((item) => (
                        <tr key={item.id}>
                            <td>{item.producto.nombre}</td>
                            <td>{item.medida.nombreMedida}</td>
                            <td>{item.stock_total}</td>
                            <td>
                                <button className="btn btn-danger" onClick={() => handleDeleteStock(item.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div>
                <h3>Total Stock: {totalStock}</h3>
            </div>
        </div>
    );
}

export default StockGeneral;