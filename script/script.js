const display_menu = () => {
    document.querySelector("nav ul").classList.toggle("afficher_menu");
}

document.querySelector("nav div").addEventListener("click", display_menu);

