import "./PerfilCard.css";

interface Acao {
  label: string;
  sublabel?: string;
  icon: string;
  onClick: () => void;
}

interface PerfilCardProps {
  titulo: string;
  descricao: string;
  icone?: React.ReactNode;
  acoes: Acao[];
}

export default function PerfilCard({ titulo, descricao, icone, acoes }: PerfilCardProps) {
  return (
    <div className="perfil-card">
      <div className="perfil-card-header">
        {icone && <div className="perfil-card-icon">{icone}</div>}
        <div>
          <h2>{titulo}</h2>
          <p>{descricao}</p>
        </div>
      </div>

      <div className="perfil-card-acoes">
        {acoes.map((acao, index) => (
          <>
            {index > 0 && <div key={`div-${index}`} className="perfil-acao-divider" />}
            <button
              key={index}
              className="perfil-acao"
              onClick={acao.onClick}
            >
              <div className="perfil-acao-left">
                <i className={`ti ${acao.icon} perfil-acao-icon`} aria-hidden="true" />
                <div>
                  <span className="perfil-acao-label">{acao.label}</span>
                  {acao.sublabel && (
                    <span className="perfil-acao-sublabel">{acao.sublabel}</span>
                  )}
                </div>
              </div>
              <i className="ti ti-chevron-right perfil-acao-arrow" aria-hidden="true" />
            </button>
          </>
        ))}
      </div>
    </div>
  );
}