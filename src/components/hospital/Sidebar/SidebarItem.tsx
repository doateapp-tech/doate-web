import { NavLink } from "react-router-dom";

interface Props {
  to: string;
  icon: React.ReactNode;
  label: string;
}

export default function SidebarItem({ to, icon, label }: Props) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `sidebar-item ${isActive ? "active" : ""}`
      }
    >
      <div className="sidebar-icon">{icon}</div>
      <span>{label}</span>
    </NavLink>
  );
}