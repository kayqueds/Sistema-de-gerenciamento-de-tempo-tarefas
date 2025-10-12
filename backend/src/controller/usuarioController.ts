import { Request, Response } from "express";
import usuarioModel from "../model/usuarioModel";

const getUsuariosAll = async (req: Request, res: Response) => {
  try {
    const listUsuarios = await usuarioModel.getUsuariosAll();
    return res.status(200).json(listUsuarios);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return res.status(500).json({ error: "Erro interno ao buscar usuários." });
  }
};

const createNewUsuario = async (req: Request, res: Response) => {
  const { nome_usuario, email_usuario, senha_usuario } = req.body;

  if (!nome_usuario || !email_usuario || !senha_usuario) {
    return res.status(400).json({
      error: "Os campos 'nome_usuario', 'email_usuario' e 'senha_usuario' são obrigatórios!",
    });
  }

  try {
    const newUsuario = await usuarioModel.createUsuario(req.body);
    return res.status(201).json(newUsuario);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return res.status(500).json({ error: "Erro interno ao criar usuário." });
  }
};

const updateUsuario = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { nome_usuario, email_usuario, senha_usuario } = req.body;

  if (!nome_usuario || !email_usuario || !senha_usuario) {
    return res.status(400).json({
      error: "Os campos 'nome_usuario', 'email_usuario' e 'senha_usuario' são obrigatórios!",
    });
  }

  try {
    const usuarioEdit = await usuarioModel.updateUsuario(id, req.body);
    return res.status(200).json(usuarioEdit);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return res.status(500).json({ error: "Erro interno ao atualizar usuário." });
  }
};

// Exportando as funções
export default {
  getUsuariosAll,
  createNewUsuario,
  updateUsuario,
};
