
import mysql from 'mysql2/promise';

export function createPool({ host, port, user, password, database, connectionLimit = 10 }) {
  return mysql.createPool({
    host,
    port: Number(port),
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: Number(connectionLimit),
    queueLimit: 0,
    charset: 'utf8mb4',
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });
}
``
