
import 'dotenv/config';
import { createPool } from './pool.js';

const pools = new Map();

export function getPoolForTenant(tenant) {
  const key = tenant.toLowerCase();
  if (pools.has(key)) return pools.get(key);
    
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || 3306;

  // Ajuste este mapa para os seus tenants reais
  const cfgByTenant = {
    acme: {
      database: process.env.ACME_DB,
      user: process.env.ACME_USER,
      password: process.env.ACME_PASSWORD,
    },
    beta: {
      database: process.env.BETA_DB,
      user: process.env.BETA_USER,
      password: process.env.BETA_PASSWORD,
    },
  };

  const cfg = cfgByTenant[key];
  if (!cfg || !cfg.database || !cfg.user || !cfg.password) {
    throw new Error(`Tenant desconhecido ou sem configuração: ${tenant}`);
  }

  const pool = createPool({
    host,
    port,
    user: cfg.user,
    password: cfg.password,
    database: cfg.database,
    connectionLimit: process.env.POOL_LIMIT || 10,
  });

  pools.set(key, pool);
   return pool;
}

