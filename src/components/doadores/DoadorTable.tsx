import DoadorRow from "./DoadorRow";
import "./DoadorTable.css";

interface Doador {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  tipo_sanguineo: string;
  total_doacoes: number;
  ultima_doacao: string | null;
  nivel: "BRONZE" | "PRATA" | "OURO" | null;
  status: "recente" | "elegivel" | "inativo";
}

interface Props {
  doadores: Doador[];
  loading: boolean;
}

export default function DoadorTable({ doadores, loading }: Props) {
  if (loading) {
    return (
      <div className="doador-table-feedback">
        <div className="doador-table-spinner" />
        <span>A carregar doadores...</span>
      </div>
    );
  }

  if (doadores.length === 0) {
    return (
      <div className="doador-table-feedback">
        <span className="doador-table-empty-icon">🩸</span>
        <span>Nenhum doador encontrado</span>
      </div>
    );
  }

  return (
    <div className="doador-table-container">
      <div className="doador-table-header">
        <span>Doador</span>
        <span>Contacto</span>
        <span>Tipo</span>
        <span>Doações</span>
        <span>Nível</span>
        <span>Última doação</span>
        <span>Estado</span>
      </div>

      <div className="doador-table-body">
        {doadores.map((doador) => (
          <DoadorRow key={doador.id} doador={doador} />
        ))}
      </div>
    </div>
  );
}