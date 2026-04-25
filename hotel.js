const API_URL = 'https://red-product-backend-z5lx.onrender.com';

// Vérifier que l'utilisateur est connecté
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'index.html';
}

// Afficher le nom de l'utilisateur
const utilisateur = JSON.parse(localStorage.getItem('utilisateur'));
if (utilisateur) {
    const nomElement = document.querySelector('.lineheight p:first-child');
    if (nomElement) nomElement.textContent = utilisateur.nom;
}

// Vérifier si l'utilisateur est admin
const estAdmin = utilisateur && utilisateur.role === 'admin';

// Tout le monde peut gérer ses hôtels
const btnAjouter = document.querySelector('.btnajouter');
if (btnAjouter) {
    btnAjouter.style.display = 'none';
}
// && !estAdmin
// Éléments
const listeHotels = document.getElementById('listeHotels');
const nombreHotels = document.getElementById('nombreHotels');
const searchInput = document.querySelector('.input');
const modalDetail = document.getElementById('modalDetail');
const fermerDetail = document.getElementById('fermerDetail');
const btnModifier = document.getElementById('btnModifier');
const btnSupprimer = document.getElementById('btnSupprimer');

// Charger les hôtels
async function chargerHotels(search = '') {
    try {
        listeHotels.innerHTML = '<p id="chargement">Chargement des hôtels...</p>';

        let url = `${API_URL}/api/hotels?limit=20`;
        if (search) url += `&search=${search}`;

        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (data.succes) {
            nombreHotels.textContent = data.total;

            if (data.hotels.length === 0) {
                listeHotels.innerHTML = '<p>Aucun hôtel trouvé.</p>';
                return;
            }

            listeHotels.innerHTML = data.hotels.map(hotel => `
                <div class="items" data-id="${hotel._id}" style="cursor: pointer;">
                    <div class="image2">
                        <img class="images2" 
                            src="${hotel.image || 'images/2ace93ddd9dc9cfc7b2bd9d9a279634ee238b1c0.jpg'}" 
                            alt="${hotel.nom}"
                            onerror="this.src='images/2ace93ddd9dc9cfc7b2bd9d9a279634ee238b1c0.jpg'">
                    </div>
                    <div class="basimage">
                        <p style="font-size:12px; color:rgb(152,57,57);">${hotel.adresse}</p>
                        <p style="font-size:1rem;"><b>${hotel.nom}</b></p>
                        <p style="font-size:12px; color:rgb(137,137,137);">${hotel.prixParNuit.toLocaleString()} ${hotel.devise} par nuit</p>
                    </div>
                </div>
            `).join('');

            // Ajouter événement clic sur chaque hôtel
            document.querySelectorAll('.items').forEach(item => {
                item.addEventListener('click', () => {
                    const id = item.dataset.id;
                    ouvrirDetailHotel(id);
                });
            });
        }
    } catch (erreur) {
        listeHotels.innerHTML = '<p>Erreur de chargement des hôtels.</p>';
        console.error(erreur);
    }
}

