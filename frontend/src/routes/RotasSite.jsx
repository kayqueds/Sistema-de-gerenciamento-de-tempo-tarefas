import { Routes, Route } from "react-router-dom";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import Cadastro from "../pages/cadastro/Cadastro";
import Sobre from "../pages/sobre/Sobre";
import Dashboard from "../pages/dashboard/Dashboard";
import Error404 from "../pages/error404/Error404";
import Calendario from "../pages/calendario/Calendario";
import ChatPage from "../components/Chat/ChatPage";
import Grafico from "../pages/grafico/Grafico";

// rotas do site
function RotasSite() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/sobre" element={<Sobre />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/calendario" element={<Calendario />} />
      <Route path="*" element={< Error404/>} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/grafico" element={<Grafico />} />
    </Routes>
  );
}

export default RotasSite;  
