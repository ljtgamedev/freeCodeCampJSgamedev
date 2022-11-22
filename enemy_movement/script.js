/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('myCanvas');
const ctx = canvas. getContext('2d');
CANVAS_WIDTH = canvas.width = 500;
CANVAS_HEIGHT = canvas.height = 1000;
const numberOfEnemies = 20;
const enemiesArray = [];

let gameFrame = 0;

class Enemy {
    constructor(){
        this.image = new Image();
        this.image.src = 'enemy4.png';
        this.speed = Math.random() * 4 + 1; // Random number between 5 and 1
        this.spriteWidth = 213;
        this.spriteHeight = 213;
        this.width = this.spriteWidth / 2;
        this.height = this.spriteHeight / 2;
        this.x = Math.random() * (canvas.width - this.width); // initial random X coordinate
        this.y = Math.random() * (canvas.height - this.height); // initial random Y coordinate
        this.newX = Math.random() * (canvas.width - this.width); // initial target X position
        this.newY = Math.random() * (canvas.height - this.height); // initial target Y position
        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 3 + 1);
        this.interval = Math.floor(Math.random() * 200 + 50); // interval of time until it gets a new target position to move
    }
    update(){
        if (gameFrame % this.interval === 0) { // every X frames of animation loop new target position
            this.newX = Math.random() * (canvas.width - this.width);
            this.newY = Math.random() * (canvas.height - this.height);
        }
        let dx = this.x - this.newX;
        let dy = this.y - this.newY;
        // move a 1/20th of the distance towards target position 
        this.x -= dx/20;
        this.y -= dy/20;
        //this.x = 0; 
        //this.y = 0;
        if (this.x + this.width < 0) this.x = canvas.width; // when they left the rectangle on the left they respawn on the rigth
        // animate sprites
        if (gameFrame % this.flapSpeed === 0){ //speed of animation
            this.frame > 4 ? this.frame = 0 : this.frame++
        }
    } 
    draw(){
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
};

for(let i = 0; i < numberOfEnemies; i++){
    enemiesArray.push(new Enemy());
}
console.log(enemiesArray)
function animate() {
    ctx.clearRect(0 , 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    enemiesArray.forEach(enemy => {
        enemy.update();
        enemy.draw();
    });
    gameFrame++;    
    requestAnimationFrame(animate);
}

animate();