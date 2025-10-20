import { connectionModel } from "./connectionModel";
import type { Usuario } from "../interface/tabelas";

const getUsuariosAll = async () => {
  try {
    const [listUsuarios] = await connectionModel.execute("SELECT * FROM usuarios");
    return listUsuarios;
  } catch (erro) {
    console.error("Erro ao buscar todos os usuários:", erro);
    throw erro;
  }
};

const getUsuarioById = async (id: number) => {
  try {
    const [usuario] = await connectionModel.execute("SELECT * FROM usuarios WHERE id = ?", [id]);
    return usuario;
  } catch (erro) {
    console.error(`Erro ao buscar usuário com ID ${id}:`, erro);
    throw erro;
  }
};

const createUsuario = async (body: Usuario) => {
  const { nome_usuario, email_usuario, senha_usuario } = body;

  if (!nome_usuario || !email_usuario || !senha_usuario) {
    throw new Error("Os campos 'nome_usuario', 'email_usuario' e 'senha_usuario' são obrigatórios!");
  }

  try {
    const query = "INSERT INTO usuarios(nome_usuario, email_usuario, senha_usuario) VALUES(?, ?, ?)";
    const [result] = await connectionModel.execute(query, [nome_usuario, email_usuario, senha_usuario]);
    return result;
  } catch (erro) {
    console.error("Erro ao criar usuário:", erro);
    throw erro;
  }
};

const updateUsuario = async (id: number, body: Usuario) => {
  const { nome_usuario, email_usuario, senha_usuario } = body;

  if (!nome_usuario || !email_usuario || !senha_usuario) {
    throw new Error("Os campos 'nome_usuario', 'email_usuario' e 'senha_usuario' são obrigatórios!");
  }

  try {
    const query = "UPDATE usuarios SET nome_usuario=?, email_usuario=?, senha_usuario=? WHERE id = ?";
    const [result] = await connectionModel.execute(query, [nome_usuario, email_usuario, senha_usuario, id]);
    return result;
  } catch (erro) {
    console.error(`Erro ao atualizar usuário com ID ${id}:`, erro);
    throw erro;
  }
};

const updateUsuarioPartial = async (id: number, updates: Partial<Usuario>) => {
  try {
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) {
      throw new Error("Nenhum campo foi fornecido para atualização parcial.");
    }

    const setClause = fields.map((f) => `${f} = ?`).join(", ");
    const query = `UPDATE usuarios SET ${setClause} WHERE id = ?`;
    const [result] = await connectionModel.execute(query, [...values, id]);
    return result;
  } catch (erro) {
    console.error(`Erro ao atualizar parcialmente o usuário com ID ${id}:`, erro);
    throw erro;
  }
};

const deleteUsuario = async (id: number) => {
  try {
    const [result] = await connectionModel.execute("DELETE FROM usuarios WHERE id = ?", [id]);
    return result;
  } catch (erro) {
    console.error(`Erro ao deletar usuário com ID ${id}:`, erro);
    throw erro;
  }
};

export default {
  getUsuariosAll,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  updateUsuarioPartial,
  deleteUsuario,
};