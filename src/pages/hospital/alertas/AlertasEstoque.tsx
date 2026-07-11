import { useEffect, useState } from "react";
import "./AlertasEstoque.css";

interface EstoqueItem {
  tipo?: string;
  tipo_sanguineo?: string;
  quantidade: number;
}

interface ToastState {
  message: string;
  type: "success" | "error";
}

export default function AlertasEstoque() {
  const [data, setData] = useState<EstoqueItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sendingTipo, setSendingTipo] = useState<string | null>(null);
  const [confirmTipo, setConfirmTipo] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const getStatus = (qtd: number) => {
    if (qtd < 10) return { label: "🔴 Crítico", class: "critico" };
    if (qtd < 20) return { label: "🟡 Baixo",   class: "baixo"   };
    return           { label: "🟢 Normal",  class: "normal"  };
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchEstoque = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("${import.meta.env.VITE_API_URL}/api/estoque", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.message || "Erro ao carregar estoque");

      setData(json.data); //

    } catch (err: any) {
      setError(err.message || "Erro ao carregar estoque");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstoque();
  }, []);

  const handleEmitirAlerta = async (tipo: string) => {
    try {
      setSendingTipo(tipo);
      setConfirmTipo(null);

      const res = await fetch("${import.meta.env.VITE_API_URL}/api/alertas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ tipo_sanguineo: tipo }),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.message || "Erro ao enviar alerta");

      showToast(
        `Alerta emitido para ${tipo} — ${json.total_enviados ?? 0} doador(es) notificado(s)`,
        "success"
      );

    } catch (err: any) {
      showToast(err.message || "Erro ao emitir alerta", "error");
    } finally {
      setSendingTipo(null);
    }
  };

  return (
    <div className="alertas-container">

      {/* TOAST */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      {confirmTipo && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Emitir Alerta</h3>
            <p>
              Deseja notificar os doadores compatíveis com{" "}
              <strong>{confirmTipo}</strong>?
            </p>
            <div className="modal-actions">
              <button
                className="btn-cancelar"
                onClick={() => setConfirmTipo(null)}
              >
                Cancelar
              </button>
              <button
                className="btn-confirmar"
                onClick={() => handleEmitirAlerta(confirmTipo)}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="alertas-header">
        <div>
          <h1>Alertas de Estoque</h1>
          <p>Monitore os níveis e envie alertas para doadores compatíveis</p>
        </div>
      </div>

      <div className="info-box">
         Os alertas serão enviados para doadores compatíveis com o tipo sanguíneo seleccionado
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="loading">Carregando estoque...</p>
      ) : (
        <div className="alertas-table">

          <div className="table-header">
            <span>Tipo</span>
            <span>Quantidade</span>
            <span>Status</span>
            <span>Ação</span>
          </div>

      {data.map((item, index) => {
  const tipoLabel = item.tipo || item.tipo_sanguineo || "—";
  const status = getStatus(item.quantidade);

  return (
    <div key={index} className="table-row">
      <span className="tipo">{tipoLabel}</span>
      <span>{item.quantidade}</span>
      <span className={`status ${status.class}`}>
        {status.label}
      </span>
    <span>
  {status.class !== "normal" ? (
    <button
      className="btn-alerta"
      disabled={sendingTipo === tipoLabel}
      onClick={() => setConfirmTipo(tipoLabel)}
    >
      {sendingTipo === tipoLabel ? "Enviando..." : "Emitir alerta"}
    </button>
  ) : (
    <button className="btn-alerta btn-alerta-disabled" disabled>
      Emitir alerta
    </button>
  )}
</span>
    </div>
  );
})}

        </div>
      )}

    </div>
  );
}