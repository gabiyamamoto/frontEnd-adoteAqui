const API_URL = "https://backend-adoteaqui-06i1.onrender.com";

// Variáveis globais
let tipos = [];

// Funções auxiliares
function mostrarLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "flex";
}

function esconderLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";
}

function debounce(fn, t = 200) {
  let id;
  return (...args) => {
    clearTimeout(id);
    id = setTimeout(() => fn.apply(null, args), t);
  };
}

function embaralhar(arr) {
  const resultado = [...arr];
  for (let i = resultado.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
  }
  return resultado;
}

function erro(msg) {
  const area = document.querySelector("#galeria-pets");
  if (!area) return;
  area.innerHTML = `<p style="color:white; text-align:center; padding:30px; font-size:1.1em;">${msg}</p>`;
}

// Funções de login/logout
function atualizarCabecalho() {
  const usuarioString = localStorage.getItem("usuario_adote");
  const sessaoEncerrada = localStorage.getItem("sessao_encerrada");

  // Atualizar desktop
  const loginDesktop = document.querySelector('.login-desktop .login');
  if (loginDesktop) {
    if (usuarioString && !sessaoEncerrada) {
      const usuario = JSON.parse(usuarioString);
      const nomeUsuario = usuario.email.split("@")[0];

      loginDesktop.innerHTML = `
        <img src="../assets/img/avatar.png" class="icon">
        <span>Olá, ${nomeUsuario}</span>
      `;
      loginDesktop.href = '#';
      loginDesktop.onclick = (e) => {
        e.preventDefault();
        abrirPopupLogout();
      };
    } else {
      loginDesktop.innerHTML = `
        <img src="../assets/img/avatar.png" class="icon">
        <span>Entrar</span>
      `;
      loginDesktop.href = '../pages/entrar.html';
      loginDesktop.onclick = null;
    }
  }

  // Atualizar mobile
  const loginMobile = document.querySelector('.login-mobile-standalone .login');
  if (loginMobile) {
    if (usuarioString && !sessaoEncerrada) {
      const usuario = JSON.parse(usuarioString);
      const nomeUsuario = usuario.email.split("@")[0];

      loginMobile.innerHTML = `
        <img src="../assets/img/avatar.png" class="icon">
        <span>Olá, ${nomeUsuario}</span>
      `;
      loginMobile.href = '#';
      loginMobile.onclick = (e) => {
        e.preventDefault();
        abrirPopupLogout();
      };
    } else {
      loginMobile.innerHTML = `
        <img src="../assets/img/avatar.png" class="icon">
        <span>Entrar</span>
      `;
      loginMobile.href = '../pages/entrar.html';
      loginMobile.onclick = null;
    }
  }
}

function atualizarAvatarHeader() {
  const usuarioString = localStorage.getItem("usuario_adote");
  const sessaoEncerrada = localStorage.getItem("sessao_encerrada");
  const avatar = usuarioString && !sessaoEncerrada
    ? JSON.parse(usuarioString).avatar || '../assets/img/avatar.png'
    : '../assets/img/avatar.png';

  document.querySelectorAll('.login img.icon').forEach(img => {
    img.src = avatar;
  });
}

function abrirPopupLogout() {
  const usuarioString = localStorage.getItem("usuario_adote");
  const usuario = usuarioString ? JSON.parse(usuarioString) : null;
  const nomeUsuario = usuario ? usuario.email.split("@")[0] : "Usuário";
  const avatar = usuario?.avatar || '../assets/img/avatar.png';

  const overlay = document.createElement("div");
  overlay.className = "popup-conta show";

  const caixa = document.createElement("div");
  caixa.className = "popup-content bolha";

  caixa.innerHTML = `
    <h2>Olá, ${nomeUsuario}</h2>
    <p class="subtitulo-popup">Escolha uma opção abaixo</p>

    <div class="bloco-usuario">
      <img src="${avatar}" alt="Avatar" class="avatar-popup">
      <div class="info-usuario-popup">
        <strong>${nomeUsuario}</strong>
        <span>${usuario?.email || ''}</span>
      </div>
    </div>

    <div class="modal-actions">
      <button id="btn-configuracoes" class="popup-logout-btn">
        ⚙️ Configurações da conta
      </button>

      <div class="botoes-duplos">
        <button id="btn-voltar" class="popup-logout-btn">
          Voltar
        </button>
        <button id="btn-logout-sim" class="popup-logout-btn btn-logout-danger">
          Sair
        </button>
      </div>
    </div>
  `;

  overlay.appendChild(caixa);
  document.body.appendChild(overlay);

  document.getElementById("btn-configuracoes").onclick = () => {
    window.location.href = "../pages/configuracoes.html";
    overlay.remove();
  };

  document.getElementById("btn-voltar").onclick = () => {
    overlay.remove();
  };

  document.getElementById("btn-logout-sim").onclick = () => {
    localStorage.setItem("sessao_encerrada", "true");
    overlay.remove();
    atualizarCabecalho();
    atualizarAvatarHeader();
  };

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
}

