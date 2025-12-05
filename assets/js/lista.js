const API_URL = "https://backend-adoteaqui-06i1.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  // Função para selecionar um único elemento
  const $ = (s, root = document) => root.querySelector(s);
  
  // Função para selecionar vários elementos
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  // Função para exibir mensagens de erro
  const erro = (msg) => {
    const area = $("#galeria-pets");
    if (area) area.innerHTML = `<p style="color:#fff; text-align:center; padding:30px;">${msg}</p>`;
  };

  // Função para abrir o popup de filtros
  const abrirPopup = () => {
    const p = $("#popup-filtros");
    const box = p?.querySelector(".popup-content");
    if (!p || !box) return;

    p.classList.remove("hidden");  // Mostra o popup
    requestAnimationFrame(() => {
      p.classList.add("show");  // Inicia a animação de exibição
      box.classList.remove("bolha");
      void box.offsetWidth;  // Força a reflow para animação
      box.classList.add("bolha");
    });
  };

  // Função para fechar o popup de filtros
  const fecharPopup = () => {
    const p = $("#popup-filtros");
    const box = p?.querySelector(".popup-content");
    if (!p || !box) return;

    box.classList.remove("bolha");  // Remove a animação
    p.classList.remove("show");  // Fecha o popup
    setTimeout(() => p.classList.add("hidden"), 300);  // Esconde o popup após animação
  };

  // Função para configurar o menu (desktop e mobile)
  const configurarMenu = () => {
    const desktop = $$(".menu-desktop a:not(#btn-filtrar)");
    const mobile = $$(".menu-mobile a:not(#btn-filtrar-mobile)");

    // Função para ativar o link do menu (marcando o link selecionado)
    const ativar = (link, grupo) => {
      grupo.forEach((a) => a.classList.remove("ativo"));
      link.classList.add("ativo");
    };

    // Configura os links do menu desktop
    [...desktop].forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        ativar(link, desktop);
        renderizarPets();
      });
    });

    // Configura os links do menu mobile
    [...mobile].forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        ativar(link, mobile);
        renderizarPets();
      });
    });

    // Função para abrir as categorias de pets ao clicar no menu
    const abrirCategorias = async (e) => {
      e.preventDefault();
      document.querySelectorAll(".menu a.ativo").forEach((a) => a.classList.remove("ativo"));
      e.currentTarget.classList.add("ativo");

      const area = $("#galeria-pets");
      if (!area) return;

      area.innerHTML = "<h2>Carregando categorias...</h2>";

      try {
        const r = await fetch(`${API_URL}/tipos`);
        const data = await r.json();
        const tipos = data.tipos || [];

        area.innerHTML = tipos
          .map(
            (t) => `
          <div class="categoria-item" data-id="${t.id}">
            <img src="${t.imageUrl}">
            <span>${t.nome}</span>
          </div>`
          )
          .join("");

        // Adiciona o evento de clique para cada categoria de pet
        $$(".categoria-item").forEach((el) => {
          el.addEventListener("click", () => {
            renderizarPorCategoria(el.dataset.id);
          });
        });
      } catch (e) {
        erro("Erro ao carregar categorias.");
      }
    };

    // Evento para abrir as categorias ao clicar nos links correspondentes
    [...$$(".menu-desktop a"), ...$$(".menu-mobile a")].forEach((a) => {
      if (a.textContent.toLowerCase().includes("categor")) {
        a.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          abrirCategorias(e);
        });
      }
    });
  };

  // Função para configurar o popup de filtros
  const configurarPopup = () => {
    const btnDesk = $("#btn-filtrar");
    const btnMob = $("#btn-filtrar-mobile");
    const fechar = $("#btn-fechar-popup");
    const aplicar = $("#btn-aplicar-filtros");

    // Configura os botões de filtro para desktop e mobile
    btnDesk?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      abrirPopup();
    });

    btnMob?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      abrirPopup();
    });

    fechar?.addEventListener("click", (e) => {
      e.preventDefault();
      fecharPopup();
    });

    // Aplica os filtros selecionados
    aplicar?.addEventListener("click", async (e) => {
      e.preventDefault();

      const filtro = {
        especie: $("#filtro-especie")?.value || "",
        idade: $("#filtro-idade")?.value || "",
        tamanho: $("#filtro-tamanho")?.value || "",
        genero: $("#filtro-genero")?.value || "",
      };

      const params = new URLSearchParams();
      Object.entries(filtro).forEach(([k, v]) => v && params.append(k, v));

      const area = $("#galeria-pets");
      if (area) area.innerHTML = "<h2>Filtrando...</h2>";

      try {
        const r = await fetch(`${API_URL}/pets?${params}`);
        const data = await r.json();
        const lista = data.pets || [];

        area.innerHTML = lista.length
          ? lista.map(criarCard).join("")
          : "<p>Nenhum pet encontrado.</p>";
      } catch (_) {
        erro("Erro ao aplicar filtros.");
      }

      fecharPopup();
    });
  };

  // Função para configurar a busca por termo
  const configurarBusca = () => {
    const input = $("#campo-busca") || $("#campo-busca-mobile") || $(".busca input");
    if (!input) return;

    input.addEventListener(
        "input",
        debounce(async (e) => {
            const termo = (e.target.value || "").trim();
            const area = $("#galeria-pets");

            if (!termo) {
                renderizarPets();
                return;
            }

            area.innerHTML = "<h2>Pegando a ração...</h2>";

            try {
                const r = await fetch(`${API_URL}/pets/buscar?termo=${encodeURIComponent(termo)}`);
                const data = await r.json();
                
                if (data.pets && data.pets.length > 0) {
                    area.innerHTML = data.pets.map(criarCard).join("");
                } else {
                    area.innerHTML = `
                        <div style="text-align:center; padding:20px;">
                            <p style="font-size:20px; margin-bottom:10px;">O pet que você mencionou ("${termo}") não está aqui.</p>
                        </div>`;
                }
            } catch (error) {
                console.error('Erro na busca:', error);
                erro("Erro ao buscar pets. Tente novamente.");
            }
        }, 300)
    );
  };

  // Função para "debounce" a busca (evitar múltiplos pedidos)
  const debounce = (fn, t = 200) => {
    let id;
    return (...args) => {
      clearTimeout(id);
      id = setTimeout(() => fn.apply(null, args), t);
    };
  };

  // Carrega os tipos de pets da API
  let tipos = [];

  const carregarTipos = async () => {
    try {
      const r = await fetch(`${API_URL}/tipos`);
      const data = await r.json();
      tipos = data.tipos || [];
    } catch (_) {
      tipos = [];
    }
  };

  // Função para criar o card de pet
  const criarCard = (pet) => {
    const tipo = tipos.find((t) => +t.id === +pet.tipoId);
    const img = tipo?.imageUrl || pet.imageUrl || "../img/default.jpg";

    return `
      <a class="card card-link" href="../../pages/pet.html?id=${pet.id}">
        <img src="${img}" alt="${pet.nome}">
        <h2>${pet.nome}</h2>
        <p>${pet.local || pet.cidade || "Local não informado"}</p>
      </a>
    `;
  };

  // Função para embaralhar a lista de pets (para exibição aleatória)
  const embaralhar = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Função para renderizar os pets na galeria
  const renderizarPets = async () => {
    const area = $("#galeria-pets");
    if (!area) return;

    area.innerHTML = "<h2>Colocando coleira nos dados…</h2>";

    try {
      const r = await fetch(`${API_URL}/pets`);
      const data = await r.json();
      let lista = embaralhar(data.pets || []);

      area.innerHTML = "";

      if (!lista.length) {
        area.innerHTML = "<p>Acho que os pets estão se escondendo… mas nada que um pouco de ração não resolva!</p>";
        return;
      }

      lista.forEach((pet, i) => {
        const d = document.createElement("div");
        d.innerHTML = criarCard(pet);
        const c = d.firstElementChild;
        c.style.animationDelay = `${i * 40}ms`;
        area.appendChild(c);
      });
    } catch (_) {
      erro("Erro ao carregar pets.");
    }
  };

  // Função para renderizar os pets por categoria
  const renderizarPorCategoria = async (id) => {
    const area = $("#galeria-pets");
    if (!area) return;

    area.innerHTML = "<h2>Carregando pets...</h2>";

    try {
      const r = await fetch(`${API_URL}/pets?tipoId=${id}`);
      const data = await r.json();
      const lista = data.pets || [];

      area.innerHTML = lista.length
        ? lista.map(criarCard).join("")
        : "<p>Nenhum pet encontrado.</p>";
    } catch (_) {
      erro("Erro ao carregar pets da categoria.");
    }
  };

  // Inicializa a aplicação
  (async () => {
    await carregarTipos();
    configurarMenu();
    configurarBusca();
    configurarPopup();
    renderizarPets();
  })();

  // Expõe funções globais para uso em outras partes do código
  window.__adote = {
    abrirPopup,
    fecharPopup,
    renderizarPets,
    renderizarPorCategoria,
  };
});

