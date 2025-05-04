class MocheQuest {
  constructor() {
    this.xp = 0;
    this.maxXp = 100;
    this.level = 1;
    this.missions = [
      { id: 1, name: "Ver um vídeo da MOCHE", xp: 10, completed: false },
      { id: 2, name: "Convidar um amigo", xp: 15, completed: false },
      { id: 3, name: "Usar a app por 5 minutos", xp: 5, completed: false }
    ];
    this.prizes = [
      "500MB",
      "1GB",
      "Sticker MOCHE",
      "Nada 😢",
      "Cupão Spotify",
      "T-shirt MOCHE"
    ];
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateUI();
  }

  setupEventListeners() {
    document.querySelectorAll('.mission input[type="checkbox"]').forEach((checkbox, index) => {
      checkbox.addEventListener('change', () => this.toggleMission(index));
    });

    document.querySelector('.btn[onclick="completeMissions()"]')?.addEventListener('click', () => this.completeMissions());
    document.querySelector('.btn[onclick="spinWheel()"]')?.addEventListener('click', () => this.spinWheel());

    document.querySelectorAll('.comprar-btn').forEach(btn => {
      btn.addEventListener('click', () => this.comprarProduto(btn));
    });
  }

  toggleMission(index) {
    this.missions[index].completed = !this.missions[index].completed;
  }

  completeMissions() {
    let totalXp = 0;
    this.missions.forEach(mission => {
      if (mission.completed) {
        totalXp += mission.xp;
        mission.completed = false;
        addHistorico(`Missão completada: ${mission.name}`);
      }
    });

    if (totalXp > 0) {
      this.addXp(totalXp);
      this.showNotification(`Ganhaste ${totalXp} XP!`);
      this.updateUI();
    } else {
      this.showNotification("Seleciona pelo menos uma missão para completar!");
    }
  }

  addXp(amount) {
    this.xp += amount;
    while (this.xp >= this.maxXp) {
      this.xp -= this.maxXp;
      this.level++;
      this.maxXp = Math.floor(this.maxXp * 1.5);
      this.showNotification(`Parabéns! Subiste para o nível ${this.level}!`);
    }
    this.updateXpBar();
  }

  updateXpBar() {
    const percentage = (this.xp / this.maxXp) * 100;
    const xpBar = document.getElementById('xpBar');
    if (xpBar) xpBar.style.width = `${percentage}%`;
    const profilePs = document.querySelectorAll('.profile p');
    if (profilePs.length >= 2) {
      profilePs[0].textContent = window.currentLang === 'en'
        ? `Level: ${this.level}`
        : `Nível: ${this.level}`;
      profilePs[1].textContent = window.currentLang === 'en'
        ? `Points: ${this.xp}/${this.maxXp}`
        : `Pontos: ${this.xp}/${this.maxXp}`;
    }
  }

  spinWheel() {
    const wheel = document.getElementById('wheel');
    const result = document.getElementById('result');
    const spinButton = document.querySelector('#roda-section button');
    spinButton.disabled = true;

    wheel.style.animation = 'spin 3s cubic-bezier(0.17, 0.67, 0.83, 0.67)';

    setTimeout(() => {
      const prize = this.prizes[Math.floor(Math.random() * this.prizes.length)];
      result.textContent = `Parabéns! Ganhaste: ${prize}`;
      
      // Adiciona ao histórico
      const dataAtual = new Date();
      const dataFormatada = dataAtual.toLocaleDateString('pt-PT', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
      
      window.userState.historico.unshift({
        tipo: 'roda',
        texto: `Ganhou ${prize} na Roda da Sorte`,
        data: dataFormatada
      });
      
      wheel.style.animation = '';
      spinButton.disabled = false;
    }, 3000);
  }

  comprarProduto(btn) {
    const preco = parseInt(btn.dataset.preco);
    const nomeProduto = btn.previousElementSibling?.textContent?.trim() || 'Produto';
    
    if (window.userState.pontos >= preco) {
      window.userState.pontos -= preco;
      updateAllPontos();
      
      // Adiciona ao histórico
      const dataAtual = new Date();
      const dataFormatada = dataAtual.toLocaleDateString('pt-PT', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
      
      window.userState.historico.unshift({
        tipo: 'compra',
        texto: `Compra de ${nomeProduto} (-${preco} pts)`,
        data: dataFormatada
      });
      
      this.showNotification(`Compraste: ${nomeProduto}`);
    } else {
      this.showNotification("Pontos insuficientes para comprar!");
    }
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  updateUI() {
    document.querySelectorAll('.mission input[type="checkbox"]').forEach((checkbox, index) => {
      checkbox.checked = this.missions[index].completed;
    });
    this.updateXpBar();
  }
}
document.addEventListener('DOMContentLoaded', () => {
  window.mocheQuest = new MocheQuest();

  // Estado do utilizador
  window.userState = {
    pontos: 0,
    historico: []
  };

  // Funções auxiliares
  window.addHistorico = function (texto) {
    userState.historico.push(texto);
    const li = document.createElement('li');
    li.textContent = texto;
    document.getElementById('historico-list').appendChild(li);
  };

  window.updateAllPontos = function () {
    document.getElementById("pontos-header").textContent = userState.pontos;
  };

  // Importa o código do jogo Galo Runner
  const galoRunnerScript = document.createElement('script');
  galoRunnerScript.src = 'js/galo_runner.js';
  document.head.appendChild(galoRunnerScript);

  window.showSection = (sec) => {
    const sections = ['inicio', 'jogo', 'loja', 'roda', 'perfil'];
    sections.forEach(s => {
      document.getElementById(s + '-section').style.display = (s === sec) ? '' : 'none';
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.section === sec);
    });
    if (sec === 'jogo') {
      initGame();
      setupGameButtons();
      document.getElementById("btnComecar").style.display = "";
      document.getElementById("btnReiniciar").style.display = "none";
      drawGame();
    } else {
      if (gameState.animationFrame) cancelAnimationFrame(gameState.animationFrame);
    }
  };

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      showSection(this.dataset.section);
    });
  });

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

  showSection('inicio');

  const translations = {
    pt: {
      'Home': 'Início',
      'Game': 'Jogo',
      'Store': 'Loja',
      'Lucky Wheel': 'Roda da Sorte',
      'Profile': 'Perfil',
      'Start': 'Começar',
      'Restart': 'Recomeçar',
      'Distance': 'Distância',
      'Level': 'Nível',
      'Points': 'Pontos',
      'Press Space to jump!': 'Pressiona Espaço para saltar!',
      'Gamify your experience. Win prizes. Have fun!': 'Gamifica a tua experiência. Ganha prémios. Diverte-te!',
      'Welcome to MOCHE!': 'Bem-vindo à MOCHE!',
      // ...adiciona mais conforme necessário
    },
    en: {
      'Início': 'Home',
      'Jogo': 'Game',
      'Loja': 'Store',
      'Roda da Sorte': 'Lucky Wheel',
      'Perfil': 'Profile',
      'Começar': 'Start',
      'Recomeçar': 'Restart',
      'Distância': 'Distance',
      'Nível': 'Level',
      'Pontos': 'Points',
      'Pressiona Espaço para saltar!': 'Press Space to jump!',
      'Gamifica a tua experiência. Ganha prémios. Diverte-te!': 'Gamify your experience. Win prizes. Have fun!',
      'Bem-vindo à MOCHE!': 'Welcome to MOCHE!',
      // ...adiciona mais conforme necessário
    }
  };

  const translationsById = {
    'welcome-title': {
      pt: 'Bem-vindo à MOCHE!',
      en: 'Welcome to MOCHE!'
    },
    'welcome-desc': {
      pt: `<strong>MOCHE</strong> é a marca jovem da Altice Portugal, feita para quem quer mais do que um tarifário: quer experiências, prémios, diversão e vantagens exclusivas!<br><br>
Aqui podes jogar, ganhar pontos, rodar a Roda da Sorte e trocar pontos por dados, prémios e muito mais na nossa loja.<br><br>
Junta-te à comunidade MOCHE e descobre tudo o que temos para ti!`,
      en: `<strong>MOCHE</strong> is the youth brand of Altice Portugal, made for those who want more than just a plan: they want experiences, prizes, fun, and exclusive advantages!<br><br>
Here you can play, earn points, spin the Lucky Wheel, and exchange points for data, prizes, and much more in our store.<br><br>
Join the MOCHE community and discover everything we have for you!`
    },
    'jogo-title': {
      pt: '<i class="fa-solid fa-gamepad"></i> Jogo Galo Runner',
      en: '<i class="fa-solid fa-gamepad"></i> Galo Runner Game'
    },
    'jogo-instrucao': {
      pt: 'Pressiona <b>Espaço</b> para saltar!',
      en: 'Press <b>Space</b> to jump!'
    },
    'loja-title': {
      pt: '<i class="fa-solid fa-store"></i> Loja',
      en: '<i class="fa-solid fa-store"></i> Store'
    },
    'roda-title': {
      pt: '🎡 Roda da Sorte',
      en: '🎡 Lucky Wheel'
    },
    'perfil-title': {
      pt: '👤 O Teu Perfil',
      en: '👤 Your Profile'
    },
    'start-main-btn': {
      pt: 'Começar a Jogar',
      en: 'Start Playing'
    },
    // ...adiciona outros blocos conforme necessário
  };

  function translatePage(lang) {
    // Tradução por ID (blocos grandes)
    Object.keys(translationsById).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = translationsById[id][lang];
    });

    // Tradução por texto exato (botões, etc)
    document.querySelectorAll('a, button, h1, h2, h3, p, span, div').forEach(el => {
      Object.keys(translations[lang]).forEach(key => {
        if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
          if (el.textContent.trim() === key) {
            el.textContent = translations[lang][key];
          }
        }
      });
    });

    // Traduzir os menus com ícones
    document.querySelectorAll('.nav-link').forEach(link => {
      for (let node of link.childNodes) {
        if (node.nodeType === 3) {
          const original = node.textContent.trim();
          if (translations[lang][original]) {
            node.textContent = ' ' + translations[lang][original];
          }
        }
      }
    });

    // Traduzir botões de ação
    document.querySelectorAll('.comprar-btn').forEach(btn => {
      btn.textContent = lang === 'en'
        ? 'Buy' + btn.textContent.replace(/Comprar|Buy/, '') // mantém o preço
        : 'Comprar' + btn.textContent.replace(/Comprar|Buy/, '');
    });
    document.querySelectorAll('.btn').forEach(btn => {
      if (btn.textContent.trim() === 'Girar' || btn.textContent.trim() === 'Spin') {
        btn.textContent = lang === 'en' ? 'Spin' : 'Girar';
      }
      if (btn.textContent.trim() === 'Começar' || btn.textContent.trim() === 'Start') {
        btn.textContent = lang === 'en' ? 'Start' : 'Começar';
      }
      if (btn.textContent.trim() === 'Recomeçar' || btn.textContent.trim() === 'Restart') {
        btn.textContent = lang === 'en' ? 'Restart' : 'Recomeçar';
      }
    });

    // Atualizar perfil dinâmico
    if (window.mocheQuest) window.mocheQuest.updateXpBar();

    // Traduzir 'Histórico'
    document.querySelectorAll('h3').forEach(h3 => {
      if (h3.textContent.trim() === 'Histórico' || h3.textContent.trim() === 'History') {
        h3.textContent = lang === 'en' ? 'History' : 'Histórico';
      }
    });
  }

  // Listeners dos botões
  window.currentLang = 'pt';
  document.getElementById('btn-pt').onclick = () => { window.currentLang = 'pt'; translatePage('pt'); };
  document.getElementById('btn-en').onclick = () => { window.currentLang = 'en'; translatePage('en'); };
});

