import {Router} from 'express';
import tarefaController from '../controller/tarefaController';

// Definindo as rotas das tarefas
const rota = Router();

// métodos da controller para cada rota
rota.get('/tarefas', tarefaController.getTarefasAll);
rota.get('/tarefas/:id', tarefaController.getTarefaById);
rota.post('/tarefas', tarefaController.createNewTarefa);
rota.put('/tarefas/:id', tarefaController.updateTarefa);
rota.delete('/tarefas/:id', tarefaController.deleteTarefa);

export default rota;
