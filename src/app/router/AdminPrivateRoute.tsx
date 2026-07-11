import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

export default function AdminPrivateRoute({ children }: Props) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    if (payload.tipo_usuario !== "ADMIN") {
      return <Navigate to="/home" />;
    }

    return <>{children}</>;
  } catch (error) {
    return <Navigate to="/admin/login" />;
  }
}