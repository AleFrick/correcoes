// Store em memória (troque por DB quando quiser)
const todos = [{ id: 1, title: 'Primeiro todo', done: false }]
let nextId = 2

export function listTodos(req, res) {
  try{
    console.log('oi')
    res.json(todos)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar todos' })
  }
}

export function createTodo(req, res) {
  const { title } = req.body
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res
      .status(400)
      .json({ error: 'title é obrigatório (string não vazia)' })
  }

  const todo = { id: nextId++, title: title.trim(), done: false }
  todos.push(todo)
  res.status(201).json(todo)
}
