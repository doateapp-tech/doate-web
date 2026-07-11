import GlassNavbar from "../../components/home/GlassNavbar";
import LoginCard from "../../components/auth/LoginCard";
import fundo from "../../assets/fundo.png";
import "./login.css";

export default function LoginPage() {
  return (
    <div className="login-page">
      
      <GlassNavbar />

      <div
        className="login-background"
        style={{
          backgroundImage: `url(${fundo})`,
        }}
      >
        <div className="login-wrapper">
          <LoginCard />
        </div>
      </div>

    </div>
  );
}