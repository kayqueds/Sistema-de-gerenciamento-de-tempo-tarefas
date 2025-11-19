// backend/src/model/mlModel.ts

// Usaremos 'require' pois o TensorFlow.js em Node.js geralmente requer CommonJS
const tf = require('@tensorflow/tfjs'); 
import { connectionModel } from "./connectionModel"; // Importa sua conexão existente

// Armazena modelos de cada usuário separadamente
const modelos = new Map<number, any>(); // Usando 'any' para o modelo do TF, ou defina um tipo se necessário

// --- 1. FUNÇÃO DE BUSCA DE DADOS ---
// Busca as colunas duracao_trabalho e duracao_descanso da tabela tarefas
async function carregarDadosUsuario(usuarioID: number): Promise<any[]> {
  try {
    // Usando a instância de conexão do seu projeto
    // Note que o seu banco (PostgreSQL) exige as colunas 'duracao_trabalho' e 'duracao_descanso'
    // Se estas colunas não existirem, o erro 400 persistirá.
    const query = `
      SELECT duracao_trabalho, duracao_descanso 
      FROM tarefas 
      WHERE id_usuario = $1 AND status_tarefa = 'concluida'
    `;
    
    // O $1 é a sintaxe correta para PostgreSQL
    const res = await connectionModel.query(query, [usuarioID]);
    return res.rows; 

  } catch (err) {
    console.error(`Erro ao buscar dados do usuário ${usuarioID} (ML Model):`, err);
    // Lança um erro para que o Controller possa capturá-lo
    throw new Error("Falha ao carregar dados do banco de dados para ML.");
  }
}

// --- 2. FUNÇÃO DE TREINAMENTO ---
async function treinarModeloUsuario(usuarioID: number): Promise<any | null> {
  console.log(`Iniciando treinamento para o usuário ${usuarioID}...`);
  const dados = await carregarDadosUsuario(usuarioID);

  if (dados.length < 2) {
    console.log(`Usuário ${usuarioID}: poucos dados (${dados.length}) para treinar.`);
    return null; // Retorna nulo se não houver dados suficientes
  }

  // Mapeamento e criação dos tensores (TypeScript/JavaScript)
  const xs = tf.tensor2d(dados.map(d => [d.duracao_trabalho]));
  const ys = tf.tensor2d(dados.map(d => [d.duracao_descanso]));

  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [1], units: 1 }));
  model.compile({ optimizer: "sgd", loss: "meanSquaredError" });

  await model.fit(xs, ys, { epochs: 200 });
  
  modelos.set(usuarioID, model);
  console.log(`Modelo treinado com sucesso para o usuário ${usuarioID}!`);
  return model;
}

// --- 3. FUNÇÃO DE PREVISÃO ---
async function preverDescanso(usuarioID: number, tempoTrabalho: number): Promise<string> {
  // 1. Treina o modelo se ainda não existir
  if (!modelos.has(usuarioID)) {
    const novoModelo = await treinarModeloUsuario(usuarioID);
    if (!novoModelo) {
        // Lançamos um erro que o Controller irá capturar para retornar o 400 Bad Request
        throw new Error("Dados insuficientes para gerar previsão.");
    }
  }

  const model = modelos.get(usuarioID);
  
  // Isso não deve acontecer se o treinarModeloUsuario for bem-sucedido
  if (!model) {
     throw new Error("Modelo não disponível após tentativa de treinamento.");
  }

  // 2. Faz a previsão
  const entrada = tf.tensor2d([[tempoTrabalho]]);
  const saida = model.predict(entrada) as any;
  const previsao = saida.dataSync()[0];

  return previsao.toFixed(1);
}

export default {
  preverDescanso,
  treinarModeloUsuario // Exportado para ser usado na rota /retrain
};