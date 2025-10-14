import usuarioModel from "../model/usuarioModel";
import { Request, Response } from "express";

// funções do controller, falta aplicar as validações
// Luis ficará responsável pelo try/catch


const getUsuariosAll = async (req: Request, res: Response) => {
  const listUsuarios = await usuarioModel.getUsuariosAll();
  return res.status(200).json(listUsuarios)
}

const createNewUsuario = async (req: Request, res: Response) => {
  const newUsuario = await usuarioModel.createUsuario(req.body);
  return res.status(201).json(newUsuario);
}

const updateUsuario = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const usuarioEdit = await usuarioModel.updateUsuario(id, req.body);
    return res.status(200).json(usuarioEdit);
}

const deleteUsuario = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const deleteUsuario = await usuarioModel.deleteUsuario(id);
    return res.status(204).json(deleteUsuario)
} 

// exportando as funções
export default {
    getUsuariosAll,
    createNewUsuario,
    updateUsuario,
    deleteUsuario
}