//import axios from "axios";

//const api = axios.create({
//  baseURL: "https://sistema-de-gerenciamento-de-tempo-tarefas.onrender.com/",
//});

//export default api;

// frontend/src/api.js

import axios from "axios";

const api = axios.create({
  // ⚠️ ALTERAÇÃO TEMPORÁRIA: Use o endereço e porta LOCAL do seu Backend
  baseURL: "https://sistema-de-gerenciamento-de-tempo-tarefas.onrender.com/",
});

export default api;