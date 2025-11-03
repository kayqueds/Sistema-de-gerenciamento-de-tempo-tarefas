import { connectionModel } from "./connectionModel";
import type { Tarefa } from "../interface/tabelas";

// Funções para as Tarefas CRUD

const getTarefasAll = async () => {
  try {
    const [listTarefas] = await connectionModel.execute(
      "SELECT * FROM tarefas"
    );
    return listTarefas;
  } catch (erro) {
    console.error("Erro ao buscar todos as tarefas:", erro);

    throw erro;
  }
};

const getTarefaById = async (id: number) => {
  try {
    const [tarefa] = await connectionModel.execute(
      "SELECT * FROM tarefas WHERE id = ?",
      [id]
    );
    return tarefa;
  } catch (erro) {
    console.error(`Erro ao buscar tarefa com ID ${id}:`, erro);
    throw erro;
  }
};

const createTarefa = async (body: Tarefa) => {
  const {
    nome_tarefa,
    descricao_tarefa,
    data_tarefa,
    status_tarefa,
    id_usuario,
    horario,
    prioridade,
  } = body;
  if (
    !nome_tarefa ||
    !descricao_tarefa ||
    !data_tarefa ||
    !status_tarefa ||
    !id_usuario
  ) {
    throw new Error("Todos os campos são obrigatórios!");
  }
  try {
    const query =
      "INSERT INTO tarefas(nome_tarefa, descricao_tarefa, data_tarefa, status_tarefa, id_usuario, horario, prioridade) VALUES(?, ?, ?, ?, ?, ?, ?)";
    const [result] = await connectionModel.execute(query, [
      nome_tarefa,
      descricao_tarefa,
      data_tarefa,
      status_tarefa,
      id_usuario,
      horario || null,
      prioridade || "Normal",
    ]);
    return result;
  } catch (erro) {
    console.error("Erro ao criar tarefa:", erro);
    throw erro;
  }
};

const updateTarefa = async (id: number, body: Tarefa) => {
  const {
    nome_tarefa,
    descricao_tarefa,
    data_tarefa,
    status_tarefa,
    id_usuario,
    horario,
    prioridade,
  } = body;

  if (
    !nome_tarefa ||
    !descricao_tarefa ||
    !data_tarefa ||
    !status_tarefa ||
    !id_usuario ||
    !horario ||
    !prioridade
  ) {
    throw new Error(
      "Os campos 'nome_tarefa', 'descricao_tarefa', 'data_tarefa', 'status_tarefa', 'id_usuario', 'horario' e 'prioridade' são obrigatórios!"
    );
  }

  try {
    const query =
      "UPDATE tarefas SET nome_tarefa=?, descricao_tarefa=?, data_tarefa=?, status_tarefa=?, id_usuario=?, horario=?, prioridade=? WHERE id = ?";
    const [result] = await connectionModel.execute(query, [
      nome_tarefa,
      descricao_tarefa,
      data_tarefa,
      status_tarefa,
      id_usuario,
      horario || null,
      prioridade || "Normal",
      id,
    ]);
    return result;
  } catch (erro) {
    console.error(`Erro ao atualizar tarefa com ID ${id}:`, erro);
    throw erro;
  }
};

const updateTarefaPartial = async (id: number, updates: Partial<Tarefa>) => {
  try {
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) {
      throw new Error("Nenhum campo foi fornecido para atualização parcial.");
    }

    const setClause = fields.map((f) => `${f} = ?`).join(", ");
    const query = `UPDATE tarefas SET ${setClause} WHERE id = ?`;
    const [result] = await connectionModel.execute(query, [...values, id]);
    return result;
  } catch (erro) {
    console.error(
      `Erro ao atualizar parcialmente a tarefa com ID ${id}:`,
      erro
    );
    throw erro;
  }
};

const deleteTarefa = async (id: number) => {
  try {
    const [result] = await connectionModel.execute(
      "DELETE FROM tarefas WHERE id = ?",
      [id]
    );
    return result;
  } catch (erro) {
    console.error(`Erro ao deletar tarefa com ID ${id}:`, erro);
    throw erro;
  }
};

export default {
  getTarefasAll,
  getTarefaById,
  createTarefa,
  updateTarefa,
  updateTarefaPartial,
  deleteTarefa,
};
