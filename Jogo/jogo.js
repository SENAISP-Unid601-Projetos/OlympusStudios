const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const larguraCanvas = canvas.width;
const alturaCanvas = canvas.height;

// Configuração da largura e altura dos frames da spritesheet
const larguraFrameSprite = 480;
const alturaFrameSprite = 648;

let personagem = {
    x: 100,
    y: 100,
    largura: 60,
    altura: 60,
    velocidade: 3,
    spriteSheet: new Image(),
    spriteWidth: larguraFrameSprite,
    spriteHeight: alturaFrameSprite,
    frame: 0,
    totalFrames: 12,
    tempoFrame: 200,
    lastFrameTime: 0
};

personagem.spriteSheet.src = 'IMG/sprite eidan555.png';
personagem.spriteSheet.onload = function() {
    loop(); // Inicia o loop do jogo após a imagem carregar
};

// Imagens das folhas
let folhas = [
    { img: new Image(), coletada: false, x: 0, y: 50, largura: 40, altura: 50 },
    { img: new Image(), coletada: false, x: 150, y: 100, largura: 40, altura: 50 },
    { img: new Image(), coletada: false, x: 800, y: 30, largura: 40, altura: 50 },
    { img: new Image(), coletada: false, x: 1200, y: 50, largura: 40, altura: 50 },
    { img: new Image(), coletada: false, x: 450, y: 250, largura: 40, altura: 50 },
    { img: new Image(), coletada: false, x: 1000, y: 350, largura: 40, altura: 50 },
    { img: new Image(), coletada: false, x: 300, y: 300, largura: 40, altura: 50 },
    { img: new Image(), coletada: false, x: 150, y: 400, largura: 40, altura: 50 }
];

folhas.forEach((folha, index) => {
    folha.img.src = `IMG/folha (${(index % 4) + 1}).png`;
});

let folhasColetadas = 0;
let jogoAtivo = true;

// Configurações do fantasma
let fantasma = {
    x: 1200,
    y: alturaCanvas - 150,
    largura: 120,
    altura: 120,
    velocidade: 3,
    visivel: false,
    img: new Image(),
    direcaoX: 1,
    direcaoY: 1
};

fantasma.img.src = 'IMG/eco.png';

// O fantasma aparece após um tempo
setTimeout(() => {
    fantasma.visivel = true;
}, 6000);

// Controla as teclas
const teclas = {
    w: false,
    a: false,
    s: false,
    d: false
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'w') teclas.w = true; 
    if (e.key === 'a') teclas.a = true;
    if (e.key === 's') teclas.s = true;
    if (e.key === 'd') teclas.d = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'w') teclas.w = false;
    if (e.key === 'a') teclas.a = false;
    if (e.key === 's') teclas.s = false;
    if (e.key === 'd') teclas.d = false;
    personagem.frame = 8; // Frame de descanso
});

// Variável para a imagem de parabéns
const imagemParabens = new Image();
imagemParabens.src = 'falas/tauronfala3.png';
let mostrarParabens = false;



// Variáveis de tamanho para a imagem de parabéns
let larguraParabens = 300;  // Largura inicial
let alturaParabens = 300;   // Altura inicial

// Função para ajustar o tamanho da imagem de parabéns
function ajustarTamanhoParabens(novaLargura, novaAltura) {
    larguraParabens = novaLargura;
    alturaParabens = novaAltura;
}

// Exemplo de uso: Ajustar para 600x600
ajustarTamanhoParabens(600, 600);



const imagemFinal = new Image();
imagemFinal.src = 'falas/tauronfala4.png';  // Defina o caminho para a sua imagem final
let mostrarFinal = false;

// Defina a função que será chamada assim que a imagem for carregada
imagemFinal.onload = function() {
    console.log("Imagem final carregada!");
    loop(); // Inicia o loop do jogo após a imagem carregar
};


// Imagem e propriedades do NPC
const imagemNPC = new Image();
imagemNPC.src = 'falas/tauronfala2.png';
let npcX = 500;
let npcY = 0;
let npcLargura = 500;
let npcAltura = 500;
let mostrarNPC = true;

setTimeout(() => {
    mostrarNPC = false;
}, 5050);

function reiniciarJogo() {
    location.reload();
}

function avancarParaFase2() {
    window.location.href = 'fase2.html';
}

const botaoReiniciar = document.getElementById('botaoReiniciar');
botaoReiniciar.addEventListener('click', reiniciarJogo);
botaoReiniciar.classList.add('oculto');

const botaoAvancar = document.getElementById('botaoAvancar');
botaoAvancar.addEventListener('click', avancarParaFase2);
botaoAvancar.classList.add('oculto');

// Criação de obstáculos
let obstaculos = [
    { img: new Image(), x: 200, y: 0, largura: 100, altura: 100 },
    { img: new Image(), x: 200, y: 300, largura: 100, altura: 100 },
    { img: new Image(), x: 1200, y: 120, largura: 100, altura: 100 },
    { img: new Image(), x: 500, y: 400, largura: 100, altura: 100 },
    { img: new Image(), x: 400, y: 150, largura: 100, altura: 100 }
];

obstaculos.forEach(obstaculo => {
    obstaculo.img.src = 'IMG/florestacolisão.png';
    obstaculo.img.style.position = "relative";
    obstaculo.img.style.zIndex = '10';
});

