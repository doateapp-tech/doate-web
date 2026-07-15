import { useEffect, useState } from "react";
import "./INSEstoque.css";

interface EstoqueHospital {
  hospital_nome: string;
  tipo_sanguineo: string;
  quantidade: number;
}

const TIPOS = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];

function getStatusClass(qtd: number) {
  if (qtd < 10) return "critico";
  if (qtd < 20) return "baixo";
  return "normal";
}

function getStatusLabel(qtd: number) {
  if (qtd < 10) return "🔴 Crítico";
  if (qtd < 20) return "🟡 Baixo";
  return "🟢 Normal";
}

export default function INSEstoque() {
  const [dados, setDados]       = useState<EstoqueHospital[]>([]);
  const [hospitais, setHospitais] = useState<string[]>([]);
  const [loading, setLoading]   = useState(true);
  const [erro, setErro]         = useState("");

  const fetchEstoque = async () => {
    try {
      setLoading(true);
      setErro("");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ins/estoque`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Erro ao carregar estoque");
      setDados(json.data || []);
      const nomes = [...new Set((json.data || []).map((x: EstoqueHospital) => x.hospital_nome))] as string[];
      setHospitais(nomes);
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEstoque(); }, []);

  const getQtd = (hospital: string, tipo: string) => {
    const item = dados.find(d => d.hospital_nome === hospital && d.tipo_sanguineo === tipo);
    return item ? item.quantidade : 0;
  };

  return (
    <div className="ins-estoque">

      <div className="ins-page-header">
        <div>
          <h1>Monitorização Nacional</h1>
          <p>Níveis de estoque sanguíneo por hospital em tempo real</p>
        </div>
        <button className="ins-btn-refresh" onClick={fetchEstoque}>
          <i className="ti ti-refresh" /> Actualizar
        </button>
      </div>

      {erro && <p className="ins-erro">{erro}</p>}

      {loading ? (
        <p className="ins-loading">A carregar...</p>
      ) : (
        <>
          <div className="ins-estoque-table">
            <div className="ins-estoque-header">
              <span>Hospital</span>
              {TIPOS.map(t => <span key={t}>{t}</span>)}
            </div>

            {hospitais.map(h => (
              <div key={h} className="ins-estoque-row">
                <span className="ins-hospital-nome">{h}</span>
                {TIPOS.map(t => {
                  const qtd = getQtd(h, t);
                  return (
                    <span key={t} className={`ins-qtd ${getStatusClass(qtd)}`}>
                      {qtd}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="ins-legenda">
            <span>🔴 Crítico — abaixo de 10</span>
            <span>🟡 Baixo — abaixo de 20</span>
            <span>🟢 Normal — 20 ou mais</span>
          </div>
        </>
      )}

    </div>
  );
}
