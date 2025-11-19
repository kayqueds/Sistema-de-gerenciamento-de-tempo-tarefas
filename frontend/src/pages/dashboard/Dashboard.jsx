import { useState, useEffect, useRef } from "react";
import "./Dashboard.css";
import { toast } from "react-toastify";
import api from "../../api";
import useSweetAlert from "../../hooks/SweetAlert";
import Sound from "../../hooks/Sound";
import Sidebar from "../../components/common/sidebar/Sidebar.jsx";

function Dashboard() {
  const [tarefas, setTarefas] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

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
  const [notified, setNotified] = useState([]);

  // Pomodoro
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

  // Buscar tarefas ao iniciar
  useEffect(() => {
    const fetchTarefas = async () => {
      try {
        const response = await api.get("/tarefas");
        const sorted = sortByPriority(response.data);
        setTarefas(sorted);
        setFilteredTasks(sorted);
      } catch (error) {
        toast.error("Erro ao buscar tarefas.");
      }
    };
    fetchTarefas();
  }, []);

  // Ordenação por prioridade
  const sortByPriority = (list) => {
    const weight = { Alta: 1, Normal: 2, Baixa: 3 };
    return [...list].sort((a, b) => weight[a.prioridade] - weight[b.prioridade]);
  };

  // Filtros
  useEffect(() => {
    let temp = [...tarefas];

    if (search.trim() !== "") {
      temp = temp.filter(
        (t) =>
          t.nome_tarefa.toLowerCase().includes(search.toLowerCase()) ||
          t.descricao_tarefa.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterPriority !== "") {
      temp = temp.filter((t) => t.prioridade === filterPriority);
    }

    setFilteredTasks(temp);
  }, [search, filterPriority, tarefas]);

  const clearFilters = () => {
    setSearch("");
    setFilterPriority("");
    setFilteredTasks(tarefas);
  };

  // Pomodoro salvamento automático
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

  // Pomodoro timer
  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          toast.success(
            `Pomodoro de "${currentTask?.nome_tarefa}" finalizado!`
          );
          playSound(listSound[1]);
          setHistory((h) => [...h, { task: currentTask?.nome_tarefa, date: new Date() }]);
          setCycle((c) => c + 1);

          const next =
            (cycle + 1) % 4 === 0 ? longBreak * 60 : shortBreak * 60;

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
    setTimeLeft(pomodoroTime * 60);
    setIsRunning(false);
  };

  const openPomodoro = (task) => {
    setCurrentTask(task);
    setTimeLeft(pomodoroTime * 60);
    setPomodoroOpen(true);
  };

  const formatTime = (s) => {
    const m = String(Math.floor(s / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${m}:${sec}`;
  };

  // Notificações
  useEffect(() => {
    if (!tarefas || tarefas.length === 0) return;

    const interval = setInterval(() => {
      const agora = new Date();

      const horaAtual = `${String(agora.getHours()).padStart(2, "0")}:${String(
        agora.getMinutes()
      ).padStart(2, "0")}`;

      const dataHoje = `${agora.getFullYear()}-${String(
        agora.getMonth() + 1
      ).padStart(2, "0")}-${String(agora.getDate()).padStart(2, "0")}`;

      tarefas.forEach((t) => {
        if (!t.horario || !t.data_tarefa) return;

        const dataTarefa = new Date(t.data_tarefa);
        const dataStr = `${dataTarefa.getFullYear()}-${String(
          dataTarefa.getMonth() + 1
        ).padStart(2, "0")}-${String(dataTarefa.getDate()).padStart(2, "0")}`;

        if (dataHoje === dataStr && t.horario === horaAtual) {
          if (notified.includes(t.id_tarefa)) return;

          setNotified((prev) => [...prev, t.id_tarefa]);

          try {
            new Notification("🔔 Lembrete de tarefa", {
              body: `${t.nome_tarefa}\n${t.descricao_tarefa}`,
              icon: "/logo192.png",
            });
          } catch {}

          showConfirmation(
            `Está na hora da tarefa:\n${t.nome_tarefa}\n${t.descricao_tarefa}`,
            "Ok"
          );

          toast.info(`Hora da tarefa: ${t.nome_tarefa}`);

          try {
            playSound(listSound[1]);
          } catch {}
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [tarefas, notified]);

  // Formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.titulo || !form.horario || !form.descricao || !form.data) {
      toast.error("Todos os campos são obrigatórios!");
      playSound(listSound[2]);
      return;
    }

    try {
      const tarefaBackend = {
        nome_tarefa: form.titulo,
        horario: form.horario,
        descricao_tarefa: form.descricao,
        data_tarefa: form.data,
        prioridade: form.prioridade,
        status_tarefa:
          form.prioridade === "Alta"
            ? "concluida"
            : form.prioridade === "Normal"
            ? "em andamento"
            : "pendente",
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
      const sorted = sortByPriority(response.data);

      setTarefas(sorted);
      setFilteredTasks(sorted);

      setForm({
        titulo: "",
        horario: "",
        data: "",
        prioridade: "Normal",
        descricao: "",
      });

      setEditIndex(null);
    } catch (err) {
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

        <h1 className="mb-4">Meu Painel de Tarefas</h1>

        {/* ============================
           🔍 FILTROS BOOTSTRAP
        ============================ */}
        <div className="row g-2 mb-4 ">

          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Pesquisar tarefa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="">Filtrar por prioridade</option>
              <option value="Alta">Alta</option>
              <option value="Normal">Normal</option>
              <option value="Baixa">Baixa</option>
            </select>
          </div>

          <div className="col-md-1">
            <button
              className="btn btn-secondary w-20 "
              onClick={clearFilters}
            >
              Limpar
            </button>
          </div>

        </div>

        {/* ============================
           FORMULÁRIO
        ============================ */}
        <form className="task-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="titulo"
            placeholder="Nova tarefa"
            value={form.titulo}
            onChange={handleChange}
          />
          <input
            type="time"
            name="horario"
            value={form.horario}
            onChange={handleChange}
          />
          <input
            type="date"
            name="data"
            value={form.data}
            onChange={handleChange}
          />
          <input
            type="text"
            name="descricao"
            placeholder="Descrição"
            value={form.descricao}
            onChange={handleChange}
          />

          <select
            name="prioridade"
            value={form.prioridade}
            onChange={handleChange}
          >
            <option value="Baixa">Baixa</option>
            <option value="Normal">Normal</option>
            <option value="Alta">Alta</option>
          </select>

          <button type="submit">
            {editIndex !== null ? "Atualizar" : "Adicionar"}
          </button>
        </form>

        {/* ============================
           LISTA DE TAREFAS
        ============================ */}
        <div className="tasks-list mt-4">
          {filteredTasks.length === 0 ? (
            <p className="empty">Nenhuma tarefa encontrada.</p>
          ) : (
            <div className="table-responsive">
              <table className="tasks-table table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Horário</th>
                    <th>Data</th>
                    <th>Prioridade</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTasks.map((t, i) => (
                    <tr key={i} className={prioridadeClass(t.prioridade)}>
                      <td>{t.id_tarefa}</td>
                      <td>{t.nome_tarefa}</td>
                      <td>{t.descricao_tarefa}</td>
                      <td>{t.horario || "--"}</td>
                      <td>{t.data_tarefa ? formatarData(t.data_tarefa) : "--"}</td>
                      <td>{t.prioridade}</td>

                      <td className="task-actions">
                        <button
                          className="edit"
                          onClick={() => {
                            setEditIndex(i);
                            setForm({
                              titulo: t.nome_tarefa,
                              horario: t.horario,
                              data: t.data_tarefa,
                              descricao: t.descricao_tarefa,
                              prioridade: t.prioridade,
                            });
                          }}
                        >
                          ✏️
                        </button>

                        <button
                          className="delete"
                          onClick={() => {
                            showConfirmation("Deseja excluir?", "Excluir").then(
                              async (ok) => {
                                if (ok) {
                                  await api.delete(`/tarefas/${t.id_tarefa}`);
                                  const response = await api.get("/tarefas");
                                  const sorted = sortByPriority(response.data);
                                  setTarefas(sorted);
                                  setFilteredTasks(sorted);
                                }
                              }
                            );
                          }}
                        >
                          🗑️
                        </button>

                        <button
                          className="pomodoro"
                          onClick={() => openPomodoro(t)}
                        >
                          ⏱️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ============================
         MODAL POMODORO
      ============================ */}
      {pomodoroOpen && (
        <div className="pomodoro-modal-circle">
          <div className="pomodoro-box">
            <h2>Pomodoro</h2>
            <h3>{currentTask?.nome_tarefa}</h3>

            <div className="circle-timer">{formatTime(timeLeft)}</div>

            <div className="pomodoro-buttons">
              {!isRunning && <button onClick={startTimer}>Iniciar</button>}
              {isRunning && <button onClick={pauseTimer}>Pausar</button>}
              <button onClick={resetTimer}>Resetar</button>
              <button onClick={() => setPomodoroOpen(false)}>Fechar</button>
            </div>

            <div className="pomodoro-settings">
              <label>
                Pomodoro:
                <input
                  type="number"
                  value={pomodoroTime}
                  onChange={(e) => setPomodoroTime(Number(e.target.value))}
                />
              </label>

              <label>
                Pausa curta:
                <input
                  type="number"
                  value={shortBreak}
                  onChange={(e) => setShortBreak(Number(e.target.value))}
                />
              </label>

              <label>
                Pausa longa:
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
