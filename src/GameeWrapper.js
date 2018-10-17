var GAMEE_CALLBACK_START = "start";
var GAMEE_CALLBACK_MUTE = "mute";
var GAMEE_CALLBACK_UNMUTE = "unmute";
var GAMEE_CALLBACK_GAMEOVER = "gameOver";

//Gamee wrapper class - uses singleton pattern
var GameeWrapper = (function() {
  var instance;

  var createInstance = function() {
    var controller = null;
    var sound = false;
    var gameContext = null;
    var locale = null;
    var platform = null;
    var saveState = null;
    var initialized = false;

    return {
      _initGame: function() {
        //initial values - change if needed
        var controllerType = "FullScreen";
        var controllerOpts = {};
        var capabilities = ["saveState"];

        //TODO bind mute/unmute shit
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

        });
      },
      //Expose initialized property as public
      _isInitialized: function() { return initialized },

      _setGameReady: function() {
        gamee.gameReady();
      },

      _setGameeCallback: function(name, callback) {
        gamee.emitter.addEventListener(name, callback);
      },

      _updateScore: function(scoreVal) {
        gamee.updateScore(scoreVal);
      },

      _setGameOver: function() {
        gamee.gameOver();
      }
    }
  }

  return {
    getInstance: function() {
      if (!instance) {
        instance = createInstance();
      }

      return instance;
    }
  };
})();
