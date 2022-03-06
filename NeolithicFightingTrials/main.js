// main.js

const serverUrl = "https://cfnjsdgnsuzo.usemoralis.com:2053/server";
const appId = "FD9WOjjmqkQ7bpBYwEaKWGzQtcscyM9GKK5nSeGV";
Moralis.start({ serverUrl, appId });


var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 300 },
        debug: true
    }
  },
  scene: {
      preload: preload,
      create: create,
      update: update
  }
};

var game; 
var platforms;
var player;
var cursor;
var score = 0;
var scoreText;

function launch(){
  let user = Moralis.User.current();
  if(!user){
    console.log("Please Login with Metamask!")
  }
  else{
    console.log(user.get("ethAdress" + " " + "logged in"))
    game = new Phaser.Game(config);
  }
  
}

launch();

// loading assets
function preload ()
{
  this.load.image('background', 'freetileset/png/BG.png');
  this.load.image('ground', 'freetileset/png/Tiles/2.png');
  this.load.image('player', 'png/Idle (2).png');
}

// initial setup
function create ()
{
  this.add.image(400, 300, 'background')
  platforms = this.physics.add.staticGroup();
  platforms.create(600, 600, 'ground').setScale(0.4).refreshBody();
  platforms.create(650, 600, 'ground').setScale(0.4).refreshBody();
  platforms.create(700, 600, 'ground').setScale(0.4).refreshBody();
  platforms.create(750, 600, 'ground').setScale(0.4).refreshBody();
  platforms.create(800, 600, 'ground').setScale(0.4).refreshBody();
  platforms.create(400, 600, 'ground').setScale(0.4).refreshBody();
  platforms.create(350, 600, 'ground').setScale(0.4).refreshBody();
  platforms.create(300, 600, 'ground').setScale(0.4).refreshBody();
  platforms.create(200, 600, 'ground').setScale(0.4).refreshBody();
  platforms.create(100, 600, 'ground').setScale(0.4).refreshBody();
  platforms.create(50, 600, 'ground').setScale(0.4).refreshBody();
  platforms.create(0, 600, 'ground').setScale(0.4).refreshBody();

  player = this.physics.add.sprite(100, 450, 'player').setScale(0.2).refreshBody();
  player.setBounce(0.2);
  //player.setCollideWorldBounds(true);

  this.physics.add.collider(player, platforms);
  cursors = this.input.keyboard.createCursorKeys();

  stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });

  stars.children.iterate(function (child) {

      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

  });
  this.physics.add.collider(stars, platforms);
  this.physics.add.overlap(player, stars, collectStar, null, this);
  function collectStar (player, star)
  {
      star.disableBody(true, true);

      score += 10;
      scoreText.setText('Score: ' + score);
  }
  scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });


  
}

//60 fps
function update ()
{
  //Logic
  if (cursors.left.isDown)
  {
      player.setVelocityX(-160);

  }
  else if (cursors.right.isDown)
  {
      player.setVelocityX(160);

  }
  else
  {
      player.setVelocityX(0);

  }

  if (cursors.up.isDown && player.body.touching.down)
  {
      player.setVelocityY(-130);
  }
  
}

/** Add from here down */
async function login() {
  let user = Moralis.User.current();
  if (!user) {
   try {
      user = await Moralis.authenticate({ signingMessage: "Hello World!" })
      console.log(user)
      console.log(user.get('ethAddress'))
      location.reload();
   } catch(error) {
     console.log(error)
   }
  }
}

async function logOut() {
  await Moralis.User.logOut();
  console.log("logged out");
  location.reload();
}

document.getElementById("btn-login").onclick = login;
document.getElementById("btn-logout").onclick = logOut;