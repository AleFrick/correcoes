import { Router } from 'express'
import { buscarUsuario, createUsuario, loginUsuario, validarAcessoHash } from '../controllers/usuarios.controller.js'

// const usuariosRouter = Router()

// // get
// usuariosRouter.get('/', buscarUsuario)

// // post
// usuariosRouter.post('/login', loginUsuario)   
// usuariosRouter.post('/', createUsuario)

const usuariosRouterPublic = Router()
usuariosRouterPublic.post('/login', loginUsuario)
usuariosRouterPublic.post('/', createUsuario)
usuariosRouterPublic.post('/validarhash', validarAcessoHash)
//usuariosRouterPublic.post('/mail', enviarEmailTeste)

const usuariosRouterPrivate = Router()
usuariosRouterPrivate.get('/', buscarUsuario)

const usuarioRouter = {
    public: usuariosRouterPublic,
    private: usuariosRouterPrivate  
}

export default usuarioRouter
