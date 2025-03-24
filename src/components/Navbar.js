// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
    return (
        <nav className="bg-blue-500 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex space-x-4">
                    <Link to="/home" className="hover:text-gray-200">Home</Link>
                    <Link to="/libros" className="hover:text-gray-200">Libros</Link>
                    <Link to="/ventas" className="hover:text-gray-200">Ventas</Link>
                    <Link to="/editoriales" className="hover:text-gray-200">Editoriales</Link>
                    <Link to="/usuarios" className="hover:text-gray-200">Usuarios</Link>
                </div>
                <div>
                    <button
                        onClick={onLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
