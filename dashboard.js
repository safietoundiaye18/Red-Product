// Vérifier le token à chaque chargement
const token = localStorage.getItem('token');
if (!token) {
    window.location.replace('index.html');
}

// Empêcher retour arrière
history.pushState(null, null, location.href);
window.addEventListener('popstate', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        history.pushState(null, null, location.href);
        window.location.replace('index.html');
    }
});

const API_URL = 'https://red-product-backend-z5lx.onrender.com';


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

// Afficher le nom de l'utilisateur dans la sidebar
const utilisateur = JSON.parse(localStorage.getItem('utilisateur'));
if (utilisateur) {
    const nomElement = document.querySelector('.lineheight p:first-child');
    if (nomElement) {
        nomElement.textContent = utilisateur.nom;
    }
}

// Récupérer les KPI
async function chargerKPIs() {
    try {
        const response = await fetch(`${API_URL}/api/dashboard/kpis`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (data.succes) {
            document.getElementById('kpi-users').textContent = data.kpis.users;
            document.getElementById('kpi-hotels').textContent = data.kpis.hotels;
            document.getElementById('kpi-messages').textContent = data.kpis.messages;
            document.getElementById('kpi-emails').textContent = data.kpis.emails;
            document.getElementById('kpi-entites').textContent = data.kpis.entites;
            document.getElementById('kpi-formulaires').textContent = data.kpis.formulaires;
        }
    } catch (erreur) {
        console.error('Erreur chargement KPI :', erreur);
    }
}

chargerKPIs();

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

/*
Explication :

Vérification du token → si l'utilisateur n'est pas connecté, il est redirigé vers la page de connexion
Nom de l'utilisateur → on affiche le vrai nom depuis localStorage dans la sidebar
chargerKPIs() → appelle l'API et remplace les -- par les vrais chiffres
Déconnexion → vide le localStorage et redirige vers la connexion

*/