// Função para atualizar o cabeçalho (menu) com informações do usuário
document.addEventListener("DOMContentLoaded", () => {
  atualizarCabecalho();
});

document.addEventListener("DOMContentLoaded", () => {
  atualizarCabecalho();
});

// Função para atualizar o cabeçalho com os dados do usuário (logado ou deslogado)
function atualizarCabecalho() {
  const usuarioString = localStorage.getItem("usuario_adote");
  const sessaoEncerrada = localStorage.getItem("sessao_encerrada");
  const botaoLogins = document.querySelectorAll(".login-desktop .login, .login-mobile-standalone .login");

  botaoLogins.forEach(botaoLogin => {
    const loginContainer = botaoLogin.parentNode;
    const novoBotao = document.createElement("a");
    novoBotao.className = "login";
    const isMobileStandalone = loginContainer.classList.contains("login-mobile-standalone");

    //SE O USUÁRIO ESTÁ LOGADO
    if (usuarioString && !sessaoEncerrada) {
      const usuario = JSON.parse(usuarioString);
      const nomeUsuario = usuario.email.split("@")[0];

      // PEGAR AVATAR DO USUÁRIO (SE TIVER)
      const avatar = usuario.avatar || "../assets/img/avatar.png";

      novoBotao.href = "#";
      novoBotao.classList.add("usuario-logado");

      if (isMobileStandalone) {
        novoBotao.innerHTML = `
          <img src="${avatar}" class="icon" alt="Usuário">
          <span>Olá, ${nomeUsuario}</span>
        `;
      } else {
        novoBotao.innerHTML = `
          <img src="${avatar}" class="icon" alt="Usuário">
          <span>Olá,<br><small>${nomeUsuario}</small></span>
        `;
      }

      novoBotao.addEventListener("click", (e) => {
        e.preventDefault();
        abrirPopupLogout();
      });

    } 

    //USUÁRIO DESLOGADO
    else {
      novoBotao.href = "entrar.html";
      novoBotao.classList.remove("usuario-logado");

      novoBotao.innerHTML = `
        <img src="../assets/img/avatar.png" class="icon">
        <span>Entrar</span>
      `;
    }

    loginContainer.replaceChild(novoBotao, botaoLogin);
  });
}

