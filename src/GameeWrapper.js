var GAMEE_CALLBACK_START = "start";
var GAMEE_CALLBACK_MUTE = "mute";
var GAMEE_CALLBACK_UNMUTE = "unmute";
var GAMEE_CALLBACK_PAUSE = "pause";
var GAMEE_CALLBACK_RESUME = "resume";

//Gamee wrapper class - uses singleton pattern
var GameeWrapper = (function() {
  var instance;
  var basicCallbacksBinded = false;

  var createInstance = function() {
    var REQUEST_PLAYER_DATA = true;

    var controller = null;
    var sound = false;
    var gameContext = null;
    var locale = null;
    var platform = null;
    var saveState = null;
    var playerData = null;
    var initialized = false;
    var isReady = false;

    return {
      _initGame: function() {
        //initial values - change if needed
        var controllerType = "FullScreen";
        var controllerOpts = {};
        var capabilities = ["saveState", "playerData"];

        gamee.gameInit(controllerType, controllerOpts, capabilities, function(error, data) {
          console.log("INIT INITIALIZE CALLBACK!!!!");
          if (error !== null)
            throw error;

          initialized = true;
          controller = data.controller;
          sound = data.sound;

          saveState = data.saveState; // contains data you previously saved
          // var replayData = data.replayData;
          // var socialData = data.socialData;
          platform = data.platform; // contains the platform the player is using
          // it could be "android","ios","web","mobile_web"
          locale = data.locale; // contains the country and the language of the player
          // for example "en_US","es_MX","pt_BZ"...
          gameContext = data.gameContext; // contains the context of the game it could
          // be "normal" or "battle"
          // var initData = data.initData; // json received if a player access the game through
          // // a post made with the "gamee.share" function

          //request player data if needed
          //TODO co bych mel udelat
          // 1]zavolat gamee.requestPlayerData a vzit si z toho userID - bohuzel metoda pise Unknown method call
          // 2]pomoci tohoto UserID pak volat gamee.requestPlayerSaveState a aktualizovat hodnotu


          // if (REQUEST_PLAYER_DATA) {
          //   console.log("REQUESTING PL DATA");
          //   gamee.requestPlayerData(function(error, data) {
          //     console.log("CAALBACK");
          //     if (data && data.player) {
          //       console.log(data.player)
          //       // {name:"playerName", highScore:1000, avatar:url, userID: 123456, coins:1000}
          //     }
          //   });
          //}
        });
      },

      //Expose initialized property as public
      _isInitialized: function() {
        return initialized;
      },

      _isGameReady: function() {
        return isReady;
      },

      _getSaveState: function() {
        return saveState;
      },

      _setGameReady: function() {
        if (!isReady) {
          gamee.gameReady();
          isReady = true;
        }
      },

      _setGameeCallback: function(name, callback) {
        gamee.emitter.addEventListener(name, callback);
      },

      _removeGameeCallback: function(name, callback) {
        gamee.emitter.removeEventListener(name, callback);
      },

      _updateScore: function(scoreVal) {
        gamee.updateScore(scoreVal);
      },

      _setGameOver: function(dataToSave) {
        if (dataToSave)
          gamee.gameOver(null, null, dataToSave);
        else gamee.gameOver();
      },

      _saveGame: function(dataToSave) {
        //trochu debilni workaround
        saveState = dataToSave;
        gamee.gameSave(dataToSave);
      }
    }
  };

  //Mute and unmute callbacks, this should be called early
  var muteUnmuteCallbacks = function() {
    if (!basicCallbacksBinded) {
      console.log("MUTE UNMUTE CALLBACKS!!!!!");
      game.sound.muteOnPause = false;

      gamee.emitter.addEventListener(GAMEE_CALLBACK_MUTE, muteGame);
      gamee.emitter.addEventListener(GAMEE_CALLBACK_UNMUTE, unmuteGame);

      basicCallbacksBinded = true;
    } else console.log("CALLBACKS ALREADY BINDED!!!!!");
  };

  var muteGame = function(event) {
    console.log("CALLING MUTE!!!!!");
    game.sound.mute = true;

    event.detail.callback();
  };

  var unmuteGame = function(event) {
    console.log("CALLING UNMUTE!!!!!");
    game.sound.mute = false;

    event.detail.callback();
  };

  return {
    //expose mute callbacks funtion
    setBasicCallbacks: muteUnmuteCallbacks,

    getInstance: function() {
      if (!instance) {
        instance = createInstance();
      }

      return instance;
    }
  };
})();
