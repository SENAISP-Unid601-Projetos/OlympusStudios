// Configurações do jogo
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const larguraCanvas = canvas.width;
const alturaCanvas = canvas.height;

// Variáveis para o NPC
const imagemNPC = new Image();
imagemNPC.src = 'falas/mirabellafala1.png'; // Substitua pelo caminho correto da imagem
let npcVisivel = true; // Controla a visibilidade do NPC

// Coordenadas e dimensões do NPC
let npc = {
    x: 400,   // Posição X no canvas
    y: 20,   // Posição Y no canvas
    largura: 550, // Largura da imagem do NPC
    altura: 500  // Altura da imagem do NPC
};

// Função para desenhar o NPC no canvas
function desenharNPC() {
    if (npcVisivel) {
        ctx.drawImage(imagemNPC, npc.x, npc.y, npc.largura, npc.altura);
    }
}

// Inicializa o tempo de exibição do NPC
imagemNPC.onload = () => {
    // Após 5 segundos, oculta o NPC
    setTimeout(() => {
        npcVisivel = false;
    }, 5000);

    iniciarLoop();
};

// Função para iniciar o loop de renderização
function iniciarLoop() {
    function loop() {
        ctx.clearRect(0, 0, larguraCanvas, alturaCanvas);

        // Desenhar NPC (se visível)
        desenharNPC();

        // Aqui você pode adicionar outros elementos do jogo
        requestAnimationFrame(loop);
    }

    loop();
}

let personagem = {
    x: 100,
    y: 100,
    largura: 50,
    altura: 50,
    velocidade: 5
};

let fantasmas = [];
let fantasmasDerrotados = 0;

// Aqui adicione o inimigo
let inimigo = {
    x: 800,
    y: 300,
    largura: 150,
    altura: 150,
    velocidadeX: 7,
    velocidadeY: 5,
    img: 'IMG/eco.png', // Substitua pelo caminho da imagem do inimigo
    visivel: false
};

// Carregar imagem do inimigo
const imagemInimigo = new Image();
imagemInimigo.src = inimigo.img;

// Segundo inimigo
let inimigo2 = {
    x: 600,   // Posição inicial
    y: 100,
    largura: 100,
    altura: 100,
    velocidadeX: 4,
    velocidadeY: 6,
    img: 'IMG/eco.png', // Caminho para a imagem
    visivel: false
};

// Carregar imagem do segundo inimigo
const imagemInimigo2 = new Image();
imagemInimigo2.src = inimigo2.img;

// Obstáculos adicionais: árvore e pedra
let obstaculos = [
    { img: 'IMG/colisaolago.png', x: 1100, y: 0, largura: 300, altura: 300 },
    { img: 'IMG/arvorescoli.png', x: 1000, y: 170, largura: 200, altura: 150 },
    { img: 'IMG/arvorescoli.png', x: 5, y: 250, largura: 300, altura: 200 },
];

// Carregar imagens dos fantasmas
const imagensFantasmas = [
    'IMG/fantasma.png',
    'IMG/fantasma.png',
    'IMG/fantasma.png',
    'IMG/fantasma.png'
];

// Imagem de parabéns do NPC
const imagemParabens = new Image();
imagemParabens.src = 'falas/mirabellafala2.png';

