import { Routes, Route } from "react-router-dom";

import SplashPage from "../../pages/splash/SplashPage";
import HomePage from "../../pages/home/HomePage";
import LoginPage from "../../pages/auth/login";
import SolicitacaoAcessoPage from "../../pages/auth/solicitacaoAcesso";

import AdminLogin from "../../pages/adminDoate/AdminLogin";
import AdminLayout from "../../pages/adminDoate/AdminLayout";
import SolicitacoesPage from "../../pages/adminDoate/SolicitacoesPage";
import HospitaisPage from "../../pages/adminDoate/HospitaisPage";
import AtivarConta from "../../pages/adminDoate/AtivarConta";

import HospitalLayout from "../../components/hospital/Layout/HospitalLayout";

import DashboardEstoque from "../../pages/hospital/estoque/Dashboard/DashboardEstoque";
import DashboardSecretario from "../../pages/hospital/Secretario/Dashboard/DashboardSecretario";
import SolicitacoesSecretario from "../../pages/hospital/Secretario/Solicitacoes/SolicitacoesSecretario";

import PerfisHome from "../../pages/hospital/perfis/pages/PerfisHome";
import SecretarioPage from "../../pages/hospital/perfis/pages/SecretarioPage";
import EstoquePage from "../../pages/hospital/perfis/pages/EstoquePage";
import CriarSecretarioPage from "../../pages/hospital/perfis/pages/CriarSecretarioPage";
import CriarEstoquePage from "../../pages/hospital/perfis/pages/CriarEstoquePage";
import AlertasEstoque from "../../pages/hospital/alertas/AlertasEstoque";
import ScannerPage from "../../pages/Scanner/ScannerPage";
import GestaoEstoque from "../../pages/hospital/estoque/Gestao/GestaoEstoque";
import DoadoresPage from "../../pages/hospital/doadores/DoadoresPage";
import DoacoesPage from "../../pages/hospital/doacoes/DoacoesPage";
import SecretarioRelatoriosPage from "../../pages/hospital/Secretario/Relatorios/SecretarioRelatoriosPage";
import EstoqueRelatoriosPage from "../../pages/hospital/estoque/Relatorios/EstoqueRelatoriosPage";
import INSLayout        from "../../components/ins/Layout/INSLayout";
import INSDashboard     from "../../pages/ins/Dashboard/INSDashboard";
import INSHospitais     from "../../pages/ins/Hospitais/INSHospitais";
import INSEstoque       from "../../pages/ins/Estoque/INSEstoque";
import RelatoriosPage from "../../pages/hospital/relatorios/RelatoriosPage";
import INSRelatoriosPage from "../../pages/ins/relatorios/INSRelatoriosPage";
import DefinicoesPage from "../../pages/hospital/configuracoes/DefinicoesPage";
import PrivateRoute from "./PrivateRoute";
import RecuperarSenhaHospital from "../../pages/auth/RecuperarSenhaHospital";
import AdminDashboardPage from "../../pages/hospital/dashboard/AdminDashboardPage";
import INSEstoqueProprio from "../../pages/ins/Estoque/INSEstoqueProprio";

