// CRIANDO ROTAS E IMPORTANDO NO app.ts
import {Router} from 'express';
const rota = Router();


// rotas da aplicação
rota.get('/', (req, res) => {
    res.send('Página Inicial');
})

rota.get('/tela2', (req, res) => {
    res.send('Página Tela 2');
})
rota.get('/teste', (req, res) => {
    res.send('Testando rota de teste');
})
export default rota;
