import Cryptr from 'cryptr';
import { msg400, retornarRoleValida } from '../common/funcoesBasicas.js';
import { inserirUsuario, listarUsuarios, buscarPorEmail } from '../repos/usuariosRepo.js';
import { hashPassword, verifyPassword } from '../security/password.js';
import enviarEmail from '../mail/smtp.js';
import { emailCadastroNovoUsuario } from '../mail/baseTextMail.js';


function createHashUsuario(idUser) {
  const hoje = new Date();
  let string = `id=${idUser};${hoje.getDate()}/${hoje.getMonth()}/${hoje.getFullYear()}`

  if(process.env.PASSWORD_PEPPER==undefined){
    throw new Error('PASSWORD_PEPPER não definido nas variáveis de ambiente');
  }

  const cryptr = new Cryptr(process.env.PASSWORD_PEPPER);
  const encryptedString = cryptr.encrypt(string);
  
  return encryptedString
}

function parseHashUsuario(hash) {
  try {
      if(process.env.PASSWORD_PEPPER==undefined){
      throw new Error('PASSWORD_PEPPER não definido nas variáveis de ambiente');
    } 
    const cryptr = new Cryptr(process.env.PASSWORD_PEPPER);
    console.log('hash recebido: ', hash)    
    const decryptedString = cryptr.decrypt(hash);
    console.log('decryptedString: ', decryptedString)
    return {
      idUser: decryptedString.split(';')[0].split('=')[1],
      data: decryptedString.split(';')[1]
    }
  } catch (error) {
    throw new Error('Hash inválido ou expirado: ' + error.message);
  }
}

export async function buscarUsuario(req, res) {
  try{
    console.log('oi buscar usuarios')
    res.json('ok')
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar todos' })
  }
}

export async function createUsuario(req, res) {
  const { nome, senha, role, email } = req.body

  if (!nome || typeof nome !== 'string' || !nome.trim()) {
    return msg400(res, 'nome é obrigatório (string não vazia)')
  }

  if (!email || typeof email !== 'string' || !email.trim()) {
    return msg400(res, 'email é obrigatório (string não vazia)')
  }
  // criar depois um validador de senha mais robusto
  if (!senha || typeof senha !== 'string' || !senha.trim()) {
    return msg400(res, 'senha é obrigatório (string não vazia)')
  }

  if (!role || role.lenght === 0 ) {
    return msg400(res, 'role é obrigatório ')
  }

  try {
    let senhaHash = await hashPassword(senha)    
    let roleValida = retornarRoleValida(role)
    
    let oJson = ({ 
      "nome": nome, 
      "email": email, 
      "senhaHash": senhaHash, 
      "role": roleValida 
    })
    let usuario = await buscarPorEmail(req.pool, email)
    
    if (usuario) {
      return res.status(409).json({ error: 'Usuário com este email já existe' })
    } 
    let idUser =  await inserirUsuario(req.pool, oJson)
    const hoje = new Date();
    
    let hash = createHashUsuario(idUser)
    await montarEnviarEmail(nome, email, 'http://localhost:5173/validar-hash-usuario/'+hash)
    res.status(201).json({ message: 'Usuário criado com sucesso' })
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar usuário', msg: error.message })
  }
}

export async function loginUsuario(req, res) {
  const { email, senha } = req.body;
  const msg = 'Credenciais inválidas';
  
  if (!email || typeof email !== 'string' || !email.trim()) {
    return msg400(res, 'email é obrigatório (string não vazia)');
  }
  if (!senha) {
    return msg400(res, 'senha é obrigatório (string não vazia)');
  } 
  let verify = false;
  try {
    const user = await buscarPorEmail(req.pool, email)
    if (Object.keys(user).length === 0) {
      return msg400(res, msg );
    }
    
    verify = await verifyPassword(senha, user.senha_hash)
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao efetuar login', msg: error.message });
  }
  if (!verify) {
    return res.status(401).json({ error: msg });
  }

  res.json({ message: 'Login bem-sucedido' });
}

export async function montarEnviarEmail(nome, email, link) {
  // const to = 'alexschmidt@hotmail.com';
  // const subject = 'Teste de envio de e-mail';
  // const text = 'Este é um e-mail de teste enviado pelo sistema.';
  
  const dados = emailCadastroNovoUsuario(nome, link)
  console.log(dados)
  try {
    await enviarEmail(email, dados.subject, dados.text);
  } catch (error) {
    throw new Error({ error: 'Erro ao enviar e-mail de teste: ' + error.message });
  }  
}

export function validarAcessoHash(req, res) {  
  const { hash } = req.body;    
  console.log('hash recebido: ', hash)
  if(hash==undefined || hash.trim()==''){
    return msg400(res, 'hash é obrigatório (string não vazia)');
  }
  try {
    if(process.env.PASSWORD_PEPPER==undefined){
      throw new Error('PASSWORD_PEPPER não definido nas variáveis de ambiente');
    }  
    //id=${idUser};${hoje.getDate()}/${hoje.getMonth()}/${hoje.getFullYear()}

    const parse = parseHashUsuario(hash)
    console.log(parse)
    res.send(parse);
  } catch (error) {
    res.status(400).json({ error: 'Hash inválido ou expirado', msg: error.message });
  }  
}
