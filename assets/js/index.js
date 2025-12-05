document.addEventListener("DOMContentLoaded", () => {
    //Seleciona os elementos do DOM
    const linhaDesktop = document.querySelector(".linha-desktop");
    const topMobile = document.querySelector(".top-mobile");
    const menuDesktop = document.querySelector(".menu-desktop");
    const menuMobile = document.querySelector(".menu-mobile");

    // Função para atualizar o layout do header dependendo da largura da tela
    function atualizarHeader() {
        const largura = window.innerWidth;

        if (largura <= 850) {
            // Para telas menores, esconde os elementos de desktop e mostra os de mobile
            if (linhaDesktop) linhaDesktop.style.display = "none";
            if (menuDesktop) menuDesktop.style.display = "none";

            if (topMobile) topMobile.style.display = "flex";
            if (menuMobile) menuMobile.style.display = "flex";
        } else {
            // Para telas maiores, exibe os elementos de desktop e esconde os de mobile
            if (linhaDesktop) linhaDesktop.style.display = "flex";
            if (menuDesktop) menuDesktop.style.display = "flex";

            if (topMobile) topMobile.style.display = "none";
            if (menuMobile) menuMobile.style.display = "none";
        }
    }

    // Chama a função para ajustar o layout logo ao carregar a página
    atualizarHeader();
    // Recalcula a visibilidade ao redimensionar a janela
    window.addEventListener("resize", atualizarHeader);
});
