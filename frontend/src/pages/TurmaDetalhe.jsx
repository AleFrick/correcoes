
import { useParams, Outlet, NavLink } from 'react-router-dom'
export default function TurmaDetalhe() {
  const { id } = useParams()
  return (
    <>
      <h2>Turma #{id}</h2>
      <nav className="d-flex gap-3 border-bottom mb-3 pb-2">
        <NavLink to="atividades">Atividades</NavLink>
        <NavLink to="alunos">Alunos</NavLink>
      </nav>
      {/* Rotas aninhadas da turma */}
      <Outlet />
    </>
  )
}
