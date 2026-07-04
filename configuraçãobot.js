export const botConfig = {
  welcomeMessage: "Olá! Sou um bot. <br> Como posso te ajudar?",
  options: ["Preço", "Contato", "Serviço"],

  flows: {
    orcamento: [
      { question: "Legal! Para começarmos, qual seu nome?", key: "nome" },
      { question: "Obrigado, {nome}! Agora me diga seu e-mail:", key: "email" },
      { question: "Beleza, {nome}. Qual tipo de serviço você precisa? (ex: site, sistema, bot...)", key: "servico" },
      { question: "Ótimo! Em breve entraremos em contato pelo email {email} para enviar uma proposta sobre {servico}. Obrigado, {nome}! 🙌", key: "fim", isFinal: true }
    ]
  },

  responses: [
    { pattern: /(preco|valor|custa)/i, response: 'Nossos planos começam a partir de R$ 49/mês.' },
    { pattern: /(contato|telefone|whatsapp|whats|zap)/i, response: 'Você pode nos chamar no WhatsApp: (11) 99999-0000.' },
    { pattern: /(servic[io]s?|oferece|fazem)/i, response: 'Oferecemos desenvolvimento de sites, sistemas web e automações.' },
    { pattern: /(orçamento|orcamento|quero.+site|fazer.+site)/i, response: null, flow: 'orcamento' }
  ]
};