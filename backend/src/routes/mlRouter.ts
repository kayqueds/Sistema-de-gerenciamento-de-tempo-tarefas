// backend/src/routes/mlRouter.ts

import { Router } from 'express';
import mlController from '../controller/mlController'; // Importa o Controller de ML

const router = Router();

// Rota POST para realizar a previsão de descanso
// Endereço final será: [baseURL]/prever
router.post('/prever', mlController.prever);

// Rota POST para re-treinar o modelo do usuário
// Endereço final será: [baseURL]/retrain
router.post('/retrain', mlController.retrain);

export default router;