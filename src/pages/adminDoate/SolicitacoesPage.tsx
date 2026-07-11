import { useEffect, useState } from "react";
import "./SolicitacoesPage.css";

interface Solicitacao {
  id: number;
  nome: string;
  email: string;
  nif: string;
  provincia: string;
  municipio: string;
  telefone?: string;
  mensagem?: string;
  status: string;
}

export default function SolicitacoesPage() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<number | null>(null);

const fetchSolicitacoes = async () => {
  try {
    setLoading(true);
    setError("");

    const res = await fetch("${import.meta.env.VITE_API_URL}/api/solicitacoes", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) {
      throw new Error("Erro na requisição");
    }

    const json = await res.json();

    if (!json.success || !Array.isArray(json.data)) {
      throw new Error("Formato inválido da API");
    }

    const pendentes = json.data.filter(
      (s: Solicitacao) => s.status === "pendente"
    );

    setSolicitacoes(pendentes);

  } catch (err) {
    console.error(err);
    setError("Erro ao carregar solicitações");
  } finally {
    setLoading(false);
  }
};

  const atualizarStatus = async (id: number, status: "aprovado" | "rejeitado") => {
    try {
      setProcessingId(id);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/solicitacoes/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      setSolicitacoes((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert("Erro ao atualizar status");
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    fetchSolicitacoes();
  }, []);

  return (
    <div className="solicitacoes-container">
      <h2>Solicitações de Acesso</h2>

      {loading && <p>Carregando...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && solicitacoes.length === 0 && (
        <p className="empty">Nenhuma solicitação pendente</p>
      )}

      <div className="cards">
        {solicitacoes.map((s) => (
          <div key={s.id} className="card">
            <h3>{s.nome}</h3>

            <p><strong>Email:</strong> {s.email}</p>
            <p><strong>NIF:</strong> {s.nif}</p>
            <p><strong>Local:</strong> {s.provincia} - {s.municipio}</p>

            {s.telefone && (
              <p><strong>Tel:</strong> {s.telefone}</p>
            )}

            {s.mensagem && (
              <p className="mensagem">"{s.mensagem}"</p>
            )}

            <div className="actions">
              <button
                className="aprovar"
                disabled={processingId === s.id}
                onClick={() => atualizarStatus(s.id, "aprovado")}
              >
                {processingId === s.id ? "..." : "Aprovar"}
              </button>

              <button
                className="rejeitar"
                disabled={processingId === s.id}
                onClick={() => atualizarStatus(s.id, "rejeitado")}
              >
                {processingId === s.id ? "..." : "Rejeitar"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}