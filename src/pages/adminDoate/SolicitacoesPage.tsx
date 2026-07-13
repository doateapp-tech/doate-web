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
  hospital_id?: number;
}

interface Aprovacao {
  nome: string;
  link: string | null;
}

export default function SolicitacoesPage() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [aprovacao, setAprovacao]       = useState<Aprovacao | null>(null);
  const [linkLoading, setLinkLoading]   = useState(false);

  const fetchSolicitacoes = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/solicitacoes`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!res.ok) throw new Error("Erro na requisição");

      const json = await res.json();

      if (!json.success || !Array.isArray(json.data))
        throw new Error("Formato inválido da API");

      setSolicitacoes(json.data.filter((s: Solicitacao) => s.status === "pendente"));
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar solicitações");
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatus = async (s: Solicitacao, status: "aprovado" | "rejeitado") => {
    try {
        setProcessingId(s.id);

        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/solicitacoes/${s.id}/status`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ status }),
            }
        );

        if (!res.ok) throw new Error();

        const data = await res.json();

        setSolicitacoes((prev) => prev.filter((x) => x.id !== s.id));

        if (status === "aprovado") {
            let link: string | null = null;

            try {
                setLinkLoading(true);
                const linkRes = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/convites/link/${data.hospital_id}`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
                if (linkRes.ok) {
                    const linkData = await linkRes.json();
                    link = linkData.link_ativacao || null;
                }
            } catch {
                link = null;
            } finally {
                setLinkLoading(false);
            }

            setAprovacao({ nome: s.nome, link });
        }
    } catch {
        alert("Erro ao atualizar status");
    } finally {
        setProcessingId(null);
    }
};

  const copiarLink = (link: string) => {
    navigator.clipboard.writeText(link);
    alert("Link copiado!");
  };

  useEffect(() => {
    fetchSolicitacoes();
  }, []);

  return (
    <div className="solicitacoes-container">
      <h2>Solicitações de Acesso</h2>

      {aprovacao && (
        <div className="aprovacao-banner">
          <div className="aprovacao-banner-topo">
            <span className="aprovacao-check">✓</span>
            <div className="aprovacao-info">
              <strong>{aprovacao.nome}</strong> foi aprovado com sucesso!
              <p className="aprovacao-sub">O link de activação foi enviado por email.</p>
            </div>
            <button className="aprovacao-fechar" onClick={() => setAprovacao(null)}>✕</button>
          </div>

          {aprovacao.link ? (
            <div className="aprovacao-link-box">
              <span className="aprovacao-link-label">Link de activação:</span>
              <a
                href={aprovacao.link}
                target="_blank"
                rel="noreferrer"
                className="aprovacao-link"
              >
                {aprovacao.link}
              </a>
              <button
                className="aprovacao-copiar"
                onClick={() => copiarLink(aprovacao.link!)}
              >
                Copiar
              </button>
            </div>
          ) : (
            <p className="aprovacao-sem-link">
              Não foi possível recuperar o link. Consulte a tabela de convites na BD.
            </p>
          )}
        </div>
      )}

      {loading && <p>Carregando...</p>}
      {error && <p className="error">{error}</p>}
      {linkLoading && <p className="loading-link">A buscar link de activação...</p>}

      {!loading && solicitacoes.length === 0 && !aprovacao && (
        <p className="empty">Nenhuma solicitação pendente</p>
      )}

      <div className="cards">
        {solicitacoes.map((s) => (
          <div key={s.id} className="card">
            <h3>{s.nome}</h3>
            <p><strong>Email:</strong> {s.email}</p>
            <p><strong>NIF:</strong> {s.nif}</p>
            <p><strong>Local:</strong> {s.provincia} - {s.municipio}</p>
            {s.telefone && <p><strong>Tel:</strong> {s.telefone}</p>}
            {s.mensagem && <p className="mensagem">"{s.mensagem}"</p>}

            <div className="actions">
              <button
                className="aprovar"
                disabled={processingId === s.id}
                onClick={() => atualizarStatus(s, "aprovado")}
              >
                {processingId === s.id ? "..." : "Aprovar"}
              </button>
              <button
                className="rejeitar"
                disabled={processingId === s.id}
                onClick={() => atualizarStatus(s, "rejeitado")}
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
