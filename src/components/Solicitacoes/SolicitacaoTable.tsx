import SolicitacaoRow from "./SolicitacaoRow";
import "./SolicitacaoTable.css";

interface Solicitacao {
  id: number;
  nome: string;
  email: string;
  codigo_solicitacao: string;
  status: string;
  criado_em: string;
  tipo?: "EXAME" | "DOACAO";
}

interface Props {
  solicitacoes: Solicitacao[];
  loading: boolean;
  tipo: "EXAME" | "DOACAO";
}

export default function SolicitacaoTable({ solicitacoes, loading, tipo }: Props) {
  if (loading) {
    return (
      <div className="sol-table-feedback">
        <div className="sol-table-spinner" />
        <span>A carregar solicitações...</span>
      </div>
    );
  }

  if (solicitacoes.length === 0) {
    return (
      <div className="sol-table-feedback">
        <span className="sol-table-empty-icon">
          {tipo === "EXAME" ? "🔬" : "🩸"}
        </span>
        <span>Nenhuma solicitação de {tipo === "EXAME" ? "exame" : "doação"} encontrada</span>
      </div>
    );
  }

  return (
    <div className="sol-table-container">
      <div className="sol-table-header">
        <span>Doador</span>
        <span>Código</span>
        <span>Tipo</span>
        <span>Estado</span>
        <span>Data</span>
      </div>

      <div className="sol-table-body">
        {solicitacoes.map((s) => (
          <SolicitacaoRow key={s.id} solicitacao={s} />
        ))}
      </div>
    </div>
  );
}