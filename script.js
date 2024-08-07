document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById('galaxyCanvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        drawGalaxy();
    }

    function drawGalaxy() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const numStars = 1000;

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

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const menuToggle = document.getElementById('menu-toggle');
    const menuContent = document.querySelector('.menu-content');

    menuToggle.addEventListener('click', () => {
        menuContent.style.display = menuContent.style.display === 'block' ? 'none' : 'block';
    });

    const planetContainer = document.querySelector('.planet-container');
    const planetData = [
        { name: 'About', color: ['#b6b6b6', '#8e8e8e'], summary: "Résumé d'About", details: "Détails d'About : Cette planète est fascinante car..." },
        { name: 'Skills', color: ['#f5b742', '#d4a40d'], summary: "Résumé de Skills", details: "Détails de Skills : Cette planète représente..." },
        { name: 'Work', color: ['#2b4d2e', '#1e3d1b'], summary: "Résumé de Work", details: "Détails de Work : Le travail ici est..." },
        { name: 'LinkedIn', color: ['#d75050', '#a14040'], summary: "Résumé de LinkedIn", details: "Détails de LinkedIn : LinkedIn est la planète où...", redirect: "https://www.linkedin.com/in/adrien-patuzzo-b7180a194/" },
        { name: 'Hobby', color: ['#f0b430', '#d7a716'], summary: "Résumé de Hobby", details: "Détails de Hobby : Les hobbies sur cette planète..." },
        { name: 'Contact', color: ['#c1b600', '#9a8e00'], summary: "Résumé de Contact", details: "Détails de Contact : Pour nous contacter..." },
        { name: 'Languages', color: ['#7c9ab3', '#5d7085'], summary: "En cours de développement", details: "Cette planète est encore en développement." }
    ];

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

        while (overlaps && attempts < maxAttempts) {
            overlaps = false;
            attempts++;

            top = Math.random() * (planetContainer.clientHeight - size);
            left = Math.random() * (planetContainer.clientWidth - size);

            top = Math.max(top, size / 2);
            left = Math.max(left, size / 2);

            for (const otherPlanet of planetContainer.children) {
                const otherRect = otherPlanet.getBoundingClientRect();
                const newRect = {
                    top: planetContainer.getBoundingClientRect().top + top,
                    left: planetContainer.getBoundingClientRect().left + left,
                    width: size,
                    height: size
                };

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

        if (attempts >= maxAttempts) {
            console.warn('Planet position could not be determined without overlap. Aborting.');
            return;
        }

        planet.style.width = `${size}px`;
        planet.style.height = `${size}px`;
        planet.style.top = `${top}px`;
        planet.style.left = `${left}px`;
        planet.style.transform = `translate(-50%, -50%)`;
        planetContainer.appendChild(planet);

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

    function openModal(data, planet) {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        const expandLink = document.getElementById('expand-link');

        modalTitle.textContent = data.name;
        modalDescription.textContent = data.summary;

        expandLink.style.display = data.details ? 'block' : 'none'; // Afficher le lien seulement s'il y a des détails

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

    function adjustModalPosition(modal, planet) {
        const planetRect = planet.getBoundingClientRect();
        const containerRect = planetContainer.getBoundingClientRect();
        const modalRect = modal.getBoundingClientRect();
        const mainRect = document.querySelector('main').getBoundingClientRect();

        let top = planetRect.bottom + window.scrollY;
        let left = planetRect.left - containerRect.left + window.scrollX;

        // Centrer horizontalement
        left = planetRect.left - containerRect.left + (planetRect.width / 2) - (modalRect.width / 2);

        // Ajuster si la modale dépasse la bordure droite du conteneur
        if (left + modalRect.width > containerRect.width + containerRect.left) {
            left = containerRect.width + containerRect.left - modalRect.width;
        }

        // Ajuster si la modale dépasse la bordure inférieure du conteneur
        if (top + modalRect.height > mainRect.bottom + window.scrollY) {
            top = planetRect.top + window.scrollY - modalRect.height - 10; // Position au-dessus de la planète
        }

        // S'assurer que la modale ne dépasse pas le bord supérieur du conteneur
        if (top < containerRect.top + window.scrollY) {
            top = containerRect.top + window.scrollY + 10; // Position légèrement en dessous du bord supérieur
        }

        modal.style.top = `${top}px`;
        modal.style.left = `${left}px`;
    }

    function closeModal() {
        const modal = document.getElementById('modal');
        modal.style.display = 'none';
        modal.style.width = '40%'; // Réinitialiser la largeur de la modale après fermeture
    }

    document.querySelector('.close-button').addEventListener('click', closeModal);
    document.addEventListener('click', function (event) {
        if (event.target === document.getElementById('modal')) {
            closeModal();
        }
    });

    planetData.forEach(data => createPlanet(data));

    document.addEventListener('click', function (event) {
        if (!event.target.classList.contains('planet')) {
            document.querySelectorAll('.planet').forEach(planet => {
                planet.classList.remove('selected');
            });
        }
    });
});