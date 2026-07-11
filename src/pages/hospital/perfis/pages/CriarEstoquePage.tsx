import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PerfilForm from "../../../../components/perfis/PerfilForm";
import "./CriarPerfilPage.css";

export default function CriarEstoquePage() {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleCreate = async (novo: { nome: string; email: string; tipo: string }) => {
    try {
      setCreating(true);
      setError("");

      const token = localStorage.getItem("token");

      const res = await fetch("${import.meta.env.VITE_API_URL}/api/convites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hospital_id: user?.hospital_id,
          email: novo.email,
          tipo: "ESTOQUE",
        }),
      });

      const responseData = await res.json();

      if (!res.ok) throw new Error(responseData.message);

      navigate("/hospital/perfis/estoque");
    } catch (err: any) {
      setError(err.message || "Erro ao criar responsável de estoque.");
      throw err;
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="criar-perfil-page">
      <div className="criar-perfil-header">
        <button className="btn-voltar" onClick={() => navigate("/hospital/perfis")}>
          ← Voltar
        </button>
      </div>
      <div className="criar-perfil-center">
        {error && <p className="page-error">{error}</p>}
        <PerfilForm
          tipo="ESTOQUE"
          onSubmit={handleCreate}
          loading={creating}
        />
      </div>
    </div>
  );
}