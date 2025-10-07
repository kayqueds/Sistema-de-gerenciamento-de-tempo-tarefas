import express from 'express';
import rota from './router';

const app = express();

// chamando o router
app.use(rota);


export default app;