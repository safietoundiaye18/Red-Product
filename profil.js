console.log('profil.js chargé !');

const modalProfil = document.getElementById('modalProfil');
const fermerProfil = document.getElementById('fermerProfil');
const ouvrirProfil = document.getElementById('ouvrirProfil');
const btnSauvegarderProfil = document.getElementById('btnSauvegarderProfil');
const btnChangerMotDePasse = document.getElementById('btnChangerMotDePasse');
const messageProfil = document.getElementById('messageProfil');

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

// // Déconnexion - fonction globale

// let deconnexionEnCours = false;

// async function deconnecter() {
//     if (deconnexionEnCours) return;
//     deconnexionEnCours = true;

//     console.log('deconnecter appelé !');
//     try {
//         await fetch(`${API_URL}/api/auth/deconnexion`, {
//             method: 'POST',
//             headers: { 'Authorization': `Bearer ${token}` }
//         });
//     } catch (e) {
//         console.error(e);
//     }

//     localStorage.removeItem('token');
//     localStorage.removeItem('utilisateur');
//     window.location.replace('index.html');
// }

// Charger le profil
async function chargerProfil() {
    try {
        const response = await fetch(`${API_URL}/api/users/profil`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (data.succes) {
            const user = data.user;

            document.getElementById('profilNom').value = user.nom;
            document.getElementById('profilEmail').value = user.email;

            if (user.avatar) {
                document.getElementById('profilAvatar').src = user.avatar;
                document.getElementById('photoUtilisateur').src = user.avatar;
                const photoSidebar = document.querySelector('.bas .image1');
                if (photoSidebar) photoSidebar.src = user.avatar;
            }

            const nomSidebar = document.querySelector('.lineheight p:first-child');
            if (nomSidebar) nomSidebar.textContent = user.nom;

            localStorage.setItem('utilisateur', JSON.stringify(user));
        }
    } catch (erreur) {
        console.error(erreur);
    }
}

// Ouvrir le modal profil
ouvrirProfil.addEventListener('click', () => {
    modalProfil.classList.add('active');
    document.querySelector('#modalProfil .modal').classList.add('active');
    document.body.classList.add('no-scroll');
    chargerProfil();
});

// Fermer le modal profil
fermerProfil.addEventListener('click', () => {
    modalProfil.classList.remove('active');
    document.querySelector('#modalProfil .modal').classList.remove('active');
    document.body.classList.remove('no-scroll');
});

// Fermer en cliquant dehors
modalProfil.addEventListener('click', (e) => {
    if (e.target === modalProfil) {
        modalProfil.classList.remove('active');
        document.querySelector('#modalProfil .modal').classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
});

// Sauvegarder le profil
btnSauvegarderProfil.addEventListener('click', async () => {
    const formData = new FormData();
    formData.append('nom', document.getElementById('profilNom').value);
    formData.append('email', document.getElementById('profilEmail').value);

    const avatarFile = document.getElementById('avatarFile').files[0];
    if (avatarFile) formData.append('avatar', avatarFile);

    try {
        btnSauvegarderProfil.textContent = 'Sauvegarde en cours...';
        btnSauvegarderProfil.disabled = true;

        const response = await fetch(`${API_URL}/api/users/profil`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });

        const data = await response.json();

        if (data.succes) {
            afficherToast('Profil mis à jour avec succès ! ✅', 'succes');
            if (data.user.avatar) {
                document.getElementById('profilAvatar').src = data.user.avatar;
                document.getElementById('photoUtilisateur').src = data.user.avatar;
                const photoSidebar = document.querySelector('.bas .image1');
                if (photoSidebar) photoSidebar.src = data.user.avatar;
            }
            const nomSidebar = document.querySelector('.lineheight p:first-child');
            if (nomSidebar) nomSidebar.textContent = data.user.nom;
            localStorage.setItem('utilisateur', JSON.stringify(data.user));
        } else {
            afficherToast(data.message, 'erreur');
        }
    } catch (erreur) {
        afficherToast('Erreur lors de la sauvegarde.', 'erreur');
    } finally {
        btnSauvegarderProfil.textContent = 'Sauvegarder';
        btnSauvegarderProfil.disabled = false;
    }
});

// Changer le mot de passe
btnChangerMotDePasse.addEventListener('click', async () => {
    const ancienMotDePasse = document.getElementById('ancienMotDePasse').value;
    const nouveauMotDePasse = document.getElementById('nouveauMotDePasse').value;

    if (!ancienMotDePasse || !nouveauMotDePasse) {
        afficherToast('Veuillez remplir les deux champs.', 'erreur');
        return;
    }

    if (nouveauMotDePasse.length < 6) {
        afficherToast('Le nouveau mot de passe doit avoir au moins 6 caractères.', 'erreur');
        return;
    }

    try {
        btnChangerMotDePasse.textContent = 'Modification en cours...';
        btnChangerMotDePasse.disabled = true;

        const response = await fetch(`${API_URL}/api/users/mot-de-passe`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ancienMotDePasse, nouveauMotDePasse })
        });

        const data = await response.json();

        if (data.succes) {
            afficherToast('Mot de passe modifié avec succès ! ✅', 'succes');
            document.getElementById('ancienMotDePasse').value = '';
            document.getElementById('nouveauMotDePasse').value = '';
        } else {
            afficherToast(data.message, 'erreur');
        }

    } catch (erreur) {
        afficherToast('Erreur lors de la modification.', 'erreur');
    } finally {
        btnChangerMotDePasse.textContent = 'Changer le mot de passe';
        btnChangerMotDePasse.disabled = false;
    }
});

<i class="fa-regular fa-eye" id="toggleAncien" style="position: absolute; right: 10px; bottom: 8px; cursor: pointer; color: gray;"></i>

// Charger le profil au démarrage
chargerProfil();