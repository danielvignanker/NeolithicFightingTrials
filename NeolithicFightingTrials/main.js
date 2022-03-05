// main.js

const serverUrl = "https://cfnjsdgnsuzo.usemoralis.com:2053/server";
const appId = "FD9WOjjmqkQ7bpBYwEaKWGzQtcscyM9GKK5nSeGV";
Moralis.start({ serverUrl, appId });

/** Add from here down */
async function login() {
  let user = Moralis.User.current();
  if (!user) {
   try {
      user = await Moralis.authenticate({ signingMessage: "Hello World!" })
      console.log(user)
      console.log(user.get('ethAddress'))
   } catch(error) {
     console.log(error)
   }
  }
}

async function logOut() {
  await Moralis.User.logOut();
  console.log("logged out");
}

document.getElementById("btn-login").onclick = login;
document.getElementById("btn-logout").onclick = logOut;

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
      preload: preload,
      create: create,
      update: update
  }
};

var game = new Phaser.Game(config);

// loading assets
function preload ()
{
  this.load.image('background', 'freetileset/png/BG.png');
}

// initial setup
function create ()
{
  this.add.image(400, 300, 'background')
}

//60 fps
function update ()
{
  //Logic
  
  
}