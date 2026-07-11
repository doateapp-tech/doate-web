import { useNavigate } from "react-router-dom";
import "./DashboardEstoque.css";
import ilustracao from "../../../../assets/pendente.png";

export default function DashboardEstoque() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-estoque">

      {/* HEADER */}
      <div className="dashboard-header">
        <h1>Estoque</h1>

        <span className="date">
          {new Date().toLocaleDateString("pt-PT")}
        </span>
      </div>

      {/* CONTENT */}
      <div className="dashboard-content">

        <img src={ilustracao} alt="Gestão de estoque" />

        <p
          className="cta"
          onClick={() => navigate("/hospital/estoque/alertas")}
        >
          Ver alertas de estoque
        </p>

      </div>

    </div>
  );
}