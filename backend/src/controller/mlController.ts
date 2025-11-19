// backend/src/controller/mlController.ts

import { Request, Response } from 'express';
import mlModel from '../model/mlModel'; // Importa o Model de ML

// 1. Controller para a Rota POST /prever
const prever = async (req: Request, res: Response) => {
  const { usuarioID, tempoTrabalho } = req.body;

  // Conversão segura para números
  const numericUserID = Number(usuarioID);
  const numericTempoTrabalho = Number(tempoTrabalho);

  // Validação de entrada
  if (!numericUserID || isNaN(numericTempoTrabalho) || numericTempoTrabalho <= 0) {
    return res.status(400).json({ 
      error: "Dados de entrada inválidos. Certifique-se de que o ID do usuário e o tempo de trabalho são números válidos." 
    });
  }

  try {
    // Chama a função de previsão do Model
    const descansoPrevisto = await mlModel.preverDescanso(numericUserID, numericTempoTrabalho);

    res.json({
      usuarioID: numericUserID,
      tempoTrabalho: numericTempoTrabalho,
      descansoPrevisto: descansoPrevisto, 
    });

  } catch (error) {
    console.error("Erro no Controller ao prever descanso:", error);

    // Trata o erro específico de dados insuficientes do Model
    if (error instanceof Error && error.message.includes("Dados insuficientes")) {
       return res.status(400).json({
          error: "Usuário ainda não tem dados suficientes (mínimo 2 tarefas concluídas) para gerar previsão."
       });
    }

    // Erro genérico do servidor/banco
    res.status(500).json({ error: "Erro interno do servidor ao processar a previsão." });
  }
};


// 2. Controller para a Rota POST /retrain
const retrain = async (req: Request, res: Response) => {
  const { usuarioID } = req.body;
  const numericUserID = Number(usuarioID);

  // Validação de entrada
  if (!numericUserID) {
    return res.status(400).json({ error: "ID do usuário inválido." });
  }

  try {
    // Chama a função de retreinamento do Model
    await mlModel.treinarModeloUsuario(numericUserID);

    res.json({ message: `Modelo do usuário ${usuarioID} atualizado com sucesso!` });
    
  } catch (error) {
    console.error("Erro no Controller ao re-treinar:", error);

    if (error instanceof Error && error.message.includes("Dados insuficientes")) {
       return res.status(400).json({
          error: "Não foi possível re-treinar. Usuário não possui dados suficientes (mínimo 2 tarefas concluídas)."
       });
    }

    // Erro genérico
    res.status(500).json({ error: "Erro interno do servidor ao tentar re-treinar o modelo." });
  }
};

export default {
  prever,
  retrain
};