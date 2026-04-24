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

// // MODAL
// let btnajouterHotel = document.querySelector(".btnajouter button")
// let transparant = document.querySelector(".transparant")
// let modal = document.querySelector(".modal")
// let fermerModal = document.querySelector("#fermermodal")


// btnajouterHotel.addEventListener("click", function(){
//     transparant.classList.add("active")
//     modal.classList.add("active")
// })
// fermerModal.addEventListener("click", function(){
//     transparant.classList.remove("active")
//     modal.classList.remove("active")
//     form.reset()
// })


// MODAL
let btnajouterHotel = document.querySelector(".btnajouter button");
let transparant = document.querySelector(".transparant");
let modal = document.querySelector(".modal");
let fermerModal = document.querySelector("#fermermodal");
let form = document.querySelector("border"); // assure-toi que ton form existe

// OUVRIR
btnajouterHotel.addEventListener("click", function () {
    transparant.classList.add("active");
    modal.classList.add("active");
    document.main.classList.add("no-scroll"); // 🔥 bloque scroll
});

// FERMER (bouton)
fermerModal.addEventListener("click", closeModal);

// FERMER (clic extérieur)
transparant.addEventListener("click", function (e) {
    if (e.target === transparant) {
        closeModal();
    }
});

// EMPÊCHE fermeture si clic dans le modal
modal.addEventListener("click", function (e) {
    e.stopPropagation();
});

// FONCTION FERMETURE
function closeModal() {
    transparant.classList.remove("active");
    modal.classList.remove("active");
    document.main.classList.remove("no-scroll"); // 🔥 réactive scroll
    form.reset();
}






