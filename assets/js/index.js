document.addEventListener("DOMContentLoaded", () => {
    const linhaDesktop = document.querySelector(".linha-desktop");
    const topMobile = document.querySelector(".top-mobile");
    const menuDesktop = document.querySelector(".menu-desktop");
    const menuMobile = document.querySelector(".menu-mobile");

    function atualizarHeader() {
        const largura = window.innerWidth;

        if (largura <= 850) {
            if (linhaDesktop) linhaDesktop.style.display = "none";
            if (menuDesktop) menuDesktop.style.display = "none";

            if (topMobile) topMobile.style.display = "flex";
            if (menuMobile) menuMobile.style.display = "flex";
        } else {
            if (linhaDesktop) linhaDesktop.style.display = "flex";
            if (menuDesktop) menuDesktop.style.display = "flex";

            if (topMobile) topMobile.style.display = "none";
            if (menuMobile) menuMobile.style.display = "none";
        }
    }

    atualizarHeader();
    window.addEventListener("resize", atualizarHeader);
});
