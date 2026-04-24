const API_URL = 'https://red-product-backend-z5lx.onrender.com';

const formInscription = document.getElementById('formInscription');
const nomInput = document.getElementById('nom');
const emailInput = document.getElementById('email');
const motDePasseInput = document.getElementById('motDePasse');
const termesInput = document.getElementById('termes');
const btnInscription = document.getElementById('btnInscription');
const messageInscription = document.getElementById('messageInscription');
const togglePassword = document.getElementById('togglePassword');

// Afficher/cacher le mot de passe
togglePassword.addEventListener('click', () => {
    if (motDePasseInput.type === 'password') {
        motDePasseInput.type = 'text';
        togglePassword.classList.remove('fa-eye');
        togglePassword.classList.add('fa-eye-slash');
    } else {
        motDePasseInput.type = 'password';
        togglePassword.classList.remove('fa-eye-slash');
        togglePassword.classList.add('fa-eye');
    }
});

// Soumission du formulaire
formInscription.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nom = nomInput.value.trim();
    const email = emailInput.value.trim();
    const motDePasse = motDePasseInput.value.trim();

    // Vérifier que les termes sont acceptés
    if (!termesInput.checked) {
        messageInscription.style.color = 'red';
        messageInscription.textContent = 'Veuillez accepter les termes et la politique.';
        messageInscription.style.display = 'block';
        return;
    }

    // Vérifier que le mot de passe a au moins 6 caractères
    if (motDePasse.length < 6) {
        messageInscription.style.color = 'red';
        messageInscription.textContent = 'Le mot de passe doit avoir au moins 6 caractères.';
        messageInscription.style.display = 'block';
        return;
    }

    // Vider le message
    messageInscription.style.display = 'none';

    // Désactiver le bouton
    btnInscription.textContent = 'Inscription en cours...';
    btnInscription.disabled = true;

    try {
        const response = await fetch(`${API_URL}/api/auth/inscription`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nom, email, motDePasse })
        });

        const data = await response.json();

        if (data.succes) {
            // Sauvegarder le token
            localStorage.setItem('token', data.token);
            localStorage.setItem('utilisateur', JSON.stringify(data.utilisateur));

            // Message de succès
            messageInscription.style.color = 'green';
            messageInscription.textContent = 'Inscription réussie ! Redirection en cours...';
            messageInscription.style.display = 'block';

            // Attendre 1 seconde avant de rediriger
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Rediriger vers le dashboard
            window.location.href = 'daschboard.html';
        } else {
            messageInscription.style.color = 'red';
            messageInscription.textContent = data.message;
            messageInscription.style.display = 'block';

            btnInscription.textContent = "S'inscrire";
            btnInscription.disabled = false;
        }
    } catch (erreur) {
        messageInscription.style.color = 'red';
        messageInscription.textContent = 'Erreur de connexion au serveur. Réessayez.';
        messageInscription.style.display = 'block';

        btnInscription.textContent = "S'inscrire";
        btnInscription.disabled = false;
    }
});


/*

Explication :

On vérifie que les termes sont acceptés avant d'envoyer
On vérifie que le mot de passe a au moins 6 caractères
Si l'inscription réussit, on sauvegarde le token et on redirige vers le dashboard
Si l'email existe déjà, on affiche le message d'erreur du backend

*/