import React from 'react';
import { Outlet } from 'react-router-dom';
import '../styles/AuthLayout.css';

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <Outlet /> {/* As páginas Login e Register serão renderizadas aqui */}
    </div>
  );
};

export default AuthLayout;