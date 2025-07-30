const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');
const themeToggle = document.querySelector('#theme-toggle');
const skillsCarousel = document.querySelector('#skills-carousel');
const projectsCarousel = document.querySelector('#projects-carousel');

// Theme toggle functionality
const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
};

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

// Load saved theme from localStorage
const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

// Burger menu functionality
burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    burger.classList.toggle('toggle');
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Carousel functionality
function setupCarousel(carouselId) {
    const carousel = document.querySelector(`#${carouselId}`);
    const prevBtn = document.querySelector(`.carousel-control.prev[data-target="${carouselId}"]`);
    const nextBtn = document.querySelector(`.carousel-control.next[data-target="${carouselId}"]`);
    let currentIndex = 0;
    const cards = carousel.children;
    const cardCount = cards.length;

    function updateCarousel() {
        const offset = -currentIndex * 320; // 300px card width + 20px margin
        carousel.style.transform = `translateX(${offset}px)`;
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + cardCount) % cardCount;
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % cardCount;
        updateCarousel();
    });
}

setupCarousel('skills-carousel');

// Animation for skill and project cards on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.2 });

// Fetch GitHub projects
async function fetchGitHubProjects() {
    try {
        const response = await fetch('https://api.github.com/users/RijinRaju/repos?sort=updated&per_page=5');
        const repos = await response.json();
        projectsCarousel.innerHTML = ''; // Clear existing content
        repos.forEach(repo => {
            const projectCard = document.createElement('div');
            projectCard.classList.add('project-card');
            projectCard.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description || 'No description available'}</p>
                <p><strong>Language:</strong> ${repo.language || 'Not specified'}</p>
                <a href="${repo.html_url}" target="_blank">View on GitHub</a>
            `;
            projectsCarousel.appendChild(projectCard);
            observer.observe(projectCard);
        });

        // Add "More" card
        const moreCard = document.createElement('div');
        moreCard.classList.add('project-card');
        moreCard.innerHTML = `
            <h3>More Projects</h3>
            <p>Explore additional projects on my GitHub profile.</p>
            <a href="https://github.com/RijinRaju" target="_blank">Visit GitHub</a>
        `;
        projectsCarousel.appendChild(moreCard);
        observer.observe(moreCard);

        setupCarousel('projects-carousel');
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        projectsCarousel.innerHTML = '<p>Unable to load GitHub projects at this time.</p>';
    }
}

fetchGitHubProjects();