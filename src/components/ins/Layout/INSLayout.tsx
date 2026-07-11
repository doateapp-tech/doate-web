import { Outlet } from "react-router-dom";
import Sidebar from "../../hospital/Sidebar/Sidebar";
import Header from "../../hospital/Header/Header";
import "../../hospital/Layout/HospitalLayout.css"; // reutiliza o mesmo CSS

export default function INSLayout() {
  return (
    <div className="hospital-layout">
      <Sidebar />
      <div className="hospital-main">
        <Header />
        <div className="hospital-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}