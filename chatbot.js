(function () {
  "use strict";

  const CONFIG = {
    botName: "Nina",
    subtitle: "Assistente Virtual do 3º CPM",
    greeting: "Sou a Assistente Virtual do 3º CPM! Como posso te ajudar hoje?",
    inputPlaceholder: "Como posso te ajudar?",
    footerNote: "Digite sua dúvida ou escolha uma opção abaixo.",
    endMessage: "Obrigada por conversar comigo! Se precisar de algo, é só abrir o chat de novo. 👋",

    colors: {
      accent: "#D9A441",   // cor do botão e detalhes
      panelBg: "#F3ECD9",  // fundo do painel de chat
      panelBgDim: "#E8DFC6",
      headerBg: "#16223A", // cabeçalho do chat
      text: "#1B2A3D",
      userBubble: "#16223A",
      userText: "#F3ECD9"
    },

    menuOptions: [
      "Como funciona nosso site?",
      "Quer contratar um estagiário?",
      "Quero enviar meu currículo",
      "Sobre o 3º CPM",
      "Informações de turno"
    ],

    rules: [
      {
        keywords: ["como funciona"],
        reply: `Nosso site disponibiliza duas possibilidades:
1- Caso seja empresa, você pode visualizar nosso catálogo de alunos dispostos a serem contratados e entrar em contato com eles através de informações disponíveis;
2- Caso seja aluno, você pode enviar o documento do seu currículo clicando em "Publicar Currículo" ou criar um novo utilizando nossos modelos clicando em "Criar Currículo".
Espero ter conseguido te ajudar! Se precisar de mais algo, estarei disposta a te ajudar!`
      },
      {
        keywords: ["contratar"],
        reply: `Ótimo, fico muito feliz com sua decisão e esperamos ter profissionais qualificados para seu perfil!
Você pode acessar todos os nossos alunos e suas devidas informações de contato e qualificações em "Catálogos", escolher os que mais se encaixam para aquilo que procura e entrar em contato para uma entrevista.
Espero ter conseguido te ajudar! Se precisar de mais algo, estarei disposta a te ajudar!`,
        action: "scrollToCatalog"
      },
      {
        // era ["enviar currículo"] — não batia com "Quero enviar MEU currículo"
        keywords: ["currículo"],
        reply: `Ótimo, fico muito feliz com sua decisão e esperamos ajudar você a entrar no mercado de trabalho.
O processo é bem simples, você tem duas opções em nosso site:
1- Caso já tenha um currículo pronto, você pode clicar em "Publicar Currículo" e enviar o arquivo. Certifique-se de que ele está atualizado com suas informações pessoais e de contato.
2- Caso não tenha um currículo pronto, você pode clicar em "Criar Currículo" e utilizar nossos modelos para criar um currículo do zero. Certifique-se de preencher todas as informações necessárias e revisar antes de enviar.
Espero ter conseguido te ajudar! Se precisar de mais algo, estarei disposta a te ajudar!`
      },
      {
        // era ["sobre 3º cpm"] — não batia com "Sobre O 3º CPM"
        keywords: ["cpm"],
        reply: `O 3º Colégio da Polícia Militar do Paraná foi criado como um órgão de apoio à Polícia Militar do Paraná e como um estabelecimento de ensino formal, pelo Decreto Governamental nº 11.334 de 15 de outubro de 2018.
Publicado no Diário Oficial nº 10.294 da mesma data, o colégio iniciou oficialmente suas atividades no dia 04 de fevereiro de 2019.
Fundado a partir do antigo Colégio Estadual Alberto Carazzai, em funcionamento desde 1970.
Espero ter conseguido te ajudar! Se precisar de mais algo, estarei disposta a te ajudar!`
      },
      {
        keywords: ["turno"],
        reply: `O nosso colégio possui alunos em três turnos, sendo eles: Matutino para Ensino Médio regular, Vespertino para Anos Finais (6º ao 9º ano) e Noturno para Ensino Médio integrado com curso técnico de Desenvolvimento de Sistemas.
Espero ter conseguido te ajudar! Se precisar de mais algo, estarei disposta a te ajudar!`
      },
      {
        keywords: ["obg", "obrigad", "valeu", "agradeço"],
        reply: "Fico feliz em poder ajudar! Se precisar de mais alguma coisa, estarei sempre à disposição para te ajudar!"
      }
    ],
    fallbackReply: "Desculpe, não entendi sua pergunta. Por favor, tente novamente ou escolha uma das opções do menu.",
    catalogSectionId: "catalogo"
  };

  const style = document.createElement("style");
  style.textContent = `
    #cb-toggle{
      position: fixed; bottom: 24px; right: 24px; z-index: 9999;
      width: 58px; height:58px; border-radius:50%;
      background: ${CONFIG.colors.accent}; border: none; color: ${CONFIG.colors.headerBg};
      box-shadow: 0 10px 24px rgba(0,0,0,0.35);
      display:flex; align-items:center; justify-content:center;
      font-size:1.5rem; cursor:pointer; transition: transform .15s ease;
      font-family: inherit;
    }
    #cb-toggle:hover{ transform: scale(1.06); }
    #cb-toggle .cb-close-ic{ display:none; }
    #cb-toggle.is-open .cb-chat-ic{ display:none; }
    #cb-toggle.is-open .cb-close-ic{ display:block; }

    #cb-panel{
      position: fixed; bottom: 94px; right: 24px; z-index: 9999;
      width: 340px; max-width: calc(100vw - 32px);
      height: 460px; max-height: calc(100vh - 140px);
      background: ${CONFIG.colors.panelBg}; color: ${CONFIG.colors.text};
      border-radius: 8px; overflow:hidden;
      display:flex; flex-direction:column;
      box-shadow: 0 20px 50px rgba(0,0,0,0.4);
      opacity:0; transform: translateY(14px) scale(0.98); pointer-events:none;
      transition: opacity .18s ease, transform .18s ease;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
    }
    #cb-panel.open{ opacity:1; transform: translateY(0) scale(1); pointer-events:auto; }

    .cb-head{
      background: ${CONFIG.colors.headerBg}; color: #fff;
      padding: 14px 16px; display:flex; align-items:center; gap:10px;
      font-size:0.85rem; border-bottom: 3px solid ${CONFIG.colors.accent};
    }
    .cb-head .cb-dot{ width:8px; height:8px; border-radius:50%; background:#5fbf7a; flex-shrink:0; }
    .cb-head strong{ display:block; font-size:0.95rem; }
    .cb-head small{ opacity:0.7; }

    .cb-body{
      flex:1; overflow-y:auto; padding: 14px 14px 6px;
      display:flex; flex-direction:column; gap:10px; font-size: 0.88rem;
    }
    .cb-msg{ max-width: 86%; padding: 9px 12px; border-radius: 10px; line-height:1.4; white-space: pre-line; }
    .cb-msg.bot{ background: ${CONFIG.colors.panelBgDim}; align-self:flex-start; border-bottom-left-radius:2px; }
    .cb-msg.user{ background: ${CONFIG.colors.userBubble}; color: ${CONFIG.colors.userText}; align-self:flex-end; border-bottom-right-radius:2px; }

    .cb-quick-replies{ display:flex; flex-direction:column; gap:6px; margin-top:2px; }
    .cb-quick-replies button{
      text-align:left; background:#fff; border:1px solid #cabf9e; border-radius:6px;
      padding: 8px 10px; font-size:0.85rem; color: ${CONFIG.colors.text}; cursor:pointer;
      font-family: inherit;
    }
    .cb-quick-replies button:hover{ background: ${CONFIG.colors.accent}; border-color: ${CONFIG.colors.accent}; }

    .cb-input-row{
      display:flex; gap:8px; padding: 10px 12px 12px;
      border-top: 1px solid ${CONFIG.colors.panelBgDim}; background: ${CONFIG.colors.panelBg};
    }
    .cb-input-row input{
      flex:1; border:1px solid #cabf9e; border-radius:20px; padding: 9px 14px;
      font-size:0.85rem; font-family: inherit;
    }
    .cb-input-row input:focus-visible, #cb-toggle:focus-visible, .cb-quick-replies button:focus-visible{
      outline: 2px solid ${CONFIG.colors.accent}; outline-offset: 2px;
    }
    .cb-input-row button{
      background: ${CONFIG.colors.headerBg}; color: #fff; border:none; border-radius:50%;
      width:38px; height:38px; flex-shrink:0; font-size:1rem; cursor:pointer;
    }
    .cb-input-row button:hover{ background: #B23A2F; }

    .cb-note{ font-size:0.62rem; text-align:center; color:#7a6f57; padding: 0 12px 10px; }

    @media (prefers-reduced-motion: reduce){
      #cb-panel, #cb-toggle{ transition: none !important; }
    }
  `;
  document.head.appendChild(style);

  const toggle = document.createElement("button");
  toggle.id = "cb-toggle";
  toggle.setAttribute("aria-label", "Abrir chat de atendimento");
  toggle.setAttribute("aria-expanded", "false");
  toggle.innerHTML = `<span class="cb-chat-ic">💬</span><span class="cb-close-ic">✕</span>`;

  const panel = document.createElement("div");
  panel.id = "cb-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Chat da assistente virtual");
  panel.innerHTML = `
    <div class="cb-head">
      <span class="cb-dot" aria-hidden="true"></span>
      <div>
        <strong>${CONFIG.botName}</strong>
        <small>${CONFIG.subtitle}</small>
      </div>
    </div>
    <div class="cb-body" id="cb-body"></div>
    <div class="cb-input-row">
      <input id="cb-input" type="text" placeholder="${CONFIG.inputPlaceholder}" aria-label="Digite sua mensagem">
      <button id="cb-send" aria-label="Enviar mensagem">➤</button>
    </div>
    <div class="cb-note">${CONFIG.footerNote}</div>
  `;

  document.body.appendChild(toggle);
  document.body.appendChild(panel);

  const chatBody  = panel.querySelector("#cb-body");
  const chatInput = panel.querySelector("#cb-input");
  const chatSend  = panel.querySelector("#cb-send");

  let started = false;

  toggle.addEventListener("click", () => {
    const isOpen = panel.classList.toggle("open");
    toggle.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    if (isOpen && !started) {
      started = true;
      chatBody.innerHTML = "";
      addBotMessage(CONFIG.greeting);
      showMainMenu();
    }
  });

  function addUserMessage(text) {
    const div = document.createElement("div");
    div.className = "cb-msg user";
    div.textContent = text;
    chatBody.appendChild(div);
    scrollChat();
  }

  function addBotMessage(text) {
    const div = document.createElement("div");
    div.className = "cb-msg bot";
    div.textContent = text;
    chatBody.appendChild(div);
    scrollChat();
  }

  function scrollChat() {
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function clearQuickReplies() {
    panel.querySelectorAll(".cb-quick-replies").forEach((el) => el.remove());
  }

  function showMainMenu() {
    clearQuickReplies();
    const wrap = document.createElement("div");
    wrap.className = "cb-quick-replies";
    CONFIG.menuOptions.forEach((opt) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = opt;
      b.addEventListener("click", () => handleOption(opt));
      wrap.appendChild(b);
    });
    chatBody.appendChild(wrap);
    scrollChat();
  }

  function handleOption(opt) {
    addUserMessage(opt);
    clearQuickReplies();
    respond(opt);
  }

  function respond(input) {
    const text = input.toLowerCase();
    const matched = CONFIG.rules.find((rule) =>
      rule.keywords.some((kw) => text.includes(kw))
    );

    if (matched) {
      addBotMessage(matched.reply);
      if (matched.action === "scrollToCatalog") scrollToCatalog();
    } else {
      addBotMessage(CONFIG.fallbackReply);
    }
    showEndOrMenuButtons();
  }

  // Depois de cada resposta: só dois botões, em vez do menu inteiro de novo
  function showEndOrMenuButtons() {
    clearQuickReplies();
    const wrap = document.createElement("div");
    wrap.className = "cb-quick-replies";

    const backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.textContent = "🔙 Voltar ao menu principal";
    backBtn.addEventListener("click", () => {
      addUserMessage("Voltar ao menu principal");
      clearQuickReplies();
      showMainMenu();
    });

    const endBtn = document.createElement("button");
    endBtn.type = "button";
    endBtn.textContent = "✅ Finalizar conversa";
    endBtn.addEventListener("click", () => {
      addUserMessage("Finalizar conversa");
      endConversation();
    });

    wrap.appendChild(backBtn);
    wrap.appendChild(endBtn);
    chatBody.appendChild(wrap);
    scrollChat();
  }

  function endConversation() {
    clearQuickReplies();
    addBotMessage(CONFIG.endMessage);
    // fecha o painel depois de um instante e reinicia a saudação pra próxima vez
    setTimeout(() => {
      panel.classList.remove("open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      started = false;
    }, 1200);
  }

  function scrollToCatalog() {
    const target = document.getElementById(CONFIG.catalogSectionId);
    if (!target) return; // não existe essa seção nesta página: não faz nada, chat continua aberto
    panel.classList.remove("open");
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    target.scrollIntoView({ behavior: "smooth" });
  }

  chatSend.addEventListener("click", sendUserText);
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendUserText();
  });

  function sendUserText() {
    const val = chatInput.value.trim();
    if (!val) return;
    addUserMessage(val);
    clearQuickReplies();
    chatInput.value = "";
    respond(val);
  }
})();