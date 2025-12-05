const formLogin = document.getElementById("form-login");
const btnEntrar = document.getElementById("btn-entrar");

const titulo = document.getElementById("titulo-login");
const txtCadastro = document.getElementById("txt-cadastro");
const imgPets = document.getElementById("img-pets");
const card = document.getElementById("card-login");
const telaEntrar = document.getElementById("tela-entrar");

const telaBoas = document.getElementById("tela-boas-vindas");
const tituloOla = document.getElementById("titulo-ola");

const erro = document.getElementById("erro-login");

formLogin.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const usuario = JSON.parse(localStorage.getItem("usuario_adote"));

    if (!usuario || usuario.email !== email || usuario.senha !== senha) {
        erro.innerText = "E-mail ou senha incorretos";
        erro.style.opacity = 1;
        return;
    }

    localStorage.removeItem("sessao_encerrada");

    erro.style.opacity = 0;

    titulo.classList.add("fade-out");
    txtCadastro.classList.add("fade-out");
    imgPets.classList.add("fade-out");
    card.classList.add("spin-glass");
    telaEntrar.classList.add("fade-out");

setTimeout(() => {
        telaEntrar.style.display = "none";

        window.location.href = "lista.html";
        
    }, 600);
});

document.getElementById("btn-pets").addEventListener("click", () => {
    window.location.href = "lista.html";
});