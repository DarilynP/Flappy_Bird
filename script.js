let config = {
  renderer: Phaser.AUTO,
  width: window.innerWidth, // Set to window width
  height: window.innerHeight, // Set to window height
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
    mode: Phaser.Scale.RESIZE, // Makes the game responsive
    autoCenter: Phaser.Scale.CENTER_BOTH, // Centers the game on the screen
  },
};

let game = new Phaser.Game(config);
let bird;
let hasLanded = false;
let cursors;
let hasBumped = false;

let isGameStarted = false;
let messageToPlayer;

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
  const background = this.add.image(0, 0, "background").setOrigin(0, 0);
  background.displayWidth = this.sys.canvas.width; // Stretch background to fit screen
  background.displayHeight = this.sys.canvas.height;

  const scaleFactor = this.sys.canvas.width / 800; // Calculate scale based on width

  const roads = this.physics.add.staticGroup();
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
  const road = roads
    .create(
      this.sys.canvas.width / 2,
      this.sys.canvas.height - 32 * scaleFactor,
      "road"
    )
    .setScale(scaleFactor * 2)
    .refreshBody();

  bird = this.physics.add
    .sprite(0, 50 * scaleFactor, "bird")
    .setScale(scaleFactor * 2);
  bird.setBounce(0.2);
  bird.setCollideWorldBounds(true);

  this.physics.add.overlap(bird, road, () => (hasLanded = true), null, this);
  this.physics.add.collider(bird, road);

  this.physics.add.overlap(
    bird,
    topColumns,
    () => (hasBumped = true),
    null,
    this
  );
  this.physics.add.overlap(
    bird,
    bottomColumns,
    () => (hasBumped = true),
    null,
    this
  );
  this.physics.add.collider(bird, topColumns);
  this.physics.add.collider(bird, bottomColumns);

  cursors = this.input.keyboard.createCursorKeys();

  messageToPlayer = this.add
    .text(
      this.sys.canvas.width * 0.5,
      this.sys.canvas.height * 0.9,
      "Instructions: Press space bar to start",
      {
        fontFamily: '"Comic Sans MS", Times, serif',
        fontSize: `${20 * scaleFactor}px`, // Scale text size
        color: "black",
        backgroundColor: "white",
      }
    )
    .setOrigin(0.5); // Center text

  Phaser.Display.Align.In.BottomCenter(
    messageToPlayer,
    background,
    0,
    50 * scaleFactor
  );
}

function update() {
  if (cursors.space.isDown && !isGameStarted) {
    isGameStarted = true;
    messageToPlayer.text =
      'Instructions: Press the "^" button to stay upright\nAnd don\'t hit the columns or ground';
  }

  if (!isGameStarted) {
    bird.setVelocityY(-160);
  }

  // Move bird upwards
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

  if (bird.x > this.sys.canvas.width * 0.9) {
    bird.setVelocityY(40);
    messageToPlayer.text = "Congrats! You won!";
  }
}
