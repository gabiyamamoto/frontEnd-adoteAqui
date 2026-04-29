const API_URL = "https://backend-adote-aqui.vercel.app/";
let tipos = [];

// Variáveis para guardar dados temporários
let petAtualNome = "";
let petAtualTelefone = "";

// --- 1. CARREGAMENTO (API) ---

async function carregarTipos() {
    try {
        const res = await fetch(`${API_URL}/tipos`);
        const data = await res.json();
        tipos = data.tipos || [];
    } catch (error) { console.error("Erro tipos:", error); }
}

function getPetId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

async function carregarPet(id) {
    try {
        const res = await fetch(`${API_URL}/pets/${id}`);
        if (res.ok) {
            const data = await res.json();
            return data.pet || data;
        }
        const resAll = await fetch(`${API_URL}/pets`);
        const dataAll = await resAll.json();
        return dataAll.pets.find(p => String(p.id) === String(id));
    } catch (err) {
        console.error(err);
        document.getElementById("pet-info").innerHTML = "<p style='text-align:center;'>Pet não encontrado</p>";
    }
}

// --- 2. RENDERIZAÇÃO ---

function renderizarPet(pet) {
    const tipo = tipos.find(t => Number(t.id) === Number(pet.tipoId));
    
    const img = pet.imageUrl || tipo?.imageUrl || "https://via.placeholder.com/400?text=Sem+Foto";
    const raca = tipo?.nome_tipo || "SRD";
    const especie = tipo?.especie || "Pet"; 
    
    const generoReal = pet.genero || pet.sexo || "Não informado";
    const tamanhoReal = pet.tamanho || "Tamanho não inf.";
    const idadeReal = pet.idade || "Idade não inf.";
    const localReal = pet.local || pet.cidade || "Local não inf.";
    const isCastrado = pet.castrado ? "Sim" : "Não";
    const isVacinado = pet.vacinado ? "Sim" : "Não";

    let botaoHtml = '';
    let avisoAdotadoHtml = '';

    if (pet.adotado) {
        avisoAdotadoHtml = `<div class="aviso-adotado">⚠ Este pet já foi adotado!</div>`;
        botaoHtml = `<button class="btn-adotar" style="background:#ccc; cursor:not-allowed;" disabled>Indisponível</button>`;
    } else {
        // Chama a função que abre o modal novo
        botaoHtml = `<button class="btn-adotar" onclick="abrirModal('${pet.nome}', '${pet.telefone}')">Quero Adotar 💙</button>`;
    }

    const html = `
        <div class="card-pet">
            <div class="pet-wrapper">
                <div class="pet-left">
                    <img src="${img}" class="pet-img" alt="${pet.nome}">
                </div>
                <div class="pet-right">
                    <h1>${pet.nome}</h1>
                    ${avisoAdotadoHtml}

                    <div class="cloud-box">
                        <span class="cloud">${raca}</span>
                        <span class="cloud">${generoReal}</span>
                        <span class="cloud">${idadeReal}</span>
                        <span class="cloud">${tamanhoReal}</span> <span class="cloud">📍 ${localReal}</span>
                    </div>

                    <div class="status-box">
                        <div class="status-tag">Espécie: ${especie}</div>
                        <div class="status-tag">Castrado: ${isCastrado}</div>
                        <div class="status-tag">Vacinado: ${isVacinado}</div>
                    </div>

                    <div class="descricao">
                        <strong>Sobre mim:</strong><br>
                        ${pet.descricao || "Nenhuma descrição informada pelo protetor."}
                    </div>

                    ${botaoHtml}
                </div>
            </div>
        </div>
    `;

    document.getElementById("pet-info").innerHTML = html;
}

// --- 3. FUNÇÕES DO MODAL (ESTILO LISTA / BOLHA) ---

function getNomeUsuarioLogado() {
    try {
        const usuarioString = localStorage.getItem("usuario_adote");
        const sessaoEncerrada = localStorage.getItem("sessao_encerrada");
        if (usuarioString && !sessaoEncerrada) {
            const usuario = JSON.parse(usuarioString);
            return usuario.nome || usuario.email.split("@")[0];
        }
    } catch (e) {
        console.error("Erro ao ler usuario", e);
    }
    return null;
}

function abrirModal(nomePet, telefone) {
    petAtualNome = nomePet;
    petAtualTelefone = telefone;

    // 1. Dados
    let nomeUser = getNomeUsuarioLogado() || "Visitante";
    
    document.getElementById('modal-pet-nome').innerText = nomePet;
    document.getElementById('modal-user-nome').innerText = nomeUser;
    
    const artigo = document.getElementById('modal-pet-artigo');
    if(artigo) artigo.innerText = "o(a)"; 

    // 2. Animação (Idêntica ao lista.js)
    const p = document.getElementById('modalGlass'); // O ID no HTML é modalGlass, classe popup-filtros
    const box = p.querySelector('.popup-content');

    if (!p || !box) return;

    p.classList.remove("hidden");
    
    // Request Animation Frame para garantir a transição suave
    requestAnimationFrame(() => {
        p.classList.add("show");
        // Reinicia a animação da bolha
        box.classList.remove("bolha");
        void box.offsetWidth; // Força reflow (truque do CSS)
        box.classList.add("bolha");
    });
}

function fecharModal() {
    const p = document.getElementById('modalGlass');
    const box = p?.querySelector('.popup-content');
    
    if (!p || !box) return;

    // Remove animação de entrada
    box.classList.remove("bolha");
    p.classList.remove("show");
    
    // Espera a transição de opacidade acabar para esconder
    setTimeout(() => p.classList.add("hidden"), 300);
}

function enviarWhatsApp() {
    const telDestino = petAtualTelefone || "5511999999999"; 
    const nomeUser = document.getElementById('modal-user-nome').innerText;
    const nomePet = document.getElementById('modal-pet-nome').innerText;

    const texto = `Olá, meu nome é ${nomeUser}, gostaria de mais detalhes sobre o(a) ${nomePet}.`;
    const msg = encodeURIComponent(texto);
    
    fecharModal();
    window.open(`https://wa.me/${telDestino}?text=${msg}`, '_blank');
}

// Fechar ao clicar fora (no overlay)
document.addEventListener('click', function(e) {
    const modal = document.getElementById('modalGlass');
    if (e.target === modal) {
        fecharModal();
    }
});

// --- 4. INIT ---

async function init() {
    const id = getPetId();
    if (!id) {
        document.getElementById("pet-info").innerHTML = "<p style='text-align:center;'>ID não informado!</p>";
        return;
    }
    await carregarTipos();
    const pet = await carregarPet(id);
    if (pet) renderizarPet(pet);
}

init();
