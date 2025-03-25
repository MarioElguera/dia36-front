import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AutorList from './components/Autor';
import LibroList from './components/Libro';
import VentaList from './components/Venta';
import EditorialList from './components/Editorial';
import UserList from './components/auth/UserList';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import './App.css';
import EditUser from './components/auth/EditUser';

const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

const isAdmin = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  const decoded = JSON.parse(atob(token.split('.')[1]));
  return decoded.isAdmin;
};

const ProtectedRoute = ({ element, ...rest }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

const AdminRoute = ({ element, ...rest }) => {
  return isAdmin()
    ? element
    : (isAuthenticated()
      ? <h2 className="text-center text-red-500">No tienes los permisos para acceder a esta página</h2>
      : <Navigate to="/login" />);
};

const App = () => {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthenticated(false);
  };

  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, []);

  return (
    <Router>
      {authenticated && <Navbar onLogout={handleLogout} />}

      <div>
        <Routes>
          {/* Si el usuario está autenticado, redirige a '/home'. Si no, a '/login' */}
          <Route path="/" element={authenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />

          <Route path="/login" element={<Login onLogin={() => setAuthenticated(true)} />} />
          <Route path="/register" element={<Register />} />

          <Route path="/home" element={<ProtectedRoute element={<AutorList />} />} />
          <Route path="/libros" element={<ProtectedRoute element={<LibroList />} />} />
          <Route path="/ventas" element={<ProtectedRoute element={<VentaList />} />} />
          <Route path="/editoriales" element={<ProtectedRoute element={<EditorialList />} />} />

          <Route path="/usuarios" element={<AdminRoute element={<UserList />} />} />
          <Route path="/usuarios/editar/:userId" element={<AdminRoute element={<EditUser />} />} />

          <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
