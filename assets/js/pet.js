// Carrega tipos de pet na inicialização
async function carregarTipos() {
    try {
        const res = await fetch(`${API_URL}/tipos`);
        const data = await res.json();
        tipos = data.tipos || [];
    } catch (error) {
        console.error("Erro ao carregar tipos:", error);
        document.getElementById("pet-info").innerHTML = "<p>Erro ao carregar os tipos de pets.</p>";
    }
}

// Obtém o ID do pet na URL
function getPetId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

// Carrega os dados do pet usando o ID
async function carregarPet(id) {
    try {
        const res = await fetch(`${API_URL}/pets/${id}`);
        if (res.ok) {
            const data = await res.json();
            return data.pet || data;
        } else {
            const resAll = await fetch(`${API_URL}/pets`);
            const dataAll = await resAll.json();
            return dataAll.pets.find(p => String(p.id) === String(id));
        }
    } catch (err) {
        console.error(err);
        document.getElementById("pet-info").innerHTML = "<p style='text-align:center;'>Pet não encontrado</p>";
    }
}

// Renderiza as informações do pet na tela
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

// Obtém o nome do usuário logado
function getNomeUsuarioLogado() {
    try {
        const usuarioString = localStorage.getItem("usuario_adote");
        const sessaoEncerrada = localStorage.getItem("sessao_encerrada");
        if (usuarioString && !sessaoEncerrada) {
            const usuario = JSON.parse(usuarioString);
            return usuario.nome || usuario.email.split("@")[0];
        }
    } catch (e) {
        console.error("Erro ao ler usuário:", e);
    }
    return null;
}

// Abre o modal de adoção
function abrirModal(nomePet, telefone) {
    petAtualNome = nomePet;
    petAtualTelefone = telefone;

    let nomeUser = getNomeUsuarioLogado() || "Visitante";
    
    document.getElementById('modal-pet-nome').innerText = nomePet;
    document.getElementById('modal-user-nome').innerText = nomeUser;
    
    const artigo = document.getElementById('modal-pet-artigo');
    if (artigo) artigo.innerText = "o(a)"; 

    const p = document.getElementById('modalGlass');
    const box = p.querySelector('.popup-content');

    if (!p || !box) return;

    p.classList.remove("hidden");
    
    requestAnimationFrame(() => {
        p.classList.add("show");
        box.classList.remove("bolha");
        void box.offsetWidth;
        box.classList.add("bolha");
    });
}

// Fecha o modal
function fecharModal() {
    const p = document.getElementById('modalGlass');
    const box = p?.querySelector('.popup-content');
    
    if (!p || !box) return;

    box.classList.remove("bolha");
    p.classList.remove("show");
    
    setTimeout(() => p.classList.add("hidden"), 300);
}

// Envia mensagem no WhatsApp
function enviarWhatsApp() {
    const telDestino = petAtualTelefone || "5511999999999"; 
    const nomeUser = document.getElementById('modal-user-nome').innerText;
    const nomePet = document.getElementById('modal-pet-nome').innerText;

    const texto = `Olá, meu nome é ${nomeUser}, gostaria de mais detalhes sobre o(a) ${nomePet}.`;
    const msg = encodeURIComponent(texto);
    
    fecharModal();
    window.open(`https://wa.me/${telDestino}?text=${msg}`, '_blank');
}

// Inicialização
document.addEventListener('DOMContentLoaded', init);
