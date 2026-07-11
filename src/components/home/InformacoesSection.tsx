import "./InformacoesSection.css";

export default function InformacoesSection() {
  return (
    <section id="informacoes" className="info-section">

      {/* ESQUERDA */}
      <div className="info-esquerda">
        <p className="section-tag">ℹ️ Informações</p>
        <h2>Tudo o que você precisa<br />saber <span className="destaque">para doar</span></h2>
        <p className="section-sub">
          Informações essenciais para uma doação segura,
          consciente e responsável.
        </p>
        <button className="btn-fale">Fale conosco →</button>

        {/* coração decorativo */}
        <div className="coracao">♡</div>
      </div>

      {/* CARD SOBRE A DOATE */}
      <div className="info-card">
        <div className="info-card-titulo">
          <span className="info-icon"></span>
          <strong>Sobre a DOATE</strong>
        </div>
        <p>
          A DOATE é uma plataforma que conecta doadores, hospitais e bancos
          de sangue, facilitando o acesso à informação e incentivando a
          doação de sangue.
        </p>
        <p style={{ marginTop: "12px" }}>
          Nosso objetivo é salvar vidas através da solidariedade e da tecnologia.
        </p>
      </div>

      {/* CARD INFORMAÇÕES RÁPIDAS */}
      <div className="info-card">
        <div className="info-card-titulo">
          <span className="info-icon"></span>
          <strong>Informações rápidas</strong>
        </div>
        <ul className="info-lista">
          <li><span></span> Como doar</li>
          <li><span></span> Requisitos para doação</li>
          <li><span></span> Campanhas ativas</li>
          <li><span></span> Hospitais parceiros</li>
          <li><span></span> Dúvidas frequentes</li>
        </ul>
      </div>

    </section>
  );
}