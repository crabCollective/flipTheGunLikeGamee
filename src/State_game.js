var gameOptions = {
  //int constants
  VAL_WORLDGRAVITY: 600, //GRAVITY - the higher number, the fastest gravity
  VAL_BOUNCESPEED_START: 1600,
  VAL_BOUNCESPEED_MAX: 1400,
  VAL_BOUNCESPEED_MED: 500,
  VAL_BOUNCESPEED_MIN: 200,
  VAL_TOPCAMOFFSET: 0.4, //proportions of camera taken from the top
  VAL_ANGULARVELOCITY: 500,
  VAL_MAX_AMMO: 10,

  VAL_GENERATEINTERVAL: 100, //generate something every 100px
  VAL_GENERATEAMMOPROB: 0.15
};

var DifficultyEnum = {
  EASY: 0,
  MEDIUM: 1,
  HARD: 2
};

var DirectionEnum = {
  LEFT: 0,
  RIGHT: 1
};

var State_game = {
  create: function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    //set BG color
    game.stage.backgroundColor = "#58D3F7";

    //add house sprite
    this.startHouse = game.add.sprite(game.world.centerX, game.world.height, KEY_SPRITE_HOUSE);
    this.startHouse.anchor.setTo(0.5, 1);
    this.startHouse.scale.setTo(0.6);
    //create cat //TODO make cat more polished
    this.cat = new Cat(this.startHouse.top);
    this.cat.y -= this.cat.height / 3;

    this.explosion = game.add.audio('explosion');

    //set camera follow - set camera bounds to null to allow move outside of world bounds
    this.offsetForCamMove = game.world.height * gameOptions.VAL_TOPCAMOFFSET;
    game.camera.bounds = null;
    game.camera.follow(this.cat, 0.5, 0.5);
    game.camera.deadzone = new Phaser.Rectangle(-game.world.width * 1.5,
      this.offsetForCamMove, 4 * game.world.width, 2 * game.world.height);
    this.lastCamPos = game.camera.y;
    this.lastCamPosGen = game.camera.y; //for item genertor

    //create layers
    this.sceneObjectsLayer = this.game.add.group();
    this.heroLayer = this.game.add.group();
    this.heroLayer.add(this.cat);

    //some vars definition
    this.gameeWrapper = GameeWrapper.getInstance();

    //this.currentAmmo = gameOptions.VAL_MAX_AMMO;
    this.firstTouch = true;
    this.catCopyOnTheScreen = false;
    this.catCopy = null;
    this.catDirection = null;
    this.score = 0;
    this.scoreUpdateCounter = 0;
    this.generator = new ObjectGenerator(DifficultyEnum.EASY);
    this.configPhysics();

    //SHOW FPS
    game.plugins.add(Phaser.Plugin.AdvancedTiming);
    this.gameeSetCallbacks();

    this.gameeWaitLoop = null;
    //Check if the game is initialized and if so, call game ready
    if (this.gameeWrapper._isGameReady()) {
      this.gameeInitStartVars();
      this.startGame();
    }
    else if (this.gameeWrapper._isInitialized()) {
      this.gameeSetGameReady();
      //otherwise run game loop and wait for gamee init
    } else this.gameeWaitLoop = game.time.events.loop(100, this.waitForGameeInit, this);
  },

  gameeSetGameReady: function() {
    this.gameeInitStartVars();
    this.gameeWrapper._setGameReady();
  },

  gameeSetCallbacks: function() {
    console.log("SETTING IMPORTANT CALLBACKS!!!!");
    this.startGameCb = this.startGame.bind(this);
    this.pauseGameCb = this.pauseGame.bind(this);
    this.resumeGameCb = this.resumeGame.bind(this);

    this.gameeWrapper._setGameeCallback(GAMEE_CALLBACK_START, this.startGameCb);
    this.gameeWrapper._setGameeCallback(GAMEE_CALLBACK_PAUSE, this.pauseGameCb);
    this.gameeWrapper._setGameeCallback(GAMEE_CALLBACK_RESUME, this.resumeGameCb);
  },

  gameeRemoveCallbacks: function() {
    console.log("REMOVING IMPORTANT CALLBACKS!!!!");
    this.gameeWrapper._removeGameeCallback(GAMEE_CALLBACK_START, this.startGameCb);
    this.gameeWrapper._removeGameeCallback(GAMEE_CALLBACK_PAUSE, this.pauseGameCb);
    this.gameeWrapper._removeGameeCallback(GAMEE_CALLBACK_RESUME, this.resumeGameCb);
  },

  gameeInitStartVars() {
    console.log("SETTING GAME READY!!!!");
    var savedData = this.gameeWrapper._getSaveState();
    if (savedData)
      this.overallScore = JSON.parse(savedData).totalScore;
    else {
      this.overallScore = 0;
    }
    var gameSetting = GameSettingsHandler.InitializeVars(this.overallScore);
    this.currentAmmo = gameSetting.ammunition;
    gameOptions.VAL_BOUNCESPEED_MAX = gameSetting.velocity;

    this.UI = new UIHandler();
  },

  update: function() {
    if (!this.firstTouch) {
      //check behaviour when being on the edge of camera
      this.checkCameraEdgesBehaviour();

      //did we go up?
      if (this.lastCamPos > game.camera.y) {
        this.scoreUpdateCounter++;
        //score
        this.score += (this.lastCamPos - game.camera.y)/10;
        //update score each 10th frame
        if (this.scoreUpdateCounter == 10) {
          this.gameeWrapper._updateScore(Math.round(this.score));
          this.scoreUpdateCounter = 0;
        }
        //this.gameeWrapper._updateScore(this.score);
        //TODO remove later
        //gamee.updateScore(this.score);

        //generate shit - //TODO make it more complicated
        if ((this.lastCamPosGen - game.camera.y) >= gameOptions.VAL_GENERATEINTERVAL) {
          var item;
          if (Math.random() <= gameOptions.VAL_GENERATEAMMOPROB)
            item = this.generator.generateAmmo();
          else item = this.generator.generateStar();
          if (item != null) {
            this.sceneObjectsLayer.add(item);
            //check and eventually kill items out of bounds
            this.sceneObjectsLayer.forEach(function(item) {
              if (item.y - item.height / 2 > game.camera.y + game.camera.height) {
                if (this.sceneObjectsLayer != undefined)
                  this.sceneObjectsLayer.remove(item);

                item.killItem();
              }
            });
          }
          this.lastCamPosGen = game.camera.y
        }
        this.lastCamPos = game.camera.y;
      }

      game.physics.arcade.overlap(this.heroLayer, this.sceneObjectsLayer, this.onObjectCollision, null, this);
      //JUMPING FROM LEFT TO RIGHT AND FROM RIGHT TO LEFT
      game.world.wrap(this.cat, 0, false, true, false);
    }
  },

  render: function() {
    // //CAMERA INFO
    // game.debug.cameraInfo(game.camera, 32, 32);
    // //BODY INFO
    // game.debug.bodyInfo(this.cat, 32, 220);
    //sprite INFO
    //game.debug.spriteInfo(this.cat, 32, 220);
    //SHOWS PHYSICS BODY OF CAT
    //game.debug.body(this.cat);

    //CAM OFFSET
    // console.log("X Cam offset: " + this.cat.cameraOffset.x);
    // console.log("Y Cam offset: " + this.cat.cameraOffset.y);
    //CAM DEADZONE
    //TODO tohle pak smazat, v app.js predelat Phaser.CANVAS na PHaser.AUTO
    // var zone = game.camera.deadzone;
    // if (zone != null) {
    //   game.context.fillStyle = 'rgba(255,0,0,0.6)';
    //   game.context.fillRect(zone.x, zone.y, zone.width, zone.height);
    // }

    // var catCenter = new Phaser.Point(this.cat.centerX, this.cat.centerY);
    // game.debug.geom(catCenter, 'rgba(255,0,0,1)');

    // var rect = new Phaser.Rectangle( this.cat.x,  this.cat.y, this.cat.width, this.cat.height ) ;
    // // Draw debug tools
    // game.debug.geom( rect, 'rgba(255,0,0,1)' , false) ;
    //game.debug.physicsGroup(this.cat);
  },

  //Called by GAMEE Start Callback
  startGame: function(event) {
    //console.log("HEEJ!!!! START CALLBACK!!!!");
    if (this.firstTouch)
      game.input.onDown.add(this.proccesClickInput, this);
    else {
      //console.log("RESTARTING GAMEEEEEEEEEEEEEEEEEEEEEEEEEE ");
      this.gameeRemoveCallbacks();

      //clean the field
      this.sceneObjectsLayer.destroy();
      delete this.generator;
      this.UI.destroyUIElements();
      delete this.UI;

      game.state.restart();
    }

    if (event)
      event.detail.callback();
  },

  endGame: function() {
    this.gameeWrapper._updateScore(Math.round(this.score));

    game.camera.follow(null);
    this.cat.alive = false;
    this.cat.destroy();

    var dataToSave = {
      totalScore: Math.round(this.overallScore + this.score)
    };

    this.gameeWrapper._saveGame(JSON.stringify(dataToSave));
    this.gameeWrapper._setGameOver();

    //TODO tady by to chtelo ulozene data znova ziskat, ale nefunguji nektere metody...
    //udelal jsem workaround v saveGame metode ve wrapperu
  },

  waitForGameeInit: function() {
    if (this.gameeWrapper._isInitialized()) {
      game.time.events.remove(this.gameeWaitLoop);
      this.gameeSetGameReady();
    }
  },

  proccesClickInput: function() {
    console.log("IS CAT ALIVE??? " + this.cat.alive);
    if (!this.cat.alive || (!this.firstTouch && game.paused))
      return;

    if (this.currentAmmo == 0) {
      game.camera.flash(0xff0000, 250);
      return;
    }

    //reset physical values
    this.cat.body.reset(this.cat.body.x, this.cat.body.y);
    var currentCatAngle = this.cat.angle - 90;
    if (this.firstTouch) {
      this.cat.body.allowGravity = true;
      //TODO nebude lip performovat velocityFromRotation?
      game.physics.arcade.velocityFromAngle(currentCatAngle, gameOptions.VAL_BOUNCESPEED_START, this.cat.body.velocity);
      this.cat.body.angularVelocity = this.getFirstRandomRotation();
      this.firstTouch = false;
    } else {
      //TODO nebude lip performovat velocityFromRotation?
      game.physics.arcade.velocityFromAngle(currentCatAngle, this.getBounceSpeed(currentCatAngle), this.cat.body.velocity);
      if (this.cat.body.velocity.x > 0)
        this.cat.body.angularVelocity = gameOptions.VAL_ANGULARVELOCITY;
      else this.cat.body.angularVelocity = -gameOptions.VAL_ANGULARVELOCITY;
    }

    this.explosion.play();
    game.camera.shake(0.02, 200);
    this.cat.showJetpackFire();
    this.UI.removeAmmo();
    this.currentAmmo--;
  },

  configPhysics: function() {
    game.physics.arcade.gravity.y = gameOptions.VAL_WORLDGRAVITY;
    this.cat.body.allowRotation = true;
    this.cat.body.gravity.y = 2 * gameOptions.VAL_WORLDGRAVITY;

    var wantedBodyWidth = this.cat.body.width * .7;
    var wantedBodyHeight = this.cat.body.height * 1.7;
    this.cat.body.setSize(wantedBodyWidth, wantedBodyHeight, 53, 0);
    this.cat.body.angularDrag = 300;
    this.cat.body.allowGravity = false;
  },

  onObjectCollision: function(cat, item) {
    if (item.itemType == GeneratedItemEnum.AMMO)
      this.addAmmo();

    item.killItem();
    this.sceneObjectsLayer.remove(item);
  },

  addAmmo: function() {
    this.currentAmmo = Math.min(this.currentAmmo + 1, gameOptions.VAL_MAX_AMMO);
    this.UI.addAmmo();
  },

  getFirstRandomRotation: function() {
    var randomNum = Math.random(0, 1);
    if (randomNum >= 0.5)
      return gameOptions.VAL_ANGULARVELOCITY;
    else return -gameOptions.VAL_ANGULARVELOCITY;
  },

  getBounceSpeed: function(currentAngle) {
    if (currentAngle >= -125 && currentAngle <= -55) {
      //console.log("MAX BOUNCE!!!!");
      return gameOptions.VAL_BOUNCESPEED_MAX;
    }

    if ((currentAngle >= -270 && currentAngle <= -215) ||
      (currentAngle >= 35 && currentAngle <= 90)) {
      //console.log("MIN BOUNCE!!!!");
      return gameOptions.VAL_BOUNCESPEED_MIN;
    }

    //console.log("med BOUNCE!!!!");
    return gameOptions.VAL_BOUNCESPEED_MED;
  },

  checkCameraEdgesBehaviour: function() {
    //check dead
    if (this.cat.alive && this.cat.y >= (game.camera.y + game.world.height)) {
      this.endGame();
      return;
    }

    //handle jumping from left to right a naopak
    // if (!this.catCopyOnTheScreen && this.cat.body.velocity.x < 0) {
    //   //check for left side collision
    //   if (this.cat.body.left <= 0) {
    //     console.log("LEFT EDGE!!!!!!!");
    //     this.catDirection = DirectionEnum.LEFT;
    //     this.createCatCopyOnTheScreen();
    //   }
    // } else if (!this.catCopyOnTheScreen && this.cat.body.velocity.x > 0) {
    //   //check for right side collision
    //   if (this.cat.body.right >= game.world.width) {
    //     console.log("RIGHT EDGE!!!!!!");
    //     this.catDirection = DirectionEnum.RIGHT;
    //     this.createCatCopyOnTheScreen();
    //   }
    // } else if (this.catCopyOnTheScreen) {
    //   this.updateCatCopyPosition();
    //   if (!this.cat.inCamera) {
    //     this.cat.x = this.catCopy.x;
    //     this.cat.y = this.catCopy.y;
    //     this.destroyCatCopy();
    //   }
    // }
  },

  pauseGame: function(event) {
    console.log("HEEEJ!!! PAUSE!!!");
    game.paused = true;
    event.detail.callback();
  },

  resumeGame: function(event) {
    console.log("HEEEJ!!! RESUME!!!");
    game.paused = false;
    event.detail.callback();
  },

  //CURRENTLY NOT IN USE
  //Use this if we will not use world wrap function...
  createCatCopyOnTheScreen: function() {
    var widthToAdd = (this.catDirection == DirectionEnum.LEFT ? game.world.width : -game.world.width); //TODO to by se taky nemuselo pocitat furt
    this.catCopy = game.add.sprite(this.cat.x + widthToAdd, this.cat.y, KEY_SPRITE_CATJETPACK);
    this.catCopy.anchor.setTo(0.5);
    this.catCopy.scale.setTo(0.7);
    this.catCopyOnTheScreen = true;
  },

  updateCatCopyPosition: function() {
    var widthToAdd = (this.catDirection == DirectionEnum.LEFT ? game.world.width : -game.world.width); //TODO to by se taky nemuselo pocitat furt
    this.catCopy.x = this.cat.x + widthToAdd;
    this.catCopy.y = this.cat.y;
    this.catCopy.angle = this.cat.angle;
  },

  destroyCatCopy: function() {
    this.catCopy.destroy();
    this.catCopyOnTheScreen = false;
  }
}
