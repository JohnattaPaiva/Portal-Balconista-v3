// Sistema de Notificações Toast
let navegacaoAtiva = false; // Controla se há navegação em andamento

function mostrarToast(titulo, mensagem, tipo = 'info') {
  const container = document.getElementById('toast-container');
  
  // Cria o elemento toast
  const toast = document.createElement('div');
  toast.className = `toast ${tipo}`;
  
  // Define ícones para cada tipo
  const icones = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  toast.innerHTML = `
    <div class="toast-icon">${icones[tipo] || icones.info}</div>
    <div class="toast-content">
      <div class="toast-title">${titulo}</div>
      <div class="toast-message">${mensagem}</div>
    </div>
    <button class="toast-close" onclick="fecharToast(this)">×</button>
  `;
  
  // Adiciona ao container
  container.appendChild(toast);
  
  // Anima a entrada
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);
  
  // Remove automaticamente após 5 segundos
  setTimeout(() => {
    fecharToast(toast.querySelector('.toast-close'));
  }, 5000);
}

function fecharToast(botao) {
  const toast = botao.closest('.toast');
  toast.classList.remove('show');
  
  setTimeout(() => {
    toast.remove();
  }, 300);
}

// Funções de conveniência
function toastSucesso(titulo, mensagem) {
  mostrarToast(titulo, mensagem, 'success');
}

function toastErro(titulo, mensagem) {
  mostrarToast(titulo, mensagem, 'error');
}

function toastAviso(titulo, mensagem) {
  mostrarToast(titulo, mensagem, 'warning');
}

function toastInfo(titulo, mensagem) {
  mostrarToast(titulo, mensagem, 'info');
}

// Variáveis globais - usando configurações do config.js
const banners = CONFIG_BANNER.imagens;
let bannerAtual = 0;
let corSelecionadaProduto = "";
let corSelecionadaPantalona = "";

// Funções de navegação e interface
function validarLogin() {
  const usuario = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;

  // Verifica se existe um usuário válido na lista
  const usuarioValido = CONFIG_LOGIN.usuarios.find(user => 
    user.usuario === usuario && user.senha === senha
  );

  if (usuarioValido) {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("conteudo-principal").style.display = "block";
    document.body.classList.add("sem-fundo");

    // Exibe o nome do usuário na interface
    document.getElementById("usuario-nome").textContent = `👤 ${usuarioValido.nome}`;

    mostrarSecao('home'); // Exibe a home ao logar
    
    // Toast de boas-vindas
    toastSucesso("Bem-vindo!", `Olá ${usuarioValido.nome}, login realizado com sucesso!`);

    contarAnimado("pontos", CONFIG_PREMIOS.pontosUsuario);
    contarAnimado("premio", CONFIG_PREMIOS.proximoPremio);
  } else {
    toastErro("Erro de Login", "Usuário ou senha incorretos. Tente novamente.");
  }
}

// Função para validar login com Enter
function adicionarEventoEnterLogin() {
  const campoUsuario = document.getElementById("usuario");
  const campoSenha = document.getElementById("senha");
  
  // Adiciona evento de Enter para o campo usuário
  if (campoUsuario) {
    campoUsuario.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        validarLogin();
      }
    });
    
    // Foco automático no campo usuário
    campoUsuario.focus();
  }
  
  // Adiciona evento de Enter para o campo senha
  if (campoSenha) {
    campoSenha.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        validarLogin();
      }
    });
  }
}

