import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

const EditUser = () => {
    const [user, setUser] = useState({
        username: '',
        password: '',
        isAdmin: false,
    });
    const [errorMessage, setErrorMessage] = useState('');
    const { userId } = useParams();
    const navigate = useNavigate();

    // Obtener los detalles del usuario
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`${API_URL}/usuarios/user/${userId}`, {
                    headers: { 'x-auth-token': token },
                });

                setUser({
                    username: response.data.username,
                    password: response.data.password,
                    isAdmin: response.data.isAdmin,
                });

            } catch (error) {
                setErrorMessage('No se pudo obtener la información del usuario.');
            }
        };

        fetchUser();
    }, [userId]);

    // Actualizar el usuario
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            await axios.put(`${API_URL}/usuarios/users/${userId}`, user, {
                headers: { 'x-auth-token': token },
            });
            navigate('/usuarios');
        } catch (error) {
            setErrorMessage('Error al actualizar el usuario.');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUser({
            ...user,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Editar Usuario</h2>

            {errorMessage && <div className="text-red-500 text-center mb-4">{errorMessage}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
                    <input
                        type="text"
                        name="username"
                        value={user.username}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Nueva contraseña</label>
                    <input
                        type="password"
                        name="password"
                        // value={user.password}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        // required
                    />
                </div>

                <div className="mb-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="isAdmin"
                            checked={user.isAdmin}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        Administrador
                    </label>
                </div>

                <div className="text-center">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Actualizar Usuario
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditUser;
