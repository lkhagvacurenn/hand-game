export class Player {
    constructor() {
        this.x = 175;
        this.y = 355;
        this.size = 20;
        this.lives = 3;
        this.targetX = 175;
        this.targetY = 355;
        this.speed = 0.2; // Movement smoothing factor
        this.image = new Image();
        this.image.src = '/src/assets/image/car.png';
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
        // Draw lives indicator
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.fillText(`Lives: ${this.lives}`, 20, 30);
    }

    update() {
        // Smooth movement
        this.x += (this.targetX - this.x) * this.speed;
        this.y += (this.targetY - this.y) * this.speed;
    }

    moveTo(handX, handY) {
        // Гарийн чиглэлийн дагуу хөдөлнө
        if (handY < this.y - 10) { // Дээш
            this.targetY -= 5; // Дээш хөдлөх
        } else if (handY > this.y + 10) { // Доош
            this.targetY += 5; // Доош хөдлөх
        }
        
        if (handX < this.x - 10) { // Зүүн
            this.targetX -= 5; // Зүүн хөдлөх
        } else if (handX > this.x + 10) { // Баруун
            this.targetX += 5; // Баруун хөдлөх
        }
    }
    
    // Check if player collides with a wall
    checkCollision(walls) {
        for (const wall of walls) {
            if (this.x + this.size > wall.x && 
                this.x - this.size < wall.x + wall.width &&
                this.y + this.size > wall.y && 
                this.y - this.size < wall.y + wall.height) {
                return true;
            }
        }
        return false;
    }
    
    // Check if player reached the goal
    checkGoal(goal) {
        return (this.x + this.size > goal.x && 
                this.x - this.size < goal.x + goal.width &&
                this.y + this.size > goal.y && 
                this.y - this.size < goal.y + goal.height);
    }
}