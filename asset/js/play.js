// ================================
// CONFIGURATION DU JEU
// ================================
const GAME_WIDTH = 800;
const GAME_HEIGHT = 450;
const CONTAINER_PADDING = 40;

// ================================
// CANVAS
// ================================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ================================
// RESPONSIVE
// ================================
function resizeCanvas() {
    const availableWidth = window.innerWidth - CONTAINER_PADDING;
    const availableHeight = window.innerHeight - CONTAINER_PADDING;

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

const hudHpFrame = new Image();
hudHpFrame.src = "asset/img/ui/titre_Vspel.png";

// optionnel : info console si image absente
hudHpFrame.onerror = () => {
    console.warn("Image HUD HP introuvable → fallback activé");
};

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
        x: 60,
        y: 30,
        width: 300,
        height: 20,

        frameWidth: 300,
        frameHeight: 50,
        
        fallbackPadding: 2 
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
    const {
        x,
        y,
        width,
        height,
        frameWidth,
        frameHeight
    } = player.hudHpBar;

    const hpRatio = Math.max(0, player.hp / player.maxHp);

    const hasHudImage =
        hudHpFrame.complete &&
        hudHpFrame.naturalWidth !== 0;

    // ============================
    // IMAGE HUD (si dispo)
    // ============================
    if (hasHudImage) {
        ctx.drawImage(
            hudHpFrame,
            x - 20,
            y - 15,
            frameWidth,
            frameHeight
        );
    } else {
        // fallback simple avec padding configurable
        const pad = player.hudHpBar.fallbackPadding;
        ctx.fillStyle = "#000";
        ctx.fillRect(x - pad, y - pad, width + pad * 2, height + pad * 2);
    }

    // ============================
    // BARRE DE VIE (TOUJOURS)
    // ============================
    ctx.fillStyle = "#400";
    ctx.fillRect(x, y, width, height);

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
