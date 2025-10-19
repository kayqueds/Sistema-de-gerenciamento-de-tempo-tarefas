import { useState, useEffect } from "react";
import "./Dashboard.css";

function Dashboard() {
  const tarefasIniciais = [
    { titulo: "Reunião de equipe", horario: "09:00", prioridade: "Alta" },
    { titulo: "Responder e-mails", horario: "11:00", prioridade: "Normal" },
    { titulo: "Planejar sprints", horario: "14:00", prioridade: "Alta" },
  ];

  const [tarefas, setTarefas] = useState([]);
  const [form, setForm] = useState({ titulo: "", horario: "", prioridade: "Normal" });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("tarefas");
    if (saved) setTarefas(JSON.parse(saved));
    else setTarefas(tarefasIniciais);
  }, []);

  useEffect(() => {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
  }, [tarefas]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.titulo) return;
    if (editIndex !== null) {
      const updated = [...tarefas];
      updated[editIndex] = form;
      setTarefas(updated);
      setEditIndex(null);
    } else {
      setTarefas([...tarefas, form]);
    }
    setForm({ titulo: "", horario: "", prioridade: "Normal" });
  };

  const handleEdit = (i) => setForm(tarefas[i]) || setEditIndex(i);

  const handleDelete = (i) => setTarefas(tarefas.filter((_, index) => index !== i));

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
            <div key={i} className={`task-card ${prioridadeClass(t.prioridade)}`}>
              <div className="task-info">
                <h3>{t.titulo}</h3>
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
