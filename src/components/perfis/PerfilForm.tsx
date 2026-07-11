import { useState } from "react";
import "./PerfilForm.css";

interface PerfilFormProps {
  tipo: "SECRETARIO" | "ESTOQUE";
  onSubmit: (data: { nome: string; email: string; tipo: string }) => Promise<void> | void;
  loading?: boolean;
}

export default function PerfilForm({
  tipo,
  onSubmit,
  loading = false,
}: PerfilFormProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const tipoLabel =
    tipo === "SECRETARIO"
      ? "Secretário"
      : "Responsável de Estoque";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErro("");
    setSucesso("");

    const nomeTrim = nome.trim();
    const emailTrim = email.trim();

    if (!nomeTrim || !emailTrim) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    if (/\s/.test(emailTrim)) {
      setErro("O email não pode conter espaços.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailTrim)) {
      setErro("Insira um email válido.");
      return;
    }

    try {
      await onSubmit({
        nome: nomeTrim,
        email: emailTrim,
        tipo,
      });

      setSucesso(
        `${tipoLabel} criado com sucesso. Um convite foi enviado por email.`
      );

      setNome("");
      setEmail("");

    } catch (err: any) {
      setErro(err.message || "Erro ao criar perfil.");
    }
  };

  return (
    <div className="perfil-form-container">

      <div className="perfil-form-header">
        <h2>Criar {tipoLabel}</h2>
        <p>
          Preencha os dados abaixo para enviar um convite de acesso ao sistema.
        </p>
      </div>

      <form className="perfil-form" onSubmit={handleSubmit}>

        {/* NOME */}
        <div className="form-group">
          <label>Nome</label>
          <input
            type="text"
            placeholder="Ex: João Silva"
            value={nome}
            onChange={(e) => {
              setNome(e.target.value);
              if (erro) setErro("");
            }}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Ex: joao@hospital.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (erro) setErro("");
            }}
          />
        </div>

        {erro && <p className="form-error">{erro}</p>}
        {sucesso && <p className="form-success">{sucesso}</p>}

        {/* BOTÃO */}
        <button type="submit" disabled={loading}>
          {loading ? "A enviar convite..." : "Criar"}
        </button>

      </form>
    </div>
  );
}