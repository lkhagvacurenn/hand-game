// src/js/main.js
import { drawMaze, goal, wallsLevel1, wallsLevel2, wallsLevel3 } from './maze.js';
import { Player } from './player.js';
import lottie from 'lottie-web';
import { detectHand } from './tf-handler.js';

let canvas, ctx;
let player = new Player();
let gameStarted = false;
let gameWon = false;
let walls = [];

export function loadPage(path) {
  fetch(`/src/pages/${path}.html`)
    .then(res => res.text())
    .then(html => {
      document.getElementById('app').innerHTML = html;
      window.history.pushState({}, '', `/${path=== 'home' ? '' : path}`);

      const lottieContainer = document.getElementById('lottie-container');
      if (path === 'home' && lottieContainer) {
        lottieContainer.style.display = 'block';
        playStartAnimation();
      } else if (lottieContainer) {
        lottieContainer.style.display = 'none';
      }

      if (path.startsWith('level')) {
        setTimeout(() => {
          initCanvas();
          startGame(path);
        }, 0);
      }
    });
}


window.onpopstate = () => {
  const path = location.pathname.replace('/', '') || 'home';
  loadPage(path);
};

document.addEventListener('DOMContentLoaded', () => {
  playStartAnimation();
  const path = location.pathname.replace('/', '') || 'home';
  loadPage(path);
});

function initCanvas() {
  canvas = document.getElementById('game');
  ctx = canvas.getContext('2d');
  player = new Player();
  gameStarted = false;
  gameWon = false;
}

function resetGame(entryX , entryY) {
  player.x = entryX;
  player.y = entryY;
  player.targetX = entryX;
  player.targetY = entryY;
  player.lives = 3;
}

  function playStartAnimation() {
    const container = document.getElementById('lottie-container');
    lottie.loadAnimation({
      container: container,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      path: '/src/assets/lottie/balloons.json'
    });
  
    // Optional fade-out after 3 seconds
    setTimeout(() => {
      container.style.display = 'none';
    }, 10000);
  }
  

export function startGame(level) {
  
  switch (level) {
    case 'level1':
      walls = wallsLevel1;
      resetGame(175, 355);
      break;
    case 'level2':
      walls = wallsLevel2;
      resetGame(175, 355);
      break;
    case 'level3':
      walls = wallsLevel3;
      resetGame(175, 355);
      break;
    default:
      walls = [];
  }

  drawLoop();
  detectHand(player).then(() => {
    gameStarted = true;
  });
}

function drawLoop() {
  requestAnimationFrame(function loop() {
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.update();

    if (player.checkCollision(walls)) {
      resetGame();
    }

    if (player.checkGoal(goal)) {
      gameWon = true;
    }

    drawMaze(ctx, walls);
    player.draw(ctx);

    if (gameWon) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.font = '30px Arial';
      ctx.fillText('You Win!', canvas.width / 2, canvas.height / 2);
    } else if (!gameStarted) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.font = '24px Arial';
      ctx.fillText('Loading Hand Detection...', canvas.width / 2, canvas.height / 2);
    }

    requestAnimationFrame(loop);
  });
}

window.loadPage = loadPage;