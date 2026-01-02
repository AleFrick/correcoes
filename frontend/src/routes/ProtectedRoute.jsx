
import { Navigate, Outlet } from 'react-router-dom'
import { isAuthenticated } from '../services/auth'

export default function ProtectedRoute() {
  // Se não estiver autenticado, manda para / (ou /login)
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />
  }
  // Se estiver autenticado, libera rota filha
  return <Outlet />
}
