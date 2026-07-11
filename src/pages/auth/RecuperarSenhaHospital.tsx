import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "./RecuperarSenhaHospital.css";
import logo from "../../assets/logo.png";

type Passo = "email" | "codigo" | "senha";

export default function RecuperarSenhaHospital() {
  const navigate = useNavigate();
  const [passo, setPasso] = useState<Passo>("email");
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState<string[]>(["", "", "", "", "", ""]);
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [tempo, setTempo] = useState(60);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (passo !== "codigo" || tempo === 0) return;
    const timer = setTimeout(() => setTempo(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [tempo, passo]);

  function handleChangeCodigo(text: string, index: number) {
    if (!/^\d?$/.test(text)) return;
    const novo = [...codigo];
    novo[index] = text;
    setCodigo(novo);
    if (text && index < 5) inputsRef.current[index + 1]?.focus();
  }

  function handleBackspace(e: React.KeyboardEvent, index: number) {
    if (e.key === "Backspace" && codigo[index] === "" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  const handleEnviarCodigo = async () => {
    if (!email) { setErro("Introduza o seu email."); return; }
    try {
      setLoading(true);
      setErro("");
      const res = await fetch("${import.meta.env.VITE_API_URL}/api/auth/recuperar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setTempo(60);
      setCodigo(["", "", "", "", "", ""]);
      setPasso("codigo");
    } catch (err: any) {
      setErro(err.message || "Erro ao enviar código.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerificarCodigo = () => {
    if (codigo.join("").length !== 6) { setErro("Introduza o código completo."); return; }
    setErro("");
    setPasso("senha");
  };

  const handleRedefinirSenha = async () => {
    if (!novaSenha || !confirmarSenha) { setErro("Preencha todos os campos."); return; }
    if (novaSenha !== confirmarSenha) { setErro("As senhas não coincidem."); return; }
    if (novaSenha.length < 6) { setErro("A senha deve ter pelo menos 6 caracteres."); return; }
    try {
      setLoading(true);
      setErro("");
      const res = await fetch("${import.meta.env.VITE_API_URL}/api/auth/redefinir-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, codigo: codigo.join(""), novaSenha }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      navigate("/login");
    } catch (err: any) {
      setErro(err.message || "Erro ao redefinir senha.");
    } finally {
      setLoading(false);
    }
  };

  const handleReenviar = async () => {
    try {
      setTempo(60);
      setCodigo(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
      await fetch("${import.meta.env.VITE_API_URL}/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      setErro("Não foi possível reenviar o código.");
    }
  };

  return (
    <div className="rsh-page">
      <div className="rsh-card">

        {/* LOGO */}
        <div className="rsh-logo">
          <img src={logo} alt="Doate" />
        </div>

        {/* PASSOS */}
        <div className="rsh-passos">
          {(["email", "codigo", "senha"] as Passo[]).map((p, i) => (
            <div
              key={p}
              className={`rsh-passo-dot ${passo === p ? "activo" : ""}
                ${(passo === "codigo" && i === 0) || (passo === "senha" && i <= 1) ? "concluido" : ""}`}
            />
          ))}
        </div>

        {/* PASSO 1 — EMAIL */}
        {passo === "email" && (
          <>
            <div className="rsh-icon-wrapper">
              <FaEnvelope size={28} color="#E53935" />
            </div>
            <h2 className="rsh-titulo">Recuperar senha</h2>
            <p className="rsh-sub">
              Introduza o seu email e enviaremos um código de verificação.
            </p>
            {erro && <p className="rsh-erro">{erro}</p>}
            <div className="rsh-input-group">
              <FaEnvelope className="rsh-input-icon" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rsh-input"
              />
            </div>
            <button
              className="rsh-btn"
              onClick={handleEnviarCodigo}
              disabled={loading}
            >
              {loading ? "A enviar..." : "Enviar código"}
            </button>
            <button className="rsh-link-btn" onClick={() => navigate("/login")}>
              Voltar ao login
            </button>
          </>
        )}

        {/* PASSO 2 — CÓDIGO */}
        {passo === "codigo" && (
          <>
            <div className="rsh-icon-wrapper">
              <FaEnvelope size={28} color="#E53935" />
            </div>
            <h2 className="rsh-titulo">Verifique o seu email</h2>
            <p className="rsh-sub">
              Introduza o código de 6 dígitos enviado para <strong>{email}</strong>.
            </p>
            {erro && <p className="rsh-erro">{erro}</p>}
            <div className="rsh-codigo-container">
              {codigo.map((val, i) => (
                <input
                  key={i}
                  ref={el => { inputsRef.current[i] = el; }}
                  className="rsh-codigo-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleChangeCodigo(e.target.value, i)}
                  onKeyDown={(e) => handleBackspace(e, i)}
                />
              ))}
            </div>
            <button
              className="rsh-btn"
              onClick={handleVerificarCodigo}
              disabled={codigo.join("").length !== 6}
            >
              Verificar código
            </button>
            <button
              className={`rsh-link-btn ${tempo > 0 ? "rsh-link-disabled" : ""}`}
              onClick={tempo === 0 ? handleReenviar : undefined}
              disabled={tempo > 0}
            >
              {tempo > 0 ? `Reenviar código em ${tempo}s` : "Reenviar código"}
            </button>
          </>
        )}

        {/* PASSO 3 — NOVA SENHA */}
        {passo === "senha" && (
          <>
            <div className="rsh-icon-wrapper">
              <FaLock size={28} color="#E53935" />
            </div>
            <h2 className="rsh-titulo">Nova senha</h2>
            <p className="rsh-sub">Defina a sua nova palavra-passe de acesso.</p>
            {erro && <p className="rsh-erro">{erro}</p>}
            <div className="rsh-input-group">
              <FaLock className="rsh-input-icon" />
              <input
                type={mostrarSenha ? "text" : "password"}
                placeholder="Nova senha"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                className="rsh-input"
              />
              <span
                className="rsh-eye"
                onClick={() => setMostrarSenha(!mostrarSenha)}
              >
                {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="rsh-input-group">
              <FaLock className="rsh-input-icon" />
              <input
                type={mostrarSenha ? "text" : "password"}
                placeholder="Confirmar senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="rsh-input"
              />
            </div>
            <button
              className="rsh-btn"
              onClick={handleRedefinirSenha}
              disabled={loading}
            >
              {loading ? "A redefinir..." : "Redefinir senha"}
            </button>
          </>
        )}

      </div>
    </div>
  );
}