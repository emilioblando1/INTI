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

// Función para solicitar respuesta a la API de OpenAI (INTI)
async function getResponse(question) {
    // Clave expuesta (no recomendado)
    const apiKey = "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";
    const apiUrl = "https://api.openai.com/v1/chat/completions";

    const payload = {
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: "Eres INTI, un guía espiritual. Responde con sabiduría, empatía y serenidad." },
            { role: "user", content: question }
        ],
        temperature: 0.7
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

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data && data.choices && data.choices.length > 0) {
            const answer = data.choices[0].message.content.trim();
            return answer;
        } else {
            return "No se recibió una respuesta válida. Por favor, inténtalo más tarde.";
        }
    } catch (error) {
        console.error("Error al conectar con INTI:", error);
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
    const loadingMsgDiv = document.createElement('div');
    loadingMsgDiv.classList.add('message', 'inti');
    const loadingText = document.createElement('span');
    loadingText.classList.add('text');
    loadingText.innerText = '...';
    loadingMsgDiv.appendChild(loadingText);
    messages.appendChild(loadingMsgDiv);
    messages.scrollTop = messages.scrollHeight;

    // Obtiene la respuesta de INTI (OpenAI)
    const response = await getResponse(question);

    // Reemplaza el '...' por la respuesta
    loadingText.innerText = response;
});

// Permite enviar con Enter
userInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendBtn.click();
    }
});

