import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Sidebar() {
  // 1. Estado para controlar a visibilidade da sidebar. Começa aberta por padrão.
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Função para inverter o estado.
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
const closeArrow = () => setIsSidebarOpen(!isSidebarOpen);
  const location = useLocation();
  const linkBaseStyle = "block py-2 px-4 rounded-lg transition-colors duration-200";
  const linkInactiveStyle = "text-destaque hover:bg-gray-700 hover:text-white font-medium no-underline";
  const linkActiveStyle = "bg-gray-900 text-white font-semibold no-underline";

  // fechar seta ao clicar
  return (
    <>
      <button 
        onClick={closeArrow}  
        className={"fixed top-18 left--15 z-30 p-2 rounded-md bg-gray-800 text-white md:hidden"}
      >
        {/* Ícone de exemplo (pode ser um SVG de hambúrguer) */}
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>
      <aside 
        className={`fixed md:relative h-screen w-64 bg-secundaria text-white p-6 flex flex-col transform transition-transform duration-300 ease-in-out z-20 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        {/* Cabeçalho da Sidebar com o botão de fechar (visível em telas grandes) */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">
            Organix
          </h2>
          {/* Botão para fechar (escondido em telas pequenas) */}
          <button onClick={toggleSidebar} className="hidden md:block p-1 rounded-full hover:bg-gray-700">
            {/* Ícone de exemplo (seta para a esquerda) */}
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <ul className="flex flex-col space-y-2">
          <li>
            <Link 
              to="/dashboard"
              className={`${linkBaseStyle} ${location.pathname === '/dashboard' ? linkActiveStyle : linkInactiveStyle}`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <span className={`${linkBaseStyle} ${linkInactiveStyle}`}>
              Projetos
            </span>
          </li>
          <li>
            <Link 
              to="/calendario"
              className={`${linkBaseStyle} ${location.pathname === '/calendario' ? linkActiveStyle : linkInactiveStyle}`}
            >
              Calendário
            </Link>
          </li>
          <li>
            <span className={`${linkBaseStyle} ${linkInactiveStyle}`}>
              Configurações
            </span>
          </li>
        </ul>
      </aside>
    </>
  );
}

export default Sidebar;
