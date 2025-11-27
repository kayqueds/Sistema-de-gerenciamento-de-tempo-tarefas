import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect, useContext } from "react";
import api from "../../../api";
import { ThemeContext } from "../theme/Theme.jsx";

function Sidebar() {
  const { theme } = useContext(ThemeContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTasksOpen, setIsTasksOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [editForm, setEditForm] = useState({
    titulo: "",
    data: "",
    horario: "",
    prioridade: "Normal",
    descricao: "",
  });

  const location = useLocation();
  const tasksButtonRef = useRef(null);

  // ---------------------------------------------------------
  // BUSCAR TAREFAS DO BACKEND
  // ---------------------------------------------------------
  async function fetchTasks() {
    try {
      const response = await api.get("/tarefas");

      if (response.data) {
        const sorted = response.data.sort((a, b) => {
          const prioOrder = { Alta: 1, Normal: 2, Baixa: 3 };
          if (prioOrder[a.prioridade] !== prioOrder[b.prioridade]) {
            return prioOrder[a.prioridade] - prioOrder[b.prioridade];
          }
          return new Date(a.data_tarefa) - new Date(b.data_tarefa);
        });
        setTasks(sorted);
      }
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  // ---------------------------------------------------------
  // INICIAR EDIÇÃO INLINE
  // ---------------------------------------------------------
  const startEditing = (task) => {
    setEditingTaskId(task.id_tarefa);
    setEditForm({
      titulo: task.nome_tarefa,
      data: task.data_tarefa ? task.data_tarefa.split("T")[0] : "",
      horario: task.horario,
      prioridade: task.prioridade,
      descricao: task.descricao_tarefa || "",
    });
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
  };

  // ---------------------------------------------------------
  // SALVAR EDIÇÃO
  // ---------------------------------------------------------
  const saveTaskChanges = async (id) => {
    try {
      await api.put(`/tarefas/${id}`, {
        nome_tarefa: editForm.titulo,
        descricao_tarefa: editForm.descricao,
        data_tarefa: editForm.data,
        horario: editForm.horario,
        prioridade: editForm.prioridade,
        // Mantido o status_tarefa como no código funcional original
        status_tarefa:
          editForm.prioridade === "Alta"
            ? "concluida"
            : editForm.prioridade === "Normal"
            ? "em andamento"
            : "pendente",
        id_usuario: 1,
      });

      fetchTasks(); // Atualiza a lista
      setEditingTaskId(null);
    } catch (error) {
      console.error("Erro ao salvar edição:", error);
    }
  };

  // ---------------------------------------------------------
  // DELETAR TAREFA
  // ---------------------------------------------------------
  const deleteTask = async (id) => {
    try {
      await api.delete(`/tarefas/${id}`);
      fetchTasks(); // Atualiza a lista
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  // ---------------------------------------------------------
  // ESTILOS DA SIDEBAR
  // ---------------------------------------------------------
  const linkBaseStyle = "block py-2 px-4 rounded-lg transition-colors duration-200";
  const linkInactiveStyle = "text-destaque hover:bg-gray-700 hover:text-white font-medium no-underline";
  const linkActiveStyle = "bg-gray-900 text-white font-semibold no-underline";

  return (
    <>
      {/* Botão Mobile */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-18 left--15 z-30 p-2 rounded-md bg-gray-800 text-white md:hidden"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      {/* ⭐️ SIDEBAR PRINCIPAL: Estilos Condicionais */}
      <aside
        className={`fixed md:relative h-screen w-64 p-6 flex flex-col transform transition-transform duration-300 ease-in-out z-20 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
        style={{
          backgroundColor: theme === "dark" ? "#14171A" : "#ffffff", // Fundo Dark/Light
          color: theme === "dark" ? "#ffffff" : "#000000",
        }}
      >
        <div className="flex justify-between items-center mb-10">
          {/* Título: Estilo Condicional */}
          <h2 className="text-3xl font-bold text-primaria">Organix</h2>
          {/* Botão de Fechar: Estilo Condicional */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className={`hidden md:block p-1 rounded-full hover:bg-gray-700 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* ---------------- MENU ---------------- */}
        <ul className="flex flex-col space-y-2">

          {/* Link Dashboard inalterado */}
          <li>
            <Link
              to="/dashboard"
              className={`${linkBaseStyle} ${
                location.pathname === "/dashboard" ? linkActiveStyle : linkInactiveStyle
              }`}
            >
              Dashboard
            </Link>
          </li>

          {/* BOTÃO DE TAREFAS + DROPDOWN EXTERNO LATERAL */}
          <li className="relative">
            <button
              ref={tasksButtonRef}
              onClick={() => setIsTasksOpen(!isTasksOpen)}
              className={`${linkBaseStyle} ${linkInactiveStyle} w-full text-left flex justify-between items-center`}
            >
              Tarefas
              <svg
                className={`w-5 h-5 ml-2 transition-transform duration-200 ${
                  isTasksOpen ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            {/* ⭐️ DROPDOWN CONTAINER: Estilos Condicionais */}
            {isTasksOpen && (
              <div
                className="absolute top-full left-full ml-4 mt-1 w-72 max-h-96 overflow-auto rounded-md shadow-lg z-30"
                style={{
                  backgroundColor: theme === "dark" ? "#1f2937" : "#f3f4f6", // Fundo do Dropdown
                  color: theme === "dark" ? "#ffffff" : "#1f2937", // Texto do Dropdown
                }}
              >
                {/* se estiver vazio */}
                {tasks.length === 0 && (
                  <div className="p-4 text-center text-gray-500">Nenhuma tarefa encontrada.</div>
                )}

                {/* LISTA DE TAREFAS */}
                {tasks.map((task) => {
                  const isEditing = editingTaskId === task.id_tarefa;

                  return (
                    <div 
                      key={task.id_tarefa} 
                      className="border-b last:border-b-0 border-gray-200 p-3"
                      style={{
                        // Fundo do item individual da lista
                        backgroundColor: theme === "dark" ? "#1f2937" : "#f3f4f6", 
                      }}
                    >

                      {/* ----------------- MODO VISUALIZAÇÃO ----------------- */}
                      {!isEditing && (
                        <div className="flex items-center justify-between">
                          
                          {/* barra lateral inalterada */}
                          <div
                            className={`w-1 h-12 rounded mr-3 ${
                              task.prioridade === "Alta"
                                ? "bg-red-500"
                                : task.prioridade === "Normal"
                                ? "bg-yellow-400"
                                : "bg-green-500"
                            }`}
                          ></div>

                          {/* nome e data inalterados */}
                          <div className="flex flex-col w-44">
                            <span className="font-semibold truncate">{task.nome_tarefa}</span>
                            <span className="text-sm text-gray-500">
                              {task.data_tarefa ? new Date(task.data_tarefa).toLocaleDateString() : "--"} -{" "}
                              {task.horario || "--:--"}
                            </span>
                          </div>

                          {/* botões inalterados */}
                          <div className="flex space-x-2">
                            <button
                              onClick={() => startEditing(task)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              ✏️
                            </button>

                            <button
                              onClick={() => deleteTask(task.id_tarefa)}
                              className="text-red-500 hover:text-red-700"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      )}

                      {/* ⭐️ MODO EDIÇÃO INLINE: Estilos Condicionais */}
                      {isEditing && (
                        <div 
                          className="p-3 rounded-md"
                          style={{
                            // Fundo do formulário de edição
                            backgroundColor: theme === "dark" ? "#374151" : "#e5e7eb", 
                          }}
                        >
                          {/* Campos de input e botões inalterados */}
                          <input
                            type="text"
                            className="w-full mb-2 p-1 border rounded"
                            value={editForm.titulo}
                            onChange={(e) => setEditForm({ ...editForm, titulo: e.target.value })}
                          />

                          <div className="flex space-x-2 mb-2">
                            <input
                              type="date"
                              className="w-1/2 p-1 border rounded"
                              value={editForm.data}
                              onChange={(e) => setEditForm({ ...editForm, data: e.target.value })}
                            />
                            <input
                              type="time"
                              className="w-1/2 p-1 border rounded"
                              value={editForm.horario}
                              onChange={(e) => setEditForm({ ...editForm, horario: e.target.value })}
                            />
                          </div>

                          <select
                            className="w-full p-1 border rounded mb-2"
                            value={editForm.prioridade}
                            onChange={(e) => setEditForm({ ...editForm, prioridade: e.target.value })}
                          >
                            <option value="Baixa">Baixa</option>
                            <option value="Normal">Normal</option>
                            <option value="Alta">Alta</option>
                          </select>

                          <textarea
                            className="w-full p-1 border rounded mb-2"
                            rows="2"
                            value={editForm.descricao}
                            onChange={(e) => setEditForm({ ...editForm, descricao: e.target.value })}
                          />

                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={cancelEditing}
                              className="px-3 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400"
                            >
                              Cancelar
                            </button>

                            <button
                              onClick={() => saveTaskChanges(task.id_tarefa)}
                              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              Salvar
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}
          </li>
          <li>
            <Link to="/grafico"
              className={`${linkBaseStyle} ${
                location.pathname === "/grafico" ? linkActiveStyle : linkInactiveStyle
              }`}
            >
              Gráfico
            </Link>
          </li>

          <li>
            <Link
              to="/calendario"
              className={`${linkBaseStyle} ${
                location.pathname === "/calendario" ? linkActiveStyle : linkInactiveStyle
              }`}
            >
              Calendário
            </Link>
          </li>

          <li>
            <Link
              to="/chat"
              className={`${linkBaseStyle} ${
                location.pathname === "/chat" ? linkActiveStyle : linkInactiveStyle
              }`}
            >
              Chat
            </Link>
          </li>
        </ul>
      </aside>
    </>
  );
}

export default Sidebar;