// Função para carregar imagens
function carregarImagens(srcs) {
    return Promise.all(srcs.map(src => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Erro ao carregar imagem ${src}`));
        });
    }));
}

// Carrega imagens dos obstáculos
function carregarObstaculos() {
    obstaculos.forEach(obstaculo => {
        const img = new Image();
        img.src = obstaculo.img;
        obstaculo.img = img;
    });
}

// Adiciona fantasmas ao serem carregadas as imagens
carregarImagens(imagensFantasmas).then((imagensCarregadas) => {
    // Definindo posições fixas e velocidades iniciais para os fantasmas
    const posicoesFantasmas = [
        { x: 900, y: 150, velocidadeX: 5, velocidadeY: 5 },
        { x: 400, y: 400, velocidadeX: 2, velocidadeY: 2 },
        { x: 600, y: 10, velocidadeX: 2, velocidadeY: 4 },
        { x: 1200, y: 400, velocidadeX: 3, velocidadeY: 3 }
    ];

    imagensCarregadas.forEach((img, index) => {
        const pos = posicoesFantasmas[index];
        fantasmas.push({
            img: img,
            x: pos.x,
            y: pos.y,
            largura: 50,
            altura: 50,
            visivel: true,
            velocidadeX: pos.velocidadeX,
            velocidadeY: pos.velocidadeY
        });
    });

    carregarObstaculos();
    iniciarFase3();
}).catch(error => {
    console.error(error);
});

const teclas = {
    w: false,
    a: false,
    s: false,
    d: false
};

// Carregando elementos
const fala1 = document.getElementById('fala1');
const falaParabens = document.getElementById('parabensFantasmas');
const proximaFase3 = document.getElementById('proximaFase3');
const restartButton = document.getElementById('restartButton'); // Botão de reiniciar

// Inicialmente, os diálogos e o botão devem estar ocultos
fala1.style.opacity = '0';
falaParabens.style.opacity = '0';
proximaFase3.style.display = 'none';
restartButton.style.display = 'none'; // Botão de reiniciar inicialmente oculto

// Função para ajustar as dimensões da imagem de fala1
function ajustarDimensoesFala1(largura, altura) {
    fala1.querySelector('img').style.width = `${largura}px`;
    fala1.querySelector('img').style.height = altura === 'auto' ? 'auto' : `${altura}px`;
}

// Função para ajustar as coordenadas de fala1 (X e Y)
function ajustarCoordenadasFala1(x, y) {
    fala1.style.position = 'absolute';
    fala1.style.left = `${x}px`;
    fala1.style.top = `${y}px`;
}

// Exemplo de uso para ajustar as dimensões e coordenadas de fala1
ajustarDimensoesFala1(580, 'auto');
ajustarCoordenadasFala1(900, 200);  // Ajuste as coordenadas conforme necessário

// Movimentação do personagem
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
});

// Movimentação do personagem com base nas teclas pressionadas
function movimentarPersonagem() {
    let novoX = personagem.x;
    let novoY = personagem.y;

    if (teclas.w) novoY -= personagem.velocidade;
    if (teclas.a) novoX -= personagem.velocidade;
    if (teclas.s) novoY += personagem.velocidade;
    if (teclas.d) novoX += personagem.velocidade;

    // Verifica se o personagem está dentro dos limites do canvas
    if (novoX < 0) novoX = 0;
    if (novoY < 0) novoY = 0;
    if (novoX + personagem.largura > larguraCanvas) novoX = larguraCanvas - personagem.largura;
    if (novoY + personagem.altura > alturaCanvas) novoY = alturaCanvas - personagem.altura;

    // Verifica colisão com obstáculos antes de mover
    const colisaoComObstaculo = obstaculos.some(obstaculo => detectarColisao({ x: novoX, y: novoY, largura: personagem.largura, altura: personagem.altura }, obstaculo));

    if (!colisaoComObstaculo) {
        personagem.x = novoX;
        personagem.y = novoY;
    }
}

// Movimentação do inimigo
function movimentarInimigo() {
    if (!inimigo.visivel) return; // Não movimenta o inimigo se ele ainda não estiver visível

    let novoX = inimigo.x + inimigo.velocidadeX;
    let novoY = inimigo.y + inimigo.velocidadeY;

    const colisaoComObstaculo = obstaculos.some(obstaculo => detectarColisao({
        x: novoX,
        y: novoY,
        largura: inimigo.largura,
        altura: inimigo.altura
    }, obstaculo));

    if (colisaoComObstaculo) {
        inimigo.velocidadeX *= -1;
        inimigo.velocidadeY *= -1;
    } else {
        inimigo.x = novoX;
        inimigo.y = novoY;
    }

    if (inimigo.x < 0 || inimigo.x + inimigo.largura > larguraCanvas) {
        inimigo.velocidadeX *= -1;
    }
    if (inimigo.y < 0 || inimigo.y + inimigo.altura > alturaCanvas) {
        inimigo.velocidadeY *= -1;
    }

    // Verifica colisão com o personagem
    if (detectarColisao(personagem, inimigo)) {
        restartButton.style.display = 'block'; // Exibe o botão de reiniciar fase

        fantasma.visivel = false; // Fantasma derrotado
    fantasmasDerrotados++;

    verificarFantasmasColetados(); // Verifica se todos os fantasmas foram coletados

    if (fantasmasDerrotados === fantasmas.length) {
        exibirParabens();
    }
    }
}

// Movimentação do segundo inimigo (Inimigo 2)
function movimentarInimigo2() {
    if (!inimigo2.visivel) return; // Não movimenta o inimigo se ele não estiver visível

    let novoX = inimigo2.x + inimigo2.velocidadeX;
    let novoY = inimigo2.y + inimigo2.velocidadeY;

    const colisaoComObstaculo = obstaculos.some(obstaculo => detectarColisao({
        x: novoX,
        y: novoY,
        largura: inimigo2.largura,
        altura: inimigo2.altura
    }, obstaculo));

    if (colisaoComObstaculo) {
        inimigo2.velocidadeX *= -1;
        inimigo2.velocidadeY *= -1;
    } else {
        inimigo2.x = novoX;
        inimigo2.y = novoY;
    }

    if (inimigo2.x < 0 || inimigo2.x + inimigo2.largura > larguraCanvas) {
        inimigo2.velocidadeX *= -1;
    }
    if (inimigo2.y < 0 || inimigo2.y + inimigo2.altura > alturaCanvas) {
        inimigo2.velocidadeY *= -1;
    }

    // Verifica colisão com o personagem
    if (detectarColisao(personagem, inimigo2)) {
        inimigo2.visivel = false;  // Inimigo 2 se torna invisível
        restartButton.style.display = 'block'; // Exibe o botão de reiniciar fase
        pausarJogo(); // Pausa o jogo
    }
}

// Função para verificar se todos os fantasmas foram derrotados
function verificarFantasmasColetados() {
    if (fantasmas.every(fantasma => !fantasma.visivel)) {
        inimigo.visivel = false; // Faz o inimigo desaparecer

        if (inimigo2.visivel) {
            inimigo2.visivel = false; // Garante que o inimigo 2 também desapareça se os fantasmas forem derrotados
        }
        
        // Aqui você pode mostrar o botão de avançar fase ou qualquer outro elemento.
        exibirParabens(); // Exibe parabéns quando todos os fantasmas forem derrotados
    }
}


// Movimentação dos fantasmas com colisão
function movimentarFantasmas() {
    fantasmas.forEach(fantasma => {
        if (fantasma.visivel) {
            let novoX = fantasma.x + fantasma.velocidadeX;
            let novoY = fantasma.y + fantasma.velocidadeY;

            // Checa colisão com obstáculos
            const colisaoComObstaculo = obstaculos.some(obstaculo =>
                detectarColisao(
                    { x: novoX, y: novoY, largura: fantasma.largura, altura: fantasma.altura },
                    obstaculo
                )
            );

            if (colisaoComObstaculo) {
                fantasma.velocidadeX *= -1;
                fantasma.velocidadeY *= -1;
            } else {
                fantasma.x = novoX;
                fantasma.y = novoY;
            }

            // Checa colisão com as bordas do canvas
            if (fantasma.x < 0 || fantasma.x + fantasma.largura > larguraCanvas) {
                fantasma.velocidadeX *= -1;
            }
            if (fantasma.y < 0 || fantasma.y + fantasma.altura > alturaCanvas) {
                fantasma.velocidadeY *= -1;
            }

            // Checa colisão com o personagem
            if (detectarColisao(personagem, fantasma)) {
                fantasma.visivel = false; // Fantasma derrotado
                fantasmasDerrotados++;

                verificarFantasmasColetados(); // Verifica se todos os fantasmas foram coletados

                if (fantasmasDerrotados === fantasmas.length) {
                    exibirParabens();
                }
            }
        }
    });
}

// Função para detectar colisão
function detectarColisao(rect1, rect2) {
    return rect1.x < rect2.x + rect2.largura &&
        rect1.x + rect1.largura > rect2.x &&
        rect1.y < rect2.y + rect2.altura &&
        rect1.altura + rect1.y > rect2.y;
}

// Função para exibir parabéns e depois a imagem final
function exibirParabens() {
    falaParabens.style.opacity = '1';
    setTimeout(() => {
        falaParabens.style.opacity = '0';

        // Mostra a imagem final após a mensagem de parabéns
        exibirImagemFinal = true;

        // Exibe a imagem final por 5 segundos e depois avança
        setTimeout(() => {
            exibirImagemFinal = false;
            proximaFase3.style.display = 'block'; // Exibe o botão para a próxima fase
            proximaFase3.style.opacity = '1'; // Torna o botão visível
            
            // Adiciona o evento de clique para avançar para a próxima fase
            proximaFase3.addEventListener('click', () => {
                window.location.href = 'fase4.html'; // Redireciona para a próxima fase
            });
        }, 9000);
    }, 4000);
}

// Desenho da imagem final no canvas
function desenharImagemFinal() {
    if (exibirImagemFinal) {
        // Define as dimensões desejadas
    const larguraDesejada = 590; // Altere para a largura desejada
    const alturaDesejada = 550; // Altere para a altura desejada
    const posX = (larguraCanvas - larguraDesejada) / 2; // Centraliza horizontalmente
    const posY = (alturaCanvas - alturaDesejada) / 2; // Centraliza verticalmente

    ctx.clearRect(0, 0, larguraCanvas, alturaCanvas); // Limpa o canvas
    ctx.drawImage(imagemFinal, posX, posY, larguraDesejada, alturaDesejada); // Desenha a imagem com as dimensões ajustadas

    // Mantém a imagem por 8 segundos
        setTimeout(() => {
            limparCanvas(); // Substitua por qualquer função ou ação que deseja após os 8 segundos
            exibirImagemFinal = false; // Resetar a flag após o tempo
        }, 10000);

    }
}

// Chame esta função no momento em que deseja exibir a imagem final
function finalizarFase() {
    exibirImagemFinal = true; // Habilita a exibição da imagem
    desenharImagemFinal(); // Desenha a imagem
}


// Imagem final após a mensagem de parabéns
const imagemFinal = new Image();
imagemFinal.src = 'falas/mirabellafala3.png'; // Substitua pelo caminho correto da imagem final

let exibirImagemFinal = false; // Controla a visibilidade da imagem final

// Função para reiniciar a fase
function reiniciarFase() {
    personagem.x = 100;
    personagem.y = 100;
    fantasmasDerrotados = 0;
    fantasmas.forEach(fantasma => fantasma.visivel = true);
    restartButton.style.display = 'none'; // Oculta o botão de reiniciar
}


// Função para verificar se o personagem coletou todos os fantasmas
function verificarColetaFantasma() {
    fantasmas.forEach((fantasma, index) => {
        if (detectarColisao(personagem, fantasma)) {
            // Remover o fantasma coletado
            fantasmas.splice(index, 1);
        }
    });

    // Verifica se todos os fantasmas foram coletados
    if (fantasmas.length === 0) {
        // Quando todos os fantasmas forem coletados, a fase foi completada
        faseCompletada();
    }
}


// Função para iniciar a fase 3 com o inimigo aparecendo após 5 segundos
function iniciarFase3() {
    setTimeout(() => {
        inimigo.visivel = true;
    }, 5000);

    setTimeout(() => {
        inimigo2.visivel = true;
    }, 5000);  // O inimigo 2 aparece após 7 segundos

    // Inicialmente, o botão de avançar fase deve estar oculto
    proximaFase3.style.display = 'none';

    // Game loop
    function loop() {
        ctx.clearRect(0, 0, larguraCanvas, alturaCanvas);
        movimentarPersonagem();
        movimentarInimigo();
        movimentarFantasmas();
        movimentarInimigo2();  // Chama a função para movimentar o segundo inimigo

        // Desenha o NPC
        desenharNPC(); // Chama a função para desenhar o NPC

        // Se o jogo estiver pausado, não executa o loop
        if (jogoPausado) {
            return; // Sai do loop
        }

        // Desenha o personagem
        ctx.fillStyle = 'blue';
        ctx.fillRect(personagem.x, personagem.y, personagem.largura, personagem.altura);

        // Desenha o inimigo
        if (inimigo.visivel) {
            ctx.drawImage(imagemInimigo, inimigo.x, inimigo.y, inimigo.largura, inimigo.altura);
        }

        if (inimigo2.visivel) {
            ctx.drawImage(imagemInimigo2, inimigo2.x, inimigo2.y, inimigo2.largura, inimigo2.altura);
        }

        // Desenha os fantasmas
        fantasmas.forEach(fantasma => {
            if (fantasma.visivel) {
                ctx.drawImage(fantasma.img, fantasma.x, fantasma.y, fantasma.largura, fantasma.altura);
            }
        });

        // Desenha os obstáculos
        obstaculos.forEach(obstaculo => {
            ctx.drawImage(obstaculo.img, obstaculo.x, obstaculo.y, obstaculo.largura, obstaculo.altura);
        });

        // Verifica colisão com o personagem
        if (detectarColisao(personagem, inimigo)) {
            restartButton.style.display = 'block'; // Exibe o botão de reiniciar fase
            pausarJogo(); // Pausa o jogo
        }

        if (detectarColisao(personagem, inimigo2)) {
            restartButton.style.display = 'block'; // Exibe o botão de reiniciar para o inimigo 2
            pausarJogo(); // Pausa o jogo
        }

        // Desenha a imagem final, se necessário
    desenharImagemFinal();

        requestAnimationFrame(loop);
    }

    loop();
}

function verificarFantasmasColetados() {
    if (fantasmas.every(fantasma => !fantasma.visivel)) {
        // Todos os fantasmas foram derrotados, então esconda os inimigos
        inimigo.visivel = false;  // Esconde o inimigo 1
        inimigo2.visivel = false; // Esconde o inimigo 2
    }
}

function esconderInimigos() {
    inimigo.visivel = false;
    inimigo2.visivel = false;
}

// Variável para pausar o jogo
let jogoPausado = false;

// Função para pausar o jogo
function pausarJogo() {
    jogoPausado = true;
}

// Função para reiniciar o jogo
function reiniciarJogo() {
    jogoPausado = false;
    reiniciarFase();
}

// Evento do botão de reiniciar para atualizar a página
restartButton.addEventListener('click', () => {
    location.reload(); // Atualiza a página
});

const botaoAvancarFase = document.getElementById('botaoAvancarFase');

// Função para exibir o botão e configurar sua ação
function mostrarBotaoAvancarFase() {
    botaoAvancarFase.style.display = 'block'; // Exibe o botão
    botaoAvancarFase.addEventListener('click', () => {
        window.location.href = 'fase4.html'; // Redireciona para a próxima fase
    });
}

// Inicialmente, o botão é ocultado
proximaFase3.style.display = 'none';