function mostrarSecao(secao) {
  // Evita múltiplas navegações simultâneas
  if (navegacaoAtiva) return;
  navegacaoAtiva = true;

  const secaoHome = document.getElementById("secao-home");
  const secaoRegistro = document.getElementById("secao-registro");
  const secaoPremios = document.getElementById("secao-premios");
  const secaoContato = document.getElementById("secao-contato");
  const secaoDashboard = document.getElementById("secao-dashboard");
  const cardsSection = document.getElementById("cards-section");

  // Scroll suave para o topo da página
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

  // Delay pequeno para garantir que o scroll aconteça primeiro
  setTimeout(() => {
    // Esconde todas as seções
    secaoHome.style.display = "none";
    secaoRegistro.style.display = "none";
    secaoPremios.style.display = "none";
    secaoContato.style.display = "none";
    secaoDashboard.style.display = "none";
    cardsSection.style.display = "none";

    // Remove animação antes de trocar de seção
    secaoHome.classList.remove("fade-in-up");
    secaoRegistro.classList.remove("fade-in-up");
    secaoPremios.classList.remove("fade-in-up");
    secaoContato.classList.remove("fade-in-up");
    secaoDashboard.classList.remove("fade-in-up");
    cardsSection.classList.remove("fade-in-up");
  }, 100);

  // Para a rotação automática quando sair da home
  if (secao !== 'home') {
    pararRotacaoAutomatica();
  }

  // Delay para exibir seção após scroll
  setTimeout(() => {
    if (secao === 'home') {
      secaoHome.style.display = "block";
      void secaoHome.offsetWidth;
      secaoHome.classList.add("fade-in-up");
      // Inicializa os botões do banner e rotação automática
      setTimeout(() => {
        inicializarBanner();
        atualizarIndicadores(); // Atualiza indicadores quando mostrar a home
      }, 100);
    } else if (secao === 'registro') {
      console.log("🎯 Mostrando seção de registro...");
      secaoRegistro.style.display = "block";
      cardsSection.style.display = "flex";
      void secaoRegistro.offsetWidth;
      secaoRegistro.classList.add("fade-in-up");
      void cardsSection.offsetWidth;
      cardsSection.classList.add("fade-in-up");
      // Inicializar select de referências
      console.log("🔧 Chamando inicializarSelectReferencias...");
      inicializarSelectReferencias();
      // Atualizar pontos
      contarAnimado("pontos", CONFIG_PREMIOS.pontosUsuario);
      contarAnimado("premio", CONFIG_PREMIOS.proximoPremio);
    } else if (secao === 'premios') {
      secaoPremios.style.display = "block";
      cardsSection.style.display = "flex";
      selecionarCorProduto("Anís");
      selecionarCorPantalona("Preto");
      void secaoPremios.offsetWidth;
      secaoPremios.classList.add("fade-in-up");
      void cardsSection.offsetWidth;
      cardsSection.classList.add("fade-in-up");
      // Atualizar pontos
      contarAnimado("pontos", CONFIG_PREMIOS.pontosUsuario);
      contarAnimado("premio", CONFIG_PREMIOS.proximoPremio);
    } else if (secao === 'dashboard') {
      secaoDashboard.style.display = "block";
      void secaoDashboard.offsetWidth;
      secaoDashboard.classList.add("fade-in-up");
      // Carrega dados do dashboard
      setTimeout(carregarDashboard, 300);
    } else if (secao === 'contato') {
      secaoContato.style.display = "block";
      void secaoContato.offsetWidth;
      secaoContato.classList.add("fade-in-up");
    }
  }, 200); // Delay após scroll
  
  // Libera a navegação após completar
  setTimeout(() => {
    navegacaoAtiva = false;
  }, 400);
}

function sairPortal() {
  if (confirm("Tem certeza que deseja sair do portal?")) {
    // Fecha o menu mobile se estiver aberto
    closeMobileMenu();
    
    // Esconde o conteúdo principal
    document.getElementById("conteudo-principal").style.display = "none";
    // Exibe a tela de login
    document.getElementById("login-container").style.display = "block";
    // Remove a classe sem-fundo para mostrar o background novamente
    document.body.classList.remove("sem-fundo");
    
    // Limpa os campos de login
    document.getElementById("usuario").value = "";
    document.getElementById("senha").value = "";
    
    // Reseta para a home quando logar novamente
    document.getElementById("secao-home").style.display = "none";
    document.getElementById("secao-registro").style.display = "none";
    document.getElementById("secao-premios").style.display = "none";
    document.getElementById("secao-contato").style.display = "none";
    document.getElementById("secao-dashboard").style.display = "none";
    document.getElementById("cards-section").style.display = "none";
  }
}

// Funções do banner rotativo
let transitioning = false; // Previne múltiplos cliques durante a transição
let autoRotateInterval = null; // Controla o intervalo de rotação automática

// Função para garantir que os botões do banner estejam sempre visíveis
function inicializarBanner() {
  const bannerPrev = document.getElementById("banner-prev");
  const bannerNext = document.getElementById("banner-next");
  
  if (bannerPrev && bannerNext) {
    // Força a visibilidade dos botões
    bannerPrev.style.display = "flex";
    bannerNext.style.display = "flex";
    bannerPrev.style.visibility = "visible";
    bannerNext.style.visibility = "visible";
    bannerPrev.style.opacity = "1";
    bannerNext.style.opacity = "1";
  }
  
  // Inicia a rotação automática
  iniciarRotacaoAutomatica();
}

// Função para iniciar rotação automática
function iniciarRotacaoAutomatica() {
  // Para qualquer rotação anterior
  pararRotacaoAutomatica();
  
  // Inicia nova rotação a cada 5 segundos
  autoRotateInterval = setInterval(() => {
    if (!transitioning) {
      trocarBanner(1, true); // Avança para o próximo banner (automático)
    }
  }, CONFIG_BANNER.intervalo);
}

// Função para parar rotação automática
function pararRotacaoAutomatica() {
  if (autoRotateInterval) {
    clearInterval(autoRotateInterval);
    autoRotateInterval = null;
  }
}

// Função para pausar temporariamente a rotação (quando usuário interage)
function pausarRotacaoTemporaria() {
  pararRotacaoAutomatica();
  
  // Reinicia após 10 segundos de inatividade
  setTimeout(() => {
    iniciarRotacaoAutomatica();
  }, 10000);
}

