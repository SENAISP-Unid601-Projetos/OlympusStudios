// Configurações do canvas e contexto
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 1400;
canvas.height = 500;

// Variáveis do personagem e movimento
let personagem = { x: 100, y: 100, width: 50, height: 50, speed: 4 };
const teclasPressionadas = {};

// Carregamento das imagens dos cristais
const imgCristal1 = new Image();
imgCristal1.src = 'IMG/cristal da terra.png';

const imgCristal2 = new Image();
imgCristal2.src = 'IMG/cristal da agua.png';

const imgCristal3 = new Image();
imgCristal3.src = 'IMG/cristal do ar.png';

// Carregamento das imagens dos obstáculos
const imgObstaculo1 = new Image();
imgObstaculo1.src = 'IMG/cavernaCIMA.png'; // Substitua pelo caminho da imagem do obstáculo
const imgObstaculo2 = new Image();
imgObstaculo2.src = 'IMG/cavernaBaixo.png'; // Substitua pelo caminho da imagem do obstáculo
const imgObstaculo3 = new Image();
imgObstaculo3.src = 'IMG/paredecaverna.png'; // Substitua pelo caminho da imagem do obstáculo

// Posições dos obstáculos
const obstaculos = [
    { x: 0, y: 0, width: 1400, height: 100, imagem: imgObstaculo1 },
    { x: 0, y: 500, width: 1400, height: 100, imagem: imgObstaculo2 },
    { x: 300, y: 210, width: 35, height: 200, imagem: imgObstaculo3 }
];

// Posições aleatórias para os cristais da vitalidade
const cristais = [
    { x: Math.random() * (canvas.width - 50), y: Math.random() * (canvas.height - 50), coletado: false, imagem: imgCristal1 },
    { x: Math.random() * (canvas.width - 50), y: Math.random() * (canvas.height - 50), coletado: false, imagem: imgCristal2 },
    { x: Math.random() * (canvas.width - 50), y: Math.random() * (canvas.height - 50), coletado: false, imagem: imgCristal3 }
];

let cristaisColetados = 0;
let jogoEmAndamento = false; // Inicialmente desativado
let npcFalaExibida = false; // Controle para a fala do NPC

// Função para desenhar o personagem
function desenharPersonagem() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(personagem.x, personagem.y, personagem.width, personagem.height);
}

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
                finalizarFase();  // Quando o último cristal é coletado
            }
        }
    });
}

// Função para verificar colisão com obstáculos
function verificarColisaoComObstaculos() {
    for (let i = 0; i < obstaculos.length; i++) {
        const obstaculo = obstaculos[i];
        if (personagem.x < obstaculo.x + obstaculo.width &&
            personagem.x + personagem.width > obstaculo.x &&
            personagem.y < obstaculo.y + obstaculo.height &&
            personagem.y + personagem.height > obstaculo.y) {
            // Se houver colisão, impede o movimento do personagem
            return true;
        }
    }
    return false;
}

// Função para mover o personagem
function moverPersonagem() {
    let podeMover = true;

    if (teclasPressionadas['w']) {
        personagem.y -= personagem.speed;
    }
    if (teclasPressionadas['s']) {
        personagem.y += personagem.speed;
    }
    if (teclasPressionadas['a']) {
        personagem.x -= personagem.speed;
    }
    if (teclasPressionadas['d']) {
        personagem.x += personagem.speed;
    }

    // Verifica colisão com obstáculos antes de aplicar o movimento
    if (verificarColisaoComObstaculos()) {
        podeMover = false; // Impede o movimento
    }

    // Limitar movimento para que o personagem não saia da tela
    personagem.x = Math.max(0, Math.min(personagem.x, canvas.width - personagem.width));
    personagem.y = Math.max(0, Math.min(personagem.y, canvas.height - personagem.height));

    // Se não houver colisão, o personagem pode se mover
    if (podeMover) {
        personagem.x = Math.max(0, Math.min(personagem.x, canvas.width - personagem.width));
        personagem.y = Math.max(0, Math.min(personagem.y, canvas.height - personagem.height));
    }
}

// Função para finalizar a fase e mostrar a imagem de parabéns
function finalizarFase() {
    jogoEmAndamento = false;  // Para o loop do jogo
    mostrarParabens();  // Exibe a imagem de parabéns
}

// Função para mostrar a fala do NPC
function mostrarFalaNPC() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
    document.getElementById('fala1').style.display = 'block'; // Exibe a primeira fala
    setTimeout(() => {
        document.getElementById('fala1').style.display = 'none'; // Oculta a primeira fala
        document.getElementById('fala2').style.display = 'block'; // Exibe a segunda fala
    }, 5000); // Aguarda 5 segundos
    setTimeout(() => {
        document.getElementById('fala2').style.display = 'none'; // Oculta a segunda fala
        jogoEmAndamento = true; // Retorna o estado do jogo para ativo
        gameLoop(); // Retorna para o loop do jogo
    }, 10000); // Aguarda 5 segundos após a segunda fala
}

// Função para mostrar a imagem de parabéns e redirecionar após 4 segundos
function mostrarParabens() {
    const imagemParabens = new Image();
    imagemParabens.src = 'falas/gandonfala3.png'; // Imagem de parabéns

    imagemParabens.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
        ctx.drawImage(imagemParabens, (canvas.width - 800) / 2, (canvas.height - 600) / 2, 800, 600); // Centraliza a imagem
    };

    // Após 4 segundos, exibir botão para a próxima fase
    setTimeout(() => {
        mostrarBotaoFinal(); // Função para exibir o botão para a fase final
    }, 4000);
}

// Função para mostrar o botão "Final"
function mostrarBotaoFinal() {
    const botaoFinal = document.createElement('button');
    botaoFinal.textContent = "Ir para o Final";
    botaoFinal.style.position = "absolute";
    botaoFinal.style.top = "50%";
    botaoFinal.style.left = "50%";
    botaoFinal.style.transform = "translate(-50%, -50%)";
    botaoFinal.style.padding = "10px 20px";
    botaoFinal.style.fontSize = "20px";
    botaoFinal.style.backgroundColor = "#f5a623";
    botaoFinal.style.color = "white";
    botaoFinal.style.border = "none";
    botaoFinal.style.cursor = "pointer";
    botaoFinal.style.borderRadius = "5px";
    botaoFinal.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";
    document.body.appendChild(botaoFinal);

    botaoFinal.addEventListener("click", function() {
        // Redirecionar para a fase final ou reiniciar o jogo
        window.location.href = "final.html"; // Substitua pelo endereço correto
    });
}

// Função do loop do jogo
function gameLoop() {
    if (jogoEmAndamento) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas

        desenharObstaculos();
        desenharCristais();
        desenharPersonagem();
        coletarCristais();
        moverPersonagem();

        requestAnimationFrame(gameLoop); // Chama o próximo frame
    }
}

// Função de controle de teclas pressionadas
document.addEventListener('keydown', (event) => {
    teclasPressionadas[event.key.toLowerCase()] = true;
});
document.addEventListener('keyup', (event) => {
    teclasPressionadas[event.key.toLowerCase()] = false;
});

// Inicia o jogo
function iniciarJogo() {
    mostrarFalaNPC(); // Inicia o jogo com a fala do NPC
}

iniciarJogo();
