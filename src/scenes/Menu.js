class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }
    
    preload() {
        this.load.image('Title', './assets/Title.png');
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_explosion1', './assets/explosion1.wav');
        this.load.audio('sfx_explosion2', './assets/explosion2.wav');
        this.load.audio('sfx_explosion3', './assets/explosion3.wav');
        this.load.audio('sfx_explosion4', './assets/explosion4.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
    }

    create() {
        let menuConfig = {
          fontFamily: 'Courier',
          fontSize: '28px',
          backgroundColor: '#000000',
          color: '#FFFF00',
          align: 'right',
          padding: {
          top: 5,
          bottom: 5,
          },
          fixedWidth: 0
        }
        this.title = this.add.sprite(game.config.width/2, game.config.height/2, 'Title');
        this.title.setScale(0.6);
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize*2 + borderPadding*2 + 50, 'Your highest score is ' + highscore, menuConfig).setOrigin(0.5);
        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

    }

    update() {

      if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
        // easy mode
        game.settings = {
          spaceshipSpeed: 3,
          gameTimer: 60000    
        }
        timer = 60000
        gameMode = 0
        this.sound.play('sfx_select');
        this.scene.start('playScene');    
      }
      if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
        // hard mode
        game.settings = {
          spaceshipSpeed: 4,
          gameTimer: 45000    
        }
        timer = 45000
        gameMode = 0
        this.sound.play('sfx_select');
        this.scene.start('playScene');    
      }
      if(Phaser.Input.Keyboard.JustDown(keyF)){
        game.settings = {
          spaceshipSpeed: 4,
          gameTimer: 60000    
        }
        timer = 60000
        gameMode = 1
        console.log(gameMode);
        this.sound.play('sfx_select');
        this.scene.start('playScene');  
      }
  }
}