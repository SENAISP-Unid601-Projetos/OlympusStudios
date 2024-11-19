// Configurações do canvas e contexto
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 1400;
canvas.height = 500;

// Carregamento da spritesheet
const imgSpritesheet = new Image();
imgSpritesheet.src = "IMG/sprite eidan555.png"; // Caminho da sua imagem

// Configurações da spritesheet
const frameWidth = 480; // Largura de cada quadro
const frameHeight = 648; // Altura de cada quadro
const numFrames = 3; // Número de quadros por linha
let currentFrame = 0; // Quadro atual
let frameDelay = 10; // Intervalo de animação
let frameCounter = 0; // Contador de animação
let direction = 0; // Direção do personagem (0 = baixo, 1 = cima, 2 = esquerda, 3 = direita)

// Configurações do personagem
let personagem = { x: 100, y: 100, width: 50, height: 50, speed: 4 };

// Controles
const teclasPressionadas = {};

// Função para desenhar o personagem
function desenharPersonagem() {
    ctx.drawImage(
        imgSpritesheet,
        currentFrame * frameWidth, // Posição X do quadro na spritesheet
        direction * frameHeight, // Posição Y do quadro (baseado na direção)
        frameWidth, // Largura do quadro
        frameHeight, // Altura do quadro
        personagem.x, // Posição X no canvas
        personagem.y, // Posição Y no canvas
        personagem.width, // Largura do personagem no canvas
        personagem.height // Altura do personagem no canvas
    );

    // Atualizar o quadro da animação
    frameCounter++;
    if (frameCounter >= frameDelay) {
        currentFrame = (currentFrame + 1) % numFrames; // Alterna entre os quadros
        frameCounter = 0;
    }
}

// Função para mover o personagem
function moverPersonagem() {
    const movimento = { x: 0, y: 0 };

    if (teclasPressionadas["w"]) {
        movimento.y -= personagem.speed; // Cima
        direction = 1; // Linha 2 (cima)
    }
    if (teclasPressionadas["s"]) {
        movimento.y += personagem.speed; // Baixo
        direction = 0; // Linha 1 (baixo)
    }
    if (teclasPressionadas["a"]) {
        movimento.x -= personagem.speed; // Esquerda
        direction = 2; // Linha 3 (esquerda)
    }
    if (teclasPressionadas["d"]) {
        movimento.x += personagem.speed; // Direita
        direction = 3; // Linha 4 (direita)
    }

    // Movimentação no eixo X
    personagem.x += movimento.x;
    if (verificarColisaoComObstaculos()) {
        personagem.x -= movimento.x; // Reverte o movimento se houver colisão
    }

    // Movimentação no eixo Y
    personagem.y += movimento.y;
    if (verificarColisaoComObstaculos()) {
        personagem.y -= movimento.y; // Reverte o movimento se houver colisão
    }

    // Limitar o movimento dentro do canvas
    personagem.x = Math.max(0, Math.min(personagem.x, canvas.width - personagem.width));
    personagem.y = Math.max(0, Math.min(personagem.y, canvas.height - personagem.height));
}

// Configurações do inimigo
const imgInimigo = new Image();
imgInimigo.src = 'IMG/eco.png'; // Caminho da imagem do inimigo

let inimigo = { 
    x: 700, 
    y: 200, 
    width: 80, 
    height: 80, 
    speedX: 3, 
    speedY: 2, 
    
};

// Função para desenhar o inimigo
function desenharInimigo() {
    ctx.drawImage(
        imgInimigo, 
        inimigo.x, 
        inimigo.y, 
        inimigo.width, 
        inimigo.height
    );
}

