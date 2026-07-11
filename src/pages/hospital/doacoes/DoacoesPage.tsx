import { useEffect, useState } from "react";
import "./DoacoesPage.css";
import { DoacoesBarChart } from "../../../components/doacoes/DoacoesBarChart";
import { DoacoesDonutChart } from "../../../components/doacoes/DoacoesDonutChart";

interface Recente {
  id: number;
  nome: string;
  email: string;
  tipo_sanguineo: string;
  data_doacao: string;
  nivel: string;
  total_doacoes: number;
}

interface PorTipo {
  tipo: string;
  total: number;
}

interface PorMes {
  mes: string;
  mes_label: string;
  total: number;
}

interface Estatisticas {
  total_geral: number;
  total_mes: number;
  variacao_mes: number;
  doadores_unicos: number;
  por_tipo: PorTipo[];
  por_mes: PorMes[];
  recentes: Recente[];
}

function calcularNivelConfig(nivel: string) {
  switch (nivel) {
    case "Ouro":   return { classe: "nivel-ouro",   icone: "ti-trophy" };
    case "Prata":  return { classe: "nivel-prata",  icone: "ti-medal"  };
    case "Bronze": return { classe: "nivel-bronze", icone: "ti-award"  };
    default:       return { classe: "nivel-init",   icone: "ti-star"   };
  }
}

function getIniciais(nome: string) {
  return nome.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
}

function formatarData(data: string) {
  return new Date(data).toLocaleDateString("pt-PT", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export default function DoacoesPage() {
  const [stats, setStats] = useState<Estatisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const fetchEstatisticas = async () => {
    try {
      setLoading(true);
      setErro("");
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/doacoes/estatisticas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao carregar estatísticas");
      setStats(data);
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEstatisticas(); }, []);

  if (loading) {
    return (
      <div className="doa-page">
        <div className="doa-loading">
          <div className="doa-spinner" />
          <span>A carregar estatísticas...</span>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="doa-page">
        <div className="doa-erro">
          <i className="ti ti-alert-circle" aria-hidden="true" />
          <span>{erro}</span>
          <button onClick={fetchEstatisticas}>Tentar novamente</button>
        </div>
      </div>
    );
  }

  const variacao = stats?.variacao_mes ?? 0;
  const variacaoPositiva = variacao >= 0;

  return (
    <div className="doa-page">

      {/* HEADER */}
      <div className="doa-header">
        <div>
          <h1>Doações</h1>
          <p>Histórico e estatísticas de doações confirmadas neste hospital</p>
        </div>
        <span className="doa-date-badge">
          {new Date().toLocaleDateString("pt-PT", {
            month: "long", year: "numeric",
          })}
        </span>
      </div>

      {/* STATS */}
      <div className="doa-stats-grid">
        <div className="doa-stat-card">
          <div className="doa-stat-top">
            <span className="doa-stat-label">Total de doações</span>
            <div className="doa-stat-icon doa-icon-red">
              <i className="ti ti-droplet" aria-hidden="true" />
            </div>
          </div>
          <span className="doa-stat-value">{stats?.total_geral ?? 0}</span>
          <span className={`doa-stat-sub ${variacaoPositiva ? "doa-up" : "doa-down"}`}>
            <i className={`ti ${variacaoPositiva ? "ti-trending-up" : "ti-trending-down"}`} aria-hidden="true" />
            {Math.abs(variacao)}% vs mês anterior
          </span>
        </div>

        <div className="doa-stat-card">
          <div className="doa-stat-top">
            <span className="doa-stat-label">Este mês</span>
            <div className="doa-stat-icon doa-icon-blue">
              <i className="ti ti-calendar" aria-hidden="true" />
            </div>
          </div>
          <span className="doa-stat-value">{stats?.total_mes ?? 0}</span>
          <span className="doa-stat-sub doa-neutral">Doações confirmadas</span>
        </div>

        <div className="doa-stat-card">
          <div className="doa-stat-top">
            <span className="doa-stat-label">Doadores </span>
            <div className="doa-stat-icon doa-icon-green">
              <i className="ti ti-users" aria-hidden="true" />
            </div>
          </div>
          <span className="doa-stat-value">{stats?.doadores_unicos ?? 0}</span>
          <span className="doa-stat-sub doa-neutral">Pessoas diferentes</span>
        </div>

        <div className="doa-stat-card">
          <div className="doa-stat-top">
            <span className="doa-stat-label">Bolsas recolhidas</span>
            <div className="doa-stat-icon doa-icon-amber">
              <i className="ti ti-flask" aria-hidden="true" />
            </div>
          </div>
          <span className="doa-stat-value">{stats?.total_geral ?? 0}</span>
          <span className="doa-stat-sub doa-neutral">Total acumulado</span>
        </div>
      </div>

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
            <div className="doa-chart-sub">Últimas doações confirmadas</div>
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
        ) : (
          stats?.recentes.map((r) => {
            const nivelConfig = calcularNivelConfig(r.nivel);
            return (
              <div key={r.id} className="doa-table-row">
                <div className="doa-donor-info">
                  <div className="doa-avatar">{getIniciais(r.nome)}</div>
                  <div>
                    <div className="doa-donor-name">{r.nome}</div>
                    <div className="doa-donor-email">{r.email}</div>
                  </div>
                </div>
                <span className="doa-tipo-badge">{r.tipo_sanguineo}</span>
                <span className={`doa-nivel-badge ${nivelConfig.classe}`}>
                  <i className={`ti ${nivelConfig.icone}`} aria-hidden="true" />
                  {r.nivel}
                </span>
                <span className="doa-date">{formatarData(r.data_doacao)}</span>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}