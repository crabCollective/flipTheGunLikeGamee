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
  this.ammoBar = game.add.sprite(game.world.centerX, game.camera.y + game.world.height*.13, KEY_UI_AMMO_BAR);
  this.ammoBar.fixedToCamera = true;
  this.ammoBar.anchor.setTo(0.5);

  for (var i = 1; i <= gameOptions.VAL_MAX_AMMO; i++) {
    var ammo = game.add.sprite(this.ammoBar.left + i*this.ammoOffset, this.ammoBar.y, KEY_UI_AMMO);
    ammo.fixedToCamera = true;
    ammo.anchor.setTo(0.5);
    ammo.bringToTop();

    this.ammoSprites.push(ammo);

    if (i > State_game.currentAmmo)
      ammo.kill();
  }

  //Unused now
  // var scoreText = game.add.text(game.world.centerX,ammoBar.bottom+10,"SCORE:", UIfontStyle);
  // scoreText.anchor.setTo(1, 0);
  // scoreText.fixedToCamera = true;
  //
  // this.scoreValText = game.add.text(scoreText.right + 10,scoreText.y,"0", UIfontStyle);
  // this.scoreValText.fixedToCamera = true;
};

//unused now
// UIHandler.prototype.setScore = function(scoreVal) {
//   this.scoreValText.setText(scoreVal.toString());
// };

UIHandler.prototype.removeAmmo = function() {
  this.ammoSprites[State_game.currentAmmo-1].kill();
};

UIHandler.prototype.addAmmo = function() {
  this.ammoSprites[State_game.currentAmmo-1].revive();
};

UIHandler.prototype.setScore = function(scoreVal) {
  this.scoreValText.setText(scoreVal.toString());
};

UIHandler.prototype.destroyUIElements = function(scoreVal) {
  this.ammoBar.destroy();
  for (var i = this.ammoSprites.length-1; i >= 0; i--)
    this.ammoSprites[i].destroy();
};
