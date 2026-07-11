import "./ParceirosSection.css";

const parceiros = [
  { nome: "Hospital B.E. De Carvalho", sigla: "HBC", cor: "#0066cc" },
  { nome: "Clínica Girassol",          sigla: "CG",  cor: "#f5a623" },
  { nome: "Hospital Josina Machel",    sigla: "HJM", cor: "#e5203a" },
  { nome: "Clínica Sagrada Esperança", sigla: "CSE", cor: "#2ecc71" },
  { nome: "Hospital São Lucas",        sigla: "HSL", cor: "#0066cc" },
  { nome: "Hospital Bom Jesus",        sigla: "HBJ", cor: "#e5203a" },
];

export default function ParceirosSection() {
  return (
    <section id="parceiros" className="parceiros-section">

      <div className="parceiros-header">
        <div>
          <p className="section-tag"> Parceiros</p>
          <h2>Hospitais e Instituições <span className="destaque">Parceiras</span></h2>
          <p className="section-sub">
            A DOATE conecta doadores e instituições comprometidas com a vida.
          </p>
        </div>

      </div>

      <div className="parceiros-grid">
        {parceiros.map((p) => (
          <div className="parceiro-card" key={p.nome}>
            <div className="parceiro-avatar" style={{ background: p.cor + "20", color: p.cor }}>
              {p.sigla}
            </div>
            <span className="parceiro-nome">{p.nome}</span>
          </div>
        ))}
      </div>

      <div className="parceiros-contador">
         +50 parceiros activos
      </div>

    </section>
  );
}