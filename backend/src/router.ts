// CRIANDO ROTAS E IMPORTANDO NO app.ts
import {Router} from 'express';
const rota = Router();

const usuarios = [
    {id: 1, nome: 'Eduardo'},
    {id: 2, nome: 'Maria'},
    {id: 3, nome: 'João'},
]
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

rota.get('/usuarios', (req, res) => {
    res.status(200).send(usuarios);
})

export default rota;
