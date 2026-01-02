import { Form, Container, Row, Col, InputGroup, Button } from 'react-bootstrap';
import { Plus } from 'react-bootstrap-icons';

export default function CadastrarUsuario() {
  return (
        <Container>
            <Row>
                <Col>
                    <Form.Label htmlFor="inputNome">Nome</Form.Label>
                    <Form.Control
                        type="text"
                        id="inputNome"
                    />
                </Col>
                <Col>
                    <Form.Label htmlFor="inputEmail">Email</Form.Label>
                    <Form.Control
                        type="email"
                        id="inputEmail"
                    />
                </Col>
            </Row>
            
            <Row>
                <Col> 
                    {/* <Form.Label htmlFor="inputSenha">Senha</Form.Label>
                    <Form.Control
                        type="password"
                        id="inputSenha"
                    /> */}
                    <InputGroup className="mb-3">
                        <Form.Control
                            aria-label="Example text with button addon"
                            aria-describedby="basic-addon1"
                        />
                        <Button variant="outline-secondary" id="button-addon1">
                            <Plus size={20} className="me-2" /> Adicionar
                        </Button>
                    </InputGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Label htmlFor="inputConfSenha">Confirmar Senha</Form.Label>
                    <Form.Control
                        type="password"
                        id="inputConfSenha"
                    />
                </Col>
            </Row>
        </Container>
  )
}