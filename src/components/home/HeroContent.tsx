import { Link } from "react-router-dom";
import "./HeroContent.css";

export default function HeroContent() {
  return (
    <div className="hero-content">

      <h1 className="hero-title">
        Doar sangue salva vidas
      </h1>
      <p className="hero-text">
        A doação é essencial para cirurgias, tratamentos de câncer e acidentes.
        Um pequeno gesto pode fazer uma enorme diferença na vida de alguém.
      </p>

      <div className="hero-buttons">
  <Link to="/home#baixar-app" className="primary-btn">
  Salvar Vidas
</Link>
<Link to="/home#informacoes" className="secondary-btn">
  Saber Mais
</Link>
      </div>

    </div>
  );
}