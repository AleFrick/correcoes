import { useState } from 'react';
import { Form, Row, Col, Button, InputGroup } from 'react-bootstrap';
import { Eye, EyeSlash }from 'react-bootstrap-icons';
import axios from 'axios';

export default function Login () {
    const [passwordVisible, setPasswordVisible] = useState (false);
    const [passwordVisibleConfirm, setPasswordVisibleConfirm] = useState (false);
    //const [iqualPasswords, setIqualPasswords] = useState (true);
    const [password, setPassword] = useState ('');
    const [confirmPassword, setConfirmPassword] = useState ('');
    const [name, setName] = useState ('');
    const [email, setEmail] = useState ('');

    const passwordsMatch = password === confirmPassword;
    //password !== '' && confirmPassword !== '' && password === confirmPassword;
    const canSubmit = passwordsMatch && name !== '' && email !== '' && password !== '' && confirmPassword !== '';

    const toggleVisibility = (isConfirmBtn = false) => {
        if (isConfirmBtn)
            return setPasswordVisibleConfirm(v => !v);
        return setPasswordVisible(v => !v);
    };

    const buttonCancelar = () => {
        setPassword('');
        setConfirmPassword('');
        setName('');
        setEmail('');
    }

    const registarUsuario = async () => {
        let payload = {
            "email": "alex@alex.com",
            "senha": 123
        }
        let dados = await axios.post('http://localhost:3000/v1/usuarios/login', payload)
        console.log(dados.data);
        
//   const res = await fetch('https://jsonplaceholder.typicode.com/users');
//   if (!res.ok) throw new Error('Erro ao buscar usuários');
//   console.log(await res.json());

    }

    return(
        <Form>
            <Form.Group>
                <Row>
                    <Col>
                        <Form.Label>Nome</Form.Label>
                        <Form.Control type="text" placeholder="Digite seu nome" value={name} onChange={ e => setName(e.target.value)} /> 
                    </Col>
                    <Col>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="Digite seu email" value={email} onChange={ e => setEmail(e.target.value)}/>
                    </Col>
                </Row>                               

                <Form.Label>Senha</Form.Label>
                <InputGroup className="mb-3">                
                    <Form.Control
                        type={passwordVisible ? 'text' : 'password'}
                        value={password}
                        onChange={ (e) => setPassword(e.target.value) }
                    />
                    <Button variant="outline-secondary" id="button-addon1" 
                        onMouseDown={ () => toggleVisibility()}
                        onMouseUp={ () => toggleVisibility()}
                    >
                        { passwordVisible ? <Eye /> : <EyeSlash /> } 
                    </Button>
                </InputGroup>                        
            </Form.Group>  

      {!passwordsMatch && (
        <div className="text-danger mb-2">As senhas precisam ser iguais.</div>
      )}

            <Form.Group>
                <Form.Label>Confirmar Senha</Form.Label>
                <InputGroup className="mb-3">                
                    <Form.Control
                        type={passwordVisibleConfirm ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={ (e) => setConfirmPassword(e.target.value) }
                    />
                    <Button variant="outline-secondary" id="button-addon1" 
                        onMouseDown={() => toggleVisibility(true)}
                        onMouseUp={() => toggleVisibility(true)}
                    >
                        { passwordVisibleConfirm ? <Eye /> : <EyeSlash /> } 
                    </Button>
                </InputGroup>                   
            </Form.Group>
            <Row className="mt-3">
                <Col className="text-end">                    
                    <Button variant="outline-success" 
                        disabled={!canSubmit?true:false} className='m-1'
                        onClick={ () => registarUsuario()}
                    >
                        Submit
                    </Button> 
                    <Button variant="outline-danger" type="button" onClick={buttonCancelar} className='m-1'>
                        Cancelar
                    </Button>  
                </Col>
                
            </Row>                        
        </Form>
    )
}