import { Route, Routes } from "react-router-dom";
import Triagem from "./pages/public/Triagem";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Triagem />} />
    </Routes>
  );
}
