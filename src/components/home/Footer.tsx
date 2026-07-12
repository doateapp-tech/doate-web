import "./Footer.css";
import logo from "../../assets/logo.png";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-top">

        {/* COLUNA 1 — LOGO */}
        <div className="footer-col footer-brand">
          <div className="footer-logo">
            <img src={logo} alt="Doate" className="footer-logo-img" />
            <span>DOATE</span>
          </div>
          <p>Doar sangue é um ato de amor que não custa nada, mas vale uma vida inteira.</p>
          <div className="footer-social">
            <a href="#">f</a>
            <a href="#">in</a>
            <a href="#">𝕏</a>
          </div>
        </div>

        {/* COLUNA 2 — LINKS RÁPIDOS */}
        <div className="footer-col">
          <h4>Links rápidos</h4>
          <ul>
            <li><a href="/home">Início</a></li>
            <li><a href="#galeria">Galeria</a></li>
            <li><a href="#parceiros">Parceiros</a></li>
            <li><a href="#">Como Funciona</a></li>
            <li><a href="#">Solicitar acesso</a></li>
<li id="baixar-app">
  <a
    href="https://github.com/doateapp-tech/doate-mobile/releases/download/v1.0.0/application-b5efc36b-e046-4995-a214-3b0e38b403c7.apk"
    target="_blank"
    rel="noopener noreferrer"
    className="download-link"
  >
    Baixar App
  </a>
</li>
            <li><a href="#">Fale Conosco</a></li>
          </ul>
        </div>

        {/* COLUNA 3 — INFORMAÇÕES */}
        <div className="footer-col">
          <h4>Informações</h4>
          <ul>
            <li><a href="#">Como doar</a></li>
            <li><a href="#">Requisitos</a></li>
            <li><a href="#">Campanhas</a></li>
            <li><a href="#">Hospitais parceiros</a></li>
            <li><a href="#">Dúvidas frequentes</a></li>
          </ul>
        </div>

        {/* COLUNA 4 — CONTATO */}
        <div className="footer-col">
          <h4>Contato</h4>
          <ul className="footer-contato">
            <li>(+244) 955 444 777</li>
            <li>admindoate@gmail.com</li>
            <li>Seg à Sex das 8h às 17h</li>
          </ul>
        </div>

      </div>

      {/* RODAPÉ FINAL */}
      <div className="footer-bottom">
        <span>© 2025 DOATE. Todos os direitos reservados.</span>
        <div className="footer-amor">
           Dar vida para Salvar vidas.
        </div>
        <div className="footer-legal">
          <a href="#">Política de Privacidade</a>
          <a href="#">Termos de Uso</a>
        </div>
      </div>

    </footer>
  );
}