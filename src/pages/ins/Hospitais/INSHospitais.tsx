import { useEffect, useState } from "react";
import "./INSHospitais.css";

interface Hospital {
  id: number;
  nome: string;
  provincia: string;
  municipio: string;
  nif: string;
  ativo: number;
}

export default function INSHospitais() {
  const [hospitais, setHospitais] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("${import.meta.env.VITE_API_URL}/api/ins/hospitais", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(r => r.json())
      .then(d => setHospitais(d.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="ins-hospitais">
      <div className="ins-page-header">
        <h1>Hospitais do Sistema</h1>
        <p>Gerencie todos os hospitais registados na plataforma Doate</p>
      </div>

      {loading ? <p className="loading">A carregar...</p> : (
        <div className="ins-table">
          <div className="ins-table-header">
            <span>Hospital</span>
            <span>Localização</span>
            <span>NIF</span>
            <span>Estado</span>
          </div>
          {hospitais.map(h => (
            <div key={h.id} className="ins-table-row">
              <span className="ins-hospital-nome">{h.nome}</span>
              <span>{h.municipio}, {h.provincia}</span>
              <span>{h.nif}</span>
              <span className={`ins-badge ${h.ativo ? "activo" : "inactivo"}`}>
                {h.ativo ? "Activo" : "Inactivo"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}