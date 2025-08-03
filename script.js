document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    let fichesData = [];
    let categories = [];

    function fetchFiches() {
        return fetch('src/fiches.json')
            .then(res => res.json())
            .then(data => data.fiches || []);
    }

    function getCategories(fiches) {
        const cats = {};
        fiches.forEach(fiche => {
            if (!cats[fiche.groupe]) cats[fiche.groupe] = [];
            cats[fiche.groupe].push(fiche);
        });
        return cats;
    }

    function renderHome() {
        app.innerHTML = `
            <section class="home">
                <h1>Expériences de la Nature</h1>
                <p class="subtitle">Fiches de lecture – Programme 2025-2026</p>
                <div class="categories">
                    ${Object.keys(categories).map(cat =>
                        `<button class="category-btn" data-category="${cat}">${cat}</button>`
                    ).join('')}
                </div>
            </section>
        `;
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.onclick = () => renderCategory(btn.dataset.category);
        });
        history.replaceState({view: 'home'}, '', '#home');
    }

    function renderCategory(category) {
        const fiches = categories[category];
        app.innerHTML = `
            <section class="category">
                <button class="back-btn">&larr; Retour</button>
                <h2>${category}</h2>
                <div class="fiche-list">
                    ${fiches.map(fiche =>
                        `<div class="fiche-card" data-fiche="${fiche.fiche_numero}">
                            <h3>${fiche.titre}</h3>
                            <p>${fiche.contenu.slice(0, 120)}...</p>
                        </div>`
                    ).join('')}
                </div>
            </section>
        `;
        document.querySelector('.back-btn').onclick = renderHome;
        document.querySelectorAll('.fiche-card').forEach(card => {
            card.onclick = () => renderFiche(category, card.dataset.fiche);
        });
        history.pushState({view: 'category', category}, '', `#category-${encodeURIComponent(category)}`);
    }

    function renderFiche(category, ficheNum) {
        const fiche = categories[category].find(f => f.fiche_numero == ficheNum);
        app.innerHTML = `
            <section class="fiche-detail">
                <button class="back-btn">&larr; Retour</button>
                <h2>${fiche.titre}</h2>
                <p class="fiche-group">${fiche.groupe}</p>
                <div class="fiche-content">${fiche.contenu.replace(/\n/g, '<br>')}</div>
            </section>
        `;
        document.querySelector('.back-btn').onclick = () => renderCategory(category);
        history.pushState({view: 'fiche', category, ficheNum}, '', `#fiche-${ficheNum}`);
    }

    // SPA navigation on browser back/forward
    window.onpopstate = (e) => {
        if (!e.state || e.state.view === 'home') renderHome();
        else if (e.state.view === 'category') renderCategory(e.state.category);
        else if (e.state.view === 'fiche') renderFiche(e.state.category, e.state.ficheNum);
    };

    // Initial load
    fetchFiches().then(fiches => {
        fichesData = fiches;
        categories = getCategories(fiches);
        renderHome();
    });
});
