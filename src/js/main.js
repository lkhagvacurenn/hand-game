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
  const basePath = path.startsWith("level") ? "level" : path;

  fetch(`/src/pages/${basePath}.html`)
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("app").innerHTML = html;
      window.history.pushState({}, "", `/${path === "home" ? "" : path}`);

      const lottieContainer = document.getElementById("lottie-container");
      if (path === "home" && lottieContainer) {
        lottieContainer.style.display = "block";
        playStartAnimation();
        import("./finger-detection.js").then((mod) => {
          mod.startFingerDetection();
        });
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
  // Start background music
const music = document.getElementById("bg-music");
if (music) {
  music.volume = 0.4;
  music.currentTime = 0;
  music.play().catch((e) => console.warn("Autoplay blocked:", e));
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
      const lottieWin = document.getElementById("winner-lottie");
      const music = document.getElementById("bg-music");
    if (music) music.pause();

      if (lottieWin && lottieWin.childElementCount === 0) {
        lottieWin.classList.remove("hidden");
        lottie.loadAnimation({
          container: lottieWin,
          renderer: "svg",
          loop: false,
          autoplay: true,
          path: "/src/assets/lottie/congrats.json",
        });
    
        setTimeout(() => {
          lottieWin.classList.add("hidden");
          loadPage("home"); 
        }, 5000); 
      }
    }
    else if (gameLost) {
      const lottieLost = document.getElementById("lost-lottie");
      const music = document.getElementById("bg-music");
      if (music) music.pause();

      if (lottieLost && lottieLost.childElementCount === 0) {
        lottieLost.classList.remove("hidden");
        lottie.loadAnimation({
          container: lottieLost,
          renderer: "svg",
          loop: false,
          autoplay: true,
          path: "/src/assets/lottie/lost.json"
        });
    
        setTimeout(() => {
          lottieLost.classList.add("hidden");
          const level = location.pathname.replace("/", "") || "level1";
          loadPage(level);
        }, 5000);
      }
    }
     else if (!gameStarted) {
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
