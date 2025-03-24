import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const LibroList = () => {
    const [libros, setLibros] = useState([]);
    const [libroForm, setLibroForm] = useState({
        libro_id: '',
        titulo: '',
        fecha_publicacion: '',
        editorial_id: '',
        autores: []
    });
    const [autores, setAutores] = useState([]);
    const [editoriales, setEditoriales] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);

    // Obtener todos los libros
    useEffect(() => {
        fetchLibros();
    }, []);

    const fetchLibros = async () => {
        const response = await fetch(`${API_URL}/libros`);
        const data = await response.json();

        // Transformamos los datos para dividir los libros con más de un autor
        const librosConAutoresSeparados = data.flatMap(libro =>
            libro.autores.map(autor => ({
                libro_id: libro.libro_id,
                titulo: libro.titulo,
                fecha_publicacion: libro.fecha_publicacion,
                editorial_id: libro.editorial_id,
                autor_id: autor.autor_id,
                autor_nombre: autor.nombre,
                nacionalidad: autor.nacionalidad,
                fecha_nacimiento: autor.fecha_nacimiento
            }))
        );

        setLibros(librosConAutoresSeparados);
    };

    // Obtener todos los autores
    useEffect(() => {
        const fetchAutores = async () => {
            const response = await fetch(`${API_URL}/autores`);
            const data = await response.json();
            setAutores(data);
        };
        fetchAutores();
    }, []);

    // Obtener todas las editoriales
    useEffect(() => {
        const fetchEditoriales = async () => {
            const response = await fetch(`${API_URL}/editoriales`);
            const data = await response.json();
            setEditoriales(data);
        };
        fetchEditoriales();
    }, []);

    // Crear o actualizar libro
    const handleLibroSubmit = async (e) => {
        e.preventDefault();
        console.log("handleLibroSubmit =>", libroForm);
        if (isUpdating) {
            await fetch(`${API_URL}/libros/${libroForm.libro_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(libroForm),
            });
            setIsUpdating(false);
        } else {
            await fetch(`${API_URL}/libros`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(libroForm),
            });
        }

        setLibroForm({ libro_id: '', titulo: '', fecha_publicacion: '', editorial_id: '', autores: [] });
        const response = await fetch(`${API_URL}/libros`);
        const data = await response.json();
        console.log("Mario | data: ", data);
        fetchLibros();
    };

    // Manejar la edición de un libro
    const handleEditLibro = (libro) => {
        const autoresDelLibro = libros.filter(libroItem => libroItem.libro_id === libro.libro_id);
        const autorIds = autoresDelLibro.map(item => item.autor_id);

        setLibroForm({
            libro_id: libro.libro_id,
            titulo: libro.titulo,
            fecha_publicacion: formattedDate(libro.fecha_publicacion),
            editorial_id: libro.editorial_id,
            autores: autorIds,
        });
        setIsUpdating(true);
    };

    // Eliminar un libro
    const handleDeleteLibro = async (id) => {
        await fetch(`${API_URL}/libros/${id}`, {
            method: 'DELETE',
        });
        const response = await fetch(`${API_URL}/libros`);
        const data = await response.json();
        setLibros(data);
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
                        key={`${libro.libro_id}-${libro.autor_id}`}
                        className="flex justify-between items-center p-4 bg-gray-100 rounded-md shadow-md"
                    >
                        <div className="border p-4 rounded shadow-md">
                            <p className="font-semibold text-lg">{libro.titulo}</p>
                            <p className="text-sm text-gray-500">Publicado: {formattedDate(libro.fecha_publicacion)}</p>
                            <p className="text-sm text-gray-500">Editorial ID: {libro.editorial_id}</p>
                            <hr className="my-2 border-gray-300" />
                            <p className="font-medium">Autor: {libro.autor_nombre}</p>
                            <p className="text-sm text-gray-500">Nacionalidad: {libro.nacionalidad}</p>
                            <p className="text-sm text-gray-500">Fecha de Nacimiento: {formattedDate(libro.fecha_nacimiento)}</p>
                        </div>

                        <div className="space-x-2">
                            <button
                                onClick={() => handleEditLibro(libro)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition duration-300"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDeleteLibro(libro.libro_id)}
                                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300"
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

export default LibroList;
