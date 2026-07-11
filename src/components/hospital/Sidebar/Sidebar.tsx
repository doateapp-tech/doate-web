import {
  FaChartBar, FaFileAlt, FaUsers,
  FaExclamationTriangle, FaClipboardList,
  FaHome, FaCog, FaSignOutAlt, FaBoxes,
  FaTint, FaHospital,  FaFileMedical,
} from "react-icons/fa";

import SidebarItem from "./SidebarItem";
import "./Sidebar.css";
import logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";

type UserRole = "ADMIN" | "SECRETARIO" | "ESTOQUE" | "INS_ADMIN";

interface MenuItem {
  to: string;
  icon: React.ReactNode;
  label: string;
}

export default function Sidebar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null") as {
    tipo_usuario?: UserRole;
  } | null;

  const role: UserRole | undefined = user?.tipo_usuario;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // 👇 ADICIONA AQUI
  const definicoesLink: Record<UserRole, string> = {
    ADMIN: "/hospital/configuracoes",
    SECRETARIO: "/hospital/configuracoes",
    ESTOQUE: "/hospital/configuracoes",
    INS_ADMIN: "/ins/configuracoes",
  };

  // 👇 Depois continua normalmente
  const menuConfig: Record<UserRole, MenuItem[]> = {
    ADMIN: [
      { to: "/hospital/dashboard",  icon: <FaChartBar />, label: "Análises" },
      { to: "/hospital/relatorios", icon: <FaFileAlt />,  label: "Relatórios" },
      { to: "/hospital/perfis",     icon: <FaUsers />,    label: "Gestão de Perfis" },
      { to: "/hospital/doacoes",    icon: <FaTint />,     label: "Doações" },
    ],
  SECRETARIO: [
  { to: "/hospital/secretario/dashboard",    icon: <FaHome />,          label: "Home" },
  { to: "/hospital/secretario/solicitacoes", icon: <FaClipboardList />, label: "Solicitações" },
  { to: "/hospital/secretario/doadores",     icon: <FaUsers />,         label: "Doadores" },
  { to: "/hospital/doacoes",                 icon: <FaTint />,          label: "Doações" },
  { to: "/hospital/secretario/relatorios",   icon: <FaFileMedical />,   label: "Relatórios" },
],

ESTOQUE: [
  { to: "/hospital/estoque/dashboard",   icon: <FaHome />,                label: "Home" },
  { to: "/hospital/estoque/estoque",     icon: <FaBoxes />,               label: "Estoque" },
  { to: "/hospital/estoque/alertas",     icon: <FaExclamationTriangle />, label: "Alertas" },
  { to: "/hospital/doacoes",             icon: <FaTint />,                label: "Doações" },
  { to: "/hospital/estoque/relatorios",  icon: <FaFileMedical />,         label: "Relatórios" },
],

  INS_ADMIN: [
  { to: "/ins/dashboard",     icon: <FaChartBar />,  label: "Estatísticas" },
  { to: "/ins/hospitais",     icon: <FaHospital />,  label: "Hospitais" },
  { to: "/ins/estoque",       icon: <FaTint />,       label: "Estoque" },
  { to: "/ins/relatorios",    icon: <FaFileAlt />,    label: "Relatórios" },
  { to: "/hospital/perfis",   icon: <FaUsers />,      label: "Colaboradores" }, 
],
  };

  const menuItems: MenuItem[] = role ? menuConfig[role] : [];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="Doate Logo" />
        <span>DOATE</span>
      </div>
      <div className="sidebar-menu">
        {menuItems.map((item: MenuItem, index: number) => (
          <SidebarItem key={index} to={item.to} icon={item.icon} label={item.label} />
        ))}
      </div>
      <div className="sidebar-bottom">
        <SidebarItem
  to={role ? definicoesLink[role] : "/hospital/configuracoes"}
  icon={<FaCog />}
  label="Definições"
/>
        <div className="sidebar-item logout" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Sair da conta</span>
        </div>
      </div>
    </div>
  );
}