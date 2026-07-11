import { useState } from "react";
import {
  FaHospital,
  FaEnvelope,
  FaIdCard,
  FaMapMarkerAlt,
  FaPhone,
  FaCommentDots,
} from "react-icons/fa";
import "../../components/auth/SolicitacaoCard.css";
import logo from "../../assets/logo.png";

export default function SolicitacaoCard() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    email_admin: "",
    nif: "",
    provincia: "",
    municipio: "",
    telefone: "",
    mensagem: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const allowedDomains = ["hospital.com", "clinica.ao"];

  const getDomain = (email: string) => {
    if (!email || !email.includes("@")) return "";
    return email.split("@")[1].toLowerCase();
  };

  const validate = () => {
    let newErrors: any = {};

    const emailHospital = form.email.trim().toLowerCase();
    const emailAdmin = form.email_admin.trim().toLowerCase();

    const emailRegex = /^[a-z][a-z0-9._%+-]*@[^\s@]+\.[^\s@]+$/;

    if (!form.nome.trim()) {
      newErrors.nome = "Nome do hospital é obrigatório";
    }

    if (!emailHospital) {
      newErrors.email = "Email institucional é obrigatório";
    } else if (!emailRegex.test(emailHospital)) {
      newErrors.email = "Email inválido";
    }

    if (!emailAdmin) {
      newErrors.email_admin = "Email do administrador é obrigatório";
    } else if (!emailRegex.test(emailAdmin)) {
      newErrors.email_admin = "Email inválido";
    }

    if (!newErrors.email && !newErrors.email_admin) {
      const hospitalDomain = getDomain(emailHospital);
      const adminDomain = getDomain(emailAdmin);

      if (!allowedDomains.includes(hospitalDomain)) {
        newErrors.email =
          "Use um email institucional (ex: @hospital.com ou @clinica.ao)";
      }

      if (!allowedDomains.includes(adminDomain)) {
        newErrors.email_admin =
          "Use um email institucional (ex: @hospital.com ou @clinica.ao)";
      }

      if (emailHospital === emailAdmin) {
        newErrors.email_admin =
          "O email do administrador deve ser diferente do email do hospital";
      }

      if (hospitalDomain !== adminDomain) {
        newErrors.email_admin =
          "O administrador deve usar o mesmo domínio do hospital";
      }

      const localPart = emailAdmin.split("@")[0];

      if (localPart.length < 6) {
        newErrors.email_admin =
          "O email deve ter pelo menos 6 caracteres antes do @";
      }

      if (/^[0-9]/.test(localPart)) {
        newErrors.email_admin =
          "O email não pode começar com número";
      }

      if (/^[A-Z]/.test(localPart)) {
        newErrors.email_admin =
          "O email não pode começar com letra maiúscula";
      }
    }

    // NIF
    if (!form.nif.trim()) {
      newErrors.nif = "NIF é obrigatório";
    } else if (!/^\d{9}$/.test(form.nif)) {
      newErrors.nif = "NIF deve ter 9 dígitos";
    }

    // Localização
    if (!form.provincia.trim()) {
      newErrors.provincia = "Província é obrigatória";
    }

    if (!form.municipio.trim()) {
      newErrors.municipio = "Município é obrigatório";
    }

    // Telefone
    if (!form.telefone.trim()) {
      newErrors.telefone = "Telefone é obrigatório";
    } else if (!/^\d{9,}$/.test(form.telefone)) {
      newErrors.telefone = "Telefone inválido";
    }

    return newErrors;
  };

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    setSuccess("");

    try {
      const response = await fetch("${import.meta.env.VITE_API_URL}/api/solicitacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          nome: form.nome.trim(),
          email: form.email.trim().toLowerCase(),
          email_admin: form.email_admin.trim().toLowerCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao enviar solicitação");
      }

      setSuccess("Solicitação enviada com sucesso!");

      setForm({
        nome: "",
        email: "",
        email_admin: "",
        nif: "",
        provincia: "",
        municipio: "",
        telefone: "",
        mensagem: "",
      });

    } catch (error: any) {
      setErrors({ api: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card">
      <div className="card-header">
        <div className="login-logo">
          <img src={logo} alt="Doate Logo" />
        </div>

        <h2 className="login-title">
          Solicitar acesso ao sistema DOATE
        </h2>
      </div>

      <form className="login-form scroll-area" onSubmit={handleSubmit}>
       
        <div className="input-group">
          <FaHospital className="input-icon" />
          <input
            type="text"
            name="nome"
            placeholder="Nome do hospital"
            className="login-input"
            value={form.nome}
            onChange={handleChange}
          />
        </div>
        {errors.nome && <span className="error">{errors.nome}</span>}

        <div className="input-group">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            name="email"
            placeholder="Email institucional (hospital)"
            className="login-input"
            value={form.email}
            onChange={handleChange}
          />
        </div>
        {errors.email && <span className="error">{errors.email}</span>}

        <div className="input-group">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            name="email_admin"
            placeholder="Email do administrador"
            className="login-input"
            value={form.email_admin}
            onChange={handleChange}
          />
        </div>
        <small className="hint">
          Este será o acesso principal ao sistema (admin do hospital)
        </small>
        {errors.email_admin && (
          <span className="error">{errors.email_admin}</span>
        )}

        {/* NIF */}
        <div className="input-group">
          <FaIdCard className="input-icon" />
          <input
            type="text"
            name="nif"
            placeholder="NIF"
            className="login-input"
            value={form.nif}
            onChange={handleChange}
          />
        </div>
        {errors.nif && <span className="error">{errors.nif}</span>}

        {/* Província */}
        <div className="input-group">
          <FaMapMarkerAlt className="input-icon" />
          <input
            type="text"
            name="provincia"
            placeholder="Província"
            className="login-input"
            value={form.provincia}
            onChange={handleChange}
          />
        </div>
        {errors.provincia && <span className="error">{errors.provincia}</span>}

        {/* Município */}
        <div className="input-group">
          <FaMapMarkerAlt className="input-icon" />
          <input
            type="text"
            name="municipio"
            placeholder="Município"
            className="login-input"
            value={form.municipio}
            onChange={handleChange}
          />
        </div>
        {errors.municipio && <span className="error">{errors.municipio}</span>}

        {/* Telefone */}
        <div className="input-group">
          <FaPhone className="input-icon" />
          <input
            type="text"
            name="telefone"
            placeholder="Telefone"
            className="login-input"
            value={form.telefone}
            onChange={handleChange}
          />
        </div>
        {errors.telefone && <span className="error">{errors.telefone}</span>}

        {/* Mensagem */}
        <div className="input-group">
          <FaCommentDots className="input-icon" />
          <textarea
            name="mensagem"
            placeholder="Mensagem (opcional)"
            className="login-input"
            value={form.mensagem}
            onChange={handleChange}
          />
        </div>

        {errors.api && <span className="error">{errors.api}</span>}
        {success && <span className="success">{success}</span>}

        <button
          type="submit"
          className="login-button"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar solicitação"}
        </button>

        <div className="login-options">
          Sua solicitação será analisada pela nossa equipa.
        </div>

      </form>
    </div>
  );
}