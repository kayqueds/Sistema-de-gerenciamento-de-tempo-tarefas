import axios from "axios";

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