// Função para mover o inimigo
function moverInimigo() {
    inimigo.x += inimigo.speedX;
    inimigo.y += inimigo.speedY;

    // Colisão com os limites do canvas
    if (inimigo.x <= 0 || inimigo.x + inimigo.width >= canvas.width) {
        inimigo.speedX *= -1; // Inverte a direção no eixo X
    }
    if (inimigo.y <= 0 || inimigo.y + inimigo.height >= canvas.height) {
        inimigo.speedY *= -1; // Inverte a direção no eixo Y
    }

    // Colisão com obstáculos
    for (let obstaculo of obstaculos) {
        if (
            inimigo.x < obstaculo.x + obstaculo.width &&
            inimigo.x + inimigo.width > obstaculo.x &&
            inimigo.y < obstaculo.y + obstaculo.height &&
            inimigo.y + inimigo.height > obstaculo.y
        ) {
            // Inverte a direção ao colidir com obstáculos
            inimigo.speedX *= -1;
            inimigo.speedY *= -1;
            break;
        }
    }
}

// Função para verificar colisão entre o inimigo e o personagem
function verificarColisaoComInimigo() {
    if (
        personagem.x < inimigo.x + inimigo.width &&
        personagem.x + personagem.width > inimigo.x &&
        personagem.y < inimigo.y + inimigo.height &&
        personagem.y + personagem.height > inimigo.y
    ) {
        // Parar o jogo
        jogoEmAndamento = false;

        // Mostrar botão de reiniciar
        mostrarBotaoReiniciar();
    }
}   

// Configuração do inimigo2
let inimigo2 = {
    x: 1100, // Posição inicial diferente do inimigo1
    y: 100,
    width: 80,
    height: 80,
    speedX: 2, // Velocidade pode ser ajustada para variar o movimento
    speedY: 3,
};

// Função para desenhar o inimigo2
function desenharInimigo2() {
    ctx.drawImage(
        imgInimigo, 
        inimigo2.x, 
        inimigo2.y, 
        inimigo2.width, 
        inimigo2.height
    );
}

// Função para mover o inimigo2
function moverInimigo2() {
    inimigo2.x += inimigo2.speedX;
    inimigo2.y += inimigo2.speedY;

    // Colisão com os limites do canvas
    if (inimigo2.x <= 0 || inimigo2.x + inimigo2.width >= canvas.width) {
        inimigo2.speedX *= -1; // Inverte a direção no eixo X
    }
    if (inimigo2.y <= 0 || inimigo2.y + inimigo2.height >= canvas.height) {
        inimigo2.speedY *= -1; // Inverte a direção no eixo Y
    }

    // Colisão com obstáculos
    for (let obstaculo of obstaculos) {
        if (
            inimigo2.x < obstaculo.x + obstaculo.width &&
            inimigo2.x + inimigo2.width > obstaculo.x &&
            inimigo2.y < obstaculo.y + obstaculo.height &&
            inimigo2.y + inimigo2.height > obstaculo.y
        ) {
            inimigo2.speedX *= -1;
            inimigo2.speedY *= -1;
            break;
        }
    }
}

// Função para verificar colisão com inimigo2
function verificarColisaoComInimigo2() {
    if (
        personagem.x < inimigo2.x + inimigo2.width &&
        personagem.x + personagem.width > inimigo2.x &&
        personagem.y < inimigo2.y + inimigo2.height &&
        personagem.y + personagem.height > inimigo2.y
    ) {
        jogoEmAndamento = false;
        mostrarBotaoReiniciar();
    }
}

// Carregamento das imagens dos cristais
const imgCristal1 = new Image();
imgCristal1.src = 'IMG/cristal da terra.png';

const imgCristal2 = new Image();
imgCristal2.src = 'IMG/cristal da agua.png';

const imgCristal3 = new Image();
imgCristal3.src = 'IMG/cristal do ar.png';

const imgCristal4 = new Image();
imgCristal4.src = 'IMG/cristal da terra.png';

const imgCristal5 = new Image();
imgCristal5.src = 'IMG/cristal da agua.png';

const imgCristal6 = new Image();
imgCristal6.src = 'IMG/cristal do ar.png';

