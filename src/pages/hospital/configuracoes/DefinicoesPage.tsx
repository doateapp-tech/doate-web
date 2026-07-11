import { useEffect, useState } from "react";
import "./DefinicoesPage.css";

interface Perfil {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  tipo_usuario: string;
  criado_em: string;
}

const roleLabel: Record<string, string> = {
  ADMIN:      "Administrador",
  SECRETARIO: "Secretário",
  ESTOQUE:    "Gestor de Estoque",
  INS_ADMIN:  "Administrador INS",
};

function getIniciais(nome: string) {
  return nome.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
}

export default function DefinicoesPage() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  // Perfil
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);
  const [sucessoPerfil, setSucessoPerfil] = useState("");
  const [erroPerfil, setErroPerfil] = useState("");

  // Senha
  const [senhaActual, setSenhaActual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [salvandoSenha, setSalvandoSenha] = useState(false);
  const [sucessoSenha, setSucessoSenha] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [mostrarSenhas, setMostrarSenhas] = useState(false);

  const fetchPerfil = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/perfil`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPerfil(data.perfil);
      setNome(data.perfil.nome || "");
      setTelefone(data.perfil.telefone || "");
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPerfil(); }, []);

  const handleSalvarPerfil = async () => {
    try {
      setSalvandoPerfil(true);
      setErroPerfil("");
      setSucessoPerfil("");

      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/perfil`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome, telefone }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Actualiza localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...user, nome: data.usuario.nome }));

      setSucessoPerfil("Perfil actualizado com sucesso.");
      setTimeout(() => setSucessoPerfil(""), 3000);
    } catch (err: any) {
      setErroPerfil(err.message);
    } finally {
      setSalvandoPerfil(false);
    }
  };

  const handleAlterarSenha = async () => {
    try {
      setSalvandoSenha(true);
      setErroSenha("");
      setSucessoSenha("");

      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/perfil/senha`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          senha_actual: senhaActual,
          nova_senha: novaSenha,
          confirmar_senha: confirmarSenha,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSucessoSenha("Senha alterada com sucesso.");
      setSenhaActual("");
      setNovaSenha("");
      setConfirmarSenha("");
      setTimeout(() => setSucessoSenha(""), 3000);
    } catch (err: any) {
      setErroSenha(err.message);
    } finally {
      setSalvandoSenha(false);
    }
  };

  if (loading) return (
    <div className="def-page">
      <div className="def-loading">
        <div className="def-spinner" />
        <span>A carregar perfil...</span>
      </div>
    </div>
  );

  if (erro) return (
    <div className="def-page">
      <div className="def-erro">
        <i className="ti ti-alert-circle" aria-hidden="true" />
        <span>{erro}</span>
        <button onClick={fetchPerfil}>Tentar novamente</button>
      </div>
    </div>
  );

  return (
    <div className="def-page">

      {/* HEADER */}
      <div className="def-header">
        <div>
          <h1>Definições</h1>
          <p>Gerencie as informações da sua conta</p>
        </div>
      </div>

      {/* CARD PERFIL VISUAL */}
      <div className="def-perfil-card">
        <div className="def-avatar-grande">
          {getIniciais(perfil?.nome || "U")}
        </div>
        <div className="def-perfil-info">
          <span className="def-perfil-nome">{perfil?.nome}</span>
          <span className="def-perfil-email">{perfil?.email}</span>
          <span className="def-perfil-role">
            {roleLabel[perfil?.tipo_usuario || ""] || perfil?.tipo_usuario}
          </span>
        </div>
        <div className="def-perfil-meta">
          <span className="def-perfil-meta-label">Membro desde</span>
          <span className="def-perfil-meta-valor">
            {new Date(perfil?.criado_em || "").toLocaleDateString("pt-PT", {
              day: "2-digit", month: "long", year: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="def-grid">

        {/* EDITAR PERFIL */}
        <div className="def-card">
          <div className="def-card-header">
            <i className="ti ti-user-edit" aria-hidden="true" />
            <div>
              <div className="def-card-title">Informações pessoais</div>
              <div className="def-card-sub">Actualize o seu nome e contacto</div>
            </div>
          </div>

          <div className="def-form">
            <div className="def-field">
              <label>Nome completo</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome completo"
              />
            </div>

            <div className="def-field">
              <label>Email</label>
            <input
  type="email"
  value={perfil?.email || ""}
  disabled
  className="def-input-disabled"
  title="Email da conta"
  placeholder="Email da conta"
/>
              <span className="def-field-hint">O email não pode ser alterado</span>
            </div>

            <div className="def-field">
              <label>Telefone</label>
              <input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="Ex: 9XX XXX XXX"
              />
            </div>

            {erroPerfil && (
              <div className="def-alert def-alert-erro">
                <i className="ti ti-alert-circle" aria-hidden="true" />
                {erroPerfil}
              </div>
            )}
            {sucessoPerfil && (
              <div className="def-alert def-alert-sucesso">
                <i className="ti ti-circle-check" aria-hidden="true" />
                {sucessoPerfil}
              </div>
            )}

            <button
              className="def-btn-primary"
              onClick={handleSalvarPerfil}
              disabled={salvandoPerfil}
            >
              {salvandoPerfil ? "A guardar..." : "Guardar alterações"}
            </button>
          </div>
        </div>

        {/* ALTERAR SENHA */}
        <div className="def-card">
          <div className="def-card-header">
            <i className="ti ti-lock" aria-hidden="true" />
            <div>
              <div className="def-card-title">Segurança</div>
              <div className="def-card-sub">Altere a sua senha de acesso</div>
            </div>
          </div>

          <div className="def-form">
            <div className="def-field">
              <label>Senha actual</label>
              <input
                type={mostrarSenhas ? "text" : "password"}
                value={senhaActual}
                onChange={(e) => setSenhaActual(e.target.value)}
                placeholder="Senha actual"
              />
            </div>

            <div className="def-field">
              <label>Nova senha</label>
              <input
                type={mostrarSenhas ? "text" : "password"}
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            <div className="def-field">
              <label>Confirmar nova senha</label>
              <input
                type={mostrarSenhas ? "text" : "password"}
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Repita a nova senha"
              />
            </div>

            <label className="def-checkbox">
              <input
                type="checkbox"
                checked={mostrarSenhas}
                onChange={(e) => setMostrarSenhas(e.target.checked)}
              />
              Mostrar senhas
            </label>

            <div className="def-senha-regras">
              <span>A senha deve conter:</span>
              <ul>
                <li className={novaSenha.length >= 8 ? "ok" : ""}>
                  <i className={`ti ${novaSenha.length >= 8 ? "ti-circle-check" : "ti-circle"}`} />
                  Mínimo 8 caracteres
                </li>
                <li className={/[\d!@#$%^&*(),.?":{}|<>]/.test(novaSenha) ? "ok" : ""}>
                  <i className={`ti ${/[\d!@#$%^&*(),.?":{}|<>]/.test(novaSenha) ? "ti-circle-check" : "ti-circle"}`} />
                  Número ou símbolo
                </li>
                <li className={novaSenha === confirmarSenha && novaSenha !== "" ? "ok" : ""}>
                  <i className={`ti ${novaSenha === confirmarSenha && novaSenha !== "" ? "ti-circle-check" : "ti-circle"}`} />
                  Senhas coincidem
                </li>
              </ul>
            </div>

            {erroSenha && (
              <div className="def-alert def-alert-erro">
                <i className="ti ti-alert-circle" aria-hidden="true" />
                {erroSenha}
              </div>
            )}
            {sucessoSenha && (
              <div className="def-alert def-alert-sucesso">
                <i className="ti ti-circle-check" aria-hidden="true" />
                {sucessoSenha}
              </div>
            )}

            <button
              className="def-btn-primary"
              onClick={handleAlterarSenha}
              disabled={salvandoSenha || !senhaActual || !novaSenha || !confirmarSenha}
            >
              {salvandoSenha ? "A alterar..." : "Alterar senha"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}