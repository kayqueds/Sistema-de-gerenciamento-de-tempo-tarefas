import { useState, useEffect, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import { toast } from "react-toastify";
import api from "../../api";
import Sidebar from "../../components/common/sidebar/Sidebar";
import "./Calendario.css";

function Calendario() {
  const [events, setEvents] = useState([]);
  const [tarefasSidebar, setTarefasSidebar] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [novaTarefaData, setNovaTarefaData] = useState({
    dataHora: "",
    nome: "",
    descricao: "",
    prioridade: "Normal",
    status: "pendente",
  });

  // --------------------------- FETCH TAREFAS ---------------------------
  const fetchTarefas = useCallback(async () => {
    try {
      const response = await api.get("/tarefas");

      // Normaliza prioridade (Maiúscula)
      const normalizadas = response.data.map((t) => ({
        ...t,
        prioridade:
          t.prioridade.charAt(0).toUpperCase() + t.prioridade.slice(1),
      }));

      // Ordenar: Alta → Normal → Baixa
      const prioridades = { Alta: 1, Normal: 2, Baixa: 3 };

      const ordenadas = normalizadas.sort(
        (a, b) => prioridades[a.prioridade] - prioridades[b.prioridade]
      );

      // Sidebar recebe tarefas ordenadas
      setTarefasSidebar(ordenadas);

      // Eventos do calendário
      const mappedEvents = ordenadas.map((t) => {
        const data = t.data_tarefa ? t.data_tarefa.split("T")[0] : null;
        const horario = t.horario || "09:00";

        return {
          id: t.id_tarefa.toString(),
          title: t.nome_tarefa,
          start: data ? `${data}T${horario}` : new Date(),
          allDay: false,
          extendedProps: {
            descricao: t.descricao_tarefa,
            prioridade: t.prioridade,
            status: t.status_tarefa,
          },
        };
      });

      setEvents(mappedEvents);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
      toast.error("Erro ao buscar tarefas.");
    }
  }, []);

  useEffect(() => {
    fetchTarefas();
  }, [fetchTarefas]);

  // --------------------------- CLICK NO CALENDÁRIO ---------------------------
  const handleDateClick = useCallback(
    (info) => {
      setNovaTarefaData({
        ...novaTarefaData,
        dataHora: info.dateStr + "T09:00",
      });
      setModalOpen(true);
    },
    [novaTarefaData]
  );

  // --------------------------- CRIAR NOVA TAREFA ---------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!novaTarefaData.nome) {
      toast.error("O nome da tarefa é obrigatório!");
      return;
    }

    const [data, horario] = novaTarefaData.dataHora.split("T");

    const novaTarefa = {
      nome_tarefa: novaTarefaData.nome,
      descricao_tarefa: novaTarefaData.descricao,
      data_tarefa: data,
      horario: horario || "09:00",
      prioridade: novaTarefaData.prioridade,
      status_tarefa: novaTarefaData.status,
      id_usuario: 48,
    };

    try {
      await api.post("/tarefas", novaTarefa);

      toast.success("Tarefa criada!");
      setModalOpen(false);

      setNovaTarefaData({
        dataHora: "",
        nome: "",
        descricao: "",
        prioridade: "Normal",
        status: "pendente",
      });

      fetchTarefas();
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      toast.error("Erro ao criar tarefa.");
    }
  };

  // --------------------------- DRAG & DROP ---------------------------
  const handleEventDrop = useCallback(
    async (info) => {
      const tarefaId = info.event.id;

      try {
        await api.put(`/tarefas/${tarefaId}`, {
          data_tarefa: info.event.start.toISOString().split("T")[0],
          horario: info.event.start.toTimeString().slice(0, 5),
        });

        toast.success("Tarefa atualizada!");

        fetchTarefas();
      } catch (error) {
        console.error("Erro ao atualizar tarefa:", error);
        toast.error("Erro ao atualizar tarefa.");
        info.revert();
      }
    },
    [fetchTarefas]
  );

  return (
    <div className="dashboard-layout">
      {/* Sidebar recebe as tarefas ordenadas */}
      <Sidebar tarefas={tarefasSidebar} refreshTasks={fetchTarefas} />

      <div className="dashboard-content">
        <h1>Calendário de Tarefas</h1>

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale={ptBrLocale}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          dateClick={handleDateClick}
          editable={true}
          eventDrop={handleEventDrop}
          height="80vh"
        />

        {/* --------------------------- MODAL --------------------------- */}
        {modalOpen && (
          <div className="modal-overlay" onClick={() => setModalOpen(false)}>
            <div className="modal-wrapper" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <h2>Criar Nova Tarefa</h2>

                <form onSubmit={handleSubmit}>
                  <label>Nome</label>
                  <input
                    type="text"
                    value={novaTarefaData.nome}
                    onChange={(e) =>
                      setNovaTarefaData({
                        ...novaTarefaData,
                        nome: e.target.value,
                      })
                    }
                    required
                  />

                  <label>Descrição</label>
                  <textarea
                    value={novaTarefaData.descricao}
                    onChange={(e) =>
                      setNovaTarefaData({
                        ...novaTarefaData,
                        descricao: e.target.value,
                      })
                    }
                  />

                  <label>Data e Hora</label>
                  <input
                    type="datetime-local"
                    value={novaTarefaData.dataHora}
                    onChange={(e) =>
                      setNovaTarefaData({
                        ...novaTarefaData,
                        dataHora: e.target.value,
                      })
                    }
                    required
                  />

                  <label>Prioridade</label>
                  <select
                    value={novaTarefaData.prioridade}
                    onChange={(e) =>
                      setNovaTarefaData({
                        ...novaTarefaData,
                        prioridade: e.target.value,
                      })
                    }
                  >
                    <option>Alta</option>
                    <option>Normal</option>
                    <option>Baixa</option>
                  </select>

                  <label>Status</label>
                  <select
                    value={novaTarefaData.status}
                    onChange={(e) =>
                      setNovaTarefaData({
                        ...novaTarefaData,
                        status: e.target.value,
                      })
                    }
                  >
                    <option>pendente</option>
                    <option>concluída</option>
                  </select>

                  <div className="modal-buttons">
                    <button type="submit">Salvar</button>
                    <button type="button" onClick={() => setModalOpen(false)}>
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Calendario;
