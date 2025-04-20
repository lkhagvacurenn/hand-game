export async function detectHand(player) {
  const video = document.getElementById("video");
  const canvas = document.getElementById("game");
  const statusEl = document.getElementById("status");
  const errorEl = document.getElementById("error");

  // let isPaused = false;

  // const RIGHT = 0; // Баруун (→): 0° – 45°
  // const DOWN = Math.PI; // Доош (↓): 180° – 360°
  // const LEFT = (Math.PI * 3) / 2; // Зүүн (←): 135° – 180°
  // const UP = Math.PI / 2; // Дээш (↑): 45° – 135°

  // function limitToLeftHandDirection(direction) {
  //   direction = direction % (2 * Math.PI);
  //   if (direction < 0) direction += 2 * Math.PI;

  //   const PI = Math.PI;
  //   const PI_8 = PI / 8; // 22.5 градус
  //   const PI_4 = PI / 4; // 45 градус
  //   const PI_2 = PI / 2; // 90 градус

  //   // Дээш, жоохон зүүн тийш: [π/4, π/2 - π/8)
  //   if (direction >= PI_4 && direction < PI_2 - PI_8) {
  //     return LEFT;
  //   }

  //   // Дээш, жоохон баруун тийш: [π/2 - π/8, π/2 + π/8)
  //   else if (direction >= PI_2 - PI_8 && direction < PI_2 + PI_8) {
  //     return UP;
  //   }

  //   // Дээшээс баруун тийш хазайсан: [π/2 + π/8, 3π/4)
  //   else if (direction >= PI_2 + PI_8 && direction < (3 * PI) / 4) {
  //     return RIGHT;
  //   }

  //   // Баруун тал, гэхдээ доошоо бага зэрэг хазайсан: [3π/4, 5π/4)
  //   else if (direction >= (3 * PI) / 4 && direction < (5 * PI) / 4) {
  //     return DOWN;
  //   }

  //   // Зүүн тал руу бага зэрэг доош хазайсан: [5π/4, 7π/4)
  //   else if (direction >= (5 * PI) / 4 && direction < (7 * PI) / 4) {
  //     return DOWN;
  //   }

  //   // Зүүн чиглэл: [7π/4, 2π) ∪ [0, π/4)
  //   else {
  //     return LEFT;
  //   }
  // }

  const RIGHT = Math.PI;
  const DOWN = (3 * Math.PI) / 2;
  const LEFT = 0;
  const UP = Math.PI / 2;

  let isPaused = false;

  function limitToLeftHandDirection(direction) {
    direction = direction % (2 * Math.PI);
    if (direction < 0) {
      direction += 2 * Math.PI;
    }

    const PI = Math.PI;
    const PI_4 = PI / 4;

    // Баруун: [3π/4, 5π/4)
    if (direction >= (3 * PI) / 4 && direction < (5 * PI) / 4) {
      return RIGHT;
    }

    // Доош: [5π/4, 7π/4)
    else if (direction >= (5 * PI) / 4 && direction < (7 * PI) / 4) {
      return DOWN;
    }

    // Зүүн: [7π/4, 2π) ∪ [0, π/4)
    else if (direction >= (7 * PI) / 4 || direction < PI_4) {
      return LEFT;
    }

    // Дээш: [π/4, 3π/4)
    else {
      return UP;
    }
  }

  function getDirectionName(direction) {
    if (direction === RIGHT) return "баруун";
    if (direction === DOWN) return "доош";
    if (direction === LEFT) return "зүүн";
    if (direction === UP) return "дээш";
    return "тодорхойгүй";
  }

  try {
    statusEl.textContent = "Loading handpose model...";

    // Check if TensorFlow.js and handpose are loaded
    if (!window.tf) {
      throw new Error("TensorFlow.js is not loaded");
    }

    if (!window.handpose) {
      throw new Error("Handpose model is not loaded");
    }

    // Load the model
    const model = await window.handpose.load();
    statusEl.textContent =
      "Hand detection ready! Allow camera access when prompted.";

    // Get webcam access
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: 640,
        height: 480,
      },
    });
    video.srcObject = stream;

    // Make video visible during development (can hide in production)
    video.style.display = "block";
    video.style.position = "absolute";
    video.style.bottom = "10px";
    video.style.right = "10px";
    video.style.width = "160px";
    video.style.height = "120px";
    video.style.transform = "scaleX(-1)"; // Mirror the video

    statusEl.textContent = "Playing! Move your hand to control the red ball.";

    // Wait for video to be ready
    return new Promise((resolve) => {
      video.onloadedmetadata = () => {
        video.play();
        const overlay = document.getElementById("video-overlay");
        if (overlay) {
          overlay.style.display = "none"; 
        }
      

        // Start hand detection
        setInterval(async () => {
          try {
            const predictions = await model.estimateHands(video);
            if (predictions.length > 0) {
              const palmBase = predictions[0].landmarks[0];
              const thumbTip = predictions[0].landmarks[4];

              // Gesture хэлбэр таних
              function isFingerUp(tip, base) {
                const distance = Math.abs(base[1] - tip[1]);
                const handHeight = Math.abs(
                  predictions[0].boundingBox.bottomRight[1] -
                    predictions[0].boundingBox.topLeft[1]
                );
                return tip[1] < base[1] && distance > handHeight * 0.4; // дээш 20%
              }

              function isFingerLeft(tip, base) {
                const distance = Math.abs(tip[0] - base[0]);
                const handHeight = Math.abs(
                  predictions[0].boundingBox.bottomRight[1] -
                    predictions[0].boundingBox.topLeft[1]
                );
                return tip[0] < base[0] && distance > handHeight * 0.4; // зүүн
              }

              function isFingerRight(tip, base) {
                const distance = Math.abs(tip[0] - base[0]);
                const handWidth = Math.abs(
                  predictions[0].boundingBox.bottomRight[0] -
                    predictions[0].boundingBox.topLeft[0]
                );
                return tip[0] > base[0] && distance > handWidth * 0.4; // баруун
              }

              function isFingerDown(tip, base) {
                const distance = Math.abs(tip[1] - base[1]);
                const handWidth = Math.abs(
                  predictions[0].boundingBox.bottomRight[0] -
                    predictions[0].boundingBox.topLeft[0]
                );
                return tip[1] > base[1] && distance > handWidth * 0.4; // доошоо
              }

              function isFingerCurled(tip, base, prediction) {
                const distance = Math.hypot(tip[0] - base[0], tip[1] - base[1]);
                const handHeight = Math.abs(
                  prediction.boundingBox.bottomRight[1] -
                    prediction.boundingBox.topLeft[1]
                );

                const isClose = distance < handHeight * 0.25;
                const isBentDownward = tip[1] > base[1];
                const isBentInward = tip[0] < base[0];

                return isClose && (isBentDownward || isBentInward);
              }

              //Өнцөг тооцоолох функц
              function getAngle(tip, base) {
                const dx = tip[0] - base[0];
                const dy = base[1] - tip[1];
                return Math.atan2(dy, dx);
              }

              const angle = getAngle(thumbTip, palmBase);
              const limitedDirection = limitToLeftHandDirection(angle);
              const gestureDirection = getDirectionName(limitedDirection);

              const isthumbUp = isFingerUp(thumbTip, palmBase);
              const isthumbLeft = isFingerLeft(thumbTip, palmBase);
              const isthumbRight = isFingerRight(thumbTip, palmBase);
              const isthumbDown = isFingerDown(thumbTip, palmBase);
              const isthumbCurled = isFingerCurled(
                thumbTip,
                palmBase,
                predictions[0]
              );

              console.log("LEFT:", isthumbLeft);
              console.log("RIGHT:", isthumbRight);
              console.log("Up", isthumbUp);
              console.log("DOWN", isthumbDown);
              console.log("CURLED:", isthumbCurled); // Энэ нэмэгдсэн
              console.log("gestureDirection:", gestureDirection);

              if (isthumbCurled) {
                isPaused = !isPaused; // Toggle the pause state
                statusEl.textContent = isPaused
                  ? "Тоглоом түр зогссон. Гараа атгаж дахин эхлүүлнэ үү."
                  : "Тоглоом үргэлжилж байна!";

                // Add a small delay to prevent rapid toggling
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return;
              }

              // Gesture танигдсан бол тоглогчийг хөдөлгөх
              if (!isPaused && gestureDirection !== "тодорхойгүй") {
                const moveSpeed = 4;

                switch (gestureDirection) {
                  case "дээш":
                    player.targetY -= moveSpeed;
                    break;
                  case "доош":
                    player.targetY += moveSpeed;
                    break;
                  case "зүүн":
                    player.targetX -= moveSpeed;
                    break;
                  case "баруун":
                    player.targetX += moveSpeed;
                    break;
                }

                // Canvas хязгаар шалгах
                player.targetX = Math.max(
                  0,
                  Math.min(canvas.width, player.targetX)
                );
                player.targetY = Math.max(
                  0,
                  Math.min(canvas.height, player.targetY)
                );
                const emojiMap = {
                  "баруун": "👉",
                  "доош": "👇",
                  "зүүн": "👈",
                  "дээш": "👆",
                };
                statusEl.textContent = `Gesture чиглэл: ${emojiMap[gestureDirection] || "❓"}`;
              }
            }
          } catch (error) {
            console.error("Hand detection error:", error.name, error.message);
            errorEl.textContent = `Error: ${error.name} - ${error.message}`;
          }
        }, 100);

        resolve();
      };
    });
  } catch (error) {
    console.error("Hand detection setup error:", error.name, error.message);
    errorEl.textContent = `Setup error: ${error.name} - ${error.message}`;
    statusEl.textContent = "Hand detection failed to load.";
    return Promise.reject(error);
  }
}