function trocarBanner(direcao, automatico = false) {
  if (transitioning) return; // Evita cliques múltiplos
  
  const bannerImg = document.getElementById("banner-img");
  if (!bannerImg) return;

  // Se foi clique manual, pausa rotação temporariamente
  if (!automatico) {
    pausarRotacaoTemporaria();
  }

  transitioning = true;

  // Calcula o novo índice
  const novoIndice = bannerAtual + direcao;
  if (novoIndice < 0) {
    bannerAtual = banners.length - 1;
  } else if (novoIndice >= banners.length) {
    bannerAtual = 0;
  } else {
    bannerAtual = novoIndice;
  }

  // Efeito de transição suave
  bannerImg.style.transition = "opacity 0.3s ease-in-out";
  bannerImg.style.opacity = "0.3";
  
  setTimeout(() => {
    bannerImg.src = banners[bannerAtual];
    bannerImg.alt = `Banner ${bannerAtual + 1}`;
    
    // Restaura a opacidade
    bannerImg.style.opacity = "1";
    
    // Atualizar indicadores
    atualizarIndicadores();
    
    // Libera para próxima transição
    setTimeout(() => {
      transitioning = false;
    }, 100);
  }, 150);
}

// Função para ir diretamente para um banner específico
function irParaBanner(indice) {
  if (transitioning) return; // Evita cliques múltiplos
  if (indice === bannerAtual) return; // Já está no banner selecionado
  
  pausarRotacaoTemporaria();
  
  const bannerImg = document.getElementById("banner-img");
  if (!bannerImg) return;
  
  transitioning = true;
  bannerAtual = indice;
  
  // Efeito de transição suave
  bannerImg.style.transition = "opacity 0.3s ease-in-out";
  bannerImg.style.opacity = "0.3";
  
  setTimeout(() => {
    bannerImg.src = banners[bannerAtual];
    bannerImg.alt = `Banner ${bannerAtual + 1}`;
    
    // Restaura a opacidade
    bannerImg.style.opacity = "1";
    
    // Atualizar indicadores
    atualizarIndicadores();
    
    // Libera para próxima transição
    setTimeout(() => {
      transitioning = false;
    }, 100);
  }, 150);
}

// Função para atualizar os indicadores visuais
function atualizarIndicadores() {
  const indicators = document.querySelectorAll('.indicator');
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle('active', index === bannerAtual);
  });
}

// Funções de animação
function contarAnimado(id, valorFinal, duracao = CONFIG_ANIMACAO.duracaoContador) {
  const elemento = document.getElementById(id);
  let inicio = 0;
  const incremento = valorFinal / (duracao / 30);

  const contador = setInterval(() => {
    inicio += incremento;
    if (inicio >= valorFinal) {
      inicio = valorFinal;
      clearInterval(contador);
    }
    elemento.textContent = Math.floor(inicio);
  }, 30);
}

// Funções de registro de produto
function inicializarSelectReferencias() {
  console.log("🔧 Inicializando select de referências...");
  const selectReferencia = document.getElementById("referencia");
  if (!selectReferencia) {
    console.error("❌ Elemento select 'referencia' não encontrado!");
    return;
  }
  
  if (!CONFIG_PRODUTOS) {
    console.error("❌ CONFIG_PRODUTOS não está definido!");
    return;
  }
  
  console.log("✅ CONFIG_PRODUTOS encontrado:", CONFIG_PRODUTOS);
  
  // Limpa as opções existentes (exceto a primeira)
  selectReferencia.innerHTML = '<option value="">Selecione uma referência...</option>';
  
  // Adiciona cada produto como opção
  CONFIG_PRODUTOS.produtos.forEach((produto, index) => {
    console.log(`📦 Adicionando produto ${index + 1}:`, produto.referencia, produto.nome);
    const option = document.createElement("option");
    option.value = produto.referencia;
    option.textContent = `${produto.referencia} - ${produto.nome}`;
    option.dataset.produto = JSON.stringify(produto);
    selectReferencia.appendChild(option);
  });
  
  console.log("✅ Select de referências inicializado com", CONFIG_PRODUTOS.produtos.length, "produtos");
}

function atualizarDadosProduto() {
  const selectReferencia = document.getElementById("referencia");
  const selectedOption = selectReferencia.options[selectReferencia.selectedIndex];
  
  const campoNome = document.getElementById("nome-produto");
  const campoCodBarras = document.getElementById("cod_barras");
  const campoEstoque = document.getElementById("estoque-atual");
  const campoQuantidade = document.getElementById("quantidade");
  
  if (selectedOption.value === "") {
    // Limpa todos os campos se nenhuma referência for selecionada
    campoNome.value = "";
    campoCodBarras.value = "";
    campoEstoque.value = "";
    campoQuantidade.value = "";
    return;
  }
  
  try {
    const produto = JSON.parse(selectedOption.dataset.produto);
    
    // Preenche os campos automaticamente
    campoNome.value = produto.nome;
    campoCodBarras.value = produto.codigoBarras;
    campoEstoque.value = produto.estoqueAtual;
    
    // Limpa o campo quantidade para nova entrada
    campoQuantidade.value = "";
    campoQuantidade.focus();
    
  } catch (error) {
    console.error("Erro ao processar dados do produto:", error);
    toastErro("Erro", "Erro ao carregar dados do produto selecionado.");
  }
}

