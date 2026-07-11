import { useEffect, useState } from "react";
import "./Header.css";

export default function Header() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [hospitalNome, setHospitalNome] = useState("");

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/hospitais/meu`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setHospitalNome(data.nome || "");
      } catch {
      }
    };

    if (user?.hospital_id) fetchHospital();
  }, []);

  const roleLabel: Record<string, string> = {
    ADMIN:      "Administrador",
    SECRETARIO: "Secretário",
    ESTOQUE:    "Gestor de Estoque",
    INS_ADMIN:  "Administrador INS",
  };

  const iniciais = user?.nome
    ?.split(" ")
    .slice(0, 2)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <header className="header">

      <div className="header-left">
        <h2 className="header-titulo">Painel Hospitalar</h2>
        {hospitalNome && (
          <div className="header-hospital-badge">
            <div className="header-hospital-dot" />
            <span className="header-hospital-nome">{hospitalNome}</span>
          </div>
        )}
      </div>

      <div className="header-right">
        <div className="header-user-info">
          <span className="header-user-nome">{user?.nome || "Utilizador"}</span>
          <span className="header-user-role">
            {roleLabel[user?.tipo_usuario] || user?.tipo_usuario}
          </span>
        </div>
        <div className="header-avatar" title={user?.nome}>
          {iniciais}
        </div>
      </div>

    </header>
  );
}