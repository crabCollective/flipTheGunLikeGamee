var UIfontStyle = {
  font: "25px avengeance_mightiest_avenger",
  fill: "#eeeeee",
  stroke: '#000000',
  strokeThickness: 3
};

UIHandler = function() {
  this.ammoSprites = [];
  this.ammoOffset = 20;

  this.initializeUI();
};
UIHandler.prototype = Object.create(Object.prototype);
UIHandler.prototype.constructor = UIHandler;

UIHandler.prototype.initializeUI = function() {
  var ammoBar = game.add.sprite(game.world.centerX, game.camera.y + game.world.height*.07, KEY_UI_AMMO_BAR);
  ammoBar.fixedToCamera = true;
  ammoBar.anchor.setTo(0.5);

  for (var i = 1; i <= State_game.currentAmmo; i++) {
    var ammo = game.add.sprite(ammoBar.left + i*this.ammoOffset, ammoBar.y, KEY_UI_AMMO);
    ammo.fixedToCamera = true;
    ammo.anchor.setTo(0.5);
    ammo.bringToTop();

    this.ammoSprites.push(ammo);
  }

  var scoreText = game.add.text(game.world.centerX,ammoBar.bottom+10,"SCORE:", UIfontStyle);
  scoreText.anchor.setTo(1, 0);
  scoreText.fixedToCamera = true;

  this.scoreValText = game.add.text(scoreText.right + 10,scoreText.y,"0", UIfontStyle);
  this.scoreValText.fixedToCamera = true;
};

UIHandler.prototype.setScore = function(scoreVal) {
  this.scoreValText.setText(scoreVal.toString());
};

UIHandler.prototype.removeAmmo = function() {
  this.ammoSprites[State_game.currentAmmo-1].kill();
};

UIHandler.prototype.addAmmo = function() {
  this.ammoSprites[State_game.currentAmmo-1].revive();
};
