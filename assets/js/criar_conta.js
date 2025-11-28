const form = document.getElementById("form-criar")
const btnCriar = document.getElementById("btn-criar")

const titulo = document.getElementById("titulo-criar")
const txtJa = document.getElementById("txt-ja")
const imgPets = document.getElementById("img-pets")
const card = document.getElementById("card")
const container = document.getElementById("tela-criar")

const telaBoas = document.getElementById("tela-boas-vindas")
const tituloOla = document.getElementById("titulo-ola")
const botaoPets = document.getElementById("btn-pets")

form.addEventListener("submit", (e) => {
    e.preventDefault()

    const email = document.getElementById("email").value
    const senha = document.getElementById("senha").value
    const estado = document.getElementById("estado").value

    const usuario = { email, senha, estado }

    localStorage.setItem("usuario_adote", JSON.stringify(usuario))

    localStorage.removeItem("sessao_encerrada");

    titulo.classList.add("fade-out")
    txtJa.classList.add("fade-out")
    imgPets.classList.add("fade-out")
    card.classList.add("spin-glass")

    setTimeout(() => {
        titulo.innerHTML = "Conta Criada!"
        titulo.classList.add("fade-in")
        btnCriar.innerText = "Entrar"
        btnCriar.id = "btn-entrar"

        btnCriar.classList.remove("fade-out")
        btnCriar.classList.add("fade-in")

        form.onsubmit = entrarConta
    }, 500)
})

function entrarConta(e) {
    e.preventDefault()

    titulo.classList.add("fade-out")
    txtJa.classList.add("fade-out")
    imgPets.classList.add("fade-out")
    container.classList.add("fade-out")

    setTimeout(() => {
        container.style.display = "none"

        const usuario = JSON.parse(localStorage.getItem("usuario_adote"))
        tituloOla.innerHTML = `OLÁ, ${usuario.email.split("@")[0]}`

        telaBoas.classList.add("tela-visivel")
    }, 500)
}

botaoPets.addEventListener("click", () => {
    window.location.href = "lista.html"
})

document.addEventListener("DOMContentLoaded", () => {
    const telaCriar = document.getElementById("tela-criar");
    const card = document.getElementById("card");
    const tituloCriar = document.getElementById("titulo-criar");
    const txtJa = document.getElementById("txt-ja");
    const imgPets = document.getElementById("img-pets");
    const formCriar = document.getElementById("form-criar");

    const telaBoasVindas = document.getElementById("tela-boas-vindas");
    const tituloOla = document.getElementById("titulo-ola");
    const btnPets = document.getElementById("btn-pets");

    formCriar.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value.trim();
        const estado = document.getElementById("estado").value.trim();

        if (email === "" || senha === "" || estado === "") return;

        localStorage.setItem("usuario_email", email);
        localStorage.setItem("usuario_senha", senha);
        localStorage.setItem("usuario_estado", estado);

        telaCriar.style.animation = "fadeOut .6s forwards";

        setTimeout(() => {
            telaCriar.style.display = "none";

            tituloOla.innerHTML = `Olá, ${email.split("@")[0]}!`;

            telaBoasVindas.classList.remove("tela-oculta");
            telaBoasVindas.style.animation = "fadeIn .7s forwards";
        }, 600);
    });

    btnPets.addEventListener("click", () => {
        window.location.href = "lista.html";
    });
});
