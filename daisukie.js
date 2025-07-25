 // Preloader functionality
        let loadingProgress = 0;
        const loadingCounter = document.getElementById('loadingCounter');
        const preloader = document.getElementById('preloader');
        const mainWrapper = document.getElementById('mainWrapper');

        function updateLoading() {
            if (loadingProgress < 100) {
                loadingProgress += Math.random() * 3 + 1;
                if (loadingProgress > 100) loadingProgress = 100;
                
                loadingCounter.textContent = Math.floor(loadingProgress) + '%';
                
                if (loadingProgress < 100) {
                    setTimeout(updateLoading, 50 + Math.random() * 100);
                } else {
                    setTimeout(() => {
                        preloader.classList.add('hidden');
                        mainWrapper.classList.add('loaded');
                    }, 500);
                }
            }
        }

        // Start loading animation
        setTimeout(updateLoading, 500);

        // Scroll to section function
        function scrollToSection(selector) {
            const element = document.querySelector(selector);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
        // Create floating particles
        function createParticle() {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * window.innerWidth + 'px';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 6) + 's';
            document.body.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 9000);
        }

        // Create particles periodically
        setInterval(createParticle, 300);

        // Smooth scrolling for navigation links
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

        // Header scroll effect
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (window.scrollY > 100) {
                header.style.background = 'rgba(10, 10, 10, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 212, 170, 0.1)';
            } else {
                header.style.background = 'rgba(10, 10, 10, 0.95)';
                header.style.boxShadow = 'none';
            }
        });

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for animations
        document.querySelectorAll('.blog-post, .developer-card, .about-section, .skill-item').forEach(el => {
            observer.observe(el);
        });

        // Interactive hover effects
        document.querySelectorAll('.blog-post, .developer-card, .skill-item').forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });