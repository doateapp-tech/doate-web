import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./GlassNavbar.css";
import logo from "../../assets/logo.png";

export default function GlassNavbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fecha menu ao navegar
  useEffect(() => { setMenuOpen(false); }, [location]);

  const isAnchorActive = (hash: string) => location.hash === hash;

  return (
    <nav className={`glass-navbar ${scrolled ? "scrolled" : ""}`}>

      {/* LOGO */}
      <div className="logo-container">
        <img src={logo} alt="Doate Logo" className="logo-img" />
        <Link to="/home" className="logo-text">DOATE</Link>
      </div>

      {/* LINKS — desktop + mobile dropdown */}
      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
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

        {/* BOTÕES no menu mobile */}
        <div className="mobile-actions">
          <Link
            to="/login"
            className={`login-btn ${location.pathname === "/login" ? "active" : ""}`}
          >
            Entrar
          </Link>
          <Link
            to="/solicitacaoAcesso"
            className={`register-btn ${location.pathname === "/solicitacaoAcesso" ? "active" : ""}`}
          >
            Solicitar Acesso
          </Link>
        </div>
      </div>

      {/* BOTÕES desktop */}
      <div className="nav-actions">
        <Link
          to="/login"
          className={`login-btn ${location.pathname === "/login" ? "active" : ""}`}
        >
          Entrar
        </Link>
        <Link
          to="/solicitacaoAcesso"
          className={`register-btn ${location.pathname === "/solicitacaoAcesso" ? "active" : ""}`}
        >
          Solicitar Acesso
        </Link>
      </div>

      {/* HAMBURGUER */}
      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Abrir menu"
      >
        {menuOpen ? "✕" : "☰"}
      </button>

    </nav>
  );
}