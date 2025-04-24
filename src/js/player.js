export class Player {
  constructor(type = "mouse") {
    this.x = 175;
    this.y = 355;
    this.size = 10;
    this.lives = 3;
    this.targetX = 175;
    this.targetY = 355;
    this.speed = 0.2;
    this.type = type;
}


  draw(ctx) {
      if (this.type === "mouse") {
          this.drawMouse(ctx);
      } else if (this.type === "rabbit") {
          this.drawRabbit(ctx);
      }
      ctx.fillStyle = "black";
      ctx.font = "16px Arial";
      ctx.fillText(`Lives: ${this.lives}`, 20, 30);
  }

  drawMouse(ctx) {
    // Draw the mouse character
    ctx.save();

    // Basic body - light gray circle (хэмжээг багасгах)
    ctx.fillStyle = "#BBB";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 10, 0, Math.PI * 2); // 15-с 10 болгож багасгах
    ctx.fill();

    // Ears (хэмжээг багасгах)
    ctx.fillStyle = "#AAA";
    // Left ear
    ctx.beginPath();
    ctx.arc(this.x - 7, this.y - 7, 5, 0, Math.PI * 2); // 10-7, 10-7, 8-5 болгож багасгах
    ctx.fill();
    // Right ear
    ctx.beginPath();
    ctx.arc(this.x + 7, this.y - 7, 5, 0, Math.PI * 2); // Мөн адил
    ctx.fill();

    // Nose - pink triangle (хэмжээг багасгах)
    ctx.fillStyle = "#FFB6C1";
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + 3); // 5-с 3 болгож багасгах
    ctx.lineTo(this.x - 3, this.y); // 5-с 3 болгох
    ctx.lineTo(this.x + 3, this.y); // 5-с 3 болгох
    ctx.closePath();
    ctx.fill();

    // Eyes - black dots (хэмжээг багасгах)
    ctx.fillStyle = "black";
    // Left eye
    ctx.beginPath();
    ctx.arc(this.x - 3, this.y - 1, 1.5, 0, Math.PI * 2); // 5-3, 2-1, 2-1.5 болгох
    ctx.fill();
    // Right eye
    ctx.beginPath();
    ctx.arc(this.x + 3, this.y - 1, 1.5, 0, Math.PI * 2); // Мөн адил
    ctx.fill();

    // Whiskers (хэмжээг багасгах)
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 0.7; // 1-с 0.7 болгох
    // Left whiskers
    ctx.beginPath();
    ctx.moveTo(this.x - 3, this.y + 1); // 5-3, 2-1 болгох
    ctx.lineTo(this.x - 13, this.y); // 20-13 болгох
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(this.x - 3, this.y + 1); // 5-3, 2-1 болгох
    ctx.lineTo(this.x - 13, this.y + 3); // 20-13, 5-3 болгох
    ctx.stroke();
    // Right whiskers
    ctx.beginPath();
    ctx.moveTo(this.x + 3, this.y + 1); // 5-3, 2-1 болгох
    ctx.lineTo(this.x + 13, this.y); // 20-13 болгох
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(this.x + 3, this.y + 1); // 5-3, 2-1 болгох
    ctx.lineTo(this.x + 13, this.y + 3); // 20-13, 5-3 болгох
    ctx.stroke();

    // Tail (хэмжээг багасгах)
    ctx.strokeStyle = "#AAA";
    ctx.lineWidth = 2; // 3-с 2 болгох
    ctx.beginPath();
    ctx.moveTo(this.x - 7, this.y + 7); // 10-7, 10-7 болгох
    ctx.quadraticCurveTo(this.x - 20, this.y + 14, this.x - 17, this.y + 3); // 30-20, 20-14, 25-17, 5-3 болгох
    ctx.stroke();

    ctx.restore();
  }

  drawRabbit(ctx) {
    ctx.save();
    ctx.fillStyle = "#BBB";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#AAA";
    ctx.beginPath();
    ctx.ellipse(this.x - 5, this.y - 12, 2, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(this.x + 5, this.y - 12, 2, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.x - 3, this.y - 1, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.x + 3, this.y - 1, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FFB6C1";
    ctx.beginPath();
    ctx.arc(this.x, this.y + 2, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#BBB";
    ctx.beginPath();
    ctx.arc(this.x, this.y + 8, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  update() {
    // Smooth movement
    this.x += (this.targetX - this.x) * this.speed;
    this.y += (this.targetY - this.y) * this.speed;
  }

  moveTo(handX, handY) {
    // Гарийн чиглэлийн дагуу хөдөлнө
    if (handY < this.y - 10) {
      // Дээш
      this.targetY -= 5; // Дээш хөдлөх
    } else if (handY > this.y + 10) {
      // Доош
      this.targetY += 5; // Доош хөдлөх
    }

    if (handX < this.x - 10) {
      // Зүүн
      this.targetX -= 5; // Зүүн хөдлөх
    } else if (handX > this.x + 10) {
      // Баруун
      this.targetX += 5; // Баруун хөдлөх
    }
  }

  checkCollision(walls) {
    for (const wall of walls) {
      if (
        this.x + this.size / 2 > wall.x &&
        this.x - this.size / 2 < wall.x + wall.width &&
        this.y + this.size / 2 > wall.y &&
        this.y - this.size / 2 < wall.y + wall.height
      ) {
        return true;
      }
    }
    return false;
  }

  checkGoal(goal) {
    return (
      this.x + this.size / 2 > goal.x &&
      this.x - this.size / 2 < goal.x + goal.width &&
      this.y + this.size / 2 > goal.y &&
      this.y - this.size / 2 < goal.y + goal.height
    );
  }
}