// Carregamento das imagens dos obstáculos
const imgObstaculo1 = new Image();
imgObstaculo1.src = 'IMG/cavernaCIMA.png';
const imgObstaculo2 = new Image();
imgObstaculo2.src = 'IMG/cavernaBaixo.png';
const imgObstaculo3 = new Image();
imgObstaculo3.src = 'IMG/paredecaverna.png';
const imgObstaculo4 = new Image();
imgObstaculo4.src = 'IMG/paredecaverna.png';

// Posições dos obstáculos
const obstaculos = [
    { x: 0, y: 0, width: 1400, height: 100, imagem: imgObstaculo1 },
    { x: 0, y: 400, width: 1400, height: 100, imagem: imgObstaculo2 },
    { x: 300, y: 200, width: 35, height: 200, imagem: imgObstaculo3 },
    { x: 950, y: 25, width: 35, height: 200, imagem: imgObstaculo4 }
];

// Posições fixas para os cristais da vitalidade
const cristais = [
    { x: 100, y: 300, coletado: false, imagem: imgCristal1 },
    { x: 700, y: 350, coletado: false, imagem: imgCristal2 },
    { x: 1200, y: 110, coletado: false, imagem: imgCristal3 },
    { x: 600, y: 100, coletado: false, imagem: imgCristal4 },
    { x: 900, y: 250, coletado: false, imagem: imgCristal5 },
    { x: 1280, y: 310, coletado: false, imagem: imgCristal6 }
];

let cristaisColetados = 0;
let jogoEmAndamento = false;
let npcFalaExibida = false;


// Função para desenhar os cristais da vitalidade
function desenharCristais() {
    cristais.forEach(cristal => {
        if (!cristal.coletado) {
            ctx.drawImage(cristal.imagem, cristal.x, cristal.y, 50, 50);
        }
    });
}

// Função para desenhar os obstáculos
function desenharObstaculos() {
    obstaculos.forEach(obstaculo => {
        ctx.drawImage(obstaculo.imagem, obstaculo.x, obstaculo.y, obstaculo.width, obstaculo.height);
    });
}

// Função para verificar colisão e coletar cristais
function coletarCristais() {
    cristais.forEach(cristal => {
        if (!cristal.coletado &&
            personagem.x < cristal.x + 50 &&
            personagem.x + personagem.width > cristal.x &&
            personagem.y < cristal.y + 50 &&
            personagem.y + personagem.height > cristal.y) {
            cristal.coletado = true;
            cristaisColetados++;
            if (cristaisColetados === cristais.length) {
                finalizarFase();
            }
        }
    });
}

// Função para verificar colisão com obstáculos
function verificarColisaoComObstaculos() {
    for (let obstaculo of obstaculos) {
        if (
            personagem.x < obstaculo.x + obstaculo.width &&
            personagem.x + personagem.width > obstaculo.x &&
            personagem.y < obstaculo.y + obstaculo.height &&
            personagem.y + personagem.height > obstaculo.y
        ) {
            return true;
        }
    }
    return false;
}


// Função para finalizar a fase e mostrar a imagem de parabéns
function finalizarFase() {
    console.log("Fase finalizada!");
    jogoEmAndamento = false;
    mostrarParabens();
}

// Função para mostrar o botão "Reiniciar" ao colidir com o inimigo
function mostrarBotaoReiniciar() {
    // Verifica se o botão já existe, caso contrário cria-o
    let botaoReiniciar = document.getElementById('restartButton');
    if (!botaoReiniciar) {
        botaoReiniciar = document.createElement('button');
        botaoReiniciar.id = 'restartButton';
        botaoReiniciar.textContent = "Tente novamente";
        document.body.appendChild(botaoReiniciar);
    }

    // Adiciona a classe "mostrar" para exibir o botão
    botaoReiniciar.classList.add('mostrar');

    botaoReiniciar.addEventListener("click", function() {
        window.location.reload();
    });
}

