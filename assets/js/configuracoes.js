document.addEventListener("DOMContentLoaded", () => {

    // Referência para os campos de entrada do formulário
    const emailInput = document.getElementById("config-email");
    const estadoInput = document.getElementById("config-estado");
    const senhaInput = document.getElementById("config-senha");

    // Referências para o avatar
    const avatarPreview = document.getElementById("avatar-preview");
    const avatarInput = document.getElementById("avatar-input");

    // Recupera o usuário do localStorage, se existir
    let usuario = JSON.parse(localStorage.getItem("usuario_adote"));

    // Se não encontrar o usuário, redireciona para a página de login
    if (!usuario) {
        window.location.href = "entrar.html";
        return;
    }

    // Preenche os campos com os dados do usuário
    emailInput.value = usuario.email;
    estadoInput.value = usuario.estado;
    senhaInput.value = usuario.senha;

    // Se o usuário tiver um avatar, exibe a imagem
    if (usuario.avatar) {
        avatarPreview.src = usuario.avatar;
    }

    // Evento para mudança de avatar
    avatarInput.addEventListener("change", () => {
        const file = avatarInput.files[0];
        if (!file) return; // Se não houver arquivo selecionado, sai

        const reader = new FileReader();
        reader.onload = () => {
            usuario.avatar = reader.result; // Atualiza o avatar do usuário
            avatarPreview.src = reader.result; // Atualiza a prévia do avatar
        };
        reader.readAsDataURL(file); // Lê o arquivo como uma URL de dados
    });

    // Evento para salvar as alterações no formulário
    document.getElementById("form-config").addEventListener("submit", (e) => {
        e.preventDefault(); // Previne o comportamento padrão do formulário

        // Atualiza os dados do usuário com os valores dos campos
        usuario.email = emailInput.value;
        usuario.estado = estadoInput.value;
        usuario.senha = senhaInput.value;

        // Salva os dados atualizados no localStorage
        localStorage.setItem("usuario_adote", JSON.stringify(usuario));

        // Exibe mensagem de confirmação
        alert("Alterações salvas!");
    });

    // Evento para sair da conta
    document.getElementById("btn-sair").addEventListener("click", () => {
        localStorage.setItem("sessao_encerrada", "true"); // Marca a sessão como encerrada
        window.location.href = "entrar.html"; // Redireciona para a página de login
    });
});
