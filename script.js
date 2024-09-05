// Attendre que la page soit complètement chargée avant d'exécuter le code
document.addEventListener("DOMContentLoaded", function () {
    // --- Initialisation du canevas pour la galaxie ---
    const canvas = document.getElementById('galaxyCanvas');
    const ctx = canvas.getContext('2d');

    // Ajuster la taille du canevas au chargement de la page et lors du redimensionnement de la fenêtre
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // --- Initialisation des éléments du menu ---
    const menuToggle = document.getElementById('menu-toggle'); // Bouton pour ouvrir/fermer le menu
    const menuContent = document.querySelector('.menu-content'); // Contenu du menu
    const astronautIcon = document.querySelector('.astronaut .icon'); // Icône d'astronaute (pour petits écrans)
    const authButton = document.querySelector('.auth-button'); // Bouton d'authentification (pour grands écrans)

    // --- Initialisation du lecteur vidéo ---
    const video = document.getElementById("myVideo");
    video.playbackRate = 0.6; // Réduire la vitesse de lecture de la vidéo

    // --- Initialisation des données des planètes ---
    const planetContainer = document.querySelector('.planet-container');
    const planetData = [
        { name: 'About', summary: "Résumé d'About", details: "Détails d'About...", imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbVgb6o-fT2QCo5xC6L5GFue1sPr9ueQHbxw&s' },
        { name: 'Skills', summary: "Résumé de Skills", details: "Détails de Skills...", imageUrl: 'https://3dvf.com/wp-content/uploads/2019/10/lroc_color_poles_2k.jpg' },
        { name: 'Work', summary: "Résumé de Work", details: "Détails de Work...", imageUrl: 'https://stevealbers.net/albers/sos/jupiter/io/io_rgb_cyl_thumb.jpg' },
        { name: 'LinkedIn', summary: "Résumé de LinkedIn", details: "LinkedIn...", imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXPDFPjtsLJ2bSPDuBldjVUQlu3JkOBRbxng&s', redirect: "https://www.linkedin.com" },
        { name: 'Hobby', summary: "Résumé de Hobby", details: "Détails de Hobby...", imageUrl: 'https://stevealbers.net/albers/sos/jupiter/europa/europa2_thumb.jpg' },
        { name: 'Contact', summary: "Résumé de Contact", details: "Détails de Contact...", imageUrl: 'https://stevealbers.net/albers/sos/saturn/tethys/tethys_rgb_cyl_thumb.jpg' },
    ];

    // Créer chaque planète dans le conteneur
    planetData.forEach(data => createPlanet(data));

    // --- Ajout des événements de redimensionnement et d'affichage ---
    window.addEventListener('resize', adjustDisplay); // Ajuster l'affichage lorsque la fenêtre est redimensionnée
    menuToggle.addEventListener('click', toggleMenu); // Basculer l'affichage du menu lors d'un clic
    document.querySelector('.close-button').addEventListener('click', closeModal); // Fermer la modale lors du clic sur le bouton de fermeture
    document.addEventListener('click', function (event) {
        if (event.target === document.getElementById('modal')) {
            closeModal(); // Fermer la modale si on clique en dehors de celle-ci
        }
    });

    // Ajuster l'affichage des éléments (icône d'astronaute et bouton d'authentification) au chargement initial
    adjustDisplay();

    // --- Fonctions ---

    // Fonction pour redimensionner le canevas en fonction de la taille de la fenêtre
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        drawGalaxy(); // Redessiner la galaxie après redimensionnement
    }

    // Fonction pour dessiner une galaxie avec des étoiles aléatoires
    function drawGalaxy() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Effacer le contenu actuel du canevas
        const numStars = 1000; // Nombre d'étoiles à dessiner
        for (let i = 0; i < numStars; i++) {
            const x = Math.random() * canvas.width; // Position aléatoire en x
            const y = Math.random() * canvas.height; // Position aléatoire en y
            const starSize = Math.random() * 1.5; // Taille aléatoire de l'étoile
            ctx.beginPath();
            ctx.arc(x, y, starSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random()})`; // Couleur aléatoire avec transparence
            ctx.fill();
        }
    }

    // Fonction pour ajuster l'affichage des éléments en fonction de la largeur de l'écran
    function adjustDisplay() {
        if (window.innerWidth >= 768) {
            astronautIcon.style.display = 'none'; // Masquer l'icône d'astronaute sur les grands écrans
            authButton.style.display = 'inline-block'; // Afficher le bouton d'authentification
        } else {
            astronautIcon.style.display = 'inline-block'; // Afficher l'icône d'astronaute sur les petits écrans
            authButton.style.display = 'none'; // Masquer le bouton d'authentification
        }
    }

    // Fonction pour basculer l'affichage du menu
    function toggleMenu() {
        menuContent.style.display = menuContent.style.display === 'block' ? 'none' : 'block';
    }

    // Fonction pour créer et positionner une planète dans le conteneur
    function createPlanet(data) {
        const planet = document.createElement('div');
        planet.className = 'planet'; // Appliquer la classe CSS "planet"
        planet.innerText = data.name; // Nom de la planète

        // Obtenir la taille du texte pour ajuster la taille de la planète
        const textSize = getTextSize(data.name);
        let size = Math.max(textSize.width, textSize.height) + 20;
        let position = getPlanetPosition(size); // Positionner la planète de manière aléatoire sans chevauchement

        // Appliquer la taille et la position à la planète
        planet.style.width = `${size}px`;
        planet.style.height = `${size}px`;
        planet.style.top = `${position.top}px`;
        planet.style.left = `${position.left}px`;
        planet.style.transform = `translate(-50%, -50%)`; // Centrer la planète
        planet.style.background = `url(${data.imageUrl}) 0/auto 100%`; // Définir l'image d'arrière-plan
        planet.style.backgroundSize = 'cover'; // Assurer que l'image couvre le conteneur
        planetContainer.appendChild(planet); // Ajouter la planète au conteneur

        // Gérer le clic sur une planète
        planet.addEventListener('click', function (event) {
            event.stopPropagation(); // Empêcher la propagation du clic
            document.querySelectorAll('.planet').forEach(p => p.classList.remove('selected')); // Désélectionner les autres planètes
            planet.classList.add('selected'); // Sélectionner la planète actuelle

            if (data.redirect) {
                window.open(data.redirect, '_blank'); // Rediriger si c'est LinkedIn
            } else {
                openModal(data, planet); // Ouvrir la modale pour les autres planètes
            }
        });
    }

    // Fonction pour mesurer la taille du texte (largeur et hauteur)
    function getTextSize(text) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = 'bold 18px Courier'; // Police utilisée pour mesurer
        const metrics = context.measureText(text);
        return { width: metrics.width, height: 18 }; // Retourner les dimensions du texte
    }

    // Fonction pour obtenir une position aléatoire pour une planète sans chevauchement
    function getPlanetPosition(size) {
        let top, left, overlaps = true, attempts = 0;
        const maxAttempts = 1000; // Limiter le nombre d'essais pour éviter des boucles infinies

        while (overlaps && attempts < maxAttempts) {
            overlaps = false;
            attempts++;
            top = Math.random() * (planetContainer.clientHeight - size); // Position aléatoire en haut
            left = Math.random() * (planetContainer.clientWidth - size); // Position aléatoire à gauche
            top = Math.max(top, size / 2); // S'assurer que la planète ne dépasse pas le bord supérieur
            left = Math.max(left, size / 2); // S'assurer que la planète ne dépasse pas le bord gauche

            // Vérifier le chevauchement avec d'autres planètes
            for (const otherPlanet of planetContainer.children) {
                const otherRect = otherPlanet.getBoundingClientRect();
                const newRect = {
                    top: planetContainer.getBoundingClientRect().top + top,
                    left: planetContainer.getBoundingClientRect().left + left,
                    width: size,
                    height: size,
                };
                if (!(
                    newRect.left + newRect.width < otherRect.left ||
                    newRect.left > otherRect.left + otherRect.width ||
                    newRect.top + newRect.height < otherRect.top ||
                    newRect.top > otherRect.top + otherRect.height
                )) {
                    overlaps = true; // Chevauchement détecté, recommencer la position
                    break;
                }
            }
        }
        return { top, left }; // Retourner la position calculée
    }

    // Fonction pour ouvrir la modale avec les informations de la planète
    function openModal(data, planet) {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        const expandLink = document.getElementById('expand-link');

        modalTitle.textContent = data.name; // Afficher le nom de la planète
        modalDescription.textContent = data.summary; // Afficher le résumé de la planète
        expandLink.style.display = data.details ? 'block' : 'none'; // Afficher ou masquer le lien "Expand" selon s'il y a des détails

        // Gérer le clic sur "Expand" pour afficher plus de détails
        expandLink.onclick = function (event) {
            event.preventDefault();
            modalDescription.textContent = data.details; // Afficher les détails complets
            modal.style.width = '80%'; // Agrandir la modale
            adjustModalPosition(modal, planet); // Ajuster la position de la modale
        };

        adjustModalPosition(modal, planet); // Ajuster la position initiale de la modale
        modal.style.display = 'block'; // Afficher la modale
    }

    // Fonction pour ajuster la position de la modale par rapport à la planète cliquée
    function adjustModalPosition(modal, planet) {
        const planetRect = planet.getBoundingClientRect();
        const containerRect = planetContainer.getBoundingClientRect();
        const modalRect = modal.getBoundingClientRect();
        const mainRect = document.querySelector('main').getBoundingClientRect();

        // Calculer la position en fonction de la planète cliquée
        let top = planetRect.bottom + window.scrollY;
        let left = planetRect.left - containerRect.left + window.scrollX;
        left = planetRect.left - containerRect.left + (planetRect.width / 2) - (modalRect.width / 2);

        // Ajuster si la modale dépasse la largeur ou hauteur de l'écran
        if (left + modalRect.width > containerRect.width + containerRect.left) {
            left = containerRect.width + containerRect.left - modalRect.width;
        }
        if (top + modalRect.height > mainRect.bottom + window.scrollY) {
            top = planetRect.top + window.scrollY - modalRect.height - 10;
        }
        if (top < containerRect.top + window.scrollY) {
            top = containerRect.top + window.scrollY + 10;
        }
        modal.style.top = `${top}px`; // Appliquer la nouvelle position verticale
        modal.style.left = `${left}px`; // Appliquer la nouvelle position horizontale
    }

    // Fonction pour ouvrir et fermer la modale
    function openModal() {
        document.querySelector('.modal').style.display = 'block';
        document.body.classList.add('no-scroll');
    }

    function closeModal() {
        document.querySelector('.modal').style.display = 'none';
        document.body.classList.remove('no-scroll');
    }
});