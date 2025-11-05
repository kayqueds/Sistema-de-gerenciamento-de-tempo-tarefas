import axios from "axios";

const api = axios.create({
  baseURL: "https://sistema-de-gerenciamento-de-tempo-tarefas.onrender.com/",
});

export default api;
