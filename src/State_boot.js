//first state entered - init some settings and preload files needed on load screen
var State_boot = {
  init: function() {
    GameeWrapper.getInstance()._initGame();
    GameeWrapper.setBasicCallbacks();

    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    if (!Phaser.Device.desktop) {
      game.scale.forceOrientation(false, true);

      //TODO budeme delat nejake dodatecne veci pri zmene orientace?
      // game.scale.enterIncorrectOrientation.add(function() {
      //   game.paused = true;
      //   document.querySelector("canvas").style.display = "none";
      //   document.getElementById("wrongorientation").style.display = "block";
      // })
      // game.scale.leaveIncorrectOrientation.add(function() {
      //   game.paused = false;
      //   document.querySelector("canvas").style.display = "block";
      //   document.getElementById("wrongorientation").style.display = "none";
      // })
    }
  },

  afterInitTest: function(error, data) {
    console.log("THIS IS GAMEE INIT CALLBACK!!!!!!");
    if(error !== null)
        throw error;
  },

  preload: function() {
    game.load.image(KEY_SPRITE_CATHEAD, "assets/sprites/body/head.png");
    //load money box image - we will use it as a loading bar in next state
    game.load.image(KEY_UI_MONEYBOX, "assets/sprites/UI/money_box.png");
  },

  create: function() {
    //small hack which enables custom font usage
    game.add.text(0, 0, "hack", {font:"1px avengeance_mightiest_avenger", fill:"#FFFFFF"});
    game.state.start(KEY_STATE_PRELOAD);
  }
}
