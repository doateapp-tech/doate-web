import { useEffect, useState } from "react";
import "./GestaoEstoque.css";

interface EstoqueItem {
  tipo: string;
  quantidade: number;
  atualizado_em: string | null;
}

const TIPOS_SANGUINEOS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function GestaoEstoque() {
  const [estoque, setEstoque] = useState<EstoqueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState<string | null>(null);
  const [valores, setValores] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchEstoque = async () => {
    try {
      setLoading(true);
      const res = await fetch("${import.meta.env.VITE_API_URL}/api/estoque", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      setEstoque(json.data);

      // popula os valores iniciais com os dados da BD
      const initial: Record<string, number> = {};
      json.data.forEach((item: EstoqueItem) => {
        initial[item.tipo] = item.quantidade;
      });
      setValores(initial);

    } catch (err: any) {
      showToast(err.message || "Erro ao carregar estoque", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstoque();
  }, []);

  const handleSalvar = async (tipo: string) => {
    const quantidade = valores[tipo];

    if (quantidade === undefined || quantidade < 0) {
      return showToast("Quantidade inválida", "error");
    }

    try {
      setSalvando(tipo);

      const res = await fetch("${import.meta.env.VITE_API_URL}/api/estoque", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ tipo_sanguineo: tipo, quantidade }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      // actualiza o estado local
      setEstoque(prev =>
        prev.map(item =>
          item.tipo === tipo
            ? { ...item, quantidade, atualizado_em: new Date().toISOString() }
            : item
        )
      );

      showToast(`${tipo} actualizado — ${quantidade} bolsa(s)`, "success");

    } catch (err: any) {
      showToast(err.message || "Erro ao actualizar", "error");
    } finally {
      setSalvando(null);
    }
  };

  const getStatusClass = (qtd: number) => {
    if (qtd < 10) return "critico";
    if (qtd < 20) return "baixo";
    return "normal";
  };

  const getStatusLabel = (qtd: number) => {
    if (qtd < 10) return "🔴 Crítico";
    if (qtd < 20) return "🟡 Baixo";
    return "🟢 Normal";
  };

  return (
    <div className="gestao-container">

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      <div className="gestao-header">
        <div>
          <h1>Gestão de Estoque</h1>
          <p>Actualize as quantidades de bolsas de sangue disponíveis</p>
        </div>
      </div>

      <div className="info-box">
        Insira a quantidade actual de bolsas para cada tipo sanguíneo.
        Os dados são actualizados em tempo real.
      </div>

      {loading ? (
        <p className="loading">A carregar estoque...</p>
      ) : (
        <div className="gestao-table">

          <div className="table-header">
            <span>Tipo</span>
            <span>Quantidade Actual</span>
            <span>Status</span>
            <span>Nova Quantidade</span>
            <span>Acção</span>
          </div>

          {TIPOS_SANGUINEOS.map((tipo) => {
            const item = estoque.find(e => e.tipo === tipo);
            const qtdActual = item?.quantidade ?? 0;
            const statusClass = getStatusClass(qtdActual);

            return (
              <div key={tipo} className="table-row">

                <span className="tipo-badge">{tipo}</span>

                <span className="quantidade-actual">{qtdActual} bolsa(s)</span>

                <span className={`status ${statusClass}`}>
                  {getStatusLabel(qtdActual)}
                </span>

                <span className="input-wrapper">
                 <input
  type="number"
  min={0}
  value={valores[tipo] ?? 0}
  placeholder="0"
  aria-label={`Quantidade de bolsas para ${tipo}`}
  onChange={(e) =>
    setValores(prev => ({
      ...prev,
      [tipo]: Number(e.target.value),
    }))
  }
  className="input-quantidade"
/>
                </span>

                <span>
                  <button
                    className="btn-salvar"
                    disabled={salvando === tipo}
                    onClick={() => handleSalvar(tipo)}
                  >
                    {salvando === tipo ? "A guardar..." : "Guardar"}
                  </button>
                </span>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}