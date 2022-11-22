/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('myCanvas');
const ctx = canvas. getContext('2d');
CANVAS_WIDTH = canvas.width = 500;
CANVAS_HEIGHT = canvas.height = 1000;
const numberOfEnemies = 10;
const enemiesArray = [];

let gameFrame = 0;

class Enemy {
    constructor(){
        this.image = new Image();
        this.image.src = 'enemy1.png';
        //this.speed = Math.random() * 4 - 2; // Random number between -2 and 2
        this.spriteWidth = 293;
        this.spriteHeight = 155;
        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight / 2.5;
        this.x = Math.random() * (canvas.width - this.width); // spawn inside the rectangle horizontally
        this.y = Math.random() * (canvas.height - this.height); // spawn inside the rectangle vertically
        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 3 + 1);
    }
    update(){
        this.x += Math.random() * 15 - 7.5; // wiggle movement
        this.y += Math.random() * 10 - 5; // increase the wiggle increasing the range
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