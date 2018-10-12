//during this state loading screen is shown and all needed files are loaded
var State_preload = {
  preload: function() {
    //show loading images
    var catImg = game.add.image(game.world.centerX, game.world.centerY, KEY_SPRITE_CATHEAD);
    catImg.anchor.setTo(0.5);
    //TODO loading bar could be positioned more flexibly regarding the image above
    var preloadBar = game.add.image(game.world.centerX, game.world.centerY + 170, KEY_UI_MONEYBOX);
    preloadBar.anchor.setTo(0.5);
    game.load.setPreloadSprite(preloadBar);

    game.load.image(KEY_SPRITE_HOUSE, 'assets/sprites/bg/house.png');
    game.load.image(KEY_SPRITE_CATJETPACK, 'assets/sprites/UI/suit.png');
    game.load.image(KEY_SPRITE_STAR, 'assets/sprites/UI/star.png');
    game.load.image(KEY_SPRITE_AMMO, 'assets/sprites/energy/bullet.png');
    game.load.image(KEY_UI_AMMO_BAR, 'assets/sprites/energy/bar.png');
    game.load.image(KEY_UI_AMMO, 'assets/sprites/energy/small_energy.png');

    game.load.spritesheet(KEY_SPRITESHEET_JPFIRE, 'assets/sprites/jetpack_fire/jet_pack_sheet.png', 203, 359);
  },

  create: function() {
    this.state.start(KEY_STATE_GAME);
  }
}
