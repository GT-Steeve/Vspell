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
    console.warn("HUD HP image introuvable → fallback activé");
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
// ATTAQUES
// ================================
const attacks = {
    z: { damage: 25, color: "#ff0000" },
    t: { damage: 10, color: "#00ffff" }
};

let pendingAttack = null;

// ================================
// INPUT CLAVIER
// ================================
window.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    if (attacks[key] && !pendingAttack && enemy.hp > 0) {
        pendingAttack = attacks[key];
    }
});

// ================================
// DÉGÂTS FLOTTANTS
// ================================
const damageTexts = [];

function addDamageText(value, x, y, color) {
    damageTexts.push({
        value,
        x,
        y: y + 25,
        lifetime: 0.8,
        alpha: 1,
        color
    });
}

function drawDamageTexts(deltaTime) {
    for (let i = damageTexts.length - 1; i >= 0; i--) {
        const dmg = damageTexts[i];
        dmg.lifetime -= deltaTime;

        if (dmg.lifetime <= 0) {
            damageTexts.splice(i, 1);
            continue;
        }

        dmg.y += 40 * deltaTime;
        dmg.alpha = dmg.lifetime / 0.8;

        ctx.globalAlpha = dmg.alpha;
        ctx.fillStyle = dmg.color;
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText(dmg.value, dmg.x, dmg.y);
        ctx.globalAlpha = 1;
    }
}

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

function drawHealthHUD(entity, invert = false) {
    const { x, y, width, height, frameWidth, frameHeight, fallbackPadding } = entity.hudHpBar;
    const ratio = Math.max(0, entity.hp / entity.maxHp);
    const hasFrame = hudHpFrame.complete && hudHpFrame.naturalWidth !== 0;

    // Frame / bordure
    if (hasFrame) {
        ctx.drawImage(hudHpFrame, x - 20, y - 15, frameWidth, frameHeight);
    } else {
        ctx.fillStyle = "#000";
        ctx.fillRect(
            x - fallbackPadding,
            y - fallbackPadding,
            width + fallbackPadding * 2,
            height + fallbackPadding * 2
        );
    }

    // Fond barre
    ctx.fillStyle = "#400";
    ctx.fillRect(x, y, width, height);

    // Vie actuelle
    ctx.fillStyle = "#2ecc71";
    if (!invert) {
        ctx.fillRect(x, y, width * ratio, height);
    } else {
        ctx.fillRect(x + width * (1 - ratio), y, width * ratio, height);
    }
}

// ================================
// COMBAT
// ================================
function handleCombat() {
    if (!pendingAttack || enemy.hp <= 0) return;

    const { damage, color } = pendingAttack;

    enemy.hp = Math.max(0, enemy.hp - damage);

    const hud = enemy.hudHpBar;
    const ratio = enemy.hp / enemy.maxHp;
    const textX = hud.x + hud.width * (1 - ratio);

    addDamageText(damage, textX, hud.y, color);

    pendingAttack = null;
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

    drawEntity(player);
    drawHealthHUD(player);

    drawEntity(enemy);
    drawHealthHUD(enemy, true);

    handleCombat();
    drawDamageTexts(deltaTime);

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
