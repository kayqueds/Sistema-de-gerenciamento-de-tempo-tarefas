import { connectionModel } from "../model/connectionModel";

// Função para buscar tarefas concluídas do usuário
export const getTarefasConcluidas = async (usuarioID: number) => {
  const query = `
    SELECT tempo_trabalho, tempo_descanso
    FROM tarefas
    WHERE id_usuario = $1 AND status_tarefa = 'concluida'
  `;
  const result = await connectionModel.query(query, [usuarioID]);
  return result.rows;
};

// Função para salvar o modelo treinado no banco de dados
export const saveModelo = async (usuarioID: number, modelo: any) => {
  const query = 'UPDATE usuarios SET modelo_ml = $1 WHERE id_usuario = $2';
  await connectionModel.query(query, [JSON.stringify(modelo), usuarioID]);
};

// Função para buscar o modelo treinado do usuário
export const getModelo = async (usuarioID: number) => {
  const query = 'SELECT modelo_ml FROM usuarios WHERE id_usuario = $1';
  const result = await connectionModel.query(query, [usuarioID]);
  return result.rows[0]?.modelo_ml;
};

// Função para treinar um modelo de regressão linear simples
export const treinarModelo = (X: number[], y: number[]) => {
  const n = X.length;
  const sumX = X.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = X.reduce((a, val, i) => a + val * y[i], 0);
  const sumX2 = X.reduce((a, b) => a + b * b, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
};

// Função para fazer previsões com o modelo
export const preverDescanso = (modelo: { slope: number; intercept: number }, tempoTrabalho: number) => {
  return modelo.slope * tempoTrabalho + modelo.intercept;
};
