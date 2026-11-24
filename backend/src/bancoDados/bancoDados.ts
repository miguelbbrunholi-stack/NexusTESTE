import mysql from 'mysql2/promise';
import { configuracao } from "../config/configuracao";
const { usarTls, ...opcoesConexao } = configuracao.banco;
export const bancoDados = mysql.createPool({
  ...opcoesConexao,
  ssl: usarTls ? { rejectUnauthorized: true } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true
});
