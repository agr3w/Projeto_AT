import { Route, Routes } from "react-router-dom";
import DashboardTriagem from "./pages/public/DashboardTriagem";
import Triagem from "./pages/public/Triagem";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<DashboardTriagem />} />
      <Route path="/dashboard" element={<DashboardTriagem />} />
      <Route path="/triagem" element={<Triagem />} />
      <Route path="/editar/:id" element={<Triagem />} />
    </Routes>
  );
}
