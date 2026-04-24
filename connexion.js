const API_URL = 'https://red-product-backend-z5lx.onrender.com';

const formConnexion = document.getElementById('formConnexion');
const emailInput = document.getElementById('email');
const motDePasseInput = document.getElementById('motDePasse');
const btnConnexion = document.getElementById('btnConnexion');
const erreurMessage = document.getElementById('erreurMessage');

formConnexion.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const motDePasse = motDePasseInput.value.trim();

    // Vider le message d'erreur
    erreurMessage.style.display = 'none';
    erreurMessage.textContent = '';

    // Désactiver le bouton pendant la requête
    btnConnexion.textContent = 'Connexion en cours...';
    btnConnexion.disabled = true;

    try {
        const response = await fetch(`${API_URL}/api/auth/connexion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, motDePasse })
        });

        const data = await response.json();

        if (data.succes) {
            // Sauvegarder le token
            localStorage.setItem('token', data.token);
            localStorage.setItem('utilisateur', JSON.stringify(data.utilisateur));


            // Message de succès
            erreurMessage.style.color = 'green';
            erreurMessage.textContent = 'Connexion réussie !';
            erreurMessage.style.display = 'block';

            // Attendre 1 seconde avant de rediriger
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Rediriger vers le dashboard
            window.location.href = 'daschboard.html';
        } else {
            // Afficher l'erreur
            erreurMessage.textContent = data.message;
            erreurMessage.style.display = 'block';

            btnConnexion.textContent = 'Se connecter';
            btnConnexion.disabled = false;
        }
    } catch (erreur) {
        erreurMessage.textContent = 'Erreur de connexion au serveur. Réessayez.';
        erreurMessage.style.display = 'block';

        btnConnexion.textContent = 'Se connecter';
        btnConnexion.disabled = false;
    }
});


// Afficher/cacher le mot de passe
const togglePassword = document.getElementById('togglePassword');
const motDePasseField = document.getElementById('motDePasse');

togglePassword.addEventListener('click', () => {
    if (motDePasseField.type === 'password') {
        motDePasseField.type = 'text';
        togglePassword.classList.remove('fa-eye');
        togglePassword.classList.add('fa-eye-slash');
    } else {
        motDePasseField.type = 'password';
        togglePassword.classList.remove('fa-eye-slash');
        togglePassword.classList.add('fa-eye');
    }
});

/*

Explication du JavaScript :

e.preventDefault() → empêche le formulaire de recharger la page
fetch() → envoie la requête à votre API backend
localStorage.setItem('token') → sauvegarde le token dans le navigateur pour les prochaines requêtes
localStorage.setItem('utilisateur') → sauvegarde les infos de l'utilisateur pour les afficher dans la sidebar
window.location.href → redirige vers le dashboard si la connexion réussit
btnConnexion.disabled = true → désactive le bouton pendant la requête pour éviter les doubles clics


Explication :

L'icône œil est positionnée à droite de l'input
Au clic, on change le type de password à text pour afficher le mot de passe
L'icône change de fa-eye à fa-eye-slash pour indiquer l'état

*/