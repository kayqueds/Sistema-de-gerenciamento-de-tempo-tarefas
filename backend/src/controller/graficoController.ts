// src/controller/graficoController.ts
import { Request, Response } from "express";
import { getTarefasConcluidas, saveModelo, getModelo, treinarModelo, preverDescanso } from "../model/graficoModel";

const prever = async (req: Request, res: Response) => {
  try {
    const { usuarioID, tempoTrabalho } = req.body;
    const modelo = await getModelo(usuarioID);

    if (!modelo) {
      return res.status(400).json({ error: 'Modelo não treinado. Chame /retrain primeiro.' });
    }

    const descansoPrevisto = preverDescanso(modelo, tempoTrabalho);
    res.json({ descansoPrevisto });
  } catch (error) {
    console.error("Erro ao fazer previsão:", error);
    res.status(500).json({ error: 'Erro ao fazer previsão.' });
  }
};

const retrain = async (req: Request, res: Response) => {
  try {
    const { usuarioID } = req.body;
    const tarefas = await getTarefasConcluidas(usuarioID);

    if (tarefas.length < 2) {
      return res.status(400).json({ error: 'Usuário precisa ter pelo menos 2 tarefas concluídas.' });
    }

    const X = tarefas.map((t: any) => t.tempo_trabalho);
    const y = tarefas.map((t: any) => t.tempo_descanso);
    const modelo = treinarModelo(X, y);

    await saveModelo(usuarioID, modelo);
    res.json({ message: 'Modelo retreinado com sucesso!' });
  } catch (error) {
    console.error("Erro ao retreinar o modelo:", error);
    res.status(500).json({ error: 'Erro ao retreinar o modelo.' });
  }
};

export default {
  prever,
  retrain,
};
