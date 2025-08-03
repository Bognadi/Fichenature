document.addEventListener('DOMContentLoaded', function() {

    // --- Constantes et Variables ---
    const ficheListContainer = document.getElementById('fiche-list');
    const contentArea = document.querySelector('.content');
    const allFicheArticles = document.querySelectorAll('article.fiche-content');
    const PROGRESS_STORAGE_KEY = 'fichesLectureProgress_v2';

    // --- 1. Initialisation ---
    
    // Génère la liste de navigation à partir des articles HTML
    function generateNav() {
        allFicheArticles.forEach(article => {
            if (article.id === 'welcome') return; // Ne pas inclure la page d'accueil dans la liste

            const ficheId = article.id;
            const title = article.querySelector('h2').textContent;
            
            const listItem = document.createElement('li');
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `check-${ficheId}`;
            checkbox.dataset.ficheId = ficheId;
            
            const link = document.createElement('a');
            link.href = `#${ficheId}`;
            link.textContent = title;
            link.dataset.ficheId = ficheId;

            listItem.appendChild(checkbox);
            listItem.appendChild(link);
            ficheListContainer.appendChild(listItem);
        });
    }

    // --- 2. Fonctions Principales ---

    // Affiche une fiche spécifique et met à jour l'URL
    function showFiche(ficheId) {
        // Cacher toutes les fiches
        allFicheArticles.forEach(article => {
            article.style.display = 'none';
        });
        
        // Afficher la fiche sélectionnée
        const activeArticle = document.getElementById(ficheId);
        if (activeArticle) {
            activeArticle.style.display = 'block';
            contentArea.scrollTop = 0; // Remonter en haut du contenu
        }
        
        // Mettre à jour la classe 'active' pour le lien de navigation
        document.querySelectorAll('#fiche-list a').forEach(link => {
            link.classList.toggle('active', link.dataset.ficheId === ficheId);
        });

        // Mettre à jour l'URL sans recharger la page
        history.pushState(null, '', `#${ficheId}`);
    }

    // Sauvegarde la progression (cases cochées) dans le localStorage
    function saveProgress() {
        const progress = {};
        document.querySelectorAll('#fiche-list input[type="checkbox"]').forEach(box => {
            progress[box.dataset.ficheId] = box.checked;
        });
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    }

    // Charge la progression depuis le localStorage
    function loadProgress() {
        const savedProgress = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY));
        if (savedProgress) {
            document.querySelectorAll('#fiche-list input[type="checkbox"]').forEach(box => {
                if (savedProgress[box.dataset.ficheId]) {
                    box.checked = true;
                }
            });
        }
    }

    // Gère la navigation initiale basée sur l'URL
    function handleInitialLoad() {
        const initialFicheId = window.location.hash.substring(1);
        if (document.getElementById(initialFicheId)) {
            showFiche(initialFicheId);
        } else {
            showFiche('welcome');
        }
    }

    // --- 3. Écouteurs d'Événements ---

    // Clics sur la liste de navigation
    ficheListContainer.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const ficheId = e.target.dataset.ficheId;
            showFiche(ficheId);
        }
    });
    
    // Changements sur les cases à cocher
    ficheListContainer.addEventListener('change', function(e) {
        if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
            saveProgress();
        }
    });

    // Gère les boutons précédent/suivant du navigateur
    window.addEventListener('popstate', handleInitialLoad);

    // --- 4. Exécution ---
    generateNav();
    loadProgress();
    handleInitialLoad();
});
