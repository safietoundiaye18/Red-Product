console.log("Je suis connecté");

const toggle = document.querySelector(".toggle-button");
const sidebar = document.querySelector("#sidebar");
const overlay = document.querySelector(".overlay");

if (toggle && sidebar && overlay) {

toggle.addEventListener("click", function () {
    sidebar.classList.toggle("expand");
    overlay.classList.toggle("active");
});

// Fermer la sidebar en cliquant sur l'overlay
overlay.addEventListener("click", function () {
    sidebar.classList.remove("expand");
    overlay.classList.remove("active");
});
}