import { useEffect, useMemo, useState } from "react";
import "./INSRelatoriosPage.css";

interface RelatorioINS {
  id: number;
  periodo_inicio: string;
  periodo_fim: string;
  total_doacoes: number;
  total_exames: number;
  total_doadores_unicos: number;
  total_bolsas: number;
  doador_mais_ativo_nome: string | null;
  doador_mais_ativo_doacoes: number;
  enviado_em: string;
  criado_em: string;
  hospital_nome: string;
  provincia: string;
  municipio: string;
  criado_por_nome: string;
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

type FiltroView = "atuais" | "historico" | "todos";

export default function INSRelatoriosPage() {
  const [relatorios, setRelatorios] = useState<RelatorioINS[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [filtroView, setFiltroView] = useState<FiltroView>("atuais");
  const [busca, setBusca] = useState("");
  const [filtroProvincia, setFiltroProvincia] = useState("");
  const [selecionado, setSelecionado] = useState<RelatorioINS | null>(null);

  const fetchRelatorios = async () => {
    try {
      setLoading(true);
      setErro("");
      const token = localStorage.getItem("token");
      const res = await fetch("${import.meta.env.VITE_API_URL}/api/relatorios/ins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao carregar relatórios");
      setRelatorios(data.data || []);
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRelatorios(); }, []);

  // Agrupa por hospital — o mais recente de cada é "actual"
  const { atuais, historico, provincias } = useMemo(() => {
    const porHospital = new Map<string, RelatorioINS[]>();

    relatorios.forEach((r) => {
      const lista = porHospital.get(r.hospital_nome) || [];
      lista.push(r);
      porHospital.set(r.hospital_nome, lista);
    });

    const atuaisArr: RelatorioINS[] = [];
    const historicoArr: RelatorioINS[] = [];

    porHospital.forEach((lista) => {
      const ordenada = [...lista].sort(
        (a, b) => new Date(b.enviado_em).getTime() - new Date(a.enviado_em).getTime()
      );
      atuaisArr.push(ordenada[0]);
      historicoArr.push(...ordenada.slice(1));
    });

    const provs = Array.from(new Set(relatorios.map(r => r.provincia))).sort();

    return { atuais: atuaisArr, historico: historicoArr, provincias: provs };
  }, [relatorios]);

  const listaBase = filtroView === "atuais" ? atuais
    : filtroView === "historico" ? historico
    : relatorios;

  const listaFiltrada = listaBase
    .filter(r => busca
      ? r.hospital_nome.toLowerCase().includes(busca.toLowerCase())
      : true)
    .filter(r => filtroProvincia ? r.provincia === filtroProvincia : true)
    .sort((a, b) => new Date(b.enviado_em).getTime() - new Date(a.enviado_em).getTime());

  const totalDoacoesGeral = atuais.reduce((acc, r) => acc + r.total_doacoes, 0);
  const totalBolsasGeral = atuais.reduce((acc, r) => acc + r.total_bolsas, 0);
  const totalHospitaisAtivos = atuais.length;

  if (loading) {
    return (
      <div className="insr-page">
        <div className="insr-loading">
          <div className="insr-spinner" />
          <span>A carregar relatórios...</span>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="insr-page">
        <div className="insr-erro">
          <i className="ti ti-alert-circle" aria-hidden="true" />
          <span>{erro}</span>
          <button onClick={fetchRelatorios}>Tentar novamente</button>
        </div>
      </div>
    );
  }

  return (
    <div className="insr-page">

      {/* HEADER */}
      <div className="insr-header">
        <div>
          <h1>Relatórios</h1>
          <p>Relatórios submetidos pelos hospitais ao Instituto Nacional de Sangue</p>
        </div>
        <button className="insr-btn-refresh" onClick={fetchRelatorios}>
          <i className="ti ti-refresh" aria-hidden="true" />
          Actualizar
        </button>
      </div>

      {/* STATS GERAIS */}
      <div className="insr-stats-grid">
        <div className="insr-stat-card">
          <div className="insr-stat-top">
            <span className="insr-stat-label">Hospitais activos</span>
            <div className="insr-stat-icon insr-icon-blue">
              <i className="ti ti-building-hospital" aria-hidden="true" />
            </div>
          </div>
          <span className="insr-stat-value">{totalHospitaisAtivos}</span>
          <span className="insr-stat-sub">Com relatório submetido</span>
        </div>

        <div className="insr-stat-card">
          <div className="insr-stat-top">
            <span className="insr-stat-label">Total de doações</span>
            <div className="insr-stat-icon insr-icon-red">
              <i className="ti ti-droplet" aria-hidden="true" />
            </div>
          </div>
          <span className="insr-stat-value">{totalDoacoesGeral}</span>
          <span className="insr-stat-sub">Across todos os hospitais</span>
        </div>

        <div className="insr-stat-card">
          <div className="insr-stat-top">
            <span className="insr-stat-label">Bolsas recolhidas</span>
            <div className="insr-stat-icon insr-icon-amber">
              <i className="ti ti-flask" aria-hidden="true" />
            </div>
          </div>
          <span className="insr-stat-value">{totalBolsasGeral}</span>
          <span className="insr-stat-sub">Total nacional</span>
        </div>

        <div className="insr-stat-card">
          <div className="insr-stat-top">
            <span className="insr-stat-label">Relatórios no histórico</span>
            <div className="insr-stat-icon insr-icon-green">
              <i className="ti ti-history" aria-hidden="true" />
            </div>
          </div>
          <span className="insr-stat-value">{historico.length}</span>
          <span className="insr-stat-sub">Submissões anteriores</span>
        </div>
      </div>

      {/* TABS + FILTROS */}
      <div className="insr-controls">
        <div className="insr-tabs">
          <button
            className={`insr-tab ${filtroView === "atuais" ? "insr-tab-active" : ""}`}
            onClick={() => setFiltroView("atuais")}
          >
            <i className="ti ti-bookmark" aria-hidden="true" />
            Actuais
            <span className="insr-tab-badge">{atuais.length}</span>
          </button>
          <button
            className={`insr-tab ${filtroView === "historico" ? "insr-tab-active" : ""}`}
            onClick={() => setFiltroView("historico")}
          >
            <i className="ti ti-history" aria-hidden="true" />
            Histórico
            <span className="insr-tab-badge">{historico.length}</span>
          </button>
          <button
            className={`insr-tab ${filtroView === "todos" ? "insr-tab-active" : ""}`}
            onClick={() => setFiltroView("todos")}
          >
            <i className="ti ti-list" aria-hidden="true" />
            Todos
            <span className="insr-tab-badge">{relatorios.length}</span>
          </button>
        </div>

        <div className="insr-filtros">
          <div className="insr-search">
            <i className="ti ti-search" aria-hidden="true" />
            <input
              type="text"
              placeholder="Procurar hospital..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        <select
  value={filtroProvincia}
  onChange={(e) => setFiltroProvincia(e.target.value)}
  className="insr-select"
  title="Filtrar por província"
  aria-label="Filtrar por província"
>
            <option value="">Todas as províncias</option>
            {provincias.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* LISTA */}
      {listaFiltrada.length === 0 ? (
        <div className="insr-empty">
          <i className="ti ti-file-off" aria-hidden="true" />
          <span>Nenhum relatório encontrado</span>
        </div>
      ) : (
        <div className="insr-grid">
          {listaFiltrada.map((r) => (
            <div
              key={r.id}
              className={`insr-card ${filtroView !== "historico" && atuais.some(a => a.id === r.id) ? "insr-card-atual" : ""}`}
              onClick={() => setSelecionado(r)}
            >
              <div className="insr-card-header">
                <div className="insr-card-hospital-info">
                  <div className="insr-card-avatar">{getIniciais(r.hospital_nome)}</div>
                  <div>
                    <div className="insr-card-hospital-nome">{r.hospital_nome}</div>
                    <div className="insr-card-local">
                      <i className="ti ti-map-pin" aria-hidden="true" />
                      {r.municipio}, {r.provincia}
                    </div>
                  </div>
                </div>
                {atuais.some(a => a.id === r.id) ? (
                  <span className="insr-badge-atual">
                    <i className="ti ti-circle-check" aria-hidden="true" />
                    Actual
                  </span>
                ) : (
                  <span className="insr-badge-historico">
                    <i className="ti ti-clock" aria-hidden="true" />
                    Histórico
                  </span>
                )}
              </div>

              <div className="insr-card-stats">
                <div className="insr-card-stat">
                  <span className="insr-card-stat-value">{r.total_doacoes}</span>
                  <span className="insr-card-stat-label">Doações</span>
                </div>
                <div className="insr-card-stat">
                  <span className="insr-card-stat-value">{r.total_doadores_unicos}</span>
                  <span className="insr-card-stat-label">Doadores</span>
                </div>
                <div className="insr-card-stat">
                  <span className="insr-card-stat-value">{r.total_bolsas}</span>
                  <span className="insr-card-stat-label">Bolsas</span>
                </div>
              </div>

              {r.doador_mais_ativo_nome && (
                <div className="insr-card-destaque">
                  <i className="ti ti-trophy" aria-hidden="true" />
                  <span>
                    <strong>{r.doador_mais_ativo_nome}</strong> — {r.doador_mais_ativo_doacoes} doações
                  </span>
                </div>
              )}

              <div className="insr-card-footer">
                <span className="insr-card-data">
                  <i className="ti ti-calendar-event" aria-hidden="true" />
                  Enviado em {formatarData(r.enviado_em)}
                </span>
                <span className="insr-card-autor">por {r.criado_por_nome}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL DETALHE */}
      {selecionado && (
        <div className="insr-modal-overlay" onClick={() => setSelecionado(null)}>
          <div className="insr-modal" onClick={(e) => e.stopPropagation()}>
            <div className="insr-modal-header">
              <div>
                <h2>{selecionado.hospital_nome}</h2>
                <p>{selecionado.municipio}, {selecionado.provincia}</p>
              </div>
            <button
  className="insr-modal-close"
  onClick={() => setSelecionado(null)}
  title="Fechar"
  aria-label="Fechar"
>
  <i className="ti ti-x" aria-hidden="true" />
</button>
            </div>

            <div className="insr-modal-meta">
              <i className="ti ti-clock" aria-hidden="true" />
              Enviado em {formatarDataHora(selecionado.enviado_em)} por {selecionado.criado_por_nome}
            </div>

            <div className="insr-modal-stats">
              <div className="insr-modal-stat">
                <i className="ti ti-droplet" aria-hidden="true" />
                <span className="insr-modal-stat-value">{selecionado.total_doacoes}</span>
                <span className="insr-modal-stat-label">Total de doações</span>
              </div>
              <div className="insr-modal-stat">
                <i className="ti ti-test-pipe" aria-hidden="true" />
                <span className="insr-modal-stat-value">{selecionado.total_exames}</span>
                <span className="insr-modal-stat-label">Exames concluídos</span>
              </div>
              <div className="insr-modal-stat">
                <i className="ti ti-users" aria-hidden="true" />
                <span className="insr-modal-stat-value">{selecionado.total_doadores_unicos}</span>
                <span className="insr-modal-stat-label">Doadores únicos</span>
              </div>
              <div className="insr-modal-stat">
                <i className="ti ti-flask" aria-hidden="true" />
                <span className="insr-modal-stat-value">{selecionado.total_bolsas}</span>
                <span className="insr-modal-stat-label">Bolsas recolhidas</span>
              </div>
            </div>

            {selecionado.doador_mais_ativo_nome && (
              <div className="insr-modal-destaque">
                <i className="ti ti-trophy" aria-hidden="true" />
                <div>
                  <div className="insr-modal-destaque-label">Doador mais activo</div>
                  <div className="insr-modal-destaque-nome">
                    {selecionado.doador_mais_ativo_nome} — {selecionado.doador_mais_ativo_doacoes} doações
                  </div>
                </div>
              </div>
            )}

            <div className="insr-modal-periodo">
              <i className="ti ti-calendar-stats" aria-hidden="true" />
              Período: {formatarData(selecionado.periodo_inicio)} — {formatarData(selecionado.periodo_fim)}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}