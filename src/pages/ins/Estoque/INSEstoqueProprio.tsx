import { useEffect, useState } from "react";
import "./INSEstoqueProprio.css";

interface EstoqueTipo {
  tipo_sanguineo: string;
  quantidade: number;
}

function getStatus(qtd: number) {
  if (qtd < 10) return { label: "Crítico", classe: "critico", emoji: "🔴" };
  if (qtd < 20) return { label: "Baixo",   classe: "baixo",   emoji: "🟡" };
  return           { label: "Normal",  classe: "normal",  emoji: "🟢" };
}

export default function INSEstoqueProprio() {
  const [dados, setDados]     = useState<EstoqueTipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro]       = useState("");

  const fetchEstoque = async () => {
    try {
      setLoading(true);
      setErro("");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ins/estoque-ins`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Erro ao carregar estoque");
      setDados(json.data || []);
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEstoque(); }, []);

  const total = dados.reduce((acc, d) => acc + d.quantidade, 0);

  return (
    <div className="ins-proprio-container">

      <div className="ins-proprio-header">
        <div>
          <h1>Estoque do INS</h1>
          <p>Níveis de estoque sanguíneo do Instituto Nacional de Sangue</p>
        </div>
        <button className="ins-proprio-refresh" onClick={fetchEstoque}>
          <i className="ti ti-refresh" /> Actualizar
        </button>
      </div>

      <div className="ins-proprio-info-box">
        Total em stock: <strong>{total} bolsas</strong>
      </div>

      {erro && <p className="ins-proprio-erro">{erro}</p>}

      {loading ? (
        <p className="ins-proprio-loading">A carregar...</p>
      ) : (
        <div className="ins-proprio-table">
          <div className="ins-proprio-table-header">
            <span>Tipo</span>
            <span>Quantidade de Bolsas</span>
            <span>Status</span>
          </div>

          {dados.map((item, index) => {
            const status = getStatus(item.quantidade);
            return (
              <div key={index} className="ins-proprio-table-row">
                <span className="ins-proprio-tipo">{item.tipo_sanguineo}</span>
                <span className="ins-proprio-qtd">{item.quantidade}</span>
                <span className={`ins-proprio-status ${status.classe}`}>
                  {status.emoji} {status.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div className="ins-proprio-legenda">
        <span>🔴 Crítico — abaixo de 10</span>
        <span>🟡 Baixo — abaixo de 20</span>
        <span>🟢 Normal — 20 ou mais</span>
      </div>

    </div>
  );
}
