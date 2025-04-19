export const wallsLevel1 = [
  // Gadaad hananuud
  { x: 200, y: 350, width: 350, height: 10 },
  { x: 550, y: 50, width: 10, height: 310 },
  { x: 200, y: 50, width: 350, height: 10 },
  { x: 50, y: 50, width: 100, height: 10 },
  { x: 50, y: 50, width: 10, height: 300 },
  { x: 50, y: 350, width: 10, height: 10 },
  { x: 50, y: 350, width: 100, height: 10 },
  { x: 200, y: 350, width: 10, height: 10 },
  // Dotor zam
  { x: 150, y: 100, width: 200, height: 10 },
  { x: 450, y: 150, width: 100, height: 10 },
  { x: 50, y: 200, width: 100, height: 10 },
  { x: 250, y: 200, width: 100, height: 10 },
  { x: 350, y: 250, width: 200, height: 10 },
  { x: 50, y: 300, width: 200, height: 10 },
];

// Level 2-ийн хананууд
export const wallsLevel2 = [
  // Gadaad hananuud
  { x: 200, y: 350, width: 350, height: 10 },
  { x: 550, y: 50, width: 10, height: 310 },
  { x: 200, y: 50, width: 350, height: 10 },
  { x: 50, y: 50, width: 100, height: 10 },
  { x: 50, y: 50, width: 10, height: 300 },
  { x: 50, y: 350, width: 10, height: 10 },
  { x: 50, y: 350, width: 100, height: 10 },
  { x: 200, y: 350, width: 10, height: 10 },
  // Dotor zam
  { x: 300, y: 50, width: 10, height: 50 },
  { x: 350, y: 100, width: 10, height: 50 },
  { x: 350, y: 140, width: 200, height: 10 },
  { x: 350, y: 100, width: 50, height: 10 },
  { x: 50, y: 100, width: 150, height: 10 },
  { x: 200, y: 100, width: 10, height: 50 },
  { x: 200, y: 140, width: 100, height: 10 },
  { x: 250, y: 200, width: 300, height: 10 },
  { x: 100, y: 150, width: 50, height: 10 },
  { x: 100, y: 150, width: 10, height: 100 },
  { x: 100, y: 250, width: 200, height: 10 },
  { x: 140, y: 150, width: 10, height: 150 },
  { x: 140, y: 300, width: 300, height: 10 },
];

// Level 3-ийн хананууд
export const wallsLevel3 = [
  // Gadaad hananuud
  { x: 200, y: 350, width: 350, height: 10 },
  { x: 550, y: 50, width: 10, height: 310 },
  { x: 200, y: 50, width: 350, height: 10 },
  { x: 50, y: 50, width: 100, height: 10 },
  { x: 50, y: 50, width: 10, height: 300 },
  { x: 50, y: 350, width: 10, height: 10 },
  { x: 50, y: 350, width: 100, height: 10 },
  { x: 200, y: 350, width: 10, height: 10 },
  // Dotor zam
  { x: 140, y: 250, width: 10, height: 100 },
  { x: 200, y: 300, width: 10, height: 50 },
  { x: 140, y: 240, width: 120, height: 10 },
  { x: 260, y: 150, width: 10, height: 150 },
  { x: 320, y: 210, width: 10, height: 150 },
  { x: 320, y: 210, width: 50, height: 10 },
  { x: 260, y: 150, width: 120, height: 10 },
  { x: 440, y: 150, width: 50, height: 10 },
  { x: 390, y: 250, width: 50, height: 10 },
  { x: 390, y: 250, width: 10, height: 50 },
  { x: 390, y: 300, width: 100, height: 10 },
  { x: 490, y: 50, width: 10, height: 200 },
  { x: 440, y: 50, width: 10, height: 100 },
  { x: 200, y: 100, width: 180, height: 10 },
  { x: 250, y: 50, width: 10, height: 50 },
  { x: 200, y: 100, width: 10, height: 90 },
  { x: 110, y: 180, width: 90, height: 10 },
  { x: 50, y: 100, width: 100, height: 10 },
];

export const goal = { x: 180, y: 50, width: 20, height: 20 };

export function drawMaze(ctx, walls) {
  // Хананууд зурах
  ctx.fillStyle = "pink";
  walls.forEach((wall) => {
    ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
  });

  // Бяслаг зурах (flag зургийн оронд)
  const cheeseX = goal.x;
  const cheeseY = goal.y;
  const cheeseSize = 10;

  // Бяслагны үндсэн хэсэг - шар өнгөтэй тойрог
  ctx.fillStyle = "#FFD700"; // Алтлаг шар
  ctx.beginPath();
  ctx.arc(cheeseX, cheeseY, cheeseSize, 0, Math.PI * 2);
  ctx.fill();

  // Бяслагны захыг арай гүн шар өнгөөр зурах
  ctx.strokeStyle = "#DAA520"; // Darker gold
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cheeseX, cheeseY, cheeseSize, 0, Math.PI * 2);
  ctx.stroke();

  // Бяслагны нүхнүүд
  ctx.fillStyle = "#FFA500"; // Улбар шар

  // Дунд нүх
  ctx.beginPath();
  ctx.arc(cheeseX, cheeseY, 4, 0, Math.PI * 2);
  ctx.fill();

  // Бусад нүхнүүд
  ctx.beginPath();
  ctx.arc(cheeseX - 7, cheeseY + 5, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cheeseX + 8, cheeseY - 6, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cheeseX + 5, cheeseY + 8, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cheeseX - 6, cheeseY - 7, 3, 0, Math.PI * 2);
  ctx.fill();

  // Тоглоомын эхлэх цэг
  ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.arc(175, 355, 10, 0, Math.PI * 2);
  ctx.fill();
}
