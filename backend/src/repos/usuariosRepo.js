
// C:\Pessoal\correcoes\backend\src\repos\usuariosRepo.js

export async function inserirUsuario(pool, { nome, email, senhaHash, role }) {
  const sql = `
    INSERT INTO usuarios (nome, email, senha_hash, role)
    VALUES (?, ?, ?, ?)
  `;
  const [res] = await pool.execute(sql, [nome, email, senhaHash, role]);
  return res.insertId;
}

export async function listarUsuarios(pool) {
  const sql = `SELECT id, nome, email FROM usuarios ORDER BY id`;
  const [rows] = await pool.query(sql);
  return rows;
}

export async function buscarPorEmail(pool, email) {
  const sql = `SELECT id, nome, email, senha_hash FROM usuarios WHERE email = ?`;
  const [rows] = await pool.execute(sql, [email]);
  return rows[0] || null;
}
