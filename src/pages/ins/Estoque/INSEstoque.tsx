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

export default function INSEstoque() {
  const [dados, setDados] = useState<EstoqueHospital[]>([]);
  const [hospitais, setHospitais] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("${import.meta.env.VITE_API_URL}/api/ins/estoque", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(r => r.json())
      .then(d => {
        setDados(d.data || []);
        const nomes = [...new Set((d.data || []).map((x: EstoqueHospital) => x.hospital_nome))] as string[];
        setHospitais(nomes);
      })
      .finally(() => setLoading(false));
  }, []);

  const getQtd = (hospital: string, tipo: string) => {
    const item = dados.find(d => d.hospital_nome === hospital && d.tipo_sanguineo === tipo);
    return item ? item.quantidade : 0;
  };

  return (
    <div className="ins-estoque">
      <div className="ins-page-header">
        <h1>Monitorização de Estoque</h1>
        <p>Níveis de estoque sanguíneo por hospital em tempo real</p>
      </div>

      {loading ? <p className="loading">A carregar...</p> : (
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
      )}

      <div className="ins-legenda">
        <span className="critico">🔴 Crítico — abaixo de 10</span>
        <span className="baixo">🟡 Baixo — abaixo de 20</span>
        <span className="normal">🟢 Normal</span>
      </div>
    </div>
  );
}