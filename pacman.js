// First, ensure that the DOM content is fully loaded before initializing game elements
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the Pacman class
    const pacman = new Pacman(0, 0, 20, 20, 5); // Example initialization, adjust parameters as needed
});

class Pacman {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = 4; // Assuming 4 represents the right direction
        this.nextDirection = 4; // Start with the same direction
        this.frameCount = 7;
        this.currentFrame = 1;

        // Assuming pacmanFrames is the ID of your Pacman sprite image in the HTML
        this.pacmanFrames = document.getElementById("animations");

        // Regularly update the animation frame
        setInterval(() => {
            this.changeAnimation();
        }, 100);
    }

    moveProcess() {
        this.changeDirectionIfPossible();
        this.moveForwards();
        if (this.checkCollisions()) {
            this.moveBackwards();
            return;
        }
    }
    
    eat() {
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[0].length; j++) {
                if (
                    map[i][j] == 2 &&
                    this.getMapX() == j &&
                    this.getMapY() == i
                ) {
                    map[i][j] = 3;
                    score++;
                }
            }
        }
    }
  

    changeDirectionIfPossible() {
        if (this.direction == this.nextDirection) return;
        let tempDirection = this.direction;
        this.direction = this.nextDirection;
        this.moveForwards();
        if (this.checkCollisions()) {
            this.moveBackwards();
            this.direction = tempDirection;
        } else {
            this.moveBackwards();
        }
    }
  
    moveBackwards() {
        switch (this.direction) {
            case DIRECTION_RIGHT: // Right
                this.x -= this.speed;
                break;
            case DIRECTION_UP: // Up
                this.y += this.speed;
                break;
            case DIRECTION_LEFT: // Left
                this.x += this.speed;
                break;
            case DIRECTION_BOTTOM: // Bottom
                this.y -= this.speed;
                break;
        }
    }

    moveForwards() {
        switch (this.direction) {
            case DIRECTION_RIGHT: // Right
                this.x += this.speed;
                break;
            case DIRECTION_UP: // Up
                this.y -= this.speed;
                break;
            case DIRECTION_LEFT: // Left
                this.x -= this.speed;
                break;
            case DIRECTION_BOTTOM: // Bottom
                this.y += this.speed;
                break;
        }
    }
    
    checkCollisions() {
        let isCollided = false;
        if (
            map[parseInt(this.y / oneBlockSize)][
                parseInt(this.x / oneBlockSize)
            ] == 1 ||
            map[parseInt(this.y / oneBlockSize + 0.9999)][
                parseInt(this.x / oneBlockSize)
            ] == 1 ||
            map[parseInt(this.y / oneBlockSize)][
                parseInt(this.x / oneBlockSize + 0.9999)
            ] == 1 ||
            map[parseInt(this.y / oneBlockSize + 0.9999)][
                parseInt(this.x / oneBlockSize + 0.9999)
            ] == 1
        ) {
            isCollided = true;
        }
        return isCollided;
    }
    
    checkGhostCollision(ghosts) {
        for (let ghost of ghosts) {
            if (/* condition to check collision between pacman and the ghost */) {
                return true;
            }
        }
        return false;
    }

    getMapX() {
        return parseInt(this.x / 20); // Assuming 20 is the size of one block
    }

    getMapY() {
        return parseInt(this.y / 20); // Assuming 20 is the size of one block
    }

    changeAnimation() {
        this.currentFrame = (this.currentFrame % this.frameCount) + 1;
    }

    draw(canvasContext) {
        // Ensure the context and image are available
        if (!canvasContext || !this.pacmanFrames) return;

        // Calculate the source x-coordinate based on the current frame
        const sx = (this.currentFrame - 1) * this.width;

        canvasContext.save();
        // Adjust the rotation based on Pacman's current direction
        canvasContext.translate(this.x + this.width / 2, this.y + this.height / 2);
        canvasContext.rotate((this.direction - 1) * Math.PI / 2); // Adjust rotation calculation as needed
        canvasContext.translate(-this.width / 2, -this.height / 2);

        // Draw the current frame of Pacman
        canvasContext.drawImage(
            this.pacmanFrames, // The image element
            sx, 0, this.width, this.height, // Source rectangle
            0, 0, this.width, this.height // Destination rectangle (relative to the translated/rotated context)
        );

        canvasContext.restore();
    }
}