import { Link } from 'react-router-dom'
export default function TurmasList() {
  const turmas = [
    { id: 1, nome: 'Turma 1' },
    { id: 2, nome: 'Turma 2' },
  ]
  return (
    <>
      <h2>Turmas</h2>
      <ul>
        {turmas.map(t => (
          <li key={t.id}>
            <Link to={`/turmas/${t.id}`}>{t.nome}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}
