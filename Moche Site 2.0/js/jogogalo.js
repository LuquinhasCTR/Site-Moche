// JavaScript Document
var simbolo = 1; //o jogo comeca sempre com o X ----o valor 1 e X-------o valor 0 e o O------
var ganhou =["i","i","i","i","i","i","i","i","i"];
var aux = 0; //0 significa que ninguém ganho. 1 significa que alguem ganhou
var score_x = 0; //variável para o SCORE do jogador X
var score_o = 0; //variável para o SCORE do jogador O    
var dificuldadeAtual = "medio"; // Dificuldade padrão

// Função para atualizar os pontos do jogador
function atualizarPontosJogador(pontos) {
    if (!window.userState) {
        window.userState = { pontos: 0, historico: [] };
    }
    window.userState.pontos += pontos;
    document.getElementById('pontos-header').textContent = window.userState.pontos;
    localStorage.setItem('moche_pontos', window.userState.pontos);
}

// Carrega os pontos do jogador ao iniciar
window.addEventListener('load', () => {
    const pontosSalvos = parseInt(localStorage.getItem('moche_pontos'));
    if (!window.userState) {
        window.userState = { pontos: 0, historico: [] };
    }
    if (!isNaN(pontosSalvos)) {
        window.userState.pontos = pontosSalvos;
        document.getElementById('pontos-header').textContent = pontosSalvos;
    }
});

function mudaDificuldade() {
    dificuldadeAtual = document.getElementById("dificuldade").value;
    resetJogo();
}

// Função para verificar se alguém ganhou
function verificaVencedor() {
    // Verifica linhas
    for (let i = 0; i < 9; i += 3) {
        if (ganhou[i] !== "i" && ganhou[i] === ganhou[i+1] && ganhou[i] === ganhou[i+2]) {
            return ganhou[i];
        }
    }
    
    // Verifica colunas
    for (let i = 0; i < 3; i++) {
        if (ganhou[i] !== "i" && ganhou[i] === ganhou[i+3] && ganhou[i] === ganhou[i+6]) {
            return ganhou[i];
        }
    }
    
    // Verifica diagonais
    if (ganhou[0] !== "i" && ganhou[0] === ganhou[4] && ganhou[0] === ganhou[8]) {
        return ganhou[0];
    }
    if (ganhou[2] !== "i" && ganhou[2] === ganhou[4] && ganhou[2] === ganhou[6]) {
        return ganhou[2];
    }
    
    // Verifica empate
    let empate = true;
    for (let i = 0; i < 9; i++) {
        if (ganhou[i] === "i") {
            empate = false;
            break;
        }
    }
    if (empate) return "empate";
    
    return null;
}

// Função para jogada do computador
function jogadaComputador() {
    let melhorJogada = -1;
    let nivelDificuldade = Math.random();
    
    // Configurações de dificuldade
    let chanceGanhar = 0.8; // Padrão para médio
    let chanceBloquear = 0.7;
    let chanceErro = 0.3;
    
    // Ajusta as chances baseado na dificuldade
    switch(dificuldadeAtual) {
        case "facil":
            chanceGanhar = 0.5;
            chanceBloquear = 0.4;
            chanceErro = 0.6;
            break;
        case "dificil":
            chanceGanhar = 0.9;
            chanceBloquear = 0.8;
            chanceErro = 0.1;
            break;
    }
    
    // 1. Tenta ganhar
    if (nivelDificuldade < chanceGanhar) {
        for (let i = 0; i < 9; i++) {
            if (ganhou[i] === "i") {
                ganhou[i] = "o";
                if (verificaVencedor() === "o") {
                    melhorJogada = i;
                    ganhou[i] = "i";
                    break;
                }
                ganhou[i] = "i";
            }
        }
    }
    
    // 2. Tenta bloquear o jogador
    if (melhorJogada === -1 && nivelDificuldade < chanceBloquear) {
        for (let i = 0; i < 9; i++) {
            if (ganhou[i] === "i") {
                ganhou[i] = "x";
                if (verificaVencedor() === "x") {
                    melhorJogada = i;
                    ganhou[i] = "i";
                    break;
                }
                ganhou[i] = "i";
            }
        }
    }
    
    // 3. Joga aleatório se não encontrou melhor jogada
    if (melhorJogada === -1) {
        let jogadasPossiveis = [];
        for (let i = 0; i < 9; i++) {
            if (ganhou[i] === "i") {
                jogadasPossiveis.push(i);
            }
        }
        if (jogadasPossiveis.length > 0) {
            // Chance de fazer uma jogada ruim baseada na dificuldade
            if (nivelDificuldade > (1 - chanceErro)) {
                // Escolhe uma jogada que não é estratégica
                let jogadasNaoEstrategicas = jogadasPossiveis.filter(pos => {
                    // Evita cantos e centro
                    return pos !== 0 && pos !== 2 && pos !== 6 && pos !== 8 && pos !== 4;
                });
                if (jogadasNaoEstrategicas.length > 0) {
                    melhorJogada = jogadasNaoEstrategicas[Math.floor(Math.random() * jogadasNaoEstrategicas.length)];
                } else {
                    melhorJogada = jogadasPossiveis[Math.floor(Math.random() * jogadasPossiveis.length)];
                }
            } else {
                // Joga normalmente
                melhorJogada = jogadasPossiveis[Math.floor(Math.random() * jogadasPossiveis.length)];
            }
        }
    }
    
    // Executa a jogada
    if (melhorJogada !== -1) {
        document.getElementById("celula" + (melhorJogada + 1)).setAttribute('src', "assets/images/O.png");
        ganhou[melhorJogada] = "o";
        simbolo = 1;
        
        // Verifica se o computador ganhou
        let vencedor = verificaVencedor();
        if (vencedor === "o") {
            aux = 1;
            score_o++;
            document.getElementById("jogadoro").value = score_o;
            clearTimeout(meu_timer);
            clearInterval(mostra_contagem_decrescente);
            mostrarNotificacao("O computador ganhou! Tente novamente!");
            resetJogo();
        } else if (vencedor === "empate") {
            mostrarNotificacao("Empate! Ninguém ganhou!");
            resetJogo();
        } else {
            timer_de_jogada();
        }
    }
}

