// importação do pg do postgree e das variáveis de ambiente
import pg from "pg";
import { config } from "dotenv";
config();

const { Pool } = pg;

const poolConfig: any = {
  connectionString: process.env.DATABASE_URL,
  family: 4, // Aqui o TypeScript não reclama
  ssl: {
    rejectUnauthorized: false,
  },
};

export const connectionModel = new Pool(poolConfig);