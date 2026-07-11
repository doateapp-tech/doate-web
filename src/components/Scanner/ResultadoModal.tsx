import { useState } from "react";
import "./ResultadoModal.css";
import type { Solicitacao } from "../../types/Solicitacao";

interface Props {
  solicitacao: Solicitacao;
  tipo: "EXAME" | "DOACAO";
  onClose: (refetch?: boolean) => void;
}

const TIPOS_SANGUINEOS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function ResultadoModal({ solicitacao, tipo, onClose }: Props) {
  const [tipoSanguineo, setTipoSanguineo] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [nivelAtingido, setNivelAtingido] = useState("");

  const isDoacao = tipo === "DOACAO";

  const handleConfirmar = async () => {
    if (!isDoacao && !tipoSanguineo) {
      setErro("Seleccione o tipo sanguíneo antes de confirmar.");
      return;
    }

    try {
      setLoading(true);
      setErro("");

      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      if (isDoacao) {
        // Confirmar doação
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/doacoes/confirmar`, {
          method: "POST",
          headers,
          body: JSON.stringify({ token_qr: solicitacao.token_qr }),
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Erro ao confirmar doação");

        setNivelAtingido(result.nivel || "");
        setSucesso(true);

      } else {
        // Confirmar exame
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/exames/confirmar`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            token_qr: solicitacao.token_qr,
            tipo_sanguineo: tipoSanguineo,
          }),
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Erro ao confirmar exame");

        setSucesso(true);
      }

    } catch (error: any) {
      setErro(error.message || "Erro ao confirmar.");
    } finally {
      setLoading(false);
    }
  };

  // ESTADO SUCESSO
  if (sucesso) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-sucesso">
            <span className="modal-sucesso-icon">✓</span>

            {isDoacao ? (
              <>
                <h2>Doação confirmada</h2>
                <p>
                  A doação de <strong>{solicitacao.nome}</strong> foi registada
                  com sucesso.
                </p>
                {nivelAtingido && (
                  <div className="modal-nivel-badge">
                    🏆 Doador {nivelAtingido}
                  </div>
                )}
                <p className="modal-sucesso-sub">
                  O stock foi actualizado e o doador foi notificado.
                </p>
              </>
            ) : (
              <>
                <h2>Exame confirmado</h2>
                <p>
                  O tipo sanguíneo <strong>{tipoSanguineo}</strong> foi
                  registado para <strong>{solicitacao.nome}</strong>.
                </p>
              </>
            )}

            <button className="confirm" onClick={() => onClose(true)}>
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">

        {/* HEADER */}
        <div className="modal-header">
          <div className="modal-header-left">
            <span className={`modal-tipo-badge ${isDoacao ? "modal-tipo-doacao" : "modal-tipo-exame"}`}>
              {isDoacao ? "🩸 Doação" : "🔬 Exame"}
            </span>
            <h2>{isDoacao ? "Validar doação" : "Validar exame"}</h2>
          </div>
          <button className="modal-close" onClick={() => onClose()}>✕</button>
        </div>

        {/* INFO DO DOADOR */}
        <div className="modal-info">
          <div className="modal-info-row">
            <span className="modal-info-label">Nome</span>
            <span className="modal-info-valor">{solicitacao.nome}</span>
          </div>
          <div className="modal-info-row">
            <span className="modal-info-label">Email</span>
            <span className="modal-info-valor">{solicitacao.email}</span>
          </div>
          <div className="modal-info-row">
            <span className="modal-info-label">Código</span>
            <span className="modal-info-valor modal-codigo">
              {solicitacao.codigo_solicitacao}
            </span>
          </div>
          {isDoacao && solicitacao.tipo_sanguineo && (
            <div className="modal-info-row">
              <span className="modal-info-label">Tipo sanguíneo</span>
              <span className="modal-info-valor modal-tipo-sangue">
                {solicitacao.tipo_sanguineo}
              </span>
            </div>
          )}
          <div className="modal-info-row">
            <span className="modal-info-label">Expira às</span>
            <span className="modal-info-valor">
              {new Date(solicitacao.expira_em).toLocaleTimeString("pt-PT", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {/* TIPO SANGUÍNEO — só para exame */}
        {!isDoacao && (
          <div className="modal-field">
            <label htmlFor="tipoSanguineo">Tipo sanguíneo</label>
            <select
              id="tipoSanguineo"
              value={tipoSanguineo}
              onChange={(e) => {
                setTipoSanguineo(e.target.value);
                if (erro) setErro("");
              }}
            >
              <option value="">Seleccionar</option>
              {TIPOS_SANGUINEOS.map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>
        )}

        {/* AVISO DOAÇÃO */}
        {isDoacao && (
          <div className="modal-doacao-aviso">
            <span>🩸</span>
            <p>
              Confirme apenas após o doador ter efectuado a doação de sangue.
              O stock será actualizado automaticamente.
            </p>
          </div>
        )}

        {erro && <p className="modal-erro">{erro}</p>}

        {/* ACÇÕES */}
        <div className="modal-actions">
          <button className="cancel" onClick={() => onClose()} disabled={loading}>
            Cancelar
          </button>
          <button
            className="confirm"
            onClick={handleConfirmar}
            disabled={loading || (!isDoacao && !tipoSanguineo)}
          >
            {loading
              ? "A confirmar..."
              : isDoacao
              ? "Confirmar doação"
              : "Confirmar exame"}
          </button>
        </div>

      </div>
    </div>
  );
}