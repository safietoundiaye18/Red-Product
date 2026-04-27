const API_URL = 'https://red-product-backend-z5lx.onrender.com';

const formReset = document.getElementById('formReset');
const motDePasseInput = document.getElementById('motDePasse');
const confirmerMotDePasseInput = document.getElementById('confirmerMotDePasse');
const btnReset = document.getElementById('btnReset');
const messageReset = document.getElementById('messageReset');
const togglePassword1 = document.getElementById('togglePassword1');
const togglePassword2 = document.getElementById('togglePassword2');

// Récupérer le token dans l'URL
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

// Si pas de token, rediriger vers la page mot de passe oublié
if (!token) {
    window.location.href = 'motdepasse.html';
}

// Afficher/cacher mot de passe 1
togglePassword1.addEventListener('click', () => {
    if (motDePasseInput.type === 'password') {
        motDePasseInput.type = 'text';
        togglePassword1.classList.remove('fa-eye');
        togglePassword1.classList.add('fa-eye-slash');
    } else {
        motDePasseInput.type = 'password';
        togglePassword1.classList.remove('fa-eye-slash');
        togglePassword1.classList.add('fa-eye');
    }
});

// Afficher/cacher mot de passe 2
togglePassword2.addEventListener('click', () => {
    if (confirmerMotDePasseInput.type === 'password') {
        confirmerMotDePasseInput.type = 'text';
        togglePassword2.classList.remove('fa-eye');
        togglePassword2.classList.add('fa-eye-slash');
    } else {
        confirmerMotDePasseInput.type = 'password';
        togglePassword2.classList.remove('fa-eye-slash');
        togglePassword2.classList.add('fa-eye');
    }
});

// Soumission du formulaire
formReset.addEventListener('submit', async (e) => {
    e.preventDefault();

    const motDePasse = motDePasseInput.value.trim();
    const confirmerMotDePasse = confirmerMotDePasseInput.value.trim();

    // Vider le message
    messageReset.style.display = 'none';

    // Vérifier que les mots de passe correspondent
    if (motDePasse !== confirmerMotDePasse) {
        messageReset.style.color = 'red';
        messageReset.textContent = 'Les mots de passe ne correspondent pas.';
        messageReset.style.display = 'block';
        return;
    }

    // Vérifier la longueur
    if (motDePasse.length < 6) {
        messageReset.style.color = 'red';
        messageReset.textContent = 'Le mot de passe doit avoir au moins 6 caractères.';
        messageReset.style.display = 'block';
        return;
    }

    // Désactiver le bouton
    btnReset.textContent = 'Réinitialisation en cours...';
    btnReset.disabled = true;

    try {
        const response = await fetch(`${API_URL}/api/auth/reinitialiser-mot-de-passe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token, motDePasse })
        });

        const data = await response.json();

        if (data.succes) {
            // Message de succès
            messageReset.style.color = 'green';
            messageReset.textContent = '✅ Mot de passe réinitialisé avec succès ! Redirection en cours...';
            messageReset.style.display = 'block';

            // Attendre 2 secondes et rediriger vers la connexion
            await new Promise(resolve => setTimeout(resolve, 2000));
            window.location.href = 'index.htmL';
        } else {
            messageReset.style.color = 'red';
            messageReset.textContent = data.message;
            messageReset.style.display = 'block';

            btnReset.textContent = 'Réinitialiser';
            btnReset.disabled = false;
        }
    } catch (erreur) {
        messageReset.style.color = 'red';
        messageReset.textContent = 'Erreur de connexion au serveur. Réessayez.';
        messageReset.style.display = 'block';

        btnReset.textContent = 'Réinitialiser';
        btnReset.disabled = false;
    }
});


/*


Explication :

URLSearchParams → récupère le token dans l'URL automatiquement. Quand l'utilisateur clique le lien dans l'email reset-password.html?token=abc123, on extrait abc123
Si pas de token → redirection vers mot de passe oublié
On vérifie que les deux mots de passe correspondent
On vérifie que le mot de passe a au moins 6 caractères
Après succès → redirection vers la page de connexion
*/ 