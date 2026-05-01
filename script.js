



console.log("Je suis connecté");

// SIDEBAR TOGGLE
const toggle = document.querySelector(".toggle-button");
const sidebar = document.querySelector("#sidebar");
const overlay = document.querySelector(".overlay");

if (toggle && sidebar && overlay) {
    toggle.addEventListener("click", function () {
        sidebar.classList.toggle("expand");
        overlay.classList.toggle("active");
    });

    overlay.addEventListener("click", function () {
        sidebar.classList.remove("expand");
        overlay.classList.remove("active");
    });
}

// MODAL
const btnajouterHotel = document.querySelector(".btnajouter button");
const transparant = document.getElementById('modalAjouter');
const modal = document.getElementById('modalAjouterContent');
const fermerModal = document.querySelector("#fermermodal");
const form = document.querySelector("form#border");

if (btnajouterHotel && transparant && modal && fermerModal) {

    btnajouterHotel.addEventListener("click", function () {
        transparant.classList.add("active");
        modal.classList.add("active");
        document.body.classList.add('no-scroll');
    });

    fermerModal.addEventListener("click", closeModal);

    transparant.addEventListener("click", function (e) {
        if (e.target === transparant) {
            closeModal();
        }
    });

    modal.addEventListener("click", function (e) {
        e.stopPropagation();
    });

    function closeModal() {
        transparant.classList.remove("active");
        modal.classList.remove("active");
        document.body.classList.remove('no-scroll');
        if (form) form.reset();
    }
}