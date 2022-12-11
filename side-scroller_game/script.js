window.addEventListener('load', function() {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 720;
    let enemies = [];
    let score = 0;
    let gameOver = false;

    class InputHandler {
        constructor(){
            this.keys = []; // contains info about which arrow keys are pressed down right now
            window.addEventListener('keydown', e => {
                if ((e.key === 'ArrowDown' 
                        || e.key === 'ArrowUp' 
                        || e.key === 'ArrowLeft' 
                        || e.key === 'ArrowRight'
                    )
                    && this.keys.indexOf(e.key) === -1){ // If key is not in the array
                        this.keys.push(e.key);
                }
            });
            window.addEventListener('keyup', e => {
                if (e.key === 'ArrowDown'
                        || e.key === 'ArrowUp'
                        || e.key === 'ArrowLeft'
                        || e.key === 'ArrowRight'
                    ){ // When the button is released, release the key from the array
                        this.keys.splice(this.keys.indexOf(e.key), 1);
                }
            });
        }
    }

    class Player {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 200;
            this.height = 200;
            this.x = 0;
            this.y = this.gameHeight - this.height;
            this.image = playerImage; // using id defined in HTML, alternatively: document.getElementById('playerImage') or this.image = new Image(); this.image.src = '/images/imageName.png';
            this.frameX = 0;
            this.maxFrame = 8;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000/this.fps;
            this.frameY = 0;
            this.speed = 0;
            this.vy = 0;
            this.weight = 1;
        }
        update(input, deltaTime, enemies){
            // collision detection (using circles)
            enemies.forEach(enemy => {
                const dx = (enemy.x + enemy.width/2) - (this.x + this.width/2);
                const dy = (enemy.y + enemy.height/2) - (this.y + this.height/2);
                const distance = Math.sqrt(dx*dx + dy*dy);
                if (distance < enemy.width/2 + this.width/2){
                    gameOver = true;
                }
            })
            // sprite animation
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }
            // controls
            // esta parte la he modificado respecto al tutorial porque si se isan if/else y se pulsan varias teclas a la vez no va bien            
            if (input.keys.indexOf('ArrowRight') > -1) {
                this.speed = 5;
            } 
            if (input.keys.indexOf('ArrowLeft') > -1) {
                this.speed = -5;
            } 
            if (input.keys.indexOf('ArrowUp') > -1 && this.onGround()) { // only jump when on ground
                this.vy -= 32;
            } 
            if (input.keys.indexOf('ArrowRight') == -1 && input.keys.indexOf('ArrowLeft') == -1 && input.keys.indexOf('ArrowUp') == -1){
                this.speed = 0;
            }
            // horizontal movement
            this.x += this.speed;
            // check horizontal boundaries
            if (this.x < 0) this.x = 0;
            else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;
            // vertical movement
            this.y += this.vy;
            if (!this.onGround()){
                this.vy += this.weight;
                this.maxFrame = 6;
                this.frameY = 1; // set jump frame
            } else {
                this.vy = 0;
                this.maxFrame = 8;
                this.frameY = 0; // back to run frame
            }
            // check vertical boundaries
            if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height
        }
        draw(context){
            // collision hitbox
            context.strokeStyle = 'white';
            context.strokeRect(this.x, this.y, this.width, this.height);
            context.beginPath();
            context.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
            context.stroke();
            // end
            context.drawImage(this.image, this.frameX * this.width, this.frameY*this.height, this.width, this.height, this.x, this.y, this.width, this.height);
        }
        onGround(){
            return this.y >= this.gameHeight - this.height;
        }
    }

    class Background {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = document.getElementById('backgroundImage');
            this.x = 0;
            this.y = 0;
            this.width = 2400;
            this.height = 720;
            this.speed = 5;
        }
        draw(context){
            context.drawImage(this.image, this.x, this.y);
            context.drawImage(this.image, this.x + this.width - this.speed, this.y); // - this.speed fills the small gap between the 2 images to give the illusion of endless scrolling background
        }
        update(){
            this.x -= this.speed;
            if(this.x < 0 - this.width) this.x = 0;
        }
    }

    class Enemy {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 160;
            this.height = 119;
            this.image = document.getElementById('enemyImage');
            this.x = this.gameWidth;
            this.y = this.gameHeight - this.height;
            this.frameX = 0;
            this.maxFrame = 5;
            this.fps = 20; // speed to update sprites different from game
            this.frameTimer = 0;
            this.frameInterval = 1000/this.fps;
            this.speed = 8;
            this.markedForDeletion = false;
        }
        draw(context){
            // collision hitbox
            context.strokeStyle = 'white';
            context.strokeRect(this.x, this.y, this.width, this.height);
            context.beginPath();
            context.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
            context.stroke();
            // end of collision detection hitbox
            context.drawImage(this.image, this.frameX * this.width, 0 * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
        }
        update(deltaTime){
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }
            this.x -= this.speed;
            if (this.x < 0 - this.width) {
                
                this.markedForDeletion = true;
                score++;
            } 
        }
    }

    function handleEnemies(deltaTime) {
        if (enemyTimer > enemyInterval + randomEnemyInterval) { // ensure time events are consistent across different machines
            enemies.push(new Enemy(canvas.width, canvas.height));
            randomEnemyInterval = Math.random() * 1000 + 500;
            enemyTimer = 0;
        } else {
            enemyTimer += deltaTime;
        }
        enemies.forEach(enemy => {
            enemy.draw(ctx);
            enemy.update(deltaTime);
        })
        enemies = enemies.filter(enemy => !enemy.markedForDeletion);
    }

    function displayStatusText(context) {
        context.font = '40px Helvetica';
        context.fillStyle = 'black';
        context.fillText('Score: ' + score, 20, 50);
        context.fillStyle = 'white';
        context.fillText('Score: ' + score, 22, 52);
        if (gameOver){
            context.textAlign = 'center';
            context.fillStyle = 'black';
            context.fillText('GAME OVER, try again!', canvas.width/2, 200);
            context.fillStyle = 'white';
            context.fillText('GAME OVER, try again!', canvas.width/2 + 2, 200 + 2);
        }
    }

    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);
    const background = new Background(canvas.width, canvas.height);
    const enemy1 = new Enemy(canvas.width, canvas.height);

    let lastTime = 0; // holds the value of timestamp from the previous animation frame
    let enemyTimer = 0;
    let enemyInterval = 1000;
    let randomEnemyInterval = Math.random() * 1000 + 500;

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime; // how much time our computer needs to run one animation frame
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        background.draw(ctx);
        background.update();
        player.draw(ctx);
        player.update(input, deltaTime, enemies);
        handleEnemies(deltaTime);
        displayStatusText(ctx);
        if (!gameOver) requestAnimationFrame(animate); // endless animation loop, automatically generates a timestamp and passes it to the function it calls (animate)
    }
    animate(0);
});

