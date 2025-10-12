import express from "express";
import usuarioRoutes from "./router";

const app = express();
app.use(express.json());
app.use("/", usuarioRoutes);
export default app;
