import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
const token = localStorage.getItem('token');

const AutoresLibros = () => {
    const [autoresLibros, setAutoresLibros] = useState([]);
    const [autorId, setAutorId] = useState('');
    const [libroId, setLibroId] = useState('');
    const [newAutorId, setNewAutorId] = useState('');
    const [newLibroId, setNewLibroId] = useState('');

    useEffect(() => {
        fetch(`${API_URL}/autores_libros`)
            .then((response) => response.json())
            .then((data) => setAutoresLibros(data))
            .catch((error) => console.error('Error fetching autores-libros:', error));
    }, []);

    const handleCreate = () => {
        fetch(`${API_URL}/autores_libros`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({
                autor_id: autorId,
                libro_id: libroId,
            }),
        })
            .then((response) => response.json())
            .then(() => {
                setAutoresLibros([...autoresLibros, { autor_id: autorId, libro_id: libroId }]);
                setAutorId('');
                setLibroId('');
            })
            .catch((error) => console.error('Error creating autor-libro:', error));
    };

    const handleUpdate = (autor_id, libro_id) => {
        fetch(`${API_URL}/autores_libros/${autor_id}/${libro_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({
                new_autor_id: newAutorId,
                new_libro_id: newLibroId,
            }),
        })
            .then((response) => response.json())
            .then(() => {
                setAutoresLibros(autoresLibros.map((item) =>
                    item.autor_id === autor_id && item.libro_id === libro_id
                        ? { autor_id: newAutorId, libro_id: newLibroId }
                        : item
                ));
                setNewAutorId('');
                setNewLibroId('');
            })
            .catch((error) => console.error('Error updating autor-libro:', error));
    };

    const handleDelete = (autor_id, libro_id) => {
        fetch(`${API_URL}/autores_libros/${autor_id}/${libro_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
        })
            .then(() => {
                setAutoresLibros(autoresLibros.filter((item) => !(item.autor_id === autor_id && item.libro_id === libro_id)));
            })
            .catch((error) => console.error('Error deleting autor-libro:', error));
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Autores y Libros</h1>

            <div className="mb-6">
                <h2 className="text-2xl mb-4">Crear Autor-Libro</h2>
                <input
                    type="number"
                    placeholder="ID Autor"
                    value={autorId}
                    onChange={(e) => setAutorId(e.target.value)}
                    className="border border-gray-400 p-2 rounded-md mr-2 mb-2 w-1/4"
                />
                <input
                    type="number"
                    placeholder="ID Libro"
                    value={libroId}
                    onChange={(e) => setLibroId(e.target.value)}
                    className="border border-gray-400 p-2 rounded-md mr-2 mb-2 w-1/4"
                />
                <button
                    onClick={handleCreate}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    Crear
                </button>
            </div>

            <div className="mt-6">
                <h2 className="text-2xl mb-4">Actualizar Autor-Libro</h2>
                <input
                    type="number"
                    placeholder="Nuevo ID Autor"
                    value={newAutorId}
                    onChange={(e) => setNewAutorId(e.target.value)}
                    className="border border-gray-400 p-2 rounded-md mr-2 mb-2 w-1/4"
                />
                <input
                    type="number"
                    placeholder="Nuevo ID Libro"
                    value={newLibroId}
                    onChange={(e) => setNewLibroId(e.target.value)}
                    className="border border-gray-400 p-2 rounded-md mr-2 mb-2 w-1/4"
                />
                <button
                    onClick={() => handleUpdate(newAutorId, newLibroId)}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                    Actualizar
                </button>
            </div>

            <h2 className="text-2xl mb-4">Lista de Autor-Libro</h2>
            <ul>
                {autoresLibros.map((item) => (
                    <li key={`${item.autor_id}-${item.libro_id}`} className="flex items-center justify-between mb-4 p-4 border border-gray-300 rounded-md">
                        <span>{`Autor ID: ${item.autor_id}, Libro ID: ${item.libro_id}`}</span>
                        <div>
                            <button
                                onClick={() => handleDelete(item.autor_id, item.libro_id)}
                                className="bg-red-500 text-white px-4 py-1 rounded-md mr-2 hover:bg-red-600"
                            >
                                Eliminar
                            </button>
                            <button
                                onClick={() => handleUpdate(item.autor_id, item.libro_id)}
                                className="bg-yellow-500 text-white px-4 py-1 rounded-md hover:bg-yellow-600"
                            >
                                Actualizar
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

        </div>
    );
};

export default AutoresLibros;
