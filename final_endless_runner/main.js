import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';
import { FlyingEnemy, ClimbingEnemy, GroundEnemy } from './enemies.js';
import { UI } from './ui.js';

window.addEventListener('load', function(){ // load event waits until all source code and resources have been loaded
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;

    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.groundMargin = 80;
            this.speed = 0; // px per frame
            this.maxSpeed = 3;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this); // automatically applies de event listener in the InputHandler constructor
            this.ui = new UI(this);
            this.enemies = [];
            this.particles = [];
            this.collisions = [];
            this.maxParticles = 50;
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.debug = false;
            this.score = 0;
            this.fontColor = 'black';
            this.time = 0;
            this.maxTime = 4000;
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
            this.gameOver = false;
        }
        update(deltaTime){
            this.time += deltaTime;
            if (this.time > this.maxTime) {
                this.gameOver = true;
            }
            this.background.update();
            this.player.update(this.input.keys, deltaTime);
            // handle enemies
            if (this.enemyTimer > this.enemyInterval) {
                this.enemyTimer = 0;
                this.addEnemy();
            } else {
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
                if(enemy.markedForDeletion) this.enemies.splice(this.enemies.indexOf(enemy), 1);
            });
            // handle particles
            this.particles.forEach((particle, index) => {
                particle.update();
                if (particle.markedForDeletion) this.particles.splice(index, 1);
            });
            if(this.particles.length > this.maxParticles) {
                this.particles.length = this.maxParticles;
            }
            // handle collision sprites
            this.collisions.forEach((collision, index) => {
                collision.update(deltaTime);
                if (collision.markedForDeletion) this.collisions.splice(index, 1);
            });
        }
        draw(context){
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
                if (enemy.markedForDeletion) this.enemies.splice(this.enemies.indexOf(enemy), 1)
            });
            this.particles.forEach(particle => {
                particle.draw(context);
            });
            this.collisions.forEach(collision => {
                collision.draw(context);
            });
            this.ui.draw(context);
        }
        addEnemy(){
            this.enemies.push(new FlyingEnemy(this));
            if (this.speed > 0 && Math.random() < 0.5){
                this.enemies.push(new GroundEnemy(this)); // Solo si nos movemos, si no se acumulan al final
            } else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
        }
    }

    const game = new Game(canvas.width, canvas.height);
    console.log(game);
    let lastTime = 0;

    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        if (!game.gameOver) requestAnimationFrame(animate);
    }
    animate(0);
});