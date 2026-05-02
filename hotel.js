// Vérifier le token à chaque chargement
const token = localStorage.getItem('token');
if (!token) {
    window.location.replace('index.html');
}

// Empêcher retour arrière
history.pushState(null, null, location.href);
window.addEventListener('popstate', function () {
    const token = localStorage.getItem('token');
    if (!token) {
        history.pushState(null, null, location.href);
        window.location.replace('index.html');
    }
});

const API_URL = 'https://red-product-backend-z5lx.onrender.com';

// Afficher le nom de l'utilisateur
const utilisateur = JSON.parse(localStorage.getItem('utilisateur'));
if (utilisateur) {
    const nomElement = document.querySelector('.lineheight p:first-child');
    if (nomElement) nomElement.textContent = utilisateur.nom;
}

// Tout le monde peut gérer ses hôtels
const btnAjouter = document.querySelector('.btnajouter');
if (btnAjouter) {
    btnAjouter.style.display = 'block';
}

// Éléments
const listeHotels = document.getElementById('listeHotels');
const nombreHotels = document.getElementById('nombreHotels');
const searchInput = document.querySelector('.input');
const modalDetail = document.getElementById('modalDetail');
const fermerDetail = document.getElementById('fermerDetail');
const btnModifier = document.getElementById('btnModifier');
const btnSupprimer = document.getElementById('btnSupprimer');
let pageCourante = 1;


// Fonction Toast
function afficherToast(message, type = 'succes') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;

    if (type === 'succes') {
        toast.style.backgroundColor = '#4CAF50';
    } else if (type === 'erreur') {
        toast.style.backgroundColor = '#f44336';
    } else {
        toast.style.backgroundColor = '#2196F3';
    }

    toast.style.opacity = '1';

    setTimeout(() => {
        toast.style.opacity = '0';
    }, 3000);
}

