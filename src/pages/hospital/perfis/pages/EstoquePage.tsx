import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PerfilList from "../../../../components/perfis/PerfilList";
import "./SecretarioPage.css";

interface Perfil {
  id: number;
  nome: string;
  email: string;
  status?: "ativo" | "pendente";
}

export default function EstoquePage() {
  const [data, setData]       = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const navigate              = useNavigate();

  const fetchEstoque = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
`${import.meta.env.VITE_API_URL}/api/hospital/usuarios?tipo=ESTOQUE`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) throw new Error();

      const json = await res.json();
      setData(json);

    } catch {
      setError("Erro ao carregar responsáveis de estoque.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEstoque(); }, []);

  const handleRemove = async (id: number) => {
    try {
      setError("");

      const res = await fetch(
`${import.meta.env.VITE_API_URL}/api/hospital/usuarios/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) throw new Error();

      setData((prev) => prev.filter((item) => item.id !== id));

    } catch {
      setError("Erro ao remover responsável de estoque.");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Responsáveis de Estoque</h1>
          <p>Gerencie os responsáveis de estoque do hospital</p>
        </div>
        <button
          className="btn-voltar"
          onClick={() => navigate("/hospital/perfis")}
        >
          ← Voltar
        </button>
      </div>

      {error && <p className="page-error">{error}</p>}

      <PerfilList
        data={data}
        loading={loading}
        onRemove={handleRemove}
        emptyMessage="Nenhum responsável de estoque encontrado"
      />
    </div>
  );
}
