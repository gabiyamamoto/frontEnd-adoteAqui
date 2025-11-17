const API_URL = "https://backend-adoteaqui.onrender.com";
let tipos = [];
let petsCarregados = [];

function showError(msg) {
    const galeria = document.getElementById("galeria-pets");
    galeria.innerHTML = `<p style="color:#fff; text-align:center; padding:30px;">${msg}</p>`;
    console.warn(msg);
}

async function carregarTipos() {
    try {
        const res = await fetch(`${API_URL}/tipos`);
        if (!res.ok) throw new Error(`Status ${res.status} ao buscar /tipos`);

        const data = await res.json();
        tipos = data.tipos;

        console.log("Tipos carregados:", tipos.length);
    } catch (err) {
        console.error("Erro ao carregar TIPOS:", err);
        tipos = [];
        throw err;
    }
}

function criarCard(pet) {
    const tipo = tipos.find(t => Number(t.id) === Number(pet.tipoId));
    const img = tipo?.imageUrl || "https://via.placeholder.com/600x400?text=Sem+Imagem";

    return `
      <a class="card card-link" href="../../pages/pet.html?id=${pet.id}">
        <img src="${img}" alt="${pet.nome}">
        <h2>${pet.nome}</h2>
        <p>${pet.local ?? pet.cidade ?? 'Local não informado'}</p>
      </a>
    `;
}

async function renderizarPets(especie) {
    const galeria = document.getElementById("galeria-pets");
    galeria.innerHTML = "<h2>Carregando amiguinhos 🐶🐱...</h2>";

    try {
        const res = await fetch(`${API_URL}/pets`);
        if (!res.ok) throw new Error(`Status ${res.status} ao buscar /pets`);

        const data = await res.json();
        const pets = data.pets;

        const filtrados = pets.filter(p => {
            const tipo = tipos.find(t => t.id == p.tipoId);
            return tipo && tipo.especie.toLowerCase() === especie.toLowerCase();
        });

        petsCarregados = filtrados;
        galeria.innerHTML = "";

        if (filtrados.length === 0) {
            galeria.innerHTML = `<p>Nenhum ${especie} encontrado.</p>`;
            return;
        }

        filtrados.forEach(pet =>
            galeria.insertAdjacentHTML("beforeend", criarCard(pet))
        );

    } catch (err) {
        console.error("Erro ao carregar pets:", err);
        showError("Erro ao carregar pets. Verifique o servidor.");
    }
}

function configurarMenu() {
    const links = document.querySelectorAll(".menu a");
    links.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            document.querySelector(".menu a.ativo")?.classList.remove("ativo");
            e.target.classList.add("ativo");

            const especie = e.target.textContent.trim().toLowerCase();
            renderizarPets(especie);
        });
    });
}

function configurarBusca() {
    const input = document.querySelector(".busca input");
    const galeria = document.getElementById("galeria-pets");

    input.addEventListener("input", () => {
        const termo = input.value.toLowerCase().trim();

        if (termo === "") {
            galeria.innerHTML = "";
            petsCarregados.forEach(p =>
                galeria.insertAdjacentHTML("beforeend", criarCard(p))
            );
            return;
        }

        const resultados = petsCarregados.filter(pet => {
            const tipo = tipos.find(t => t.id === pet.tipoId);

            return (
                pet.nome.toLowerCase().includes(termo) ||
                (pet.local || "").toLowerCase().includes(termo) ||
                (tipo?.nome_tipo || "").toLowerCase().includes(termo) ||
                (pet.castrado ? "castrado" : "nao castrado").includes(termo) ||
                (pet.vacinado ? "vacinado" : "nao vacinado").includes(termo) ||
                (pet.adotado ? "adotado" : "nao adotado").includes(termo)
            );
        });

        galeria.innerHTML = resultados.length
            ? resultados.map(criarCard).join("")
            : "<p>Nenhum pet encontrado</p>";
    });
}

async function init() {
    try {
        await carregarTipos();
        configurarMenu();
        configurarBusca();
        renderizarPets("cachorro");
    } catch (err) {
        showError("Erro inicializando dados.");
    }
}

init();
