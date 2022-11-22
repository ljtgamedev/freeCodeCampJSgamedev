const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');  
const CANVAS_WIDTH = canvas.width = 500;
const CANVAS_HEIGHT = canvas.height = 700;
const explosions = [];
// returns an object providing information about the size of an element and its position relative to the viewport
let canvasPosition = canvas.getBoundingClientRect();

class Explosion {
    constructor(x, y){
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.width = this.spriteWidth * 0.7; // multiply or divide by same number to keep aspect ratio
        this.height = this.spriteHeight * 0.7; // always better to multipy *0.5 instead of /2. Division is more performance expensive
        this.x = x; // coordinateX at the center instead of at the top
        this.y = y; // coordinateY at te center instead of at the left (yo habría centrado las coordenadas al dibujarlas en lugar de en el objeto pero bueno, el tutorial es asi)
        this.image = new Image();
        this.image.src = 'boom.png';
        this.frame = 0;
        this.timer = 0;
        this.angle = Math.random() * 6.2; // 6.2 radians aprox 360º
        this.sound = new Audio();
        this.sound.src = 'boom.wav'
    }
    update(){
        if(this.frame === 0) this.sound.play();
        this.timer++;
        if (this.timer % 10 === 0){
            this.frame++;
        }
    }
    draw(){
        // rotate randomly the sprite according to the randomly generated angle property of the explosion
        // this is how you rotate on canvas
        ctx.save(); // save state to make sure rotation affects only one draw call
        ctx.translate(this.x, this.y); // (0, 0) becomes (this.x, this.y), translate rotation centerpoint to object
        ctx.rotate(this.angle); // rotate entire canvas context
        // now to draw images coords will be (0, 0) - (width/2, height/2) to draw at the center
        ctx.drawImage(this.image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeight, 0 -this.width/2, 0 - this.height/2, this.width, this.height);
        ctx.restore(); // restore state
    }
}

window.addEventListener('click', function(e){
    createAnimation(e);
});

/*
window.addEventListener('mousemove', function(e){
    createAnimation(e);
});*/

function createAnimation(e) {
    // calculate position in canvas relative to the viewport
    // keep in mind if screen is resized, canvasPosition is not updated so the position will be wrong
    let positionX = e.x - canvasPosition.left;
    let positionY = e.y - canvasPosition.top;
    explosions.push(new Explosion(positionX, positionY));
}

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < explosions.length; i++){
        explosions[i].update();
        explosions[i].draw();
        // to remove the explosions that have stopped animating we could do objet pulling (advanced, not covered here)
        // el 5 esta hardcoded, lo ideal seria que el objeto contuviera un objeto sprite dentro que tuviera las propiedades para hacer el código reusable
        if (explosions[i].frame > 5){ // sprite has 5 frames, if last frame delete object from array
            explosions.splice(i, 1);
            i--; // number of elements has changed, the next element won't be at i++
        }
    }
    requestAnimationFrame(animate);
};
animate();