import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
const token = localStorage.getItem('token');

const LibroList = () => {
    const [libros, setLibros] = useState([]);
    const [libroForm, setLibroForm] = useState({
        libro_id: '',
        titulo: '',
        fecha_publicacion: '',
        editorial_id: 0,
        autores: []
    });
    const [autores, setAutores] = useState([]);
    const [editoriales, setEditoriales] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchEditoriales();
                await fetchAutores();
                await fetchLibros();
            } catch (error) {
                console.error("Error al obtener los datos:", error.message);
            }
        };
        fetchData();
    }, []);

    const fetchLibros = async () => {
        try {
            const response = await fetch(`${API_URL}/libros`, {
                method: 'GET',
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setLibros(data);

        } catch (error) {
            console.error("Error al obtener los libros:", error.message);
        }

    };

    const fetchAutores = async () => {
        try {
            const response = await fetch(`${API_URL}/autores`, {
                method: 'GET',
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setAutores(data);

        } catch (error) {
            console.error("Error al obtener los autores:", error.message);
        }
    };

    const fetchEditoriales = async () => {
        try {
            const response = await fetch(`${API_URL}/editoriales`, {
                method: 'GET',
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setEditoriales(data);

        } catch (error) {
            console.error("Error al obtener las editoriales:", error.message);
        }
    };


    const handleLibroSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isUpdating) {
                const response = await fetch(`${API_URL}/libros/${libroForm.libro_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(libroForm),
                });

                if (!response.ok) {
                    throw new Error('Error al actualizar el libro');
                }

                setIsUpdating(false);

            } else {
                const response = await fetch(`${API_URL}/libros`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(libroForm),
                });

                if (!response.ok) {
                    throw new Error('Error al crear el libro');
                }
            }

            setLibroForm({ libro_id: '', titulo: '', fecha_publicacion: '', editorial_id: 0, autores: [] });
            fetchLibros();

        } catch (error) {
            console.error("Error en el proceso de creación o actualización:", error);
        }
    };


    // Manejar la edición de un libro
    const handleEditLibro = (libro) => {
        const autoresDelLibro = libro.autores.map(autor => autor.autor_id);

        setLibroForm({
            libro_id: libro.libro_id,
            titulo: libro.titulo,
            fecha_publicacion: formattedDate(libro.fecha_publicacion),
            editorial_id: libro.editorial_id,
            autores: autoresDelLibro,
        });
        setIsUpdating(true);
    };

    // Eliminar un libro
    const handleDeleteLibro = async (id) => {
        await fetch(`${API_URL}/libros/${id}`, {
            method: 'DELETE',
        });
        fetchLibros();
    };

    const formattedDate = (date) => {
        const utcDate = new Date(date);
        const newDate = utcDate.toLocaleDateString('en-CA');
        return newDate;
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            {/* Formulario Crear/Actualizar Libro */}
            <form onSubmit={handleLibroSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
                <h3 className="text-xl font-medium text-center">{isUpdating ? 'Actualizar Libro' : 'Crear Libro'}</h3>

                <div className="flex flex-col space-y-2">
                    <input
                        type="text"
                        id="titulo"
                        placeholder="Título del libro"
                        value={libroForm.titulo}
                        onChange={(e) => setLibroForm({ ...libroForm, titulo: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                    />
                </div>

                <div className="flex flex-col space-y-2">
                    <input
                        type="date"
                        id="fecha_publicacion"
                        value={libroForm.fecha_publicacion}
                        onChange={(e) => setLibroForm({ ...libroForm, fecha_publicacion: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                </div>

                {/* Select para seleccionar múltiples autores */}
                <div className="flex flex-col space-y-2">
                    <label htmlFor="autores">Seleccionar Autores</label>
                    <select
                        id="autores"
                        multiple
                        value={libroForm.autores}
                        onChange={(e) => {
                            const selectedAutores = Array.from(e.target.selectedOptions, option => option.value);
                            setLibroForm({ ...libroForm, autores: selectedAutores });
                        }}
                        className="w-full px-4 py-2 border rounded-lg"
                    >
                        {autores.map((autor) => (
                            <option key={autor.autor_id} value={autor.autor_id}>
                                {autor.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Select para seleccionar la editorial */}
                <div className="flex flex-col space-y-2">
                    <label htmlFor="editorial_id">Seleccionar Editorial</label>
                    <select
                        id="editorial_id"
                        value={libroForm.editorial_id}
                        onChange={(e) => setLibroForm({ ...libroForm, editorial_id: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                    >
                        <option key={0} value="0">
                            {"Seleccionar editorial"}
                        </option>
                        {editoriales.map((editorial) => (
                            <option key={editorial.editorial_id} value={editorial.editorial_id}>
                                {editorial.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        {isUpdating ? 'Actualizar Libro' : 'Crear Libro'}
                    </button>
                </div>
            </form>

            {/* Lista de Libros */}
            <ul className="mt-6 space-y-4">
                <h2 className="text-2xl font-semibold text-center mb-6">Lista de Libros</h2>

                {libros.map((libro) => (
                    <li
                        key={libro.libro_id}
                        className="flex flex-col bg-white rounded-lg shadow-md p-6 mb-6"
                    >
                        {/* Título y detalles principales del libro */}
                        <div className="mb-4">
                            <h3 className="font-semibold text-2xl text-gray-800">{libro.titulo}</h3>
                            <p className="text-sm text-gray-500">Publicado: {formattedDate(libro.fecha_publicacion)}</p>
                            <p className="text-sm text-gray-500">Editorial: {libro.editorial_id}</p>
                        </div>

                        {/* Lista de autores */}
                        <div className="mb-4">
                            <p className="font-medium text-lg text-gray-800">Autores:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                {libro.autores.map((autor) => (
                                    <li key={autor.autor_id} className="text-sm text-gray-600">
                                        <p className="font-semibold">{autor.nombre}</p>
                                        <p className="text-gray-500">Nacionalidad: {autor.nacionalidad}</p>
                                        <p className="text-gray-500">Fecha de nacimiento: {formattedDate(autor.fecha_nacimiento)}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex space-x-4">
                            {/* Botones de editar y eliminar */}
                            <button
                                onClick={() => handleEditLibro(libro)}
                                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-300"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDeleteLibro(libro.libro_id)}
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
                            >
                                Eliminar
                            </button>
                        </div>
                    </li>
                ))}

            </ul>
        </div >
    );
};

export default LibroList;