function registrarProduto() {
  const referencia = document.getElementById("referencia").value;
  const nomeProduto = document.getElementById("nome-produto").value;
  const codBarras = document.getElementById("cod_barras").value;
  const estoqueAtual = parseInt(document.getElementById("estoque-atual").value);
  const quantidade = parseInt(document.getElementById("quantidade").value);

  // Validações
  if (!referencia) {
    toastErro("Campo Obrigatório", "Por favor, selecione uma referência.");
    return;
  }
  
  if (!quantidade || quantidade <= 0) {
    toastErro("Quantidade Inválida", "Por favor, informe uma quantidade válida maior que zero.");
    return;
  }
  
  if (quantidade > estoqueAtual) {
    toastErro("Estoque Insuficiente", `Quantidade solicitada (${quantidade}) é maior que o estoque atual (${estoqueAtual}).`);
    return;
  }

  // Simula o registro do produto
  console.log("Produto registrado:", {
    referencia,
    nomeProduto,
    codBarras,
    estoqueAtual,
    quantidadeRegistrada: quantidade
  });
  
  // Atualiza o estoque (simulação)
  const novoEstoque = estoqueAtual - quantidade;
  document.getElementById("estoque-atual").value = novoEstoque;
  
  // Atualiza no CONFIG_PRODUTOS
  const produto = CONFIG_PRODUTOS.produtos.find(p => p.referencia === referencia);
  if (produto) {
    produto.estoqueAtual = novoEstoque;
  }
  
  // Limpa apenas o campo quantidade
  document.getElementById("quantidade").value = "";
  
  // Toast de sucesso
  toastSucesso("Produto Registrado!", `${quantidade} unidade(s) de ${nomeProduto} registrada(s). Estoque atual: ${novoEstoque}`);
}

// Validação em tempo real dos campos
function adicionarValidacaoTempo() {
  // Validação do campo de referência
  const refInput = document.getElementById("referencia");
  if (refInput) {
    refInput.addEventListener("input", function() {
      this.value = this.value.toUpperCase();
    });
  }

  // Validação do campo de código de barras (apenas números)
  const barcodeInput = document.getElementById("cod_barras");
  if (barcodeInput) {
    barcodeInput.addEventListener("input", function() {
      this.value = this.value.replace(/\D/g, '');
    });
  }

  // Validação do campo de quantidade (mínimo 1)
  const quantInput = document.getElementById("quantidade");
  if (quantInput) {
    quantInput.addEventListener("input", function() {
      if (this.value < 1) this.value = 1;
      if (this.value > 999) this.value = 999;
    });
  }
}

