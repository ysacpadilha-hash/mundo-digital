// ==========================================================================
// 1. GERADOR DE EFEITOS SONOROS (Web Audio API - Sem Arquivos Externos)
// ==========================================================================
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;


function tocarSom(frequencia, tipo, duracao) {
    try {
        if (!audioCtx) audioCtx = new AudioContext();
       
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
       
        osc.type = tipo; // 'sine', 'square', 'triangle', 'sawtooth'
        osc.frequency.setValueAtTime(frequencia, audioCtx.currentTime);
       
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duracao);
       
        osc.connect(gain);
        gain.connect(audioCtx.destination);
       
        osc.start();
        osc.stop(audioCtx.currentTime + duracao);
    } catch(e) {
        console.log("Áudio aguardando interação do usuário.");
    }
}


function somClique() { tocarSom(600, 'sine', 0.1); }
function somAcerto() { tocarSom(800, 'triangle', 0.25); setTimeout(() => tocarSom(1200, 'sine', 0.3), 100); }
function somErro() { tocarSom(250, 'sawtooth', 0.3); }


// ==========================================================================
// 2. ALTERNÂNCIA DE TEMA CLARO / ESCURO
// ==========================================================================
function alternarTema() {
    somClique();
    const body = document.body;
    const btnTexto = document.getElementById('btn-tema');


    if (body.getAttribute('data-tema') === 'light') {
        body.removeAttribute('data-tema');
        btnTexto.innerHTML = `<span id="icone-tema">🌙</span> Modo Escuro`;
    } else {
        body.setAttribute('data-tema', 'light');
        btnTexto.innerHTML = `<span id="icone-tema">☀️</span> Modo Claro`;
    }
}


// ==========================================================================
// 3. DADOS DO QUIZ INTERATIVO
// ==========================================================================
const perguntas = [
    {
        pergunta: "Qual é o principal objetivo da Educação Digital na escola?",
        opcoes: [
            "Aprender apenas a usar aplicativos de conversa e redes sociais.",
            "Desenvolver autonomia, pensamento crítico e capacidade de criar tecnologia.",
            "Passar mais horas jogando jogos online no horário de aula.",
            "Memorizar marcas de computadores e celulares."
        ],
        correta: 1,
        explicacao: "Excelente! A Educação Digital nos transforma em criadores conscientes e críticos de soluções tecnológicas."
    },
    {
        pergunta: "O que significa 'Colaboração e Autoria' na criação de sites?",
        opcoes: [
            "Copiar qualquer texto da internet sem dar créditos ao autor.",
            "Criar projetos sozinho sem aceitar ajuda de ninguém.",
            "Respeitar direitos autorais, citar fontes e construir conhecimento em equipe.",
            "Apagar o nome dos colegas dos trabalhos escolares."
        ],
        correta: 2,
        explicacao: "Exato! Autoria digital envolve responsabilidade ética, citação de referências e trabalho colaborativo."
    },
    {
        pergunta: "Qual destas ferramentas permite criar elementos interativos como este Quiz?",
        opcoes: [
            "Apenas o aplicativo de fotos do celular.",
            "A linguagem de programação JavaScript executada no navegador.",
            "Uma imagem estática salva em formato PNG.",
            "Um leitor de arquivos de áudio simples."
        ],
        correta: 1,
        explicacao: "Correto! O JavaScript é a linguagem que dá 'vida', inteligência e interatividade às páginas Web."
    }
];


let indicePerguntaAtual = 0;
let pontuacao = 0;
let respondido = false;


// ==========================================================================
// 4. LÓGICA DE EXIBIÇÃO DO QUIZ
// ==========================================================================
function carregarPergunta() {
    respondido = false;
    const q = perguntas[indicePerguntaAtual];
   
    // Atualiza barra de progresso e textos
    document.getElementById('pergunta-texto').textContent = `${indicePerguntaAtual + 1}. ${q.pergunta}`;
    const progresso = ((indicePerguntaAtual) / perguntas.length) * 100;
    document.getElementById('barra-progresso').style.width = `${progresso}%`;
   
    // Oculta caixa de feedback
    const feedbackCaixa = document.getElementById('feedback-caixa');
    feedbackCaixa.className = "feedback-caixa feedback-oculto";
   
    // Inserção das opções
    const containerOpcoes = document.getElementById('opcoes-container');
    containerOpcoes.innerHTML = '';


    q.opcoes.forEach((opcaoText, idx) => {
        const btn = document.createElement('button');
        btn.className = 'btn-opcao';
        btn.textContent = opcaoText;
        btn.onclick = () => verificarResposta(idx, btn);
        containerOpcoes.appendChild(btn);
    });
}


