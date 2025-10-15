import express from "express";
import usuarioRoutes from "./router";
// usar o cors se for necessário
import cors from "cors";


const app = express();
app.use(express.json());
app.use(cors());
app.use("/", usuarioRoutes);
export default app;
