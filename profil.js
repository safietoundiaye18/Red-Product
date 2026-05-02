
const modalProfil = document.getElementById('modalProfil');
const fermerProfil = document.getElementById('fermerProfil');
const ouvrirProfil = document.getElementById('ouvrirProfil');
const btnSauvegarderProfil = document.getElementById('btnSauvegarderProfil');
const btnChangerMotDePasse = document.getElementById('btnChangerMotDePasse');
const messageProfil = document.getElementById('messageProfil');

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

            // Photo de profil
            if (user.avatar) {
                document.getElementById('profilAvatar').src = user.avatar;
                document.getElementById('photoUtilisateur').src = user.avatar;
                // Photo dans la sidebar ← ajouter ceci
                const photoSidebar = document.querySelector('.bas .image1');
                if (photoSidebar) photoSidebar.src = user.avatar;
            }

            // Nom dans la sidebar
            const nomSidebar = document.querySelector('.lineheight p:first-child');
            if (nomSidebar) nomSidebar.textContent = user.nom;

            // Sauvegarder dans localStorage
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
            messageProfil.style.color = 'green';
            messageProfil.textContent = '✅ Profil mis à jour avec succès !';
            messageProfil.style.display = 'block';

            // Mettre à jour la photo
            if (data.user.avatar) {
                document.getElementById('profilAvatar').src = data.user.avatar;
                document.getElementById('photoUtilisateur').src = data.user.avatar;
                // Photo dans la sidebar
                const photoSidebar = document.querySelector('.bas .image1');
                if (photoSidebar) photoSidebar.src = data.user.avatar;
            }

            // Mettre à jour le nom dans la sidebar
            const nomSidebar = document.querySelector('.lineheight p:first-child');
            if (nomSidebar) nomSidebar.textContent = data.user.nom;

            localStorage.setItem('utilisateur', JSON.stringify(data.user));
        } else {
            messageProfil.style.color = 'red';
            messageProfil.textContent = data.message;
            messageProfil.style.display = 'block';
        }
    } catch (erreur) {
        messageProfil.style.color = 'red';
        messageProfil.textContent = 'Erreur lors de la sauvegarde.';
        messageProfil.style.display = 'block';
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
        messageProfil.style.color = 'red';
        messageProfil.textContent = 'Veuillez remplir les deux champs.';
        messageProfil.style.display = 'block';
        return;
    }

    if (nouveauMotDePasse.length < 6) {
        messageProfil.style.color = 'red';
        messageProfil.textContent = 'Le nouveau mot de passe doit avoir au moins 6 caractères.';
        messageProfil.style.display = 'block';
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
            messageProfil.style.color = 'green';
            messageProfil.textContent = '✅ Mot de passe modifié avec succès !';
            messageProfil.style.display = 'block';

            document.getElementById('ancienMotDePasse').value = '';
            document.getElementById('nouveauMotDePasse').value = '';
        } else {
            messageProfil.style.color = 'red';
            messageProfil.textContent = data.message;
            messageProfil.style.display = 'block';
        }
    } catch (erreur) {
        messageProfil.style.color = 'red';
        messageProfil.textContent = 'Erreur lors de la modification.';
        messageProfil.style.display = 'block';
    } finally {
        btnChangerMotDePasse.textContent = 'Changer le mot de passe';
        btnChangerMotDePasse.disabled = false;
    }
});

// Charger le profil au démarrage
chargerProfil();