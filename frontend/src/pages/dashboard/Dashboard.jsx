import { useState, useEffect } from "react";
import "./Dashboard.css";
import { toast } from "react-toastify";
import api from "../../api";
import useSweetAlert from "../../hooks/SweetAlert";
import Sound from "../../hooks/Sound";
import Sidebar from "../../components/common/sidebar/Sidebar.jsx";
import toastOnce from "../../utils/toastOnce";
import Chat from "../../components/Chat/Chat";

function Dashboard() {
  const [tarefas, setTarefas] = useState([]);
  const [form, setForm] = useState({
    titulo: "",
    horario: "",
    data: "",
    prioridade: "Normal",
    descricao: "",
  });
  const [serverImage, setServerImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const { showConfirmation } = useSweetAlert();
  const { playSound, listSound } = Sound();

  // Listar tarefas
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

  useEffect(() => {
    // liberar URL antigo quando trocar a imagem
    return () => {
      if (serverImage) {
        URL.revokeObjectURL(serverImage);
      }
    };
  }, [serverImage]);

  const fetchServerChart = async () => {
    if (!tarefas || tarefas.length === 0) {
      toastOnce("erroSalvar", () => toast.error("Nenhuma tarefa disponível para gerar o gráfico."));
      return;
    }
    setLoadingImage(true);
    try {
      const res = await fetch("http://localhost:5001/grafico/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tarefas }),
      });
      if (!res.ok) {
        let msg = `Erro ${res.status}`;
        try { const j = await res.json(); msg = j.mensagem || j.error || JSON.stringify(j); } catch(e){}
        toastOnce("erroSalvar", () => toast.error(msg));
        setLoadingImage(false);
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setServerImage(url);
    } catch (error) {
      console.error("Erro ao buscar imagem do servidor:", error);
      toastOnce("erroSalvar", () => toast.error("Erro ao gerar gráfico no servidor."));
    } finally {
      setLoadingImage(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Criar ou editar tarefa
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.titulo ||
      !form.descricao ||
      !form.prioridade ||
      !form.horario ||
      !form.data
    ) {
      toast.error("Todos os campos são obrigatórios!!");
      playSound(listSound[2]);
      return;
    }

    try {
      const statusMap = {
        Baixa: "pendente",
        Normal: "em andamento",
        Alta: "concluida",
      };

      const prioridadeMap = {
        Baixa: "Baixa",
        Normal: "Normal",
        Alta: "Alta",
      };

      const tarefaParaBackend = {
        nome_tarefa: form.titulo,
        horario: form.horario || null,
        descricao_tarefa: form.descricao || "",
        data_tarefa: new Date().toISOString().split("T")[0],
        status_tarefa: statusMap[form.prioridade] || "pendente",
        prioridade: prioridadeMap[form.prioridade] || "Normal",
        id_usuario: 1,
      };
      console.log("Tarefa para backend:", tarefaParaBackend);

      if (editIndex !== null) {
        playSound(listSound[3]);
        const confirmar = await showConfirmation(
          "Deseja editar sua tarefa?",
          "Editar"
        );
        if (!confirmar) return;
        await api.put(
          `/tarefas/${tarefas[editIndex].id_tarefa}`,
          tarefaParaBackend
        );
        toast.success("Tarefa atualizada com sucesso!");
        playSound(listSound[1]);
      } else {
        await api.post("/tarefas", tarefaParaBackend);
        toast.success("Tarefa adicionada com sucesso!");
        playSound(listSound[1]);
      }

      const response = await api.get("/tarefas");
      setTarefas(response.data);
      setForm({
        titulo: "",
        horario: "",
        data: "",
        prioridade: "Normal",
        descricao: "",
      });
      setEditIndex(null);
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
      toast.error("Erro ao salvar tarefa.");
      playSound(listSound[2]);
    }
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const handleEdit = (i) => {
    const tarefa = tarefas[i];
    setForm({
      titulo: tarefa.titulo || tarefa.nome_tarefa,
      horario: tarefa.horario || "",
      data: tarefa.data_tarefa ? tarefa.data_tarefa.split("T")[0] : "",
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

  // Deletar tarefa
  const handleDelete = async (i) => {
    try {
      playSound(listSound[3]);
      const confirmar = await showConfirmation(
        "Esta ação não pode ser desfeita.",
        "Deletar"
      );
      if (!confirmar) return;

      const tarefaId = tarefas[i].id_tarefa;
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

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <Sidebar />

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
          <input
            type="date"
            name="data"
            value={form.data}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Descrição"
            name="descricao"
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
          <button onClick={handleSubmit}>
            {editIndex !== null ? "Atualizar" : "Adicionar"}
          </button>
        </div>

        {/* Seção do gráfico (servidor) + Chat */}
        <div style={{ display: 'flex', gap: 16, marginTop: 20, alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div className="server-chart-section">
              <h2>Gráfico de Prioridades</h2>
              <div className="chart-controls" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button onClick={fetchServerChart} disabled={loadingImage}>
                  {loadingImage ? 'Gerando...' : 'Gerar gráfico (server)'}
                </button>
                {serverImage && (
                  <a href={serverImage} download="grafico.png" className="download-btn">
                    Baixar PNG
                  </a>
                )}
              </div>

              {serverImage && (
                <div className="server-chart-preview" style={{ marginTop: 12 }}>
                  <img
                    src={serverImage}
                    alt="Gráfico de prioridades"
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: 8 }}
                  />
                </div>
              )}
            </div>
          </div>

          <div style={{ width: 340 }}>
            <Chat />
          </div>
        </div>

        {/* Lista de tarefas */}
        <div className="tasks-grid">
          {tarefas.length === 0 && (
            <p className="empty">Nenhuma tarefa cadastrada.</p>
          )}
          {tarefas.map((t, i) => (
            <div
              key={i}
              className={`task-card ${prioridadeClass(
                t.prioridade ||
                  (t.status_tarefa === "concluida"
                    ? "Alta"
                    : t.status_tarefa === "em andamento"
                    ? "Normal"
                    : "Baixa")
              )}`}
            >
              <div className="task-info">
                <h3>{t.titulo || t.nome_tarefa}</h3>
                <span>{t.horario || "--:--"}</span>
                <p>{t.descricao_tarefa || ""}</p>
                {t.data_tarefa && <p>📅 {formatarData(t.data_tarefa)}</p>}
              </div>
              <div className="task-actions">
                <button className="edit" onClick={() => handleEdit(i)}>
                  ✏️
                </button>
                <button className="delete" onClick={() => handleDelete(i)}>
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
