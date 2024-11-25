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
    totalFrames: 3,
    tempoFrame: 110,
    lastFrameTime: 0
};

personagem.spriteSheet.src = 'IMG/sprite eidan555.png';
personagem.spriteSheet.onload = function() {
    loop(); // Inicia o loop do jogo após a imagem carregar
};

// Imagens das folhas
let folhas = [
    { img: new Image(), coletada: false, x: 80, y: 200, largura: 40, altura: 50 }, //amarelo
    { img: new Image(), coletada: false, x: 150, y: 100, largura: 40, altura: 50 },
    { img: new Image(), coletada: false, x: 800, y: 40, largura: 40, altura: 50 }, //vermelho
    { img: new Image(), coletada: false, x: 1200, y: 50, largura: 40, altura: 50 },
    { img: new Image(), coletada: false, x: 450, y: 20, largura: 40, altura: 50 }, //amarelo
    { img: new Image(), coletada: false, x: 1000, y: 250, largura: 40, altura: 50 },
    { img: new Image(), coletada: false, x: 300, y: 300, largura: 40, altura: 50 },
    { img: new Image(), coletada: false, x: 90, y: 100, largura: 40, altura: 50 } //azul
];

folhas.forEach((folha, index) => {
    folha.img.src = `IMG/poção (${(index % 4) + 1}).png`;
});

let folhasColetadas = 0;
let jogoAtivo = true;

// Configurações do fantasma
let fantasma = {
    x: 1200,
    y: alturaCanvas - 150,
    largura: 100,
    altura: 100,
    velocidade: 3,
    visivel: false,
    img: new Image(),
    direcaoX: 1,
    direcaoY: 1
};

fantasma.img.src = 'IMG/eco.png';

// Configurações do segundo fantasma
let fantasma2 = {
    x: 500, // Posiciona o segundo fantasma em outro lugar
    y: alturaCanvas - 150,
    largura: 120,
    altura: 120,
    velocidade: 3,
    visivel: false,
    img: new Image(),
    direcaoX: 1,
    direcaoY: 1
};

fantasma2.img.src = 'IMG/eco.png';

// O fantasma aparece após um tempo
setTimeout(() => {
    fantasma.visivel = true;
    fantasma2.visivel = true; // O segundo fantasma também aparece após o mesmo tempo
}, 7040);


// Controla as teclas
const teclas = {
    w: false,
    a: false,
    s: false,
    d: false
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'w') {
        teclas.w = true;
        personagem.linha = 1;
        personagem.ultimalinha = 1;
    };
    if (e.key === 'a') {
        teclas.a = true;
        personagem.linha = 2;
        personagem.ultimalinha = 2;
    };
    if (e.key === 's') {
        teclas.s = true;
        personagem.linha = 0;
        personagem.ultimalinha = 0;
    };
    if (e.key === 'd') {
        teclas.d = true;
        personagem.linha = 3;
        personagem.ultimalinha = 3;
    };

    if (personagem.coluna < 2.9) {
        personagem.coluna += 0.05;
    } else { personagem.coluna >= 2.9 };
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'w') {
        teclas.w = false;
    };
    if (e.key === 'a') { teclas.a = false };
    if (e.key === 's') { teclas.s = false };
    if (e.key === 'd') { teclas.d = false };
    if (!teclas.w && !teclas.a && !teclas.s && !teclas.d) {
        personagem.linha = personagem.ultimalinha
        personagem.coluna = 0;
    }

});

// Função para atualizar a coluna da sprite
function atualizarColuna() {
    // Incrementa a coluna apenas se o personagem estiver em movimento
    if (personagem.coluna < 2) {
        personagem.coluna += 0.1; // Incrementa a coluna
    } else {
        personagem.coluna = 0; // Reseta a coluna
    }
}


// Variável para a imagem de parabéns
const imagemParabens = new Image();
imagemParabens.src = 'falas/florisfala3.png';
let mostrarParabens = false;

