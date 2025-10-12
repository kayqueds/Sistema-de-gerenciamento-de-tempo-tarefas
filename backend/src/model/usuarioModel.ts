import { connectionModel } from "./connectionModel";
import type { Usuario } from "../interface/tabelas";

const getUsuariosAll = async () => {
  const [listUsuarios] = await connectionModel.execute("SELECT * FROM usuarios");
  return listUsuarios;
};

const getUsuarioById = async (id: number) => {
  const [usuario] = await connectionModel.execute("SELECT * FROM usuarios WHERE id = ?", [id]);
  return usuario;
};

const createUsuario = async (body: Usuario) => {
  const { nome_usuario, email_usuario, senha_usuario } = body;

  if (!nome_usuario || !email_usuario || !senha_usuario) {
    throw new Error("Os campos 'nome_usuario', 'email_usuario' e 'senha_usuario' são obrigatórios!");
  }

  const query = "INSERT INTO usuarios(nome_usuario, email_usuario, senha_usuario) VALUES(?, ?, ?)";
  const [result] = await connectionModel.execute(query, [nome_usuario, email_usuario, senha_usuario]);
  return result;
};

const updateUsuario = async (id: number, body: Usuario) => {
  const { nome_usuario, email_usuario, senha_usuario } = body;

  if (!nome_usuario || !email_usuario || !senha_usuario) {
    throw new Error("Os campos 'nome_usuario', 'email_usuario' e 'senha_usuario' são obrigatórios!");
  }

  const query = "UPDATE usuarios SET nome_usuario=?, email_usuario=?, senha_usuario=? WHERE id = ?";
  const [result] = await connectionModel.execute(query, [nome_usuario, email_usuario, senha_usuario, id]);
  return result;
};

const updateUsuarioPartial = async (id: number, updates: Partial<Usuario>) => {
  const fields = Object.keys(updates);
  const values = Object.values(updates);
  const setClause = fields.map((f) => `${f} = ?`).join(", ");
  const query = `UPDATE usuarios SET ${setClause} WHERE id = ?`;
  const [result] = await connectionModel.execute(query, [...values, id]);
  return result;
};

const deleteUsuario = async (id: number) => {
  const [result] = await connectionModel.execute("DELETE FROM usuarios WHERE id = ?", [id]);
  return result;
};

export default {
  getUsuariosAll,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  updateUsuarioPartial,
  deleteUsuario,
};
