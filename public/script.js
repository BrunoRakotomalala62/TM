
document.addEventListener('DOMContentLoaded', function() {
    // Animer les sections au défilement
    const sections = document.querySelectorAll('.section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.style.opacity = 0;
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(section);
    });
    
    // Navigation fluide
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Simulation du chatbot
    const chatbotInput = document.querySelector('.chatbot-input input');
    const chatbotButton = document.querySelector('.chatbot-input button');
    const chatbotMessages = document.querySelector('.chatbot-messages');
    
    if (chatbotInput && chatbotButton && chatbotMessages) {
        chatbotButton.addEventListener('click', function() {
            sendMessage();
        });
        
        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        function sendMessage() {
            const message = chatbotInput.value.trim();
            if (message === '') return;
            
            // Afficher le message de l'utilisateur
            const userMessageElement = document.createElement('div');
            userMessageElement.className = 'message user';
            userMessageElement.innerHTML = `<p>${message}</p>`;
            chatbotMessages.appendChild(userMessageElement);
            
            // Effacer l'input
            chatbotInput.value = '';
            
            // Faire défiler vers le bas
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            
            // Simuler une réponse du bot après 1 seconde
            setTimeout(() => {
                const botResponse = getBotResponse(message);
                const botMessageElement = document.createElement('div');
                botMessageElement.className = 'message bot';
                botMessageElement.innerHTML = `<p>${botResponse}</p>`;
                chatbotMessages.appendChild(botMessageElement);
                
                // Faire défiler vers le bas à nouveau
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }, 1000);
        }
        
        function getBotResponse(message) {
            message = message.toLowerCase();
            
            if (message.includes('bonjour') || message.includes('salut') || message.includes('hello')) {
                return 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?';
            } else if (message.includes('histoire') || message.includes('madagascar')) {
                return 'Madagascar possède une histoire riche et fascinante. Souhaitez-vous des informations sur une période particulière ?';
            } else if (message.includes('cours') || message.includes('apprendre')) {
                return 'Nous proposons plusieurs cours sur la langue, l\'histoire et la culture malagasy. Quel sujet vous intéresse le plus ?';
            } else if (message.includes('merci')) {
                return 'Je vous en prie ! N\'hésitez pas si vous avez d\'autres questions.';
            } else {
                return 'Je comprends votre intérêt. Pour plus d\'informations sur ce sujet, je vous invite à explorer nos ressources pédagogiques.';
            }
        }
    }
});