function resetJogo() {
    for (let i = 1; i <= 9; i++) {
        document.getElementById("celula" + i).setAttribute('src', "assets/images/logo_moche.png");
    }
    ganhou = ["i","i","i","i","i","i","i","i","i"];
    simbolo = 1;
    aux = 0;
}

function muda_imagem(x) {
    if (simbolo === 1 && document.getElementById("celula"+x).getAttribute("src") === "assets/images/logo_moche.png") {
        document.getElementById("celula"+x).setAttribute('src', "assets/images/x.png");
        ganhou[x-1] = "x";
        simbolo = 0;
        
        // Verifica se o jogador ganhou
        let vencedor = verificaVencedor();
        if (vencedor === "x") {
            aux = 1;
            score_x++;
            document.getElementById("jogadorx").value = score_x;
            clearTimeout(meu_timer);
            clearInterval(mostra_contagem_decrescente);
            
            // Adiciona pontos baseado na dificuldade
            let pontosGanhos = 0;
            switch(dificuldadeAtual) {
                case "facil":
                    pontosGanhos = 5;
                    break;
                case "medio":
                    pontosGanhos = 10;
                    break;
                case "dificil":
                    pontosGanhos = 15;
                    break;
            }
            atualizarPontosJogador(pontosGanhos);
            
            mostrarNotificacao(`Você ganhou! Parabéns! Ganhou ${pontosGanhos} pontos!`);
            resetJogo();
        } else if (vencedor === "empate") {
            mostrarNotificacao("Empate! Ninguém ganhou!");
            resetJogo();
        } else {
            // Jogada do computador
            setTimeout(jogadaComputador, 500);
        }
    }
}

// Sistema de tempo
var meu_timer;
var mostra_contagem_decrescente;
var tempo_contagem_decrescente = 5000;

function timer_de_jogada() {
    if((score_x - score_o) > 2 || (score_o - score_x) > 2) {
        tempo_contagem_decrescente = 2000;
    } else {
        tempo_contagem_decrescente = 5000;
    }
    
    clearTimeout(meu_timer);
    clearInterval(mostra_contagem_decrescente);
    
    var inicio = new Date().getTime();
    meu_timer = setTimeout(function() {
        if (simbolo === 1) {
            jogadaComputador();
        }
    }, tempo_contagem_decrescente);
    
    mostra_contagem_decrescente = setInterval(function() {
        var now = new Date().getTime();
        var distance = now - inicio;
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        document.getElementById("contagem_decrescente").innerHTML = "Tempo restante: " + ((tempo_contagem_decrescente/1000) - seconds) + " s";
    }, 100);
}

// Notificação customizada no estilo do site
function mostrarNotificacao(mensagem) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = mensagem;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 3000);
} 