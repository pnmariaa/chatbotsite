/* =============================================================
   CHATBOT SIMPLES — sem IA, sem configuração complicada.
   Só inclua no HTML, antes do </body>:

   <script src="chatbot.js"></script>

   Tudo (botão, janela de chat e respostas) é criado por este
   arquivo sozinho.
   ============================================================= */

// 1) Cria o botão flutuante (aquele círculo no canto da tela)
const botao = document.createElement("button");
botao.innerHTML = "💬";
botao.style.position = "fixed";
botao.style.bottom = "20px";
botao.style.right = "20px";
botao.style.width = "55px";
botao.style.height = "55px";
botao.style.borderRadius = "50%";
botao.style.background = "#D9A441";
botao.style.border = "none";
botao.style.fontSize = "24px";
botao.style.cursor = "pointer";
document.body.appendChild(botao);

// 2) Cria a janela do chat (começa escondida)
const janela = document.createElement("div");
janela.style.position = "fixed";
janela.style.bottom = "85px";
janela.style.right = "20px";
janela.style.width = "300px";
janela.style.height = "400px";
janela.style.background = "#F3ECD9";
janela.style.border = "1px solid #ccc";
janela.style.borderRadius = "8px";
janela.style.display = "none"; // escondida até clicar no botão
janela.style.flexDirection = "column";
janela.style.overflow = "hidden";
janela.style.fontFamily = "Arial, sans-serif";
document.body.appendChild(janela);

// 2.1) Cabeçalho do chat
const cabecalho = document.createElement("div");
cabecalho.textContent = "Nina - Assistente Virtual";
cabecalho.style.background = "#16223A";
cabecalho.style.color = "#fff";
cabecalho.style.padding = "10px";
cabecalho.style.fontSize = "14px";
janela.appendChild(cabecalho);

// 2.2) Área onde as mensagens aparecem
const mensagens = document.createElement("div");
mensagens.style.flex = "1";
mensagens.style.padding = "10px";
mensagens.style.overflowY = "auto";
mensagens.style.fontSize = "14px";
janela.appendChild(mensagens);

// 2.3) Campo de digitar + botão de enviar
const rodape = document.createElement("div");
rodape.style.display = "flex";
rodape.style.borderTop = "1px solid #ccc";
janela.appendChild(rodape);

const campoTexto = document.createElement("input");
campoTexto.type = "text";
campoTexto.placeholder = "Digite sua dúvida...";
campoTexto.style.flex = "1";
campoTexto.style.border = "none";
campoTexto.style.padding = "10px";
rodape.appendChild(campoTexto);

const botaoEnviar = document.createElement("button");
botaoEnviar.textContent = "➤";
botaoEnviar.style.border = "none";
botaoEnviar.style.background = "#16223A";
botaoEnviar.style.color = "#fff";
botaoEnviar.style.padding = "0 15px";
botaoEnviar.style.cursor = "pointer";
rodape.appendChild(botaoEnviar);

// 3) Funções para adicionar mensagens na tela

function mensagemBot(texto) {
  const p = document.createElement("p");
  p.textContent = texto;
  p.style.background = "#E8DFC6";
  p.style.padding = "8px";
  p.style.borderRadius = "6px";
  p.style.marginBottom = "8px";
  mensagens.appendChild(p);
  mensagens.scrollTop = mensagens.scrollHeight; // rola pro final
}

function mensagemUsuario(texto) {
  const p = document.createElement("p");
  p.textContent = texto;
  p.style.background = "#16223A";
  p.style.color = "#fff";
  p.style.padding = "8px";
  p.style.borderRadius = "6px";
  p.style.marginBottom = "8px";
  p.style.textAlign = "right";
  mensagens.appendChild(p);
  mensagens.scrollTop = mensagens.scrollHeight;
}

// 4) Menu principal — cria os botões de opções

