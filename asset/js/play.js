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

    maxHp: 1000,
    hp: 1000,

    attack: 25,
    attackSpeed: 0.75,
    lastAttack: 0,

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
// ENNEMI
// ================================
const enemy = {
    x: GAME_WIDTH - 140,
    y: 300,
    size: 40,
    color: "#f1c40f",

    maxHp: 1000,
    hp: 1000,

    attack: 15,
    attackSpeed: 1.1,
    lastAttack: 0,

    hudHpBar: {
        x: GAME_WIDTH - 60 - 300,
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
    ctx.drawImage(backgroundImage, 0, 0, GAME_WIDTH, GAME_HEIGHT);
}

function drawEntity(entity) {
    ctx.fillStyle = entity.color;
    ctx.fillRect(entity.x, entity.y, entity.size, entity.size);
}

// ================================
// Barre de vie (player normal, enemy inverse)
// ================================
function drawHealthHUD(entity, invert = false) {
    const { x, y, width, height, frameWidth, frameHeight, fallbackPadding } = entity.hudHpBar;
    const hpRatio = Math.max(0, entity.hp / entity.maxHp);
    const hasHudImage = hudHpFrame.complete && hudHpFrame.naturalWidth !== 0;

    // image HUD
    if (hasHudImage) {
        ctx.drawImage(hudHpFrame, x - 20, y - 15, frameWidth, frameHeight);
    } else {
        ctx.fillStyle = "#000";
        ctx.fillRect(x - fallbackPadding, y - fallbackPadding, width + fallbackPadding * 2, height + fallbackPadding * 2);
    }

    // barre vide
    ctx.fillStyle = "#400";
    ctx.fillRect(x, y, width, height);

    // barre actuelle
    ctx.fillStyle = "#2ecc71";
    if (!invert) {
        // normale (gauche → droite)
        ctx.fillRect(x, y, width * hpRatio, height);
    } else {
        // inversée (droite → gauche)
        ctx.fillRect(x + width * (1 - hpRatio), y, width * hpRatio, height);
    }
}

// ================================
// COMBAT
// ================================
function handleCombat(deltaTime) {
    // player attaque ennemi
    player.lastAttack += deltaTime;
    if (player.lastAttack >= player.attackSpeed) {
        enemy.hp -= player.attack;
        enemy.hp = Math.max(0, enemy.hp);
        player.lastAttack = 0;
    }

    // ennemi attaque player
    enemy.lastAttack += deltaTime;
    if (enemy.lastAttack >= enemy.attackSpeed) {
        player.hp -= enemy.attack;
        player.hp = Math.max(0, player.hp);
        enemy.lastAttack = 0;
    }
}

// ================================
// GAME LOOP
// ================================
let lastTime = 0;
function gameLoop(timestamp) {
    const deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    drawBackground();

    // player
    drawEntity(player);
    drawHealthHUD(player);

    // ennemi (invert = true)
    drawEntity(enemy);
    drawHealthHUD(enemy, true);

    handleCombat(deltaTime);

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
