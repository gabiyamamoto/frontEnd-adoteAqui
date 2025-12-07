const API_URL = "https://backend-adoteaqui-06i1.onrender.com";

function mostrarLoader() {
  document.getElementById("loader").style.display = "flex";
}

function esconderLoader() {
  document.getElementById("loader").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  const erro = (msg) => {
    const area = $("#galeria-pets");
    if (area) area.innerHTML = `<p style="color:#fff; text-align:center; padding:30px;">${msg}</p>`;
  };

  const abrirPopup = () => {
    const p = $("#popup-filtros");
    const box = p?.querySelector(".popup-content");
    if (!p || !box) return;
    p.classList.remove("hidden");
    requestAnimationFrame(() => {
      p.classList.add("show");
      box.classList.remove("bolha");
      void box.offsetWidth;
      box.classList.add("bolha");
    });
  };

  const fecharPopup = () => {
    const p = $("#popup-filtros");
    const box = p?.querySelector(".popup-content");
    if (!p || !box) return;
    box.classList.remove("bolha");
    p.classList.remove("show");
    setTimeout(() => p.classList.add("hidden"), 300);
  };

  const configurarMenu = () => {
    const desktop = $$(".menu-desktop a:not(#btn-filtrar)");
    const mobile = $$(".menu-mobile a:not(#btn-filtrar-mobile)");

    const ativar = (link, grupo) => {
      grupo.forEach((a) => a.classList.remove("ativo"));
      link.classList.add("ativo");
    };

    [...desktop].forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        ativar(link, desktop);
        renderizarPets();
      });
    });

    [...mobile].forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        ativar(link, mobile);
        renderizarPets();
      });
    });

    const abrirCategorias = async (e) => {
      e.preventDefault();
      document.querySelectorAll(".menu a.ativo").forEach((a) => a.classList.remove("ativo"));
      e.currentTarget.classList.add("ativo");

      const area = $("#galeria-pets");
      if (!area) return;

      area.innerHTML = "<h2 style='color:#fff;'>Carregando categorias...</h2>";

      try {
        const r = await fetch(`${API_URL}/tipos`);
        const data = await r.json();

        // Verificação de erros do back-end
        if (!r.ok) {
          const errorMessage = data.erro || data.mensagem || "Erro ao carregar categorias";
          area.innerHTML = `
            <div style="text-align:center; padding:20px; color: #fff;">
              <p style="font-size:18px;">${errorMessage}</p>
            </div>`;
          return;
        }

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

        $$(".categoria-item").forEach((el) => {
          el.addEventListener("click", () => {
            renderizarPorCategoria(el.dataset.id);
          });
        });
      } catch (e) {
        area.innerHTML = `
          <div style="text-align:center; padding:20px; color: #fff;">
            <p style="font-size:18px;">Erro ao carregar categorias.</p>
            <p style="font-size:14px; opacity:0.8;">Verifique sua conexão</p>
          </div>`;
      }
    };

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

  const configurarPopup = () => {
    const btnDesk = $("#btn-filtrar");
    const btnMob = $("#btn-filtrar-mobile");
    const fechar = $("#btn-fechar-popup");
    const aplicar = $("#btn-aplicar-filtros");

    // BOTÕES DE STATUS
    document.querySelectorAll("#filtro-status button").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("#filtro-status button").forEach(b => b.classList.remove("ativo"));
        btn.classList.add("ativo");
      });
    });

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

    aplicar?.addEventListener("click", async (e) => {
      e.preventDefault();

      mostrarLoader();

      // PEGAR STATUS SELECIONADO (BOTÕES)
      const btnAtivo = document.querySelector("#filtro-status button.ativo");
      const statusSelecionado = btnAtivo ? btnAtivo.dataset.valor : "";

      const filtro = {
        especie: $("#filtro-especie")?.value || "",
        idade: $("#filtro-idade")?.value || "",
        tamanho: $("#filtro-tamanho")?.value || "",
        genero: $("#filtro-genero")?.value || "",
      };

      const params = new URLSearchParams();
      Object.entries(filtro).forEach(([k, v]) => v && params.append(k, v));

      // Se for disponível ou adotado, adiciona no filtro
      if (statusSelecionado === "disponivel") params.append("adotado", "false");
      if (statusSelecionado === "adotado") params.append("adotado", "true");

      const area = $("#galeria-pets");
      area.innerHTML = "<h2 style='color:#fff;'>Aplicando filtros...</h2>";

      try {
        const r = await fetch(`${API_URL}/pets?${params.toString()}`);
        const data = await r.json();

        if (!r.ok) {
          const errorMessage = data.erro || data.mensagem || "Erro ao aplicar filtros";
          area.innerHTML = `
                <div style="text-align:center; padding:20px; color:#fff;">
                    <p style="font-size:18px;">${errorMessage}</p>
                </div>`;
          esconderLoader();
          fecharPopup();
          return;
        }

        let lista = data.pets || [];

        // embaralhar
        lista = embaralhar(lista);

        area.innerHTML = lista.length
          ? lista.map(criarCard).join("")
          : `<div style="text-align:center; padding:20px; color:#fff;">
                 <p style="font-size:18px;">Nenhum pet encontrado com esses filtros.</p>
               </div>`;
      } catch (error) {
        area.innerHTML = `
            <div style="text-align:center; padding:20px; color:#fff;">
                <p style="font-size:18px;">Erro de conexão ao aplicar filtros.</p>
            </div>`;
      }

      esconderLoader();
      fecharPopup();
    });
  };

  const configurarBusca = () => {
    const inputDesktop = document.querySelector("#campo-busca");
    const inputMobile = document.querySelector("#campo-busca-mobile");

    const input = window.innerWidth <= 768 ? inputMobile : inputDesktop;
    if (!input) return;

    input.addEventListener(
      "input",
      debounce(async (e) => {
        mostrarLoader();

        const termo = e.target.value.trim().toLowerCase();
        const area = document.querySelector("#galeria-pets");

        if (!termo) {
          await renderizarPets();
          esconderLoader();
          return;
        }

        // Verificação adicional: termo muito curto
        if (termo.length < 2) {
          area.innerHTML = `
                    <div style="text-align:center; padding:20px; color: #fff;">
                        <p style="font-size:18px;">Digite pelo menos 2 caracteres para buscar.</p>
                    </div>`;
          esconderLoader();
          return;
        }

        area.innerHTML = "<h2 style='color:#fff;'>Pegando a ração...</h2>";

        try {
          const r = await fetch(
            `${API_URL}/pets/buscar?termo=${encodeURIComponent(termo)}`
          );
          const data = await r.json();

          // VERIFICAÇÃO DE ERROS DO BACK-END
          if (!r.ok) {
            // Se o back-end retornou um erro (status 400, 404, etc.)
            const errorMessage = data.erro || data.mensagem || "Erro na busca";

            area.innerHTML = `
                        <div style="text-align:center; padding:20px; color: #fff;">
                            <p style="font-size:18px;">${errorMessage}</p>
                            ${r.status === 400 ? '<p style="font-size:14px; opacity:0.8;">Tente buscar por nome ou ID do pet</p>' : ''}
                        </div>`;
            esconderLoader();
            return;
          }

          // Caso de sucesso
          if (data.pets?.length) {
            // EMBARALHA os resultados da busca
            const petsEmbaralhados = embaralhar([...data.pets]);
            area.innerHTML = petsEmbaralhados.map(criarCard).join("");
          } else {
            area.innerHTML = `
                        <div style="text-align:center; padding:20px; color: #fff;">
                            <p style="font-size:18px;">Nenhum pet encontrado com "${termo}".</p>
                            <p style="font-size:14px; opacity:0.8;">Tente buscar por nome ou ID do pet</p>
                        </div>`;
          }
        } catch (error) {
          // Erro de rede ou conexão
          area.innerHTML = `
                    <div style="text-align:center; padding:20px; color: #fff;">
                        <p style="font-size:18px;">Erro de conexão com o servidor.</p>
                        <p style="font-size:14px; opacity:0.8;">Tente novamente mais tarde</p>
                    </div>`;
        }

        esconderLoader();
      }, 300)
    );
  };

  const debounce = (fn, t = 200) => {
    let id;
    return (...args) => {
      clearTimeout(id);
      id = setTimeout(() => fn.apply(null, args), t);
    };
  };

  let tipos = [];

  const carregarTipos = async () => {
    try {
      const r = await fetch(`${API_URL}/tipos`);
      const data = await r.json();

      // Verificação de erros
      if (!r.ok) {
        console.error("Erro ao carregar tipos:", data.erro || data.mensagem);
        tipos = [];
        return;
      }

      tipos = data.tipos || [];
    } catch (_) {
      tipos = [];
    }
  };

  const criarCard = (pet) => {
    const tipo = tipos.find((t) => +t.id === +pet.tipoId);
    const img = tipo?.imageUrl || pet.imageUrl || "../img/default.jpg";

    return `
      <a class="card card-link" href="../../frontEnd-adoteAqui/pages/pet.html?id=${pet.id}">
        <img src="${img}" alt="${pet.nome}">
        <h2>${pet.nome}</h2>
        <p>${pet.local || pet.cidade || "Local não informado"}</p>
      </a>
    `;
  };

  const embaralhar = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const renderizarPets = async () => {
    mostrarLoader();

    const area = $("#galeria-pets");
    if (!area) return;

    area.innerHTML = "<h2 style='color:#fff;'>Colocando coleira nos dados…</h2>";

    try {
      const r = await fetch(`${API_URL}/pets`);
      const data = await r.json();

      // VERIFICAÇÃO DE ERROS
      if (!r.ok) {
        const errorMessage = data.erro || data.mensagem || "Erro ao carregar pets";
        area.innerHTML = `
                  <div style="text-align:center; padding:20px; color: #fff;">
                      <p style="font-size:18px;">${errorMessage}</p>
                  </div>`;
        esconderLoader();
        return;
      }

      let lista = data.pets || [];

      area.innerHTML = "";

      if (!lista.length) {
        area.innerHTML = `
                  <div style="text-align:center; padding:20px; color: #fff;">
                      <p style="font-size:18px;">Acho que os pets estão se escondendo… mas nada que um pouco de ração não resolva!</p>
                  </div>`;
        esconderLoader();
        return;
      }

      // EMBARALHA os pets iniciais também
      lista = embaralhar(lista);

      lista.forEach((pet, i) => {
        const d = document.createElement("div");
        d.innerHTML = criarCard(pet);
        const c = d.firstElementChild;
        c.style.animationDelay = `${i * 40}ms`;
        area.appendChild(c);
      });
    } catch (error) {
      area.innerHTML = `
              <div style="text-align:center; padding:20px; color: #fff;">
                  <p style="font-size:18px;">Erro de conexão com o servidor.</p>
                  <p style="font-size:14px; opacity:0.8;">Tente recarregar a página</p>
              </div>`;
    }

    esconderLoader();
  };

  const renderizarPorCategoria = async (id) => {
    mostrarLoader();

    const area = $("#galeria-pets");
    if (!area) return;

    area.innerHTML = "<h2 style='color:#fff;'>Carregando pets da categoria...</h2>";

    try {
      const r = await fetch(`${API_URL}/pets?tipoId=${id}`);
      const data = await r.json();

      // VERIFICAÇÃO DE ERROS
      if (!r.ok) {
        const errorMessage = data.erro || data.mensagem || "Erro ao carregar categoria";
        area.innerHTML = `
                  <div style="text-align:center; padding:20px; color: #fff;">
                      <p style="font-size:18px;">${errorMessage}</p>
                  </div>`;
        esconderLoader();
        return;
      }

      const lista = data.pets || [];

      // EMBARALHA pets da categoria
      const petsEmbaralhados = embaralhar([...lista]);

      area.innerHTML = petsEmbaralhados.length
        ? petsEmbaralhados.map(criarCard).join("")
        : `<div style="text-align:center; padding:20px; color: #fff;">
                    <p style="font-size:18px;">Nenhum pet encontrado nesta categoria.</p>
                 </div>`;
    } catch (error) {
      area.innerHTML = `
              <div style="text-align:center; padding:20px; color: #fff;">
                  <p style="font-size:18px;">Erro ao carregar pets da categoria.</p>
                  <p style="font-size:14px; opacity:0.8;">Verifique sua conexão</p>
              </div>`;
    }

    esconderLoader();
  };

  (async () => {
    await carregarTipos();
    configurarMenu();
    configurarBusca();
    configurarPopup();
    renderizarPets();
  })();

  window.__adote = {
    abrirPopup,
    fecharPopup,
    renderizarPets,
    renderizarPorCategoria,
  };
});

