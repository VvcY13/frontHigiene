import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Asegúrate de que useNavigate esté importado correctamente

function Register() {
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('DNI');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  
  const navigate = useNavigate(); // Usa el hook useNavigate

  const handleRegister = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const userData = {
      nombres: nombres.toUpperCase(),
      apellidos: apellidos.toUpperCase(),
      tipo_documento: tipoDocumento,
      numero_documento: numeroDocumento.toUpperCase(),
      email: email.toLowerCase(),
      password,
    };

    fetch('http://127.0.0.1:8000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al registrar el usuario');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Usuario registrado:', data);
        alert('Usuario registrado con éxito');
        navigate('/'); // Usa navigate para redirigir
      })
      .catch((error) => {
        console.error('Error al registrar el usuario:', error);
        alert('Error al registrar el usuario');
      });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">Registrarse</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label htmlFor="nombres" className="form-label">Nombre Completo</label>
            <input
              type="text"
              className="form-control"
              id="nombres"
              placeholder="Ingresa tu nombre"
              value={nombres}
              onChange={(e) => setNombres(e.target.value.toUpperCase())}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="apellidos" className="form-label">Apellidos</label>
            <input
              type="text"
              className="form-control"
              id="apellidos"
              placeholder="Ingresa tus apellidos"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value.toUpperCase())}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="tipoDocumento" className="form-label">Tipo de Documento</label>
            <select
              className="form-control"
              id="tipoDocumento"
              value={tipoDocumento}
              onChange={(e) => setTipoDocumento(e.target.value)}
              required
            >
              <option value="DNI">DNI</option>
              <option value="CARNET DE EXTRANJERIA">CARNET DE EXTRANJERIA</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="numeroDocumento" className="form-label">Número de Documento</label>
            <input
              type="text"
              className="form-control"
              id="numeroDocumento"
              placeholder="Ingresa tu número de documento"
              value={numeroDocumento}
              onChange={(e) => setNumeroDocumento(e.target.value.toUpperCase())}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
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
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Registrarse</button>
          <div className="text-center mt-3">
            <p>¿Tienes una cuenta? <Link to="/">Inicia Sesión</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
