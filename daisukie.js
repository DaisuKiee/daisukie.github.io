let loadingProgress = 0;
        let loadingInterval;

        function startPreloader() {
            const progressBar = document.getElementById('progressBar');
            const preloader = document.getElementById('preloader');
            const content = document.getElementById('content');
            
            loadingInterval = setInterval(() => {
                loadingProgress += Math.random() * 15;
                
                if (loadingProgress >= 100) {
                    loadingProgress = 100;
                    clearInterval(loadingInterval);
                    
                    setTimeout(() => {
                        preloader.classList.add('hidden');
                        content.classList.add('loaded');
                    }, 500);
                }
                
                progressBar.style.width = loadingProgress + '%';
            }, 100);
        }

        let scene, camera, renderer, particles, codeParticles;
        let scrollY = 0;
        let currentSection = 0;
        let mouseX = 0, mouseY = 0;

        function initThree() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            renderer = new THREE.WebGLRenderer({ 
                canvas: document.getElementById('threejs-canvas'),
                antialias: true,
                alpha: true 
            });
            
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x0a0a0f, 1);
            
            createCodeParticles();
            createBinaryRain();
            
            camera.position.z = 5;
            
            document.addEventListener('mousemove', (e) => {
                mouseX = (e.clientX / window.innerWidth) * 2 - 1;
                mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
            });
            
            animate();
        }

        function createCodeParticles() {
            const geometry = new THREE.BufferGeometry();
            const particleCount = 800;
            
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);
            const sizes = new Float32Array(particleCount);
            const velocities = new Float32Array(particleCount * 3);
            
            const codeColors = [
                { r: 0, g: 1, b: 0.533 },
                { r: 0, g: 0.4, b: 1 },
                { r: 1, g: 0.2, b: 0.4 },
                { r: 1, g: 1, b: 1 }
            ];
            
            for (let i = 0; i < particleCount; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 25;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
                
                velocities[i * 3] = 0;
                velocities[i * 3 + 1] = 0;
                velocities[i * 3 + 2] = 0;
                
                const color = codeColors[Math.floor(Math.random() * codeColors.length)];
                colors[i * 3] = color.r;
                colors[i * 3 + 1] = color.g;
                colors[i * 3 + 2] = color.b;
                
                sizes[i] = Math.random() * 3 + 1;
            }
            
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
            geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
            
            const material = new THREE.PointsMaterial({
                size: 2,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                sizeAttenuation: false
            });
            
            particles = new THREE.Points(geometry, material);
            scene.add(particles);
        }

        function createBinaryRain() {
            const binaryGeometry = new THREE.BufferGeometry();
            const binaryCount = 200;
            
            const positions = new Float32Array(binaryCount * 3);
            const colors = new Float32Array(binaryCount * 3);
            const velocities = new Float32Array(binaryCount * 3);
            
            for (let i = 0; i < binaryCount; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 30;
                positions[i * 3 + 1] = Math.random() * 30 + 10;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
                
                velocities[i * 3] = 0;
                velocities[i * 3 + 1] = -0.05;
                velocities[i * 3 + 2] = 0;
                
                colors[i * 3] = 0;
                colors[i * 3 + 1] = 1;
                colors[i * 3 + 2] = 0.533;
            }
            
            binaryGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            binaryGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            binaryGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
            
            const binaryMaterial = new THREE.PointsMaterial({
                size: 1.5,
                vertexColors: true,
                transparent: true,
                opacity: 0.6
            });
            
            codeParticles = new THREE.Points(binaryGeometry, binaryMaterial);
            scene.add(codeParticles);
        }

        function animate() {
            requestAnimationFrame(animate);
            
            const time = Date.now() * 0.001;
            
            if (particles) {
                particles.rotation.y += 0.001;
                
                const positions = particles.geometry.attributes.position.array;
                const velocities = particles.geometry.attributes.velocity.array;
                
                for (let i = 0; i < positions.length; i += 3) {
                    const vector = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
                    vector.project(camera);
                    
                    const dx = vector.x - mouseX;
                    const dy = vector.y - mouseY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 0.2) {
                        const force = (0.2 - distance) * 0.05;
                        velocities[i] += dx * force;
                        velocities[i + 1] += dy * force;
                    }
                    
                    positions[i] += velocities[i];
                    positions[i + 1] += velocities[i + 1];
                    positions[i + 2] += Math.sin(time + positions[i]) * 0.005;
                    
                    velocities[i] *= 0.95;
                    velocities[i + 1] *= 0.95;
                    
                    if (positions[i] > 25) positions[i] = 25, velocities[i] *= -0.5;
                    if (positions[i] < -25) positions[i] = -25, velocities[i] *= -0.5;
                    if (positions[i + 1] > 25) positions[i + 1] = 25, velocities[i + 1] *= -0.5;
                    if (positions[i + 1] < -25) positions[i + 1] = -25, velocities[i + 1] *= -0.5;
                }
                particles.geometry.attributes.position.needsUpdate = true;
                particles.geometry.attributes.velocity.needsUpdate = true;
            }
            
            if (codeParticles) {
                const positions = codeParticles.geometry.attributes.position.array;
                const velocities = codeParticles.geometry.attributes.velocity.array;
                
                for (let i = 0; i < positions.length; i += 3) {
                    const vector = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
                    vector.project(camera);
                    
                    const dx = vector.x - mouseX;
                    const dy = vector.y - mouseY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 0.2) {
                        const force = (0.2 - distance) * 0.05;
                        velocities[i] += dx * force;
                        velocities[i + 1] += dy * force;
                    }
                    
                    positions[i] += velocities[i];
                    positions[i + 1] += velocities[i + 1];
                    positions[i + 2] += velocities[i + 2];
                    
                    velocities[i] *= 0.95;
                    velocities[i + 1] *= 0.95;
                    
                    if (positions[i + 1] < -15) {
                        positions[i + 1] = 15;
                        positions[i] = (Math.random() - 0.5) * 30;
                        velocities[i] = 0;
                        velocities[i + 1] = -0.05;
                    }
                }
                codeParticles.geometry.attributes.position.needsUpdate = true;
                codeParticles.geometry.attributes.velocity.needsUpdate = true;
            }
            
            camera.position.y = -scrollY * 0.001;
            camera.position.x = Math.sin(scrollY * 0.0005) * 0.3;
            
            switch(currentSection) {
                case 0:
                    camera.position.z = 5 + Math.sin(time * 0.5) * 0.2;
                    break;
                case 2:
                    if (particles) {
                        particles.material.size = 3 + Math.sin(time) * 0.5;
                    }
                    break;
            }
            
            renderer.render(scene, camera);
        }

        function initNavigation() {
            const navDots = document.querySelectorAll('.nav-dot');
            
            function updateNavigation() {
                const sections = document.querySelectorAll('.section');
                const windowHeight = window.innerHeight;
                
                sections.forEach((section, index) => {
                    const rect = section.getBoundingClientRect();
                    if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
                        navDots.forEach(dot => dot.classList.remove('active'));
                        navDots[index].classList.add('active');
                    }
                });
            }
            
            window.addEventListener('scroll', updateNavigation);
        }

        function handleScroll() {
            scrollY = window.pageYOffset;
            const sections = document.querySelectorAll('.section');
            const windowHeight = window.innerHeight;
            
            sections.forEach((section, index) => {
                const rect = section.getBoundingClientRect();
                const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / windowHeight));
                
                section.style.transform = `translateY(${(1 - progress) * 50}px)`;
                section.style.opacity = progress;
                
                if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
                    if (currentSection !== index) {
                        currentSection = index;
                        triggerSectionAnimation(index);
                    }
                }
            });
        }

        function triggerSectionAnimation(sectionIndex) {
            const section = document.querySelectorAll('.section')[sectionIndex];
            section.style.animation = 'none';
            setTimeout(() => {
                section.style.animation = 'fadeInUp 0.8s ease forwards';
            }, 10);
        }

        function openModal(projectId) {
            const modal = document.getElementById(projectId + 'Modal');
            modal.style.display = 'block';
        }

        function closeModal(projectId) {
            const modal = document.getElementById(projectId + 'Modal');
            modal.style.display = 'none';
        }

        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                const modals = document.querySelectorAll('.modal');
                modals.forEach(modal => {
                    modal.style.display = 'none';
                });
            }
        });

        function initForm() {
            const form = document.getElementById('contactForm');
            const submitBtn = document.getElementById('submitBtn');
            const confirmationMessage = document.getElementById('confirmationMessage');

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                // Start sending animation
                form.classList.add('sending');
                submitBtn.classList.add('sending');
                
                const formData = new FormData(form);
                const data = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    message: formData.get('message')
                };
                
                try {
                    const response = await fetch('https://daisukiedev-ibndgbegq-elixirdevelopmentbotgmailcoms-projects.vercel.app/send-email', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });
                    
                    const result = await response.json();
                    
                    if (response.ok) {
                        form.reset();
                        confirmationMessage.textContent = 'Message sent successfully!';
                        confirmationMessage.classList.remove('error');
                        confirmationMessage.classList.add('show');
                        
                        setTimeout(() => {
                            confirmationMessage.classList.remove('show');
                        }, 3000);
                    } else {
                        throw new Error(result.message || 'Failed to send message');
                    }
                } catch (error) {
                    confirmationMessage.textContent = `Error: ${error.message}`;
                    confirmationMessage.classList.add('error', 'show');
                    
                    setTimeout(() => {
                        confirmationMessage.classList.remove('show', 'error');
                    }, 3000);
                } finally {
                    form.classList.remove('sending');
                    submitBtn.classList.remove('sending');
                }
            });
        }

        function handleResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function initSmoothScroll() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                });
            });
        }

        document.addEventListener('DOMContentLoaded', () => {
            startPreloader();
            initThree();
            initNavigation();
            initForm();
            initSmoothScroll();
            
            window.addEventListener('scroll', handleScroll);
            window.addEventListener('resize', handleResize);
        });

        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(50px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);

