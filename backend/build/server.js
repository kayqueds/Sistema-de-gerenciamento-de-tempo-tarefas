import { config } from 'dotenv';
import app from './app';
config();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map