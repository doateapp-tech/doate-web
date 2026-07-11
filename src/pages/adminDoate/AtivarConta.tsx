import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./AtivarConta.css";

export default function AtivarConta() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nome, setNome] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validando, setValidando] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [touched, setTouched] = useState(false);

useEffect(() => {
  const validar = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/convites/${token}`);
      const data = await res.json();

      console.log("RESPOSTA CONVITE:", data); 

      if (!res.ok) throw new Error(data.message);

      setEmail(data.email);
    } catch {
      setError("Link inválido ou expirado");
    } finally {
      setValidando(false);
    }
  };

  validar();
}, [token]);

  const validarSenha = () => {
    if (!password) return "A senha é obrigatória";

    if (password.includes(" ")) {
      return "A senha não pode conter espaços";
    }

    if (password.length < 8) {
      return "A senha deve ter no mínimo 8 caracteres";
    }

    const hasNumberOrSymbol = /[\d!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasNumberOrSymbol) {
      return "A senha deve conter pelo menos um número ou símbolo";
    }

    return null;
  };

  const senhaErro = touched ? validarSenha() : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const erroSenha = validarSenha();

    if (erroSenha) {
      return setError(erroSenha);
    }

    if (password !== confirmPassword) {
      return setError("As senhas não coincidem");
    }

    try {
      setLoading(true);
      console.log("ENVIANDO EMAIL:", email); // ← antes do fetch

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/convites/ativar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
            email,
            nome,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccess("Conta ativada com sucesso!");

      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(err.message || "Erro ao ativar conta");
    } finally {
      setLoading(false);
    }
  };

  if (validando) {
    return <div className="ativar-container">Validando convite...</div>;
  }

  return (
    <div className="ativar-container">
      <form className="ativar-card" onSubmit={handleSubmit}>
        <h2>Ativar Conta</h2>

        <p className="subtitle">Conta será criada para:</p>
        <p className="email">{email}</p>
    
<input
  type="text"
  placeholder="Nome completo"
  value={nome}
  onChange={(e) => setNome(e.target.value)}
  required
/>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <div className="input-group">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setTouched(true);
            }}
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {touched && (
          <div className="password-rules">
            <p>A senha deve conter:</p>
            <ul>
              <li>• Mínimo 8 caracteres</li>
              <li>• Número ou símbolo</li>
              <li>• Sem espaços</li>
            </ul>
          </div>
        )}

        {senhaErro && <p className="error">{senhaErro}</p>}

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirmar senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button disabled={loading}>
          {loading ? "Ativando..." : "Ativar Conta"}
        </button>
      </form>
    </div>
  );
}