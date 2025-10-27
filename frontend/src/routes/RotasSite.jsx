import { Routes, Route } from "react-router-dom";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import Cadastro from "../pages/cadastro/Cadastro";
import Error404 from "../pages/error404/Error404";

// rotas do site
function RotasSite() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="*" element={< Error404/>} />
    </Routes>
  );
}
export default RotasSite;  