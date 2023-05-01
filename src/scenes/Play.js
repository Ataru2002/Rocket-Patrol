class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('superspace', './assets/superspace.png')
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }
    create() {
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        this.starfield.setInteractive();
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);
        this.ship04 = new Spaceship(this, game.config.width + borderUISize*6 - 50, borderUISize*4 - 50, 'superspace', 0, 40).setOrigin(0, 0);
        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });
        // initialize score, precreate p2 for multiplayer
        this.p1Score = 0;
        this.p2Score = 0;
        this.timeLeft = timer / 1000;
        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }
        
        this.scoreLeft2; 
        console.log(gameMode);
        //Single Player
        if(gameMode == 0){
            this.scoreLeft1 = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, 'P1:' + this.p1Score, scoreConfig);
            scoreConfig.fixedWidth = 140;
            this.timerLabel = this.add.text(borderUISize + borderPadding + 450, borderUISize + borderPadding*2, 'Time: ' + this.timeLeft, scoreConfig);
        }
        //Multiplayer
        if(gameMode == 1){
            this.scoreLeft1 = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, 'P1:' + this.p1Score, scoreConfig);
            this.scoreLeft2 = this.add.text(borderUISize + borderPadding + 450, borderUISize + borderPadding*2, 'P2:' + this.p2Score, scoreConfig);   
            scoreConfig.fixedWidth = 140;
            this.timerLabel = this.add.text(borderUISize + borderPadding + 225, borderUISize + borderPadding*2, 'Time: ' + this.timeLeft, scoreConfig);
        }
        this.startTimer(1000000000);
        this.flag = true;
        input = this.input;
        input.on('pointerdown', this.clicked, this);
        input.on('pointerup', this.notClicked, this);
    }
        
    update() {
        cursorx = input.x;
        cursory = input.y;
        //Elapsed the Timer
        const elapsed = this.timerEvent.getElapsed()
        const remaining = Math.max(0, timer - elapsed)
        this.timeLeft = remaining / 1000;
        this.timerLabel.text = 'Time: ' + this.timeLeft.toFixed(0);
        //Check if time is over
        if((elapsed / 1000).toFixed(0) == 30 && this.flag){
            game.settings.spaceshipSpeed += 3;
            this.flag = false;
        }
        if(gameMode == 1 && turnPlayer == 1){
            this.scoreLeft1.text = 'Go:' + this.p1Score;
            this.scoreLeft2.text = 'P2:' + this.p2Score;
        }else if(gameMode == 1 && turnPlayer == 2){
            this.scoreLeft1.text = 'P1:' + this.p1Score;
            this.scoreLeft2.text = 'Go:' + this.p2Score;
        }
        if(this.timeLeft <= 0){
            let scoreConfig = {
                fontFamily: 'Courier',
                fontSize: '28px',
                backgroundColor: '#F3B141',
                color: '#843605',
                align: 'right',
                padding: {
                top: 5,
                bottom: 5,
                },
                fixedWidth: 0
            }
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← to Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            highscore = Math.max(this.p1Score)
            this.scene.restart();
            this.gameOver = false;
            timer = 60000;
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            highscore = Math.max(this.p1Score)
            this.scene.start("menuScene");
            this.gameOver = false;
            timer = 60000;
        }
        this.starfield.tilePositionX -= 4;
        if(!this.gameOver){
            this.p1Rocket.update();
            this.ship01.update();               // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();
        }
        // check collisions
        if (this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship04);
            turnPlayer = (turnPlayer == 1 ? 2 : 1);
        }
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);  
            turnPlayer = (turnPlayer == 1 ? 2 : 1); 
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
            turnPlayer = (turnPlayer == 1 ? 2 : 1);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
            turnPlayer = (turnPlayer == 1 ? 2 : 1);
        }
        
    }
    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
            return true;
        } else {
            return false;
        }
    }
    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();                         // reset ship position
            ship.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
        });       
        // score add and repaint
        if(ship.points == 40){
            console.log("change timer");
            timer += 5000;
        }
        if(gameMode == 1 && turnPlayer == 1) this.p1Score += ship.points;
        else if(gameMode == 1) this.p2Score += ship.points;
        if(gameMode == 0) this.p1Score += ship.points;
        this.scoreLeft1.text = 'P1:' + this.p1Score;       
        let determine = Math.floor(Math.random() * 5);
        console.log(determine);
        if(determine == 0) this.sound.play('sfx_explosion');
        if(determine == 1) this.sound.play('sfx_explosion1');
        if(determine == 2) this.sound.play('sfx_explosion2');
        if(determine == 3) this.sound.play('sfx_explosion3');
        if(determine == 4) this.sound.play('sfx_explosion4');
    }
    startTimer(duration = 60000){
        this.timerEvent = this.time.addEvent({
            delay: duration
        })
    }
    clicked(){
        mousedown = true;
    }
    notClicked(){
        mousedown = false;
    }
}