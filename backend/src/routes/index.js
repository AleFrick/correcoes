
import { Router } from 'express'
import usuariosRouter from './usuarios.routes.js'
import testesRouter from './testes.routes.js'

const routerPublic = Router()
routerPublic.use('/usuarios', usuariosRouter.public)
routerPublic.use('/testes', testesRouter.public)

const routerPrivate = Router()
routerPrivate.use('/usuarios', usuariosRouter.private)
routerPrivate.use('/testes', testesRouter.private)

const router = {
    public: routerPublic,
    private: routerPrivate
}

export default router 