document.addEventListener('DOMContentLoaded', function() {

    // --- Constantes et Variables ---
    const ficheListContainer = document.getElementById('fiche-list');
    const contentArea = document.querySelector('.content');
    const PROGRESS_STORAGE_KEY = 'fichesLectureProgress_v2';
    let fichesData = [];

    // --- 1. Chargement des fiches depuis le JSON ---
    function fetchFiches() {
        return fetch('src/fiches.json')
            .then(res => res.json())
            .then(data => data.fiches || []);
    }

    // --- 2. Génération dynamique de la navigation et du contenu ---
    function renderFiches(fiches) {
        // Nettoyer la navigation et le contenu (hors accueil)
        ficheListContainer.innerHTML = '';
        document.querySelectorAll('article.fiche-content:not(#welcome)').forEach(a => a.remove());

        fiches.forEach(fiche => {
            // Générer un id unique pour chaque fiche
            const ficheId = fiche.fiche_numero ? `fiche${fiche.fiche_numero}` : `fiche${Math.random().toString(36).slice(2,8)}`;

            // Navigation
            const listItem = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `check-${ficheId}`;
            checkbox.dataset.ficheId = ficheId;
            const link = document.createElement('a');
            link.href = `#${ficheId}`;
            link.textContent = fiche.titre || 'Fiche';
            link.dataset.ficheId = ficheId;
            listItem.appendChild(checkbox);
            listItem.appendChild(link);
            ficheListContainer.appendChild(listItem);

            // Contenu
            const article = document.createElement('article');
            article.id = ficheId;
            article.className = 'fiche-content';
            article.style.display = 'none';
            article.innerHTML = `
                <h2>${fiche.titre || ''}</h2>
                ${fiche.groupe ? `<p><em>${fiche.groupe}</em></p>` : ''}
                <p>${(fiche.contenu || '').replace(/\n/g, '<br>')}</p>
            `;
            contentArea.appendChild(article);
        });
    }

    // --- 3. Fonctions principales ---
    function showFiche(ficheId) {
        document.querySelectorAll('article.fiche-content').forEach(article => {
            article.style.display = 'none';
        });
        const activeArticle = document.getElementById(ficheId);
        if (activeArticle) {
            activeArticle.style.display = 'block';
            contentArea.scrollTop = 0;
        }
        document.querySelectorAll('#fiche-list a').forEach(link => {
            link.classList.toggle('active', link.dataset.ficheId === ficheId);
        });
        history.pushState(null, '', `#${ficheId}`);
    }

    function saveProgress() {
        const progress = {};
        document.querySelectorAll('#fiche-list input[type="checkbox"]').forEach(box => {
            progress[box.dataset.ficheId] = box.checked;
        });
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    }

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

    function handleInitialLoad() {
        const initialFicheId = window.location.hash.substring(1);
        if (document.getElementById(initialFicheId)) {
            showFiche(initialFicheId);
        } else {
            showFiche('welcome');
        }
    }

    // --- 4. Événements ---
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

    // --- 5. Exécution ---
    fetchFiches()
        .then(fiches => {
            fichesData = fiches;
            renderFiches(fiches);
            loadProgress();
            handleInitialLoad();
        });
});
