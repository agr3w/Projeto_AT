import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { useAuth } from "./contexts/useAuth";
import DashboardTriagem from "./pages/public/DashboardTriagem";
import Login from "./pages/public/Login";
import PainelGestor from "./pages/private/PainelGestor";
import Triagem from "./pages/public/Triagem";

function ProtectedRoute({ children, allowedRoles, redirectTo = "/dashboard" }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}

function RootRedirect() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}

function LoginRoute() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Login />;
}

export default function Router() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/" element={<RootRedirect />} />

      <Route
        path="/triagem"
        element={
          <ProtectedRoute allowedRoles={["operador", "admin"]}>
            <Layout>
              <Triagem />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["operador", "admin"]}>
            <Layout>
              <DashboardTriagem />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]} redirectTo="/dashboard">
            <Layout>
              <PainelGestor />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/editar/:id"
        element={
          <ProtectedRoute allowedRoles={["operador", "admin"]}>
            <Layout>
              <Triagem />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
