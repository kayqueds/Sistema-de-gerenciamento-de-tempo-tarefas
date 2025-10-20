import { Routes, Route } from "react-router-dom";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import Cadastro from "../pages/cadastro/Cadastro";
import Sobre from "../pages/sobre/Sobre";
import Dashboard from "../pages/Dashboard/Dashboard";

// rotas do site
function RotasSite() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/sobre" element={<Sobre />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<h1>404 - Not Found</h1>} />
    </Routes>
  );
}
export default RotasSite;    