function mostrarMenu() {
  const opcoes = [
    "Como funciona nosso site?",
    "Quer contratar um estagiário?",
    "Quero enviar meu currículo",
    "Sobre o 3º CPM",
    "Informações de turno"
  ];

  opcoes.forEach(function (opcao) {
    const btn = document.createElement("button");
    btn.textContent = opcao;
    btn.style.display = "block";
    btn.style.width = "100%";
    btn.style.textAlign = "left";
    btn.style.margin = "4px 0";
    btn.style.padding = "8px";
    btn.style.border = "1px solid #ccc";
    btn.style.borderRadius = "6px";
    btn.style.background = "#fff";
    btn.style.cursor = "pointer";
    btn.onclick = function () {
      mensagemUsuario(opcao);
      responder(opcao);
    };
    mensagens.appendChild(btn);
  });
  mensagens.scrollTop = mensagens.scrollHeight;
}

// 5) Depois de cada resposta: botões de "voltar" e "encerrar"

function mostrarBotoesFinais() {
  const btnVoltar = document.createElement("button");
  btnVoltar.textContent = "🔙 Voltar ao menu principal";
  btnVoltar.style.display = "block";
  btnVoltar.style.width = "100%";
  btnVoltar.style.margin = "4px 0";
  btnVoltar.style.padding = "8px";
  btnVoltar.style.cursor = "pointer";
  btnVoltar.onclick = function () {
    mensagemUsuario("Voltar ao menu principal");
    mostrarMenu();
  };
  mensagens.appendChild(btnVoltar);

  const btnEncerrar = document.createElement("button");
  btnEncerrar.textContent = "✅ Encerrar conversa";
  btnEncerrar.style.display = "block";
  btnEncerrar.style.width = "100%";
  btnEncerrar.style.margin = "4px 0";
  btnEncerrar.style.padding = "8px";
  btnEncerrar.style.cursor = "pointer";
  btnEncerrar.onclick = function () {
    mensagemUsuario("Encerrar conversa");
    mensagemBot("Obrigada por conversar comigo! 👋");
    setTimeout(function () {
      janela.style.display = "none";
      mensagens.innerHTML = ""; // apaga a conversa
      conversaComecou = false;
    }, 1000);
  };
  mensagens.appendChild(btnEncerrar);

  mensagens.scrollTop = mensagens.scrollHeight;
}

// 6) Aqui é o "cérebro" do bot: decide a resposta certa pra cada assunto

function responder(texto) {
  const t = texto.toLowerCase();

  if (t.includes("como funciona")) {
    mensagemBot("Nosso site tem duas opções: se você é empresa, veja o catálogo de alunos disponíveis. Se é aluno, envie ou crie seu currículo por aqui.");
  } else if (t.includes("contratar")) {
    mensagemBot("Você pode ver os alunos disponíveis na seção de Catálogo e entrar em contato direto com quem tiver interesse.");
  } else if (t.includes("currículo")) {
    mensagemBot("Você pode enviar um currículo pronto em 'Publicar Currículo' ou criar um novo em 'Criar Currículo'.");
  } else if (t.includes("cpm")) {
    mensagemBot("O 3º Colégio da Polícia Militar do Paraná foi criado em 2018 e iniciou suas atividades em 2019, a partir do antigo Colégio Alberto Carazzai.");
  } else if (t.includes("turno")) {
    mensagemBot("Temos três turnos: Matutino (Ensino Médio regular), Vespertino (Anos Finais) e Noturno (técnico em Desenvolvimento de Sistemas).");
  } else {
    mensagemBot("Desculpa, não entendi. Escolhe uma das opções abaixo:");
  }

  mostrarBotoesFinais();
}

// 7) Controla abrir/fechar o chat, e mostra a saudação na primeira vez

let conversaComecou = false;

botao.onclick = function () {
  if (janela.style.display === "none") {
    janela.style.display = "flex";
  } else {
    janela.style.display = "none";
  }

  if (!conversaComecou) {
    conversaComecou = true;
    mensagemBot("Oi! Sou a Nina, assistente virtual do 3º CPM. Como posso te ajudar?");
    mostrarMenu();
  }
};

// 8) Envia o texto digitado quando clica no botão ou aperta Enter

botaoEnviar.onclick = enviarMensagem;
campoTexto.addEventListener("keydown", function (e) {
  if (e.key === "Enter") enviarMensagem();
});

function enviarMensagem() {
  const texto = campoTexto.value.trim();
  if (texto === "") return;
  mensagemUsuario(texto);
  campoTexto.value = "";
  responder(texto);
}