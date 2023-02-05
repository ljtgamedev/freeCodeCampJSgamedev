export class UI {
    constructor(game){
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = 'Helvetica'; // u can use google fonts, linked them in html
    }
    draw(context){
        context.save();
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = 'white';
        context.shadowBlur = 0;
        context.font = this.fontSize + 'px ' + this.fontFamily;
        context.textAlign = 'left';
        context.fillStyle = this.game.fontColor;
        // score
        context.fillText('Score: ' + this.game.score, 20, 50);
        // game time
        context.font = this.fontSize * 0.8 + 'px ' + this.fontFamily;
        context.fillText('Time: ' + (this.game.time * 0.001).toFixed(1), 20, 80);
        // game over
        if(this.game.gameOver){
            context.textAlign = 'center';
            if(this.game.score < 2) {
                context.font = this.fontSize * 2 + 'px ' + this.fontFamily;
                context.fillText('Ups!', this.game.width * 0.5, this.game.height * 0.5);
                context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
                context.fillText('Not, better luck next time!', this.game.width * 0.5, this.game.height * 0.5 + 20);
            } else {
                context.font = this.fontSize * 2 + 'px ' + this.fontFamily;
                context.fillText('Boo-yah', this.game.width * 0.5, this.game.height * 0.5);
                context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
                context.fillText('What are creatures of the night afraid of? YOU!!!', this.game.width * 0.5, this.game.height * 0.5 + 20);
            }
        }
        context.restore();
    }
}