// Variável para rastrear se o jogador colidiu com o fantasma
let colidiuComFantasma = false;  // Variável para rastrear se houve colisão com o fantasma

// Função de atualização do jogo
function atualizar() {
    if (!jogoAtivo) return;
    // Atualize a visibilidade da barra de recompensas
    let novaPosicaoX = personagem.x;
    let novaPosicaoY = personagem.y;

    if (teclas.w && novaPosicaoY > 0) novaPosicaoY -= personagem.velocidade;
    if (teclas.a && novaPosicaoX > 0) novaPosicaoX -= personagem.velocidade;
    if (teclas.s && novaPosicaoY < alturaCanvas - personagem.altura) novaPosicaoY += personagem.velocidade;
    if (teclas.d && novaPosicaoX < larguraCanvas - personagem.largura) novaPosicaoX += personagem.velocidade;

    obstaculos.forEach(obstaculo => {
        if (detectarColisao({ x: novaPosicaoX, y: novaPosicaoY, largura: personagem.largura, altura: personagem.altura }, obstaculo)) {
            novaPosicaoX = personagem.x; // Restringe a movimentação ao colidir
            novaPosicaoY = personagem.y;
        }
    });

    personagem.x = novaPosicaoX;
    personagem.y = novaPosicaoY;

    folhas.forEach(folha => {
        if (!folha.coletada && detectarColisao(personagem, folha)) {
            folha.coletada = true;
            folhasColetadas++;
        }
    });

    const agora = Date.now();
    if (agora - personagem.lastFrameTime >= personagem.tempoFrame) {
        personagem.frame = (personagem.frame + 1) % personagem.totalFrames;
        personagem.lastFrameTime = agora;
    }

    if (fantasma.visivel && jogoAtivo) {
        // Movimentação suave do fantasma
        if (fantasma.x <= 0 || fantasma.x + fantasma.largura >= larguraCanvas) {
            fantasma.direcaoX *= -1; // Muda a direção ao atingir as bordas
        }
        if (fantasma.y <= 0 || fantasma.y + fantasma.altura >= alturaCanvas) {
            fantasma.direcaoY *= -1; // Muda a direção ao atingir as bordas
        }

        // Atualiza a posição do fantasma
        fantasma.x += fantasma.velocidade * fantasma.direcaoX;
        fantasma.y += fantasma.velocidade * fantasma.direcaoY;

        obstaculos.forEach(obstaculo => {
            if (detectarColisao({ x: fantasma.x, y: fantasma.y, largura: fantasma.largura, altura: fantasma.altura }, obstaculo)) {
                fantasma.direcaoX *= -1;
                fantasma.direcaoY *= -1;
            }
        });

        if (detectarColisao(personagem, fantasma)) {
            jogoAtivo = false;
            colidiuComFantasma = true;  // Marca que o jogador colidiu com o fantasma
            setTimeout(() => {
                botaoReiniciar.classList.remove('oculto');
            }, 1000);
        }
    }

    if (folhasColetadas >= folhas.length && !colidiuComFantasma) {
        jogoAtivo = false;
        mostrarParabens = true;
        setTimeout(() => {
            mostrarFinal = true;  // A imagem final só deve aparecer após os parabéns
            botaoAvancar.classList.remove('oculto');
        }, 1000);
    }
}

// Função para detectar colisões entre dois objetos
function detectarColisao(objeto1, objeto2) {
    return !(objeto1.x + objeto1.largura < objeto2.x || 
             objeto1.x > objeto2.x + objeto2.largura || 
             objeto1.y + objeto1.altura < objeto2.y || 
             objeto1.y > objeto2.y + objeto2.altura);
}

// Função de renderização do jogo
function renderizar() {
    ctx.clearRect(0, 0, larguraCanvas, alturaCanvas);

    folhas.forEach(folha => {
        if (!folha.coletada) {
            ctx.drawImage(folha.img, folha.x, folha.y, folha.largura, folha.altura);
        }
    });

    obstaculos.forEach(obstaculo => {
        ctx.drawImage(obstaculo.img, obstaculo.x, obstaculo.y, obstaculo.largura, obstaculo.altura);
    });

    ctx.drawImage(
        personagem.spriteSheet,
        personagem.frame * personagem.spriteWidth, 0, 
        personagem.spriteWidth, personagem.spriteHeight, 
        personagem.x, personagem.y, 
        personagem.largura, personagem.altura
    );

    if (fantasma.visivel) {
        ctx.drawImage(fantasma.img, fantasma.x, fantasma.y, fantasma.largura, fantasma.altura);
    }

    if (mostrarParabens) {
        ctx.drawImage(imagemParabens, larguraCanvas / 2 - larguraParabens / 2, alturaCanvas / 2 - alturaParabens / 2, larguraParabens, alturaParabens);
    }

    if (mostrarNPC) {
        ctx.drawImage(imagemNPC, npcX, npcY, npcLargura, npcAltura);

        // Exibe a imagem final após os parabéns
    if (mostrarFinal) {
        ctx.drawImage(imagemFinal, larguraCanvas / 2 - larguraParabens / 2, alturaCanvas / 2 - alturaParabens / 2, larguraParabens, alturaParabens);
    }
    }
}

let ultimoTempo = 0;
const tempoMaximo = 1000 / 60; // Limitar a 60 FPS


function loop() {
    atualizar();
    renderizar();
    

    requestAnimationFrame(loop);
}
