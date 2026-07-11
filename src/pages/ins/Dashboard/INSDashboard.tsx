import { useEffect, useState } from "react";
import "./INSDashboard.css";

interface EstoqueTipo {
  tipo: string;
  total: number;
  nivel: "critico" | "baixo" | "normal";
}

interface HospitalCritico {
  id: number;
  nome: string;
  provincia: string;
  municipio: string;
  tipos_criticos: { tipo: string; quantidade: number }[];
}

interface DashboardData {
  hospitais_ativos: number;
  tipos_criticos: number;
  doadores_registados: number;
  relatorios_recebidos: number;
  estoque_nacional: EstoqueTipo[];
  hospitais_criticos: HospitalCritico[];
}

function nivelConfig(nivel: string) {
  switch (nivel) {
    case "critico": return { label: "Crítico", classe: "insd-nivel-critico", icone: "ti-alert-triangle" };
    case "baixo":   return { label: "Baixo",   classe: "insd-nivel-baixo",   icone: "ti-alert-circle" };
    default:        return { label: "Normal",  classe: "insd-nivel-normal",  icone: "ti-circle-check" };
  }
}

export default function INSDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setErro("");
      const token = localStorage.getItem("token");
      const res = await fetch("${import.meta.env.VITE_API_URL}/api/ins/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Erro ao carregar dashboard");
      setData(json);
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  if (loading) {
    return (
      <div className="insd-page">
        <div className="insd-loading">
          <div className="insd-spinner" />
          <span>A carregar dashboard...</span>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="insd-page">
        <div className="insd-erro">
          <i className="ti ti-alert-circle" aria-hidden="true" />
          <span>{erro}</span>
          <button onClick={fetchDashboard}>Tentar novamente</button>
        </div>
      </div>
    );
  }

  const maiorEstoque = Math.max(...(data?.estoque_nacional.map(e => e.total) || [1]), 1);

  return (
    <div className="insd-page">

      {/* HEADER */}
      <div className="insd-header">
        <div>
          <h1>Estatísticas </h1>
          <p>Visão geral do sistema nacional de doação de sangue</p>
        </div>
        <button className="insd-btn-refresh" onClick={fetchDashboard} title="Actualizar dados">
          <i className="ti ti-refresh" aria-hidden="true" />
          Actualizar
        </button>
      </div>

      {/* OVERVIEW CARDS */}
      <div className="insd-overview-grid">
        <div className="insd-overview-card">
          <div className="insd-overview-icon insd-icon-blue">
            <i className="ti ti-building-hospital" aria-hidden="true" />
          </div>
          <div>
            <span className="insd-overview-value">{data?.hospitais_ativos ?? 0}</span>
            <span className="insd-overview-label">Hospitais activos</span>
          </div>
        </div>

        <div className="insd-overview-card">
          <div className="insd-overview-icon insd-icon-red">
            <i className="ti ti-droplet-exclamation" aria-hidden="true" />
          </div>
          <div>
            <span className="insd-overview-value">{data?.tipos_criticos ?? 0}</span>
            <span className="insd-overview-label">Tipos em crítico</span>
          </div>
        </div>

        <div className="insd-overview-card">
          <div className="insd-overview-icon insd-icon-green">
            <i className="ti ti-users" aria-hidden="true" />
          </div>
          <div>
            <span className="insd-overview-value">{data?.doadores_registados ?? 0}</span>
            <span className="insd-overview-label">Doadores registados</span>
          </div>
        </div>

        <div className="insd-overview-card">
          <div className="insd-overview-icon insd-icon-amber">
            <i className="ti ti-file-text" aria-hidden="true" />
          </div>
          <div>
            <span className="insd-overview-value">{data?.relatorios_recebidos ?? 0}</span>
            <span className="insd-overview-label">Relatórios este mês</span>
          </div>
        </div>
      </div>

      <div className="insd-main-grid">

        {/* ESTOQUE NACIONAL */}
        <div className="insd-card">
          <div className="insd-card-header">
            <div>
              <div className="insd-card-title">Estoque Nacional Agregado</div>
              <div className="insd-card-sub">Soma do estoque de todos os hospitais activos</div>
            </div>
          </div>

          <div className="insd-legend">
            <span className="insd-legend-item">
              <span className="insd-legend-dot insd-dot-critico" /> Crítico (≤ 9)
            </span>
            <span className="insd-legend-item">
              <span className="insd-legend-dot insd-dot-baixo" /> Baixo (10–19)
            </span>
            <span className="insd-legend-item">
              <span className="insd-legend-dot insd-dot-normal" /> Normal (≥ 20)
            </span>
          </div>

          <div className="insd-estoque-grid">
            {data?.estoque_nacional.map((e) => {
              const cfg = nivelConfig(e.nivel);
              const largura = Math.max((e.total / maiorEstoque) * 100, 4);
              return (
                <div key={e.tipo} className="insd-estoque-item">
                  <div className="insd-estoque-top">
                    <span className="insd-estoque-tipo">{e.tipo}</span>
                    <span className={`insd-estoque-badge ${cfg.classe}`}>
                      <i className={`ti ${cfg.icone}`} aria-hidden="true" />
                      {cfg.label}
                    </span>
                  </div>
                  <div className="insd-estoque-bar-track">
                    <div
                      className={`insd-estoque-bar-fill ${cfg.classe}`}
                      style={{ width: `${largura}%` }}
                    />
                  </div>
                  <span className="insd-estoque-valor">{e.total} bolsas</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* HOSPITAIS CRÍTICOS */}
        <div className="insd-card">
          <div className="insd-card-header">
            <div>
              <div className="insd-card-title">Hospitais em Estado Crítico</div>
              <div className="insd-card-sub">Necessitam de reposição urgente</div>
            </div>
          </div>

          {data?.hospitais_criticos.length === 0 ? (
            <div className="insd-empty">
              <i className="ti ti-circle-check" aria-hidden="true" />
              <span>Nenhum hospital em estado crítico</span>
            </div>
          ) : (
            <div className="insd-hospitais-list">
              {data?.hospitais_criticos.map((h) => (
                <div key={h.id} className="insd-hospital-item">
                  <div className="insd-hospital-header">
                    <div className="insd-hospital-info">
                      <span className="insd-hospital-nome">{h.nome}</span>
                      <span className="insd-hospital-local">
                        <i className="ti ti-map-pin" aria-hidden="true" />
                        {h.municipio}, {h.provincia}
                      </span>
                    </div>
                  </div>
                  <div className="insd-hospital-tipos">
                    {h.tipos_criticos.map((t) => (
                      <span key={t.tipo} className="insd-tipo-chip">
                        {t.tipo} <strong>{t.quantidade}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}