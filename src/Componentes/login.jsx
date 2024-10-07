// src/pages/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); 

    try {
      
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email,
        password,
      });
          
          localStorage.setItem('authToken', response.data.token);
          navigate('/home'); 
        } catch (err) {
          
          if (err.response) {
            setError('Credenciales inválidas'); 
          } else {
            setError('Ocurrió un error inesperado'); 
          }
        }
      };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
        </form>
        {error && <p className="text-danger text-center mt-3">{error}</p>} {/* Muestra el error si hay */}
        <div className="text-center mt-3">
          <p>¿No tienes una cuenta? <Link to="/register">Registrarse</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
