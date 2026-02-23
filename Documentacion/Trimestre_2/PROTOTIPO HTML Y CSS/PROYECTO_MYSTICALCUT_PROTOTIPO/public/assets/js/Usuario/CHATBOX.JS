
            const chatIcon = document.getElementById('chatIcon');
            const chatbox = document.getElementById('chatbox');
            const helpLink = document.getElementById('helpLink');
            
            // Preguntas y respuestas predefinidas
            const faq = {
                "Horario": "Nuestro horario de atención es de 9:00 a 18:00 de lunes a viernes.",
                "Donde estan ubicados": "Nuestras oficinas están ubicadas en Calle Falsa 123, Ciudad Ejemplo.",
                "soporte tecnico": "Puedes contactar con soporte técnico a través del correo soporte@ejemplo.com."
            };
            
            // Mostrar/ocultar el chatbox al hacer clic en el ícono de chat
            chatIcon.addEventListener('click', function() {
                chatbox.style.display = chatbox.style.display === 'none' ? 'block' : 'none';
            });
            
            // Mostrar el chatbox cuando se presiona el enlace de ayuda
            helpLink.addEventListener('click', function(event) {
                event.preventDefault(); // Evita que el enlace navegue a otra página
                chatbox.style.display = 'block';
            });
            
            // Enviar mensaje en el chat
            const sendMessageBtn = document.getElementById('sendMessageBtn');
            const messageInput = document.getElementById('messageInput');
            const chatboxBody = document.getElementById('chatboxBody');
            
            sendMessageBtn.addEventListener('click', function() {
                const message = messageInput.value;
                if (message.trim() !== '') {
                    // Mostrar mensaje del usuario
                    const userMessageElement = document.createElement('div');
                    userMessageElement.classList.add('message');
                    userMessageElement.innerHTML = `<span class="message-user">You:</span> ${message}`;
                    chatboxBody.appendChild(userMessageElement);
        
                    // Generar respuesta automática
                    const response = faq[message] || "Lo siento, no entiendo tu pregunta. ¿Puedes intentar de nuevo?";
                    const botMessageElement = document.createElement('div');
                    botMessageElement.classList.add('message');
                    botMessageElement.innerHTML = `<span class="message-user">Bot:</span> ${response}`;
                    chatboxBody.appendChild(botMessageElement);
        
                    messageInput.value = '';
                    chatboxBody.scrollTop = chatboxBody.scrollHeight; 
                }
            });
            
            messageInput.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    sendMessageBtn.click();
                }
            });