//our Main game reference var
var game;
//string constants
var KEY_STATE_BOOT = "Boot";
var KEY_STATE_PRELOAD = "Preload";
var KEY_STATE_GAME = "Game";

var KEY_SPRITE_CATHEAD = "catHead";
var KEY_SPRITE_CATJETPACK = "catJetpack";
var KEY_SPRITE_HOUSE = "house";
var KEY_SPRITE_STAR = "star";
var KEY_SPRITE_AMMO = "ammo";
var KEY_SPRITESHEET_JPFIRE = "jetpackFire";
var KEY_UI_MONEYBOX = "moneyBox";
var KEY_UI_AMMO_BAR = "ammoBar";
var KEY_UI_AMMO = "ammoUI";

var KEY_ANIM_JETPACKFIRE = "jpFire";
var MAX_WIDTH = 375;
var MAX_HEIGHT = 667;

//This is the game access point
window.onload = function() {
  //TODO tohle bude pak chtit na zarizenich s velkym displejem udelat lip
  game = new Phaser.Game(Math.min(window.innerWidth, MAX_WIDTH),
    Math.min(window.innerHeight, MAX_HEIGHT), Phaser.AUTO);

  game.state.add(KEY_STATE_BOOT, State_boot);
  game.state.add(KEY_STATE_PRELOAD, State_preload);
  game.state.add(KEY_STATE_GAME, State_game);

  game.state.start(KEY_STATE_BOOT);
}
