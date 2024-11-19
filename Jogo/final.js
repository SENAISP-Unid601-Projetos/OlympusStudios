// Seleciona os botões
const guardianBtn = document.getElementById('guardianBtn');
const realWorldBtn = document.getElementById('realWorldBtn');
const videoRealWorld = document.getElementById('videoRealWorld');
const decisionButtons = document.getElementById('decisionButtons');

// Função para reiniciar o jogo ao se tornar o Guardião
guardianBtn.addEventListener('click', function() {
    alert('Você escolheu se tornar o Guardião de Elder Wood! Reiniciando o jogo...');
    window.location.href = 'index.html'; // Redireciona para a página inicial do jogo
});

// Função para voltar ao mundo real e exibir o vídeo
realWorldBtn.addEventListener('click', function() {
    decisionButtons.style.display = 'none'; // Esconde os botões
    videoRealWorld.classList.remove('oculto'); // Exibe o vídeo
});
