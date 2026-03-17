import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./contexts/useAuth";
import DashboardTriagem from "./pages/public/DashboardTriagem";
import Login from "./pages/public/Login";
import PainelGestor from "./pages/private/PainelGestor";
import Triagem from "./pages/public/Triagem";

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/triagem" replace />;
  }

  return children;
}

function RootRedirect() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/triagem" replace />;
}

export default function Router() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RootRedirect />} />

      <Route
        path="/triagem"
        element={
          <ProtectedRoute allowedRoles={["operador", "admin"]}>
            <Triagem />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["operador", "admin"]}>
            <DashboardTriagem />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <PainelGestor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/editar/:id"
        element={
          <ProtectedRoute allowedRoles={["operador", "admin"]}>
            <Triagem />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
