const canvas = document.getElementById("game");
const playerScore = document.getElementById("player-score");
const compScore = document.getElementById("comp-score");
const startText = document.getElementById("start-text");
const audio = document.getElementById('audio');
audio.volume =.5;
const audio1 = document.getElementById('audio1');

let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;
let mouseClicked = false;
let paddleSpeed = 200;
let randomFill;




// Random color generator  -----------------------------------------------
function randomNum() {
    return Math.floor(Math.random() * 256);
} //returns random num between 0 and 255

function randomRGB() {
    var red = randomNum().toString();
    var green = randomNum().toString();
    var blue = randomNum().toString();
    randomFill = 'rgb' + '(' + red + ' ,' + green + ' ,' + blue + ')';
}

// Player events-----------------------------------------------------------------
canvas.addEventListener("keydown", keyDownHandler, false);
canvas.addEventListener("keyup", keyUpHandler, false);
canvas.addEventListener("mousedown", mouseDownHandler, false);
canvas.addEventListener("mouseup", mouseUpHandler, false);


function keyDownHandler(e) {
    if (e.key === "Up" || e.key === "ArrowUp") {
        upPressed = true;
    } else if (e.key === "Down" || e.key === "ArrowDown") {
        downPressed = true;
    } else if (e.key === "Right" || e.key === "RightDown") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "LeftDown") {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if (e.key === "Up" || e.key === "ArrowUp") {
        upPressed = false;
    } else if (e.key === "Down" || e.key === "ArrowDown") {
        downPressed = false;
    } else if (e.key === "Right" || e.key === "RightDown") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "LeftDown") {
        leftPressed = false;
    }
}
function mouseUpHandler(e) {
    if (e.button === "mousedown") {
        mouseClicked = true;
    }
}
function mouseDownHandler(e) {
    if (e.button === "mouseup") {
        mouseClicked = false;
    }
}
// this.bullet -----------------------------------------------------------------

class Vec {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    get len() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    set len(value) {
        const fact = value / this.len;
        this.x *= fact;
        this.y *= fact;
    }

}

class Rect {
    constructor(w, h) {
        this.pos = new Vec;
        this.size = new Vec(w, h);
    }
    get left() {
        return this.pos.x - this.size.x / 2;
    }
    get right() {
        return this.pos.x + this.size.x / 2;
    }
    get top() {
        return this.pos.y - this.size.y / 2;
    }
    get bottom() {
        return this.pos.y + this.size.y / 2;
    }
}
class Player extends Rect {
    constructor() {
        super(20, 100);
        this.score = 0;
    }
}
class Bullet extends Rect {
    constructor() {
        super(10, 10);
        this.vel = new Vec;
    }
}

class Pong {
    constructor(canvas) {
        this._canvas = canvas;
        this._context = canvas.getContext("2d");

        this.bullet = new Bullet;

        this.players = [
            new Player,
            new Player,
        ];
        let player1 = this.players[0]
        let player2 = this.players[1]


        player1.pos.x = 40
        player2.pos.x = this._canvas.width - 30
        this.players.forEach(player => {
            player.pos.y = this._canvas.height / 2
        });


        let lastTime;
        const callback = (millis) => {
            if (lastTime) {
                this.update((millis - lastTime) / 1000);
            }
            lastTime = millis;
            requestAnimationFrame(callback);
        };
        callback();
        this.reset();
    }
    collide(player, bullet) //Collision Detection
    {

        if (player.left < bullet.right && player.right > bullet.left &&
            player.top < bullet.bottom && player.bottom > bullet.top) {
            const len = bullet.vel.len;
            bullet.vel.x = -bullet.vel.x;
            bullet.vel.y += 300 * (Math.random() - .5);
            bullet.vel.len = len * 1.05;
            audio.play("Beep.wav");
        }
    }
    draw() {
        this._context.fillStyle = '#000d1e';
        this._context.fillRect(0, 0,
            this._canvas.width, this._canvas.height);

        this.drawRect(this.bullet);
        this.players.forEach(player => this.drawRect(player));
    }
    drawRect(rect) {
        this._context.fillStyle = '#f28c26';
        this._context.fillRect(rect.left, rect.top,
            this.bullet.size.x, rect.size.y);
    }
    reset() {
        this.bullet.pos.x = canvas.width / 2;
        this.bullet.pos.y = canvas.height / 2;
        this.bullet.vel.x = 0;
        this.bullet.vel.y = 0;


    }

    start() {
        if (this.bullet.vel.x === 0) {
            this.bullet.vel.x = 500 * (Math.random() > .5 ? 1 : -1);
            this.bullet.vel.y = 300 * (Math.random() * 2 - 1);
            this.bullet.vel.len = 500;
        }
    }

    update(dt) {

        this.bullet.pos.x += this.bullet.vel.x * dt;
        this.bullet.pos.y += this.bullet.vel.y * dt;

        if (this.bullet.left < 0 || this.bullet.right > this._canvas.width) {
            const playerId = this.bullet.vel.x < 0 | 0;
            this.bullet.vel.x = -this.bullet.vel.x;
            audio1.play("woowoo.wav");
            this.players[playerId].score++;
            playerScore.innerHTML = this.players[0].score;
            compScore.innerHTML = this.players[1].score;
            console.log(this.players[1].score)
            this.reset();

        }
        if (this.bullet.top < 0 || this.bullet.bottom > this._canvas.height) {
            this.bullet.vel.y = -this.bullet.vel.y;
        }
        this.draw();
        this.players.forEach(player => this.collide(player, this.bullet));

        //AI pos.y movement towards bullet
        this.players[1].pos.y = this.bullet.pos.y;
        
        randomRGB() 
        startText.style.color = randomFill;
    }
}
const pong = new Pong(canvas);



//Player controls
canvas.addEventListener("mousemove", event => {
    pong.players[0].pos.y = event.offsetY;
})
canvas.addEventListener("click", event => {
    pong.start();
    startText.innerHTML = ""
})
