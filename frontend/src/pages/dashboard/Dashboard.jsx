import { useState, useEffect } from "react";
import "./Dashboard.css";
import { toast } from "react-toastify";
import api from "../../api";

function Dashboard() {
  const [tarefas, setTarefas] = useState([]);
  const [form, setForm] = useState({ titulo: "", horario: "", prioridade: "Normal" });
  const [editIndex, setEditIndex] = useState(null);

  // Busca as tarefas da API ao carregar a página
  useEffect(() => {
    const fetchTarefas = async () => {
      try {
        const response = await api.get("/tarefas");
        setTarefas(response.data);
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
        toast.error("Erro ao buscar tarefas.");
      }
    };
    fetchTarefas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulo) return;

    try {
      // Mapear os campos do formulário para os campos do backend
      const statusMap = {
        Baixa: "pendente",
        Normal: "em andamento",
        Alta: "concluida",
      };

      const tarefaParaBackend = {
        nome_tarefa: form.titulo,
        descricao_tarefa: form.descricao || "",
        data_criacao: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
        status_tarefa: statusMap[form.prioridade] || "pendente",
        id_usuario: 1, // Substitua pelo ID do usuário logado
      };

      if (editIndex !== null) {
        // Atualizar tarefa
        await api.put(`/tarefas/${tarefas[editIndex].id}`, tarefaParaBackend);
        toast.success("Tarefa atualizada com sucesso!");
      } else {
        // Criar nova tarefa
        await api.post("/tarefas", tarefaParaBackend);
        toast.success("Tarefa adicionada com sucesso!");
      }

      // Atualiza a lista de tarefas
      const response = await api.get("/tarefas");
      setTarefas(response.data);

      setForm({ titulo: "", horario: "", prioridade: "Normal" });
      setEditIndex(null);
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
      toast.error("Erro ao salvar tarefa.");
    }
  };

  const handleEdit = (i) => {
    const tarefa = tarefas[i];
    setForm({
      titulo: tarefa.titulo || tarefa.nome_tarefa,
      horario: tarefa.horario || "",
      prioridade: tarefa.prioridade || (tarefa.status_tarefa === "concluida" ? "Alta" : tarefa.status_tarefa === "em andamento" ? "Normal" : "Baixa"),
    });
    setEditIndex(i);
  };

  const handleDelete = async (i) => {
    try {
      const tarefaId = tarefas[i].id;
      await api.delete(`/tarefas/${tarefaId}`);
      toast.success("Tarefa deletada com sucesso!");

      // Atualiza a lista de tarefas
      const response = await api.get("/tarefas");
      setTarefas(response.data);
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
      toast.error("Erro ao deletar tarefa.");
    }
  };

  const prioridadeClass = (prio) => {
    if (prio === "Alta") return "high";
    if (prio === "Normal") return "normal";
    return "low";
  };

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>TaskBoost</h2>
        <ul>
          <li className="active">Dashboard</li>
          <li>Projetos</li>
          <li>Calendário</li>
          <li>Configurações</li>
        </ul>
      </aside>
      {/* CONTEÚDO PRINCIPAL */}
      <main className="dashboard-content">
        <h1>Meu Painel de Tarefas</h1>
        {/* Formulário */}
        <div className="task-form">
          <input
            type="text"
            placeholder="Nova tarefa"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
          />
          <input
            type="time"
            name="horario"
            value={form.horario}
            onChange={handleChange}
          />
          <select name="prioridade" value={form.prioridade} onChange={handleChange}>
            <option value="Baixa">Baixa</option>
            <option value="Normal">Normal</option>
            <option value="Alta">Alta</option>
          </select>
          <button onClick={handleSubmit}>
            {editIndex !== null ? "Atualizar" : "Adicionar"}
          </button>
        </div>
        {/* Lista de tarefas */}
        <div className="tasks-grid">
          {tarefas.length === 0 && <p className="empty">Nenhuma tarefa cadastrada.</p>}
          {tarefas.map((t, i) => (
            <div key={i} className={`task-card ${prioridadeClass(t.prioridade || (t.status_tarefa === "concluida" ? "Alta" : t.status_tarefa === "em andamento" ? "Normal" : "Baixa"))}`}>
              <div className="task-info">
                <h3>{t.titulo || t.nome_tarefa}</h3>
                <span>{t.horario || "--:--"}</span>
              </div>
              <div className="task-actions">
                <button className="edit" onClick={() => handleEdit(i)}>✏️</button>
                <button className="delete" onClick={() => handleDelete(i)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
