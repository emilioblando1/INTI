const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');
const messages = document.getElementById('messages');

// Función para agregar mensajes al chat
function addMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    const textSpan = document.createElement('span');
    textSpan.classList.add('text');
    textSpan.innerText = text;
    msgDiv.appendChild(textSpan);
    messages.appendChild(msgDiv);
    messages.scrollTop = messages.scrollHeight;
}

// Función para solicitar respuesta al GPT (INTI)
async function getResponse(question) {
    // Aquí debes integrar tu llamada a la API de INTI
    // Este es un ejemplo genérico con fetch y OpenAI, reemplázalo con tu endpoint real.
    const apiKey = "YOUR_API_KEY"; // Pon tu clave real
    const apiUrl = "YOUR_ENDPOINT_URL"; // Pon tu endpoint real

    const payload = {
        model: "gpt-3.5-turbo", // Ajusta según tu modelo
        messages: [{ role: "system", content: "Eres INTI, un guía espiritual." },
                   { role: "user", content: question }]
    };
    
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        const answer = data.choices && data.choices[0] ? data.choices[0].message.content : "No hay respuesta en este momento.";
        return answer.trim();
    } catch (error) {
        console.error(error);
        return "Error al conectar con INTI. Por favor, inténtalo más tarde.";
    }
}

// Evento para enviar mensaje
sendBtn.addEventListener('click', async () => {
    const question = userInput.value.trim();
    if (!question) return;

    // Muestra el mensaje del usuario
    addMessage('user', question);
    userInput.value = '';

    // Muestra un "cargando"
    const loadingMsg = addMessage('inti', '...');

    // Obtiene la respuesta del GPT
    const response = await getResponse(question);

    // Elimina el mensaje de "..." (puedes buscar el último elemento con el contenido '...')
    const allMessages = messages.querySelectorAll('.message.inti .text');
    if (allMessages.length > 0) {
        const lastText = allMessages[allMessages.length - 1];
        if (lastText.innerText === '...') {
            lastText.innerText = response;
        } else {
            addMessage('inti', response);
        }
    } else {
        addMessage('inti', response);
    }
});

// Permite enviar con Enter
userInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendBtn.click();
    }
});
