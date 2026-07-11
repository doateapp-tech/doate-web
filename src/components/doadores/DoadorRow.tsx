import "./DoadorRow.css";

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
  doador: Doador;
}

function getNivelConfig(nivel: string | null) {
  switch (nivel) {
    case "OURO":
      return { emoji: "", label: "Ouro", classe: "nivel-ouro" };
    case "PRATA":
      return { emoji: "", label: "Prata", classe: "nivel-prata" };
    case "BRONZE":
      return { emoji: "", label: "Bronze", classe: "nivel-bronze" };
    default:
      return null;
  }
}

function getStatusConfig(status: string) {
  switch (status) {
    case "recente":
      return { label: "Recente", classe: "status-recente" };
    case "elegivel":
      return { label: "Elegível", classe: "status-elegivel" };
    case "inativo":
      return { label: "Inativo", classe: "status-inativo" };
    default:
      return { label: status, classe: "" };
  }
}

function formatarData(data: string | null) {
  if (!data) return "—";
  return new Date(data).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getIniciais(nome: string) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function DoadorRow({ doador }: Props) {
  const nivelConfig = getNivelConfig(doador.nivel);
  const statusConfig = getStatusConfig(doador.status);

  return (
    <div className="doador-row">

      {/* DOADOR */}
      <div className="doador-row-info">
        <div className="doador-avatar">
          {getIniciais(doador.nome)}
        </div>
        <div className="doador-detalhes">
          <span className="doador-nome">{doador.nome}</span>
          <span className="doador-email">{doador.email}</span>
        </div>
      </div>

      {/* CONTACTO */}
      <div className="doador-row-cell">
        <span className="doador-telefone">
          {doador.telefone || "—"}
        </span>
      </div>

      {/* TIPO SANGUÍNEO */}
      <div className="doador-row-cell">
        <span className="tipo-badge">
          {doador.tipo_sanguineo || "—"}
        </span>
      </div>

      {/* DOAÇÕES */}
      <div className="doador-row-cell">
        <span className="doacoes-count">
          {doador.total_doacoes}
        </span>
        <span className="doacoes-label">
          {doador.total_doacoes === 1 ? "doação" : "doações"}
        </span>
      </div>

      {/* NÍVEL */}
      <div className="doador-row-cell">
        {nivelConfig ? (
          <span className={`nivel-badge ${nivelConfig.classe}`}>
            {nivelConfig.emoji} {nivelConfig.label}
          </span>
        ) : (
          <span className="nivel-sem">—</span>
        )}
      </div>

      {/* ÚLTIMA DOAÇÃO */}
      <div className="doador-row-cell">
        <span className="ultima-doacao">
          {formatarData(doador.ultima_doacao)}
        </span>
      </div>

      {/* STATUS */}
      <div className="doador-row-cell">
        <span className={`status-badge ${statusConfig.classe}`}>
          {statusConfig.label}
        </span>
      </div>

    </div>
  );
}