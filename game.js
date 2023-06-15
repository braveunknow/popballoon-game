var config = {
  type: Phaser.AUTO,
  width: 1100,
  height: 600,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 0 },
          debug: false
      }
  },
  scene: {
      preload: preload,
      create: create,
      update: update
  }
};

var game = new Phaser.Game(config);

var balloonImages = ['bln', 'bln1', 'bln2', 'bln3', 'bln4', 'bln5', 'bln6', 'bln7', 'bln8', 'bln9']; // Array of balloon image keys
var popSound;

function preload() {
  this.load.image('pump', 'graphics/pump.png');
  this.load.image('bg', 'graphics/bg.png');
  // this.load.image('bomb', 'assets/bomb.png');
  // this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });

  // Load balloon images
  for (var i = 0; i < balloonImages.length; i++) {
      this.load.image(balloonImages[i], 'graphics/' + balloonImages[i] + '.png');
  }

  // Load pop sound
  this.load.audio('pop', 'graphics/pop.wav');
}

function create() {

  let image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'bg');
  let scaleX = this.cameras.main.width / image.width;
  let scaleY = this.cameras.main.height / image.height;
  let scale = Math.max(scaleX, scaleY);
  image.setScale(scale).setScrollFactor(0);

  this.physics.world.setBounds(0, 0, config.width, config.height);

  pump = this.physics.add.sprite(1000, 500, 'pump');
  pump.setScale(0.25);
  pump.setDepth(1); // Set the depth of the pump sprite
  pump.setInteractive(); // Enable input events for the pump sprite

  balloonGroup = this.physics.add.group(); // Create a physics group to hold the balloons

  // Load pop sound
  popSound = this.sound.add('pop');

  pump.on('pointerdown', function () {
      // Create a new balloon sprite when the pump is clicked
      var balloonImageKey = Phaser.Utils.Array.GetRandom(balloonImages); // Randomly select a balloon image key
      var balloonX = 930; // X position of the balloon (same as pump)
      var balloonY = 500; // Y position of the balloon (same as pump)

      // Create the balloon sprite behind the pump and in front of the background
      var balloon = this.physics.add.sprite(balloonX, balloonY, balloonImageKey).setDepth(0);
      balloon.setScale(0); // Start with scale 0 to make it small

      // Adjust the origin of the scale animation to the bottom
      balloon.setOrigin(0.5, 1);

      // Set the final position of the balloon
      var finalX = balloon.x;
      var finalY = balloon.y;

      // Add scale animation
      this.tweens.add({
          targets: balloon,
          scale: 0.20, // Full size scale
          duration: 500, // Animation duration in milliseconds
          ease: 'Linear',
          onComplete: function () {
              balloon.setInteractive(); // Enable input events for the balloon sprite once it's fully grown
              balloon.setDepth(2); // Set the depth of the balloon after it's fully grown

              // Add movement to the balloon
              var possibleZValues = [25, 100];
              var Z = Phaser.Math.RND.pick(possibleZValues);
              
              
              var targetX, targetY;
              
              if (Z === 25) {
                  targetX = Z;
                  targetY = Phaser.Math.Between(0, 600);
              } else if (Z === 100) {
                  targetY = Z;
                  targetX = Phaser.Math.Between(0, 1100);
              }
              
              console.log('Target x:', targetX);
              console.log('Target y:', targetY);
              
              this.tweens.add({
                  targets: balloon,
                  x: targetX,
                  y: targetY,
                  duration: Phaser.Math.Between(2000, 4000),
                  ease: 'Linear',
                  repeat: -1,
                  yoyo: true
              });
              
            
          },
          callbackScope: this // Set the callback scope to the scene
      });

      balloon.on('pointerdown', function () {
          // Play the pop sound
          popSound.play();

          // Destroy the balloon when clicked
          balloon.destroy();
      });

      balloonGroup.add(balloon); // Add the balloon to the group
  }, this);

  // // Create world boundaries
  // this.physics.world.setBounds(0, 0, config.width, config.height);
}

function update() {
  // Check if balloons are out of bounds and remove them
  balloonGroup.getChildren().forEach(function (balloon) {
      if (balloon.y < -balloon.height || balloon.y > config.height) {
          balloon.destroy();
      }
  });

  // Add your game logic and update code here
}


