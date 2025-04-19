// src/js/voice-control.js
import * as handpose from "@tensorflow-models/handpose";
import * as tf from "@tensorflow/tfjs";
import { startGame } from "./main.js";

let model,
  video,
  canvas,
  detecting = false;

export async function startVoiceBasedGameFlow() {
  video = document.getElementById("video");
  canvas = document.getElementById("game");
  const statusEl = document.getElementById("status");
  const errorEl = document.getElementById("error");

  try {
    statusEl.textContent = "Аудио заавар эхэлж байна...";
    model = await handpose.load();

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.play();

    playVoice("voice-intro.mp3", () => {
      detectFingerCount((level) => {
        const levels = ["амархан", "дунд", "хэцүү"];
        statusEl.textContent = `Та ${levels[level - 1]} үеийг сонголоо.`;

        playVoice("voice-confirm.mp3", () => {
          waitForFist(() => {
            playVoice("voice-start.mp3", () => {
              startGame(`level${level}`);
            });
          });
        });
      });
    });
  } catch (error) {
    console.error("Voice flow error:", error);
    errorEl.textContent = "Error: " + error.message;
    statusEl.textContent = "Хөдөлгөөн танихад алдаа гарлаа.";
  }
}

function playVoice(name, onEnded) {
  const audio = new Audio(`/src/assets/audio/${name}`);
  audio.play();
  if (onEnded) audio.onended = onEnded;
}

function detectFingerCount(callback) {
  detecting = true;
  const interval = setInterval(async () => {
    const predictions = await model.estimateHands(video);
    const fingers = countFingers(predictions);
    if ([1, 2, 3].includes(fingers)) {
      clearInterval(interval);
      detecting = false;
      callback(fingers);
    }
  }, 700);
}

function waitForFist(onFist) {
  const interval = setInterval(async () => {
    const predictions = await model.estimateHands(video);
    if (isFist(predictions)) {
      clearInterval(interval);
      onFist();
    }
  }, 700);
}

function countFingers(predictions) {
  if (predictions.length === 0) return 0;
  const landmarks = predictions[0].landmarks;

  const tips = [8, 12, 16, 20];
  let count = 0;
  tips.forEach((tipIndex) => {
    const tip = landmarks[tipIndex];
    const base = landmarks[tipIndex - 2];
    if (tip[1] < base[1]) count++;
  });

  const thumb = landmarks[4];
  const thumbBase = landmarks[2];
  if (thumb[0] > thumbBase[0]) count++;

  return count;
}

function isFist(predictions) {
  if (predictions.length === 0) return false;
  const landmarks = predictions[0].landmarks;

  let closedFingers = 0;
  const tips = [8, 12, 16, 20];
  tips.forEach((tipIndex) => {
    const tip = landmarks[tipIndex];
    const base = landmarks[tipIndex - 2];
    if (Math.abs(tip[1] - base[1]) < 20) closedFingers++;
  });

  return closedFingers >= 3;
}

// Тоглоомын start хуудаснаас:
// import { startVoiceBasedGameFlow } from './voice-control.js';
// startVoiceBasedGameFlow();
