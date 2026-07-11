import { Navigate } from "react-router-dom";

interface Props {
  children: JSX.Element;
  roles?: string[];
  requireHospital?: boolean;
  requireNoHospital?: boolean;
}

export default function PrivateRoute({
  children,
  roles = [],
  requireHospital = false,
  requireNoHospital = false,
}: Props) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles.length > 0 && !roles.includes(user.tipo_usuario)) {
    return <Navigate to="/home" />;
  }

  if (requireHospital && !user.hospital_id) {
    return <Navigate to="/home" />;
  }

  if (requireNoHospital && user.hospital_id) {
    return <Navigate to="/home" />;
  }

  return children;
}