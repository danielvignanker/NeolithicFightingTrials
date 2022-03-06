// main.js
Moralis.enableWeb3();
const serverUrl = "https://d5bkipaor0ou.usemoralis.com:2053/server";
const appId = "tUhFqack4lK7QiPPtWCwJiPCF6aiTyiUDZOGsZNH";
Moralis.start({ serverUrl, appId });



var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 250 },
        debug: false
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
var enemies;
var timeText;
var usraddr;
var imgUrl;

function launch(){
  let user = Moralis.User.current();
  usraddr = user.get("ethAddress")
  if(!user){
    console.log("Please Login with Metamask!")
  }
  else{
    console.log(user.get("ethAddress" )+ " " + "logged in")
    game = new Phaser.Game(config);
  }
  
}

function fixURL(url){
  if (url.startsWith("ipfs")){
    return "https://ipfs.moralis.io:2053/ipfs/"+url.split("ipfs://")[1];
  }
  else {
    return url + "?format=json";
  }
}
async function tryToGetNFT(){
  const options = {chain: 'rinkeby', address: usraddr}
  const nfts =  await Moralis.Web3.getNFTs(options);
  const nftCount =  await Moralis.Web3.getNFTsCount(options);
  console.log("Count val: " + nftCount)
  nfts.forEach(function(nft)  {
    let url = fixURL(nft.token_uri);
    fetch(url)
    .then(response => response.json())
    .then(data => {
      imgUrl = fixURL(data.image);
      console.log( "The img url " + imgUrl)
    });
  })
}
tryToGetNFT();
launch();

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// loading assets
function preload ()
{
  this.load.image('background', 'freetileset/png/BG.png');
  this.load.image('ground', 'freetileset/png/Tiles/2.png');
  this.load.image('player', 'https://ipfs.moralis.io:2053/ipfs/QmNZ2qKQvoCFnJSZgX7ubrYdKDNqLbyYtGKZTwZEYmjuDs/1.png');
  this.load.image('bomb', 'png/enemy.png');
  this.load.image('coin', 'png/nftToken.png');
}

// initial setup
function create ()
{
  this.add.image(400, 300, 'background')
  platforms = this.physics.add.staticGroup();
  platforms.create(600, 600, 'ground').setScale(0.4).refreshBody();
  platforms.create(650, 600, 'ground').setScale(0.4).refreshBody();
  platforms.create(500, 400, 'ground').setScale(0.4).refreshBody();
  platforms.create(450, 400, 'ground').setScale(0.4).refreshBody();
  platforms.create(700, 600, 'ground').setScale(0.4).refreshBody();
  platforms.create(200, 300, 'ground').setScale(0.4).refreshBody();
  platforms.create(250, 300, 'ground').setScale(0.4).refreshBody();
  platforms.create(0, 450, 'ground').setScale(0.4).refreshBody();
  platforms.create(50, 200, 'ground').setScale(0.4).refreshBody();
  platforms.create(700, 275, 'ground').setScale(0.4).refreshBody();
  platforms.create(700, 500, 'ground').setScale(0.4).refreshBody();
  platforms.create(750, 500, 'ground').setScale(0.4).refreshBody();
  platforms.create(800, 500, 'ground').setScale(0.4).refreshBody();
  platforms.create(750, 600, 'ground').setScale(0.4).refreshBody();
  platforms.create(800, 600, 'ground').setScale(0.4).refreshBody();
  platforms.create(550, 600, 'ground').setScale(0.4).refreshBody();
  platforms.create(500, 600, 'ground').setScale(0.4).refreshBody();
  platforms.create(450, 600, 'ground').setScale(0.4).refreshBody();
  platforms.create(400, 600, 'ground').setScale(0.4).refreshBody();
  platforms.create(450, 190, 'ground').setScale(0.4).refreshBody();
  platforms.create(400, 160, 'ground').setScale(0.4).refreshBody();
  platforms.create(350, 600, 'ground').setScale(0.4).refreshBody();
  platforms.create(300, 600, 'ground').setScale(0.4).refreshBody();
  platforms.create(250, 600, 'ground').setScale(0.4).refreshBody();
  platforms.create(200, 600, 'ground').setScale(0.4).refreshBody();
  platforms.create(150, 600, 'ground').setScale(0.4).refreshBody();
  platforms.create(100, 600, 'ground').setScale(0.4).refreshBody();
  platforms.create(50, 600, 'ground').setScale(0.4).refreshBody();
  platforms.create(0, 600, 'ground').setScale(0.4).refreshBody();

  player = this.physics.add.sprite(500, 450, 'player').setScale(0.1).refreshBody();
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  bombs = this.physics.add.group();
  this.physics.add.collider(bombs, platforms);
  this.physics.add.collider(player, bombs, hitBomb, null, this);
  function hitBomb (player, bomb)
  {
      this.physics.pause();

      player.setTint(0xff0000);
      if(score >= 100){
        let gameuser = Moralis.User.current();
        const options = {
          type: "erc20",
          amount: Moralis.Units.Token(score/100, "18"),
          receiver: gameuser.get("ethAddress"),
          contractAddress: "0x54Eb6530dEC3b552154479b03a0Ce524Cfd53AD0",
        };
        Moralis.transfer(options);
      }
      gameOver = true;
  }

this.physics.add.collider(player, platforms);
cursors = this.input.keyboard.createCursorKeys();

  coins = this.physics.add.group({
    key: 'coin',
    repeat: 9,
    setXY: { x: 75, y: 0, stepX: 75 }
  });

  coins.children.iterate(function (child) {

      child.setBounceY(Phaser.Math.FloatBetween(0.5, 1));

  });
this.physics.add.collider(coins, platforms);
this.physics.add.overlap(player, coins, collectCoin, null, this);
function collectCoin (player, coin)
{
    coin.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);

    if (coins.countActive(true) === 0)
    {
        coins.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        var bomb2 = bombs.create(x+75, 16, 'bomb');
        var bomb3 = bombs.create(x-75, 16, 'bomb').setScale(2).refreshBody();;
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb2.setBounce(1);
        bomb2.setCollideWorldBounds(true);
        bomb2.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb3.setBounce(1);
        bomb3.setCollideWorldBounds(true);
        bomb3.setVelocity(Phaser.Math.Between(-200, 200), 20);
        

    }
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
      player.setVelocityY(-300);
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
