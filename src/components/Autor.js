import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const AutorList = () => {
    const [autores, setAutores] = useState([]);
    const [newAutor, setNewAutor] = useState({ nombre: '', nacionalidad: '', fecha_nacimiento: '' });
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [selectedAutor, setSelectedAutor] = useState(null);

    // Obtener todos los autores
    useEffect(() => {
        const fetchAutores = async () => {
            const response = await fetch(`${API_URL}/autores`, {
                method: 'GET',
                headers: {
                    'x-auth-token': token // Agregamos el header con el token
                }
            });
            const data = await response.json();
            setAutores(data);
        };
        fetchAutores();
    }, []);

    // Manejar la creación o actualización de un autor
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (isUpdateMode && selectedAutor) {
            // Actualizar autor
            await fetch(`${API_URL}/autores/${selectedAutor.autor_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(newAutor),
            });
            setIsUpdateMode(false);
            setSelectedAutor(null);
        } else {
            // Crear autor
            await fetch(`${API_URL}/autores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(newAutor),
            });
        }

        // Limpiar formulario y volver a cargar los autores
        setNewAutor({ nombre: '', nacionalidad: '', fecha_nacimiento: '' });
        const response = await fetch(`${API_URL}/autores`, {
            method: 'GET', // Puedes omitir esto ya que 'GET' es el método por defecto, pero lo dejo por claridad
            headers: {
                'x-auth-token': token // Agregamos el header con el token
            }
        });
        const data = await response.json();
        setAutores(data);
    };

    // Eliminar un autor
    const handleDeleteAutor = async (id) => {
        await fetch(`${API_URL}/autores/${id}`, {
            method: 'DELETE',
            headers: {
                'x-auth-token': token
            }
        });

        const response = await fetch(`${API_URL}/autores`, {
            method: 'GET', // Puedes omitir esto ya que 'GET' es el método por defecto, pero lo dejo por claridad
            headers: {
                'x-auth-token': token // Agregamos el header con el token
            }
        });
        const data = await response.json();
        setAutores(data);
    };

    // Manejar la edición de un autor
    const handleEditAutor = (autor) => {
        setIsUpdateMode(true);
        setSelectedAutor(autor);

        // Asegúrate de que la fecha esté en el formato correcto (YYYY-MM-DD)
        const fechaNacimientoFormatted = new Date(autor.fecha_nacimiento).toISOString().split('T')[0];

        setNewAutor({
            nombre: autor.nombre,
            nacionalidad: autor.nacionalidad,
            fecha_nacimiento: fechaNacimientoFormatted, // Asignamos la fecha formateada correctamente
        });
    };

    const formattedDate = (date) => {
        const utcDate = new Date(date);
        const newDate = utcDate.toLocaleDateString('en-CA');
        return newDate;
    };

    return (
        <div className="max-w-2xl mx-auto p-4">

            {/* Formulario único para crear o actualizar autor */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={newAutor.nombre}
                        onChange={(e) => setNewAutor({ ...newAutor, nombre: e.target.value })}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Nacionalidad"
                        value={newAutor.nacionalidad}
                        onChange={(e) => setNewAutor({ ...newAutor, nacionalidad: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <input
                        type="date"
                        value={newAutor.fecha_nacimiento}
                        onChange={(e) => setNewAutor({ ...newAutor, fecha_nacimiento: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className={`w-full py-2 text-white rounded-lg focus:outline-none focus:ring-2 ${isUpdateMode ? 'bg-green-500 hover:bg-green-600 focus:ring-green-500' : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'}`}
                >
                    {isUpdateMode ? 'Actualizar Autor' : 'Crear Autor'}
                </button>
            </form>

            {/* Lista de autores */}
            <ul className="mt-6 space-y-4">
                <h2 className="text-2xl font-bold mb-4 text-center">Lista de Autores</h2>
                {autores.map((autor) => (
                    <li
                        key={autor.autor_id}
                        className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-md"
                    >
                        <div>
                            <p className="font-semibold">{autor.nombre}</p>
                            <p className="text-sm text-gray-500">Fecha de nacimiento: {formattedDate(autor.fecha_nacimiento)}</p>
                            <p className="text-sm text-gray-500">Nacionalidad: {autor.nacionalidad}</p>
                        </div>
                        <div className="space-x-2">
                            <button
                                onClick={() => handleEditAutor(autor)}
                                className="ml-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            >
                                Actualizar
                            </button>
                            <button
                                onClick={() => handleDeleteAutor(autor.autor_id)}
                                className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
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

export default AutorList;
