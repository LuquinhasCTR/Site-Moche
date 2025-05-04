// --- JOGO GALO RUNNER ---
const gameState = {
  dino: null,
  obstacles: [],
  distance: 0,
  speed: 6,
  level: 1,
  points: 0,
  gameOver: false,
  animationFrame: null,
  lastObstacleTime: 0,
  groundY: 150
};

function initGame() {
  gameState.dino = {
    x: 50,
    y: gameState.groundY,
    vy: 0,
    gravity: 0.6,
    jumpForce: -12,
    width: 40,
    height: 40,
    isJumping: false
  };
  gameState.obstacles = [];
  gameState.distance = 0;
  gameState.speed = 6;
  gameState.level = 1;
  gameState.points = 0;
  gameState.gameOver = false;
  gameState.lastObstacleTime = Date.now();
  document.getElementById("btnReiniciar").style.display = "none";
  document.getElementById("btnComecar").style.display = "block";
  updateGameUI();
  drawGame();
}

function drawGame() {
  const canvas = document.getElementById("galo-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffe066";
  ctx.fillRect(0, gameState.groundY + 10, canvas.width, 5);
  ctx.fillStyle = "#ffcc00";
  ctx.fillRect(gameState.dino.x, gameState.dino.y, gameState.dino.width, gameState.dino.height);
  ctx.font = "32px Arial";
  ctx.fillText("🐓", gameState.dino.x - 6, gameState.dino.y + 34);
  ctx.fillStyle = "#333";
  gameState.obstacles.forEach(obs => {
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  });
  ctx.fillStyle = "#000";
  ctx.font = "16px Arial";
  ctx.fillText(`Nível: ${gameState.level}`, 10, 20);
  ctx.fillText(`Pontos: ${Math.floor(gameState.points)}`, 10, 40);
}

function updateGame() {
  if (gameState.gameOver) return;
  gameState.dino.y += gameState.dino.vy;
  gameState.dino.vy += gameState.dino.gravity;
  if (gameState.dino.y >= gameState.groundY) {
    gameState.dino.y = gameState.groundY;
    gameState.dino.vy = 0;
    gameState.dino.isJumping = false;
  }
  const now = Date.now();
  if (now - gameState.lastObstacleTime > 1200 + Math.random() * 800) {
    gameState.obstacles.push({
      x: 800,
      y: gameState.groundY,
      width: 20 + Math.random() * 20,
      height: 40
    });
    gameState.lastObstacleTime = now;
  }
  gameState.obstacles = gameState.obstacles.filter(obs => {
    obs.x -= gameState.speed;
    return obs.x + obs.width > 0;
  });
  gameState.obstacles.forEach(obs => {
    if (
      gameState.dino.x < obs.x + obs.width &&
      gameState.dino.x + gameState.dino.width > obs.x &&
      gameState.dino.y < obs.y + obs.height &&
      gameState.dino.y + gameState.dino.height > obs.y
    ) {
      return gameOver();
    }
  });
  gameState.distance += gameState.speed * 0.05;
  gameState.points = gameState.distance * 0.5;
  const newLevel = Math.floor(gameState.distance / 100) + 1;
  if (newLevel > gameState.level) {
    gameState.level = newLevel;
    gameState.speed += 1;
    showNotification(`Nível ${gameState.level}! Velocidade aumentada!`);
  }
  updateGameUI();
  drawGame();
  gameState.animationFrame = requestAnimationFrame(updateGame);
}

function gameOver() {
  gameState.gameOver = true;
  cancelAnimationFrame(gameState.animationFrame);
  document.getElementById("btnReiniciar").style.display = "block";
  document.getElementById("btnComecar").style.display = "none";
  
  // Adiciona pontos ao histórico
  const pontosGanhos = Math.floor(gameState.points);
  if (pontosGanhos > 0) {
    window.userState.pontos += pontosGanhos;
    updateAllPontos();
    
    // Adiciona ao histórico
    const dataAtual = new Date();
    const dataFormatada = dataAtual.toLocaleDateString('pt-PT', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
    
    window.userState.historico.unshift({
      tipo: 'jogo',
      texto: `Jogaste Galo Runner e ganhaste ${pontosGanhos} pontos`,
      data: dataFormatada
    });
  }
  
  // Mostra mensagem de game over
  const canvas = document.getElementById("galo-canvas");
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Game Over!", canvas.width/2, canvas.height/2 - 20);
  ctx.font = "16px Arial";
  ctx.fillText(`Pontos: ${Math.floor(gameState.points)}`, canvas.width/2, canvas.height/2 + 10);
}

function updateGameUI() {
  const lang = window.currentLang || 'pt';
  document.getElementById("distancia").textContent =
    lang === 'en'
      ? `Distance: ${Math.floor(gameState.distance)}m | Level: ${gameState.level} | Points: ${Math.floor(gameState.points)}`
      : `Distância: ${Math.floor(gameState.distance)}m | Nível: ${gameState.level} | Pontos: ${Math.floor(gameState.points)}`;
}

function setupGameButtons() {
  const btnComecar = document.getElementById("btnComecar");
  const btnReiniciar = document.getElementById("btnReiniciar");

  if (btnComecar) {
    btnComecar.onclick = function () {
      initGame();
      this.style.display = "none";
      gameState.animationFrame = requestAnimationFrame(updateGame);
    };
  }

  if (btnReiniciar) {
    btnReiniciar.onclick = function () {
      initGame();
      this.style.display = "none";
      gameState.animationFrame = requestAnimationFrame(updateGame);
    };
  }

  document.addEventListener("keydown", function (e) {
    if (e.code === "Space" && !gameState.dino.isJumping && !gameState.gameOver) {
      gameState.dino.vy = gameState.dino.jumpForce;
      gameState.dino.isJumping = true;
    }
  });
}

// Exporta as funções necessárias para o app.js
window.initGame = initGame;
window.setupGameButtons = setupGameButtons;
