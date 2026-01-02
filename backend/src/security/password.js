
// C:\Pessoal\correcoes\backend\src\security\password.js
import 'dotenv/config';
import bcrypt from 'bcrypt';

/**
 * Retorna o pepper do ambiente. Se não houver, usa string vazia.
 */
function getPepper() {
  return process.env.PASSWORD_PEPPER || '';
}

/**
 * Retorna custo do bcrypt a partir do .env (default 10).
 */
function getBcryptCost() {
  const n = Number(process.env.BCRYPT_COST || 10);
  // Sanitiza limites razoáveis (8–15)
  return Math.min(Math.max(n, 8), 15);
}

/**
 * Concatena a senha com o pepper (não armazenar pepper no banco).
 * Você pode mudar a estratégia (ex.: HMAC com pepper) se preferir.
 */
function applyPepper(plain) {
  // Ex.: senha + pepper — simples e eficaz
  return `${plain}${getPepper()}`;
}

/**
 * Gera hash da senha usando bcrypt + pepper.
 * @param {string} plainPassword
 * @returns {Promise<string>} hash
 */
export async function hashPassword(plainPassword) {
  if (typeof plainPassword !== 'string' || !plainPassword.trim()) {
    throw new Error('Senha inválida');
  }
  const cost = getBcryptCost();
  const salted = applyPepper(plainPassword);
  const salt = await bcrypt.genSalt(cost);
   return bcrypt.hash(salted, salt);
}

/**
 * Compara senha informada com hash armazenado (usando mesmo pepper).
 * @param {string} plainPassword
 * @param {string} hashed
 * @returns {Promise<boolean>} true se confere
 */
export async function verifyPassword(plainPassword, hashed) {
  if (!hashed) return false;
  const salted = applyPepper(plainPassword);
  return bcrypt.compare(salted, hashed);
}
