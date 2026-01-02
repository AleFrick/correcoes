export function emailCadastroNovoUsuario (nome, link) {
    return {
        subject: 'Bem-vindo ao EntreLinhas - Confirme seu cadastro',
        text: `
            Olá, ${nome}

            Seja bem-vindo ao EntreLinhas! Estamos muito felizes por ter você conosco.

            Para concluir seu cadastro e começar a aproveitar tudo que o EntreLinhas oferece, clique no link abaixo para validar sua conta:

            ${link}

            Caso não tenha realizado este cadastro, ignore esta mensagem.

            Obrigado por escolher o EntreLinhas!
            Equipe EntreLinhas`
    }    
}
export function emailRedefinicaoSenha (nome, link) {
    return {
        subject: 'Redefinição de senha - EntreLinhas',
        text: `
        Olá, ${nome}

        Recebemos uma solicitação para redefinir a sua senha no EntreLinhas.

        Para criar uma nova senha, clique no link abaixo:

        ${link}

        Se você não fez essa solicitação, ignore este e-mail. Sua senha atual continuará segura.

        Obrigado por usar o EntreLinhas!
        Equipe EntreLinhas
        ` 
    }
}