import nodemailer from 'nodemailer';

// Cria o transporter (configuração do serviço SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail', // ou use host/port se for outro provedor
  auth: {
    user: process.env.EMAIL_USER, // seu e-mail
    pass: process.env.EMAIL_PASS, // senha ou App Password
  },
});

// Função para enviar e-mail
export default async function enviarEmail(to, subject, text) {
  try {
    const info = await transporter.sendMail({
      from: `"Meu App" <${process.env.EMAIL_USER}>`,
      to, // destinatário
      subject, // assunto
      text, // corpo do e-mail (texto simples)
      //      // html: '<h1>Olá!</h1><p>Mensagem em HTML</p>', // opcional
    });

    console.log('E-mail enviado:', info.messageId);
  } catch (error) {
    throw new Error('Erro ao enviar e-mail:', error);
  }
}

// Exemplo de uso:
