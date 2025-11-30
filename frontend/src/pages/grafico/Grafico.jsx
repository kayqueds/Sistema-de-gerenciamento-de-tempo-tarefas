import React, { useState, useEffect, useRef } from "react";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { toast } from "react-toastify";
import api from "../../api";
import Sidebar from "../../components/common/sidebar/Sidebar";
import toastOnce from "../../utils/toastOnce";
import Sound from "../../hooks/Sound";
import "./Grafico.css"; // Importa o CSS

const { playSound, listSound } = Sound();
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const CHATBOT_API_URL =
  import.meta.env.VITE_CHATBOT_API_URL || "http://localhost:5001";

export default function GraficoPrioridades() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tarefasSidebar, setTarefasSidebar] = useState([]); // Funções e lógica de download (omitidas para brevidade, pois permanecem as mesmas)

  const chartRef = useRef(null);
  const baixarGrafico = () => {
    const chart = chartRef.current;

    if (!chart) {
      toast.error("Gráfico não está pronto para download.");
      return;
    }

    try {
      const canvas = chart.canvas;
      const imageURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imageURL;
      link.download = "grafico_prioridades.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Download do gráfico iniciado!");
      playSound(listSound[1]);
    } catch (e) {
      console.error("Erro ao tentar baixar o gráfico:", e);
      toast.error("Falha no download do gráfico.");
    }
  };

  useEffect(() => {
    async function fetchAndProcessChartData() {
      setLoading(true);
      setError(null);
      try {
        const tarefasResponse = await api.get("/tarefas");
        const tarefas = tarefasResponse.data;

        if (!tarefas || tarefas.length === 0) {
          setChartData(null);
          setLoading(false);
          toastOnce("noData", () =>
            toast.info("Nenhuma tarefa disponível para gerar o gráfico.")
          );
          return;
        }

        const flaskResponse = await fetch(`${CHATBOT_API_URL}/grafico/data`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tarefas }),
        });

        if (!flaskResponse.ok) {
          throw new Error(
            `Falha ao buscar dados do Flask: ${flaskResponse.status}`
          );
        }

        const data = await flaskResponse.json();

        setChartData({
          labels: data.labels,
          datasets: [
            {
              label: "Distribuição de Tarefas",
              data: data.values,
              backgroundColor: ["#ef4444", "#f59e0b", "#10b981", "#9ca3af"],
              borderColor: ["#fff"],
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        console.error("Erro ao carregar o gráfico:", err);
        setError(
          "Erro ao carregar o gráfico. Verifique a conexão com o servidor."
        );
        toastOnce("chartError", () =>
          toast.error("Erro ao carregar o gráfico.")
        );
        setChartData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchAndProcessChartData();
    // Buscar tarefas para a Sidebar
    const fetchTarefasSidebar = async () => {
      try {
        const resp = await api.get("/tarefas");
        const items = resp.data || [];
        const normalized = items.map((t) => ({
          ...t,
          prioridade: t.prioridade
            ? t.prioridade.charAt(0).toUpperCase() + t.prioridade.slice(1)
            : "Normal",
        }));
        const order = { Alta: 1, Normal: 2, Baixa: 3 };
        const ordered = normalized.sort(
          (a, b) => order[a.prioridade] - order[b.prioridade]
        );
        setTarefasSidebar(ordered);
      } catch (e) {
        console.error("Erro ao buscar tarefas para sidebar:", e);
      }
    };
    fetchTarefasSidebar();
  }, []); // --------------------------------------- // ⚙️ OPÇÕES DO GRÁFICO (Inalterada) // ---------------------------------------

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "Distribuição de Tarefas por Prioridade",
      },
      datalabels: {
        color: "#fff",
        font: {
          weight: "bold",
          size: 14,
        },
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce(
            (sum, v) => sum + v,
            0
          );
          if (total === 0) return "";
          const percentage = ((value / total) * 100).toFixed(1) + "%";
          return percentage;
        },
      },
    },
  };

  let content;

  // ⭐️ APLICAÇÃO DAS CLASSES CSS NAS MENSAGENS DE STATUS
  if (loading) {
    content = (
      <div className="chart-status-message chart-loading">
        Carregando gráfico...
      </div>
    );
  } else if (error) {
    content = <div className="chart-status-message chart-error">{error}</div>;
  } else if (!chartData) {
    content = (
      <div className="chart-status-message chart-no-data">
        Nenhum dado de tarefas para exibir.
      </div>
    );
  } else {
    // Conteúdo principal (Gráfico e Botão)
    content = (
      <>
        <h3 style={{ marginBottom: "15px", color: "#334e68" }}>
          Distribuição de Tarefas
        </h3>

        {/* ⭐️ CLASSE PARA DIMENSIONAMENTO DO GRÁFICO */}
        <div className="chart-canvas-container">
          <Pie data={chartData} options={options} ref={chartRef} />
        </div>

        {/* ⭐️ CLASSE PARA ESTILIZAÇÃO DO BOTÃO */}
        <button onClick={baixarGrafico} className="download-button">
          ⬇️ Baixar Gráfico (PNG)
        </button>
      </>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar tarefas={tarefasSidebar} refreshTasks={null} />

      <div className="dashboard-content">
        <div className="max-w-sm mx-auto p-6 bg-white shadow-xl rounded-xl text-center">
          {content}
        </div>
      </div>
    </div>
  );
}
