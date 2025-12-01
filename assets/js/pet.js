const API_URL = "https://backend-adoteaqui-06i1.onrender.com/pets/";
let tipos = [];

async function carregarTipos() {
    const res = await fetch(`${API_URL}/tipos`);
    const data = await res.json();
    tipos = data.tipos;
}

function getPetId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

async function carregarPet(id) {
    try {
        const res = await fetch(`${API_URL}${id}`);
        if (!res.ok) throw new Error("Pet não encontrado");

        const data = await res.json();
        return data.pet;
    } catch (err) {
        console.error(err);
        document.getElementById("pet-info").innerHTML =
            "<p style='color:white;text-align:center;padding:30px;'>Pet não encontrado!</p>";
    }
}

function renderizarPet(pet) {
    const tipo = tipos.find(t => Number(t.id) === Number(pet.tipoId));
    const img = tipo?.imageUrl ;

    document.getElementById("pet-info").innerHTML = `
        <div class="pet-container">
            <img src="${img}" class="pet-img" alt="${pet.nome}">

            <h1>${pet.nome}</h1>

            <p><strong>Local:</strong> ${pet.local || pet.cidade || "Não informado"}</p>
            <p><strong>Idade:</strong> ${pet.idade || "Não informada"}</p>
            <p><strong>Sexo:</strong> ${pet.sexo}</p>
            <p><strong>Raça:</strong> ${tipo?.nome_tipo || "Não informada"}</p>

            <p><strong>Castrado:</strong> ${pet.castrado ? "Sim" : "Não"}</p>
            <p><strong>Vacinado:</strong> ${pet.vacinado ? "Sim" : "Não"}</p>

            <p><strong>Descrição:</strong> ${pet.descricao || "Sem descrição"}</p>
        </div>
    `;
}

async function init() {
    const id = getPetId();
    if (!id) return alert("ID não informado!");

    await carregarTipos();

    const pet = await carregarPet(id);
    if (pet) renderizarPet(pet);
}

init();
