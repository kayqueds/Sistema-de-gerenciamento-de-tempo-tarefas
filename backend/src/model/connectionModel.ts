// importação do pg do postgree e das variáveis de ambiente
import pg from "pg";
import { config } from "dotenv";
config();

const { Pool } = pg;

export const connectionModel = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
