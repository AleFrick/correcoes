
import { Router } from 'express'
import todosRouter from './todos.routes.js'

const router = Router()

// Agrupa as rotas da API v1
// Exemplo final: GET /v1/todos
router.use('/todos', todosRouter)

// (Opcional) Rota de teste simples
router.get('/ping', (req, res) => {
  res.json({
    message: 'API v1 está ativa!',
    timestamp: new Date().toISOString(),
  })
})


export default router