// Charger les hôtels
async function chargerHotels(search = '', page = 1) {
    try {
        listeHotels.innerHTML = '<p id="chargement">Chargement des hôtels...</p>';

        let url = `${API_URL}/api/hotels?limit=8&page=${page}&tri=createdAt&ordre=desc`;
        if (search) url += `&search=${search}`;

        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (data.succes) {
            nombreHotels.textContent = data.total;

            if (data.hotels.length === 0) {
                listeHotels.innerHTML = '<p>Aucun hôtel trouvé.</p>';
                document.getElementById('pagination').innerHTML = '';
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

            document.querySelectorAll('.items').forEach(item => {
                item.addEventListener('click', () => {
                    ouvrirDetailHotel(item.dataset.id);
                });
            });

            afficherPagination(data.page, data.pages);
        }
    } catch (erreur) {
        listeHotels.innerHTML = '<p>Erreur de chargement des hôtels.</p>';
        console.error(erreur);
    }
}

// Pagination
function afficherPagination(pageCourante, totalPages) {
    const pagination = document.getElementById('pagination');

    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let html = '';

    html += `
        <button 
            onclick="changerPage(${pageCourante - 1})" 
            ${pageCourante === 1 ? 'disabled' : ''}
            style="padding: 8px 15px; border: 1px solid gray; border-radius: 8px; cursor: pointer; background: ${pageCourante === 1 ? '#eee' : 'white'};">
            ← Précédent
        </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
        html += `
            <button 
                onclick="changerPage(${i})"
                style="padding: 8px 12px; border: 1px solid gray; border-radius: 8px; cursor: pointer; background: ${i === pageCourante ? 'rgb(77,77,77)' : 'white'}; color: ${i === pageCourante ? 'white' : 'black'};">
                ${i}
            </button>
        `;
    }

    html += `
        <button 
            onclick="changerPage(${pageCourante + 1})" 
            ${pageCourante === totalPages ? 'disabled' : ''}
            style="padding: 8px 15px; border: 1px solid gray; border-radius: 8px; cursor: pointer; background: ${pageCourante === totalPages ? '#eee' : 'white'};">
            Suivant →
        </button>
    `;

    pagination.innerHTML = html;
}

function changerPage(page) {
    pageCourante = page;
    chargerHotels(searchInput.value.trim(), pageCourante);
    window.scrollTo(0, 0);
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

            document.getElementById('detailId').value = hotel._id;
            document.getElementById('detailNom').value = hotel.nom;
            document.getElementById('detailEmail').value = hotel.email || '';
            document.getElementById('detailAdresse').value = hotel.adresse || '';
            document.getElementById('detailTelephone').value = hotel.telephone || '';
            document.getElementById('detailPrix').value = hotel.prixParNuit;
            document.getElementById('detailDevise').value = hotel.devise || 'F XOF';
            document.getElementById('detailImage').src = hotel.image || 'images/2ace93ddd9dc9cfc7b2bd9d9a279634ee238b1c0.jpg';

            modalDetail.classList.add('active');
            document.querySelector('#modalDetail .modal').classList.add('active');
            document.body.classList.add('no-scroll');

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

// Fermer modal détail - bouton
fermerDetail.addEventListener('click', () => {
    modalDetail.classList.remove('active');
    document.querySelector('#modalDetail .modal').classList.remove('active');
    document.body.classList.remove('no-scroll');
});

// Fermer modal détail - clic dehors
modalDetail.addEventListener('click', (e) => {
    if (e.target === modalDetail) {
        modalDetail.classList.remove('active');
        document.querySelector('#modalDetail .modal').classList.remove('active');
        document.body.classList.remove('no-scroll');
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
            modalDetail.classList.remove('active');
            document.querySelector('#modalDetail .modal').classList.remove('active');
            document.body.classList.remove('no-scroll');
            // ← Toast succès modification
            afficherToast('Hôtel modifié avec succès !', 'succes');
            chargerHotels('', pageCourante);
        } else {
            // ← Toast erreur modification
            afficherToast(data.message, 'erreur');
        }
    } catch (erreur) {
        afficherToast('Erreur de connexion au serveur.', 'erreur'); // ← ici
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
            modalDetail.classList.remove('active');
            document.querySelector('#modalDetail .modal').classList.remove('active');
            document.body.classList.remove('no-scroll');
            // ← Toast succès suppression
            afficherToast('Hôtel supprimé avec succès !', 'succes');
            chargerHotels('', pageCourante);
        } else {
            // ← Toast erreur suppression
            afficherToast(data.message, 'erreur');
        }
    } catch (erreur) {
        afficherToast('Erreur de connexion au serveur.', 'erreur'); // ← ici
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
        pageCourante = 1;
        chargerHotels(e.target.value.trim(), 1);
    }, 500);
});

// Formulaire ajout hôtel
const btnEnregistrer = document.querySelector('#modalAjouter .btnform');
btnEnregistrer.addEventListener('click', async () => {

    // Récupérer les valeurs
    const nom = document.getElementById('name').value.trim();
    const email = document.getElementById('Email').value.trim();
    const adresse = document.getElementById('adresse').value.trim();
    const telephone = document.getElementById('muméro').value.trim();
    const prix = document.getElementById('prix').value.trim();

    // Vider les messages d'erreur
    document.getElementById('erreur-nom').textContent = '';
    document.getElementById('erreur-email').textContent = '';
    document.getElementById('erreur-adresse').textContent = '';
    document.getElementById('erreur-telephone').textContent = '';
    document.getElementById('erreur-prix').textContent = '';

    // Valider les champs
    let estValide = true;

    if (!nom) {
        document.getElementById('erreur-nom').textContent = 'Le nom est requis';
        estValide = false;
    }

    if (!email) {
        document.getElementById('erreur-email').textContent = 'L\'email est requis';
        estValide = false;
    }

    if (!adresse) {
        document.getElementById('erreur-adresse').textContent = 'L\'adresse est requise';
        estValide = false;
    }

    if (!telephone) {
        document.getElementById('erreur-telephone').textContent = 'Le téléphone est requis';
        estValide = false;
    }

    if (!prix) {
        document.getElementById('erreur-prix').textContent = 'Le prix est requis';
        estValide = false;
    }

    // Si un champ manque, on arrête
    if (!estValide) return;

    const formData = new FormData();
    formData.append('nom', nom);
    formData.append('email', email);
    formData.append('adresse', adresse);
    formData.append('telephone', telephone);
    formData.append('prixParNuit', prix);
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
            document.getElementById('modalAjouter').classList.remove('active');
            document.getElementById('modalAjouterContent').classList.remove('active');
            document.body.classList.remove('no-scroll');
            document.querySelectorAll('#border input, #border select').forEach(input => {
                input.value = '';
            });
            // ← Toast succès ajout
            afficherToast('Hôtel ajouté avec succès ! 🎉', 'succes');
            chargerHotels('', 1);
        } else {
            // ← Toast erreur ajout
            afficherToast(data.message, 'erreur');
        }
    } catch (erreur) {
        afficherToast('Erreur de connexion au serveur.', 'erreur'); // ← ici
        console.error(erreur);
    }
});



// // Déconnexion
// const btnDeconnexion = document.querySelector('.fa-arrow-right-from-bracket');
// if (btnDeconnexion) {
//     btnDeconnexion.closest('a').addEventListener('click', async (e) => {
//     e.preventDefault();

//     await fetch(`${API_URL}/api/auth/deconnexion`, {
//         method: 'POST',
//         headers: { 'Authorization': `Bearer ${token}` }
//     });

//     // ← Toast déconnexion
//     afficherToast('Déconnexion réussie !', 'succes');

//     // Attendre 1 seconde pour que le toast s'affiche
//     await new Promise(resolve => setTimeout(resolve, 1000));

//     localStorage.removeItem('token');
//     localStorage.removeItem('utilisateur');
//     window.location.replace('index.html');
// });
// }

// Charger au démarrage
chargerHotels('', 1);