document.addEventListener("DOMContentLoaded", () => {
  atualizarCabecalho();
});

function atualizarCabecalho() {
  const usuarioString = localStorage.getItem("usuario_adote");
  const sessaoEncerrada = localStorage.getItem("sessao_encerrada");
  const botaoLogins = document.querySelectorAll(".login-desktop .login, .login-mobile-standalone .login");

  botaoLogins.forEach(botaoLogin => {
    const loginContainer = botaoLogin.parentNode;
    const novoBotao = document.createElement("a");
    novoBotao.className = "login";
    const isMobileStandalone = loginContainer.classList.contains("login-mobile-standalone");

    //   SE O USUÁRIO ESTÁ LOGADO
    if (usuarioString && !sessaoEncerrada) {
      const usuario = JSON.parse(usuarioString);
      const nomeUsuario = usuario.email.split("@")[0];

      // ⬇️ PEGAR AVATAR DO USUÁRIO (SE TIVER)
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

    //       USUÁRIO DESLOGADO
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

function abrirPopupLogout() {
  const usuarioString = localStorage.getItem("usuario_adote");
  const usuario = usuarioString ? JSON.parse(usuarioString) : null;
  const nomeUsuario = usuario ? usuario.email.split("@")[0] : "Usuário";

  const overlay = document.createElement("div");
  overlay.className = "popup-overlay-glass show";

  overlay.innerHTML = `
        <div class="popup-bubble-glass">
            <h3>Olá, ${nomeUsuario}</h3>

            <button id="btn-configuracoes" class="btn-glass-action btn-nao">
                Configurações
            </button>

            <button id="btn-voltar" class="btn-glass-action btn-nao">
                Voltar
            </button>

            <button id="btn-logout-sim" class="btn-glass-action btn-sim">
                Sair
            </button>
        </div>
    `;

  document.body.appendChild(overlay);

  // Ações
  document.getElementById("btn-configuracoes").addEventListener("click", () => {
    window.location.href = "configuracoes.html";
  });

  document.getElementById("btn-voltar").addEventListener("click", () => {
    overlay.remove();
  });

  document.getElementById("btn-logout-sim").addEventListener("click", () => {

    /* Uma animação de patinha*/
    const pawLayer = document.createElement("div");
    pawLayer.className = "logout-paw-layer";

    // Criar a patinha em si
    const paw = document.createElement("div");
    paw.className = "logout-paw";
    paw.textContent = "🐾";

    pawLayer.appendChild(paw);
    document.documentElement.appendChild(pawLayer);

    /* Desfoca a tela pra ter um suspense né */
    document.body.style.filter = "blur(6px)";
    document.body.style.transition = "0.4s";

    /* Fica aguardando a animação*/
    setTimeout(() => {
      localStorage.setItem("sessao_encerrada", "true");
      document.body.style.filter = "none";

      overlay.remove();
      pawLayer.remove();

      atualizarCabecalho();
    }, 900);
  });

  // Fechar ao clicar fora
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
}
