import usuarioModel from "../model/usuarioModel";
import { Request, Response } from "express";

// Buscar todos os usuários
const getUsuariosAll = async (req: Request, res: Response) => {
  try {
    const listUsuarios = await usuarioModel.getUsuariosAll();
    return res.status(200).json(listUsuarios);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return res.status(500).json({ mensagem: "Erro ao buscar usuários." });
  }
};
// Buscar usuário por ID
const getUsuarioById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const usuario = await usuarioModel.getUsuarioById(id);
    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." });
    }
    return res.status(200).json(usuario);
  } catch (error) {
    console.error(`Erro ao buscar usuário com ID ${req.params.id}:`, error);
    return res.status(500).json({ mensagem: "Erro ao buscar usuário." });
  }
};

// Criar novo usuário
const createNewUsuario = async (req: Request, res: Response) => {
  try {
    const newUsuario = await usuarioModel.createUsuario(req.body);
    return res.status(201).json(newUsuario);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return res.status(400).json({ mensagem: "Erro ao criar usuário.", erro: (error as Error).message });
  }
};

// Atualizar usuário completo
const updateUsuario = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const usuarioEdit = await usuarioModel.updateUsuario(id, req.body);
    return res.status(200).json(usuarioEdit);
  } catch (error) {
    console.error(`Erro ao atualizar usuário com ID ${req.params.id}:`, error);
    return res.status(400).json({ mensagem: "Erro ao atualizar usuário.", erro: (error as Error).message });
  }
};

// Deletar usuário
const deleteUsuario = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await usuarioModel.deleteUsuario(id);
    return res.status(204).send(); // 204 = No Content
  } catch (error) {
    console.error(`Erro ao deletar usuário com ID ${req.params.id}:`, error);
    return res.status(400).json({ mensagem: "Erro ao deletar usuário.", erro: (error as Error).message });
  }
};

const compareUsuarioSenha = async (req: Request, res: Response) => {
  const { email_usuario, senha_usuario } = req.body;

  if (!email_usuario || !senha_usuario) {
    return res.status(400).json({ mensagem: "Email e senha são obrigatórios." });
  }

  try {
    const resultado = await usuarioModel.compareSenha(email_usuario, senha_usuario);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(401).json({ mensagem: (error as Error).message });
  }
};

// Exportando as funções
export default {
  getUsuariosAll,
  getUsuarioById,
  createNewUsuario,
  updateUsuario,
  deleteUsuario,
  compareUsuarioSenha,
};