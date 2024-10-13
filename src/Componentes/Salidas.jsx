import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Salidas() {
    const [salidas, setSalidas] = useState([]);
    const [filteredSalidas, setFilteredSalidas] = useState([]);
    const [searchDate, setSearchDate] = useState('');

    useEffect(() => {
        const fetchSalidas = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/salidas');
                setSalidas(response.data);
                setFilteredSalidas(response.data); // Inicialmente mostrar todas las salidas
            } catch (error) {
                console.error('Error fetching salidas:', error);
            }
        };

        fetchSalidas();
    }, []);

    // Función para aplicar el filtro por fecha
    const applyDateFilter = (date) => {
        if (date) {
            const filtered = salidas.filter((salida) => {
                const salidaDate = new Date(salida.created_at);
                // Ajustar la fecha de salida a la zona horaria local
                salidaDate.setHours(0, 0, 0, 0); // Establecer la hora a 00:00:00 para comparación
                const filterDate = new Date(date);
                filterDate.setHours(0, 0, 0, 0); // Establecer la hora a 00:00:00 para comparación
                return salidaDate.getTime() === filterDate.getTime();
            });
            setFilteredSalidas(filtered);
        } else {
            setFilteredSalidas(salidas); // Restaurar todas las salidas si no hay fecha
        }
    };

    // Función para manejar cambios en el filtro de fecha
    const handleDateChange = (event) => {
        const selectedDate = event.target.value;
        setSearchDate(selectedDate);
        applyDateFilter(selectedDate); // Aplicar filtro cada vez que se cambie la fecha
    };

    // Función para eliminar una salida
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/salidas/${id}`);
            // Filtrar las salidas para eliminar la que fue eliminada
            const updatedSalidas = filteredSalidas.filter(salida => salida.id !== id);
            setFilteredSalidas(updatedSalidas);
            setSalidas(updatedSalidas); // Actualizar también el estado original
            alert('Salida eliminada exitosamente');
        } catch (error) {
            console.error('Error eliminando salida:', error);
            alert('Error al eliminar la salida');
        }
    };

    return (
        <div className="container mt-5">
            <h1>Salidas</h1>

            {/* Filtro por Fecha */}
            <div className="mb-3">
                <input
                    type="date"
                    name="searchDate"
                    placeholder="Filtrar por fecha"
                    value={searchDate}
                    onChange={handleDateChange}
                    className="form-control"
                />
            </div>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Número de Guía</th>
                        <th>Fecha</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Medida</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSalidas.map((salida) => (
                        <tr key={salida.id}>
                            <td>{salida.numero_guia}</td>
                            <td>{new Date(salida.created_at).toLocaleDateString()}</td>
                            <td>
                                {salida.productos_con_medida && salida.productos_con_medida.length > 0 ? (
                                    salida.productos_con_medida.map((producto, index) => (
                                        <div key={index}>
                                            {producto.nombre}
                                        </div>
                                    ))
                                ) : (
                                    <div>No hay productos</div>
                                )}
                            </td>
                            <td>
                                {salida.productos_con_medida && salida.productos_con_medida.length > 0 ? (
                                    salida.productos_con_medida.map((producto, index) => (
                                        <div key={index}>
                                            {producto.pivot.cantidad}
                                        </div>
                                    ))
                                ) : (
                                    <div>No hay cantidad</div>
                                )}
                            </td>
                            <td>
                                {salida.productos_con_medida && salida.productos_con_medida.length > 0 ? (
                                    salida.productos_con_medida.map((producto, index) => (
                                        <div key={index}>
                                            {producto.medida_nombre}
                                        </div>
                                    ))
                                ) : (
                                    <div>No hay medida</div>
                                )}
                            </td>
                            <td>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDelete(salida.id)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Salidas;