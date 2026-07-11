import {
  FaClipboardList,
  FaHospital,
  FaSignOutAlt,
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <aside className="sidebar">

      {/* LOGO */}
      <div>

        <div className="sidebar-header">
          <h2>DOATE</h2>
          <span>Painel Administrativo</span>
        </div>

        {/* MENU */}
        <nav className="sidebar-nav">

          <NavLink
            to="/adminDoate/solicitacoes"
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            <div className="sidebar-icon">
              <FaClipboardList />
            </div>

            <span>Solicitações</span>
          </NavLink>

          <NavLink
            to="/adminDoate/hospitais"
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            <div className="sidebar-icon">
              <FaHospital />
            </div>

            <span>Hospitais</span>
          </NavLink>

        </nav>

      </div>

      {/* FOOTER */}
      <div className="sidebar-footer">

        <button className="logout-btn" onClick={handleLogout}>

          <FaSignOutAlt />

          <span>Sair da conta</span>

        </button>

      </div>

    </aside>
  );
}