import { Router } from 'express'
import { listTodos, createTodo } from '../controllers/todos.controller.js'

const todosRouter = Router()

todosRouter.get('/', listTodos)
todosRouter.post('/', createTodo)

export default todosRouter
