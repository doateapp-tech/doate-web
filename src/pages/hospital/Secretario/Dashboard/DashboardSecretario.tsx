import { useNavigate } from "react-router-dom";
import "./DashboardSecretario.css";
import ilustracao from "../../../../assets/pendente.png";

export default function DashboardSecretario() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-secretario">

      <div className="dashboard-header">
        <h1>Home</h1>

        <span className="date">
          {new Date().toLocaleDateString("pt-PT")}
        </span>
      </div>

      <div className="dashboard-content">

        <img src={ilustracao} alt="Visualizar tarefas" />

        <p
          className="cta"
          onClick={() => navigate("/hospital/secretario/solicitacoes")}
        >
          Visualizar tarefa do dia
        </p>

      </div>

    </div>
  );
}