const canvas = document.getElementById('canvas');

const ctx = canvas.getContext('2d');
const scale = 10;
canvas.width = 700;
canvas.height = 700;
let totalScore = 0;
const keys = [];
const numberOfPokeballs = 20;
const pokeballs = [];

const player = {
  x: 200,
  y: 300,
  width: 643,
  height: 489,
  speed: 10,
};

const pokemon = new Image();
pokemon.src = 'pokemon.png';

const pokeball = new Image();
pokeball.src = 'pokeball.png';

window.addEventListener('keydown', function (e) {
  keys[e.keyCode] = true;
});

window.addEventListener('keyup', function (e) {
  delete keys[e.keyCode];
});

function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText('Score: ' + totalScore, 8, 20);
}

function movePlayer() {
  if (keys[38] && player.y > 0) {
    player.y -= player.speed;
  }
  if (keys[37] && player.x > 0) {
    player.x -= player.speed;
  }
  if (keys[40] && player.y < canvas.height - player.height / scale) {
    if (player.y < canvas.height) player.y += player.speed;
  }
  if (keys[39] && player.x < canvas.width - player.width / scale) {
    player.x += player.speed;
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

class Pokeball {
  constructor() {
    this.scale = 10;
    this.width = 500;
    this.height = 512;

    this.x = getRandomInt(0, canvas.height - this.height / this.scale);
    this.y = getRandomInt(0, canvas.width - this.width / this.scale);
  }

  drawPokeball() {
    ctx.drawImage(
      pokeball,
      0,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width / this.scale,
      this.height / this.scale
    );
  }
}

addNewPokeball();

function addNewPokeball() {
  while (pokeballs.length < numberOfPokeballs) {
    const ball = new Pokeball();
    let overlapping = false;
    for (j = 0; j < pokeballs.length; j++) {
      const temp = pokeballs;

      if (
        ball.x < temp[j].x + temp[j].width / temp[j].scale &&
        ball.x + ball.width / temp[j].scale > temp[j].x &&
        ball.y < temp[j].y + temp[j].height / temp[j].scale &&
        ball.y + ball.height / temp[j].scale > temp[j].y
      ) {
        overlapping = true;
        break;
      }
    }
    if (!overlapping) {
      pokeballs.push(ball);
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //Drawing Pokeballs
  for (i = 0; i < pokeballs.length; i++) {
    pokeballs[i].drawPokeball();
  }
  //Drawing Pokemon
  ctx.drawImage(
    pokemon,
    0,
    0,
    player.width,
    player.height,
    player.x,
    player.y,
    player.width / scale,
    player.height / scale
  );

  movePlayer();
  drawScore();
  // Checking Player collision with Pokeball
  for (i = 0; i < pokeballs.length; i++) {
    if (
      player.x < pokeballs[i].x + pokeballs[i].width / pokeballs[i].scale &&
      player.x + player.width / scale > pokeballs[i].x &&
      player.y < pokeballs[i].y + pokeballs[i].height / pokeballs[i].scale &&
      player.y + player.height / scale > pokeballs[i].y
    ) {
      pokeballs.splice(i, 1);
      setTimeout(() => addNewPokeball(), 1000);
      totalScore++;
    }
  }
}

setInterval(() => {
  animate();
}, 1000 / 20);
