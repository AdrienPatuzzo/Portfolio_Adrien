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
    const authModal = document.getElementById('auth-modal'); // Modale d'authentification

    // --- Initialisation du lecteur vidéo ---
    const video = document.getElementById("myVideo");
    video.playbackRate = 0.6; // Réduire la vitesse de lecture de la vidéo

    // --- Initialisation des données des planètes ---
    const planetContainer = document.querySelector('.planet-container');
    const planetData = [
        { name: 'About', summary: "Adrien, 33 ans et originaire d'Arras. Anciennement sur un parcours Dev wordpress, je me spécialise actuellemet dans une formation développeur web et web mobile...", details: "Détails d'About...", imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbVgb6o-fT2QCo5xC6L5GFue1sPr9ueQHbxw&s' },
        { name: 'Skills', summary: "Grace a mon éxpérience riche en diversité, j'ai acquis au court du temps des compétences variés tel que la gestion de programmes, de fichier, de compte ou encore d'analyste de données...", details: "Détails de Skills...", imageUrl: 'https://3dvf.com/wp-content/uploads/2019/10/lroc_color_poles_2k.jpg' },
        { name: 'Work', summary: "Durant mon parcours j'ai exercé dans plusieurs activés tel que le monde bancaire, la logistique en passant part aide-soignant ou encore assistant formateur numérique...", details: "Détails de Work...", imageUrl: 'https://stevealbers.net/albers/sos/jupiter/io/io_rgb_cyl_thumb.jpg' },
        { name: 'LinkedIn', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXPDFPjtsLJ2bSPDuBldjVUQlu3JkOBRbxng&s', redirect: "https://www.linkedin.com/" },
        { name: 'Hobby', summary: "Passionné d'informatique, mais aussi de sport, de musique et de lecture...", details: "Détails de Hobby...", imageUrl: 'https://stevealbers.net/albers/sos/jupiter/europa/europa2_thumb.jpg' },
        { name: 'Contact', imageUrl: 'https://stevealbers.net/albers/sos/saturn/tethys/tethys_rgb_cyl_thumb.jpg' },
    ];

    // --- Position fixe pour chaque planète ---
    const fixedPositions = [
        { top: 26, left: 20 },
        { top: 31, left: 65 },
        { top: 40, left: 42 },
        { top: 77, left: 60 },
        { top: 67, left: 25 },
        { top: 50, left: 80 },
    ];

    // Créer chaque planète dans le conteneur avec une position fixe
    planetData.forEach((data, index) => createPlanet(data, index));

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
        function drawStars() {
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
        requestAnimationFrame(drawStars);
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
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }

    // Fonction pour créer et positionner une planète dans le conteneur
    function createPlanet(data, index) {
        const planet = document.createElement('div');
        planet.className = 'planet'; // Appliquer la classe CSS "planet"
        planet.innerText = data.name; // Nom de la planète

        // Obtenir la taille du texte pour ajuster la taille de la planète
        const textSize = getTextSize(data.name);
        let size = Math.max(textSize.width, textSize.height) + 20;
        let position = fixedPositions[index]; // Positionner la planète de manière fixe

        // Appliquer la taille et la position à la planète
        planet.style.width = `${size}px`;
        planet.style.height = `${size}px`;
        planet.style.top = `${position.top}%`;
        planet.style.left = `${position.left}%`;
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

    // Fonction pour ouvrir la modale avec les informations de la planète
    function openModal(data, planet) {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        const expandLink = document.getElementById('expand-link');

        modalTitle.textContent = data.name; // Afficher le nom de la planète
        modalDescription.textContent = data.summary; // Afficher le résumé
        expandLink.textContent = 'Voir plus de détails'; // Lien pour en savoir plus
        expandLink.href = '#'; // Lien à définir si nécessaire

        modal.style.display = 'block'; // Afficher la modale

        expandLink.onclick = function () {
            modalDescription.textContent = data.details; // Remplacer le résumé par les détails complets
            expandLink.style.display = 'none'; // Masquer le lien après clic
        };
    }

    // Fonction pour fermer la modale
    function closeModal() {
        const modal = document.getElementById('modal');
        modal.style.display = 'none'; // Masquer la modale
    }
});