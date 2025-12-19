import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className="container py-4">
      <h1 className="mb-3">Hello Bootstrap + Vite + React</h1>
      <button className="btn btn-primary">Clique aqui</button>
    </div>

    </>
  )
}

export default App