// Função para adicionar efeitos visuais nos botões
function adicionarEfeitosVisuais() {
  // Adiciona ripple effect nos botões principais
  document.querySelectorAll('.formulario button, nav button').forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255,255,255,0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      `;
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

// Função para mostrar dicas úteis
function mostrarDicasIniciais() {
  setTimeout(() => {
    toastInfo("Dica do Portal", "Use os botões de navegação acima para explorar todas as funcionalidades!");
  }, 2000);
}

// Funções dos produtos - Produto 1 (T-shirt)
function selecionarCorProduto(cor) {
  corSelecionadaProduto = cor;
  trocarCorProduto();
  // Destaca o ícone selecionado
  document.querySelectorAll('#cores-produto .cor-icone').forEach(el => el.classList.remove('selected'));
  const idx = { "Anís": 0, "Branca": 1, "Cappuccino": 2 }[cor];
  document.querySelectorAll('#cores-produto .cor-icone')[idx].classList.add('selected');
  // Exibe o nome da cor
  document.getElementById('nome-cor-produto').textContent = cor;
}

function trocarCorProduto() {
  const img = document.getElementById("img-produto");
  const imagens = CONFIG_PREMIOS.produtos.tshirt.imagens;
  if (corSelecionadaProduto && imagens[corSelecionadaProduto]) {
    img.src = imagens[corSelecionadaProduto];
  }
}

function resgatarPremio() {
  const tamanho = document.getElementById("tamanho-produto").value;
  const produto = CONFIG_PREMIOS.produtos.tshirt;
  
  if (!corSelecionadaProduto) {
    toastAviso("Selecione uma Cor", "Por favor, selecione uma cor antes de resgatar o prêmio.");
    return;
  }
  
  toastSucesso("Prêmio Resgatado!", `${produto.nome} - Cor: ${corSelecionadaProduto}, Tamanho: ${tamanho}. Parabéns!`);
}

// Funções dos produtos - Produto 2 (Pantalona)
function selecionarCorPantalona(cor) {
  corSelecionadaPantalona = cor;
  trocarCorPantalona();
  // Destaca o ícone selecionado
  document.querySelectorAll('#cores-pantalona .cor-icone').forEach(el => el.classList.remove('selected'));
  const idx = { "Preto": 0, "Cappuccino": 1, "Verde Militar": 2 }[cor];
  document.querySelectorAll('#cores-pantalona .cor-icone')[idx].classList.add('selected');
  // Exibe o nome da cor
  document.getElementById('nome-cor-pantalona').textContent = cor;
}

function trocarCorPantalona() {
  const img = document.getElementById("img-pantalona");
  const imagens = CONFIG_PREMIOS.produtos.pantalona.imagens;
  if (corSelecionadaPantalona && imagens[corSelecionadaPantalona]) {
    img.src = imagens[corSelecionadaPantalona];
  }
}

function resgatarPantalona() {
  const tamanho = document.getElementById("tamanho-pantalona").value;
  const produto = CONFIG_PREMIOS.produtos.pantalona;
  
  if (!corSelecionadaPantalona) {
    toastAviso("Selecione uma Cor", "Por favor, selecione uma cor antes de resgatar o prêmio.");
    return;
  }
  
  toastSucesso("Prêmio Resgatado!", `${produto.nome} - Cor: ${corSelecionadaPantalona}, Tamanho: ${tamanho}. Parabéns!`);
}

// Funções do formulário de contato
function abrirFormularioContato() {
  document.getElementById("modal-contato").style.display = "flex";
}

function fecharFormularioContato() {
  document.getElementById("modal-contato").style.display = "none";
  // Limpa o formulário
  document.getElementById("form-contato").reset();
}

function abrirWhatsApp() {
  window.open(CONFIG_CONTATO.whatsapp, "_blank");
}

// Inicialização quando o DOM carrega
document.addEventListener('DOMContentLoaded', function() {
  // Garantir que o botão close esteja oculto no desktop
  const closeMobileBtn = document.getElementById('close-mobile-btn');
  if (closeMobileBtn && window.innerWidth > 768) {
    closeMobileBtn.style.display = 'none';
    closeMobileBtn.style.visibility = 'hidden';
    closeMobileBtn.style.opacity = '0';
    closeMobileBtn.style.pointerEvents = 'none';
  }

  // Event listener para o formulário de contato
  document.getElementById("form-contato").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const nome = document.getElementById("nome-contato").value;
    const email = document.getElementById("email-contato").value;
    const telefone = document.getElementById("telefone-contato").value;
    const assunto = document.getElementById("assunto-contato").value;
    const mensagem = document.getElementById("mensagem-contato").value;
    
    // Simulação de envio
    console.log("Formulário de contato enviado:", {
      nome, email, telefone, assunto, mensagem
    });
    
    toastSucesso("Mensagem Enviada!", "Sua mensagem foi enviada com sucesso. Entraremos em contato em breve.");
    fecharFormularioContato();
  });
  
  // Adiciona validações em tempo real
  adicionarValidacaoTempo();
  
  // Adiciona efeitos visuais
  adicionarEfeitosVisuais();
  
  // Adiciona evento Enter no login
  adicionarEventoEnterLogin();
  
  // Ajusta interface para dispositivos móveis
  ajustarParaMobile();
  
  // Adiciona suporte a toque para dispositivos móveis
  adicionarSuporteToque();
  
  // Mostra dicas iniciais
  mostrarDicasIniciais();
});

// Função para detectar se é dispositivo móvel
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
         window.innerWidth <= 768;
}

// Função para ajustar interface para dispositivos móveis
function ajustarParaMobile() {
  if (isMobile()) {
    console.log("📱 Dispositivo móvel detectado - Aplicando otimizações");
    
    // Reduz intervalo de rotação automática dos banners em mobile
    if (CONFIG_BANNER && CONFIG_BANNER.intervaloRotacao) {
      CONFIG_BANNER.intervaloRotacao = 7000; // 7 segundos em vez de 5
    }
    
    // Adiciona classe CSS para mobile
    document.body.classList.add('mobile-device');
    
    // Melhora performance removendo algumas animações em dispositivos lentos
    const isSlowDevice = navigator.hardwareConcurrency <= 2;
    if (isSlowDevice) {
      document.body.classList.add('reduced-animations');
    }
    
    // Ajusta toasts para mobile
    const originalToast = window.toastSucesso;
    window.toastSucesso = function(titulo, mensagem) {
      if (originalToast) {
        // Reduz duração dos toasts em mobile
        return originalToast(titulo, mensagem, 3000);
      }
    };
  }
}

// Função para adicionar suporte a toque em dispositivos móveis
function adicionarSuporteToque() {
  let startX = 0;
  let endX = 0;
  
  const bannerImg = document.getElementById('banner-img');
  if (!bannerImg) return;
  
  // Detecta swipe horizontal no banner
  bannerImg.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
  }, { passive: true });
  
  bannerImg.addEventListener('touchend', function(e) {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    const threshold = 50; // Mínimo de pixels para considerar um swipe
    const diff = startX - endX;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swipe para esquerda - próximo banner
        trocarBanner(1);
      } else {
        // Swipe para direita - banner anterior
        trocarBanner(-1);
      }
    }
  }
  
  // Melhora a responsividade dos botões em dispositivos móveis
  const botoesMobile = document.querySelectorAll('nav button, .formulario button, .btn-sair');
  botoesMobile.forEach(botao => {
    // Adiciona feedback visual para toque
    botao.addEventListener('touchstart', function() {
      this.style.opacity = '0.7';
    }, { passive: true });
    
    botao.addEventListener('touchend', function() {
      this.style.opacity = '1';
    }, { passive: true });
    
    // Remove delay de 300ms no clique em iOS
    botao.style.touchAction = 'manipulation';
  });
  
  console.log("✅ Suporte a toque para dispositivos móveis adicionado");
}

// Dados mockados para demonstração
const DADOS_MOCK = {
  vendas: {
    hoje: 15,
    semana: [12, 8, 15, 20, 18, 25, 15],
    faturamento: 8500.00,
    metaProgresso: 78
  },
  produtos: [
    { id: 1, nome: "T-Shirt Básica Branca", categoria: "roupas", marca: "delrio", preco: 49.90, vendas: 45, imagem: "assets/images/produtos/produto-branca.jpg" },
    { id: 2, nome: "Calça Jeans Skinny", categoria: "roupas", marca: "delrio", preco: 159.90, vendas: 32, imagem: "assets/images/produtos/pantalona-preto.jpg" },
    { id: 3, nome: "Blusa Social Feminina", categoria: "roupas", marca: "delrio", preco: 89.90, vendas: 28, imagem: "assets/images/produtos/produto-cappuccino.jpg" },
    { id: 4, nome: "Tênis Esportivo", categoria: "calcados", marca: "nike", preco: 299.90, vendas: 21, imagem: "assets/images/produtos/produto-anis.jpg" },
    { id: 5, nome: "Vestido Casual", categoria: "roupas", marca: "delrio", preco: 129.90, vendas: 18, imagem: "assets/images/produtos/pantalona-cappuccino.jpg" },
    { id: 6, nome: "Bermuda Esportiva", categoria: "roupas", marca: "adidas", preco: 79.90, vendas: 15, imagem: "assets/images/produtos/pantalona-verde-militar.jpg" },
    { id: 7, nome: "Camiseta Polo", categoria: "roupas", marca: "puma", preco: 119.90, vendas: 12, imagem: "assets/images/produtos/produto-branca.jpg" },
    { id: 8, nome: "Jaqueta Jeans", categoria: "roupas", marca: "delrio", preco: 199.90, vendas: 10, imagem: "assets/images/produtos/produto-cappuccino.jpg" }
  ]
};

let produtosFiltrados = [...DADOS_MOCK.produtos];
let paginaAtual = 1;
const itensPorPagina = 6;

// Funções do Dashboard
function carregarDashboard() {
  // Atualiza contadores animados
  contarAnimado("vendas-hoje", DADOS_MOCK.vendas.hoje);
  animarValor("faturamento", CONFIG_PREMIOS.pontosUsuario, "points");
  animarValor("meta-progresso", DADOS_MOCK.vendas.metaProgresso, "percent");
  
  // Cria gráfico simples de vendas
  criarGraficoVendas();
}

function animarValor(elementId, valorFinal, tipo = "number") {
  const elemento = document.getElementById(elementId);
  let inicio = 0;
  const duracao = 1500;
  const incremento = valorFinal / (duracao / 30);

  const contador = setInterval(() => {
    inicio += incremento;
    if (inicio >= valorFinal) {
      inicio = valorFinal;
      clearInterval(contador);
    }
    
    let textoFinal = Math.floor(inicio);
    if (tipo === "currency") {
      textoFinal = `R$ ${inicio.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    } else if (tipo === "percent") {
      textoFinal = `${Math.floor(inicio)}%`;
    } else if (tipo === "points") {
      textoFinal = `${Math.floor(inicio)} pts`;
    }
    
    elemento.textContent = textoFinal;
  }, 30);
}

