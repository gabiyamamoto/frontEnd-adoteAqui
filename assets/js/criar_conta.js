const form = document.getElementById("form-criar");
const btnCriar = document.getElementById("btn-criar");

const titulo = document.getElementById("titulo-criar");
const txtJa = document.getElementById("txt-ja");
const imgPets = document.getElementById("img-pets");
const card = document.getElementById("card");
const container = document.getElementById("tela-criar");

const telaBoas = document.getElementById("tela-boas-vindas");
const tituloOla = document.getElementById("titulo-ola");
const botaoPets = document.getElementById("btn-pets");

// Evento para criação de conta
form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Coleta os dados do formulário
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const estado = document.getElementById("estado").value;

    // Cria o objeto de usuário e salva no localStorage
    const usuario = { email, senha, estado };
    localStorage.setItem("usuario_adote", JSON.stringify(usuario));

    // Remove qualquer dado de sessão encerrada
    localStorage.removeItem("sessao_encerrada");

    // Animações de transição
    titulo.classList.add("fade-out");
    txtJa.classList.add("fade-out");
    imgPets.classList.add("fade-out");
    card.classList.add("spin-glass");

    // Após a animação, altera o conteúdo e prepara para o próximo passo
    setTimeout(() => {
        titulo.innerHTML = "Conta Criada!";
        titulo.classList.add("fade-in");
        btnCriar.innerText = "Entrar";
        btnCriar.id = "btn-entrar";

        btnCriar.classList.remove("fade-out");
        btnCriar.classList.add("fade-in");

        // Altera o evento do botão para fazer login
        form.onsubmit = entrarConta;
    }, 500);
});

// Função para fazer login após criar a conta
function entrarConta(e) {
    e.preventDefault();

    // Animação de transição de tela
    titulo.classList.add("fade-out");
    txtJa.classList.add("fade-out");
    imgPets.classList.add("fade-out");
    container.classList.add("fade-out");

    setTimeout(() => {
        container.style.display = "none";

        // Recupera o usuário do localStorage e exibe um olá personalizado
        const usuario = JSON.parse(localStorage.getItem("usuario_adote"));
        tituloOla.innerHTML = OLÁ, ${usuario.email.split("@")[0]};

        // Exibe a tela de boas-vindas
        telaBoas.classList.add("tela-visivel");
    }, 500);
}

// Evento para redirecionar para a lista de pets
botaoPets.addEventListener("click", () => {
    window.location.href = "lista.html";
});

document.addEventListener("DOMContentLoaded", () => {
    // Elementos da tela de criação e boas-vindas
    const telaCriar = document.getElementById("tela-criar");
    const card = document.getElementById("card");
    const tituloCriar = document.getElementById("titulo-criar");
    const txtJa = document.getElementById("txt-ja");
    const imgPets = document.getElementById("img-pets");
    const formCriar = document.getElementById("form-criar");

    const telaBoasVindas = document.getElementById("tela-boas-vindas");
    const tituloOla = document.getElementById("titulo-ola");
    const btnPets = document.getElementById("btn-pets");

    // Evento para criação de conta
    formCriar.addEventListener("submit", (e) => {
        e.preventDefault();

        // Coleta e valida os dados do formulário
        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value.trim();
        const estado = document.getElementById("estado").value.trim();

        if (email === "" || senha === "" || estado === "") return;

        // Salva os dados do usuário no localStorage
        localStorage.setItem("usuario_email", email);
        localStorage.setItem("usuario_senha", senha);
        localStorage.setItem("usuario_estado", estado);

        // Anima a tela de criação e faz a transição
        telaCriar.style.animation = "fadeOut .6s forwards";

        setTimeout(() => {
            telaCriar.style.display = "none";

            // Exibe o nome do usuário na tela de boas-vindas
            tituloOla.innerHTML = Olá, ${email.split("@")[0]}!;

            // Mostra a tela de boas-vindas com animação
            telaBoasVindas.classList.remove("tela-oculta");
            telaBoasVindas.style.animation = "fadeIn .7s forwards";
        }, 600);
    });

    // Redireciona para a lista de pets
    btnPets.addEventListener("click", () => {
        window.location.href = "lista.html";
    });
});
