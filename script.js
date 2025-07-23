const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Paddle settings
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const PADDLE_SPEED = 7;

// Ball settings
const BALL_SIZE = 12;
let ballX = WIDTH / 2 - BALL_SIZE / 2;
let ballY = HEIGHT / 2 - BALL_SIZE / 2;
let ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);

// Player paddle (left)
let playerY = HEIGHT / 2 - PADDLE_HEIGHT / 2;

// Computer paddle (right)
let computerY = HEIGHT / 2 - PADDLE_HEIGHT / 2;

// Score
let playerScore = 0;
let computerScore = 0;

// Input
let upPressed = false;
let downPressed = false;

// Mouse move handler for player paddle
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  playerY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, playerY));
});

// Keyboard handler for player paddle
window.addEventListener('keydown', (e) => {
  if (e.key === "ArrowUp") upPressed = true;
  if (e.key === "ArrowDown") downPressed = true;
});
window.addEventListener('keyup', (e) => {
  if (e.key === "ArrowUp") upPressed = false;
  if (e.key === "ArrowDown") downPressed = false;
});

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawBall(x, y) {
  ctx.fillStyle = "#fff";
  ctx.fillRect(x, y, BALL_SIZE, BALL_SIZE);
}

function drawNet() {
  ctx.fillStyle = "#fff";
  for (let i = 0; i < HEIGHT; i += 30) {
    ctx.fillRect(WIDTH/2 - 1, i, 2, 20);
  }
}

function resetBall() {
  ballX = WIDTH / 2 - BALL_SIZE / 2;
  ballY = HEIGHT / 2 - BALL_SIZE / 2;
  ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
  ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

function updateScoreboard() {
  document.getElementById('playerScore').textContent = playerScore;
  document.getElementById('computerScore').textContent = computerScore;
}

function moveComputer() {
  // Simple AI: follows the ball with some delay
  let target = ballY - PADDLE_HEIGHT / 2 + BALL_SIZE / 2;
  if (computerY < target) {
    computerY += Math.min(PADDLE_SPEED - 2, target - computerY);
  } else if (computerY > target) {
    computerY -= Math.min(PADDLE_SPEED - 2, computerY - target);
  }
  computerY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, computerY));
}

function movePlayer() {
  if (upPressed) {
    playerY -= PADDLE_SPEED;
  }
  if (downPressed) {
    playerY += PADDLE_SPEED;
  }
  playerY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, playerY));
}

function collision(x, y, w, h, ballX, ballY, ballSize) {
  return (
    ballX < x + w &&
    ballX + ballSize > x &&
    ballY < y + h &&
    ballY + ballSize > y
  );
}

function update() {
  // Move ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Wall collision (top/bottom)
  if (ballY <= 0 || ballY + BALL_SIZE >= HEIGHT) {
    ballSpeedY = -ballSpeedY;
  }

  // Left paddle collision
  if (collision(0, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, ballX, ballY, BALL_SIZE)) {
    ballSpeedX = Math.abs(ballSpeedX);
    // Add some randomness
    ballSpeedY += (Math.random() - 0.5) * 2;
    ballX = PADDLE_WIDTH; // prevent stuck
  }

  // Right paddle collision
  if (collision(WIDTH - PADDLE_WIDTH, computerY, PADDLE_WIDTH, PADDLE_HEIGHT, ballX, ballY, BALL_SIZE)) {
    ballSpeedX = -Math.abs(ballSpeedX);
    ballSpeedY += (Math.random() - 0.5) * 2;
    ballX = WIDTH - PADDLE_WIDTH - BALL_SIZE; // prevent stuck
  }

  // Score update
  if (ballX < 0) {
    computerScore++;
    updateScoreboard();
    resetBall();
  }
  if (ballX + BALL_SIZE > WIDTH) {
    playerScore++;
    updateScoreboard();
    resetBall();
  }

  moveComputer();
  movePlayer();
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  drawNet();
  // Paddles
  drawRect(0, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, "#0ff");
  drawRect(WIDTH - PADDLE_WIDTH, computerY, PADDLE_WIDTH, PADDLE_HEIGHT, "#f00");
  // Ball
  drawBall(ballX, ballY);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Init scoreboard
updateScoreboard();
gameLoop();