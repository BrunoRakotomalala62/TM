
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    const links = document.querySelectorAll('nav a, .hero a, .footer-links a');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href === '#' ? 'body' : href;
                const targetElement = targetId === 'body' ? document.body : document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70,
                        behavior: 'smooth'
                    });
                    
                    // Update active navigation link
                    document.querySelectorAll('nav a').forEach(navLink => {
                        navLink.classList.remove('active');
                    });
                    
                    if (href !== '#') {
                        this.classList.add('active');
                    }
                }
            }
        });
    });
    
    // Navbar scrolling effect
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(106, 17, 203, 0.95)';
            header.style.padding = '0.7rem 5%';
            header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)';
            header.style.padding = '1rem 5%';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // Simple chatbot demo functionality
    const chatInput = document.querySelector('.chatbot-input input');
    const chatSendButton = document.querySelector('.chatbot-input button');
    const chatMessages = document.querySelector('.chatbot-messages');
    
    if (chatInput && chatSendButton && chatMessages) {
        chatSendButton.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        function sendMessage() {
            const message = chatInput.value.trim();
            
            if (message !== '') {
                // Add user message
                const userMessage = document.createElement('div');
                userMessage.className = 'message user';
                userMessage.innerHTML = `<p>${message}</p>`;
                chatMessages.appendChild(userMessage);
                
                // Clear input
                chatInput.value = '';
                
                // Scroll to bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                // Simulate bot response (delayed)
                setTimeout(() => {
                    const botResponse = getBotResponse(message);
                    const botMessage = document.createElement('div');
                    botMessage.className = 'message bot';
                    botMessage.innerHTML = `<p>${botResponse}</p>`;
                    chatMessages.appendChild(botMessage);
                    
                    // Scroll to bottom again
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 1000);
            }
        }
        
        function getBotResponse(message) {
            const lowerMessage = message.toLowerCase();
            
            if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello')) {
                return 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?';
            } else if (lowerMessage.includes('histoire') || lowerMessage.includes('historique')) {
                return 'Madagascar a une histoire riche qui remonte à plus de 2000 ans. Les premiers habitants sont arrivés entre 350 BCE et 550 CE. Voulez-vous en savoir plus sur une période spécifique ?';
            } else if (lowerMessage.includes('langue') || lowerMessage.includes('parler')) {
                return 'Le malgache est la langue nationale de Madagascar. Elle appartient à la famille des langues austronésiennes et comporte de nombreux dialectes régionaux.';
            } else if (lowerMessage.includes('cours') || lowerMessage.includes('apprendre')) {
                return 'Nous proposons divers cours sur la langue, la culture, l\'histoire et la géographie de Madagascar. Vous pouvez les consulter dans la section "Cours" de notre site.';
            } else if (lowerMessage.includes('quiz') || lowerMessage.includes('test')) {
                return 'Nos quiz interactifs sont conçus pour tester vos connaissances tout en vous amusant. Consultez la section "Quiz" pour commencer !';
            } else {
                return 'Merci pour votre message. Pour des questions spécifiques sur Madagascar ou nos ressources éducatives, n\'hésitez pas à préciser votre demande.';
            }
        }
    }
    
    // Observer for section animations
    const sections = document.querySelectorAll('.section');
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                
                // Update active navigation link
                const id = entry.target.id;
                if (id) {
                    document.querySelectorAll('nav a').forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            }
        });
    }, {
        threshold: 0.3
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
});
