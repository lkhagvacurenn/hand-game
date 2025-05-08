import { loadPage } from "./main";

// finger-detection.js
export async function startFingerDetection() {
  const video = document.getElementById("finger-video");
  const status = document.getElementById("finger-status");

  if (!window.handpose || !window.tf) {
    status.textContent = "Loading models...";
    throw new Error("TensorFlow or Handpose not loaded");
  }

  const model = window.handposeModel || await handpose.load();
  window.handposeModel = model;
  status.textContent = "Тоглоом эхэллээ. 1 эсвэл 5 хуруу гарган тоглох баатараа сонгоорой.";

  const stream = window.cameraStream || await navigator.mediaDevices.getUserMedia({video: true})
  window.cameraStream = stream;
  video.srcObject = stream;

  video.onloadedmetadata = () => {
    video.play();

    // Баатар сонгох давталт
    const characterDetectLoop = setInterval(async () => {
      const predictions = await model.estimateHands(video);
      if (predictions.length > 0) {
        const hand = predictions[0];
        const lm = hand.landmarks;

        const fingers = [
          [8, 6],   // index
          [12, 10], // middle
          [16, 14], // ring
          [20, 18], // pinky
        ];

        let count = 0;

        fingers.forEach(([tip, pip]) => {
          if (lm[tip][1] < lm[pip][1]) {
            count++;
          }
        });

        // Эрхий хурууг шалгах
        if (Math.abs(lm[4][0] - lm[2][0]) > 40) {
          count++;
        }

        if (count === 1) {
          clearInterval(characterDetectLoop);
          window.selectedCharacter = "mouse";
          startLevelDetection(model, video, status);
          window.selectedCharacter = "mouse";
          setTimeout(() => loadPage("select-level"), 1000);
          status.textContent = "Хулгана сонгогдлоо";
        } else if (count === 5) {
          clearInterval(characterDetectLoop);
          window.selectedCharacter = "rabbit";
          startLevelDetection(model, video, status);
          window.selectedCharacter = "rabbit";
          setTimeout(() => loadPage("select-level"), 1000);
          status.textContent = "Туулай сонгогдлоо";
        }
      }
    }, 700);
  };
}

function startLevelDetection(model, video, status) {
  const detectLoop = setInterval(async () => {
    const predictions = await model.estimateHands(video);
    if (predictions.length > 0) {
      const hand = predictions[0];
      const lm = hand.landmarks;

      const fingers = [
        [8, 6],   // index
        [12, 10], // middle
        [16, 14], // ring
        [20, 18], // pinky
      ];

      let count = 0;

      fingers.forEach(([tip, pip]) => {
        if (lm[tip][1] < lm[pip][1]) {
          count++;
        }
      });

      if (Math.abs(lm[4][0] - lm[2][0]) > 40) {
        count++;
      }

      if (count === 1) {
        clearInterval(detectLoop);
        status.textContent = "Анхан үе шат эхэллээ...";
        setTimeout(() => loadPage("level1"), 1000);
      } else if (count === 2) {
        clearInterval(detectLoop);
        status.textContent = "Дунд үе шат эхэллээ...";
        setTimeout(() => loadPage("level2"), 1000);
      } else if (count === 3) {
        clearInterval(detectLoop);
        status.textContent = "Хэцүү үе шат эхэллээ...";
        setTimeout(() => loadPage("level3"), 1000);
      }
    }
  }, 700);
}



export {startLevelDetection};