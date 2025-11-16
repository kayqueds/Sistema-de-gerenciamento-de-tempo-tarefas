import { useState, useEffect, useRef } from "react";
import "./Dashboard.css";
import { toast } from "react-toastify";
import api from "../../api";
import useSweetAlert from "../../hooks/SweetAlert";
import Sound from "../../hooks/Sound";
import Sidebar from "../../components/common/sidebar/Sidebar.jsx";

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

  // ---------------------
  //   POMODORO (C2)
  // ---------------------
  const [pomodoroOpen, setPomodoroOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const [pomodoroTime, setPomodoroTime] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);

  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [history, setHistory] = useState([]);

  const timerRef = useRef(null);

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

  // CARREGAR ESTADO
  useEffect(() => {
    const saved = localStorage.getItem("pomodoroState");
    if (saved) {
      const s = JSON.parse(saved);
      setTimeLeft(s.timeLeft);
      setIsRunning(s.isRunning);
      setCycle(s.cycle);
      setCurrentTask(s.currentTask);
      setHistory(s.history || []);
      setPomodoroTime(s.pomodoroTime || 25);
      setShortBreak(s.shortBreak || 5);
      setLongBreak(s.longBreak || 15);
    }
  }, []);

  // SALVAR ESTADO
  useEffect(() => {
    localStorage.setItem(
      "pomodoroState",
      JSON.stringify({
        timeLeft,
        isRunning,
        cycle,
        currentTask,
        history,
        pomodoroTime,
        shortBreak,
        longBreak,
      })
    );
  }, [timeLeft, isRunning, cycle, currentTask, history, pomodoroTime, shortBreak, longBreak]);

  // TIMER
  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);

          toast.success(`Pomodoro de "${currentTask?.titulo || currentTask?.nome_tarefa}" finalizado!`);
          playSound(listSound[1]);

          setHistory((h) => [
            ...h,
            { task: currentTask?.titulo || currentTask?.nome_tarefa, date: new Date() },
          ]);

          setCycle((c) => c + 1);

          const next = (cycle + 1) % 4 === 0 ? longBreak * 60 : shortBreak * 60;
          setTimeLeft(next);
          setIsRunning(false);

          return next;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isRunning, currentTask, cycle, longBreak, shortBreak]);

  const startTimer = () => {
    if (!currentTask) return toast.error("Selecione uma tarefa primeiro!");
    setIsRunning(true);
  };

  const pauseTimer = () => setIsRunning(false);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(pomodoroTime * 60);
  };

  const openPomodoro = (task) => {
    setCurrentTask(task);
    setTimeLeft(pomodoroTime * 60);
    setPomodoroOpen(true);
  };

  // FORMATA TEMPO
  const formatTime = (s) => {
    const m = String(Math.floor(s / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${m}:${sec}`;
  };

  // FORM
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulo || !form.horario || !form.descricao || !form.data) {
      toast.error("Todos os campos são obrigatórios!");
      return playSound(listSound[2]);
    }

    try {
      const mapStatus = { Baixa: "pendente", Normal: "em andamento", Alta: "concluida" };
      const tarefaBackend = {
        nome_tarefa: form.titulo,
        horario: form.horario,
        descricao_tarefa: form.descricao,
        data_tarefa: form.data,
        prioridade: form.prioridade,
        status_tarefa: mapStatus[form.prioridade] || "pendente",
        id_usuario: 48,
      };

      if (editIndex !== null) {
        const ok = await showConfirmation("Deseja editar a tarefa?", "Editar");
        if (!ok) return;
        await api.put(`/tarefas/${tarefas[editIndex].id_tarefa}`, tarefaBackend);
      } else {
        await api.post("/tarefas", tarefaBackend);
      }

      toast.success("Tarefa salva!");
      playSound(listSound[1]);

      const response = await api.get("/tarefas");
      setTarefas(response.data);

      setForm({ titulo: "", horario: "", data: "", prioridade: "Normal", descricao: "" });
      setEditIndex(null);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar.");
      playSound(listSound[2]);
    }
  };

  const formatarData = (d) => {
    const data = new Date(d);
    return `${String(data.getDate()).padStart(2, "0")}/${String(
      data.getMonth() + 1
    ).padStart(2, "0")}/${data.getFullYear()}`;
  };

  const prioridadeClass = (p) =>
    p === "Alta" ? "high" : p === "Normal" ? "normal" : "low";

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <h1>Meu Painel de Tarefas</h1>

        {/* form */}
        <div className="task-form">
          <input type="text" placeholder="Nova tarefa" name="titulo" value={form.titulo} onChange={handleChange} />
          <input type="time" name="horario" value={form.horario} onChange={handleChange} />
          <input type="date" name="data" value={form.data} onChange={handleChange} />
          <input type="text" placeholder="Descrição" name="descricao" value={form.descricao} onChange={handleChange} />
          <select name="prioridade" value={form.prioridade} onChange={handleChange}>
            <option value="Baixa">Baixa</option>
            <option value="Normal">Normal</option>
            <option value="Alta">Alta</option>
          </select>
          <button onClick={handleSubmit}>{editIndex !== null ? "Atualizar" : "Adicionar"}</button>
        </div>

        {/* Cards */}
        <div className="tasks-grid">
          {tarefas.length === 0 && <p className="empty">Nenhuma tarefa cadastrada.</p>}

          {tarefas.map((t, i) => (
            <div key={i} className={`task-card ${prioridadeClass(t.prioridade)}`}>
              <div className="task-info">
                <h3>{t.nome_tarefa || t.titulo}</h3>
                <span>{t.horario || "--"}</span>
                <p>{t.descricao_tarefa}</p>
                {t.data_tarefa && <p>📅 {formatarData(t.data_tarefa)}</p>}
              </div>

              <div className="task-actions">
                <button className="edit" onClick={() => handleEdit(i)}>✏️</button>
                <button className="delete" onClick={() => handleDelete(i)}>🗑️</button>
                <button className="pomodoro" onClick={() => openPomodoro(t)}>⏱️</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ----------- MODAL C2 ----------- */}
      {pomodoroOpen && (
        <div className="pomodoro-modal-circle">
          <div className="pomodoro-box">
            <h2>Pomodoro</h2>
            <h3>{currentTask?.nome_tarefa || currentTask?.titulo}</h3>

            {/* Círculo */}
            <div className="circle-timer">
              {formatTime(timeLeft)}
            </div>

            {/* BOTÕES */}
            <div className="pomodoro-buttons">
              {!isRunning && <button onClick={startTimer}>Iniciar</button>}
              {isRunning && <button onClick={pauseTimer}>Pausar</button>}
              <button onClick={resetTimer}>Resetar</button>
              <button onClick={() => setPomodoroOpen(false)}>Fechar</button>
            </div>

            {/* PERSONALIZAÇÃO */}
            <div className="pomodoro-settings">
              <label>Pomodoro:
                <input
                  type="number"
                  value={pomodoroTime}
                  onChange={(e) => setPomodoroTime(Number(e.target.value))}
                />
              </label>

              <label>Pausa curta:
                <input
                  type="number"
                  value={shortBreak}
                  onChange={(e) => setShortBreak(Number(e.target.value))}
                />
              </label>

              <label>Pausa longa:
                <input
                  type="number"
                  value={longBreak}
                  onChange={(e) => setLongBreak(Number(e.target.value))}
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
