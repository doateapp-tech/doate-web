import { useEffect, useRef, useState } from "react";
import "./EstoqueRelatoriosPage.css";
import { DoacoesBarChart } from "../../../../components/doacoes/DoacoesBarChart";

interface TipoEstoque {
  tipo_sanguineo: string;
  quantidade: number;
  atualizado_em: string;
}

interface HistoricoMes {
  mes: string;
  mes_label: string;
  total: number;
}

interface EstoqueStats {
  total_bolsas: number;
  tipos_criticos: number;
  tipos_baixos: number;
  estoque: TipoEstoque[];
  historico_6meses: HistoricoMes[];
}

function classificarNivel(quantidade: number) {
  if (quantidade <= 9)  return { label: "Crítico", classe: "enivel-critico", icone: "ti-alert-triangle" };
  if (quantidade <= 19) return { label: "Baixo",   classe: "enivel-baixo",   icone: "ti-alert-circle"   };
  return                       { label: "Normal",  classe: "enivel-normal",  icone: "ti-circle-check"   };
}

function formatarDataHora(data: string) {
  return new Date(data).toLocaleString("pt-PT", {
    day: "2-digit", month: "short",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function EstoqueRelatoriosPage() {
  const [stats, setStats] = useState<EstoqueStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/estoque/relatorio`, {
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

  const maiorQuantidade = Math.max(...(stats?.estoque.map(e => e.quantidade) || [1]), 1);

  if (loading) return (
    <div className="erel-page">
      <div className="erel-loading">
        <div className="erel-spinner" />
        <span>A carregar relatório...</span>
      </div>
    </div>
  );

  if (erro) return (
    <div className="erel-page">
      <div className="erel-erro">
        <i className="ti ti-alert-circle" aria-hidden="true" />
        <span>{erro}</span>
        <button onClick={fetchStats}>Tentar novamente</button>
      </div>
    </div>
  );

  return (
    <div className="erel-page" id="erel-pdf">

      {/* HEADER */}
      <div className="erel-header">
        <div>
          <h1>Relatório de Estoque</h1>
          <p>Níveis actualizados em tempo real — actualiza a cada 30 segundos</p>
        </div>
        <button className="erel-btn-export" onClick={() => window.print()}>
          <i className="ti ti-file-type-pdf" aria-hidden="true" />
          Exportar PDF
        </button>
      </div>

      {/* STATS */}
      <div className="erel-stats-grid">
        <div className="erel-stat-card">
          <div className="erel-stat-top">
            <span className="erel-stat-label">Total de bolsas</span>
            <div className="erel-stat-icon erel-icon-blue">
              <i className="ti ti-flask" aria-hidden="true" />
            </div>
          </div>
          <span className="erel-stat-value">{stats?.total_bolsas ?? 0}</span>
          <span className="erel-stat-sub">Stock total disponível</span>
        </div>

        <div className="erel-stat-card">
          <div className="erel-stat-top">
            <span className="erel-stat-label">Tipos críticos</span>
            <div className="erel-stat-icon erel-icon-red">
              <i className="ti ti-alert-triangle" aria-hidden="true" />
            </div>
          </div>
          <span className="erel-stat-value">{stats?.tipos_criticos ?? 0}</span>
          <span className="erel-stat-sub">Abaixo de 10 bolsas</span>
        </div>

        <div className="erel-stat-card">
          <div className="erel-stat-top">
            <span className="erel-stat-label">Tipos em baixo</span>
            <div className="erel-stat-icon erel-icon-amber">
              <i className="ti ti-alert-circle" aria-hidden="true" />
            </div>
          </div>
          <span className="erel-stat-value">{stats?.tipos_baixos ?? 0}</span>
          <span className="erel-stat-sub">Entre 10 e 19 bolsas</span>
        </div>

        <div className="erel-stat-card">
          <div className="erel-stat-top">
            <span className="erel-stat-label">Tipos normais</span>
            <div className="erel-stat-icon erel-icon-green">
              <i className="ti ti-circle-check" aria-hidden="true" />
            </div>
          </div>
          <span className="erel-stat-value">
            {(stats?.estoque.length ?? 0) - (stats?.tipos_criticos ?? 0) - (stats?.tipos_baixos ?? 0)}
          </span>
          <span className="erel-stat-sub">20 ou mais bolsas</span>
        </div>
      </div>

      {/* LEGENDA */}
      <div className="erel-legenda">
        <span className="erel-legenda-item">
          <span className="erel-legenda-dot erel-dot-critico" /> Crítico (≤ 9 bolsas)
        </span>
        <span className="erel-legenda-item">
          <span className="erel-legenda-dot erel-dot-baixo" /> Baixo (10–19 bolsas)
        </span>
        <span className="erel-legenda-item">
          <span className="erel-legenda-dot erel-dot-normal" /> Normal (≥ 20 bolsas)
        </span>
      </div>

      {/* LISTAGEM DE ESTOQUE */}
<div className="erel-card">
  <div className="erel-card-header">
    <div className="erel-card-title">Estoque por tipo sanguíneo</div>
    <div className="erel-card-sub">Quantidades actuais no hospital</div>
  </div>

  <div className="erel-estoque-lista">
    {stats?.estoque.map((e) => {
      const cfg = classificarNivel(e.quantidade);
      const largura = Math.max((e.quantidade / maiorQuantidade) * 100, 3);
      return (
        <div key={e.tipo_sanguineo} className="erel-estoque-item">
          <div className="erel-estoque-topo">
            <div className="erel-estoque-esq">
              <span className="erel-tipo-badge">{e.tipo_sanguineo}</span>
              <span className="erel-estoque-quantidade">{e.quantidade} bolsas</span>
            </div>
            <div className="erel-estoque-dir">
              <span className={`erel-nivel-badge ${cfg.classe}`}>
                <i className={`ti ${cfg.icone}`} aria-hidden="true" />
                {cfg.label}
              </span>
              <span className="erel-atualizado">
                Actualizado: {formatarDataHora(e.atualizado_em)}
              </span>
            </div>
          </div>
          <div className="erel-barra-track">
            <div
              className={`erel-barra-fill ${cfg.classe}`}
              style={{ width: `${largura}%` }}
            />
          </div>
        </div>
      );
    })}
</div>
</div>

  {/* HISTÓRICO 6 MESES */}
<div className="erel-card">
  <div className="erel-card-header">
    <div className="erel-card-title">Bolsas recolhidas por mês</div>
    <div className="erel-card-sub">Últimos 6 meses via doações confirmadas</div>
  </div>

  {stats?.historico_6meses.length === 0 ? (
    <div className="erel-empty">
      <i className="ti ti-chart-bar-off" aria-hidden="true" />
      <span>Sem dados nos últimos 6 meses</span>
    </div>
  ) : (
    <DoacoesBarChart data={stats?.historico_6meses ?? []} />
  )}
</div>
       
      </div>

   
  );
}