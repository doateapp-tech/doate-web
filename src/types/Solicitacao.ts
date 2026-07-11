export interface Solicitacao {
  id: number;
  usuario_id: number;
  hospital_id: number;
  nome: string;
  email: string;
  codigo_solicitacao: string;
  token_qr: string;
  status: "PENDENTE" | "pendente" | "CONCLUIDO" | "confirmada" | "EXPIRADO" | "cancelada";
  expira_em: string;
  criado_em?: string;
  tipo_sanguineo?: string;
  tipo?: "VOLUNTARIA" | "ALERTA";
  _tipo?: "EXAME" | "DOACAO"; 
}