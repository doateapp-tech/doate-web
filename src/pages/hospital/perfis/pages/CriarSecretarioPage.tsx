import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PerfilForm from "../../../../components/perfis/PerfilForm";
import "./CriarPerfilPage.css";

export default function CriarSecretarioPage() {
  const [creating, setCreating]   = useState(false);
  const [error, setError]         = useState("");
  const [linkAtivacao, setLink]   = useState<string | null>(null);
  const navigate                  = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleCreate = async (novo: { nome: string; email: string; tipo: string }) => {
    try {
      setCreating(true);
      setError("");
      setLink(null);

      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/convites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hospital_id: user?.hospital_id,
          email: novo.email,
          tipo: "SECRETARIO",
        }),
      });

      const responseData = await res.json();

      if (!res.ok) throw new Error(responseData.message);

      setLink(responseData.link || null);

    } catch (err: any) {
      setError(err.message || "Erro ao criar secretário.");
    } finally {
      setCreating(false);
    }
  };

  const copiarLink = () => {
    if (linkAtivacao) {
      navigator.clipboard.writeText(linkAtivacao);
      alert("Link copiado!");
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

        {linkAtivacao && (
          <div className="aprovacao-banner">
            <div className="aprovacao-banner-topo">
              <span className="aprovacao-check">✓</span>
              <div className="aprovacao-info">
                <strong>Secretário criado com sucesso!</strong>
                <p className="aprovacao-sub">O link de activação foi enviado por email.</p>
              </div>
              <button className="aprovacao-fechar" onClick={() => setLink(null)}>✕</button>
            </div>

            <div className="aprovacao-link-box">
              <span className="aprovacao-link-label">Link de activação:</span>
              <a href={linkAtivacao} target="_blank" rel="noreferrer" className="aprovacao-link">
                {linkAtivacao}
              </a>
              <button className="aprovacao-copiar" onClick={copiarLink}>Copiar</button>
            </div>

            <div className="aprovacao-acoes">
              <button
                className="btn-ir-lista"
                onClick={() => navigate("/hospital/perfis/secretarios")}
              >
                Ver lista de secretários →
              </button>
            </div>
          </div>
        )}

        {!linkAtivacao && (
          <PerfilForm
            tipo="SECRETARIO"
            onSubmit={handleCreate}
            loading={creating}
          />
        )}
      </div>
    </div>
  );
}
