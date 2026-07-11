import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import "./HospitalLayout.css";
export default function HospitalLayout() {
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