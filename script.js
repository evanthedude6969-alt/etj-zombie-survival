const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 30,
    speed: 5
};

const keys = {};
const bullets = [];
const zombies = [];

let mouseX = 0;
let mouseY = 0;
let score = 0;

document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

canvas.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

canvas.addEventListener("click", () => {
    const angle = Math.atan2(mouseY - player.y, mouseX - player.x);

    bullets.push({
        x: player.x,
        y: player.y,
        dx: Math.cos(angle) * 10,
        dy: Math.sin(angle) * 10,
        size: 5
    });
});

function spawnZombie() {
    let side = Math.floor(Math.random() * 4);

    let x, y;

    if (side === 0) {
        x = Math.random() * canvas.width;
        y = -50;
    } else if (side === 1) {
        x = canvas.width + 50;
        y = Math.random() * canvas.height;
    } else if (side === 2) {
        x = Math.random() * canvas.width;
        y = canvas.height + 50;
    } else {
        x = -50;
        y = Math.random() * canvas.height;
    }

    zombies.push({
        x,
        y,
        size: 25,
        speed: 1.5
    });
}

setInterval(spawnZombie, 1500);

function update() {
    if(keys["w"]) player.y -= player.speed;
    if(keys["s"]) player.y += player.speed;
    if(keys["a"]) player.x -= player.speed;
    if(keys["d"]) player.x += player.speed;

    bullets.forEach((bullet, bulletIndex) => {
        bullet.x += bullet.dx;
        bullet.y += bullet.dy;

        zombies.forEach((zombie, zombieIndex) => {
            const dx = bullet.x - zombie.x;
            const dy = bullet.y - zombie.y;
            const distance = Math.hypot(dx, dy);

            if(distance < zombie.size) {
                zombies.splice(zombieIndex, 1);
                bullets.splice(bulletIndex, 1);
                score++;
            }
        });
    });

    zombies.forEach(zombie => {
        const angle = Math.atan2(
            player.y - zombie.y,
            player.x - zombie.x
        );

        zombie.x += Math.cos(angle) * zombie.speed;
        zombie.y += Math.sin(angle) * zombie.speed;
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "lime";
    ctx.fillRect(
        player.x - player.size/2,
        player.y - player.size/2,
        player.size,
        player.size
    );

    ctx.fillStyle = "yellow";
    bullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.size, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.fillStyle = "red";
    zombies.forEach(zombie => {
        ctx.beginPath();
        ctx.arc(zombie.x, zombie.y, zombie.size, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Score: " + score, 20, 40);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
