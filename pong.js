// select canvas

const cvs = document.getElementById("pong");
const ctx = cvs.getContext("2d");

// load sounds

let hit = new Audio();
let wall = new Audio();
let userScore = new Audio();
let comScore = new Audio()

hit.src = "sounds/hit.mp3";
wall.src = "sounds/wall.mp3";
comScore.src = "sounds/comScore.mp3";
userScore.src = "sounds/userScore.mp3";

// create the ball
const ball = {
    x : cvs.width/2,
    y : cvs.height/2,
    radius : 10,
    speed : 5,
    velocityX : 5,
    velocityY : 5,
    color : "WHITE"


}

// create the user paddle
const user = {
    x : 0,
    y : (cvs.height/2 - 100)/2,
    width : 10,
    height : 100,
    color : "WHITE",
    score : 0
}

const com = {
    x : cvs.width - 10,
    y : (cvs.height - 100)/2,
    width : 10,
    height : 100,
    color : "WHITE",
    score : 0
}

// create the net

const net = {
    x : (cvs.width - 2)/2,
    y : 0,
    width : 10,
    height : 10,
    color : "WHITE"
}


// draw rect function - rectangle, will be used to draw paddles

function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// draw Cirlcle

function drawCircle(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,false);
    ctx.closePath();
    ctx.fill();
}

// listening to the mouse
cvs.addEventListener("mousemove", getMousePos);

function getMousePos(evt){
    let rect = cvs.getBoundingClientRect();

    user.y = evt.clientY - rect.top -user.height/2;

}

// when COM or USER scores, we reset the ball

function resetBall(){
    ball.x = cvs.width/2;
    ball.y = cvs.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

// draw net
function drawNet(){
    for(let i = 0; i <= cvs.height; i += 15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// draw text

function drawText(text, x, y, color){
    ctx.fillStyle = "#FFF";
    ctx.font = "45px fantasy";
    ctx.fillText(text, x, y);

}

// collision detection
function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius
    b.right = b.x + b.radius;



    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;

}

// upadte : pos, mov, score,.....
function update(){

    if( ball.x - ball.radius < 0){
        com.score++;
        comScore.play();
        resetBall();
    }else if( ball.x + ball.radius > cvs.width){
        user.score++;
        userScore.play();
        resetBall();
    }

    // the ball has a velocity
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // computer plays for itself

    com.y += ((ball.y - (com.y + com.height/2)))*0.1;

    // when the ball collides with bottom and top walls we inverse the y velocity.
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > cvs.height){
        ball.velocityY = -ball.velocityY;
        wall.play();
    }

    // we check if the paddle hit the user or the com paddle
    let player = (ball.x + ball.radius < cvs.width/2) ? user : com;

    // if the ball htis a paddle
    if(collision(ball,player)){
        // play sound
        hit.play();
        // we check where the ball hits the paddle
        let collidePoint = (ball.y - (player.y + player.height/2));
        // normalize the value of collidePoint, we need to get numbers between -1 and 1.
        // -player.height/2 < collide Point < player.height/2
        collidePoint = collidePoint / (player.height/2);

        // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
        // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
        // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
        // Math.PI/4 = 45degrees
        let angleRad = (Math.PI/4) * collidePoint;
        
        // change the X and Y velocity direction
        let direction = (ball.x + ball.radius < cvs.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed + Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        // speed up the ball everytime a paddle hits it
        ball.speed += 0.1;
    }  
}



// render function, the function that does al the drawing
function render(){
    // clear the canvas
    drawRect(0, 0, cvs.width, cvs.height, "GREEN");

    // draw the net
    drawNet();

    // draw score
    drawText(user.score, cvs.width/4, cvs.height/5, "WHITE");
    drawText(com.score, 3*cvs.width/4, cvs.height/5, "WHITE");

    // draw the user and computer paddle
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);

    // draw the ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}





// game init 
function game(){
    update();
    render();
}

// loop
const framePerSecond = 50;
setInterval(game, 1000/framePerSecond);

