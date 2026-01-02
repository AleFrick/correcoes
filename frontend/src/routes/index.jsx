
import { Routes, Route } from 'react-router-dom'
import RootLayout from '../layouts/RootLayout.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

import Home from '../pages/Home.jsx'
import TurmasList from '../pages/TurmasList.jsx'
import TurmaDetalhe from '../pages/TurmaDetalhe.jsx'
import Login from '../pages/Login.jsx'
import NotFound from '../pages/NotFound.jsx'
import CadastrarUsuario from '../pages/CadastrarUsuario.jsx'
import ValidarHashUsuario from '../pages/ValidarHashUsuario.jsx'

// Exemplo de lazy loading (para uma página pesada)
// const AlunosList = React.lazy(() => import('../pages/AlunosList.jsx'))

export default function RootRoutes() {
  return (
    <Routes>
      {/* Layout raiz */}
      <Route element={<RootLayout />}>
        {/* Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadusuario" element={<CadastrarUsuario />} />
        <Route path="/validar-hash-usuario/:hash" element={<ValidarHashUsuario />} />

        {/* Listagem de turmas */}
        <Route path="/turmas" element={<TurmasList />} />

        {/* Detalhe da turma + rotas aninhadas */}
        <Route path="/turmas/:id" element={<TurmaDetalhe />}>
          {/* Subrotas dentro da turma */}
          <Route path="atividades" element={<div>Listagem de atividades da turma</div>} />
          <Route path="atividades/:atividadeId" element={<div>Detalhe da atividade</div>} />
          <Route path="alunos" element={<div>Alunos da turma</div>} />
        </Route>

        {/* Área protegida (ex.: somente usuários logados) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/minha-conta" element={<div>Minha Conta</div>} />
                   <Route path="/meus-envios" element={<div>Meus Envios</div>} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}