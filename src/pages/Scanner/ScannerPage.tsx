import { useState } from "react";
import QRScanner from "../../components/Scanner/QRScanner";
import ResultadoModal from "../../components/Scanner/ResultadoModal";
import "./ScannerPage.css";
import type { Solicitacao } from "../../types/Solicitacao";

type TipoQR = "EXAME" | "DOACAO" | null;

export default function ScannerPage() {
  const [solicitacao, setSolicitacao] = useState<Solicitacao | null>(null);
  const [tipoQR, setTipoQR] = useState<TipoQR>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const handleScan = async (token_qr: string) => {
    if (loading || modalOpen) return;

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const body = JSON.stringify({ token_qr });

      // Tenta primeiro como exame
      const resExame = await fetch("${import.meta.env.VITE_API_URL}/api/exames/validar-qr", {
        method: "POST",
        headers,
        body,
      });

      if (resExame.ok) {
        const data = await resExame.json();
        setSolicitacao({ ...data.solicitacao, _tipo: "EXAME" });
        setTipoQR("EXAME");
        setModalOpen(true);
        return;
      }

      // Tenta como doação
      const resDoacao = await fetch("${import.meta.env.VITE_API_URL}/api/doacoes/validar-qr", {
        method: "POST",
        headers,
        body,
      });

      if (resDoacao.ok) {
        const data = await resDoacao.json();
        setSolicitacao({ ...data.solicitacao, _tipo: "DOACAO" });
        setTipoQR("DOACAO");
        setModalOpen(true);
        return;
      }

      // Ambos falharam — mostra erro
      const errData = await resDoacao.json();
      throw new Error(errData.message || "QR inválido ou não reconhecido.");

    } catch (err: any) {
      // Vibração de erro
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      setError(err.message);

      // Limpa erro após 4 segundos
      setTimeout(() => setError(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (refetch?: boolean) => {
    setModalOpen(false);
    setSolicitacao(null);
    setTipoQR(null);
    if (refetch) {
      // Recarrega a página de solicitações se necessário
      window.dispatchEvent(new Event("refetch-solicitacoes"));
    }
  };

  return (
    <div className="scanner-page">

      <div className="scanner-header">
        <h2 className="scanner-title">Escanear QR Code</h2>
        <p className="scanner-sub">
          Posicione o QR Code do doador dentro da área de leitura
        </p>
      </div>

      <QRScanner onScan={handleScan} />

      {loading && (
        <div className="scanner-loading">
          <div className="scanner-spinner" />
          <span>A validar QR Code...</span>
        </div>
      )}

      {error && (
        <div className="scanner-error">
          <span className="scanner-error-icon">⚠</span>
          <span>{error}</span>
        </div>
      )}

      {modalOpen && solicitacao && tipoQR && (
        <ResultadoModal
          solicitacao={solicitacao}
          tipo={tipoQR}
          onClose={handleClose}
        />
      )}

    </div>
  );
}