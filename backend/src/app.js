
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import routes from './routes/index.js'

export function createApp() {
  const app = express()

  // Middlewares básicos
  app.use(express.json())
  app.use(morgan('dev'))

  // Logger simples para toda requisição (ajuda no diagnóstico)
  app.use((req, res, next) => {
    console.log(`[req] ${req.method} ${req.originalUrl}`)
    next()
  })

  // CORS — ajuste a origem conforme seu frontend (Vite padrão: http://localhost:5173)
  const origin = process.env.CORS_ORIGIN || 'http://localhost:5173'
  app.use(
    cors({
      origin,
      credentials: false,
    })
  )

  // Health check
  app.get('/health', (req, res) => {
    console.log('[GET] /health')
    res.json({ status: 'ok', at: new Date().toISOString() })
  })

  // Prefixo das rotas da API
  app.use('/v1', routes)

  // 404 handler — cai aqui quando nenhuma rota foi atendida
  app.use((req, res) => {
    res.status(404).json({ error: 'Not Found', path: req.originalUrl })
  })

  // Error handler (caso queira um middleware dedicado depois)
  // app.use(errorMiddleware)

   return app
}