const API_URL = "https://backend-adoteaqui-06i1.onrender.com";

let tipos = [];

const carregarTipos = async () => {
    try {
        const response = await fetch(`${API_URL}/tipos`);
        const data = await response.json();
        tipos = data.tipos || [];
    } catch (error) {
        console.error('Erro ao carregar tipos:', error);
        tipos = [];
    }
};

const embaralhar = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

async function fetchPets() {
    const grid = document.getElementById('petsGrid');

    if (!grid) return;

    grid.innerHTML = '<div class="loading">Buscando pets disponíveis...</div>';

    try {
        const response = await fetch(`${API_URL}/pets`);
        const data = await response.json();
        let pets = data.pets || [];

        if (!pets.length) {
            grid.innerHTML = '<div class="loading">Nenhum pet disponível no momento 😢</div>';
            return;
        }

        const randomPets = embaralhar([...pets]).slice(0, 3);

        displayPets(randomPets);
    } catch (error) {
        console.error('Erro ao carregar pets:', error);
        grid.innerHTML = '<div class="loading">Erro ao carregar pets. Tente novamente mais tarde.</div>';
    }
}

function displayPets(pets) {
    const grid = document.getElementById('petsGrid');
    grid.innerHTML = '';

    pets.forEach((pet, index) => {
        const tipo = tipos.find((t) => +t.id === +pet.tipoId);
        const img = tipo?.imageUrl || pet.imageUrl || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="250" height="250"%3E%3Crect fill="%23f0f0f0" width="250" height="250"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="60"%3E🐾%3C/text%3E%3C/svg%3E';

        const petCard = document.createElement('div');
        petCard.className = 'pet-card';
        petCard.style.animationDelay = `${index * 100}ms`;
        petCard.onclick = () => window.location.href = `pages/pet.html?id=${pet.id}`;

        const local = pet.local || pet.cidade || 'Local não informado';

        petCard.innerHTML = `
                    <img src="${img}" alt="${pet.nome}" class="pet-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22250%22 height=%22250%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22250%22 height=%22250%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2260%22%3E🐾%3C/text%3E%3C/svg%3E'">
                    <div class="pet-info">
                        <h3>${pet.nome}</h3>
                        <p>${local}</p>
                    </div>
                `;

        grid.appendChild(petCard);
    });

    const verTudoCard = document.createElement('div');
    verTudoCard.className = 'pet-card ver-tudo-card';
    verTudoCard.onclick = () => window.location.href = 'pages/lista.html';
    verTudoCard.innerHTML = 'VER TUDO →';
    grid.appendChild(verTudoCard);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

function atualizarCabecalho() {
    const usuarioString = localStorage.getItem("usuario_adote");
    const sessaoEncerrada = localStorage.getItem("sessao_encerrada");
    const userLinks = document.querySelector('.user-links');

    if (!userLinks) return;

    const btnLogin = userLinks.querySelector('a');
    if (!btnLogin) return;

    if (usuarioString && !sessaoEncerrada) {
        const usuario = JSON.parse(usuarioString);
        const nomeUsuario = usuario.email.split("@")[0];
        const avatar = usuario.avatar || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="35" height="35"%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="25"%3E👤%3C/text%3E%3C/svg%3E';

        btnLogin.innerHTML = `Olá, ${nomeUsuario}`;
        btnLogin.href = '#';
        btnLogin.onclick = (e) => {
            e.preventDefault();
            abrirPopupLogout();
        };
    } else {
        btnLogin.innerHTML = 'Entrar';
        btnLogin.href = 'pages/entrar.html';
        btnLogin.onclick = null;
    }
}

function abrirPopupLogout() {
    const usuarioString = localStorage.getItem("usuario_adote");
    const usuario = usuarioString ? JSON.parse(usuarioString) : null;
    const nomeUsuario = usuario ? usuario.email.split("@")[0] : "Usuário";

    const overlay = document.createElement("div");
    overlay.className = "popup-filtros show";

    const caixa = document.createElement("div");
    caixa.className = "popup-content bolha";

    caixa.innerHTML = `
        <h2 style="margin-bottom: 10px;">Olá, ${nomeUsuario}</h2>

        <button id="btn-configuracoes" style="
            width: 100%; margin-top: 10px; padding: 10px;
            border-radius: 12px; border: none;
            background: rgba(255,255,255,0.35);
            color: #fff; font-size: 16px; cursor: pointer;">
            Configurações
        </button>

        <button id="btn-voltar" class="btn-fechar">
            Voltar
        </button>

        <button id="btn-logout-sim" style="
            width: 100%; margin-top: 15px; padding: 10px;
            border-radius: 12px; border: none;
            background: #ff4d4d; color: white;
            font-size: 16px; cursor: pointer;">
            Sair
        </button>
    `;

    overlay.appendChild(caixa);
    document.body.appendChild(overlay);

    document.getElementById("btn-configuracoes").addEventListener("click", () => {
        window.location.href = "pages/configuracoes.html";
    });

    document.getElementById("btn-voltar").addEventListener("click", () => {
        overlay.remove();
    });

    document.getElementById("btn-logout-sim").addEventListener("click", () => {
        localStorage.setItem("sessao_encerrada", "true");
        overlay.remove();
        atualizarCabecalho();
    });

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.remove();
    });
}

(async () => {
    await carregarTipos();
    await fetchPets();
    atualizarCabecalho();
})();

document.addEventListener('DOMContentLoaded', atualizarCabecalho);