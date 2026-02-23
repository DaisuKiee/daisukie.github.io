// Preloader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    preloader.style.opacity = '0';
    setTimeout(() => {
        preloader.style.display = 'none';
    }, 500);
});

// Scroll Progress Bar
window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('scrollProgress');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    scrollProgress.style.width = progress + '%';
});

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Custom Cursor
const cursorDot = document.getElementById('cursorDot');
const cursorOutline = document.getElementById('cursorOutline');

window.addEventListener('mousemove', (e) => {
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
    
    cursorOutline.style.left = e.clientX + 'px';
    cursorOutline.style.top = e.clientY + 'px';
});

// Particles
const particlesContainer = document.getElementById('particles');
for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 15 + 's';
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    particlesContainer.appendChild(particle);
}

// Scroll Reveal Animation
function reveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', reveal);
reveal(); // Initial check

// Counter Animation for Stats
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    };
    
    updateCounter();
}

// Animate counters when they come into view
const statNumbers = document.querySelectorAll('.stat-number[data-target]');
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            animateCounter(entry.target);
            entry.target.classList.add('counted');
        }
    });
}, observerOptions);

statNumbers.forEach(stat => statObserver.observe(stat));

// Skill Progress Animation
const skillProgress = document.querySelectorAll('.skill-progress[data-progress]');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const progress = entry.target.getAttribute('data-progress');
            entry.target.style.setProperty('--progress-width', progress + '%');
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

skillProgress.forEach(skill => skillObserver.observe(skill));

// Portfolio Data and Modal Logic
let portfolioData = [];

// Load portfolio data from JSON
fetch('assets/data/portfolio.json')
    .then(response => response.json())
    .then(data => {
        portfolioData = data.projects;
        renderPortfolio();
    })
    .catch(error => console.error('Error loading portfolio:', error));

// Render portfolio items
function renderPortfolio() {
    const portfolioGrid = document.querySelector('.portfolio-grid');
    portfolioGrid.innerHTML = '';

    portfolioData.forEach((project, index) => {
        const portfolioItem = document.createElement('div');
        portfolioItem.className = `portfolio-item reveal-scale stagger-delay-${(index % 6) + 1}`;
        portfolioItem.dataset.projectId = project.id;

        portfolioItem.innerHTML = `
            <img src="${project.image}" alt="${project.title}" class="portfolio-image">
            <div class="portfolio-overlay">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <a href="#" class="btn btn-primary view-project">View Project</a>
            </div>
        `;

        portfolioGrid.appendChild(portfolioItem);
    });

    // Attach event listeners after rendering
    attachPortfolioListeners();
    reveal(); // Re-run reveal animation
}

// Attach click listeners to portfolio items
function attachPortfolioListeners() {
    const viewProjectBtns = document.querySelectorAll('.view-project');
    
    viewProjectBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const item = btn.closest('.portfolio-item');
            const projectId = parseInt(item.dataset.projectId);
            const project = portfolioData.find(p => p.id === projectId);
            
            if (project) {
                openModal(project);
            }
        });
    });
}

// Open modal with project data
function openModal(project) {
    const modal = document.getElementById('portfolioModal');
    
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalDescription').textContent = project.description;
    
    const modalImg = document.getElementById('modalImage');
    if (project.image) {
        modalImg.src = project.image;
        modalImg.style.display = 'block';
    } else {
        modalImg.style.display = 'none';
    }

    const techList = document.getElementById('modalTech');
    techList.innerHTML = '';
    project.technologies.forEach(tech => {
        const li = document.createElement('li');
        li.textContent = tech;
        techList.appendChild(li);
    });

    // Hide all buttons initially
    document.getElementById('modalDemo').classList.add('hidden');
    document.getElementById('modalGit').classList.add('hidden');
    document.getElementById('modalSupport').classList.add('hidden');
    document.getElementById('modalView').classList.add('hidden');

    // Show and set only relevant buttons
    if (project.links.demo) {
        const btnElem = document.getElementById('modalDemo');
        btnElem.href = project.links.demo;
        btnElem.classList.remove('hidden');
    }
    if (project.links.github) {
        const btnElem = document.getElementById('modalGit');
        btnElem.href = project.links.github;
        btnElem.classList.remove('hidden');
    }
    if (project.links.support) {
        const btnElem = document.getElementById('modalSupport');
        btnElem.href = project.links.support;
        btnElem.classList.remove('hidden');
    }
    if (project.links.view) {
        const btnElem = document.getElementById('modalView');
        btnElem.href = project.links.view;
        btnElem.classList.remove('hidden');
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Modal close handlers
const modal = document.getElementById('portfolioModal');

const closeModal = document.querySelector('.close-modal');
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('.section, .hero');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Contact Form Submission with Animation
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Start sending animation
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
    formMessage.innerHTML = ''; // Clear previous messages

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    try {
        const response = await fetch('http://localhost:3000/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            formMessage.innerHTML = '<div class="success">Message sent successfully! I\'ll get back to you soon.</div>';
            contactForm.reset();
        } else {
            throw new Error(result.error || 'Failed to send message');
        }
    } catch (error) {
        formMessage.innerHTML = `<div class="error">Error: ${error.message}</div>`;
    } finally {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message';
    }
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-image');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Toast Notification Function
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('active');
    }, 10);
    setTimeout(() => {
        toast.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Disable right-click
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    showToast('Right-click is restricted.');
    return false;
});

document.addEventListener('keydown', function(e) {
    // Ctrl+U
    if ((e.ctrlKey || e.metaKey) && e.keyCode === 85) {
        e.preventDefault();
        showToast('Viewing source is restricted.');
        return false;
    }
    // F12 (DevTools)
    if (e.keyCode === 123) {
        e.preventDefault();
        showToast('Developer tools are disabled.');
        return false;
    }
    // Ctrl+Shift+I (Inspect Element)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        showToast('Inspecting elements is not allowed.');
        return false;
    }
    // Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
        showToast('Console access is blocked.');
        return false;
    }
}, false);

// Optional: Detect dev tools open and redirect/blur
let devtools = { open: false, orientation: null };
const threshold = 160;
setInterval(() => {
    if (window.outerHeight - window.innerHeight > threshold || window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
            devtools.open = true;
            showToast('Dev tools detected!');
            // Or redirect: window.location = 'about:blank';
        }
    } else {
        devtools.open = false;
    }
}, 500);