const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d"); // Context is what we draw on
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "#000000";
const paddle1Color = "#15eadc";
const paddle2Color = "#f94ff7";
const paddleBorder = "white";
const ballColor = "white";
const ballBorderColor = "grey";
const ballRadius = 12.5;
const paddleSpeed = 50;
let intervalID;
let ballSpeed = 1;
let ballX = gameWidth / 2; // places the ball in the center
let ballY = gameHeight / 2; // places the ball in the center
let ballXDirection = 0; // Will be the direction in which the ball is headed on the axis
let ballYDirection = 0; // Will be the direction in which the ball is headed on the axis
let player1Score = 0;
let player2Score = 0;
let paddle1 = {
  width: 25,
  height: 100,
  x: 0,
  y: 0,
};
let paddle2 = {
  width: 25,
  height: 100,
  x: gameWidth - 25, // minus the widht of our paddle
  y: gameHeight - 100, // minus the height of our paddle
};

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

gameStart();
function gameStart() {
  createBall();
  nextTick();
}
function nextTick() {
  intervalID = setTimeout(() => {
    clearBoard();
    drawPaddles();
    moveBall();
    drawBall(ballX, ballY);
    checkCollision();
    nextTick();
  }, 10);
}
function clearBoard() {
  ctx.fillStyle = boardBackground;
  ctx.fillRect(0, 0, gameWidth, gameHeight);
}
function drawPaddles() {
  ctx.strokeStyle = paddleBorder;

  ctx.fillStyle = paddle1Color;
  ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
  ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

  ctx.fillStyle = paddle2Color;
  ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
  ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
}
function createBall() {
  ballSpeed = 1;
  if (Math.round(Math.random()) == 1) {
    ballXDirection = 1;
  } else {
    ballXDirection = -1;
  }
  if (Math.round(Math.random()) == 1) {
    ballYDirection = 1;
  } else {
    ballYDirection = -1;
  }

  // When we create a new ball we'll set it to be right in the middle
  ballX = gameWidth / 2;
  ballY = gameHeight / 2;
  drawBall(ballX);
}
function moveBall() {
  ballX += ballSpeed * ballXDirection;
  ballY += ballSpeed * ballYDirection;
}
function drawBall(ballX, ballY) {
  ctx.fillStyle = ballColor;
  ctx.strokeStyle = ballBorderColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
}
function checkCollision() {
  // Bounce back the top -> change direction
  if (ballY <= 0 + ballRadius) {
    ballYDirection *= -1; // That will reverse the direction
  }
  // Bounce back the bottom -> change direction
  if (ballY >= gameHeight - ballRadius) {
    ballYDirection *= -1;
  }
  // Bounce back the left update the score, create a new ball
  if (ballX <= 0) {
    player2Score += 1; // The player 2 score will be updated
    updateScore();
    createBall();
    return;
  }
  // Bounce back the right update the score, create a new ball
  if (ballX >= gameHeight) {
    player1Score += 1; // The player 2 score will be updated
    updateScore();
    createBall();
    return;
  }

  // Bounce of the paddle 1 (right)
  if (ballX <= paddle1.x + paddle1.width + ballRadius) {
    if (ballY > paddle1.y && ballY < paddle1.y + paddle1.height) {
      ballX = paddle1.x + paddle1.width + ballRadius; //if the ball gets stuck
      ballXDirection *= -1;
      ballSpeed += 1;
    }
  }

  // Bounce of the paddle 2 (left)
  if (ballX >= paddle2.x - ballRadius) {
    if (ballY > paddle2.y && ballY < paddle2.y + paddle2.height) {
      ballX = paddle2.x - ballRadius; //if the ball gets stuck
      ballXDirection *= -1;
      ballSpeed += 1;
    }
  }
}
function changeDirection(event) {
  const keyPressed = event.keyCode;
  const paddle1Up = 87;
  const paddle1Down = 83;
  const paddle2Up = 38;
  const paddle2Down = 40;

  switch (keyPressed) {
    case paddle1Up:
      if (paddle1.y > 0) {
        paddle1.y -= paddleSpeed; // Think of paddle speed as distance how far we are going to move
      }
      break;
    case paddle1Down:
      if (paddle1.y < gameHeight - paddle1.height) {
        // We need to subtract from game height the height of our panel
        paddle1.y += paddleSpeed; // Think of paddle speed as distance how far we are going to move
      }
      break;
    case paddle2Up:
      if (paddle2.y > 0) {
        paddle2.y -= paddleSpeed; // Think of paddle speed as distance how far we are going to move
      }
      break;
    case paddle2Down:
      if (paddle2.y < gameHeight - paddle2.height) {
        // We need to subtract from game height the height of our panel
        paddle2.y += paddleSpeed; // Think of paddle speed as distance how far we are going to move
      }
      break;
  }
}
function updateScore() {
  scoreText.textContent = `${player1Score} : ${player2Score}`;
}
function resetGame() {
  player1Score = 0;
  player2Score = 0;

  // Places the paddle back to their original place
  paddle1 = {
    width: 25,
    height: 100,
    x: 0,
    y: 0,
  };
  paddle2 = {
    width: 25,
    height: 100,
    x: gameWidth - 25, // minus the widht of our paddle
    y: gameHeight - 100, // minus the height of our paddle
  };

  ballSpeed = 1;
  ballX = 0;
  ballY = 0;
  ballXDirection = 0;
  ballYDirection = 0;
  updateScore();
  clearInterval(intervalID);
  gameStart();
}
