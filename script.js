let config = {
  renderer: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

let game = new Phaser.Game(config);
let bird;
let hasLanded = false;
let hasBumped = false;
let isGameStarted = false;
let messageToPlayer;
let cursors;

function preload() {
  this.load.image("background", "assets/background.png");
  this.load.image("road", "assets/road.png");
  this.load.image("column", "assets/column.png");
  this.load.spritesheet("bird", "assets/bird.png", {
    frameWidth: 64,
    frameHeight: 96,
  });
}

function create() {
  // Background
  const background = this.add.image(0, 0, "background").setOrigin(0, 0);
  background.setDisplaySize(this.scale.width, this.scale.height);

  // Scale factor calculation for consistent resizing
  const scaleFactor = Math.min(this.scale.width / 800, this.scale.height / 600);

  // Bird setup
  bird = this.physics.add
    .sprite(0, 50 * scaleFactor, "bird")
    .setScale(scaleFactor);
  bird.setBounce(0.2);
  bird.setCollideWorldBounds(true);

  // Ground setup
  const road = this.physics.add.staticGroup();
  road
    .create(this.scale.width / 2, this.scale.height - 32 * scaleFactor, "road")
    .setScale(scaleFactor * 2)
    .refreshBody();

  // Column setups
  const topColumns = this.physics.add.staticGroup({
    key: "column",
    repeat: 1,
    setXY: { x: 200 * scaleFactor, y: 0, stepX: 300 * scaleFactor },
  });
  const bottomColumns = this.physics.add.staticGroup({
    key: "column",
    repeat: 1,
    setXY: {
      x: 350 * scaleFactor,
      y: 400 * scaleFactor,
      stepX: 300 * scaleFactor,
    },
  });

  // Physics collisions
  this.physics.add.collider(bird, road, () => (hasLanded = true));
  this.physics.add.collider(bird, topColumns, () => (hasBumped = true));
  this.physics.add.collider(bird, bottomColumns, () => (hasBumped = true));

  cursors = this.input.keyboard.createCursorKeys();

  // Instructions message
  messageToPlayer = this.add
    .text(
      this.scale.width * 0.5,
      this.scale.height * 0.9,
      "Instructions: Press space bar to start",
      {
        fontFamily: '"Comic Sans MS", Times, serif',
        fontSize: `${20 * scaleFactor}px`,
        color: "black",
        backgroundColor: "white",
      }
    )
    .setOrigin(0.5);
}

function update() {
  if (cursors.space.isDown && !isGameStarted) {
    isGameStarted = true;
    messageToPlayer.text =
      'Instructions: Press the "^" button to stay upright\nAvoid the columns and ground';
  }

  if (!isGameStarted) {
    bird.setVelocityY(-160);
  }

  if (cursors.up.isDown && !hasLanded && !hasBumped) {
    bird.setVelocityY(-160);
  }

  if (isGameStarted && (!hasLanded || !hasBumped)) {
    bird.body.velocity.x = 50;
  } else {
    bird.body.velocity.x = 0;
  }

  if (hasLanded || hasBumped) {
    messageToPlayer.text = "Oh no! You crashed!";
  }

  if (bird.x > this.scale.width * 0.9) {
    bird.setVelocityY(40);
    messageToPlayer.text = "Congrats! You won!";
  }
}

// Window resize listener
window.addEventListener("resize", () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});
