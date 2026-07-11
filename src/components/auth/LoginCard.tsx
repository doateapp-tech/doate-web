import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "../../components/auth/LoginCard.css";
import logo from "../../assets/logo.png";

export default function LoginCard() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

           const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          senha: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro no login");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.usuario));

const { tipo_usuario, hospital_id } = data.usuario;

if (tipo_usuario === "ADMIN" && !hospital_id) {
  navigate("/adminDoate/solicitacoes");
}

else if (tipo_usuario === "ADMIN" && hospital_id) {
  navigate("/hospital/perfis");
}

else if (tipo_usuario === "SECRETARIO") {
  navigate("/hospital/secretario/dashboard");
}

else if (tipo_usuario === "ESTOQUE") {
  navigate("/hospital/estoque/dashboard");
}
else if (tipo_usuario === "INS_ADMIN") {
  navigate("/ins/dashboard");
}
else {
  navigate("/home");
}
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card">

      <div className="login-logo">
        <img src={logo} alt="Doate Logo" />
      </div>

      <h2 className="login-title">
        Seja bem-vindo de volta!
      </h2>

      <form className="login-form" onSubmit={handleLogin}>

        {error && <p className="error">{error}</p>}

        {/* EMAIL */}
        <div className="input-group">
          <FaUser className="input-icon" />

          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* SENHA */}
        <div className="input-group">
          <FaLock className="input-icon" />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
<div className="login-options">
  Esqueci a senha.{" "}
  <span onClick={() => navigate("/recuperar-senha")}>Recuperar</span>
</div>

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

      </form>
    </div>
  );
}