// Ouvrir le modal détail
async function ouvrirDetailHotel(id) {
    try {
        const response = await fetch(`${API_URL}/api/hotels/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (data.succes) {
            const hotel = data.hotel;

            // Remplir les champs
            document.getElementById('detailId').value = hotel._id;
            document.getElementById('detailNom').value = hotel.nom;
            document.getElementById('detailEmail').value = hotel.email || '';
            document.getElementById('detailAdresse').value = hotel.adresse || '';
            document.getElementById('detailTelephone').value = hotel.telephone || '';
            document.getElementById('detailPrix').value = hotel.prixParNuit;
            document.getElementById('detailDevise').value = hotel.devise || 'F XOF';
            document.getElementById('detailImage').src = hotel.image || 'images/2ace93ddd9dc9cfc7b2bd9d9a279634ee238b1c0.jpg';

            // Ouvrir le modal
            modalDetail.classList.add('active');
            document.querySelector('#modalDetail .modal').classList.add('active');

            // Toujours afficher les boutons modifier et supprimer
            btnModifier.style.display = 'block';
            btnSupprimer.style.display = 'block';
            document.querySelectorAll('#modalDetail input, #modalDetail select').forEach(input => {
                input.disabled = false;
            });
        }
    } catch (erreur) {
        console.error(erreur);
    }
}

// Fermer le modal détail
fermerDetail.addEventListener('click', () => {
    modalDetail.classList.remove('active');
    document.querySelector('#modalDetail .modal').classList.remove('active');
});

// Fermer en cliquant dehors
modalDetail.addEventListener('click', (e) => {
    if (e.target === modalDetail) {
        modalDetail.classList.remove('active');
        document.querySelector('#modalDetail .modal').classList.remove('active');
    }
});

// Modifier un hôtel
btnModifier.addEventListener('click', async () => {
    const id = document.getElementById('detailId').value;

    const formData = new FormData();
    formData.append('nom', document.getElementById('detailNom').value);
    formData.append('email', document.getElementById('detailEmail').value);
    formData.append('adresse', document.getElementById('detailAdresse').value);
    formData.append('telephone', document.getElementById('detailTelephone').value);
    formData.append('prixParNuit', document.getElementById('detailPrix').value);
    formData.append('devise', document.getElementById('detailDevise').value);

    const imageFile = document.getElementById('detailImageFile').files[0];
    if (imageFile) formData.append('image', imageFile);

    try {
        btnModifier.textContent = 'Modification en cours...';
        btnModifier.disabled = true;

        const response = await fetch(`${API_URL}/api/hotels/${id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });

        const data = await response.json();

        if (data.succes) {
            // Fermer le modal
            modalDetail.classList.remove('active');
            document.querySelector('#modalDetail .modal').classList.remove('active');

            // Recharger les hôtels
            chargerHotels();
        } else {
            alert(data.message);
        }
    } catch (erreur) {
        alert('Erreur lors de la modification.');
        console.error(erreur);
    } finally {
        btnModifier.textContent = 'Modifier';
        btnModifier.disabled = false;
    }
});

// Supprimer un hôtel
btnSupprimer.addEventListener('click', async () => {
    const id = document.getElementById('detailId').value;

    if (!confirm('Voulez-vous vraiment supprimer cet hôtel ?')) return;

    try {
        btnSupprimer.textContent = 'Suppression en cours...';
        btnSupprimer.disabled = true;

        const response = await fetch(`${API_URL}/api/hotels/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (data.succes) {
            // Fermer le modal
            modalDetail.classList.remove('active');
            document.querySelector('#modalDetail .modal').classList.remove('active');

            // Recharger les hôtels
            chargerHotels();
        } else {
            alert(data.message);
        }
    } catch (erreur) {
        alert('Erreur lors de la suppression.');
        console.error(erreur);
    } finally {
        btnSupprimer.textContent = 'Supprimer';
        btnSupprimer.disabled = false;
    }
});

// Recherche
let rechercheTimeout;
searchInput.addEventListener('input', (e) => {
    clearTimeout(rechercheTimeout);
    rechercheTimeout = setTimeout(() => {
        chargerHotels(e.target.value.trim());
    }, 500);
});

// Formulaire ajout hôtel
const formHotel = document.getElementById('border');
formHotel.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nom', document.getElementById('name').value);
    formData.append('email', document.getElementById('Email').value);
    formData.append('adresse', document.getElementById('adresse').value);
    formData.append('telephone', document.getElementById('muméro').value);
    formData.append('prixParNuit', document.getElementById('prix').value);
    formData.append('devise', document.querySelector('.select').value);

    const imageFile = document.getElementById('imageHotel') ? document.getElementById('imageHotel').files[0] : null;
    if (imageFile) formData.append('image', imageFile);

    try {
        const response = await fetch(`${API_URL}/api/hotels`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });

        const data = await response.json();

        if (data.succes) {
            document.querySelector('.transparant').classList.remove('active');
            document.querySelector('.modal').classList.remove('active');
            formHotel.reset();
            chargerHotels();
        } else {
            alert(data.message);
        }
    } catch (erreur) {
        alert('Erreur lors de la création de l\'hôtel.');
        console.error(erreur);
    }
});

// Déconnexion
const btnDeconnexion = document.querySelector('.fa-arrow-right-from-bracket');
if (btnDeconnexion) {
    btnDeconnexion.closest('a').addEventListener('click', async (e) => {
        e.preventDefault();

        await fetch(`${API_URL}/api/auth/deconnexion`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        localStorage.removeItem('token');
        localStorage.removeItem('utilisateur');
        window.location.href = 'index.html';
    });
}

// Charger au démarrage
chargerHotels();