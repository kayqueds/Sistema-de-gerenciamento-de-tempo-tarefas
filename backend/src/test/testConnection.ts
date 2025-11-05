// backend/src/test/testConnection.ts
import { connectionModel} from "../model/connectionModel";

(async () => {
  try {
    const conn = await connectionModel.connect();
    console.log("✅ Conexão com o banco de dados estabelecida com sucesso!");
    conn.release();
  } catch (erro) {
    console.error("❌ Erro ao conectar com o banco de dados:", erro);
  }
})();