export default function AppRouter() {
  return (
    <Routes>

      <Route path="/" element={<SplashPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/recuperar-senha" element={<RecuperarSenhaHospital />} />
      <Route path="/solicitacaoAcesso" element={<SolicitacaoAcessoPage />} />
      <Route path="/ativar-conta/:token" element={<AtivarConta />} />

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/adminDoate"
        element={
          <PrivateRoute roles={["ADMIN"]}>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route path="solicitacoes" element={<SolicitacoesPage />} />
        <Route path="hospitais" element={<HospitaisPage />} />
      </Route>

      <Route
        path="/hospital"
        element={
          <PrivateRoute requireHospital>
            <HospitalLayout />
          </PrivateRoute>
        }
      >

    
        {/* PERFIS — ADMIN */}
        <Route path="perfis" element={<PrivateRoute roles={["ADMIN", "INS_ADMIN"]} requireHospital><PerfisHome /></PrivateRoute>} />
        <Route path="perfis/secretarios" element={<PrivateRoute roles={["ADMIN", "INS_ADMIN"]} requireHospital><SecretarioPage /></PrivateRoute>} />
        <Route path="perfis/secretarios/criar" element={<PrivateRoute roles={["ADMIN", "INS_ADMIN"]} requireHospital><CriarSecretarioPage /></PrivateRoute>} />
        <Route path="perfis/estoque" element={<PrivateRoute roles={["ADMIN", "INS_ADMIN"]} requireHospital><EstoquePage /></PrivateRoute>} />
        <Route path="perfis/estoque/criar" element={<PrivateRoute roles={["ADMIN", "INS_ADMIN"]} requireHospital><CriarEstoquePage /></PrivateRoute>} />

        {/* DOAÇÕES — partilhado entre ADMIN, SECRETARIO e ESTOQUE */}
        <Route
          path="doacoes"
          element={
            <PrivateRoute roles={["ADMIN", "SECRETARIO", "ESTOQUE"]} requireHospital>
              <DoacoesPage />
            </PrivateRoute>
          }
        />

        {/* SECRETARIO */}
        <Route path="secretario/dashboard" element={<PrivateRoute roles={["SECRETARIO"]} requireHospital><DashboardSecretario /></PrivateRoute>} />
        <Route path="secretario/solicitacoes" element={<PrivateRoute roles={["SECRETARIO"]} requireHospital><SolicitacoesSecretario /></PrivateRoute>} />
        <Route path="secretario/scanner" element={<PrivateRoute roles={["SECRETARIO"]} requireHospital><ScannerPage /></PrivateRoute>} />
        <Route path="secretario/doadores" element={<PrivateRoute roles={["SECRETARIO"]} requireHospital><DoadoresPage /></PrivateRoute>} />

<Route path="secretario/relatorios" element={ <PrivateRoute roles={["SECRETARIO"]} requireHospital><SecretarioRelatoriosPage /></PrivateRoute> } />



        {/* ESTOQUE */}
        <Route path="estoque/dashboard" element={<PrivateRoute roles={["ESTOQUE"]} requireHospital><DashboardEstoque /></PrivateRoute>} />
        <Route path="estoque/estoque" element={<PrivateRoute roles={["ESTOQUE"]} requireHospital><GestaoEstoque /></PrivateRoute>} />
        <Route path="estoque/alertas" element={<PrivateRoute roles={["ESTOQUE"]} requireHospital><AlertasEstoque /></PrivateRoute>} />
        

<Route
  path="estoque/relatorios"
  element={
    <PrivateRoute roles={["ESTOQUE"]} requireHospital>
      <EstoqueRelatoriosPage />
    </PrivateRoute>
  }
/>
              {/* RELATORIOS — ADMIN */}
<Route
  path="relatorios"
  element={
    <PrivateRoute roles={["ADMIN"]} requireHospital>
      <RelatoriosPage />
    </PrivateRoute>
  }
/>
<Route
  path="dashboard"
  element={
    <PrivateRoute roles={["ADMIN"]} requireHospital>
      <AdminDashboardPage />
    </PrivateRoute>
  }
/>

<Route
  path="configuracoes"
  element={
    <PrivateRoute roles={["ADMIN", "SECRETARIO", "ESTOQUE"]} requireHospital>
      <DefinicoesPage />
    </PrivateRoute>
  }
/>

        

      </Route>
         
  


<Route
  path="/ins"
  element={
    <PrivateRoute roles={["INS_ADMIN"]}>
      <INSLayout />
    </PrivateRoute>
  }
>
  <Route path="dashboard" element={<INSDashboard />} />
  <Route path="hospitais" element={<INSHospitais />} />
  <Route path="estoque" element={<INSEstoque />} />
  <Route path="relatorios" element={<INSRelatoriosPage />} />
  <Route path="/ins/estoque-ins" element={<INSEstoqueProprio />} />
  <Route path="configuracoes" element={<DefinicoesPage />} />
  
</Route>
      



    </Routes>
  );
}