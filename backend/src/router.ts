// CRIANDO ROTAS E IMPORTANDO NO app.ts
import {Router} from 'express';
import { Request, Response } from "express";
import usuarioController from './controller/usuarioController';

const rota = Router();

rota.get('/', (req: Request, res: Response) => {
    res.send('API de Usuários');
});
// métodos da controller para cada rota
rota.get('/usuarios', usuarioController.getUsuariosAll);
rota.post('/usuarios', usuarioController.createNewUsuario);
rota.put('/usuarios/:id', usuarioController.updateUsuario);
rota.delete('/usuarios/:id', usuarioController.deleteUsuario);

export default rota;
