// Ajout d'un écouteur d'événement pour s'assurer que le code s'exécute après le chargement complet de la page
document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById('galaxyCanvas');
    const ctx = canvas.getContext('2d');

    // Fonction pour ajuster la taille du canevas en fonction de la taille de l'écran
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        drawGalaxy();
    }

    // Fonction pour dessiner la galaxie avec des étoiles aléatoires
    function drawGalaxy() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const numStars = 1000; // Nombre d'étoiles à dessiner

        for (let i = 0; i < numStars; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const starSize = Math.random() * 1.5;

            ctx.beginPath();
            ctx.arc(x, y, starSize, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, ' + Math.random() + ')';
            ctx.fill();
        }
    }

    // Ajoute un écouteur d'événement pour redimensionner le canevas lorsque la fenêtre est redimensionnée
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const menuToggle = document.getElementById('menu-toggle');
    const menuContent = document.querySelector('.menu-content');

    // Ajoute un écouteur d'événement pour basculer l'affichage du menu
    menuToggle.addEventListener('click', () => {
        menuContent.style.display = menuContent.style.display === 'block' ? 'none' : 'block';
    });

    const planetContainer = document.querySelector('.planet-container');
    // Tableau d'objets contenant des données sur chaque planète
    const planetData = [
        { name: 'About', color: ['#b6b6b6', '#8e8e8e'], summary: "Résumé d'About", details: "Détails d'About : Cette planète est fascinante car..." },
        { name: 'Skills', color: ['#f5b742', '#d4a40d'], summary: "Résumé de Skills", details: "Détails de Skills : Cette planète représente..." },
        { name: 'Work', color: ['#2b4d2e', '#1e3d1b'], summary: "Résumé de Work", details: "Détails de Work : Le travail ici est..." },
        { name: 'LinkedIn', color: ['#d75050', '#a14040'], summary: "Résumé de LinkedIn", details: "Détails de LinkedIn : LinkedIn est la planète où...", redirect: "https://www.linkedin.com/in/adrien-patuzzo-b7180a194/" },
        { name: 'Hobby', color: ['#f0b430', '#d7a716'], summary: "Résumé de Hobby", details: "Détails de Hobby : Les hobbies sur cette planète..." },
        { name: 'Contact', color: ['#c1b600', '#9a8e00'], summary: "Résumé de Contact", details: "Détails de Contact : Pour nous contacter..." },
        { name: 'Languages', color: ['#7c9ab3', '#5d7085'], summary: "En cours de développement", details: "Cette planète est encore en développement." }
    ];

    // Fonction pour créer et placer une planète dans le conteneur
    function createPlanet(data) {
        const planet = document.createElement('div');
        planet.className = 'planet';
        planet.style.background = `radial-gradient(circle, ${data.color[0]}, ${data.color[1]})`;
        planet.innerText = data.name;

        const textSize = getTextSize(data.name);
        let size = Math.max(textSize.width, textSize.height) + 20;
        let top, left;
        let overlaps = true;

        let maxAttempts = 1000;
        let attempts = 0;

        // Essaye de positionner la planète sans chevauchement
        while (overlaps && attempts < maxAttempts) {
            overlaps = false;
            attempts++;

            // Calcule des positions aléatoires
            top = Math.random() * (planetContainer.clientHeight - size);
            left = Math.random() * (planetContainer.clientWidth - size);

            // Assure que la planète ne soit pas partiellement en dehors des bords
            top = Math.max(top, size / 2);
            left = Math.max(left, size / 2);

            // Vérifie le chevauchement avec d'autres planètes
            for (const otherPlanet of planetContainer.children) {
                const otherRect = otherPlanet.getBoundingClientRect();
                const newRect = {
                    top: planetContainer.getBoundingClientRect().top + top,
                    left: planetContainer.getBoundingClientRect().left + left,
                    width: size,
                    height: size
                };

                // Vérifie si les rectangles se chevauchent
                if (
                    !(newRect.left + newRect.width < otherRect.left ||
                        newRect.left > otherRect.left + otherRect.width ||
                        newRect.top + newRect.height < otherRect.top ||
                        newRect.top > otherRect.top + otherRect.height)
                ) {
                    overlaps = true;
                    break;
                }
            }
        }

        // Vérifie si le nombre maximum de tentatives est atteint
        if (attempts >= maxAttempts) {
            console.warn('Planet position could not be determined without overlap. Aborting.');
            return;
        }

        // Définit les dimensions et la position de la planète 
        planet.style.width = `${size}px`;
        planet.style.height = `${size}px`;
        planet.style.top = `${top}px`;
        planet.style.left = `${left}px`;
        planet.style.transform = `translate(-50%, -50%)`;
        planetContainer.appendChild(planet);

        // Ajoute un événement de clic pour chaque planète
        planet.addEventListener('click', function (event) {
            event.stopPropagation();
            document.querySelectorAll('.planet').forEach(p => {
                if (p !== planet) {
                    p.classList.remove('selected');
                }
            });
            planet.classList.add('selected');

            if (data.redirect) {
                window.location.href = data.redirect; // Redirige directement pour LinkedIn
            } else {
                openModal(data, planet);
            }
        });
    }

    // Fonction pour mesurer la taille du texte afin d'ajuster la taille de la planète
    function getTextSize(text) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = 'bold 16px Arial';
        const metrics = context.measureText(text);
        return {
            width: metrics.width,
            height: 16
        };
    }

    // Fonction pour ouvrir une modale avec les informations de la planète
    function openModal(data, planet) {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        const expandLink = document.getElementById('expand-link');

        modalTitle.textContent = data.name;
        modalDescription.textContent = data.summary;

        // Affiche le lien pour étendre la description seulement s'il y a des détails supplémentaires
        expandLink.style.display = data.details ? 'block' : 'none'; // Afficher le lien seulement s'il y a des détails

        // Ajoute un événement de clic pour le lien d'expansion
        expandLink.onclick = function (event) {
            event.preventDefault();
            modalDescription.textContent = data.details; // Afficher les détails complets
            modal.style.width = '80%'; // Agrandir la modale pour montrer plus de détails
            adjustModalPosition(modal, planet);
        };

        // Positionner la modale sous la planète cliquée
        adjustModalPosition(modal, planet);

        modal.style.display = 'block';
    }

    // Fonction pour ajuster la position de la modale sur l'écran
    function adjustModalPosition(modal, planet) {
        const planetRect = planet.getBoundingClientRect();
        const containerRect = planetContainer.getBoundingClientRect();
        const modalRect = modal.getBoundingClientRect();
        const mainRect = document.querySelector('main').getBoundingClientRect();

        // Calcule la position de la modale par rapport à la planète cliquée 
        let top = planetRect.bottom + window.scrollY;
        let left = planetRect.left - containerRect.left + window.scrollX;

        // Centre la modale horizontalement par rapport à la planète
        left = planetRect.left - containerRect.left + (planetRect.width / 2) - (modalRect.width / 2);

        // Ajuster si la modale dépasse la bordure droite du conteneur
        if (left + modalRect.width > containerRect.width + containerRect.left) {
            left = containerRect.width + containerRect.left - modalRect.width;
        }

        // Ajuste la position si la modale dépasse la bordure inférieure de l'élément principal
        if (top + modalRect.height > mainRect.bottom + window.scrollY) {
            top = planetRect.top + window.scrollY - modalRect.height - 10; // Position au-dessus de la planète
        }

        // S'assurer que la modale ne dépasse pas le bord supérieur du conteneur
        if (top < containerRect.top + window.scrollY) {
            top = containerRect.top + window.scrollY + 10; // Position légèrement en dessous du bord supérieur
        }

        // Applique la position calculée à la modale
        modal.style.top = `${top}px`;
        modal.style.left = `${left}px`;
    }

    // Fonction pour fermer la modale
    function closeModal() {
        const modal = document.getElementById('modal');
        modal.style.display = 'none';
        modal.style.width = '40%'; // Réinitialiser la largeur de la modale après fermeture
    }

    // Ajouter un écouteur d'événement pour le bouton de fermeture de la modale
    document.querySelector('.close-button').addEventListener('click', closeModal);
    // Fermer la modale lorsqu'on clique en dehors de celle-ci
    document.addEventListener('click', function (event) {
        if (event.target === document.getElementById('modal')) {
            closeModal();
        }
    });

    // Créer chaque planète à partir des données fournies
    planetData.forEach(data => createPlanet(data));

    // Désélectionner les planètes si on clique en dehors
    document.addEventListener('click', function (event) {
        if (!event.target.classList.contains('planet')) {
            document.querySelectorAll('.planet').forEach(planet => {
                planet.classList.remove('selected');
            });
        }
    });
});