// Função para mostrar a fala do NPC
function mostrarFalaNPC() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById('fala1').style.display = 'block';
    setTimeout(() => {
        document.getElementById('fala1').style.display = 'none';
        document.getElementById('fala2').style.display = 'block';
    }, 5000);
    setTimeout(() => {
        document.getElementById('fala2').style.display = 'none';
        jogoEmAndamento = true;
        gameLoop();
    }, 10000);
}

// Função para mostrar a imagem de parabéns e redirecionar após 4 segundos
function mostrarParabens() {
    const imagemParabens = new Image();
    imagemParabens.src = 'falas/gandonfala3.png'; // Certifique-se de que o caminho está correto
    imagemParabens.onload = function() {
        console.log("Imagem de parabéns carregada.");
        // Definir o novo tamanho da imagem
        const novaLargura = 500; // Ajuste o tamanho desejado
        const novaAltura = 500; // Ajuste o tamanho desejado
        // Centralizar a imagem no canvas
        const novaPosX = (canvas.width - novaLargura) / 2;
        const novaPosY = (canvas.height - novaAltura) / 2;
        // Desenhar a imagem no canvas
        ctx.drawImage(imagemParabens, novaPosX, novaPosY, novaLargura, novaAltura);

       // Esperar alguns segundos para exibir o botão final
setTimeout(() => {
    const botaoFinal = document.createElement('button');
    botaoFinal.textContent = "Finalizar";

    // Estilos básicos do botão
    botaoFinal.style.position = "absolute";
    botaoFinal.style.top = "50%";
    botaoFinal.style.left = "50%";
    botaoFinal.style.transform = "translate(-50%, -50%)";
    botaoFinal.style.padding = "15px 30px";
    botaoFinal.style.fontSize = "18px";
    botaoFinal.style.fontFamily = "'Arial', sans-serif";
    botaoFinal.style.color = "white";
    botaoFinal.style.backgroundImage = "linear-gradient(135deg, #244f51, #30797d)";
    botaoFinal.style.border = "none";
    botaoFinal.style.borderRadius = "10px";
    botaoFinal.style.cursor = "pointer";
    botaoFinal.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.2)";
    botaoFinal.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";

    // Animação ao passar o mouse
    botaoFinal.addEventListener("mouseover", () => {
        botaoFinal.style.transform = "translate(-50%, -50%) scale(1.1)";
        botaoFinal.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.3)";
    });
    botaoFinal.addEventListener("mouseout", () => {
        botaoFinal.style.transform = "translate(-50%, -50%) scale(1)";
        botaoFinal.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.2)";
    });

    document.body.appendChild(botaoFinal);

    botaoFinal.addEventListener("click", function() {
        window.location.href = 'final.html';
    });
}, 4000);
        
    };
    imagemParabens.onerror = function() {
        console.error("Erro ao carregar a imagem de parabéns.");
    };
}

// Loop do jogo
function gameLoop() {
    if (!jogoEmAndamento) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenharCristais();
    desenharObstaculos();
    coletarCristais();
    desenharPersonagem(); // Desenhar o personagem
    moverPersonagem(); // Mover o personagem
    desenharInimigo();        // Desenhar o inimigo
    moverInimigo();           // Mover o inimigo
    moverInimigo2();
    desenharInimigo2();
    verificarColisaoComInimigo2();
    verificarColisaoComInimigo(); // Verificar colisão com o inimigo

    requestAnimationFrame(gameLoop);
}

// Controle de teclas
window.addEventListener("keydown", (e) => {
    teclasPressionadas[e.key] = true;
});

window.addEventListener("keyup", (e) => {
    teclasPressionadas[e.key] = false;
}); 

// Iniciar o jogo mostrando a fala do NPC
mostrarFalaNPC();

// Iniciar o loop do jogo
imgSpritesheet.onload = () => {
    gameLoop();
};
