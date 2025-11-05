import { connectionModel } from "./connectionModel";
import type { Usuario } from "../interface/tabelas";
import {hash, compare} from "bcrypt";

// Função para validar a complexidade da senha
const validarSenha = (senha: string): { valido: boolean; erros: string[] } => {
  const erros: string[] = [];

  if (senha.length < 8) {
    erros.push("A senha deve conter no mínimo 8 caracteres");
  }

  if (!/[A-Z]/.test(senha)) {
    erros.push("A senha deve conter pelo menos uma letra maiúscula");
  }

  if (!/[0-9]/.test(senha)) {
    erros.push("A senha deve conter pelo menos um número");
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) {
    erros.push("A senha deve conter pelo menos um caractere especial");
  }

  return {
    valido: erros.length === 0,
    erros
  };
};

const getUsuariosAll = async () => {
  try {
    const listUsuarios = await connectionModel.query("SELECT * FROM usuarios");
    return listUsuarios.rows;
  } catch (erro) {
    console.error("Erro ao buscar todos os usuários:", erro);
    throw erro;
  }
};

const getUsuarioById = async (id: number) => {
  try {
    const usuario = await connectionModel.query("SELECT * FROM usuarios WHERE id = $1", [id]);
    return usuario.rows;
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

  // Validar complexidade da senha
  const validacao = validarSenha(senha_usuario);
  if (!validacao.valido) {
    throw new Error(validacao.erros.join("; "));
  }

  try {
    const hashedPassword = await hash(senha_usuario, 10);
    const query = "INSERT INTO usuarios(nome_usuario, email_usuario, senha_usuario) VALUES($1, $2, $3)";
    const result = await connectionModel.query(query, [nome_usuario, email_usuario, hashedPassword]);
    return result;
  } catch (erro) {
    console.error("Erro ao criar usuário:", erro);
    throw erro;
  }
};
// atualiazar usuarios
const updateUsuario = async (id: number, body: Usuario) => {
  const { nome_usuario, email_usuario, senha_usuario } = body;

  if (!nome_usuario || !email_usuario || !senha_usuario) {
    throw new Error("Os campos 'nome_usuario', 'email_usuario' e 'senha_usuario' são obrigatórios!");
  }

  // Validar complexidade da senha
  const validacao = validarSenha(senha_usuario);
  if (!validacao.valido) {
    throw new Error(validacao.erros.join("; "));
  }

  try {
    const hashedPassword = await hash(senha_usuario, 10);
    const query = "UPDATE usuarios SET nome_usuario=$1, email_usuario=$2, senha_usuario=$3 WHERE id = $4";
    const result = await connectionModel.query(query, [nome_usuario, email_usuario, hashedPassword, id]);
    return result;
  } catch (erro) {
    console.error(`Erro ao atualizar usuário com ID ${id}:`, erro);
    throw erro;
  }
};

const updateUsuarioPartial = async (id: number, updates: Partial<Usuario>) => {
  try {
    // Se estiver atualizando senha, validar complexidade
    if (updates.senha_usuario) {
      const validacao = validarSenha(updates.senha_usuario);
      if (!validacao.valido) {
        throw new Error(validacao.erros.join("; "));
      }
    }

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

    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");
    const query = `UPDATE usuarios SET ${setClause} WHERE id = $${fields.length + 1}`;
    const result = await connectionModel.query(query, [...values, id]);
    return result;
  } catch (erro) {
    console.error(`Erro ao atualizar parcialmente o usuário com ID ${id}:`, erro);
    throw erro;
  }
};

const deleteUsuario = async (id: number) => {
  try {
    const result = await connectionModel.query("DELETE FROM usuarios WHERE id = $1", [id]);
    return result;
  } catch (erro) {
    console.error(`Erro ao deletar usuário com ID ${id}:`, erro);
    throw erro;
  }
};

// autenticar usuário usando o compare
const compareSenha = async (email:string, password:string) => {
  // Buscar pelo campo email_usuario na tabela usuarios
  const result = await connectionModel.query('SELECT * FROM usuarios WHERE email_usuario = $1', [email]);
  if (!result.rows || result.rows.length === 0) {
    throw new Error('Usuário não encontrado');
  }
  const user = result.rows[0];
  const isPasswordValid = await compare(password, user.senha_usuario);
  if (!isPasswordValid) {
    throw new Error('Senha inválida');
  }
  delete user.senha_usuario;
  return user;
}

export default {
  getUsuariosAll,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  updateUsuarioPartial,
  deleteUsuario,
  compareSenha,
  validarSenha
};