function criarGraficoVendas() {
  const canvas = document.getElementById('vendas-chart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const dados = DADOS_MOCK.vendas.semana;
  const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  // Configurações do gráfico
  const padding = 40;
  const chartWidth = canvas.width - 2 * padding;
  const chartHeight = canvas.height - 2 * padding;
  const maxValue = Math.max(...dados);
  const barWidth = chartWidth / dados.length;
  
  // Configurações da animação
  let animationProgress = 0;
  const animationDuration = 1500; // 1.5 segundos
  const startTime = Date.now();
  
  function desenharGrafico() {
    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calcula o progresso da animação (0 a 1)
    const currentTime = Date.now();
    const elapsed = currentTime - startTime;
    animationProgress = Math.min(elapsed / animationDuration, 1);
    
    // Easing function (ease-out cubic)
    const easedProgress = 1 - Math.pow(1 - animationProgress, 3);
    
    // Desenha as barras com animação
    dados.forEach((valor, index) => {
      const targetBarHeight = (valor / maxValue) * chartHeight;
      const animatedBarHeight = targetBarHeight * easedProgress;
      
      const x = padding + index * barWidth + barWidth * 0.2;
      const y = canvas.height - padding - animatedBarHeight;
      const width = barWidth * 0.6;
      
      // Gradiente para as barras
      const gradient = ctx.createLinearGradient(0, y, 0, y + animatedBarHeight);
      gradient.addColorStop(0, '#7F80AF');
      gradient.addColorStop(1, '#9a9bcc');
      
      // Sombra da barra
      ctx.shadowColor = 'rgba(127, 128, 175, 0.3)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 2;
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, width, animatedBarHeight);
      
      // Remove sombra para os textos
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      
      // Labels dos dias (aparecem gradualmente)
      ctx.fillStyle = `rgba(102, 102, 102, ${easedProgress})`;
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(dias[index], x + width/2, canvas.height - 10);
      
      // Valores das vendas (aparecem quando a barra está quase completa)
      if (easedProgress > 0.7) {
        const textOpacity = (easedProgress - 0.7) / 0.3;
        ctx.fillStyle = `rgba(51, 51, 51, ${textOpacity})`;
        ctx.font = 'bold 11px Arial';
        ctx.fillText(valor, x + width/2, y - 5);
      }
    });
    
    // Desenha linhas de grade horizontais
    ctx.strokeStyle = `rgba(200, 200, 200, ${easedProgress * 0.5})`;
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
      const y = canvas.height - padding - (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }
    
    // Continua a animação se não terminou
    if (animationProgress < 1) {
      requestAnimationFrame(desenharGrafico);
    }
  }
  
  // Inicia a animação
  desenharGrafico();
}

