// src/routes/graficoRouter.ts
import { Router } from "express";
import graficoController from "../controller/graficoController";

const router = Router();

router.post('/prever', graficoController.prever);
router.post('/retrain', graficoController.retrain);

export default router;
