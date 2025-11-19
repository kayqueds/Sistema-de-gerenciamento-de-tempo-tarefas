import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import { toast } from "react-toastify";
import api from "../../api";
import useSweetAlert from "../../hooks/SweetAlert";
import Sound from "../../hooks/Sound";

function Dashboard() {
  const [tarefas, setTarefas] = useState([]);
  const [form, setForm] = useState({
    titulo: "",
    horario: "",
    data: "",
    prioridade: "Normal",
    descricao: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const { showConfirmation } = useSweetAlert();
  const { playSound, listSound } = Sound();

  // listar tarefas
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
    if (!form.titulo || !form.descricao || !form.prioridade || !form.horario || !form.data) {
      toast.error("Todos os campos são obrigatórios!!");
      playSound(listSound[2]);

      return;
    }

    try {
      const statusMap = { Baixa: "pendente", Normal: "em andamento", Alta: "concluida" };
      const prioridadeMap = { Baixa: "Baixa", Normal: "Normal", Alta: "Alta" };

      const tarefaParaBackend = {
        nome_tarefa: form.titulo,
        horario: form.horario || null,
        data_tarefa: form.data || null,
        descricao_tarefa: form.descricao || "",
        data_criacao: new Date().toISOString().split("T")[0],
        status_tarefa: statusMap[form.prioridade] || "pendente",
        prioridade: prioridadeMap[form.prioridade] || "Normal",
        id_usuario: 35,
      };

      if (editIndex !== null) {
        playSound(listSound[3]);
        const confirmar = await showConfirmation("Deseja editar sua tarefa?", "Editar");
        if (!confirmar) return;
        await api.put(`/tarefas/${tarefas[editIndex].id}`, tarefaParaBackend);
        toast.success("Tarefa atualizada com sucesso!");
        playSound(listSound[1]);
      } else {
        await api.post("/tarefas", tarefaParaBackend);
        toast.success("Tarefa adicionada com sucesso!");
        playSound(listSound[1]);
      }

      const response = await api.get("/tarefas");
      setTarefas(response.data);
      setForm({ titulo: "", horario: "", data: "", prioridade: "Normal", descricao: "" });
      setEditIndex(null);
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
      toast.error("Erro ao salvar tarefa.");
      playSound(listSound[2]);
    }
  };

  const handleEdit = (i) => {
    const tarefa = tarefas[i];
    setForm({
      titulo: tarefa.titulo || tarefa.nome_tarefa,
      horario: tarefa.horario || "",
      data: tarefa.data_tarefa || "",
      prioridade:
        tarefa.prioridade ||
        (tarefa.status_tarefa === "concluida"
          ? "Alta"
          : tarefa.status_tarefa === "em andamento"
          ? "Normal"
          : "Baixa"),
      descricao: tarefa.descricao_tarefa || "",
    });
    setEditIndex(i);
  };

  const handleDelete = async (i) => {
    try {
      playSound(listSound[3]);
      const confirmar = await showConfirmation("Esta ação não pode ser desfeita.", "Deletar");
      if (!confirmar) return;
      const tarefaId = tarefas[i].id;
      await api.delete(`/tarefas/${tarefaId}`);
      toast.success("Tarefa deletada com sucesso!");
      playSound(listSound[1]);
      const response = await api.get("/tarefas");
      setTarefas(response.data);
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
      toast.error("Erro ao deletar tarefa.");
      playSound(listSound[2]);
    }
  };

  const prioridadeClass = (prio) => {
    if (prio === "Alta") return "high";
    if (prio === "Normal") return "normal";
    return "low";
  };

// Formatar data para formato brasileiro
const formatarData = (dataISO) => {
  const data = new Date(dataISO);
  return data.toLocaleDateString("pt-BR");
};


  return (
    <div className="dashboard-layout">
      {/* SIDEBAR desktop */}
      <aside className="sidebar d-none d-md-flex">
        <h2>Organix</h2>
        <ul>
          <li className="active"><Link to="/dashboard" className="sidebar-link">Dashboard</Link></li>
          <li><Link to="/projetos" className="sidebar-link">Projetos</Link></li>
          <li><Link to="/calendario" className="sidebar-link">Calendário</Link></li>
          <li><Link to="/configuracoes" className="sidebar-link">Configurações</Link></li>
          <li><Link to="/grafico" className="sidebar-link">Ver gráfico</Link></li>
        </ul>
      </aside>

      {/* BOTÃO sidebar mobile */}
      <button
        className="btn btn-primary d-md-none mb-3"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#mobileSidebar"
        aria-controls="mobileSidebar"
      >
        ☰ Menu
      </button>

      {/* SIDEBAR mobile */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="mobileSidebar"
        aria-labelledby="mobileSidebarLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="mobileSidebarLabel">Menu</h5>
          <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <ul className="list-unstyled">
            <li><Link to="/dashboard" className="sidebar-link" data-bs-dismiss="offcanvas">Dashboard</Link></li>
            <li><Link to="/projetos" className="sidebar-link" data-bs-dismiss="offcanvas">Projetos</Link></li>
            <li><Link to="/calendario" className="sidebar-link" data-bs-dismiss="offcanvas">Calendário</Link></li>
            <li><Link to="/gtafico" className="sidebar-link" data-bs-dismiss="offcanvas">Gráfico</Link></li>
          </ul>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="dashboard-content">
        <h1>Meu Painel de Tarefas</h1>

        {/* Formulário */}
        <div className="task-form d-flex flex-wrap align-items-start">
          <input type="text" placeholder="Nova tarefa" name="titulo" value={form.titulo} onChange={handleChange} />
          <input type="time" name="horario" value={form.horario} onChange={handleChange} />
          <input type="date" name="data" value={form.data} onChange={handleChange} />
          <input type="text" placeholder="Descrição" name="descricao" value={form.descricao} onChange={handleChange} />
          <select name="prioridade" value={form.prioridade} onChange={handleChange}>
            <option value="Baixa">Baixa</option>
            <option value="Normal">Normal</option>
            <option value="Alta">Alta</option>
          </select>
          <button onClick={handleSubmit} className="btn-formulario">{editIndex !== null ? "Atualizar" : "Adicionar"}</button>
        </div>

        {/* Lista de tarefas */}
        <div className="tasks-grid mt-3">
          {tarefas.length === 0 && <p className="empty">Nenhuma tarefa cadastrada.</p>}
          {tarefas.map((t, i) => (
            <div key={i} className={`task-card ${prioridadeClass(t.prioridade || (t.status_tarefa === "concluida" ? "Alta" : t.status_tarefa === "em andamento" ? "Normal" : "Baixa"))}`}>
              <div className="task-info">
                <h3>{t.titulo || t.nome_tarefa}</h3>
                <span>{t.horario || "--:--"}</span>
                <p>{t.descricao_tarefa || ""}</p>
                {t.data_tarefa && <small>📅 {formatarData(t.data_tarefa)}</small>}
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
