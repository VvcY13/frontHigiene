
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Componentes/login';
import Register from './Componentes/Register';
import Home from './Componentes/Home';
import StockTerminado from './Componentes/StockTerminado';
import Layout from './Componentes/Layout';
import Almacenes from './Componentes/Almacenes';
import Produccion from './Componentes/Produccion';
import Insumos from './Componentes/Insumos';
import StockGeneral from './Componentes/StockGeneral';
import Salidas from './Componentes/Salidas';

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/stock" element={<StockTerminado />} />
          <Route path="/stockGeneral" element={<StockGeneral />} />
          <Route path="/salidas" element={<Salidas />} />
          <Route path="/almacenes" element={<Almacenes />} />
          <Route path="/produccion" element={<Produccion />} />
          <Route path="/insumos" element={<Insumos />} />
        </Route>
    </Routes>
  </Router>
  );
}

export default App;
