import { connectionModel } from "./connectionModel";
import type { Usuario } from "../interface/tabelas";
import {hash} from "bcrypt";
import { compare } from "bcrypt";

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
    const hashedPassword = await hash(senha_usuario, 10);
    const query = "INSERT INTO usuarios(nome_usuario, email_usuario, senha_usuario) VALUES(?, ?, ?)";
    const [result] = await connectionModel.execute(query, [nome_usuario, email_usuario, hashedPassword]);
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
    const hashedPassword = await hash(senha_usuario, 10);
    const query = "UPDATE usuarios SET nome_usuario=?, email_usuario=?, senha_usuario=? WHERE id = ?";
    const [result] = await connectionModel.execute(query, [nome_usuario, email_usuario, hashedPassword, id]);
    return result;
  } catch (erro) {
    console.error(`Erro ao atualizar usuário com ID ${id}:`, erro);
    throw erro;
  }
};

const updateUsuarioPartial = async (id: number, updates: Partial<Usuario>) => {
  try {
    const fields = Object.keys(updates);
    const values = await Promise.all(
      fields.map(async (field) => {
        if (field === 'senha_usuario' && updates.senha_usuario) {
          return await hash(updates.senha_usuario, 10);
        }
        return updates[field as keyof Usuario];
      })
    );

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

const compareSenha = async (email: string, senha: string) => {
  try {
    const [rows]: any = await connectionModel.execute("SELECT * FROM usuarios WHERE email_usuario = ?", [email]);
    const usuario = rows[0];

    if (!usuario) {
      throw new Error("Usuário não encontrado.");
    }

    const senhaCorreta = await compare(senha, usuario.senha_usuario);
    if (!senhaCorreta) {
      throw new Error("Senha incorreta.");
    }

    return { mensagem: "Login bem-sucedido!", usuario };
  } catch (erro) {
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
  compareSenha,
};