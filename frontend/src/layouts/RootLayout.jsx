
import { NavLink, Outlet } from 'react-router-dom'

export default function RootLayout() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <header className="border-bottom mb-3">
        <nav className="container py-2 d-flex gap-3">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/turmas">Turmas</NavLink>
          <NavLink to="/alunos">Alunos</NavLink>
        </nav>
      </header>

      <main className="container">
        {/* Onde as rotas filhas renderizam */}
        <Outlet />
      </main>

      {/* <footer className="container border-top mt-4 py-3 text-muted">
               Plataforma de Ensino &mdash; {new Date().getFullYear()}
      </footer> */}
    </div>
  )
}  
