import { botConfig } from "./botConfig.js";

class MessagesHandler {
  constructor() {
    this.flows = botConfig.flows;
    this.responses = botConfig.responses;
    this.welcomeMessage = botConfig.welcomeMessage;
    this.avaliableOptions = botConfig.options;

    this.userResponse = [];
    this.currentFlow = null;
    this.flowIndex = 0;
    this.flowData = {};
    this.flowHistory = [];

    this.renderHtml();
  }

  getWelcomeMessage() {
    return this.welcomeMessage;
  }

  getAvaliableOptions() {
    return this.avaliableOptions.map(item => `<p>* ${item}</p>`).join('');
  }

  normalizeText(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9@.\s]/g, "")
      .toLowerCase();
  }

  appendMessage(sender, message) {
    const msg = document.createElement('div');
    msg.innerHTML = `<strong>${sender}:</strong> ${message}`;
    this.chatBox.appendChild(msg);
    this.chatBox.scrollTop = this.chatBox.scrollHeight;
  }

  resetFlow() {
    this.flowHistory.push({ tries: this.flowHistory.length, data: this.flowData });
    this.currentFlow = null;
    this.flowIndex = 0;
    this.flowData = {};

    console.log('data', {
      flowHistory: this.flowHistory,
      userResponse: this.userResponse
    });
  }

  getBotResponse(input) {
    const msg = this.normalizeText(input);

    if (this.currentFlow != null) {
      const step = this.flows[this.currentFlow][this.flowIndex];
      this.flowData[step.key] = msg;
      this.flowIndex++;

      const next = this.flows[this.currentFlow][this.flowIndex];
      if (!next) {
        this.resetFlow();
        return 'Obrigado, recebi todas as informações!';
      }

      const text = next.question.replace(/\{(\w+)\}/g, (_, key) => this.flowData[key] || '');
      if (next.isFinal) this.resetFlow();
      return text;
    }

    if (this.userResponse.length == 0) {
      this.userResponse.push({ index: 0, input: msg });
      return this.getWelcomeMessage();
    }

    let index = this.userResponse.length + 1;
    for (let r of this.responses) {
      if (r.pattern.test(msg)) {
        this.userResponse.push({ index: index, input: msg });

        if (r.flow) {
          this.currentFlow = r.flow;
          this.flowIndex = 0;
          this.flowData = {};
          return this.flows[this.currentFlow][this.flowIndex].question;
        }

        return r.response;
      }
    }

    return `Desculpe, não entendi. Poderia reformular sua pergunta? 🤔 <br><br> Por favor informe uma das seguintes opções: ${this.getAvaliableOptions()}`;
  }

  renderHtml() {
    const html = `
      <button id="chat-toggle" class="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg z-50 focus:outline-none">💬</button>

      <div id="chat-widget" class="fixed bottom-20 right-6 w-80 h-96 bg-white rounded-xl shadow-lg border border-gray-300 flex flex-col overflow-hidden z-50 mb-5 hidden">
        <div class="bg-blue-600 text-white px-4 py-3 font-semibold flex justify-between">
          <span>Atendimento Virtual</span>
          <i class="cursor-pointer" id="chat-close">🗙</i>
        </div>
        <div id="chat-box" class="flex-1 px-4 py-2 space-y-2 overflow-y-auto h-64 text-sm">
          <div class="text-gray-500 italic">Bot: C-3PO está online e esperando sua mensagem.</div>
        </div>
        <div class="flex items-center border-t px-2 py-2">
          <input type="text" id="user-input" placeholder="Digite sua mensagem..." class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none">
          <button id="send-btn" class="ml-2 text-blue-600 hover:text-blue-800 text-sm">Enviar</button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);

    this.chatWidget = document.getElementById('chat-widget');
    this.toggleBtn = document.getElementById('chat-toggle');
    this.chatBox = document.getElementById('chat-box');
    this.input = document.getElementById('user-input');
    this.sendBtn = document.getElementById('send-btn');
    this.closeBtn = document.getElementById('chat-close');

    this.toggleBtn.addEventListener('click', () => {
      this.chatWidget.classList.toggle('hidden');
    });

    this.closeBtn.addEventListener('click', () => {
      this.chatWidget.classList.add('hidden');
    });

    this.sendBtn.addEventListener('click', () => this.sendMessage());

    this.input.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.sendMessage();
      }
    });
  }

  sendMessage() {
    const userMessage = this.input.value.trim();
    if (!userMessage) return;

    this.appendMessage('Você', userMessage);
    this.input.value = '';

    setTimeout(() => {
      const botResponse = this.getBotResponse(userMessage);
      this.appendMessage('Bot', botResponse);
    }, 500);
  }
}

new MessagesHandler();