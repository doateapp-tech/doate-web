import { useNavigate } from "react-router-dom";
import "./PerfisHome.css";
import PerfilCard from "../../../../components/perfis/PerfilCard";
import { FaUserMd, FaBoxes } from "react-icons/fa";

export default function PerfisHome() {
  const navigate = useNavigate();

  return (
    <div className="perfis-container">
      <div className="perfis-header">
        <h1>Gestão de perfis</h1>
        <p>Gerencie os perfis do hospital, incluindo secretários e responsáveis de stock.</p>
      </div>

      <div className="perfis-grid">
        <PerfilCard
          titulo="Secretários"
          descricao="Validação de doações e gestão clínica"
          icone={<FaUserMd />}
          acoes={[
            {
              label: "Criar secretário",
              sublabel: "Enviar convite por e-mail",
              icon: "ti-user-plus",
              onClick: () => navigate("/hospital/perfis/secretarios/criar"),
            },
            {
              label: "Listar secretários",
              sublabel: "Editar e eliminar",
              icon: "ti-users",
              onClick: () => navigate("/hospital/perfis/secretarios"),
            },
          ]}
        />

        <PerfilCard
          titulo="Responsável de stock"
          descricao="Gestão do stock de sangue e alertas"
          icone={<FaBoxes />}
          acoes={[
            {
              label: "Criar responsável",
              sublabel: "Enviar convite por e-mail",
              icon: "ti-user-plus",
              onClick: () => navigate("/hospital/perfis/estoque/criar"),
            },
            {
              label: "Listar responsáveis",
              sublabel: "Editar e eliminar",
              icon: "ti-users",
              onClick: () => navigate("/hospital/perfis/estoque"),
            },
          ]}
        />
      </div>
    </div>
  );
}