// Função para abrir o popup de logout
function abrirPopupLogout() {
  const usuarioString = localStorage.getItem("usuario_adote");
  const usuario = usuarioString ? JSON.parse(usuarioString) : null;
  const nomeUsuario = usuario ? usuario.email.split("@")[0] : "Usuário";

  const overlay = document.createElement("div");
  overlay.className = "popup-overlay-glass";

  overlay.innerHTML = `
    <div class="popup-bubble-glass">
        <h3>Olá, ${nomeUsuario}</h3>
        <div class="botoes">
            <button id="btn-configuracoes" class="btn-glass-action btn-nao">Configurações</button>
            <button id="btn-voltar" class="btn-glass-action btn-nao">Voltar</button>
            <button id="btn-logout-sim" class="btn-glass-action btn-sim">Sair</button>
        </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Função para ir para configurações
  document.getElementById("btn-configuracoes").addEventListener("click", () => {
    window.location.href = "configuracoes.html";
    overlay.style.opacity = "0";
    setTimeout(() => overlay.remove(), 300);
  });

  // Função para voltar ao pop-up de login
  document.getElementById("btn-voltar").addEventListener("click", () => {
    overlay.style.opacity = "0";
    setTimeout(() => overlay.remove(), 300);
  });

  // Função para sair da conta
  document.getElementById("btn-logout-sim").addEventListener("click", () => {
    localStorage.setItem("sessao_encerrada", "true");
    overlay.style.opacity = "0";
    setTimeout(() => {
      overlay.remove();
      atualizarCabecalho();
    }, 300);
  });
}
