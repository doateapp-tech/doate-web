import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaQrcode } from "react-icons/fa";
import SolicitacaoTable from "../../../../components/Solicitacoes/SolicitacaoTable";
import "./SolicitacoesSecretario.css";

interface Solicitacao {
  id: number;
  nome: string;
  email: string;
  codigo_solicitacao: string;
  status: string;
  criado_em: string;
  _tipo?: "EXAME" | "DOACAO";
}

type Tab = "EXAME" | "DOACAO";

export default function SolicitacoesSecretario() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [tab, setTab] = useState<Tab>("EXAME");
  const [filtroStatus, setFiltroStatus] = useState("");
  const navigate = useNavigate();

const fetchSolicitacoes = async () => {
  try {
    setLoading(true);
    setErro("");
    const token = localStorage.getItem("token");

    const [resExames, resDoacoes] = await Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/api/exames`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${import.meta.env.VITE_API_URL}/api/doacoes`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const dataExames = await resExames.json();
    const dataDoacoes = await resDoacoes.json();

    const exames = (dataExames.data || []).map((s: any) => ({ ...s, _tipo: "EXAME" }));
    const doacoes = (dataDoacoes.data || []).map((s: any) => ({ ...s, _tipo: "DOACAO" }));

    setSolicitacoes([...exames, ...doacoes]);
  } catch (err: any) {
    setErro(err.message);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchSolicitacoes();
  }, []);

// Linha do filtro das solicitações
const solicitacoesFiltradas = solicitacoes
  .filter((s) => (s._tipo || "EXAME") === tab)
  .filter((s) => (filtroStatus ? s.status === filtroStatus : true));

// Linhas dos totais
const totalExames = solicitacoes.filter((s) => (s._tipo || "EXAME") === "EXAME").length;
const totalDoacoes = solicitacoes.filter((s) => s._tipo === "DOACAO").length;

  const totalPendentes = solicitacoesFiltradas.filter((s) => s.status === "PENDENTE").length;

  return (
    <div className="sol-page">

      {/* HEADER */}
  <div className="sol-header">
  <div className="sol-header-left">
    <h1>Solicitações</h1>
  </div>

  <div className="sol-header-right">
    <span className="sol-data">
      {new Date().toLocaleDateString("pt-PT", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })}
    </span>
    <div className="sol-stats">
      <div className="sol-stat">
        <span className="sol-stat-value">{totalExames}</span>
        <span className="sol-stat-label">Exames</span>
      </div>
      <div className="sol-stat-divider" />
      <div className="sol-stat">
        <span className="sol-stat-value">{totalDoacoes}</span>
        <span className="sol-stat-label">Doações</span>
      </div>
      <div className="sol-stat-divider" />
      <div className="sol-stat">
        <span className="sol-stat-value sol-stat-pendente">{totalPendentes}</span>
        <span className="sol-stat-label">Pendentes</span>
      </div>
    </div>
  </div>
</div>

      {/* TABS */}
<div className="sol-tabs">
  <button
    className={`sol-tab ${tab === "EXAME" ? "sol-tab-active" : ""}`}
    onClick={() => { setTab("EXAME"); setFiltroStatus(""); }}
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/>
    </svg>
    Exames
    {totalExames > 0 && <span className="sol-tab-badge">{totalExames}</span>}
  </button>
  <button
    className={`sol-tab ${tab === "DOACAO" ? "sol-tab-active" : ""}`}
    onClick={() => { setTab("DOACAO"); setFiltroStatus(""); }}
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
    </svg>
    Doações
    {totalDoacoes > 0 && <span className="sol-tab-badge">{totalDoacoes}</span>}
  </button>
</div>

    {/* FILTROS */}
<div className="sol-filtros">
  <span className="sol-filtros-label">Filtrar por estado:</span>
  {(tab === "EXAME"
    ? ["", "PENDENTE", "CONCLUIDO", "EXPIRADO"]
    : ["", "pendente", "confirmada", "cancelada"]
  ).map((s) => (
    <button
      key={s}
      className={`sol-filtro-btn ${filtroStatus === s ? "sol-filtro-active" : ""}`}
      onClick={() => setFiltroStatus(s)}
    >
      {s === "" ? "Todos"
        : s === "pendente" ? "Pendente"
        : s === "confirmada" ? "Confirmada"
        : s === "cancelada" ? "Cancelada"
        : s.charAt(0) + s.slice(1).toLowerCase()}
    </button>
  ))}
</div>

      {erro && <p className="sol-erro">{erro}</p>}

      {/* TABELA */}
      <SolicitacaoTable
        solicitacoes={solicitacoesFiltradas}
        loading={loading}
        tipo={tab}
      />

      {/* FAB SCANNER */}
      <button
        className="sol-fab"
        title="Escanear QR Code"
        onClick={() => navigate("/hospital/secretario/scanner")}
      >
        <FaQrcode />
        <span>Scanear QR</span>
      </button>

    </div>
  );
}