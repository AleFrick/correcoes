export function msg400(res, mensagem) {
  return res.status(400).json({ error: mensagem });
}

export const roles = [ 
  'ADMIN',
  'PROFESSOR',
  'ALUNO'
];

export function retornarRoleValida(role) {
  let index = roles.indexOf(role.toUpperCase());
  return index>-1 ? role.toUpperCase() : roles.indexOf('ALUNO'); // se não encontrar, retorna ALUNO
}