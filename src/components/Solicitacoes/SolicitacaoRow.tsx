import "./SolicitacaoRow.css";

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
  solicitacao: Solicitacao;
}

function getStatusConfig(status: string) {
  switch (status.toUpperCase()) {
    case "PENDENTE":
      return { label: "Pendente", classe: "sol-status-pendente" };
    case "CONCLUIDO":
      return { label: "Concluído", classe: "sol-status-concluido" };
    case "EXPIRADO":
      return { label: "Expirado", classe: "sol-status-expirado" };
    case "CONFIRMADA":
      return { label: "Confirmada", classe: "sol-status-concluido" };
    case "CANCELADA":
      return { label: "Cancelada", classe: "sol-status-expirado" };
    default:
      return { label: status, classe: "" };
  }
}

function getTipoConfig(tipo?: string) {
  switch (tipo) {
    case "DOACAO":
      return { label: "Doação", classe: "sol-tipo-doacao", icon: "🩸" };
    default:
      return { label: "Exame", classe: "sol-tipo-exame", icon: "🔬" };
  }
}

function getIniciais(nome: string) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function formatarData(data: string) {
  return new Date(data).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function SolicitacaoRow({ solicitacao }: Props) {
  const statusConfig = getStatusConfig(solicitacao.status);
  const tipoConfig = getTipoConfig(solicitacao.tipo);

  return (
    <div className="sol-row">

      {/* DOADOR */}
      <div className="sol-row-doador">
        <div className="sol-row-avatar">
          {getIniciais(solicitacao.nome)}
        </div>
        <div className="sol-row-info">
          <span className="sol-row-nome">{solicitacao.nome}</span>
          <span className="sol-row-email">{solicitacao.email}</span>
        </div>
      </div>

      {/* CÓDIGO */}
      <div className="sol-row-cell">
        <span className="sol-row-codigo">
          {solicitacao.codigo_solicitacao}
        </span>
      </div>

      {/* TIPO */}
      <div className="sol-row-cell">
        <span className={`sol-tipo-badge ${tipoConfig.classe}`}>
          {tipoConfig.icon} {tipoConfig.label}
        </span>
      </div>

      {/* STATUS */}
      <div className="sol-row-cell">
        <span className={`sol-status-badge ${statusConfig.classe}`}>
          {statusConfig.label}
        </span>
      </div>

      {/* DATA */}
      <div className="sol-row-cell">
        <span className="sol-row-data">
          {formatarData(solicitacao.criado_em)}
        </span>
      </div>

    </div>
  );
}