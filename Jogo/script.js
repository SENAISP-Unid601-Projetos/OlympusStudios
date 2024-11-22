document.addEventListener('DOMContentLoaded', () => {
    const btnJogar = document.getElementById('btn-jogar');
    const btnSobre = document.getElementById('btn-sobre');
    const btnSair = document.getElementById('btn-sair');
    const btnVoltar = document.getElementById('btn-voltar');
    const btnAventura = document.getElementById('btn-aventura');
    const videoSection = document.getElementById('video-section');
    const sobreSection = document.getElementById('sobre-section');
    const menu = document.getElementById('menu');

    // Garantir que as seções de vídeo e sobre estejam ocultas no início
    videoSection.classList.add('oculto');
    sobreSection.classList.add('oculto');

    // Quando clicar no botão "Jogar"
    btnJogar.addEventListener('click', () => {
        menu.style.display = 'none'; // Esconder o menu
        videoSection.style.display = 'flex'; // Mostrar a seção de vídeo
    });

    // Quando clicar no botão "Sobre o Jogo"
    btnSobre.addEventListener('click', () => {
        menu.style.display = 'none'; // Esconder o menu
        sobreSection.style.display = 'flex'; // Mostrar a seção "Sobre o Jogo"
    });

    // Quando clicar no botão "Sair"
    btnSair.addEventListener('click', () => {
        window.close(); // Fechar a janela (funciona apenas em alguns navegadores)
    });

    // Quando clicar no botão "Voltar" na seção "Sobre o Jogo"
    btnVoltar.addEventListener('click', () => {
        sobreSection.style.display = 'none'; // Esconder a seção "Sobre o Jogo"
        menu.style.display = 'flex'; // Voltar para o menu principal
    });

    // Quando clicar no botão "Se aventurar" após o vídeo
    btnAventura.addEventListener('click', () => {
        videoSection.style.display = 'none'; // Esconder a seção de vídeo
        // Redirecionar para a página do jogo ou iniciar o jogo
        window.location.href = 'jogo.html'; // Substitua por sua página de jogo
    });
});

// Seleciona o botão 'Voltar' pelo ID
const btnVoltar = document.getElementById('btn-voltar');

// Adiciona o evento de clique ao botão 'Voltar'
btnVoltar.addEventListener('click', () => {
    // Redireciona para a página index.html
    window.location.href = 'index.html';
});
