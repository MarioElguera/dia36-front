import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState({});
    const navigate = useNavigate();

    const valUserLogged = (userId) => {
        const token = localStorage.getItem('token');
        if (!token) return false;

        const decoded = JSON.parse(atob(token.split('.')[1]));
        return Number(userId) === Number(decoded.id);
    };

    // Obtener la lista de usuarios
    const listUsers = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await axios.get(`${API_URL}/usuarios`, {
                headers: { 'x-auth-token': token }
            });
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            setErrorMessage('No se pudo obtener la lista de usuarios');
            setLoading(false);
        }
    };

    // Eliminar un usuario
    const handleDeleteUser = async (userId) => {
        const isLoggedUser = valUserLogged(userId);

        if (isLoggedUser) {
            console.log("User cannot delete themselves.");
        } else {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${API_URL}/usuarios/${userId}`, {
                    headers: { 'x-auth-token': token }
                });
                listUsers();
            } catch (error) {
                setErrorMessage('Error al eliminar el usuario');
            }
        }
    };

    const isAdmin = () => {
        const token = localStorage.getItem('token');
        if (!token) return false;

        const decoded = JSON.parse(atob(token.split('.')[1]));
        return decoded.isAdmin;
    };

    const handleEditUser = (userId) => {
        navigate(`/usuarios/editar/${userId}`);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            const loggedInUserId = decoded.id;
            setIsUserLoggedIn(loggedInUserId);
        }
        listUsers();
    }, []);

    if (loading) {
        return <div className="text-center">Cargando usuarios...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Lista de Usuarios</h2>

            {errorMessage && (
                <div className="text-red-500 text-center mb-4">{errorMessage}</div>
            )}

            <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 border-b">ID</th>
                        <th className="p-2 border-b">Nombre de Usuario</th>
                        <th className="p-2 border-b">Admin</th>
                        <th className="p-2 border-b">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td className="p-2 border-b">{user.id}</td>
                            <td className="p-2 border-b">{user.username}</td>
                            <td className="p-2 border-b">{user.isAdmin ? 'Sí' : 'No'}</td>
                            <td className="p-2 border-b flex justify-around">
                                <button
                                    onClick={() => handleEditUser(user.id)}
                                    disabled={!isAdmin()}
                                    className={`${!isAdmin()
                                        ? "bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-red-200 cursor-not-allowed opacity-50"
                                        : "bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-red-600"}`}
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    disabled={isUserLoggedIn === user.id}
                                    className={`${isUserLoggedIn === user.id
                                        ? "bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-200 cursor-not-allowed opacity-50"
                                        : "bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"}`}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4 text-center">
                <button
                    onClick={() => navigate('/register')}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                    Crear Usuario
                </button>
            </div>
        </div>
    );
};

export default UserList;