function filtrarDashboard(periodo) {
  // Remove classe active de todos os botões
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  
  // Adiciona classe active ao botão clicado
  event.target.classList.add('active');
  
  // Simula filtro por período
  let vendasPeriodo = DADOS_MOCK.vendas.hoje;
  let pontosPeriodo = CONFIG_PREMIOS.pontosUsuario;
  
  switch(periodo) {
    case 'hoje':
      vendasPeriodo = 15;
      pontosPeriodo = CONFIG_PREMIOS.pontosUsuario;
      break;
    case 'semana':
      vendasPeriodo = 105;
      pontosPeriodo = CONFIG_PREMIOS.pontosUsuario;
      break;
    case 'mes':
      vendasPeriodo = 450;
      pontosPeriodo = CONFIG_PREMIOS.pontosUsuario;
      break;
    case 'trimestre':
      vendasPeriodo = 1350;
      pontosPeriodo = CONFIG_PREMIOS.pontosUsuario;
      break;
  }
  
  // Atualiza os valores
  contarAnimado("vendas-hoje", vendasPeriodo);
  animarValor("faturamento", pontosPeriodo, "points");
  
  toastInfo("Período Alterado", `Dashboard atualizado para mostrar dados de: ${periodo}`);
}

// Melhorias visuais e de UX
document.addEventListener('DOMContentLoaded', function() {
  // Aplicar melhorias visuais
  aplicarMelhoriasVisuais();
  
  // Auto-rotação de banners
  if (document.getElementById('banner-rotativo')) {
    iniciarAutoRotacao();
  }
  
  // Adicionar efeitos de parallax suave no background
  adicionarEfeitoParallax();
});

// Função para aplicar melhorias visuais
function aplicarMelhoriasVisuais() {
  // Adicionar efeito de loading aos botões
  const botoes = document.querySelectorAll('button');
  botoes.forEach(botao => {
    botao.addEventListener('click', function() {
      if (!this.classList.contains('loading')) {
        this.classList.add('loading');
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
          this.classList.remove('loading');
          this.style.transform = '';
        }, 200);
      }
    });
  });
  
  // Smooth scroll para seções - REMOVIDO para evitar conflitos
  // document.querySelectorAll('button[onclick*="mostrarSecao"]').forEach(botao => {
  //   botao.addEventListener('click', function(e) {
  //     setTimeout(() => {
  //       const secaoAtiva = document.querySelector('section[style*="block"]');
  //       if (secaoAtiva) {
  //         secaoAtiva.scrollIntoView({ behavior: 'smooth', block: 'start' });
  //       }
  //     }, 100);
  //   });
  // });
  
  // Adicionar animação de entrada para elementos
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
      }
    });
  });
  
  document.querySelectorAll('.formulario, .card').forEach(el => {
    observer.observe(el);
  });
}

// Efeito parallax suave
function adicionarEfeitoParallax() {
  let ticking = false;
  
  function updateParallax() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    if (document.body.classList.contains('sem-fundo')) {
      document.body.style.backgroundPosition = `center ${rate}px`;
    }
    
    ticking = false;
  }
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });
}

// Melhorar a função de validação de login com feedback visual
function validarLoginMelhorado() {
  const usuario = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;
  const loginContainer = document.getElementById("login-container");
  
  // Adicionar efeito de loading
  loginContainer.style.transform = 'scale(0.98)';
  loginContainer.style.opacity = '0.8';
  
  setTimeout(() => {
    const usuarioValido = CONFIG_LOGIN.usuarios.find(user => 
      user.usuario === usuario && user.senha === senha
    );

    if (usuarioValido) {
      // Animação de saída suave
      loginContainer.style.animation = 'slideUp 0.5s ease-out forwards';
      
      setTimeout(() => {
        document.getElementById("login-container").style.display = "none";
        document.getElementById("conteudo-principal").style.display = "block";
        document.body.classList.add("sem-fundo");
        
        // Exibe o nome do usuário na interface
        document.getElementById("usuario-nome").textContent = `👤 ${usuarioValido.nome}`;
        
        mostrarSecao('home');
        toastSucesso("Bem-vindo!", `Olá ${usuarioValido.nome}, login realizado com sucesso!`);
        
        contarAnimado("pontos", CONFIG_PREMIOS.pontosUsuario);
        contarAnimado("premio", CONFIG_PREMIOS.proximoPremio);
      }, 300);
    } else {
      // Efeito de shake para erro
      loginContainer.style.animation = 'shake 0.5s ease-in-out';
      loginContainer.style.transform = '';
      loginContainer.style.opacity = '';
      
      setTimeout(() => {
        loginContainer.style.animation = '';
      }, 500);
      
      toastErro("Erro de Login", "Usuário ou senha incorretos. Tente novamente.");
    }
  }, 200);
}

// ===============================
// MENU HAMBURGER MOBILE
// ===============================

