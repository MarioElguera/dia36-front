import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
const token = localStorage.getItem('token');

const EditorialList = () => {
    const [editoriales, setEditoriales] = useState([]);
    const [editorialForm, setEditorialForm] = useState({ editorial_id: '', nombre: '', pais: '' });
    const [isUpdating, setIsUpdating] = useState(false);

    // Obtener todas las editoriales
    useEffect(() => {
        const fetchEditoriales = async () => {
            const response = await fetch(`${API_URL}/editoriales`, {
                method: 'GET',
                headers: {
                    'x-auth-token': token
                }
            });
            const data = await response.json();
            setEditoriales(data);
        };

        fetchEditoriales();
    }, []);

    // Crear o actualizar editorial
    const handleEditorialSubmit = async (e) => {
        e.preventDefault();

        if (isUpdating) {
            await fetch(`${API_URL}/editoriales/${editorialForm.editorial_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(editorialForm),
            });
            setIsUpdating(false);

        } else {
            await fetch(`${API_URL}/editoriales`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(editorialForm),
            });
        }

        setEditorialForm({ editorial_id: '', nombre: '', pais: '' });
        const response = await fetch(`${API_URL}/editoriales`, {
            method: 'GET',
            headers: {
                'x-auth-token': token,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        setEditoriales(data);
    };

    // Manejar la edición de una editorial
    const handleEditEditorial = (editorial) => {
        setEditorialForm({
            editorial_id: editorial.editorial_id,
            nombre: editorial.nombre,
            pais: editorial.pais,
        });
        setIsUpdating(true);
    };

    // Eliminar una editorial
    const handleDeleteEditorial = async (id) => {
        await fetch(`${API_URL}/editoriales/${id}`, {
            method: 'DELETE',
            headers: { 'x-auth-token': token },
        });
        const response = await fetch(`${API_URL}/editoriales`, {
            method: 'GET',
            headers: {
                'x-auth-token': token,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        setEditoriales(data);
    };

    return (
        <div className="max-w-2xl mx-auto p-4">

            {/* Formulario Crear/Actualizar Editorial */}
            <form onSubmit={handleEditorialSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
                <h3 className="text-xl font-medium text-center">{isUpdating ? 'Actualizar Editorial' : 'Crear Editorial'}</h3>

                <div className="flex flex-col space-y-2">
                    <input
                        type="text"
                        id="nombre"
                        placeholder="Nombre de la editorial"
                        value={editorialForm.nombre}
                        onChange={(e) => setEditorialForm({ ...editorialForm, nombre: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                    />
                </div>

                <div className="flex flex-col space-y-2">
                    <input
                        type="text"
                        id="pais"
                        placeholder="País de la editorial"
                        value={editorialForm.pais}
                        onChange={(e) => setEditorialForm({ ...editorialForm, pais: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                    />
                </div>

                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        {isUpdating ? 'Actualizar Editorial' : 'Crear Editorial'}
                    </button>
                </div>
            </form>

            {/* Lista de Editoriales */}
            <ul className="mt-6 space-y-4">
                <h2 className="text-2xl font-semibold text-center mb-6">Lista de Editoriales</h2>

                {editoriales.map((editorial) => (
                    <li
                        key={editorial.editorial_id}
                        className="flex justify-between items-center p-4 bg-gray-100 rounded-md shadow-md"
                    >
                        <div>
                            <p className="font-semibold">{editorial.nombre}</p>
                            <p className="text-sm text-gray-500">País: {editorial.pais}</p>
                        </div>
                        <div className="space-x-2">
                            <button
                                onClick={() => handleEditEditorial(editorial)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition duration-300"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDeleteEditorial(editorial.editorial_id)}
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

export default EditorialList;
