const API_URL = 'https://red-product-backend-z5lx.onrender.com';

const formMotDePasse = document.getElementById('formMotDePasse');
const emailInput = document.getElementById('email');
const btnEnvoyer = document.querySelector('.button');

// Créer le message dynamiquement
const message = document.createElement('p');
message.style.fontSize = '0.85rem';
message.style.display = 'none';
message.style.marginTop = '8px';
document.querySelector('.bg1').appendChild(message);

formMotDePasse.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();

    // Vider le message
    message.style.display = 'none';

    // Désactiver le bouton
    btnEnvoyer.textContent = 'Envoi en cours...';
    btnEnvoyer.disabled = true;

    try {
        
        const response = await fetch(`${API_URL}/api/auth/mot-de-passe-oublie`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });


    setTimeout(() => {
        const data = await response.json();

        if (data.succes) {
            // Message de succès
            message.style.color = 'green';
            message.textContent = '✅ Email envoyé ! Vérifiez votre boîte mail.';
            message.style.display = 'block';

            // Vider le champ email
            emailInput.value = '';

            btnEnvoyer.textContent = 'Envoyé';
            btnEnvoyer.disabled = false;
        } else {
            message.style.color = 'red';
            message.textContent = data.message;
            message.style.display = 'block';

            btnEnvoyer.textContent = 'Envoyer';
            btnEnvoyer.disabled = false;
        }

        }, 3000)
    } catch (erreur) {
        message.style.color = 'red';
        message.textContent = 'Erreur de connexion au serveur. Réessayez.';
        message.style.display = 'block';

        btnEnvoyer.textContent = 'Envoyer';
        btnEnvoyer.disabled = false;
    }
});


/*

Explication :

On crée le message dynamiquement avec document.createElement car votre HTML n'a pas de <p> pour le message
Si l'email existe → message vert "Email envoyé ! Vérifiez votre boîte mail."
Si l'email n'existe pas → message rouge avec l'erreur du backend
Le champ email est vidé après succès
*/