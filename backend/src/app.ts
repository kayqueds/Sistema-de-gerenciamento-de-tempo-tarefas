import express from 'express';

const app = express();

// rotas
app.get('/', (req, res) => {
    res.send('Olá Mundo');
});


export default app;