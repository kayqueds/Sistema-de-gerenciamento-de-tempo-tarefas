import { connectionModel } from "./connectionModel";
import type { Tarefa } from "../interface/tabelas";

// Funções para as Tarefas CRUD

const getTarefasAll = async () => {
  try {
    const listTarefas = await connectionModel.query(
      "SELECT * FROM tarefas"
    );
    return listTarefas.rows;
  } catch (erro) {
    console.error("Erro ao buscar todos as tarefas:", erro);

    throw erro;
  }
};

const getTarefaById = async (id: number) => {
  try {
    const tarefa = await connectionModel.query(
      "SELECT * FROM tarefas WHERE id_tarefa = $1",
      [id]
    );
    return tarefa.rows;
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
      "INSERT INTO tarefas(nome_tarefa, descricao_tarefa, data_tarefa, status_tarefa, id_usuario, horario, prioridade) VALUES($1, $2, $3, $4, $5, $6, $7)";
    const result = await connectionModel.query(query, [
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
      "UPDATE tarefas SET nome_tarefa=$1, descricao_tarefa=$2, data_tarefa=$3, status_tarefa=$4, id_usuario=$5, horario=$6, prioridade=$7 WHERE id_tarefa = $8";
    const result = await connectionModel.query(query, [
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

    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");
    const query = `UPDATE tarefas SET ${setClause} WHERE id_tarefa = $${fields.length + 1}`;
    const result = await connectionModel.query(query, [...values, id]);
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
    const result = await connectionModel.query(
      "DELETE FROM tarefas WHERE id_tarefa = $1",
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