// Função para alternar o menu mobile
function toggleMobileMenu() {
  const nav = document.getElementById('main-nav');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const overlay = document.getElementById('mobile-overlay');
  
  if (nav.classList.contains('mobile-open')) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

// Função para abrir o menu mobile
function openMobileMenu() {
  const nav = document.getElementById('main-nav');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const overlay = document.getElementById('mobile-overlay');
  const closeMobileBtn = document.getElementById('close-mobile-btn');
  
  // Primeiro remove qualquer estilo inline que possa interferir
  overlay.style.display = '';
  overlay.style.opacity = '';
  
  // Adiciona classes
  nav.classList.add('mobile-open');
  hamburgerBtn.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden'; // Previne scroll do body
  
  // Garantir que o nav e seus filhos sejam clicáveis
  nav.style.pointerEvents = 'auto';
  nav.style.zIndex = '1001';
  
  // Garantir que todos os botões sejam clicáveis e visíveis
  const buttons = nav.querySelectorAll('button');
  buttons.forEach(button => {
    button.style.pointerEvents = 'auto';
    button.style.zIndex = '1002';
    // Remove estilos que possam interferir com as animações
    button.style.animation = '';
    button.style.transform = '';
    button.style.opacity = '';
  });
  
  // Garantir que os spans de usuário também sejam acessíveis
  const userSections = nav.querySelectorAll('.user-section span');
  userSections.forEach(span => {
    span.style.pointerEvents = 'auto';
    span.style.zIndex = '1002';
  });
  
  // Garantir que o botão fechar seja visível e funcional APENAS EM MOBILE
  if (closeMobileBtn && window.innerWidth <= 768) {
    closeMobileBtn.style.display = 'flex';
    closeMobileBtn.style.visibility = 'visible';
    closeMobileBtn.style.opacity = '1';
    closeMobileBtn.style.pointerEvents = 'auto';
    closeMobileBtn.style.zIndex = '1003';
    // Forçar posicionamento correto
    closeMobileBtn.style.position = 'absolute';
    closeMobileBtn.style.top = '15px';
    closeMobileBtn.style.right = '15px';
  }
}

// Função para fechar o menu mobile
function closeMobileMenu() {
  const nav = document.getElementById('main-nav');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const overlay = document.getElementById('mobile-overlay');
  const closeMobileBtn = document.getElementById('close-mobile-btn');
  
  // Remove classes primeiro
  nav.classList.remove('mobile-open');
  hamburgerBtn.classList.remove('active');
  overlay.classList.remove('active');
  
  // Força a remoção do estilo de display se necessário
  overlay.style.display = 'none';
  overlay.style.opacity = '0';
  
  // Remove estilos inline dos botões para permitir reabertura correta
  const buttons = nav.querySelectorAll('.nav-buttons button, .user-section button, .user-section span');
  buttons.forEach(button => {
    button.style.animation = '';
    button.style.transform = '';
    button.style.opacity = '';
    button.style.pointerEvents = '';
    button.style.zIndex = '';
  });
  
  // Limpa especificamente os estilos do botão fechar para manter posição consistente
  if (closeMobileBtn) {
    closeMobileBtn.style.animation = '';
    closeMobileBtn.style.transform = '';
    closeMobileBtn.style.opacity = '';
    closeMobileBtn.style.pointerEvents = '';
    closeMobileBtn.style.zIndex = '';
    closeMobileBtn.style.position = '';
    closeMobileBtn.style.top = '';
    closeMobileBtn.style.right = '';
  }
  
  // Remove estilos inline do nav
  nav.style.pointerEvents = '';
  nav.style.zIndex = '';
  
  document.body.style.overflow = ''; // Restaura scroll do body
}

// Função inteligente para mostrar seção (detecta automaticamente se deve fechar menu mobile)
function mostrarSecaoInteligente(secao) {
  // Primeiro fecha o menu mobile se estivermos em modo mobile
  if (window.innerWidth <= 768) {
    const nav = document.getElementById('main-nav');
    if (nav && nav.classList.contains('mobile-open')) {
      closeMobileMenu();
      
      // Aguarda um pequeno delay para garantir que o menu seja fechado antes de mostrar a seção
      setTimeout(() => {
        mostrarSecao(secao);
      }, 100);
      return;
    }
  }
  
  // Se não é mobile ou menu não está aberto, mostra seção diretamente
  mostrarSecao(secao);
}

// Função para fechar o menu ao clicar em uma opção de navegação (mantida para compatibilidade)
function mostrarSecaoEFecharMenu(secao) {
  mostrarSecaoInteligente(secao);
}

// Fechar menu ao redimensionar tela para desktop
window.addEventListener('resize', function() {
  const closeMobileBtn = document.getElementById('close-mobile-btn');
  
  if (window.innerWidth > 768) {
    closeMobileMenu();
    // Garantir que o botão close esteja oculto no desktop
    if (closeMobileBtn) {
      closeMobileBtn.style.display = 'none';
      closeMobileBtn.style.visibility = 'hidden';
      closeMobileBtn.style.opacity = '0';
      closeMobileBtn.style.pointerEvents = 'none';
    }
  }
});

// Fechar menu com tecla ESC
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeMobileMenu();
  }
});
