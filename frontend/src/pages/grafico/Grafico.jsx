import React, { useState, useEffect, useRef } from 'react'; // ⭐️ Importe useRef
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels'; 
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { toast } from "react-toastify";
import api from "../../api";
import toastOnce from "../../utils/toastOnce";
import Sound from '../../hooks/Sound';
import './Grafico.css'

const { playSound, listSound } = Sound();
// 1. Registro dos elementos do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const CHATBOT_API_URL = import.meta.env.VITE_CHATBOT_API_URL || 'http://localhost:5001';

export default function GraficoPrioridades() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    // função para baixar o gráfico como PNG
    const chartRef = useRef(null); 
        const baixarGrafico = () => {
        const chart = chartRef.current;
        
        if (!chart) {
            toast.error("Gráfico não está pronto para download.");
            return;
        }

        try {
            const canvas = chart.canvas;
            const imageURL = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = imageURL;
            link.download = 'grafico_prioridades.png'; 
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
// Aqui busca as tarefas e processa os dados para o gráfico
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
          toastOnce("noData", () => toast.info("Nenhuma tarefa disponível para gerar o gráfico."));
          return;
        }

        const flaskResponse = await fetch(`${CHATBOT_API_URL}/grafico/data`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tarefas }), 
        });

        if (!flaskResponse.ok) {
          throw new Error(`Falha ao buscar dados do Flask: ${flaskResponse.status}`);
        }

        const data = await flaskResponse.json();
        
        setChartData({
          labels: data.labels,
          datasets: [
            {
              label: 'Distribuição de Tarefas',
              data: data.values,
              backgroundColor: [
                '#ef4444', 
                '#f59e0b', 
                '#10b981', 
                '#9ca3af', 
              ],
              borderColor: ['#fff'],
              borderWidth: 1,
            },
          ],
        });

      } catch (err) {
        console.error("Erro ao carregar o gráfico:", err);
        setError("Erro ao carregar o gráfico. Verifique a conexão com o servidor.");
        toastOnce("chartError", () => toast.error("Erro ao carregar o gráfico."));
        setChartData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchAndProcessChartData();
  }, []); 

  // ---------------------------------------
  // ⚙️ OPÇÕES DO GRÁFICO (Inalterada)
  // ---------------------------------------
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right', 
      },
      title: {
        display: true,
        text: 'Distribuição de Tarefas por Prioridade',
      },
      datalabels: {
        color: '#fff', 
        font: {
            weight: 'bold',
            size: 14,
        },
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce((sum, v) => sum + v, 0);
          if (total === 0) return '';
          const percentage = ((value / total) * 100).toFixed(1) + '%';
          return percentage;
        }
      }
    },
  };

  if (loading) return <div className="text-center p-4 font-semibold font-family-sans">Carregando gráfico...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!chartData) return <div className="text-gray-500 text-center p-4">Nenhum dado de tarefas para exibir.</div>;

  return (
    <div className="w-full max-w-md mx-auto p-4">
        {/* ⭐️ Anexa a referência ao componente Pie */}
      <Pie 
            data={chartData} 
            options={options} 
            ref={chartRef} 
        />
        
        {/* ⭐️ Adiciona o botão de download */}
        <button 
            onClick={baixarGrafico}
            className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-150"
        >
            ⬇️ Baixar Gráfico (PNG)
        </button>
    </div>
  );
}