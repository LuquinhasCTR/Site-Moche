// Objeto com todas as traduções do site
const translations = {
  pt: {
    // Cabeçalho
    headerTitle: "Gamifica a tua experiência. Ganha prémios. Diverte-te!",
    pontos: "pts",
    perfil: "Perfil",
    ajuda: "Ajuda",
    
    // Menu de Navegação
    inicio: "Início",
    galoRunner: "Galo Runner",
    galoGame: "Jogo do Galo",
    loja: "Loja",
    roda: "Roda da Sorte",
    
    // Jogo do Galo
    tempoRestante: "Tempo restante: __",
    jogadorX: "Jogador X:",
    jogadorO: "Jogador O:",
    dificuldade: "Dificuldade:",
    facil: "Fácil",
    medio: "Médio",
    dificil: "Difícil",
    
    // Galo Runner
    distancia: "Distância",
    comecar: "Começar",
    recomecar: "Recomeçar",
    instrucoes: "Pressiona <b>Espaço</b> para saltar!",
    
    // Rodapé
    plataforma: "Plataforma de Gamificação",
    desenvolvidoPor: "Desenvolvido por",
    marcaAltice: "Uma marca da Altice Portugal",
    direitos: "Todos os direitos reservados. MOCHE é uma marca registada da Altice Portugal.",
    sobre: "Sobre",
    termos: "Termos e Condições",
    privacidade: "Privacidade"
  },
  en: {
    // Header
    headerTitle: "Gamify your experience. Win prizes. Have fun!",
    pontos: "pts",
    perfil: "Profile",
    ajuda: "Help",
    
    // Navigation Menu
    inicio: "Home",
    galoRunner: "Galo Runner",
    galoGame: "Tic Tac Toe",
    loja: "Store",
    roda: "Wheel of Fortune",
    
    // Tic Tac Toe Game
    tempoRestante: "Time remaining: __",
    jogadorX: "Player X:",
    jogadorO: "Player O:",
    dificuldade: "Difficulty:",
    facil: "Easy",
    medio: "Medium",
    dificil: "Hard",
    
    // Galo Runner
    distancia: "Distance",
    comecar: "Start",
    recomecar: "Restart",
    instrucoes: "Press <b>Space</b> to jump!",
    
    // Footer
    plataforma: "Gamification Platform",
    desenvolvidoPor: "Developed by",
    marcaAltice: "A brand of Altice Portugal",
    direitos: "All rights reserved. MOCHE is a registered trademark of Altice Portugal.",
    sobre: "About",
    termos: "Terms and Conditions",
    privacidade: "Privacy"
  }
};

// Função para traduzir elementos com o atributo data-translate
function translateElements(lang) {
  const elements = document.querySelectorAll('[data-translate]');
  elements.forEach(element => {
    const key = element.getAttribute('data-translate');
    if (translations[lang] && translations[lang][key]) {
      if (element.tagName === 'INPUT' && element.type === 'text') {
        element.placeholder = translations[lang][key];
      } else {
        element.innerHTML = translations[lang][key];
      }
    }
  });
}

// Função para inicializar a tradução
function initTranslation() {
  // Carrega o idioma salvo ou usa o padrão
  const savedLang = localStorage.getItem('moche_lang') || 'pt';
  
  // Encontra o select de idioma na página
  const languageSelect = document.getElementById('language-select');
  if (languageSelect) {
    languageSelect.value = savedLang;
    
    // Adiciona evento ao select de idioma
    languageSelect.addEventListener('change', function() {
      const newLang = this.value;
      localStorage.setItem('moche_lang', newLang);
      translateElements(newLang);
    });
  }
  
  // Aplica a tradução inicial
  translateElements(savedLang);
}

// Inicializa a tradução quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initTranslation);

// Também tenta traduzir se o DOM já estiver carregado
if (document.readyState === 'complete') {
  initTranslation();
} 