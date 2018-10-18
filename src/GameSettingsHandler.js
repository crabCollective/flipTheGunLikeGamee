//This class is used for managing data from save - it mostly contains static methods
class GameSettingsHandler {
   constructor(){}
}

GameSettingsHandler.BASIC_AMMO = 5;
GameSettingsHandler.AMMO_SCORE_CONSTRAINS = [
    [100, 6], // total score < 1000 = 5 ammo rounds, more = 6 ammo rounds
    [300, 7], //7 ammo rounds
    [500, 8], //8 ammo rounds
    [700, 9], //9 ammo rounds
    [1000, 10]  //10 ammo rounds
  ];

  //velocity score constrains
GameSettingsHandler.BASIC_VELOCITY = 1400;
GameSettingsHandler.VELOCITY_SCORE_CONSTRAINS = [
    [100, 1400],
    [300, 1500],
    [500, 1600],
    [700, 1700],
    [1000, 1800]
  ];

GameSettingsHandler.InitializeVars = function(totalScore) {
  var ammo = this.BASIC_AMMO;
  for (var i = this.AMMO_SCORE_CONSTRAINS.length-1; i >= 0; i--) {
    var constraint = this.AMMO_SCORE_CONSTRAINS[i];
    if (constraint[0] <= totalScore) {
      ammo = constraint[1];
      break;
    }
  }

  var vel = this.BASIC_VELOCITY;
  for (var i = this.VELOCITY_SCORE_CONSTRAINS.length-1; i >= 0; i--) {
    var constraint = this.VELOCITY_SCORE_CONSTRAINS[i];
    if (constraint[0] <= totalScore) {
      vel = constraint[1];
      break;
    }
  }

  console.log("HEJ!!!! YOUR TOTAL SCORE IS " + totalScore + ", SO THE CHOSEN AMMO AND VEL IS " + ammo + " ," + vel);
  return {
    ammunition: ammo,
    velocity: vel
  };
}
