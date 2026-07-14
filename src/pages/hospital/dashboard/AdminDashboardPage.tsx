import { useEffect, useState } from "react";
import "./AdminDashboardPage.css";
import { DoacoesBarChart } from "../../../components/doacoes/DoacoesBarChart";
import { DoacoesDonutChart } from "../../../components/doacoes/DoacoesDonutChart";

interface Estatisticas {
  total_geral: number;
  total_mes: number;
  variacao_mes: number;
  doadores_unicos: number;
  por_tipo: { tipo: string; total: number }[];
  por_mes: { mes: string; mes_label: string; total: number }[];
  recentes: {
    nome: string;
    email: string;
    tipo_sanguineo: string;
    data_doacao: string;
    nivel: string;
  }[];
}

interface EstoqueItem {
  tipo_sanguineo: string;
  quantidade: number;
}

interface RelatorioData {
  doador_mais_ativo: {
    nome: string;
    email: string;
    tipo_sanguineo: string;
    total_doacoes: number;
    ultima_doacao: string;
  } | null;
}

function classificarNivel(quantidade: number) {
  if (quantidade <= 9)  return { label: "Crítico", classe: "adm-nivel-critico" };
  if (quantidade <= 19) return { label: "Baixo",   classe: "adm-nivel-baixo"   };
  return                       { label: "Normal",  classe: "adm-nivel-normal"  };
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

export default function AdminDashboardPage() {
  const [stats, setStats]     = useState<Estatisticas | null>(null);
  const [estoque, setEstoque] = useState<EstoqueItem[]>([]);
  const [relatorio, setRelatorio] = useState<RelatorioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro]       = useState("");

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setErro("");
      const token = localStorage.getItem("token");
      const h = { Authorization: `Bearer ${token}` };

      const [resStats, resEstoque, resRelatorio] = await Promise.all([
        fetch("http://localhost:3333/api/doacoes/estatisticas", { headers: h }),
        fetch("http://localhost:3333/api/estoque",              { headers: h }),
        fetch("http://localhost:3333/api/doacoes/relatorio",    { headers: h }),
      ]);

      const [dataStats, dataEstoque, dataRelatorio] = await Promise.all([
        resStats.json(),
        resEstoque.json(),
        resRelatorio.json(),
      ]);

      if (resStats.ok)    setStats(dataStats);
      if (resEstoque.ok)  setEstoque(dataEstoque.data || []);
      if (resRelatorio.ok) setRelatorio(dataRelatorio);

    } catch (err: any) {
      setErro("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTodos(); }, []);

  const variacaoPositiva = (stats?.variacao_mes ?? 0) >= 0;
  const maisAtivo = relatorio?.doador_mais_ativo;
  const maiorQtd = Math.max(...estoque.map(e => e.quantidade), 1);

  if (loading) return (
    <div className="adm-page">
      <div className="adm-loading">
        <div className="adm-spinner" />
        <span>A carregar análises...</span>
      </div>
    </div>
  );

  if (erro) return (
    <div className="adm-page">
      <div className="adm-erro">
        <i className="ti ti-alert-circle" aria-hidden="true" />
        <span>{erro}</span>
        <button onClick={fetchTodos}>Tentar novamente</button>
      </div>
    </div>
  );

  return (
    <div className="adm-page">

      {/* HEADER */}
      <div className="adm-header">
        <div>
          <h1>Análises</h1>
          <p>Visão geral da actividade do hospital</p>
        </div>
        <button className="adm-btn-refresh" onClick={fetchTodos}>
          <i className="ti ti-refresh" aria-hidden="true" />
          Actualizar
        </button>
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
            <i className={`ti ${variacaoPositiva ? "ti-trending-up" : "ti-trending-down"}`} />
            {Math.abs(stats?.variacao_mes ?? 0)}% vs mês anterior
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
            <span className="doa-stat-label">Doadores</span>
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

      {/* DOADOR MAIS ACTIVO */}
      {maisAtivo && (
        <div className="adm-destaque">
          <div className="adm-destaque-label">
            <i className="ti ti-trophy" aria-hidden="true" />
            Doador mais activo
          </div>
          <div className="adm-destaque-body">
            <div className="doa-avatar">{getIniciais(maisAtivo.nome)}</div>
            <div className="adm-destaque-info">
              <span className="adm-destaque-nome">{maisAtivo.nome}</span>
              <span className="adm-destaque-email">{maisAtivo.email}</span>
            </div>
            <span className="doa-tipo-badge">{maisAtivo.tipo_sanguineo}</span>
            <div className="adm-destaque-stats">
              <div className="adm-destaque-stat">
                <span className="adm-destaque-stat-value">{maisAtivo.total_doacoes}</span>
                <span className="adm-destaque-stat-label">Doações</span>
              </div>
              <div className="adm-destaque-stat">
                <span className="adm-destaque-stat-value">{formatarData(maisAtivo.ultima_doacao)}</span>
                <span className="adm-destaque-stat-label">Última doação</span>
              </div>
            </div>
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

      {/* ESTOQUE ACTUAL */}
      <div className="doa-chart-card">
        <div className="doa-chart-header">
          <div>
            <div className="doa-chart-title">Estoque actual</div>
            <div className="doa-chart-sub">Níveis de stock por tipo sanguíneo</div>
          </div>
        </div>
        <div className="adm-estoque-lista">
          {estoque.length === 0 ? (
            <div className="adm-empty">
              <i className="ti ti-flask-off" aria-hidden="true" />
              <span>Sem dados de estoque</span>
            </div>
          ) : estoque.map((e) => {
            const cfg = classificarNivel(e.quantidade);
            const largura = Math.max((e.quantidade / maiorQtd) * 100, 3);
            return (
              <div key={e.tipo_sanguineo} className="adm-estoque-item">
                <div className="adm-estoque-topo">
                  <div className="adm-estoque-esq">
                    <span className="doa-tipo-badge">{e.tipo_sanguineo}</span>
                    <span className="adm-estoque-qtd">{e.quantidade} bolsas</span>
                  </div>
                  <span className={`adm-nivel-badge ${cfg.classe}`}>
                    {cfg.label}
                  </span>
                </div>
                <div className="adm-barra-track">
                  <div
                    className={`adm-barra-fill ${cfg.classe}`}
                    style={{ width: `${largura}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DOAÇÕES RECENTES */}
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