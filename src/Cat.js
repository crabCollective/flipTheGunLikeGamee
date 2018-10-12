//Class itself represents cat torso, other parts are children of the torso
//Other parts are accessible through properties
Cat = function(startPosY) {
    //torso
    Phaser.Sprite.call(this, game, game.world.centerX, startPosY, KEY_SPRITE_CATJETPACK);
    this.anchor.setTo(0.5);
    this.scale.setTo(0.5);
    //jetpack_fire
    this.jetpackFire = game.add.sprite(0, 0, KEY_SPRITESHEET_JPFIRE);
    this.jetpackFire.anchor.setTo(0.5,-0.1);
    this.jetpackFire.frame = 3;
    this.jetpackFire.animations.add(KEY_ANIM_JETPACKFIRE);
    this.jetpackFire.animations.currentAnim.onComplete.add(this.afterJetpackFire, this);

    //head
    this.catHead = game.add.sprite(0, 0, KEY_SPRITE_CATHEAD);
    this.catHead.anchor.setTo(0.5, 1.2);
    this.catHead.scale.setTo(0.6);
    this.addChild(this.catHead);
    this.addChild(this.jetpackFire);
    this.jetpackFire.visible = false;

    game.physics.arcade.enable(this, Phaser.Physics.ARCADE);
};

Cat.prototype = Object.create(Phaser.Sprite.prototype);
Cat.prototype.constructor = Cat;

Cat.prototype.showJetpackFire = function() {
  this.jetpackFire.visible = true;
  this.jetpackFire.animations.play(KEY_ANIM_JETPACKFIRE);
}

Cat.prototype.afterJetpackFire = function() {
  this.jetpackFire.visible = false;
}
