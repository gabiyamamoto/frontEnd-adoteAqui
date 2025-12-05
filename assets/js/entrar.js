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

// Evento de submissão do formulário de login
formLogin.addEventListener("submit", (e) => {
    e.preventDefault();

    // Coleta os dados do formulário
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    // Recupera o usuário salvo no localStorage
    const usuario = JSON.parse(localStorage.getItem("usuario_adote"));

    // Verifica se o usuário existe e se as credenciais são corretas
    if (!usuario || usuario.email !== email || usuario.senha !== senha) {
        erro.innerText = "E-mail ou senha incorretos";  // Mensagem de erro
        erro.style.opacity = 1;  // Torna a mensagem visível
        return;
    }

    // Remove qualquer dado de sessão encerrada, caso haja
    localStorage.removeItem("sessao_encerrada");

    // Limpa a mensagem de erro
    erro.style.opacity = 0;

    // Animações de transição da tela de login
    titulo.classList.add("fade-out");
    txtCadastro.classList.add("fade-out");
    imgPets.classList.add("fade-out");
    card.classList.add("spin-glass");
    telaEntrar.classList.add("fade-out");

    setTimeout(() => {
        // Esconde a tela de login e redireciona para a página de lista de pets
        telaEntrar.style.display = "none";
        window.location.href = "lista.html";
    }, 600);
});

// Evento para redirecionar para a lista de pets
document.getElementById("btn-pets").addEventListener("click", () => {
    window.location.href = "lista.html";
});
