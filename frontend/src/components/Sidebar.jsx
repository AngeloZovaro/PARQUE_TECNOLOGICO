import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import '../styles/Sidebar.css';
// Importando os ícones
import { LuLayoutDashboard, LuArchive, LuLogOut } from "react-icons/lu";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        {/* pode colocar um logo aqui */}
        <span className="sidebar-logo">CA</span> 
        <span>Controle de Ativos</span>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" className="sidebar-link">
          <LuLayoutDashboard size={20} /> 
          <span>Dashboard</span>
        </NavLink>
        {/* Link para 'Novo Ativo' pode ser adicionado futuramente */}
        {/* <NavLink to="/new-asset" className="sidebar-link">
          <LuPlusCircle size={20} />
          <span>Novo Ativo</span>
        </NavLink> */}
        <Link to="/logout" className="sidebar-link logout-link">
          <LuLogOut size={20} />
          <span>Logout</span>
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;