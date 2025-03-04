// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading screen
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1500);
    }

    // Initialize hero section animation
    function initHeroAnimation() {
        const heroElements = [
            document.querySelector('.greeting'),
            document.querySelector('.hero-name'),
            document.querySelector('.hero-title'),
            document.querySelector('.hero-description'),
            document.querySelector('.hero-buttons')
        ];
        
        heroElements.forEach((element, index) => {
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 300 + (index * 150));
            }
        });
    }
    
    // Run hero animation after a small delay
    setTimeout(initHeroAnimation, 300);

    // Handle mobile menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuBtn.textContent = navMenu.classList.contains('active') ? '×' : '☰';
        });
    }

    // Handle scroll progress bar
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    const scrollBar = document.createElement('div');
    scrollBar.className = 'scroll-progress-bar';
    scrollProgress.appendChild(scrollBar);
    document.body.appendChild(scrollProgress);

    // Update scroll progress
    function updateScrollProgress() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        scrollBar.style.width = `${scrolled}%`;
    }

    window.addEventListener('scroll', updateScrollProgress);

    // Handle header scroll state
    const header = document.querySelector('header');
    let lastScroll = 0;

    function updateHeaderState() {
        const currentScroll = window.scrollY;
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', updateHeaderState);

    // Intersection Observer for section animations
    const sectionElements = document.querySelectorAll('.section-container');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    sectionElements.forEach(section => {
        sectionObserver.observe(section);
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileMenuBtn.textContent = '☰';
                }
                
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Update active navigation link based on scroll position
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNavLink() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    window.addEventListener('load', updateActiveNavLink);

    // Initialize counters for section and nav numbering
    document.documentElement.style.setProperty('counter-reset', 'section nav-item');

    // Back to top button visibility
    const backToTopButton = document.querySelector('.back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    // Create particles for visual effect
    function createParticles() {
        const sections = [
            { id: 'education', className: 'education-particle', count: 15 },
            { id: 'skills', className: 'skills-particle', count: 15 },
            { id: 'about', className: 'about-particle', count: 15 },
            { id: 'contact', className: 'contact-particle', count: 15 }
        ];

        // Clear existing particles
        document.querySelectorAll('.particle').forEach(p => p.remove());

        sections.forEach(section => {
            const sectionEl = document.getElementById(section.id);
            if (!sectionEl) return;

            const sectionHeight = sectionEl.offsetHeight;
            const sectionWidth = sectionEl.offsetWidth;

            for (let i = 0; i < section.count; i++) {
                const particle = document.createElement('div');
                
                // Only use circle particles
                const shapes = ['particle-circle', 'particle-dot'];
                const shape = shapes[Math.floor(Math.random() * shapes.length)];
                
                particle.classList.add('particle', section.className, shape);
                
                // Random size between 3px and 12px
                const size = Math.floor(Math.random() * 10) + 3;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                
                // Position randomly within the section, allowing particles to go further down
                // Use up to 120% of section height to allow particles to go beyond the visible section
                const top = Math.random() * (sectionHeight * 1.2) - 20;
                const left = Math.random() * sectionWidth;
                
                particle.style.top = `${top}px`;
                particle.style.left = `${left}px`;
                
                // Random opacity
                particle.style.opacity = (Math.random() * 0.6 + 0.2).toString();
                
                // Random animation delay
                const delay = Math.random() * 5;
                particle.style.animationDelay = `${delay}s`;
                
                // Random animation duration between 10s and 25s for slower movement
                const duration = Math.random() * 15 + 10;
                particle.style.animationDuration = `${duration}s`;
                
                sectionEl.appendChild(particle);
            }
        });
    }

    // Create particles when the page loads
    window.addEventListener('load', createParticles);

    // Modal functionality for cards (excluding contact card)
    const portfolioCards = document.querySelectorAll('.portfolio-card:not(.contact-card)');

    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal';
    document.body.appendChild(modalContainer);

    portfolioCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('.card-title').textContent;
            const subtitle = card.querySelector('.company, .project-category, .location')?.textContent || '';
            const description = card.querySelector('.card-description').textContent;
            
            // Create modal content based on card type
            const cardType = Array.from(card.classList).find(cls => cls.includes('-card')).replace('-card', '');
            
            // Create modal content
            const modalContent = `
                <div class="modal-content">
                    <button class="modal-close">✕</button>
                    <div class="modal-header">
                        <h2 class="modal-title">${title}</h2>
                        <div class="modal-subtitle">${subtitle}</div>
                    </div>
                    <div class="modal-body">
                        <div class="modal-section">
                            <h3 class="modal-section-title">Overview</h3>
                            <p>${description}</p>
                            <p>This is an expanded view of the ${cardType} card. In a real portfolio, you would include more detailed information here about your ${cardType}, such as responsibilities, technologies used, challenges overcome, and results achieved.</p>
                        </div>
                        ${cardType === 'skills' ? `
                        <div class="modal-section">
                            <h3 class="modal-section-title">Technologies</h3>
                            <div>
                                <span class="skill-tag">HTML5</span>
                                <span class="skill-tag">CSS3</span>
                                <span class="skill-tag">JavaScript</span>
                                <span class="skill-tag">TypeScript</span>
                                <span class="skill-tag">React</span>
                                <span class="skill-tag">Node.js</span>
                                <span class="skill-tag">Express</span>
                                <span class="skill-tag">MongoDB</span>
                                <span class="skill-tag">SQL</span>
                                <span class="skill-tag">Git</span>
                                <span class="skill-tag">REST API</span>
                                <span class="skill-tag">GraphQL</span>
                            </div>
                        </div>
                        ` : ''}
                        ${cardType === 'projects' ? `
                        <div class="modal-section">
                            <h3 class="modal-section-title">Features</h3>
                            <ul>
                                <li>Responsive design for all devices</li>
                                <li>User authentication and authorization</li>
                                <li>Real-time data synchronization</li>
                                <li>Payment processing integration</li>
                                <li>Analytics dashboard</li>
                            </ul>
                        </div>
                        ` : ''}
                    </div>
                    <div class="modal-footer">
                        ${cardType === 'projects' ? `
                        <a href="#" class="modal-button">View Live</a>
                        <a href="#" class="modal-button">Source Code</a>
                        ` : ''}
                        <button class="modal-button primary close-modal">Close</button>
                    </div>
                </div>
            `;
            
            modalContainer.innerHTML = modalContent;
            modalContainer.classList.add('show');
            
            // Add event listeners for closing the modal
            const closeModalButtons = document.querySelectorAll('.modal-close, .close-modal');
            closeModalButtons.forEach(button => {
                button.addEventListener('click', () => {
                    modalContainer.classList.remove('show');
                });
            });
            
            // Close modal when clicking outside
            modalContainer.addEventListener('click', (e) => {
                if (e.target === modalContainer) {
                    modalContainer.classList.remove('show');
                }
            });
        });
    });

    // Resume button click handler
    const resumeButton = document.querySelector('.resume-button');
    if (resumeButton) {
        resumeButton.addEventListener('click', (e) => {
            e.preventDefault();
            // You would replace this URL with the actual path to your resume file
            window.open('https://drive.usercontent.google.com/u/1/uc?id=1ZcTSZnA6dRBQ7ynsO2lpi0RWuyK1xvQD&export=download', '_blank');
        });
    }

    // Contact form submission handler
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Basic validation
            if (!name || !email || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            // Create form data object
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('message', message);
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<span>Sending...</span>';
            submitButton.disabled = true;
            
            // Send data to server using fetch API
            fetch('process_form.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                // Check if the response is ok (status in the range 200-299)
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                console.log('Form submission response:', data);
                
                // Create success message container
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                
                // Add a note about email status if it was only saved
                let additionalInfo = '';
                if (data.mail_status === 'saved_only') {
                    additionalInfo = '<br><small style="font-size: 0.8em; opacity: 0.8;">Your message has been saved. I\'ll check it soon!</small>';
                }
                
                successMessage.innerHTML = `
                    <div class="fancy-button-wrap">
                        <div class="button-shadow"></div>
                        <div class="fancy-button">
                            <span>
                                Thanks for your message, ${name}!<br>
                                I'll get back to you soon.
                                ${additionalInfo}
                            </span>
                        </div>
                    </div>
                `;
                
                // Replace form with success message
                contactForm.innerHTML = '';
                contactForm.appendChild(successMessage);
                
                // Add the clickable effect without redirecting
                const fancyButton = successMessage.querySelector('.fancy-button');
                if (fancyButton) {
                    fancyButton.addEventListener('click', function() {
                        // Just add a visual feedback effect
                        this.classList.add('clicked');
                        setTimeout(() => {
                            this.classList.remove('clicked');
                        }, 300);
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                
                // Reset button state
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
                
                // Create a more user-friendly error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                
                errorMessage.innerHTML = `
                    <p>Sorry, there was an error sending your message.</p>
                    <p>Please try again later or contact me directly at <a href="mailto:abde8473@stthomas.edu" style="color: var(--accent); text-decoration: none;">abde8473@stthomas.edu</a></p>
                    <div class="fancy-button-wrap">
                        <div class="button-shadow"></div>
                        <button class="fancy-button try-again">
                            <span>Try Again</span>
                        </button>
                    </div>
                `;
                
                // Insert error message before the form
                contactForm.parentNode.insertBefore(errorMessage, contactForm);
                
                // Add event listener to the "Try Again" button
                const tryAgainButton = errorMessage.querySelector('.try-again');
                if (tryAgainButton) {
                    tryAgainButton.addEventListener('click', function() {
                        errorMessage.remove();
                    });
                }
            });
        });
    }

    // Initialize tech stack section animations
    function observeTechStackSection() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    const techItems = entry.target.querySelectorAll('.tech-item');
                    techItems.forEach((item, index) => {
                        // Reset animation for items
                        item.style.animationName = 'none';
                        item.offsetHeight; // Trigger reflow
                        item.style.animationName = '';
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });

        const techSection = document.querySelector('.tech-stack-section');
        if (techSection) {
            observer.observe(techSection);
        }
    }

    function initAvatarFlip() {
        const cardAvatar = document.querySelector('.card-avatar');
        if (cardAvatar) {
            // Handle click for flip
            cardAvatar.addEventListener('click', function() {
                const avatarContainer = this.querySelector('.avatar-container');
                avatarContainer.classList.toggle('flipped');
                
                // Update hint text based on flip state
                const hint = this.querySelector('.avatar-hint');
                if (hint) {
                    hint.textContent = avatarContainer.classList.contains('flipped') ? 
                        'Click to flip back' : 'Click to flip';
                }
            });
            
            // Handle mouseenter/mouseleave for desktop
            if (window.matchMedia('(min-width: 768px)').matches && window.matchMedia('(hover: hover)').matches) {
                cardAvatar.addEventListener('mouseenter', function() {
                    const avatarContainer = this.querySelector('.avatar-container');
                    if (!avatarContainer.classList.contains('flipped')) {
                        avatarContainer.classList.add('hover-flip');
                    }
                });
                
                cardAvatar.addEventListener('mouseleave', function() {
                    const avatarContainer = this.querySelector('.avatar-container');
                    avatarContainer.classList.remove('hover-flip');
                });
            }
        }
    }

    // Initialize all functions
    function init() {
        initMobileMenu();
        initHeroAnimation();
        initScrollProgress();
        initScrollAnimations();
        createParticles();
        observeTechStackSection();
        initAvatarFlip();
        
        // Event listeners
        window.addEventListener('scroll', function() {
            updateScrollProgress();
            updateHeaderState();
            updateActiveNavLink();
        });
    }

    // Initialize all functions
    init();

    // Gallery Notification Functionality
    const galleryNotification = document.getElementById('galleryNotification');
    const notificationClose = document.getElementById('notificationClose');
    const currentTime = new Date().getTime();
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    
    // Reset notification after 7 days
    const lastClosedTime = localStorage.getItem('galleryNotificationClosedTime');
    
    if (lastClosedTime && (currentTime - parseInt(lastClosedTime)) > sevenDaysInMs) {
        localStorage.removeItem('galleryNotificationClosed');
        localStorage.removeItem('galleryNotificationClosedTime');
    }
    
    // Check if notification was previously closed
    const isNotificationClosed = localStorage.getItem('galleryNotificationClosed') === 'true';
    
    if (isNotificationClosed) {
        galleryNotification.classList.add('collapsed');
    }
    
    // Handle notification close button click
    if (notificationClose) {
        notificationClose.addEventListener('click', function() {
            galleryNotification.classList.add('collapsed');
            localStorage.setItem('galleryNotificationClosed', 'true');
            localStorage.setItem('galleryNotificationClosedTime', currentTime.toString());
        });
    }
}); 