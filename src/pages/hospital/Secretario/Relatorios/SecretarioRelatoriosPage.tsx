import { useEffect, useRef, useState } from "react";
import { DoacoesBarChart } from "../../../../components/doacoes/DoacoesBarChart";
import { DoacoesDonutChart } from "../../../../components/doacoes/DoacoesDonutChart";
import "./SecretarioRelatoriosPage.css";

interface Recente {
  nome: string;
  email: string;
  tipo_sanguineo: string;
  data_doacao: string;
  nivel: string;
}

interface Stats {
  total_geral: number;
  total_mes: number;
  variacao_mes: number;
  doadores_unicos: number;
  por_tipo: { tipo: string; total: number }[];
  por_mes: { mes: string; mes_label: string; total: number }[];
  recentes: Recente[];
}

function getIniciais(nome: string) {
  return nome.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
}

function formatarData(data: string) {
  return new Date(data).toLocaleDateString("pt-PT", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function nivelClasse(nivel: string) {
  switch (nivel) {
    case "Ouro":   return "nivel-ouro";
    case "Prata":  return "nivel-prata";
    case "Bronze": return "nivel-bronze";
    default:       return "nivel-init";
  }
}

export default function SecretarioRelatoriosPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("${import.meta.env.VITE_API_URL}/api/doacoes/estatisticas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStats(data);
      setErro("");
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    intervalRef.current = setInterval(fetchStats, 30000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const handleExportar = () => window.print();

  if (loading) return (
    <div className="srel-page">
      <div className="srel-loading"><div className="srel-spinner" /><span>A carregar relatório...</span></div>
    </div>
  );

  if (erro) return (
    <div className="srel-page">
      <div className="srel-erro">
        <i className="ti ti-alert-circle" /><span>{erro}</span>
        <button onClick={fetchStats}>Tentar novamente</button>
      </div>
    </div>
  );

  const variacaoPositiva = (stats?.variacao_mes ?? 0) >= 0;
  const maisActivo = stats?.recentes?.[0] ?? null;

  return (
    <div className="srel-page" id="srel-pdf">

      {/* HEADER */}
      <div className="srel-header">
        <div>
          <h1>Relatório de Actividade</h1>
          <p>Estatísticas actualizadas em tempo real — actualiza a cada 30 segundos</p>
        </div>
        <button className="srel-btn-export" onClick={handleExportar}>
          <i className="ti ti-file-type-pdf" aria-hidden="true" />
          Exportar PDF
        </button>
      </div>

      {/* STATS */}
      <div className="doa-stats-grid">
        <div className="doa-stat-card">
          <div className="doa-stat-top">
            <span className="doa-stat-label">Total de doações</span>
            <div className="doa-stat-icon doa-icon-red"><i className="ti ti-droplet" /></div>
          </div>
          <span className="doa-stat-value">{stats?.total_geral ?? 0}</span>
          <span className={`doa-stat-sub ${variacaoPositiva ? "doa-up" : "doa-down"}`}>
            <i className={`ti ${variacaoPositiva ? "ti-trending-up" : "ti-trending-down"}`} />
            {Math.abs(stats?.variacao_mes ?? 0)}% vs mês anterior
          </span>
        </div>
        <div className="doa-stat-card">
          <div className="doa-stat-top">
            <span className="doa-stat-label">Este mês</span>
            <div className="doa-stat-icon doa-icon-blue"><i className="ti ti-calendar" /></div>
          </div>
          <span className="doa-stat-value">{stats?.total_mes ?? 0}</span>
          <span className="doa-stat-sub doa-neutral">Doações confirmadas</span>
        </div>
        <div className="doa-stat-card">
          <div className="doa-stat-top">
            <span className="doa-stat-label">Doadores</span>
            <div className="doa-stat-icon doa-icon-green"><i className="ti ti-users" /></div>
          </div>
          <span className="doa-stat-value">{stats?.doadores_unicos ?? 0}</span>
          <span className="doa-stat-sub doa-neutral">Pessoas diferentes</span>
        </div>
        <div className="doa-stat-card">
          <div className="doa-stat-top">
            <span className="doa-stat-label">Bolsas recolhidas</span>
            <div className="doa-stat-icon doa-icon-amber"><i className="ti ti-flask" /></div>
          </div>
          <span className="doa-stat-value">{stats?.total_geral ?? 0}</span>
          <span className="doa-stat-sub doa-neutral">Total acumulado</span>
        </div>
      </div>

      {/* DOADOR MAIS ACTIVO */}
      {maisActivo && (
        <div className="srel-destaque">
          <div className="srel-destaque-label">
            <i className="ti ti-trophy" aria-hidden="true" />
            Doador mais activo
          </div>
          <div className="srel-destaque-body">
            <div className="doa-avatar">{getIniciais(maisActivo.nome)}</div>
            <div className="srel-destaque-info">
              <span className="srel-destaque-nome">{maisActivo.nome}</span>
              <span className="srel-destaque-email">{maisActivo.email}</span>
            </div>
            <span className="doa-tipo-badge">{maisActivo.tipo_sanguineo}</span>
            <span className={`doa-nivel-badge ${nivelClasse(maisActivo.nivel)}`}>
              <i className="ti ti-award" aria-hidden="true" />
              {maisActivo.nivel}
            </span>
          </div>
        </div>
      )}

      {/* GRÁFICOS */}
      <div className="doa-charts-row">
        <div className="doa-chart-card">
          <div className="doa-chart-header">
            <div>
              <div className="doa-chart-title">Doações por mês</div>
              <div className="doa-chart-sub">Últimos 6 meses</div>
            </div>
          </div>
          <div className="doa-legend">
            <span className="doa-legend-item">
              <span className="doa-legend-dot" style={{ background: "#E24B4A" }} />
              Doações confirmadas
            </span>
          </div>
          <DoacoesBarChart data={stats?.por_mes ?? []} />
        </div>
        <div className="doa-chart-card">
          <div className="doa-chart-header">
            <div>
              <div className="doa-chart-title">Por tipo sanguíneo</div>
              <div className="doa-chart-sub">Distribuição total</div>
            </div>
          </div>
          <DoacoesDonutChart data={stats?.por_tipo ?? []} />
        </div>
      </div>

      {/* TABELA RECENTES */}
      <div className="doa-table-card">
        <div className="doa-table-card-header">
          <div>
            <div className="doa-chart-title">Doações recentes</div>
            <div className="doa-chart-sub">Últimas doações confirmadas neste hospital</div>
          </div>
        </div>
        <div className="doa-table-head">
          <span>Doador</span>
          <span>Tipo</span>
          <span>Nível</span>
          <span>Data</span>
        </div>
        {stats?.recentes.length === 0 ? (
          <div className="doa-table-empty">
            <i className="ti ti-droplet-off" aria-hidden="true" />
            <span>Nenhuma doação registada ainda</span>
          </div>
        ) : stats?.recentes.map((r, i) => (
          <div key={i} className="doa-table-row">
            <div className="doa-donor-info">
              <div className="doa-avatar">{getIniciais(r.nome)}</div>
              <div>
                <div className="doa-donor-name">{r.nome}</div>
                <div className="doa-donor-email">{r.email}</div>
              </div>
            </div>
            <span className="doa-tipo-badge">{r.tipo_sanguineo}</span>
            <span className={`doa-nivel-badge ${nivelClasse(r.nivel)}`}>
              <i className="ti ti-medal" aria-hidden="true" />
              {r.nivel}
            </span>
            <span className="doa-date">{formatarData(r.data_doacao)}</span>
          </div>
        ))}
      </div>

    </div>
  );
}