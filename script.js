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

// MODAL
let btnajouterHotel = document.querySelector(".btnajouter button")
let transparant = document.querySelector(".transparant")
let modal = document.querySelector(".modal")
let fermerModal = document.querySelector("#fermermodal")


btnajouterHotel.addEventListener("click", function(){
    transparant.classList.add("active")
    modal.classList.add("active")
})
fermerModal.addEventListener("click", function(){
    transparant.classList.remove("active")
    modal.classList.remove("active")
    form.reset()
})







