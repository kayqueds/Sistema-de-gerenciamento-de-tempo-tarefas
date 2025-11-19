// PomodoroChart.jsx (dentro de pages/grafico/)

import React, { useState } from "react";
import api from "../../api"; // Usa a instância 'api' configurada (URL do Render)
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function PomodoroChart() {
  // ID do usuário inicializado com valor de teste
  const [usuarioID, setUsuarioID] = useState("48"); 
  const [tempoTrabalho, setTempoTrabalho] = useState(25);
  const [previsao, setPrevisao] = useState(null);
  const [dados, setDados] = useState([]);

  // Faz previsão personalizada para o usuário
  const prever = async () => {
    try {
      // ✅ CORRIGIDO: Chama a rota /prever na API REST principal (via api.js)
      const res = await api.post("/prever", {
        usuarioID: Number(usuarioID),
        tempoTrabalho: Number(tempoTrabalho),
      });

      setPrevisao(res.data.descansoPrevisto);

      setDados([
        ...dados,
        {
          trabalho: tempoTrabalho,
          descansoPrevisto: res.data.descansoPrevisto,
        },
      ]);
    } catch (error) {
      console.error("Erro ao buscar previsão:", error);
      // O alerta agora se refere às causas reais do erro 400
      alert("Erro ao buscar previsão. Verifique se o Backend está rodando (após o deploy) e se o usuário tem dados suficientes no Supabase (mínimo 2 tarefas concluídas).");
    }
  };

  // Re-treina o modelo do usuário (após novas tarefas concluídas)
  const retrain = async () => {
    try {
        // ✅ CORRIGIDO: Chama a rota /retrain na API REST principal
        await api.post("/retrain", { 
            usuarioID: Number(usuarioID),
        });
        alert("Modelo retreinado com sucesso! Tente uma nova previsão.");
    } catch (error) {
        console.error("Erro ao re-treinar:", error);
        alert("Erro ao re-treinar o modelo. Verifique os logs do Backend.");
    }
  };

  const data = {
    labels: dados.map((d, i) => `Tarefa ${i + 1}`),
    datasets: [
      {
        label: "Tempo de Trabalho (min)",
        data: dados.map(d => d.trabalho),
        borderColor: "blue",
        fill: false,
      },
      {
        label: "Descanso Previsto (min)",
        data: dados.map(d => d.descansoPrevisto),
        borderColor: "green",
        fill: false,
      },
    ],
  };

  return (
    <div style={{ width: "650px", margin: "auto", textAlign: "center" }}>
      <h2>Inteligência de Produtividade (Pomodoro ML por Usuário)</h2>
      
      {/* Inputs com valor de teste para começar */}
      <input
        type="number"
        placeholder="ID do Usuário"
        value={usuarioID}
        onChange={(e) => setUsuarioID(e.target.value)}
        style={{ padding: 8, margin: 5 }}
      />
      <br />
      <input
        type="number"
        placeholder="Tempo de trabalho (min)"
        value={tempoTrabalho}
        onChange={(e) => setTempoTrabalho(e.target.value)}
        style={{ padding: 8, margin: 5 }}
      />
      <br />
      
      <button onClick={prever} style={{ padding: 8, margin: 5 }}>
        Prever Descanso
      </button>
      
      <button onClick={retrain} style={{ padding: 8, margin: 5 }}>
        Atualizar Modelo
      </button>
      
      {previsao !== null && (
        <p style={{ marginTop: 10 }}>
          Descanso sugerido: <strong>{previsao}</strong> minutos
        </p>
      )}
      
      <div style={{ marginTop: 40 }}>
        <Line data={data} />
      </div>
    </div>
  );
}