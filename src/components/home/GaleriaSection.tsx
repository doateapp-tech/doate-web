import "./GaleriaSection.css";
import mocaDoando from "../../assets/Moça a doar sangue.png";

const fotos = [
  { url: mocaDoando },
  { url: "" },
  { url: "" },
  { url: "" },
  { url: "" },
];

export default function GaleriaSection() {
  return (
    <section id="galeria" className="galeria-section">

      {/* TEXTO À ESQUERDA */}
      <div className="galeria-texto">
        <p className="section-tag">📷 Galeria</p>
        <h2>Momentos que <span className="destaque">transformam vidas</span></h2>
        <p className="section-sub">
          Conheça registros de campanhas, doações e ações que fazem
          a diferença todos os dias.
        </p>
        <button className="btn-galeria">Ver todas as fotos →</button>
      </div>

      {/* FOTOS À DIREITA */}
      <div className="galeria-grid">

        {/* foto grande à esquerda */}
        <img src={fotos[0].url} alt="foto 1" className="foto-grande" />

        {/* 4 fotos pequenas à direita */}
        <div className="galeria-pequenas">
          {fotos.slice(1).map((foto, i) => (
            foto.url
              ? <img key={i} src={foto.url} alt={`foto ${i + 2}`} className="foto-pequena" />
              : <div key={i} className="foto-placeholder" />
          ))}
        </div>

      </div>

    </section>
  );
}