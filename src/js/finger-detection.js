export async function startFingerDetection() {
    const video = document.getElementById("finger-video");
    const status = document.getElementById("finger-status");
  
    if (!window.handpose || !window.tf) {
      status.textContent = "Loading models...";
      throw new Error("TensorFlow or Handpose not loaded");
    }
  
    const model = await handpose.load();
    status.textContent = "Camera ready!";
  
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  
    video.onloadedmetadata = () => {
      video.play();
  
      const detectLoop = setInterval(async () => {
        const predictions = await model.estimateHands(video);
        if (predictions.length > 0) {
          const hand = predictions[0];
          const lm = hand.landmarks;
  
          // Finger joints: [tipIndex, pipIndex] (e.g., [8, 6] means tip of index and joint below it)
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
  
          // Thumb: Check if it's extended away from palm
          if (Math.abs(lm[4][0] - lm[2][0]) > 40) {
            count++;
          }
  
          status.textContent = `Detected ${count} finger${count !== 1 ? "s" : ""}`;
  
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
    };
  }
  