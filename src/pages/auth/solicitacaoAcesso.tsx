import GlassNavbar from "../../components/home/GlassNavbar";
import SolicitacaoCard from "../../components/auth/SolicitacaoCard";
import fundo from "../../assets/fundo.png";
import "./solicitacaoAcesso.css";

export default function SolicitacaoAcessoPage() {
  return (
    <div className="solicitacao-page">
      
      <GlassNavbar />

      <div
        className="solicitacao-background"
        style={{
          backgroundImage: `url(${fundo})`,
        }}
      >
        <div className="solicitacao-wrapper">
          <SolicitacaoCard />
        </div>
      </div>

    </div>
  );
}