import { useEffect, useState } from "react";
import DoadorTable from "../../../components/doadores/DoadorTable";
import "./DoadoresPage.css";

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

export default function DoadoresPage() {
  const [doadores, setDoadores] = useState<Doador[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [filtroNivel, setFiltroNivel] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");

  const fetchDoadores = async () => {
    try {
      setLoading(true);
      setErro("");

      const token = localStorage.getItem("token");

      const res = await fetch("${import.meta.env.VITE_API_URL}/api/doadores/hospital", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Erro ao carregar doadores");

      setDoadores(data.data || []);
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoadores();
  }, []);

  const doadoresFiltrados = doadores.filter((d) => {
    const matchBusca =
      d.nome.toLowerCase().includes(busca.toLowerCase()) ||
      d.email.toLowerCase().includes(busca.toLowerCase()) ||
      (d.telefone && d.telefone.includes(busca));

    const matchNivel = filtroNivel ? d.nivel === filtroNivel : true;
    const matchStatus = filtroStatus ? d.status === filtroStatus : true;

    return matchBusca && matchNivel && matchStatus;
  });

  return (
    <div className="doadores-page">

      <div className="doadores-header">
        <div>
          <h1>Doadores</h1>
          <p>Doadores com pelo menos uma doação confirmada neste hospital</p>
        </div>
        <div className="doadores-total">
          <span>{doadores.length}</span>
          <label>Total</label>
        </div>
      </div>

      <div className="doadores-filtros">
  <input
    type="text"
    placeholder="Pesquisar por nome, email ou telefone..."
    value={busca}
    onChange={(e) => setBusca(e.target.value)}
    className="filtro-busca"
    aria-label="Pesquisar doadores"
  />

  <select
    aria-label="Filtrar por nível"
    value={filtroNivel}
    onChange={(e) => setFiltroNivel(e.target.value)}
    className="filtro-select"
  >
    <option value="">Todos os níveis</option>
    <option value="BRONZE">Bronze</option>
    <option value="PRATA">Prata</option>
    <option value="OURO"> Ouro</option>
  </select>

  <select
    aria-label="Filtrar por status"
    value={filtroStatus}
    onChange={(e) => setFiltroStatus(e.target.value)}
    className="filtro-select"
  >
    <option value="">Todos os estados</option>
    <option value="recente">Recente</option>
    <option value="elegivel">Elegível</option>
    <option value="inativo">Inativo</option>
  </select>
</div>
      {erro && <p className="doadores-erro">{erro}</p>}

      <DoadorTable
        doadores={doadoresFiltrados}
        loading={loading}
      />

    </div>
  );
}