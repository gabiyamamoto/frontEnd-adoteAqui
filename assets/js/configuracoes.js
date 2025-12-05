document.addEventListener("DOMContentLoaded", () => {

    const emailInput = document.getElementById("config-email");
    const estadoInput = document.getElementById("config-estado");
    const senhaInput = document.getElementById("config-senha");

    const avatarPreview = document.getElementById("avatar-preview");
    const avatarInput = document.getElementById("avatar-input");

    let usuario = JSON.parse(localStorage.getItem("usuario_adote"));

    if (!usuario) {
        window.location.href = "entrar.html";
        return;
    }

    emailInput.value = usuario.email;
    estadoInput.value = usuario.estado;
    senhaInput.value = usuario.senha;

    if (usuario.avatar) {
        avatarPreview.src = usuario.avatar;
    }

    avatarInput.addEventListener("change", () => {
        const file = avatarInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            usuario.avatar = reader.result;
            avatarPreview.src = reader.result;
        };
        reader.readAsDataURL(file);
    });

    document.getElementById("form-config").addEventListener("submit", (e) => {
        e.preventDefault();

        usuario.email = emailInput.value;
        usuario.estado = estadoInput.value;
        usuario.senha = senhaInput.value;

        localStorage.setItem("usuario_adote", JSON.stringify(usuario));

        alert("Alterações salvas!");
    });

    document.getElementById("btn-sair").addEventListener("click", () => {
        localStorage.setItem("sessao_encerrada", "true");
        window.location.href = "entrar.html";
    });
});