// Funções específicas da página
async function carregarTipos() {
  try {
    const r = await fetch(`${API_URL}/tipos`);
    const data = await r.json();

    if (!r.ok) {
      console.error("Erro ao carregar tipos:", data.erro || data.mensagem);
      tipos = [];
      return;
    }

    tipos = data.tipos || [];
  } catch (_) {
    tipos = [];
  }
}

function criarCard(pet) {
  const tipo = tipos.find((t) => +t.id === +pet.tipoId);
  const img = tipo?.imageUrl || pet.imageUrl || "../img/default.jpg";

  return `
    <a class="card card-link" href="pet.html?id=${pet.id}">
      <img src="${img}" alt="${pet.nome}">
      <h2>${pet.nome}</h2>
      <p>${pet.local || pet.cidade || "Local não informado"}</p>
    </a>
  `;
}

async function renderizarPets() {
  mostrarLoader();

  const area = document.querySelector("#galeria-pets");
  if (!area) return;

  area.innerHTML = "<p style='color:white; text-align:center; padding:20px;'>Colocando coleira nos dados...</p>";

  try {
    const r = await fetch(`${API_URL}/pets`);
    const data = await r.json();

    if (!r.ok) {
      const errorMessage = data.erro || data.mensagem || "Não tem ração para todos! Erro ao buscar pets";
      erro(errorMessage);
      esconderLoader();
      return;
    }

    let lista = data.pets || [];

    if (!lista.length) {
      area.innerHTML = `<p style="color:white; text-align:center; padding:30px;">${data.mensagem || "Nenhum pet disponível no momento."}</p>`;
      esconderLoader();
      return;
    }

    area.innerHTML = "";
    lista = embaralhar(lista);

    lista.forEach((pet, i) => {
      const d = document.createElement("div");
      d.innerHTML = criarCard(pet);
      const c = d.firstElementChild;
      c.style.animationDelay = `${i * 40}ms`;
      area.appendChild(c);
    });
  } catch (error) {
    erro("Aguardando servidor iniciar...");
  }

  esconderLoader();
}

function configurarMenu() {
  const desktop = document.querySelectorAll(".menu-desktop a:not(#btn-filtrar)");
  const mobile = document.querySelectorAll(".menu-mobile a:not(#btn-filtrar-mobile)");

  const ativar = (link, grupo) => {
    grupo.forEach((a) => a.classList.remove("ativo"));
    link.classList.add("ativo");
  };

  desktop.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      ativar(link, desktop);
      renderizarPets();
    });
  });

  mobile.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      ativar(link, mobile);
      renderizarPets();
    });
  });
}

function abrirPopupFiltros() {
  const p = document.querySelector("#popup-filtros");
  const box = p?.querySelector(".popup-content");
  if (!p || !box) return;
  p.classList.remove("hidden");
  requestAnimationFrame(() => {
    p.classList.add("show");
    box.classList.remove("bolha");
    void box.offsetWidth;
    box.classList.add("bolha");
  });
}

function fecharPopupFiltros() {
  const p = document.querySelector("#popup-filtros");
  const box = p?.querySelector(".popup-content");
  if (!p || !box) return;
  box.classList.remove("bolha");
  p.classList.remove("show");
  setTimeout(() => p.classList.add("hidden"), 300);
}

