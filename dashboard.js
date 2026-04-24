const API_URL = 'https://red-product-backend-z5lx.onrender.com';

// Vérifier que l'utilisateur est connecté
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'index.html';
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

// Déconnexion
const btnDeconnexion = document.querySelector('.fa-arrow-right-from-bracket');
if (btnDeconnexion) {
    btnDeconnexion.closest('a').addEventListener('click', async (e) => {
        e.preventDefault();
        
        await fetch(`${API_URL}/api/auth/deconnexion`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        localStorage.removeItem('token');
        localStorage.removeItem('utilisateur');
        window.location.href = 'index.html';
    });
}

/*
Explication :

Vérification du token → si l'utilisateur n'est pas connecté, il est redirigé vers la page de connexion
Nom de l'utilisateur → on affiche le vrai nom depuis localStorage dans la sidebar
chargerKPIs() → appelle l'API et remplace les -- par les vrais chiffres
Déconnexion → vide le localStorage et redirige vers la connexion

*/