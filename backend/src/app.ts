import express from "express";
import usuarioRoutes from "./routes/usuarioRouter";
// usar o cors se for necessário pro React acessar a API
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/", usuarioRoutes);
export default app;
