import "./DashboardHospital.css";

export default function DashboardHospital() {
  return (
    <div className="dashboard-container">

      <div className="dashboard-header">
        <h1>Análises</h1>
        <p>Visão geral do desempenho do hospital</p>
      </div>

      <div className="dashboard-cards">

        <div className="dashboard-card">
          <h3>Total de Doações</h3>
          <p>1,245</p>
        </div>

        <div className="dashboard-card">
          <h3>Doações Hoje</h3>
          <p>32</p>
        </div>

        <div className="dashboard-card">
          <h3>Stock Atual</h3>
          <p>540 unidades</p>
        </div>

        <div className="dashboard-card alert">
          <h3>Alertas Ativos</h3>
          <p>3</p>
        </div>

      </div>

      <div className="dashboard-content">

        <div className="dashboard-box">
          <h3>Atividade Recente</h3>
          <p>Lista de eventos recentes do sistema...</p>
        </div>

        <div className="dashboard-box">
          <h3>Estatísticas</h3>
          <p>Gráficos virão aqui futuramente...</p>
        </div>

      </div>

    </div>
  );
}