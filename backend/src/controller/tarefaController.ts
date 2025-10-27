import tarefasModel from "../model/tarefasModel";
import { Request, Response } from "express";

// Buscar todas as tarefas
const getTarefasAll = async (req: Request, res: Response) => {
  try {
    const listTarefas = await tarefasModel.getTarefasAll();
    return res.status(200).json(listTarefas);
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
    return res.status(500).json({ mensagem: "Erro ao buscar tarefas." });
  }
};
// Buscar tarefa por ID
const getTarefaById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const tarefa = await tarefasModel.getTarefaById(id);
    if (!tarefa) {
      return res.status(404).json({ mensagem: "Tarefa não encontrada." });
    }
    return res.status(200).json(tarefa);
  } catch (error) {
    console.error(`Erro ao buscar tarefa com ID ${req.params.id}:`, error);
    return res.status(500).json({ mensagem: "Erro ao buscar tarefa." });
  }
};

// Criar nova tarefa
const createNewTarefa = async (req: Request, res: Response) => {
  try {
    const newTarefa = await tarefasModel.createTarefa(req.body);
    return res.status(201).json(newTarefa);
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    return res.status(400).json({ mensagem: "Erro ao criar tarefa.", erro: (error as Error).message });
  }
};

// Atualizar tarefa completo
const updateTarefa = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await tarefasModel.updateTarefaPartial(id, req.body);
    const updatedTarefa = await tarefasModel.getTarefaById(id);
    return res.status(200).json(updatedTarefa);
  } catch (error) {
    console.error(`Erro ao atualizar tarefa com ID ${req.params.id}:`, error);
    return res.status(400).json({ mensagem: "Erro ao atualizar tarefa.", erro: (error as Error).message });
  }
};
// Deletar tarefa
const deleteTarefa = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await tarefasModel.deleteTarefa(id);
    return res.status(204).send(); // 204 = No Content
  } catch (error) {
    console.error(`Erro ao deletar tarefa com ID ${req.params.id}:`, error);
    return res.status(400).json({ mensagem: "Erro ao deletar tarefa.", erro: (error as Error).message });
  }
};

// Exportando as funções
export default {
  getTarefasAll,
  getTarefaById,
  createNewTarefa,
  updateTarefa,
  deleteTarefa,
};