import { useEffect, useRef, useState } from "react";
import "./RelatoriosPage.css";
import { DoacoesBarChart } from "../../../components/doacoes/DoacoesBarChart";
import { DoacoesDonutChart } from "../../../components/doacoes/DoacoesDonutChart";

interface TopDoador {
  nome: string;
  email: string;
  tipo_sanguineo: string;
  total_doacoes: number;
  ultima_doacao: string;
}

interface Relatorio {
  hospital: { nome: string; provincia: string; municipio: string };
  gerado_em: string;
  total_geral: number;
  total_mes: number;
  variacao_mes: number;
  doadores_unicos: number;
  por_tipo: { tipo: string; total: number }[];
  por_mes: { mes: string; mes_label: string; total: number }[];
  doador_mais_ativo: TopDoador | null;
  top_doadores: TopDoador[];
}

function calcularNivel(total: number) {
  if (total >= 10) return { label: "Ouro",   classe: "nivel-ouro"   };
  if (total >= 5)  return { label: "Prata",  classe: "nivel-prata"  };
  if (total >= 1)  return { label: "Bronze", classe: "nivel-bronze" };
  return               { label: "Iniciante", classe: "nivel-init"   };
}

function getIniciais(nome: string) {
  return nome.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
}

function formatarData(data: string) {
  return new Date(data).toLocaleDateString("pt-PT", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function formatarDataHora(data: string) {
  return new Date(data).toLocaleString("pt-PT", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function RelatoriosPage() {
  const [relatorio, setRelatorio] = useState<Relatorio | null>(null);
  const [loading, setLoading]     = useState(true);
  const [erro, setErro]           = useState("");
  const [exportando, setExportando] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

const fetchRelatorio = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/doacoes/relatorio`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();
    console.log("RELATORIO RESPOSTA:", data); // ✅ adiciona isto
    if (!res.ok) throw new Error(data.message);
    setRelatorio(data);
    setErro("");
  } catch (err: any) {
    console.error("RELATORIO ERRO:", err); // ✅ e isto
    setErro(err.message);
  } finally {
    setLoading(false);
  }
};

  // ✅ Actualização automática a cada 30 segundos
  useEffect(() => {
    fetchRelatorio();
    intervalRef.current = setInterval(fetchRelatorio, 30000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleExportarPDF = async () => {
    setExportando(true);
    setTimeout(() => {
      window.print();
      setExportando(false);
    }, 300);
  };

 const handleEnviarINS = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/relatorios/enviar`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    alert("Relatório enviado ao INS com sucesso!");
  } catch (err: any) {
    alert(err.message || "Erro ao enviar ao INS.");
  }
};
  const variacaoPositiva = (relatorio?.variacao_mes ?? 0) >= 0;
  const maisAtivo = relatorio?.doador_mais_ativo;

  return (
    <div className="rel-page" id="relatorio-pdf">

      {/* HEADER */}
      <div className="rel-header">
        <div>
          <h1>Relatório de Doações</h1>
          <p>
            {relatorio?.hospital?.nome} &mdash; {relatorio?.hospital?.municipio},{" "}
            {relatorio?.hospital?.provincia}
          </p>
        </div>
        <div className="rel-header-actions">
          <span className="rel-gerado-em">
            <i className="ti ti-refresh" />
            Actualizado: {formatarDataHora(relatorio?.gerado_em ?? "")}
          </span>
          <button
            className="rel-btn-secondary"
            onClick={handleEnviarINS}
          >
            <i className="ti ti-send" />
            Enviar ao INS
          </button>
          <button
            className="rel-btn-primary"
            onClick={handleExportarPDF}
            disabled={exportando}
          >
            <i className="ti ti-file-type-pdf" />
            {exportando ? "A exportar..." : "Exportar PDF"}
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="doa-stats-grid">
        <div className="doa-stat-card">
          <div className="doa-stat-top">
            <span className="doa-stat-label">Total de doações</span>
            <div className="doa-stat-icon doa-icon-red">
              <i className="ti ti-droplet" />
            </div>
          </div>
          <span className="doa-stat-value">{relatorio?.total_geral ?? 0}</span>
          <span className={`doa-stat-sub ${variacaoPositiva ? "doa-up" : "doa-down"}`}>
            <i className={`ti ${variacaoPositiva ? "ti-trending-up" : "ti-trending-down"}`} />
            {Math.abs(relatorio?.variacao_mes ?? 0)}% vs mês anterior
          </span>
        </div>

        <div className="doa-stat-card">
          <div className="doa-stat-top">
            <span className="doa-stat-label">Este mês</span>
            <div className="doa-stat-icon doa-icon-blue">
              <i className="ti ti-calendar" />
            </div>
          </div>
          <span className="doa-stat-value">{relatorio?.total_mes ?? 0}</span>
          <span className="doa-stat-sub doa-neutral">Doações confirmadas</span>
        </div>

        <div className="doa-stat-card">
          <div className="doa-stat-top">
            <span className="doa-stat-label">Doadores únicos</span>
            <div className="doa-stat-icon doa-icon-green">
              <i className="ti ti-users" />
            </div>
          </div>
          <span className="doa-stat-value">{relatorio?.doadores_unicos ?? 0}</span>
          <span className="doa-stat-sub doa-neutral">Pessoas diferentes</span>
        </div>

        <div className="doa-stat-card">
          <div className="doa-stat-top">
            <span className="doa-stat-label">Bolsas recolhidas</span>
            <div className="doa-stat-icon doa-icon-amber">
              <i className="ti ti-flask" />
            </div>
          </div>
          <span className="doa-stat-value">{relatorio?.total_geral ?? 0}</span>
          <span className="doa-stat-sub doa-neutral">Total acumulado</span>
        </div>
      </div>

      {/* DOADOR MAIS ACTIVO */}
      {maisAtivo && (
        <div className="rel-destaque-card">
          <div className="rel-destaque-label">
            <i className="ti ti-trophy" />
            Doador Mais Activo
          </div>
          <div className="rel-destaque-body">
            <div className="rel-destaque-avatar">
              {getIniciais(maisAtivo.nome)}
            </div>
            <div className="rel-destaque-info">
              <span className="rel-destaque-nome">{maisAtivo.nome}</span>
              <span className="rel-destaque-email">{maisAtivo.email}</span>
              <div className="rel-destaque-tags">
                <span className="doa-tipo-badge">{maisAtivo.tipo_sanguineo}</span>
                <span className={`doa-nivel-badge ${calcularNivel(maisAtivo.total_doacoes).classe}`}>
                  <i className="ti ti-trophy" />
                  {calcularNivel(maisAtivo.total_doacoes).label}
                </span>
              </div>
            </div>
            <div className="rel-destaque-stats">
              <div className="rel-destaque-stat">
                <span className="rel-destaque-stat-value">{maisAtivo.total_doacoes}</span>
                <span className="rel-destaque-stat-label">Doações</span>
              </div>
              <div className="rel-destaque-stat">
                <span className="rel-destaque-stat-value">
                  {formatarData(maisAtivo.ultima_doacao)}
                </span>
                <span className="rel-destaque-stat-label">Última doação</span>
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
          <DoacoesBarChart data={relatorio?.por_mes ?? []} />
        </div>

        <div className="doa-chart-card">
          <div className="doa-chart-header">
            <div>
              <div className="doa-chart-title">Por tipo sanguíneo</div>
              <div className="doa-chart-sub">Distribuição total</div>
            </div>
          </div>
          <DoacoesDonutChart data={relatorio?.por_tipo ?? []} />
        </div>
      </div>

      {/* TOP 5 DOADORES */}
      <div className="doa-table-card">
        <div className="doa-table-card-header">
          <div>
            <div className="doa-chart-title">Top 5 Doadores</div>
            <div className="doa-chart-sub">Doadores com mais contribuições neste hospital</div>
          </div>
        </div>

        <div className="rel-top-head">
          <span>Doador</span>
          <span>Tipo</span>
          <span>Nível</span>
          <span>Doações</span>
          <span>Última doação</span>
        </div>

        {relatorio?.top_doadores.map((d, i) => {
          const nivel = calcularNivel(d.total_doacoes);
          return (
            <div key={i} className="rel-top-row">
              <div className="doa-donor-info">
                <div className="rel-rank">#{i + 1}</div>
                <div className="doa-avatar">{getIniciais(d.nome)}</div>
                <div>
                  <div className="doa-donor-name">{d.nome}</div>
                  <div className="doa-donor-email">{d.email}</div>
                </div>
              </div>
              <span className="doa-tipo-badge">{d.tipo_sanguineo}</span>
              <span className={`doa-nivel-badge ${nivel.classe}`}>
                <i className="ti ti-medal" />
                {nivel.label}
              </span>
              <span className="rel-total-doacoes">{d.total_doacoes}</span>
              <span className="doa-date">{formatarData(d.ultima_doacao)}</span>
            </div>
          );
        })}
      </div>

    </div>
  );
}