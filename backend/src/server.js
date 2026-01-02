import 'dotenv/config';
import express from 'express';
import { getPoolForTenant } from './db/tenants.js';
import router from './routes/index.js';

const app = express();
app.use(express.json());

// Middleware para resolver o tenant a partir do header ou querystring
function tenantInterceptor(req, res, next) {
  const tenant = (req.header('X-Tenant') || req.query.tenant || '').toLowerCase();
  if (!tenant) {
    return res.status(400).json({ error: 'Tenant obrigatório (use header X-Tenant ou ?tenant=)' });
  }
  try {
    req.pool = getPoolForTenant(tenant);
    next();
  } catch (err) {
    console.error('[Tenant error]', err.message);
    return res.status(404).json({ error: `Tenant inválido: ${tenant}` });
  }
};

function noTenant(req, res, next) {
  const tenant = 'acme'
  try {
    req.pool = getPoolForTenant(tenant);
    next();
  } catch (err) {
    console.error('[Tenant error]', err.message);
    return res.status(404).json({ error: `Tenant inválido: ${tenant}` });
  }
}

app.use('/v1', noTenant, router.private)
app.use('/v1', noTenant, router.public)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ouvindo em http://localhost:${PORT}`);
  console.log(`Use header X-Tenant: acme | beta (ex.: curl -H "X-Tenant: acme" http://localhost:${PORT}/usuarios)`);
});
