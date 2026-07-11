import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./GlassNavbar.css";
import logo from "../../assets/logo.png";

export default function GlassNavbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAnchorActive = (hash: string) => location.hash === hash;

  return (
    <nav className={`glass-navbar ${scrolled ? "scrolled" : ""}`}>

      <div className="logo-container">
        <img src={logo} alt="Doate Logo" className="logo-img" />
        <Link to="/home" className="logo-text">
          DOATE
        </Link>
      </div>

      <div className="nav-links">
        <Link
          to="/home"
          className={`nav-link ${location.pathname === "/home" && !location.hash ? "active" : ""}`}
        >
          Início
        </Link>

        
      <Link
  to="/home#informacoes"
  className={`nav-link ${isAnchorActive("#informacoes") ? "active" : ""}`}
>
  Informações
</Link>

<Link
  to="/home#galeria"
  className={`nav-link ${isAnchorActive("#galeria") ? "active" : ""}`}
>
  Galeria
</Link>

<Link
  to="/home#parceiros"
  className={`nav-link ${isAnchorActive("#parceiros") ? "active" : ""}`}
>
  Parceiros
</Link>
      </div>

      <div className="nav-actions">
        <Link
          to="/login"
          className={`login-btn ${location.pathname === "/login" ? "active" : ""}`}
          onClick={() => {
            if (location.pathname === "/login") {
              window.location.reload();
            }
          }}
        >
          Entrar
        </Link>

        <Link
          to="/solicitacaoAcesso"
          className={`register-btn ${location.pathname === "/solicitacaoAcesso" ? "active" : ""}`}
          onClick={() => {
            if (location.pathname === "/solicitacaoAcesso") {
              window.location.reload();
            }
          }}
        >
          Solicitar Acesso
        </Link>
      </div>

    </nav>
  );
}