// Imagem e propriedades do NPC
const imagemNPC = new Image();
imagemNPC.src = 'falas/florisfala1.png';
let npcX = 285;
let npcY = 1;
let npcLargura = 550;
let npcAltura = 550;
let mostrarNPC = true;
imagemNPC.style.position = "absolute";
imagemNPC.style.zIndex = '1000';

const imagem2NPC = new Image();
imagem2NPC.src = 'falas/florisfala2.png'; // Substitua pelo caminho correto da imagem
let mostrarNPC2 = false;

setTimeout(() => {
    mostrarNPC = false;
    mostrarNPC2 = true; // Exibe a nova imagem após o tempo do primeiro NPC
    // Faz a imagem2 desaparecer após 2 segundos
    setTimeout(() => {
        mostrarNPC2 = false;
    }, 2000);
}, 5050);

function reiniciarJogo() {
    location.reload();
}

function avancarParaFase2() {
    window.location.href = 'fase3.html';
}

const botaoReiniciar = document.getElementById('botaoReiniciar');
botaoReiniciar.addEventListener('click', reiniciarJogo);
botaoReiniciar.classList.add('oculto');

const botaoAvancar = document.getElementById('botaoAvancar');
botaoAvancar.addEventListener('click', avancarParaFase2);
botaoAvancar.classList.add('oculto');

// Criação de obstáculos
let obstaculos = [
    { img: new Image(), x: 200, y: 0, largura: 100, altura: 400 },
    { img: new Image(), x: 700, y: 300, largura: 100, altura: 400 },
    // Novo obstáculo: fonte de água
    { img: new Image(), x: 600, y: 20, largura: 100, altura: 120 }
];

obstaculos[0].img.src = 'IMG/arbusto direito.png';
obstaculos[1].img.src = 'IMG/arbusto direito.png';
obstaculos[2].img.src = 'IMG/fontejardim.png'; // Fonte de água

