// ================================
// CONFIGURATION DU JEU
// ================================
const GAME_WIDTH = 800;
const GAME_HEIGHT = 450;
const CONTAINER_PADDING = 40; // 20px haut + 20px bas

// ================================
// CANVAS
// ================================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ================================
// RESPONSIVE
// ================================
function resizeCanvas() {
    const padding = CONTAINER_PADDING;

    const availableWidth = window.innerWidth - padding;
    const availableHeight = window.innerHeight - padding;

    const scale = Math.min(
        availableWidth / GAME_WIDTH,
        availableHeight / GAME_HEIGHT
    );

    canvas.width = Math.floor(GAME_WIDTH * scale);
    canvas.height = Math.floor(GAME_HEIGHT * scale);

    ctx.setTransform(scale, 0, 0, scale, 0, 0);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// ================================
// ASSETS
// ================================
const backgroundImage = new Image();
backgroundImage.src = "asset/img/background_fight/arene.jpg";

// ================================
// PLAYER
// ================================
const player = {
    x: 100,
    y: 300,
    size: 40,
    color: "#8e44ad",

    maxHp: 100,
    hp: 100,

    hudHpBar: {
        x: 60,      // marge gauche
        y: 40,      // marge haute
        width: 300, // largeur de la barre
        height: 20  // hauteur de la barre
    }
};

// ================================
// DRAW FUNCTIONS
// ================================
function drawBackground() {
    if (!backgroundImage.complete) return;

    ctx.drawImage(
        backgroundImage,
        0,
        0,
        GAME_WIDTH,
        GAME_HEIGHT
    );
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(
        player.x,
        player.y,
        player.size,
        player.size
    );
}

function drawPlayerHealthHUD(player) {
    const { x, y, width, height } = player.hudHpBar;
    const hpRatio = player.hp / player.maxHp;

    // Bordure
    ctx.fillStyle = "#000";
    ctx.fillRect(x - 2, y - 2, width + 4, height + 4);

    // Fond vide
    ctx.fillStyle = "#400";
    ctx.fillRect(x, y, width, height);

    // Vie actuelle
    ctx.fillStyle = "#2ecc71";
    ctx.fillRect(x, y, width * hpRatio, height);
}

// ================================
// GAME LOOP
// ================================
function gameLoop() {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    drawBackground();
    drawPlayer();
    drawPlayerHealthHUD(player);

    requestAnimationFrame(gameLoop);
}

gameLoop();
