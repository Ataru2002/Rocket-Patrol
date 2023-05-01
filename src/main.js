/*
  Name: Nhan Nguyen
  Mod Title: Rocket Patrol II: Light's Revenge
  Approximate time: 10 hours
  Mods Chosen:
    + Track a high score that persists across scenes and display it in the UI (5)
    + Implement the speed increase that happens after 30 seconds in the original game (5)
    + Create 4 new explosion sound effects and randomize which one plays on impact (10)
    + Display the time remaining (in seconds) on the screen (10)
    + Create a new title screen (e.g., new artwork, typography, layout) (10)
    + Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (15)
    + Implement an alternating two-player mode (15), this mode depends on player alternating turns to play
    + Implement a new timing/scoring mechanism that adds time to the clock for successful hits (15), when you hit the new rocket you get 40 points + 5 seconds to the time
    + Implement mouse control for player movement and mouse click to fire (15)
    + Citations:
      - https://samplefocus.com/samples/8-bit-explosion (explosion sounds)
      - https://freesound.org/people/jalastram/packs/17801/ (explosion sounds)
*/

let config = {
  type: Phaser.AUTO,
  width: 640,
  height: 480,
  scene: [ Menu, Play]
}

let game = new Phaser.Game(config);
// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
let keyF, keyR, keyLEFT, keyRIGHT;
let timer = 60000;
let highscore = 0;
let input;
let cursorx;
let cursory;
let mousedown = false; 
let turnPlayer = 1;
let gameMode = 0;