function configurarPopup() {
  const btnDesk = document.querySelector("#btn-filtrar");
  const btnMob = document.querySelector("#btn-filtrar-mobile");
  const fechar = document.querySelector("#btn-fechar-popup");
  const aplicar = document.querySelector("#btn-aplicar-filtros");

  document.querySelectorAll("#filtro-status button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#filtro-status button").forEach(b => b.classList.remove("ativo"));
      btn.classList.add("ativo");
    });
  });

  btnDesk?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    abrirPopupFiltros();
  });

  btnMob?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    abrirPopupFiltros();
  });

  fechar?.addEventListener("click", (e) => {
    e.preventDefault();
    fecharPopupFiltros();
  });

  aplicar?.addEventListener("click", async (e) => {
    e.preventDefault();
    mostrarLoader();

    const btnAtivo = document.querySelector("#filtro-status button.ativo");
    const statusSelecionado = btnAtivo ? btnAtivo.dataset.valor : "";

    const filtro = {
      especie: document.querySelector("#filtro-especie")?.value || "",
      idade: document.querySelector("#filtro-idade")?.value || "",
      tamanho: document.querySelector("#filtro-tamanho")?.value || "",
      genero: document.querySelector("#filtro-genero")?.value || "",
    };

    const params = new URLSearchParams();
    Object.entries(filtro).forEach(([k, v]) => v && params.append(k, v));

    if (statusSelecionado === "disponivel") params.append("adotado", "false");
    if (statusSelecionado === "adotado") params.append("adotado", "true");

    const area = document.querySelector("#galeria-pets");
    area.innerHTML = "<p style='color:white; text-align:center; padding:20px;'>Seguindo suas preferências</p>";

    try {
      const r = await fetch(`${API_URL}/pets?${params.toString()}`);
      const data = await r.json();

      if (!r.ok) {
        const errorMessage = data.erro || data.mensagem || "Erro ao aplicar filtros";
        erro(errorMessage);
        esconderLoader();
        fecharPopupFiltros();
        return;
      }

      let lista = data.pets || [];

      if (!lista.length) {
        erro(data.mensagem || "Cadê? Não temos pets com esses filtros.");
        esconderLoader();
        fecharPopupFiltros();
        return;
      }

      lista = embaralhar(lista);
      area.innerHTML = lista.map(criarCard).join("");
    } catch (error) {
      erro("Erro de conexão ao aplicar filtros.");
    }

    esconderLoader();
    fecharPopupFiltros();
  });
}

function configurarBusca() {
  const inputDesktop = document.querySelector("#campo-busca");
  const inputMobile = document.querySelector("#campo-busca-mobile");

  const input = window.innerWidth <= 768 ? inputMobile : inputDesktop;
  if (!input) return;

  input.addEventListener(
    "input",
    debounce(async (e) => {
      mostrarLoader();

      const termo = e.target.value.trim();
      const area = document.querySelector("#galeria-pets");

      area.innerHTML = "<p style='color:white; text-align:center; padding:20px;'>Colocando coleira nos dados</p>";

      try {
        const r = await fetch(
          `${API_URL}/pets/buscar?termo=${encodeURIComponent(termo)}`
        );
        const data = await r.json();

        if (!r.ok) {
          const errorMessage = data.erro || data.mensagem || "Eita, a busca deu erro!";
          if (errorMessage.includes("Você precisa digitar algum pet")) {
            erro(errorMessage);
            esconderLoader();
            return;
          }
          erro(errorMessage);
          esconderLoader();
          return;
        }

        if (data.pets?.length) {
          const petsEmbaralhados = embaralhar([...data.pets]);
          area.innerHTML = petsEmbaralhados.map(criarCard).join("");
        } else {
          erro(data.mensagem || `Eita, sem petiscos, não encontramos"${termo}".`);
        }
      } catch (error) {
        erro("Erro de conexão com o servidor.");
      }

      esconderLoader();
    }, 300)
  );
}

// Função principal de inicialização
async function inicializarPagina() {
  try {
    await carregarTipos();
    configurarMenu();
    configurarBusca();
    configurarPopup();
    atualizarCabecalho();
    atualizarAvatarHeader();
    await renderizarPets();
  } catch (error) {
    console.error("Erro na inicialização, aguarde o server iniciar:", error);
    erro("Não foi possível carregar a página completamente, aguarde o server iniciar.");
  }
}

// Inicialização quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  inicializarPagina();
});