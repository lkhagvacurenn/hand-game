import {
  drawMaze,
  goal,
  wallsLevel1,
  wallsLevel2,
  wallsLevel3,
} from "./maze.js";
import { Player } from "./player.js";
import lottie from "lottie-web";
import { detectHand } from "./tf-handler.js";

let canvas, ctx;
let player = new Player();
let gameStarted = false;
let gameWon = false;
let gameLost = false;
let walls = [];

export function loadPage(path) {
  fetch(`/src/pages/${path}.html`)
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("app").innerHTML = html;
      window.history.pushState({}, "", `/${path === "home" ? "" : path}`);

      const lottieContainer = document.getElementById("lottie-container");
      if (path === "home" && lottieContainer) {
        lottieContainer.style.display = "block";
        playStartAnimation();
      } else if (lottieContainer) {
        lottieContainer.style.display = "none";
      }

      if (path.startsWith("level")) {
        setTimeout(() => {
          initCanvas();
          startGame(path);
        }, 0);
      }
    });
}

window.onpopstate = () => {
  const path = location.pathname.replace("/", "") || "home";
  loadPage(path);
};

document.addEventListener("DOMContentLoaded", () => {
  playStartAnimation();
  const path = location.pathname.replace("/", "") || "home";
  loadPage(path);
});

function initCanvas() {
  canvas = document.getElementById("game");
  ctx = canvas.getContext("2d");
  player = new Player();
  gameStarted = false;
  gameWon = false;
  gameLost = false;
}

function resetGame(entryX = 175, entryY = 355) {
  player.x = entryX;
  player.y = entryY;
  player.targetX = entryX;
  player.targetY = entryY;

  player.lives--;

  if (player.lives <= 0) {
    gameLost = true;
  }
}

function playStartAnimation() {
  const container = document.getElementById("lottie-container");
  lottie.loadAnimation({
    container: container,
    renderer: "svg",
    loop: false,
    autoplay: true,
    path: "/src/assets/lottie/balloons.json",
  });

  setTimeout(() => {
    container.style.display = "none";
  }, 10000);
}

function addRestartListener() {
  canvas.addEventListener("click", function () {
    if (gameLost) {
      player = new Player();
      gameLost = false;
      gameWon = false;
      gameStarted = true;

      const level = location.pathname.replace("/", "") || "level1";
      startGame(level);
    }
  });
}

export function startGame(level) {
  switch (level) {
    case "level1":
      walls = wallsLevel1;
      break;
    case "level2":
      walls = wallsLevel2;
      break;
    case "level3":
      walls = wallsLevel3;
      break;
    default:
      walls = [];
  }

  player = new Player();
  player.lives = 3;
  gameWon = false;
  gameLost = false;
  gameStarted = false;

  resetGame(175, 355);
  addRestartListener();

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
      resetGame(175, 355);
    }

    if (player.checkGoal(goal)) {
      gameWon = true;
    }

    drawMaze(ctx, walls);
    player.draw(ctx);

    if (gameWon) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.font = "30px Arial";
      ctx.textAlign = "center";
      ctx.fillText("You Win!", canvas.width / 2, canvas.height / 2);
    } else if (gameLost) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "red";
      ctx.font = "30px Arial";
      ctx.textAlign = "center";
      ctx.fillText("You Lose!", canvas.width / 2, canvas.height / 2);

      ctx.fillStyle = "white";
      ctx.font = "20px Arial";
      ctx.fillText(
        "Click to restart",
        canvas.width / 2,
        canvas.height / 2 + 40
      );
    } else if (!gameStarted) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.font = "24px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        "Loading Hand Detection...",
        canvas.width / 2,
        canvas.height / 2
      );
    }

    requestAnimationFrame(loop);
  });
}

window.loadPage = loadPage;
