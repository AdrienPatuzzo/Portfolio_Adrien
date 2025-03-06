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
        { name: 'About', summary: "Adrien, 33 ans et originaire d'Arras. Anciennement sur un parcours Dev wordpress, je me spécialise actuellemet dans une formation développeur web et web mobile...", details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vehicula non ipsum et lobortis. Morbi feugiat ac velit nec dignissim. Nam a congue tellus, sed facilisis lectus. Phasellus ac malesuada orci. Nunc eu ex nec leo elementum sagittis at at velit. Curabitur ullamcorper ligula magna, quis facilisis dolor euismod ultricies. Pellentesque scelerisque pretium turpis. Ut nec condimentum nunc. Vivamus eros metus, pharetra ac efficitur at, placerat vel neque. Cras aliquam est eu ante mattis, non fringilla sapien porttitor. Nam lorem enim, ornare a elit sed, fringilla vulputate lectus. Duis vel gravida magna. Vestibulum scelerisque justo id tortor pellentesque dictum. Nunc dignissim ornare cursus. Maecenas eget turpis at purus consectetur dapibus.", imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbVgb6o-fT2QCo5xC6L5GFue1sPr9ueQHbxw&s' },
        { name: 'Skills', summary: "Grace a mon éxpérience riche en diversité, j'ai acquis au court du temps des compétences variés tel que la gestion de programmes, de fichier, de compte ou encore d'analyste de données...", details: "In nunc dolor, pharetra a urna ut, lacinia sollicitudin tortor. Nam magna nibh, suscipit at dui vitae, iaculis tempus massa. Cras at diam interdum, faucibus dui nec, venenatis orci. Sed felis tortor, sollicitudin sit amet ipsum vel, maximus rutrum erat. Proin sed eros semper, placerat quam at, finibus ex. Phasellus venenatis arcu et urna consequat malesuada. Curabitur condimentum massa eget urna pretium, ut sagittis ligula auctor. Nam ante erat, varius in magna sed, tristique auctor mi. Vivamus porttitor fermentum scelerisque. Curabitur turpis odio, rhoncus a est ut, convallis gravida arcu. Praesent volutpat orci non mauris ultricies, at porttitor arcu vehicula.", imageUrl: 'https://3dvf.com/wp-content/uploads/2019/10/lroc_color_poles_2k.jpg' },
        { name: 'Work', summary: "Durant mon parcours j'ai exercé dans plusieurs activés tel que le monde bancaire, la logistique en passant part aide-soignant ou encore assistant formateur numérique...", details: "Duis sed quam sit amet diam gravida sagittis id sed tellus. Etiam eu nulla vel urna lobortis ultrices. Cras eu ligula ac erat dignissim feugiat nec ac ligula. Nunc mattis sem id eros cursus suscipit. Aliquam et vestibulum nulla. Aenean sed pulvinar felis. Donec a imperdiet risus, a ullamcorper leo. Sed lacus arcu, luctus quis ullamcorper nec, molestie vitae arcu. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nullam lorem velit, tempor nec mauris nec, consectetur pellentesque lorem. Nullam ultricies ante id quam mollis facilisis. Proin et fermentum erat.", imageUrl: 'https://stevealbers.net/albers/sos/jupiter/io/io_rgb_cyl_thumb.jpg' },
        { name: 'LinkedIn', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXPDFPjtsLJ2bSPDuBldjVUQlu3JkOBRbxng&s', redirect: "https://www.linkedin.com/" },
        { name: 'Hobby', summary: "Passionné d'informatique, mais aussi de sport, de musique et de lecture...", details: "Maecenas ut rhoncus lorem. Curabitur imperdiet commodo leo eu volutpat. Fusce tellus leo, viverra at sem vitae, vehicula mollis elit. Fusce non est non elit maximus lacinia ut sit amet elit. Cras ornare risus ut lorem tristique dapibus. Mauris egestas orci a nisl aliquam blandit. Phasellus rhoncus risus vel tristique pretium. Aliquam erat volutpat. Aenean feugiat diam ultricies dolor elementum consectetur. Donec ut interdum nunc. Pellentesque non dapibus nibh, sed sagittis libero. Sed fringilla, eros et iaculis tincidunt, turpis libero bibendum justo, quis egestas nisl velit et quam. Morbi luctus turpis quis mauris cursus, quis convallis urna pretium.", imageUrl: 'https://stevealbers.net/albers/sos/jupiter/europa/europa2_thumb.jpg' },
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

    // Créer toutes les planètes
    planetData.forEach((data, index) => {
        createPlanet(data, index);
    });

    // Définir la fonction showContactForm avant de l'utiliser
    function showContactForm() {
        const contactSection = document.querySelector('.contact-section');
        if (contactSection) {
            contactSection.style.display = 'flex';
            // Forcer un reflow
            contactSection.offsetHeight;
            contactSection.classList.add('active');

            // Gérer la fermeture
            const closeButton = contactSection.querySelector('.close-contact');
            if (closeButton) {
                closeButton.onclick = closeContactForm;
            }

            // Fermer en cliquant en dehors
            contactSection.onclick = function(e) {
                if (e.target === contactSection) {
                    closeContactForm();
                }
            };
        }
    }

    // Gérer le clic sur le lien Contact dans le menu
    const contactLinks = document.querySelectorAll('a[href="#contact"]');
    contactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showContactForm();
            if (menuContent.style.display === 'block') {
                toggleMenu();
            }
        });
    });

    // Fonction pour créer et positionner une planète dans le conteneur
    function createPlanet(data, index) {
        const planet = document.createElement('div');
        planet.className = 'planet';
        planet.innerText = data.name;

        const textSize = getTextSize(data.name);
        let size = Math.max(textSize.width, textSize.height) + 20;
        let position = fixedPositions[index];

        planet.style.width = `${size}px`;
        planet.style.height = `${size}px`;
        planet.style.top = `${position.top}%`;
        planet.style.left = `${position.left}%`;
        planet.style.transform = `translate(-50%, -50%)`;
        planet.style.background = `url(${data.imageUrl}) 0/auto 100%`;
        planet.style.backgroundSize = 'cover';
        planetContainer.appendChild(planet);

        planet.addEventListener('click', function (event) {
            event.stopPropagation();
            document.querySelectorAll('.planet').forEach(p => p.classList.remove('selected'));
            planet.classList.add('selected');

            if (data.name === 'Contact') {
                showContactForm();
            } else if (data.redirect) {
                window.open(data.redirect, '_blank');
            } else {
                openModal(data, planet);
            }
        });
    }

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

        modalTitle.textContent = data.name;
        modalDescription.textContent = data.summary;
        modalDescription.dataset.summary = data.summary;
        modalDescription.dataset.details = data.details;
        
        expandLink.textContent = 'Voir plus de détails';
        expandLink.style.display = 'inline-block';
        
        modal.style.display = 'flex';

        // Gestion du clic sur "Voir plus"
        expandLink.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (modalDescription.textContent === data.summary) {
                modalDescription.textContent = data.details;
                expandLink.textContent = 'Voir moins';
            } else {
                modalDescription.textContent = data.summary;
                expandLink.textContent = 'Voir plus de détails';
            }
        };
    }

    // Gestionnaire d'événements pour la fermeture
    document.addEventListener('DOMContentLoaded', function() {
        const modal = document.getElementById('modal');
        
        // Fermeture au clic sur le bouton
        document.querySelector('.close-button').addEventListener('click', closeModal);

        // Fermeture au clic en dehors
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Empêcher la propagation des clics dans la modale
        modal.querySelector('div').addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });

    // Fonction pour fermer la modale
    function closeModal() {
        const modal = document.getElementById('modal');
        modal.style.display = 'none';
        
        // Réinitialiser le contenu
        const modalDescription = document.getElementById('modal-description');
        const expandLink = document.getElementById('expand-link');
        
        if (modalDescription.dataset.summary) {
            modalDescription.textContent = modalDescription.dataset.summary;
        }
        expandLink.textContent = 'Voir plus de détails';
        
        // Désélectionner toutes les planètes
        document.querySelectorAll('.planet').forEach(planet => {
            planet.classList.remove('selected');
        });
    }

    function closeContactForm() {
        const contactSection = document.querySelector('.contact-section');
        if (contactSection) {
            contactSection.classList.remove('active');
            // Attendre la fin de l'animation avant de cacher complètement
            setTimeout(() => {
                contactSection.style.display = 'none';
            }, 300);
        }
    }

    // Ajouter un écouteur de clic sur le document
    document.addEventListener('click', function(event) {
        // Vérifier si le clic n'est pas sur une planète
        if (!event.target.closest('.planet')) {
            // Désélectionner toutes les planètes
            document.querySelectorAll('.planet').forEach(planet => {
                planet.classList.remove('selected');
            });
        }
    });

    // Ajouter un gestionnaire pour les clics en dehors de la modale
    document.addEventListener('click', function(event) {
        const modal = document.getElementById('modal');
        if (event.target === modal) {
            closeModal();
        }
    });
});