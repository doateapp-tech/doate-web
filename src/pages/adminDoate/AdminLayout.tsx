import { Outlet } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import "./AdminLayout.css";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="admin-content">
        <header className="admin-header">
          <h2>Painel Administrativo</h2>
        </header>

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}