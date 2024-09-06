// Variables globales
let score = 0;
const totalMaterials = 9;
let materialsPlaced = 0;
let materialsInCanecas = 0;

// Variables para guardar el estado inicial
let initialMaterialsPositions = [];
let initialCanecasPositions = [];

// Pantallas
const startScreen = document.getElementById('inicio');
const gameScreen = document.getElementById('game');
const finalScreen = document.getElementById('final');
const scoreDisplay = document.getElementById('score');
const messageDisplay = document.getElementById('message');

// Configuración inicial
document.getElementById('start-button').addEventListener('click', () => {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    setupGame();
});

document.getElementById('reset-game-button').addEventListener('click', () => {
    location.reload();
});

document.getElementById('restart-button').addEventListener('click', () => {
    location.reload();
});

// Función para guardar las posiciones iniciales
function saveInitialPositions() {
    initialMaterialsPositions = [];
    initialCanecasPositions = [];

    // Guarda posiciones de materiales
    document.querySelectorAll('.material').forEach(material => {
        const rect = material.getBoundingClientRect();
        initialMaterialsPositions.push({
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX
        });
    });

    // Guarda posiciones de canecas
    document.querySelectorAll('.caneca').forEach(caneca => {
        const rect = caneca.getBoundingClientRect();
        initialCanecasPositions.push({
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX
        });
    });
}

// Función para mezclar los materiales
function shuffleMaterials() {
    const container = document.querySelector('.materials-container');
    const materials = Array.from(container.children);
    const shuffledMaterials = shuffleArray(materials);

    // Limpia el contenedor y agrega los materiales en el nuevo orden
    container.innerHTML = '';
    shuffledMaterials.forEach(material => container.appendChild(material));
}

// Función para mezclar un array (Fisher-Yates shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Función de arrastrar
function dragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
}

// Función de permitir arrastre
function dragOver(event) {
    event.preventDefault();
}

// Función de soltar
function drop(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text");
    const draggedElement = document.getElementById(id);
    const target = event.target;

    if (target.classList.contains('caneca')) {
        const materialType = draggedElement.getAttribute('data-type');
        const canecaType = target.getAttribute('data-caneca');

        // Verificar material en la caneca correcta
        if ((canecaType === 'negra' && ['servilletas', 'icopor-comida', 'cucharas-desechables'].includes(materialType)) ||
            (canecaType === 'verde' && ['cascara-fruta', 'desechos-agricolas', 'pescado'].includes(materialType)) ||
            (canecaType === 'blanca' && ['plastico', 'carton', 'vidrio'].includes(materialType))) {
            score++;
        }

        target.appendChild(draggedElement);
        materialsPlaced++;

        // Actualizar conteo de materiales en canecas
        if (!draggedElement.classList.contains('in-caneca')) {
            materialsInCanecas++;
            draggedElement.classList.add('in-caneca');
        }

        // Si todos los materiales están en las canecas, mostrar pantalla final
        if (materialsInCanecas === totalMaterials) {
            endGame();
        }
    }
}

// Función para finalizar el juego
function endGame() {
    gameScreen.classList.add('hidden');
    finalScreen.classList.remove('hidden');
    scoreDisplay.textContent = `Respuestas correctas: ${score}/${totalMaterials}`;
    
    // Mostrar mensaje basado en la puntuación
    let message;
    let imageUrl;
    if (score >= 1 && score <= 5) {
        message = "Upss! te falta practicar un poco más";
        imageUrl = "imgs/emojitriste.gif";  

    } else if (score >= 6 && score <= 8) {
        message = "Ánimo, ya casi lo tienes";
        imageUrl = "imgs/emojifeliz.gif"; 
    } else if (score === 9) {
        message = "Felicitaciones, eres un crack de la separación, no olvides aplicarlo en la Casa IK";
        imageUrl = "imgs/emojigafas.gif"; 
    }

    messageDisplay.textContent = message;

    // Mostrar la imagen
    const imageDisplay = document.getElementById('imageDisplay');
    if (imageUrl) {
        imageDisplay.innerHTML = `<img src="${imageUrl}" width="180" alt="${message}" />`;
    }
}

// Función para configurar el juego
function setupGame() {
    saveInitialPositions(); // Guardar posiciones iniciales
    shuffleMaterials();    // Mezclar materiales
    document.querySelectorAll('.material').forEach(material => {
        material.addEventListener('dragstart', dragStart);
    });
    document.querySelectorAll('.caneca').forEach(caneca => {
        caneca.addEventListener('dragover', dragOver);
        caneca.addEventListener('drop', drop);
    });
}

// Inicializa el juego al cargar la página
document.addEventListener('DOMContentLoaded', setupGame);
