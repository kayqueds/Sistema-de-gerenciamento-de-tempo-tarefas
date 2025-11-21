import axios from "axios";

// Prioridade: usar variável de ambiente VITE_API_URL para alternar entre
// backend local e a URL de produção. Se não definida, usamos localhost:3000
// (útil para desenvolvimento local).
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/";

const api = axios.create({
  baseURL: "https://sistema-de-gerenciamento-de-tempo-tarefas.onrender.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

export const savePomodoro = async (pomodoroData) => {
  try {
    const response = await api.post("/pomodoros", pomodoroData);
    return response.data;
  } catch (error) {
    console.error("Erro ao salvar Pomodoro:", error);
    throw error;
  }
};

export default api;