// Função de atualização do jogo
function atualizar() {
    if (!jogoAtivo) return;

    let novaPosicaoX = personagem.x;
    let novaPosicaoY = personagem.y;

    // Verifica se alguma tecla de movimentação está pressionada
    let movimento = false;

    if (teclas.w && novaPosicaoY > 0) {
        novaPosicaoY -= personagem.velocidade;
        movimento = true; // Define que houve movimento
        personagem.linha = 1; // Linha para cima
    }
    if (teclas.a && novaPosicaoX > 0) {
        novaPosicaoX -= personagem.velocidade;
        movimento = true; // Define que houve movimento
        personagem.linha = 2; // Linha para esquerda
    }
    if (teclas.s && novaPosicaoY < alturaCanvas - personagem.altura) {
        novaPosicaoY += personagem.velocidade;
        movimento = true; // Define que houve movimento
        personagem.linha = 0; // Linha para baixo
    }
    if (teclas.d && novaPosicaoX < larguraCanvas - personagem.largura) {
        novaPosicaoX += personagem.velocidade;
        movimento = true; // Define que houve movimento
        personagem.linha = 3; // Linha para direita
    }

    let colisao = false;
    obstaculos.forEach(obstaculo => {
        if (detectarColisao({ x: novaPosicaoX, y: novaPosicaoY, largura: personagem.largura, altura: personagem.altura }, obstaculo)) {
            colisao = true; // Define que houve colisão
        }
    });


    // Atualiza a posição apenas se houve movimento
    if (movimento && !colisao) {
        personagem.x = novaPosicaoX;
        personagem.y = novaPosicaoY;
        atualizarColuna(); // Atualiza a coluna da animação
    } else {
        // Reseta a coluna se não houver movimento
        personagem.coluna = 0;
    }
    obstaculos.forEach(obstaculo => {
        if (detectarColisao({ x: novaPosicaoX, y: novaPosicaoY, largura: personagem.largura, altura: personagem.altura }, obstaculo)) {
            novaPosicaoX = personagem.x;
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
        if (fantasma.x <= 0 || fantasma.x + fantasma.largura >= larguraCanvas) {
            fantasma.direcaoX *= -1;
        }
        if (fantasma.y <= 0 || fantasma.y + fantasma.altura >= alturaCanvas) {
            fantasma.direcaoY *= -1;
        }

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
            botaoReiniciar.classList.remove('oculto');
        }
    }

    // Movimentação do segundo fantasma
    if (fantasma2.visivel && jogoAtivo) {
        if (fantasma2.x <= 0 || fantasma2.x + fantasma2.largura >= larguraCanvas) {
            fantasma2.direcaoX *= -1;
        }
        if (fantasma2.y <= 0 || fantasma2.y + fantasma2.altura >= alturaCanvas) {
            fantasma2.direcaoY *= -1;
        }

        fantasma2.x += fantasma2.velocidade * fantasma2.direcaoX;
        fantasma2.y += fantasma2.velocidade * fantasma2.direcaoY;

        obstaculos.forEach(obstaculo => {
            if (detectarColisao({ x: fantasma2.x, y: fantasma2.y, largura: fantasma2.largura, altura: fantasma2.altura }, obstaculo)) {
                fantasma2.direcaoX *= -1;
                fantasma2.direcaoY *= -1;
            }
        });

        if (detectarColisao(personagem, fantasma2)) {
            jogoAtivo = false;
            botaoReiniciar.classList.remove('oculto');
        }
    }

    if (folhasColetadas === folhas.length) {
        mostrarParabens = true;
        botaoAvancar.classList.remove('oculto');
        jogoAtivo = false;
        fantasma.visivel = false;
    }
}

// Função para detectar colisão
function detectarColisao(retangulo1, retangulo2) {
    return retangulo1.x < retangulo2.x + retangulo2.largura &&
        retangulo1.x + retangulo1.largura > retangulo2.x &&
        retangulo1.y < retangulo2.y + retangulo2.altura &&
        retangulo1.y + retangulo1.altura > retangulo2.y;
}

// Função de renderização
function renderizar() {
    ctx.clearRect(0, 0, larguraCanvas, alturaCanvas);

    obstaculos.forEach(obstaculo => {
        ctx.drawImage(obstaculo.img, obstaculo.x, obstaculo.y, obstaculo.largura, obstaculo.altura);
    });

    ctx.drawImage(personagem.spriteSheet, personagem.frame * personagem.spriteWidth, personagem.linha * personagem.spriteHeight, personagem.spriteWidth, personagem.spriteHeight, personagem.x, personagem.y, personagem.largura, personagem.altura);

    if (personagem.x === 100 && personagem.y === 100) {
        ctx.drawImage(personagem.spriteSheet, 0, 0, personagem.spriteWidth, personagem.spriteHeight, personagem.x, personagem.y, personagem.largura, personagem.altura);
    }

    if (mostrarNPC) {
        ctx.drawImage(imagemNPC, npcX, npcY, npcLargura, npcAltura);
    }

    if (mostrarNPC2) {
        ctx.drawImage(imagem2NPC, npcX, npcY, npcLargura, npcAltura); // Usa as mesmas coordenadas do NPC original
    }

    folhas.forEach(folha => {
        if (!folha.coletada) {
            ctx.drawImage(folha.img, folha.x, folha.y, folha.largura, folha.altura);
        }
    });

    if (fantasma.visivel) {
        ctx.drawImage(fantasma.img, fantasma.x, fantasma.y, fantasma.largura, fantasma.altura);
    }

    if (fantasma2.visivel) {
        ctx.drawImage(fantasma2.img, fantasma2.x, fantasma2.y, fantasma2.largura, fantasma2.altura);
    }

    if (mostrarParabens) {
        ctx.drawImage(imagemParabens, larguraCanvas / 2 - 250, alturaCanvas / 2 - 250, 500, 500);
    }
}

// Loop principal
function loop() {
    atualizar();
    renderizar();
    if (jogoAtivo) requestAnimationFrame(loop);
}

loop();