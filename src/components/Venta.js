import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const VentaList = () => {
    const [ventas, setVentas] = useState([]);
    const [libros, setLibros] = useState([]);
    const [newVenta, setNewVenta] = useState({
        libro_id: '',
        libreria_nombre: '',
        cantidad: '',
        precio: '',
        fecha_venta: '',
    });
    const [ventaId, setVentaId] = useState(null);

    // Obtener todas las ventas
    useEffect(() => {
        const fetchVentas = async () => {
            const response = await fetch(`${API_URL}/ventas`);
            const data = await response.json();
            setVentas(data);
        };
        fetchVentas();
    }, []);

    // Obtener todos los libros
    useEffect(() => {
        const fetchLibros = async () => {
            const response = await fetch(`${API_URL}/libros`);
            const data = await response.json();
            setLibros(data);
        };
        fetchLibros();
    }, []);

    // Crear o actualizar una venta
    const handleSaveVenta = async (e) => {
        e.preventDefault();
        const url = ventaId
            ? `${API_URL}/ventas/${ventaId}`
            : `${API_URL}/ventas`;

        const method = ventaId ? 'PUT' : 'POST';

        await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newVenta),
        });

        setNewVenta({
            libro_id: '',
            libreria_nombre: '',
            cantidad: '',
            precio: '',
            fecha_venta: '',
        });
        setVentaId(null);

        const response = await fetch(`${API_URL}/ventas`);
        const data = await response.json();
        setVentas(data);
    };

    // Eliminar una venta
    const handleDeleteVenta = async (id) => {
        await fetch(`${API_URL}/ventas/${id}`, {
            method: 'DELETE',
        });
        const response = await fetch(`${API_URL}/ventas`);
        const data = await response.json();
        setVentas(data);
    };

    // Manejar el clic en "Actualizar" y cargar los datos al formulario
    const handleEditVenta = (venta) => {
        setVentaId(venta.venta_id);
        setNewVenta({
            libro_id: venta.libro_id,
            libreria_nombre: venta.libreria_nombre,
            cantidad: venta.cantidad,
            precio: venta.precio,
            fecha_venta: formattedDate(venta.fecha_venta),
        });
    };

    const formattedDate = (date) => {
        const utcDate = new Date(date);
        const newDate = utcDate.toLocaleDateString('en-CA');
        return newDate;
    }

    return (
        <div className="max-w-2xl mx-auto p-4">

            {/* Formulario para Crear o Actualizar venta */}
            <form onSubmit={handleSaveVenta} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
                <h3 className="text-xl font-medium text-center">{ventaId ? 'Actualizar Venta' : 'Crear Venta'}</h3>

                <select
                    value={newVenta.libro_id}
                    onChange={(e) => setNewVenta({ ...newVenta, libro_id: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                >
                    <option value="">Selecciona un Libro</option>
                    {libros.map((libro) => (
                        <option key={libro.libro_id} value={libro.libro_id}>
                            {libro.titulo}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Librería"
                    value={newVenta.libreria_nombre}
                    onChange={(e) => setNewVenta({ ...newVenta, libreria_nombre: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                    type="number"
                    placeholder="Cantidad"
                    value={newVenta.cantidad}
                    onChange={(e) => setNewVenta({ ...newVenta, cantidad: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                    type="number"
                    placeholder="Precio"
                    value={newVenta.precio}
                    onChange={(e) => setNewVenta({ ...newVenta, precio: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                    type="date"
                    value={newVenta.fecha_venta}
                    onChange={(e) => setNewVenta({ ...newVenta, fecha_venta: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                />
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        {ventaId ? 'Actualizar Venta' : 'Crear Venta'}
                    </button>
                </div>
            </form>

            {/* Lista de Ventas */}
            <ul className="mt-6 space-y-4">
                <h2 className="text-2xl font-semibold text-center mb-6">Lista de Ventas</h2>
                {ventas.map((venta) => (
                    <li key={venta.venta_id} className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
                        <div>
                            <p className="font-semibold">Librería: {venta.libreria_nombre}</p>
                            <p className="font-semibold">Libro: {venta.libro_titulo}</p>
                            <p className="text-sm text-gray-500">Cantidad: {venta.cantidad}</p>
                            <p className="text-sm text-gray-500">Precio: {venta.precio}</p>
                            <p className="text-sm text-gray-500">Fecha: {formattedDate(venta.fecha_venta)}</p>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleEditVenta(venta)}
                                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDeleteVenta(venta.venta_id)}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                            >
                                Eliminar
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default VentaList;