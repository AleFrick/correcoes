import { useState } from "react"
import { Form, Button, Row, Col } from "react-bootstrap"
import {useParams} from "react-router-dom"

export default function ValidarHashUsuario() {
    const {hash} = useParams()
    const [stateHash, setStateHash] = useState(hash || '')    
    function validarHash() {
        console.log(stateHash )
    }
    return (
        <Form>
            <Form.Group>
                <Form.Label>Validar Hash do Usuário</Form.Label>
                <Form.Control type="text" placeholder="Digite o hash recebido por email" value={stateHash} onChange={ e => setStateHash( e.target.value )} />           
            </Form.Group>
            <Row className="mt-3">
                <Col className="text-end"> 
                    <Button variant="outline-success" 
                        className='m-1'
                        onClick={validarHash}
                    >
                        Validar Hash
                    </Button> 
                </Col>
            </Row>
        </Form>
    )
}