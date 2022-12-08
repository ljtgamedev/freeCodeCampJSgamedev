window.addEventListener('load', function(){ // 'load event waits until all source code and resources have been loaded'
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    const CANVAS_WIDTH = canvas.width = 500;
    const CANVAS_HEIGHT = canvas.height = 800;

    class Game {
        constructor(ctx, width, height){
            this.ctx = ctx;
            this.width = width;
            this.height = height;
            this.enemies = [];
            this.enemyInteval = 500;
            this.enemyTimer = 0;
            console.log(this.enemies);
            this.enemyTypes = ['worm', 'ghost', 'spider'];
        }
        update(deltaTime){
            this.enemies = this.enemies.filter(object => !object.markedForDeletion)
            if (this.enemyTimer > this.enemyInteval){
                this.#addNewEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(object => object.update(deltaTime));
        }
        draw(){
            this.enemies.forEach(object => object.draw(this.ctx));
        }
        #addNewEnemy(){ // private method
            const randomEnemy = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)]
            if (randomEnemy == 'worm')  this.enemies.push(new Worm(this)); // pass reference to the game which passes info about the context, width and height of the screen
            else if (randomEnemy == 'ghost') this.enemies.push(new Ghost(this));
            else if (randomEnemy == 'spider') this.enemies.push(new Spider(this));
            this.enemies.push(new Worm(this)) // pass reference to the game which passes info about the context, width and height of the screen
            // do not sort enemies every animation frame! only when a new enemy is added
            /*this.enemies.sort(function(a, b){ // sort in array for height so that the enemie with lower height are printed later and appear over the ones that are higher (lower on screen = closer)
                return a.y - b.y;
            })*/
        }
    }

    class Enemy {
        constructor(game){
            this.game = game;
            this.markedForDeletion = false;
            this.frameX = 0;
            this.maxFrame = 5;
            this.frameInterval = 100;
            this.frameTimer = 0;
        }
        update(deltaTime){
            this.x -= this.vx * deltaTime; // multiply for deltaTime to make speed independent from frame rate
            if (this.x < 0 - this.width) this.markedForDeletion = true; // check if enemy left screen from the left side
            if (this.frameTimer > this.frameInterval){
                if (this.frameX < this.maxFrame) this.frameX++;
                else this.frameX = 0;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }
        }
        draw(ctx){
            //ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        }
    }

    class Worm extends Enemy {
        constructor(game){
            super(game);
            this.spriteWidth = 229;
            this.spriteHeight = 171;
            this.width = this.spriteWidth/2; // make it smaller presering the aspect ratio
            this.height = this.spriteHeight/2;
            this.x = this.game.width;
            this.y = this.game.height - this.height;
            this.image = worm; // acces image using its ID from html, html ids are automatically added to JS
            this.vx = Math.random() * 0.1 + 0.1;
        }
    }

    class Ghost extends Enemy {
        constructor(game){
            super(game);
            this.spriteWidth = 261;
            this.spriteHeight = 209;
            this.width = this.spriteWidth/2; // make it smaller presering the aspect ratio
            this.height = this.spriteHeight/2;
            this.x = this.game.width;
            this.y = Math.random() * this.game.height * 0.6;
            this.image = ghost; // acces image using its ID from html, html ids are automatically added to JS
            this.vx = Math.random() * 0.2 + 0.1;
            this.angle = 0;
            this.curve = Math.random() * 3;
        }
        update(deltaTime){
            super.update(deltaTime);
            this.y += Math.sin(this.angle) * this.curve;
            this.angle += 0.04;
        }
        draw(ctx){
            //ctx.save(); //Another option
            ctx.globalAlpha = 0.7;
            super.draw(ctx);
            //ctx.restore(); //Another option
            ctx.globalAlpha = 1;
        }
    }

    class Spider extends Enemy {
        constructor(game){
            super(game);
            this.spriteWidth = 310;
            this.spriteHeight = 175;
            this.width = this.spriteWidth/2; // make it smaller presering the aspect ratio
            this.height = this.spriteHeight/2;
            this.x = Math.random() * this.game.width;
            this.y = 0 - this.height;
            this.image = spider; // acces image using its ID from html, html ids are automatically added to JS
            this.vx = 0;
            this.vy = Math.random() * 0.1 + 0.1;
            this.maxLength = Math.random() * game.height;
        }
        update(deltaTime){
            super.update(deltaTime); 
            if (this.y < 0 - this.height * 2) this.markedForDeletion = true;
            this.y += this.vy * deltaTime;
            if (this.y > this.maxLength) this.vy *= -1;
        }
        draw(ctx){
            ctx.beginPath();
            ctx.moveTo(this.x + this.width/2, 0);
            ctx.lineTo(this.x + this.width/2, this.y + 10);
            ctx.stroke();
            super.draw(ctx);

        }
    }

    const game = new Game(ctx, canvas.width, canvas.height);
    let lastTimeStamp = 1; // Only used for the very first loop
    function animate(timeStamp){ // declare what happens in our game frame by frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const deltaTime = timeStamp - lastTimeStamp;
        lastTimeStamp = timeStamp;
        game.update(deltaTime);
        game.draw();
        // 
        requestAnimationFrame(animate);
    }
    animate(0);
});