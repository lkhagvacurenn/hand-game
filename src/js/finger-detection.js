// finger-detection.js
export async function startFingerDetection() {
  const video = document.getElementById("finger-video");
  const status = document.getElementById("finger-status");

  if (!window.handpose || !window.tf) {
    status.textContent = "Loading models...";
    throw new Error("TensorFlow or Handpose not loaded");
  }

  const model = await handpose.load();
  status.textContent = "Camera ready! Show 1 finger for Mouse, 5 for Rabbit";

  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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
          status.textContent = "Mouse selected! Now show fingers for level: 1-Easy, 2-Medium, 3-Hard";
          startLevelDetection(model, video, status);
        } else if (count === 5) {
          clearInterval(characterDetectLoop);
          window.selectedCharacter = "rabbit";
          status.textContent = "Rabbit selected! Now show fingers for level: 1-Easy, 2-Medium, 3-Hard";
          startLevelDetection(model, video, status);
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
        status.textContent = "Starting Easy Level...";
        setTimeout(() => loadPage("level1"), 1000);
      } else if (count === 2) {
        clearInterval(detectLoop);
        status.textContent = "Starting Medium Level...";
        setTimeout(() => loadPage("level2"), 1000);
      } else if (count === 3) {
        clearInterval(detectLoop);
        status.textContent = "Starting Hard Level...";
        setTimeout(() => loadPage("level3"), 1000);
      }
    }
  }, 700);
}