function verificarResposta(indiceSelecionado, elementoBotao) {
    if (respondido) return;
    respondido = true;


    const q = perguntas[indicePerguntaAtual];
    const botoes = document.querySelectorAll('.btn-opcao');
    const feedbackCaixa = document.getElementById('feedback-caixa');
    const feedbackTexto = document.getElementById('feedback-texto');


    if (indiceSelecionado === q.correta) {
        somAcerto();
        elementoBotao.classList.add('correta');
        feedbackCaixa.className = "feedback-caixa feedback-correto";
        feedbackTexto.textContent = `🎉 ${q.explicacao}`;
        pontuacao += 10;
        document.getElementById('pontuacao').textContent = pontuacao;
    } else {
        somErro();
        elementoBotao.classList.add('incorreta');
        botoes[q.correta].classList.add('correta'); // Mostra a certa
        feedbackCaixa.className = "feedback-caixa feedback-incorreto";
        feedbackTexto.textContent = "❌ Resposta incorreta. Observe qual era a opção adequada acima!";
    }
}


function proximaPergunta() {
    somClique();
    indicePerguntaAtual++;
    if (indicePerguntaAtual < perguntas.length) {
        carregarPergunta();
    } else {
        // Fim do quiz
        document.getElementById('barra-progresso').style.width = '100%';
        abrirModal('fim-quiz');
        indicePerguntaAtual = 0;
        pontuacao = 0;
        document.getElementById('pontuacao').textContent = pontuacao;
        carregarPergunta();
    }
}


// ==========================================================================
// 5. JANELAS POP-UP MODAIS (INTERATIVIDADE REAL)
// ==========================================================================
const informacoesModais = {
    'boas-vindas': {
        icone: '⚡',
        titulo: 'Ação Executada com Sucesso!',
        texto: 'Você acabou de disparar um evento em JavaScript! Quando você clica em um botão, o navegador lê as instruções em código e executa uma ação instantânea na tela.'
    },
    'criador': {
        icone: '🚀',
        titulo: 'De Consumidor a Criador',
        texto: 'Enquanto a maioria das pessoas apenas clica em botões criados por outros, a aula de Educação Digital capacita você para construir suas próprias páginas, sistemas e ferramentas.'
    },
    'etica': {
        icone: '🤝',
        titulo: 'Respeito e Autoria',
        texto: 'Sempre atribua crédito aos criadores originais ao usar imagens, fontes de pesquisa ou bibliotecas de código. A ética digital fortalece a comunidade de desenvolvedores.'
    },
    'logica': {
        icone: '🧠',
        titulo: 'Pensamento Computacional',
        texto: 'A lógica de programação nos ensina a dividir grandes problemas em pequenas partes fáceis de resolver. Essa habilidade serve para todas as áreas da sua vida!'
    },
    'fim-quiz': {
        icone: '🏆',
        titulo: 'Desafio Concluído!',
        texto: 'Parabéns! Você completou o Quiz sobre Educação Digital. Agora você viu na prática como HTML (estrutura), CSS (visual) e JavaScript (interação) trabalham juntos!'
    }
};


function abrirModal(chave) {
    somClique();
    const info = informacoesModais[chave];
    if (!info) return;


    document.getElementById('modal-icone').textContent = info.icone;
    document.getElementById('modal-titulo').textContent = info.titulo;
    document.getElementById('modal-texto').textContent = info.texto;


    const modal = document.getElementById('modal-container');
    modal.classList.remove('modal-oculto');
}


function fecharModal() {
    somClique();
    const modal = document.getElementById('modal-container');
    modal.classList.add('modal-oculto');
}


// Inicialização ao carregar a página
window.onload = () => {
    carregarPergunta();
};
