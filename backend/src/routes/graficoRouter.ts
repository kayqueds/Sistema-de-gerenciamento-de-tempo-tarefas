// src/routes/graficoRouter.ts
import { Router } from "express";
import * as graficoController from "../controller/graficoController";

const rota = Router();

rota.post('/prever', graficoController.prever);
rota.post('/retrain', graficoController.retrain);

export default rota;
