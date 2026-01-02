
import { useParams } from 'react-router-dom'
export default function AtividadeDetalhe() {
  const { atividadeId } = useParams()
  return (
    <>
      <h3>Atividade #{atividadeId}</h3>
      <p>Detalhes, prazo, anexos, chat, envios...</p>
    </>
  )
}
