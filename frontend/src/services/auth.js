
export function isAuthenticated() {
  // Exemplo: checar token no localStorage
  const token = localStorage.getItem('token')
  return Boolean(token)
}
