import "./PerfilList.css";

interface Perfil {
  id: number;
  nome: string;
  email: string;
  status?: "ativo" | "pendente";
}

interface PerfilListProps {
  data: Perfil[];
  loading?: boolean;
  onRemove?: (id: number) => void;
  emptyMessage?: string;
}

export default function PerfilList({
  data,
  loading = false,
  onRemove,
  emptyMessage = "Nenhum perfil encontrado",
}: PerfilListProps) {
  if (loading) {
    return <div className="perfil-list-state">Carregando perfis...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="perfil-list-state">{emptyMessage}</div>;
  }

  return (
    <div className="perfil-list-container">

      <div className="perfil-list">
        {data.map((perfil) => (
          <div key={perfil.id} className="perfil-item">

            {/* INFO */}
            <div className="perfil-info">
              <span className="perfil-nome">{perfil.nome}</span>
              <span className="perfil-email">{perfil.email}</span>
            </div>

            {/* AÇÕES */}
            <div className="perfil-actions">

              <span className={`status ${perfil.status || "pendente"}`}>
                {perfil.status || "pendente"}
              </span>

              {onRemove && (
                <button
                  className="btn-remove"
                  onClick={() => onRemove(perfil.id)}
                >
                  Remover
                </button>
              )}

            </div>

          </div>
        ))}
      </div>

    </div>
  );
}